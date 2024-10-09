import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/app/lib/database.types";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const { email, password, firstName, lastName } = await request.json();

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        data: {
          firstName,
          lastName,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      // Insert the user data into the 'users' table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id ?? '',
          email: data.user.email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
        });

      if (insertError) {
        console.error('Error inserting user data:', insertError);
        return NextResponse.json({ error: 'Error creating user profile' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Sign up successful' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
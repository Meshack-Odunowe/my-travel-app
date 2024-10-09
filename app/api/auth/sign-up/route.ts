import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@/app/lib/database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const firstName = String(formData.get("firstName"));
  const lastName = String(formData.get("lastName"));
  const password = String(formData.get("password"));

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
    // Update the user profile with firstName and lastName
    const { error: updateError } = await supabase
      .from('users')
      .update({
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
      })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
     
    }
  }

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}
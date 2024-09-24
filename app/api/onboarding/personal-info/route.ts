import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, phoneNumber, address } = await request.json();

    // Update the user's personal information
    const { error: updateError } = await supabase
      .from('users')
      .update({
        firstName,
        lastName,
        phone_number: phoneNumber,
        address,
      })
      .eq('email', session.user.email);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Personal info saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving personal info:', error);
    return NextResponse.json({ message: 'Error saving personal info' }, { status: 500 });
  }
}
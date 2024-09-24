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
    const { businessName, businessPhoneNumber, businessAddress, businessRegistrationNumber } = await request.json();

    // Create the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: businessName,
        phone_number: businessPhoneNumber,
        address: businessAddress,
        registration_number: businessRegistrationNumber,
      })
      .select()
      .single();

    if (companyError) {
      throw companyError;
    }

    // Create or update the user with the company ID and set role to COMPANY_ADMIN
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: session.user.id,
        email: session.user.email,
        company_id: company.id,
        role: 'COMPANY_ADMIN',
        firstName: '', 
        lastName: ''   
      });

    if (userError) {
      throw userError;
    }

    return NextResponse.json({ message: 'Business info saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving business info:', error);
    return NextResponse.json({ message: 'Error saving business info' }, { status: 500 });
  }
}
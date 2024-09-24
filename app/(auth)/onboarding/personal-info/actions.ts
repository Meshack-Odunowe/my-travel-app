'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

export async function savePersonalInfo(
  firstName: string,
  lastName: string,
  phoneNumber: string,
  address: string
) {
  const supabase = createServerActionClient<Database>({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('users')
    .update({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`, // Combining first and last name for the 'name' field
      phone_number: phoneNumber,
      address,
    })
    .eq('id', session.user.id);

  if (error) {
    throw error;
  }
}
// app/onboarding/personal-info/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/app/lib/database.types';
import PersonalInfoForm from './PersonalInfoForm';

export default async function PersonalInfoOnboarding() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  return <PersonalInfoForm />;
}
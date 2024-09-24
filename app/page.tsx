'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/app/lib/database.types';
import SignIn from './components/SignIn'
import Loading from './components/Loading';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is signed in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // User is not signed in, we'll show the sign-in page
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  if (loading) {
    return <Loading/>; // Or any loading component you prefer
  }

  // If we're here, the user is not signed in, so we show the sign-in page
  return <SignIn />;
}
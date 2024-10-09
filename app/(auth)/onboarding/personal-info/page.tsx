'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfoForm from './PersonalInfoForm';

export default function PersonalInfoOnboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/check-session');
        if (!response.ok) {
          throw new Error('Session check failed');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/signin');
      }
    };

    checkSession();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <PersonalInfoForm />;
}
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from "next/image";
import Loading from '@/app/components/Loading';
import { Database } from '@/app/lib/database.types';

export default function BusinessInfoOnboarding(): JSX.Element {
  const [businessName, setBusinessName] = useState('');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // Redirect to login if no session
      } else {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/business-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessPhoneNumber,
          businessAddress,
          businessRegistrationNumber,
        }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save business info');
      }
    } catch (error) {
      console.error('Error saving business info:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Business Information</h1>
          <Image width={450} height={450} alt="logo" src="/logo.svg" className="mb-6" />
          <p className="text-xl md:text-2xl font-light mb-8">
            Let&apos;s get your business set up <br /> to start tracking your vehicles
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="font-light flex flex-col gap-6 mb-8">
            <div className="flex flex-col">
              <label htmlFor="businessName" className="text-xl mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                aria-label="Enter your business name"
                type="text"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="businessPhoneNumber" className="text-xl mb-2">
                Business Phone Number
              </label>
              <input
                id="businessPhoneNumber"
                value={businessPhoneNumber}
                onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                aria-label="Enter your business phone number"
                type="tel"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="businessAddress" className="text-xl mb-2">
                Business Address
              </label>
              <input
                id="businessAddress"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                aria-label="Enter your business address"
                type="text"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="businessRegistrationNumber" className="text-xl mb-2">
                Business Registration Number
              </label>
              <input
                id="businessRegistrationNumber"
                value={businessRegistrationNumber}
                onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                aria-label="Enter your business registration number"
                type="text"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 text-white rounded-full py-3 px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Completing...' : 'Complete Onboarding'}
            </button>
          </form>
        </div>
        <div className="hidden lg:block">
          <Image width={600} height={700} alt="business" src="/buses.avif" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
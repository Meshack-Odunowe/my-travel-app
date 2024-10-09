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
        router.push('/login');
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <section className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
            <div className="mb-8">
              <Image width={120} height={40} alt="logo" src="/logo.svg" className="mb-6" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Business Information</h1>
              <p className="text-lg sm:text-xl font-light mb-6 text-gray-600">
                Let&apos;s get your business set up to start tracking your vehicles
              </p>
            </div>
            
            {error && <p className="text-red-500 mb-4 p-3 bg-red-100 rounded">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Phone Number
                </label>
                <input
                  id="businessPhoneNumber"
                  value={businessPhoneNumber}
                  onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                  type="tel"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  id="businessAddress"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Registration Number
                </label>
                <input
                  id="businessRegistrationNumber"
                  value={businessRegistrationNumber}
                  onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Completing...' : 'Complete Onboarding'}
              </button>
            </form>
          </section>
          <section className="hidden lg:block w-1/2 relative">
            <Image 
              src="/buses.avif" 
              alt="business"
              layout="fill"
              objectFit="cover"
              className="rounded-l-2xl"
            />
          </section>
        </div>
      </div>
    </main>
  );
}
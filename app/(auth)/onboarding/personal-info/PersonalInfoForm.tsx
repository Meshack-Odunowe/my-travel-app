'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function PersonalInfoForm() {
  const [merchantName, setMerchantName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/personal-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantName,
          email,
          phoneNumber,
          address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save personal info');
      }

      router.push('/onboarding/business-info');
    } catch (error) {
      console.error('Error saving personal info:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="p-8 lg:p-12">
            <Image width={120} height={40} alt="logo" src="/logo.svg" className="mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Personal Information</h1>
            <p className="text-xl font-light mb-8 text-gray-600">
              Let&apos;s get to know you better to provide you with the best experience
            </p>
            {error && <p className="text-red-500 mb-4 p-3 bg-red-100 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant Name
                </label>
                <input
                  id="merchantName"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 px-6 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Next'}
              </button>
            </form>
          </section>
          <section className="hidden lg:block relative">
            <Image 
              src="/bus.avif" 
              alt="onboarding" 
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
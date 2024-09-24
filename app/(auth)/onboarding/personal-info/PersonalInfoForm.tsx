'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function PersonalInfoForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
          firstName,
          lastName,
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
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Personal Information</h1>
          <Image width={450} height={450} alt="logo" src="/logo.svg" className="mb-6" />
          <p className="text-xl md:text-2xl font-light mb-8">
            Let&apos;s get to know you better <br /> to provide you with the best experience
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="font-light flex flex-col gap-6 mb-8">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-xl mb-2">
                First Name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="Enter your first name"
                type="text"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-xl mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-label="Enter your last name"
                type="text"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phoneNumber" className="text-xl mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-label="Enter your phone number"
                type="tel"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="address" className="text-xl mb-2">
                Address
              </label>
              <input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                aria-label="Enter your address"
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
              {isLoading ? 'Saving...' : 'Next'}
            </button>
          </form>
        </div>
        <div className="hidden lg:block">
          <Image width={600} height={700} alt="onboarding" src="/bus.avif" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
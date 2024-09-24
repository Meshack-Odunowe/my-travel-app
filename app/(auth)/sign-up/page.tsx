'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
// import type { Database } from "@/app/lib/database.types";

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email,
          password,
          firstName,
          lastName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      // Assuming successful signup redirects to personal info page
      router.push('/onboarding/personal-info');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error) {
        setError(error.message || 'Signup failed. Please try again.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Join Us</h1>
          <Image width={450} height={450} alt="logo" src="/logo.svg" className="mb-6" />
          <p className="text-xl md:text-2xl font-light mb-8">
            Start tracking your cars anywhere in the world <br /> using latest tracking
            technologies
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
              <label htmlFor="email" className="text-xl mb-2">
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Enter your email address"
                type="email"
                className="h-16 rounded-2xl border-gray-200 border px-4"
                required
              />
            </div>
            <div className="flex flex-col relative">
              <label htmlFor="password" className="text-xl mb-2">
                Password
              </label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Enter your password"
                type="password"
                className="h-16 rounded-2xl border border-gray-200 px-4"
                required
              />
              <div className="absolute top-1/2 right-4 transform translate-y-1/2">
                <Image width={24} height={24} alt="Show/Hide Password" src="/eye.svg" />
              </div>
            </div>
            <button
              type="submit" 
              className="bg-blue-500 text-white rounded-full py-3 px-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-light">
              Already have an account?{" "}
              <Link className="text-blue-400" href="/signin">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image width={600} height={700} alt="cars" src="/car.png" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
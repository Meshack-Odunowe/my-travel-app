'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import Loading from './Loading';

export default function SignUp(): JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if user is already signed in
  if (session) {
    router.push('/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        name,
        companyName,
        action: 'signup'
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/onboarding/personal-info');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn("google", { 
        callbackUrl: `${window.location.origin}/onboarding/personal-info`,
        redirect: false
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      setError("An error occurred with Google sign-up. Please try again.");
      console.error("Google sign-up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading/>;
  }

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
              <label htmlFor="name" className="text-xl mb-2">
                Full Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Enter your full name"
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
            <div className="flex flex-col">
              <label htmlFor="companyName" className="text-xl mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                aria-label="Enter your company name"
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
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center gap-2 bg-gray-100 rounded-full py-3 px-6 w-full max-w-sm"
              disabled={isLoading}
            >
              <Image
                width={24}
                height={24}
                src="/google.svg"
                alt="Google icon"
              />
              <span className="text-xl font-light">Continue with Google</span>
            </button>
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
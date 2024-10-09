'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SignOutProps {
  className?: string;
}

export default function SignOut({ className = '' }: SignOutProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/sign-in')
      } else {
        throw new Error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className='w-full lg:ml-[275px] lg:w-[calc(100%-275px)] flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
        <button
          aria-label="Open sign out dialog"
          onClick={() => setShowModal(true)}
          className={`
            flex items-center justify-center
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            py-3 px-6 rounded-lg
            transition-all duration-300 ease-in-out
            transform hover:scale-105 hover:shadow-lg
            ${className}
          `}
        >
          <Image
            src="/shut-down.svg"
            alt=""
            width={20}
            height={20}
            className="mr-3"
          />
          <span className="text-lg">Sign Out</span>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full mx-auto shadow-2xl"
              style={{
                animation: 'modalFadeIn 0.3s ease-out'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Sign Out</h2>
              <p className="mb-6 text-gray-600">Are you sure you want to sign out?</p>
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className={`
                    px-4 py-2 bg-red-500 text-white rounded-lg
                    hover:bg-red-600 transition-all duration-300
                    transform hover:scale-105
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing Out...
                    </span>
                  ) : (
                    'Confirm Sign Out'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
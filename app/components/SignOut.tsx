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
        // The API handles the redirection, so we don't need to use router.push here
        // Instead, we'll reload the page to reflect the changes
        window.location.reload();
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
      <div className='lg:ml-[275px] w-[calc(100%-275px)] flex items-center justify-center h-screen'>

      <button
        aria-label="Open sign out dialog"
        onClick={() => setShowModal(true)}
        className={`
          flex items-center justify-center
          bg-blue-500 hover:bg-blue-600
          text-white font-medium
          py-2 px-4 rounded-lg
          transition-colors duration-300
          ${className}
        `}
      >
        <Image
          src="/shut-down.svg"
          alt=""
          width={18}
          height={18}
          className="mr-2"
        />
        Sign Out
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className={`
                  px-4 py-2 bg-red-500 text-white rounded-lg
                  hover:bg-red-600 transition-colors duration-300
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <span className="flex items-center">
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
    </>
  );
}
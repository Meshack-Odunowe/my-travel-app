'use client';

import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading'
import Link from 'next/link';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  next_of_kin_name: string;
  next_of_kin_phone_number: string;
  next_of_kin_relationship: string;
  next_of_kin_address: string;
  next_of_kin_work_address: string;
}

export default function DriverProfiles() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('/api/drivers');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch driver profiles');
        }
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-fit ">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 sm:mb-10 text-center text-gray-800">
        Driver Profiles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 sm:gap-8">
        {drivers.map((driver) => (
          <div 
            key={driver.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3 sm:mr-4 flex items-center justify-center shadow-md">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {driver.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{driver.name}</h2>
                  <p className="text-sm sm:text-base text-gray-600">{driver.email}</p>
                </div>
              </div>
              <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                <p className="mb-1 sm:mb-2"><span className="font-medium">Phone:</span> {driver.phone_number}</p>
                <p className="mb-1 sm:mb-2"><span className="font-medium">Address:</span> {driver.address}</p>
                <p><span className="font-medium">Date of Birth:</span> {new Date(driver.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 text-sm sm:text-base">
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-800">Next of Kin</h3>
                <p className="mb-1"><span className="font-medium">Name:</span> {driver.next_of_kin_name}</p>
                <p className="mb-1"><span className="font-medium">Phone:</span> {driver.next_of_kin_phone_number}</p>
                <p className="mb-1"><span className="font-medium">Relationship:</span> {driver.next_of_kin_relationship}</p>
                <p className="mb-1"><span className="font-medium">Address:</span> {driver.next_of_kin_address}</p>
                <p><span className="font-medium">Work Address:</span> {driver.next_of_kin_work_address}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
              <Link 
                href={`/drivers/${driver.id}`} 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center text-sm sm:text-base"
              >
                View Full Profile
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 sm:mt-12 text-center">
        <Link 
          href="/drivers/create" 
          className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 inline-flex items-center shadow-lg text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Create New Driver Profile
        </Link>
      </div>
    </div>
  );
}
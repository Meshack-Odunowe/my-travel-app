'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from './Loading';
import Link from 'next/link';

interface Car {
  id: string;
  name: string;
  plate_number: string;
  model: string;
  color: string;
  engine_number: string;
  picture_url: string | null;
  drivers: { name: string };
}

const CarsList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError('Failed to load cars. Please try again later.');
        console.error('Error fetching cars:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();
  }, []);

  if (isLoading) return <div className="text-center py-8"><Loading/></div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (cars.length === 0) return <div className="text-center flex items-center justify-center h-screen flex-col gap-5 py-8 text-xl">No car records found. Create a driver profile and assign a car to the driver here . <br /><Link 
  href="/drivers/create" 
  className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 inline-flex items-center shadow-lg text-sm sm:text-base"
>
  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
  Create New Driver Profile
</Link> </div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div key={car.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          {car.picture_url ? (
            <Image
              src={car.picture_url}
              alt={car.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{car.name}</h2>
            <p className="text-gray-600 mb-1">Model: {car.model}</p>
            <p className="text-gray-600 mb-1">Plate: {car.plate_number}</p>
            <p className="text-gray-600 mb-1">Color: {car.color}</p>
            <p className="text-gray-600 mb-1">Engine: {car.engine_number}</p>
            <p className="text-gray-600">Driver: {car.drivers.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarsList;
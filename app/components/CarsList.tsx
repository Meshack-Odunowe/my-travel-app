// app/cars/CarsList.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

export default function CarsList() {
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

  if (isLoading) return <div>Loading cars...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
}
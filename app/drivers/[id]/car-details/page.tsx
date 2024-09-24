'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast';


interface CarDetails {
  name: string;
  plate_number: string;
  model: string;
  year: number;
  engine_number: string;
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  const [carDetails, setCarDetails] = useState<CarDetails>({
    name: '',
    plate_number: '',
    model: '',
    year: new Date().getFullYear(),
    engine_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/drivers/${params.id}/car`);
        if (response.ok) {
          const data = await response.json();
          setCarDetails(data);
        }
      } catch (err) {
        console.error('Failed to fetch car details:', err);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarDetails(prev => ({ 
      ...prev, 
      [name]: name === 'year' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/drivers/${params.id}/car`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to save car details');
      }

      setShowToast(true);
      setTimeout(() => router.push(`/drivers/${params.id}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Car Details for Driver</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Car Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={carDetails.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="plate_number" className="block mb-1">Plate Number</label>
          <input
            type="text"
            id="plate_number"
            name="plate_number"
            value={carDetails.plate_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="model" className="block mb-1">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            value={carDetails.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="year" className="block mb-1">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={carDetails.year}
            onChange={handleChange}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="engine_number" className="block mb-1">Engine Number</label>
          <input
            type="text"
            id="engine_number"
            name="engine_number"
            value={carDetails.engine_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Car Details'}
        </button>
      </form>
      {showToast && (
        <Toast
          message="Car details saved successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
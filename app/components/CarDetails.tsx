'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
export interface Car {

  id: string;

  name: string;

  plate_number: string;

  model: string | null;

  year: number | null;

  company_id: string;

  driver_id: string;

  engine_number: string;

  picture_url: string | null | undefined;
}


interface CarDetailsProps {
  car: Car;
  driverId: string;
}

export default function CarDetails({ car, driverId }: CarDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState(car);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/drivers/${driverId}/car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedCar),
      });

      if (!response.ok) throw new Error('Failed to update car details');

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating car details:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Car Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedCar.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          {/* Add similar input fields for plate_number, model, year, and engine_number */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{car.name}</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Plate Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{car.plate_number}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{car.model}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Year</dt>
              <dd className="mt-1 text-sm text-gray-900">{car.year}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Engine Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{car.engine_number}</dd>
            </div>
          </dl>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Car Details
          </button>
        </div>
      )}
    </div>
  );
}
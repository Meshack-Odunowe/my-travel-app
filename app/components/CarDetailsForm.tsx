'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from './Toast';

interface CarDetailsFormProps {
  driverId: string;
}

export default function CarDetailsForm({ driverId }: CarDetailsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    engineNumber: '',
    plateNumber: '',
    carPicture: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'carPicture' && files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('driverId', driverId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('engineNumber', formData.engineNumber);
      formDataToSend.append('plateNumber', formData.plateNumber);
      if (formData.carPicture) {
        formDataToSend.append('carPicture', formData.carPicture);
      }

      const response = await fetch('/api/car-details', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create car details');
      }

      setShowToast(true);
      setTimeout(() => router.push('/drivers'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Car Details</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Car Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="color" className="block mb-1">Car Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="engineNumber" className="block mb-1">Engine Number</label>
          <input
            type="text"
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="plateNumber" className="block mb-1">Plate Number</label>
          <input
            type="text"
            id="plateNumber"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="carPicture" className="block mb-1">Upload Picture of Car</label>
          <input
            type="file"
            id="carPicture"
            name="carPicture"
            onChange={handleChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Submitting...' : 'Submit Car Details'}
        </button>
      </form>
      {showToast && (
        <Toast
          message="Car details submitted successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
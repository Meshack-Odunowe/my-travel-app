"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

interface FormData {
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  dateOfBirth: string;
  nextOfKinName: string;
  nextOfKinPhoneNumber: string;
  nextOfKinRelationship: string;
  nextOfKinAddress: string;
  nextOfKinWorkAddress: string;
  carName: string;
  carColor: string;
  engineNumber: string;
  plateNumber: string;
  carPicture: File | null;
}

export default function CreateDriverProfile() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    address: "",
    email: "",
    dateOfBirth: "",
    nextOfKinName: "",
    nextOfKinPhoneNumber: "",
    nextOfKinRelationship: "",
    nextOfKinAddress: "",
    nextOfKinWorkAddress: "",
    carName: "",
    carColor: "",
    engineNumber: "",
    plateNumber: "",
    carPicture: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files ? fileInput.files[0] : null
      }));
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });
  
      const response = await fetch("/api/createdriverprofile", {
        method: "POST",
        body: formDataToSend,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("A driver with this email already exists");
        }
        throw new Error(data.error || "Failed to create driver profile");
      }
  
      setShowToast(true);
      setFormData({
        name: "",
        phoneNumber: "",
        address: "",
        email: "",
        dateOfBirth: "",
        nextOfKinName: "",
        nextOfKinPhoneNumber: "",
        nextOfKinRelationship: "",
        nextOfKinAddress: "",
        nextOfKinWorkAddress: "",
        carName: "",
        carColor: "",
        engineNumber: "",
        plateNumber: "",
        carPicture: null,
      });
      setTimeout(() => router.push(`/drivers/${data.id}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 lg:ml-[275px] w-[calc(100%-275px)]">
      <h1 className="text-2xl font-bold mb-4">Create Driver Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Driver&apos;s Name
          </label>
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
          <label htmlFor="phoneNumber" className="block mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="address" className="block mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">
          Next of Kin Information
        </h2>
        <div>
          <label htmlFor="nextOfKinName" className="block mb-1">
            Name of Next of Kin
          </label>
          <input
            type="text"
            id="nextOfKinName"
            name="nextOfKinName"
            value={formData.nextOfKinName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="nextOfKinPhoneNumber" className="block mb-1">
            Phone Number of Next of Kin
          </label>
          <input
            type="tel"
            id="nextOfKinPhoneNumber"
            name="nextOfKinPhoneNumber"
            value={formData.nextOfKinPhoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="nextOfKinRelationship" className="block mb-1">
            Relationship with Next of Kin
          </label>
          <input
            type="text"
            id="nextOfKinRelationship"
            name="nextOfKinRelationship"
            value={formData.nextOfKinRelationship}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="nextOfKinAddress" className="block mb-1">
            Address of Next of Kin
          </label>
          <textarea
            id="nextOfKinAddress"
            name="nextOfKinAddress"
            value={formData.nextOfKinAddress}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="nextOfKinWorkAddress" className="block mb-1">
            Work Address of Next of Kin
          </label>
          <textarea
            id="nextOfKinWorkAddress"
            name="nextOfKinWorkAddress"
            value={formData.nextOfKinWorkAddress}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Car Details</h2>
        <div>
          <label htmlFor="carName" className="block mb-1">Car Name</label>
          <input
            type="text"
            id="carName"
            name="carName"
            value={formData.carName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="carColor" className="block mb-1">Car Color</label>
          <input
            type="text"
            id="carColor"
            name="carColor"
            value={formData.carColor}
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
          <label htmlFor="carPicture" className="block mb-1">Car Picture</label>
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
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Driver Profile"}
        </button>
      </form>
      {showToast && (
        <Toast
          message="Driver profile created successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
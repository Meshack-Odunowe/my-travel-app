"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  carModel: string;
  carYear: string;
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
    carModel: "",
    carYear:"",
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
          if (key === 'carPicture' && value instanceof File) {
            formDataToSend.append(key, value, value.name);
          } else {
            formDataToSend.append(key, value.toString());
          }
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
        carModel: "",
        carYear:"",
        engineNumber: "",
        plateNumber: "",
        carPicture: null,
      });
      setTimeout(() => router.push(`/drivers`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl lg:ml-[275px] w-[calc(100%-275px)] mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-3xl font-bold mb-6">Create Driver Profile</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Driver&apos;s Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-1 font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block mb-1 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              Next of Kin Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nextOfKinName" className="block mb-1 font-medium">
                  Name of Next of Kin
                </label>
                <input
                  type="text"
                  id="nextOfKinName"
                  name="nextOfKinName"
                  value={formData.nextOfKinName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="nextOfKinPhoneNumber" className="block mb-1 font-medium">
                  Phone Number of Next of Kin
                </label>
                <input
                  type="tel"
                  id="nextOfKinPhoneNumber"
                  name="nextOfKinPhoneNumber"
                  value={formData.nextOfKinPhoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="nextOfKinRelationship" className="block mb-1 font-medium">
                Relationship with Next of Kin
              </label>
              <input
                type="text"
                id="nextOfKinRelationship"
                name="nextOfKinRelationship"
                value={formData.nextOfKinRelationship}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="nextOfKinAddress" className="block mb-1 font-medium">
                Address of Next of Kin
              </label>
              <textarea
                id="nextOfKinAddress"
                name="nextOfKinAddress"
                value={formData.nextOfKinAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="nextOfKinWorkAddress" className="block mb-1 font-medium">
                Work Address of Next of Kin
              </label>
              <textarea
                id="nextOfKinWorkAddress"
                name="nextOfKinWorkAddress"
                value={formData.nextOfKinWorkAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Car Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="carName" className="block mb-1 font-medium">Car Name</label>
                <input
                  type="text"
                  id="carName"
                  name="carName"
                  value={formData.carName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="carModel" className="block mb-1 font-medium">Car Model</label>
                <input
                  type="text"
                  id="carModel"
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="carColor" className="block mb-1 font-medium">Car Color</label>
                <input
                  type="text"
                  id="carColor"
                  name="carColor"
                  value={formData.carColor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="plateNumber" className="block mb-1 font-medium">Plate Number</label>
                <input
                  type="text"
                  id="plateNumber"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="engineNumber" className="block mb-1 font-medium">Engine Number</label>
              <input
                type="text"
                id="engineNumber"
                name="engineNumber"
                value={formData.engineNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
  <label htmlFor="carYear" className="block mb-1 font-medium">Car Year</label>
  <input
    type="number"
    id="carYear"
    name="carYear"
    value={formData.carYear}
    onChange={handleChange}
    required
    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
  />
</div>
            <div>
              <label htmlFor="carPicture" className="block mb-1 font-medium">Car Picture</label>
              <input
                type="file"
                id="carPicture"
                name="carPicture"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create Driver Profile"}
            </button>
          </form>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <div className="sticky top-8">
            <Image
              src="/carr.avif" 
              alt="Car Image"
              width={600}
              height={400}
              layout="responsive"
              className="rounded-lg shadow-lg"
            />
            <p className="mt-4 text-gray-600 text-center">
              Create a comprehensive driver profile for better management and tracking.
            </p>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message="Driver profile created successfully!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
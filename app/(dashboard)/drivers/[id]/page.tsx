"use client";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Database } from "@/app/lib/database.types";
import Image from "next/image";
import Loading from "@/app/components/Loading";

type Driver = Database["public"]["Tables"]["drivers"]["Row"] & {
  date_of_birth: string | null;
  address?: string;
};

type Car = Database["public"]["Tables"]["cars"]["Row"];

export default function DriverProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [driver, setDriver] = React.useState<Driver | null>(null);
  const [car, setCar] = React.useState<Car | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const fetchDriverAndCar = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .select(
          "id, name, email, phone_number, license_number, company_id, created_by, created_at, address, next_of_kin_name, next_of_kin_phone_number, next_of_kin_relationship, next_of_kin_address, latitude, longitude, date_of_birth"
        )
        .eq("id", params.id)
        .single<Driver>();

      if (driverError) throw new Error("Failed to fetch driver data");

      setDriver(driverData);

      const { data: carData, error: carError } = await supabase
        .from("cars")
        .select("*")
        .eq("driver_id", params.id)
        .single();

      if (!carError) {
        setCar(carData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [params.id, supabase]);

  React.useEffect(() => {
    fetchDriverAndCar();
  }, [fetchDriverAndCar]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" aria-live="polite" aria-busy="true">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500" role="alert">
        <p>{error}</p>
        <button 
          onClick={fetchDriverAndCar}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex justify-center items-center h-screen" role="alert">
        No driver found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full lg:ml-[275px] lg:w-[calc(100%-275px)]">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md text-sm sm:text-base"
        aria-label="Go back"
      >
        &larr; Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
            {driver.name}&apos;s Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <section aria-labelledby="personal-info">
              <h2 id="personal-info" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
                Personal Information
              </h2>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Email:</span> {driver.email}
              </p>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Phone:</span> {driver.phone_number}
              </p>
              {driver.address && (
                <p className="mb-2 text-sm sm:text-base">
                  <span className="font-medium">Address:</span> {driver.address}
                </p>
              )}
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Date of Birth:</span>{" "}
                {driver.date_of_birth
                  ? new Date(driver.date_of_birth).toLocaleDateString()
                  : "N/A"}
              </p>
            </section>

            <section aria-labelledby="next-of-kin">
              <h2 id="next-of-kin" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
                Next of Kin
              </h2>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Name:</span> {driver.next_of_kin_name}
              </p>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Phone:</span> {driver.next_of_kin_phone_number}
              </p>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Relationship:</span> {driver.next_of_kin_relationship}
              </p>
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-medium">Address:</span> {driver.next_of_kin_address}
              </p>
            </section>
          </div>

          {car && (
            <section aria-labelledby="car-info" className="mt-6 sm:mt-8">
              <h2 id="car-info" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
                Car Information
              </h2>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="mb-2 text-sm sm:text-base">
                  <span className="font-medium">Name:</span> {car.name}
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  <span className="font-medium">Plate Number:</span> {car.plate_number}
                </p>
                <p className="mb-2 text-sm sm:text-base">
                  <span className="font-medium">Engine Number:</span> {car.engine_number}
                </p>
                {car.picture_url && (
                  <div className="mt-3 sm:mt-4">
                    <Image
                      src={car.picture_url}
                      alt={`${car.name} car`}
                      width={300}
                      height={200}
                      className="rounded-lg w-full max-w-[300px] h-auto"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          <section aria-labelledby="location-info" className="mt-6 sm:mt-8">
            <h2 id="location-info" className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
              Location Information
            </h2>
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-medium">Latitude:</span> {driver.latitude}
            </p>
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-medium">Longitude:</span> {driver.longitude}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
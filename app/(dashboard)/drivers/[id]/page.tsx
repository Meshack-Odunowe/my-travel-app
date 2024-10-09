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

  React.useEffect(() => {
    async function fetchDriverAndCar() {
      setLoading(true);
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .select(
          "id, name, email, phone_number, license_number, company_id, created_by, created_at, address, next_of_kin_name, next_of_kin_phone_number, next_of_kin_relationship, next_of_kin_address, latitude, longitude, date_of_birth"
        )
        .eq("id", params.id)
        .single<Driver>();

      if (driverError) {
        setError("Failed to fetch driver data");
        setLoading(false);
        return;
      }

      setDriver(driverData);

      const { data: carData, error: carError } = await supabase
        .from("cars")
        .select("*")
        .eq("driver_id", params.id)
        .single();

      if (!carError) {
        setCar(carData);
      }

      setLoading(false);
    }

    fetchDriverAndCar();
  }, [params.id, supabase]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!driver)
    return (
      <div className="flex justify-center items-center h-screen">
        No driver found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 w-full lg:ml-[275px] lg:w-[calc(100%-275px)]">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md text-sm sm:text-base">
        &larr; Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
            {driver.name}&apos;s Profile
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
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
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
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
            </div>
          </div>

          {car && (
            <div className="mt-6 sm:mt-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
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
                      alt="Car"
                      width={300}
                      height={200}
                      className="rounded-lg w-full max-w-[300px] h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700">
              Location Information
            </h2>
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-medium">Latitude:</span> {driver.latitude}
            </p>
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-medium">Longitude:</span> {driver.longitude}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
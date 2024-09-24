'use client'
import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/app/lib/database.types';


type Driver = Database['public']['Tables']['drivers']['Row'] & {
  date_of_birth: string;
  address?: string; // Add address property if it exists in the schema
};

export default function DriverProfilePage({ params }: { params: { id: string } }) {
  const [driver, setDriver] = React.useState<Driver | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  React.useEffect(() => {
    async function fetchDriver() {
      setLoading(true);
      const { data, error } = await supabase
        .from('drivers')
        .select('id, name, email, phone_number, license_number, company_id, created_by, address, next_of_kin_name, next_of_kin_phone_number, next_of_kin_relationship, next_of_kin_address, next_of_kin_work_address, latitude, longitude, date_of_birth')
        .eq('id', params.id)
        .single();

      if (error) {
        setError('Failed to fetch driver data');
        setLoading(false);
        return;
      }

      setDriver(data);
      setLoading(false);
    }

    fetchDriver();
  }, [params.id, supabase]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!driver) return <div className="text-center mt-8">No driver found</div>;

  return (
    <div className='lg:ml-[275px] w-[calc(100%-275px)]'>
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Driver Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Email:</strong> {driver.email}</p>
          {driver.address && <p><strong>Address:</strong> {driver.address}</p>}
          <p><strong>Address:</strong> {driver.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(driver.date_of_birth).toLocaleDateString()}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Next of Kin Information</h2>
          <p><strong>Name:</strong> {driver.next_of_kin_name}</p>
          <p><strong>Phone:</strong> {driver.next_of_kin_phone_number}</p>
          <p><strong>Relationship:</strong> {driver.next_of_kin_relationship}</p>
          <p><strong>Address:</strong> {driver.next_of_kin_address}</p>
          <p><strong>Work Address:</strong> {driver.next_of_kin_work_address}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          <p><strong>Latitude:</strong> {driver.latitude}</p>
          <p><strong>Longitude:</strong> {driver.longitude}</p>
          {/* You could add a map component here to visualize the location */}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <p><strong>Created By:</strong> {driver.created_by}</p>
          <p><strong>Company ID:</strong> {driver.company_id}</p>
          <p><strong>Created At:</strong> {new Date(driver.created_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
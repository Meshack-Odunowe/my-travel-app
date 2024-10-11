import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';
import CarDetails from '@/app/components/CarDetails';

export const dynamic = 'force-dynamic';

async function getCarDetails(driverId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('driver_id', driverId)
    .single();

  if (error) {
    console.error('Error fetching car details:', error);
    throw new Error('Failed to fetch car details');
  }

  return data;
}

export default async function CarPage({ params }: { params: { id: string } }) {
  const carDetails = await getCarDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Car Details</h1>
      <CarDetails car={carDetails} driverId={params.id} />
    </div>
  );
}
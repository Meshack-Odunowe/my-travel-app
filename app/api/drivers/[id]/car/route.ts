import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('driver_id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching car details:', error);
    return NextResponse.json({ error: 'Failed to fetch car details' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const carDetails = await request.json();

    // First, get the company_id of the driver
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('company_id')
      .eq('id', params.id)
      .single();

    if (driverError) throw driverError;

    const { data, error } = await supabase
      .from('cars')
      .upsert({
        name: carDetails.name,
        plate_number: carDetails.plate_number,
        model: carDetails.model,
        year: carDetails.year,
        company_id: driverData.company_id,
        driver_id: params.id,
        engine_number: carDetails.engine_number,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving car details:', error);
    return NextResponse.json({ error: 'Failed to save car details' }, { status: 500 });
  }
}
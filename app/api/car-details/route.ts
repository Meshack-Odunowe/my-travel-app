import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../lib/database.types';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { driverId, name, color, engineNumber, plateNumber, carPictureUrl } = await req.json();

    // Validate input
    if ( !name || !color || !engineNumber || !plateNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }


    // Get the company_id for the driver
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('company_id')
      .eq('id', driverId)
      .single();

    if (driverError) {
      console.error('Error fetching driver:', driverError);
      return NextResponse.json({ error: 'Failed to fetch driver information' }, { status: 500 });
    }

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Insert car details
    const { data: car, error: carError } = await supabase
      .from('cars')
      .insert({
        name,
        plate_number: plateNumber,
        model: name, // Assuming model is the same as name, adjust if needed
        company_id: driver.company_id,
        driver_id: driverId,
        engine_number: engineNumber,
        color,
        picture_url: carPictureUrl || null,
      })
      .select()
      .single();

    if (carError) {
      console.error('Error creating car details:', carError);
      return NextResponse.json({ error: 'Failed to create car details' }, { status: 500 });
    }

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error in car details creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
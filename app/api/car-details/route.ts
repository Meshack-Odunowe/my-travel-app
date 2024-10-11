import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '../../lib/database.types';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const formData = await req.formData();
    const driverId = formData.get('driverId') as string;
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const engineNumber = formData.get('engineNumber') as string;
    const plateNumber = formData.get('plateNumber') as string;
    const carPicture = formData.get('carPicture') as File | null;

    // Validate input
    if (!driverId || !name || !color || !engineNumber || !plateNumber) {
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

    let carPictureUrl = null;

    // Upload image if provided
    if (carPicture) {
      const fileExt = carPicture.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, carPicture, {
          contentType: carPicture.type,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName);

      carPictureUrl = urlData.publicUrl;
    }

    // Insert car details
    const { data: car, error: carError } = await supabase
      .from('cars')
      .insert({
        name,
        plate_number: plateNumber,
        model: name, 
        company_id: driver.company_id,
        driver_id: driverId,
        engine_number: engineNumber,
        color,
        picture_url: carPictureUrl ?? undefined,
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
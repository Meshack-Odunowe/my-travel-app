import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Extract driver details
    // Get the admin user
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('id, role, company_id')
      .eq('id', session.user.id)
      .single();

    if (adminError || !admin || admin.role !== 'COMPANY_ADMIN' || !admin.company_id) {
      return NextResponse.json({ error: 'Unauthorized or invalid admin user' }, { status: 403 });
    }

    const driverData = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      phone_number: formData.get('phoneNumber') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      date_of_birth: formData.get('dateOfBirth') as string,
      next_of_kin_name: formData.get('nextOfKinName') as string,
      next_of_kin_phone_number: formData.get('nextOfKinPhoneNumber') as string,
      next_of_kin_relationship: formData.get('nextOfKinRelationship') as string,
      next_of_kin_address: formData.get('nextOfKinAddress') as string,
      next_of_kin_work_address: formData.get('nextOfKinWorkAddress') as string,
      license_number: formData.get('licenseNumber') as string,
      created_at: new Date().toISOString(),
      latitude: formData.get('latitude') as string,
      longitude: formData.get('longitude') as string,
      company_id: admin.company_id,
      created_by: admin.id,
    };

    // Extract car details
    const carData = {
      name: formData.get('carName') as string,
      // Remove color field as it doesn't exist in the database
      engine_number: formData.get('engineNumber') as string,
      plate_number: formData.get('plateNumber') as string,
    };

    if (adminError || !admin || admin.role !== 'COMPANY_ADMIN' || !admin.company_id) {
      return NextResponse.json({ error: 'Unauthorized or invalid admin user' }, { status: 403 });
    }

    // Check if driver with this email already exists
    const { data: existingDriver } = await supabase
      .from('drivers')
      .select('id')
      .eq('email', driverData.email)
      .single();

    if (existingDriver) {
      return NextResponse.json({ error: 'A driver with this email already exists' }, { status: 409 });
    }

    // Create the driver
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .insert({
        ...driverData,
        company_id: admin.company_id,
        created_by: admin.id,
      })
      .select()
      .single();

    if (driverError) {
      console.error('Error creating driver:', driverError);
      return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
    }

    // Create the car
    const { data: car, error: carError } = await supabase
      .from('cars')
      .insert({
        ...carData,
        company_id: admin.company_id,
        driver_id: driver.id,
      })
      .select()
      .single();

    if (carError) {
      console.error('Error creating car:', carError);
      return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
    }

    // Handle car picture upload
    const carPicture = formData.get('carPicture') as File;
    if (carPicture) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-pictures')
        .upload(`${car.id}.jpg`, carPicture, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Error uploading car picture:', uploadError);
      } else {
        // Update car record with picture URL
        const { data: publicUrlData } = supabase.storage
          .from('car-pictures')
          .getPublicUrl(`${car.id}.jpg`);

        await supabase
          .from('cars')
          .update({ picture_url: publicUrlData.publicUrl, engine_number: carData.engine_number })
          .eq('id', car.id);
      }
    }

    return NextResponse.json({ id: driver.id }, { status: 201 });
  } catch (error) {
    console.error('Error in driver profile creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
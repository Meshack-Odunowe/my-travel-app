// api/createdriverprofile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

const BUCKET_NAME = 'car-images';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Get the admin user
    const { data: admin, error: adminError } = await supabase
      .from('users')
      .select('id, role, company_id')
      .eq('id', session.user.id)
      .single();

    if (adminError || !admin || admin.role !== 'COMPANY_ADMIN' || !admin.company_id) {
      return NextResponse.json({ error: 'Unauthorized or invalid admin user' }, { status: 403 });
    }

    // Extract driver details
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
      created_at: new Date().toISOString(),
      company_id: admin.company_id,
      created_by: admin.id,
      license_number: formData.get('licenseNumber') as string,
      latitude: formData.get('latitude') as string,
      longitude: formData.get('longitude') as string,
    };

    // Extract car details
    const carData = {
      name: formData.get('carName') as string,
      model: formData.get('carModel') as string,
      color: formData.get('carColor') as string,
      engine_number: formData.get('engineNumber') as string,
      plate_number: formData.get('plateNumber') as string,
      year: parseInt(formData.get('carYear') as string, 10),
    };

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
      .insert(driverData)
      .select()
      .single();

    if (driverError) {
      console.error('Error creating driver:', driverError);
      return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
    }

    // Handle car picture upload
    const carPicture = formData.get('carPicture') as File;
    let pictureUrl = null;

    if (carPicture && admin.role === 'COMPANY_ADMIN') {
      const fileExt = carPicture.name.split('.').pop();
      const fileName = `${driver.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, carPicture, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading car picture:', uploadError);
        if (uploadError.message.includes('row-level security policy')) {
          console.error('RLS policy violation. Please check your storage bucket policies.');
        }
        // Continue without image URL
      } else {
        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        pictureUrl = publicUrlData.publicUrl;
      }
    }

    // Create the car with picture URL
    const { data: car, error: carError } = await supabase
      .from('cars')
      .insert({
        ...carData,
        company_id: admin.company_id,
        driver_id: driver.id,
        picture_url: pictureUrl,
      })
      .select()
      .single();

    if (carError) {
      console.error('Error creating car:', carError);
      return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
    }

    return NextResponse.json({ driver, car }, { status: 201 });
  } catch (error) {
    console.error('Error in driver profile creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
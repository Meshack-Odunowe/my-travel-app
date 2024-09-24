import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function POST(req: Request) {
  const { driverId, name, latitude, longitude } = await req.json();

  try {
    // Update the driver's location in your database
    const { error } = await supabase
      .from('drivers')
      .update({ 
        name: name,
        last_known_latitude: latitude,
        last_known_longitude: longitude,
        last_updated: new Date().toISOString()
      })
      .eq('id', driverId);

    if (error) throw error;

    // Register the driver with Google Maps Fleet Routing
    const fleetRoutingResponse = await axios.post(
      `https://mapsfleetrouting.googleapis.com/v1/fleets:createVehicle?key=${GOOGLE_MAPS_API_KEY}`,
      {
        vehicleId: driverId,
        name: name,
        startLocation: {
          latLng: {
            latitude: latitude,
            longitude: longitude
          }
        }
      }
    );

    return NextResponse.json({ 
      message: 'Driver registered successfully',
      fleetRoutingData: fleetRoutingResponse.data
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error registering driver:', error.response?.data || error.message);
      return NextResponse.json({ error: 'Failed to register driver' }, { status: 500 });
    } else {
      console.error('Error registering driver:', (error as Error).message);
      return NextResponse.json({ error: 'Failed to register driver' }, { status: 500 });
    }
  }
    console.error('Error registering driver:', Error.response?.data || Error.message);
    return NextResponse.json({ error: 'Failed to register driver' }, { status: 500 });
  }
}
import {  NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/app/lib/database.types';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    // Fetch drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('*');

    if (driversError) {
      console.error('Error fetching drivers:', driversError);
      return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
    }

    if (!drivers || drivers.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch cars associated with drivers
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .in('driver_id', drivers.map(driver => driver.id));

    if (carsError) {
      console.error('Error fetching cars:', carsError);
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }

    // Fetch vehicle locations from Google Maps Fleet Routing API
    let vehicleLocations = [];
    try {
      const fleetRoutingResponse = await axios.get(
        `https://mapsfleetrouting.googleapis.com/v1/fleets/vehicles?key=${GOOGLE_MAPS_API_KEY}`
      );
      vehicleLocations = fleetRoutingResponse.data.vehicles || [];
    } catch (fleetRoutingError) {
      console.error('Error fetching from Fleet Routing API:', fleetRoutingError);
      // Continue without location data if Fleet Routing API fails
    }

    // Combine driver, car, and location data
    const driversWithCarsAndLocations = drivers.map(driver => {
      const car = cars ? cars.find(car => car.driver_id === driver.id) : null;
      const vehicleLocation = vehicleLocations.find((v: { vehicleId: string }) => v.vehicleId === driver.id);

      return {
        ...driver,
        car,
        currentLocation: vehicleLocation ? {
          latitude: vehicleLocation.lastLocation.latLng.latitude,
          longitude: vehicleLocation.lastLocation.latLng.longitude,
          lastUpdated: vehicleLocation.lastLocation.time
        } : null
      };
    });

    return NextResponse.json(driversWithCarsAndLocations);
  } catch (error) {
    console.error('Error in driver profile fetching process:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}
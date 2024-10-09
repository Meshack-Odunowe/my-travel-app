'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Loading from './Loading';

interface Driver {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  email: string;
  phone_number: string;
}

const FleetEngineMap: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const supabase = createClientComponentClient();

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  // Lagos coordinates
  const center = useMemo(() => ({
    lat: 6.5244,
    lng: 3.3792,
  }), []);

  const carIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url: '/carr.png',
      scaledSize: new window.google.maps.Size(40, 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 20)
    };
  }, [isLoaded]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('id, name, email, phone_number, latitude, longitude');

        if (error) throw error;

        setDrivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    fetchDrivers();

    // Set up real-time subscription
    const channel = supabase
      .channel('drivers_location_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
        },
        (payload) => {
          setDrivers((currentDrivers) =>
            currentDrivers.map((driver) =>
              driver.id === payload.new.id ? { ...driver, ...payload.new } : driver
            )
          );
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
    >
      {drivers.map((driver) => (
        <Marker
          key={driver.id}
          position={{ lat: driver.latitude, lng: driver.longitude }}
          icon={carIcon || undefined}
          onClick={() => setSelectedDriver(driver)}
        />
      ))}
      {selectedDriver && (
        <InfoWindow
          position={{ lat: selectedDriver.latitude, lng: selectedDriver.longitude }}
          onCloseClick={() => setSelectedDriver(null)}
        >
          <div>
            <h2 className="text-lg font-bold">{selectedDriver.name}</h2>
            <p><strong>Email:</strong> {selectedDriver.email}</p>
            <p><strong>Phone:</strong> {selectedDriver.phone_number}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default FleetEngineMap;
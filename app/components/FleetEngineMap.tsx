'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Loading from './Loading';

interface Driver {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  email: string;
  phoneNumber: string;
}

const FleetEngineMap: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    // Fetch drivers
    fetch('/api/drivers')
      .then((res) => res.json())
      .then((data) => setDrivers(data));
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = useMemo(() => ({
    lat: drivers.reduce((sum, driver) => sum + driver.latitude, 0) / drivers.length || 0,
    lng: drivers.reduce((sum, driver) => sum + driver.longitude, 0) / drivers.length || 0,
  }), [drivers]);

  const carIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      url: '/carr.png',
      scaledSize: new window.google.maps.Size(40, 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 20)
    };
  }, [isLoaded]);

  if (!isLoaded) return <div><Loading/></div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
    >
      {isLoaded && carIcon && drivers.map((driver) => (
        <Marker
          key={driver.id}
          position={{ lat: driver.latitude, lng: driver.longitude }}
          icon={carIcon}
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
            <p><strong>Phone:</strong> {selectedDriver.phoneNumber}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default FleetEngineMap;
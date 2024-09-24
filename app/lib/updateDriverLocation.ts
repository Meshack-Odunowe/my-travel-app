export async function updateDriverLocation(driverId: string, latitude: number, longitude: number) {
  const response = await fetch('/api/update-driver-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ driverId, latitude, longitude }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update driver location');
  }

  return response.json();
}
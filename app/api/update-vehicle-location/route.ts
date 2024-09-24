import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function POST(req: Request) {
  const { driverId, latitude, longitude } = await req.json();

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();

  try {
    const response = await client.request({
      url: `https://fleetengine.googleapis.com/v1/providers/projects/${projectId}/vehicles/${driverId}:updateVehicle`,
      method: 'POST',
      data: {
        vehicleState: {
          location: {
            latitude: latitude,
            longitude: longitude
          },
          // Add other state properties as needed (e.g., speed, heading)
        },
        updateMask: 'vehicleState.location'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating vehicle location:', error);
    return NextResponse.json({ error: 'Failed to update vehicle location' }, { status: 500 });
  }
}
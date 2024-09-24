import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export async function POST(req: NextRequest) {
  const { driverId, latitude, longitude } = await req.json();

  try {
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();

    const url = `https://fleetengine.googleapis.com/v1/providers/projects/${projectId}/vehicles/${driverId}:updateVehicle`;
    const response = await client.request({
      url,
      method: 'POST',
      data: {
        vehicleState: {
          location: {
            latitude,
            longitude,
          },
        },
        updateMask: 'vehicleState.location',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json({ error: 'Failed to update driver location' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function POST(req: Request) {
  const { driverId, name } = await req.json();

  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const projectId = await auth.getProjectId();

  try {
    const response = await client.request({
      url: `https://fleetengine.googleapis.com/v1/providers/projects/${projectId}/vehicles`,
      method: 'POST',
      data: {
        vehicleId: driverId,
        vehicleState: {
          name: name,
          // Add other vehicle properties as needed
        }
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error registering vehicle:', error);
    return NextResponse.json({ error: 'Failed to register vehicle' }, { status: 500 });
  }
}
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Check if user is authenticated with Supabase
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use Google Auth library to get Fleet Engine token
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    // const projectId = await auth.getProjectId();
    // const url = `https://fleetengine.googleapis.com/v1/projects/${projectId}/providers/consumer`;
    const { token } = await client.getAccessToken();

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error fetching Fleet Engine token:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}
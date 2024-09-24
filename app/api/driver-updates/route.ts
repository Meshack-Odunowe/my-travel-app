import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';


export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // Set up Server-Sent Events headers
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const { data: drivers, error } = await supabase
            .from('drivers')
            .select('id, name, latitude, longitude');

          if (error) throw error;

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(drivers)}\n\n`));
        } catch (error) {
          console.error("Error fetching drivers:", error);
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'Error fetching drivers' })}\n\n`));
        }
      };

      // Send initial data
      await sendUpdate();

      // Set up interval to check for updates every 2 seconds
      const intervalId = setInterval(sendUpdate, 2000);

      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
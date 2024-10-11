// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

export async function GET() {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*, drivers(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
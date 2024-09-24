import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/app/lib/database.types';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('car-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type || 'image/jpeg',
      });

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
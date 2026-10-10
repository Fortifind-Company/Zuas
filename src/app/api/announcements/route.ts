import { NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement } from '@/lib/db';

export async function GET() {
  try {
    const announcements = getAnnouncements();
    return NextResponse.json({ success: true, data: announcements });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ann = createAnnouncement(body);
    return NextResponse.json({ success: true, data: ann }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

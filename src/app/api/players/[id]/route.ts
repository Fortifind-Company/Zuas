import { NextResponse } from 'next/server';
import { getProfileById } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = getProfileById(params.id);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Player profile not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

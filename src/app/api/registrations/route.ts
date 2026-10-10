import { NextResponse } from 'next/server';
import { getRegistrations, updateRegistrationStatus } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId') || undefined;
    const registrations = getRegistrations(tournamentId);
    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, status, notes } = body;
    if (!registrationId || !status) {
      return NextResponse.json({ success: false, error: 'registrationId and status required' }, { status: 400 });
    }
    const updated = updateRegistrationStatus(registrationId, status, notes);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

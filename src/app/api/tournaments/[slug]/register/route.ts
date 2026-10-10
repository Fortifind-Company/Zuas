import { NextResponse } from 'next/server';
import { getTournamentBySlug, createRegistration } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tournament = getTournamentBySlug(params.slug);
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 });
    }

    const body = await req.json();
    const { fullName, displayName, phone, email, platform, inGameId } = body;

    if (!fullName || !displayName || !phone || !email || !platform || !inGameId) {
      return NextResponse.json(
        { success: false, error: 'All fields (Full Name, Display Name, Phone, Email, Platform, and In-Game ID) are required.' },
        { status: 400 }
      );
    }

    const result = createRegistration({
      tournamentId: tournament.id,
      fullName,
      displayName,
      phone,
      email,
      platform,
      inGameId,
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

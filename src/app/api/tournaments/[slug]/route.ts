import { NextResponse } from 'next/server';
import { getTournamentBySlug, updateTournament, duplicateTournament } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tournament = getTournamentBySlug(params.slug);
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: tournament });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tournament = getTournamentBySlug(params.slug);
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 });
    }
    const body = await req.json();

    if (body.action === 'DUPLICATE') {
      const copy = duplicateTournament(tournament.id, body.newName);
      return NextResponse.json({ success: true, data: copy });
    }

    const updated = updateTournament(tournament.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

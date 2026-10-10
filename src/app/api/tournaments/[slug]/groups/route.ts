import { NextResponse } from 'next/server';
import { getTournamentBySlug, getTournamentGroups, generateGroupStage } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tournament = getTournamentBySlug(params.slug);
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 });
    }

    const groups = getTournamentGroups(tournament.id);
    return NextResponse.json({ success: true, data: groups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tournament = getTournamentBySlug(params.slug);
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Tournament not found' }, { status: 404 });
    }

    const result = generateGroupStage(tournament.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import { getTournaments, createTournament } from '@/lib/db';

export async function GET() {
  try {
    const tournaments = getTournaments();
    return NextResponse.json({ success: true, data: tournaments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Tournament name is required' }, { status: 400 });
    }
    const newTournament = createTournament(body);
    return NextResponse.json({ success: true, data: newTournament }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

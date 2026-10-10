import { NextResponse } from 'next/server';
import { getTournaments, getMatches, getAnnouncements } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId') || undefined;

    const tournaments = getTournaments();
    const allMatches = getMatches(tournamentId);
    const announcements = getAnnouncements(tournamentId);

    // Filter to live, recently updated or relevant fixtures
    const liveMatches = allMatches.filter(
      m => m.status === 'LIVE' || m.streamStatus === 'LIVE'
    );

    const data = {
      timestamp: new Date().toISOString(),
      liveCount: liveMatches.length,
      tournaments: tournaments.filter(t => t.status === 'LIVE' || t.status === 'REGISTRATION_OPEN'),
      liveMatches,
      allMatches,
      recentAnnouncements: announcements.slice(0, 3),
    };

    return NextResponse.json({ success: true, data }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

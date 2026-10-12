import { NextRequest, NextResponse } from 'next/server';
import { getRankings } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const search = searchParams.get('search')?.toLowerCase();

  let rankings = getRankings();

  if (platform && platform !== 'ALL') {
    rankings = rankings.filter(r => r.platform.toLowerCase() === platform.toLowerCase());
  }

  if (search) {
    rankings = rankings.filter(
      r =>
        r.displayName.toLowerCase().includes(search) ||
        r.efootballId.toLowerCase().includes(search)
    );
  }

  const tierCounts = {
    GRANDMASTER: rankings.filter(r => r.rankTier === 'GRANDMASTER').length,
    MASTER: rankings.filter(r => r.rankTier === 'MASTER').length,
    DIAMOND: rankings.filter(r => r.rankTier === 'DIAMOND').length,
    GOLD: rankings.filter(r => r.rankTier === 'GOLD').length,
    SILVER: rankings.filter(r => r.rankTier === 'SILVER').length,
    BRONZE: rankings.filter(r => r.rankTier === 'BRONZE').length,
  };

  return NextResponse.json({
    success: true,
    data: rankings,
    meta: {
      totalRanked: rankings.length,
      tierDistribution: tierCounts,
    },
  });
}

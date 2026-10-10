import { NextResponse } from 'next/server';
import { getMatchById, updateMatchScore, updateMatchStream } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const match = getMatchById(params.matchId);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Match not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: match });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const body = await req.json();

    if (body.action === 'SCORE') {
      const { winnerId, score1, score2 } = body;
      if (!winnerId || score1 === undefined || score2 === undefined) {
        return NextResponse.json(
          { success: false, error: 'winnerId, score1, and score2 are required' },
          { status: 400 }
        );
      }
      const updated = updateMatchScore(params.matchId, winnerId, Number(score1), Number(score2));
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === 'STREAM') {
      const { twitchChannel, streamStatus } = body;
      const updated = updateMatchStream(params.matchId, twitchChannel, streamStatus || 'CONFIGURED');
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

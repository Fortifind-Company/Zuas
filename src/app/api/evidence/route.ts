import { NextResponse } from 'next/server';
import { submitMatchEvidence, getMatchEvidence, reviewMatchEvidence } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId') || undefined;
    const evidence = getMatchEvidence(matchId);
    return NextResponse.json({ success: true, data: evidence });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      matchId,
      submittedBy,
      participantIndex,
      reportedScore1,
      reportedScore2,
      screenshotUrl,
      notes,
    } = body;

    if (!matchId || !submittedBy || reportedScore1 === undefined || reportedScore2 === undefined) {
      return NextResponse.json(
        { success: false, error: 'matchId, submittedBy, reportedScore1, and reportedScore2 are required' },
        { status: 400 }
      );
    }

    const created = submitMatchEvidence({
      matchId,
      submittedBy,
      participantIndex: Number(participantIndex) === 2 ? 2 : 1,
      reportedScore1: Number(reportedScore1),
      reportedScore2: Number(reportedScore2),
      screenshotUrl: screenshotUrl || '',
      notes: notes || '',
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { evidenceId, decision, reviewedBy } = body;

    if (!evidenceId || !['APPROVED', 'REJECTED'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'evidenceId and valid decision (APPROVED | REJECTED) are required' },
        { status: 400 }
      );
    }

    const result = reviewMatchEvidence(evidenceId, decision, reviewedBy || 'Administrator');
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

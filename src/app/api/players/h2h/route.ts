import { NextResponse } from 'next/server';
import { getHeadToHead } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const p1 = searchParams.get('p1');
    const p2 = searchParams.get('p2');

    if (!p1 || !p2) {
      return NextResponse.json(
        { success: false, error: 'Both p1 and p2 query parameters are required' },
        { status: 400 }
      );
    }

    const h2h = getHeadToHead(p1, p2);
    return NextResponse.json({ success: true, data: h2h });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

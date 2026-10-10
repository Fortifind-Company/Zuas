import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db';

export async function GET() {
  try {
    const logs = getAuditLogs();
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

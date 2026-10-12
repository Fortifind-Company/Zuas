import { NextResponse } from 'next/server';
import { getPayments } from '@/lib/db';

export async function GET() {
  const payments = getPayments();
  return NextResponse.json({ success: true, data: payments });
}

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updatePaymentStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (secretKey && signature) {
      const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      const paidAt = event.data?.paid_at || new Date().toISOString();
      if (reference) {
        updatePaymentStatus(reference, 'SUCCESS', paidAt);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

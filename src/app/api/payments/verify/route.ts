import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/payments';
import { getPaymentByReference, updatePaymentStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required.' },
        { status: 400 }
      );
    }

    const existing = getPaymentByReference(reference);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Transaction reference not found.' },
        { status: 404 }
      );
    }

    const verifyResult = await verifyPayment(reference);

    if (verifyResult.status === 'SUCCESS') {
      const updated = updatePaymentStatus(reference, 'SUCCESS', verifyResult.paidAt);
      return NextResponse.json({
        success: true,
        data: updated,
      });
    } else {
      const updated = updatePaymentStatus(reference, 'FAILED');
      return NextResponse.json({
        success: false,
        error: verifyResult.message || 'Payment verification failed.',
        data: updated,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

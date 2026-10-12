import { NextRequest, NextResponse } from 'next/server';
import { initializePayment } from '@/lib/payments';
import { createPayment, getTournamentById, getTournamentBySlug } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amountGhc, email, phone, tournamentId, userId, provider } = body;

    if (!amountGhc || !email || !tournamentId) {
      return NextResponse.json(
        { success: false, error: 'Amount, email, and tournamentId are required.' },
        { status: 400 }
      );
    }

    const tournament = getTournamentById(tournamentId) || getTournamentBySlug(tournamentId);
    if (!tournament) {
      return NextResponse.json(
        { success: false, error: 'Tournament not found.' },
        { status: 404 }
      );
    }

    const initResult = await initializePayment({
      amountGhc: Number(amountGhc),
      email: email.trim(),
      phone: phone?.trim() || '',
      tournamentId: tournament.id,
      userId,
      provider: provider || 'PAYSTACK',
    });

    if (!initResult.success) {
      return NextResponse.json(
        { success: false, error: initResult.message || 'Payment initialization failed.' },
        { status: 500 }
      );
    }

    // Persist pending transaction
    const payment = createPayment({
      reference: initResult.reference,
      tournamentId: tournament.id,
      userId,
      amountGhc: Number(amountGhc),
      currency: 'GHS',
      provider: provider || 'PAYSTACK',
      customerEmail: email.trim(),
      customerPhone: phone?.trim() || '',
      status: 'PENDING',
    });

    return NextResponse.json({
      success: true,
      data: {
        reference: payment.reference,
        authorizationUrl: initResult.authorizationUrl,
        amountGhc: payment.amountGhc,
        status: payment.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

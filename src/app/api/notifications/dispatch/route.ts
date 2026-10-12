import { NextRequest, NextResponse } from 'next/server';
import {
  formatGhanaPhone,
  createMatchCallWhatsAppMessage,
  getWhatsAppDirectUrl,
} from '@/lib/notifications';
import { getMatchById, getTournamentById, createNotification } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { matchId, phone, recipientName, customMessage, type } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number is required.' },
        { status: 400 }
      );
    }

    let messageBody = customMessage;
    let targetUrl = '';

    if (matchId) {
      const match = getMatchById(matchId);
      if (match) {
        const tournament = getTournamentById(match.tournamentId);
        const host = req.headers.get('host') || 'localhost:3000';
        const matchUrl = `https://${host}/matches/${match.id}`;
        messageBody = createMatchCallWhatsAppMessage(
          recipientName || 'Opponent',
          match.roundName,
          match.scheduledTime ? new Date(match.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
          matchUrl
        );
        targetUrl = matchUrl;
      }
    }

    if (!messageBody) {
      messageBody = `⚡ *eFootball Ghana Alert:* Hello ${recipientName || 'Player'}, you have an active update on your tournament profile.`;
    }

    const whatsAppUrl = getWhatsAppDirectUrl(phone, messageBody);

    // Also record in-app notification if matchId provided
    createNotification({
      userId: 'ALL',
      title: 'WhatsApp Alert Dispatched',
      message: `Match notification generated for ${recipientName || phone}.`,
      type: type || 'MATCH_ALERT',
      linkUrl: targetUrl,
      read: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        formattedPhone: formatGhanaPhone(phone),
        message: messageBody,
        whatsAppUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

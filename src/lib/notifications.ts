import { Notification, NotificationType, TournamentMatch } from './types';

/**
 * Format Ghanaian mobile phone to standard international format without '+' (for wa.me)
 * E.g. '0241234567' -> '233241234567'
 */
export function formatGhanaPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return `233${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith('233')) {
    return cleaned;
  }
  return `233${cleaned}`;
}

/**
 * Generate formatted WhatsApp alert message for upcoming match call
 */
export function createMatchCallWhatsAppMessage(
  opponentName: string,
  roundName: string,
  scheduledTime: string,
  matchUrl: string
): string {
  return [
    `⚡ *eFootball Ghana Championship — MATCH CALL* ⚡`,
    ``,
    `🎮 *Stage:* ${roundName}`,
    `⚔️ *Opponent:* ${opponentName}`,
    `⏰ *Time:* ${scheduledTime}`,
    ``,
    `Please launch eFootball Mobile, join the Friend Match lobby, and record the final score.`,
    `Submit your score and screenshot here:`,
    `${matchUrl}`,
    ``,
    `_Good luck and fair play!_ 🇬🇭`,
  ].join('\n');
}

/**
 * Generate direct WhatsApp URL link
 */
export function getWhatsAppDirectUrl(phone: string, message: string): string {
  const formattedPhone = formatGhanaPhone(phone);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

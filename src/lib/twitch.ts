/**
 * Twitch helper utilities for eFootball Mobile Championship
 * Implements strict channel validation, parent domain construction, and status helpers.
 */

export function extractTwitchChannel(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Match twitch.tv/channel_name or just channel_name
  const urlMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]{3,25})/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].toLowerCase();
  }

  // Pure username
  if (/^[a-zA-Z0-9_]{3,25}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  return null;
}

export function isValidTwitchChannel(channel: string): boolean {
  if (!channel) return false;
  return /^[a-zA-Z0-9_]{3,25}$/.test(channel);
}

export function getTwitchEmbedUrl(channel: string, extraParents: string[] = []): string {
  const cleanChannel = extractTwitchChannel(channel);
  if (!cleanChannel) return '';

  const parentSet = new Set<string>();
  
  // Default development domains
  parentSet.add('localhost');
  parentSet.add('127.0.0.1');

  // Environment configured host
  if (process.env.NEXT_PUBLIC_APP_DOMAIN) {
    parentSet.add(process.env.NEXT_PUBLIC_APP_DOMAIN);
  }
  if (process.env.VERCEL_URL) {
    parentSet.add(process.env.VERCEL_URL);
  }

  // Extra parents passed from global settings or current window origin
  extraParents.forEach(p => {
    if (p && typeof p === 'string') {
      try {
        const cleaned = p.replace(/^https?:\/\//, '').split(':')[0].split('/')[0];
        if (cleaned) parentSet.add(cleaned);
      } catch {
        // ignore
      }
    }
  });

  const parentParams = Array.from(parentSet)
    .map(p => `parent=${encodeURIComponent(p)}`)
    .join('&');

  return `https://player.twitch.tv/?channel=${encodeURIComponent(cleanChannel)}&${parentParams}&muted=false&autoplay=false`;
}

export function getTwitchChatEmbedUrl(channel: string, extraParents: string[] = []): string {
  const cleanChannel = extractTwitchChannel(channel);
  if (!cleanChannel) return '';

  const parentSet = new Set<string>();
  parentSet.add('localhost');
  parentSet.add('127.0.0.1');

  if (process.env.NEXT_PUBLIC_APP_DOMAIN) {
    parentSet.add(process.env.NEXT_PUBLIC_APP_DOMAIN);
  }
  if (process.env.VERCEL_URL) {
    parentSet.add(process.env.VERCEL_URL);
  }

  extraParents.forEach(p => {
    if (p && typeof p === 'string') {
      const cleaned = p.replace(/^https?:\/\//, '').split(':')[0].split('/')[0];
      if (cleaned) parentSet.add(cleaned);
    }
  });

  const parentParams = Array.from(parentSet)
    .map(p => `parent=${encodeURIComponent(p)}`)
    .join('&');

  return `https://www.twitch.tv/embed/${encodeURIComponent(cleanChannel)}/chat?${parentParams}&darkpopout`;
}

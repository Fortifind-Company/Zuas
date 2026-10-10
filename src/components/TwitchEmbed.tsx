'use client';

import React, { useEffect, useState } from 'react';
import { getTwitchEmbedUrl, extractTwitchChannel } from '@/lib/twitch';
import { Tv, ExternalLink, AlertCircle, Radio, Clock } from 'lucide-react';

interface TwitchEmbedProps {
  channel?: string;
  streamStatus?: 'NONE' | 'CONFIGURED' | 'LIVE' | 'ENDED' | 'UNAVAILABLE';
  matchTitle?: string;
  roundName?: string;
  scheduledTime?: string;
}

export default function TwitchEmbed({
  channel,
  streamStatus = 'NONE',
  matchTitle = 'eFootball Mobile Match',
  roundName = 'Tournament Match',
  scheduledTime,
}: TwitchEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [hostname, setHostname] = useState<string>('localhost');

  const cleanChannel = channel ? extractTwitchChannel(channel) : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      setHostname(currentHost);
      if (cleanChannel) {
        const url = getTwitchEmbedUrl(cleanChannel, [currentHost]);
        setEmbedUrl(url);
      }
    }
  }, [cleanChannel]);

  if (!cleanChannel || streamStatus === 'NONE' || streamStatus === 'UNAVAILABLE') {
    return (
      <div className="w-full aspect-video bg-zinc-950 text-white rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-zinc-800 shadow-elevated">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <Tv className="w-8 h-8 text-zinc-500" />
        </div>
        <span className="nexa-badge bg-zinc-800 border-zinc-700 text-zinc-300 text-xs mb-3">
          {streamStatus === 'UNAVAILABLE' ? 'Broadcast Offline / Unavailable' : 'Stream Not Configured Yet'}
        </span>
        <h3 className="text-xl font-bold tracking-tight text-white mb-2">{matchTitle}</h3>
        <p className="text-sm text-zinc-400 max-w-md mb-4">
          {streamStatus === 'UNAVAILABLE'
            ? 'The Twitch stream for this match is currently unavailable or has concluded. Official match referees will verify final results.'
            : 'No live Twitch stream is currently broadcasting for this fixture. Both players submit match records directly to tournament organizers.'}
        </p>
        {scheduledTime && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled: {new Date(scheduledTime).toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }

  if (streamStatus === 'ENDED') {
    return (
      <div className="w-full aspect-video bg-zinc-950 text-white rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-zinc-800">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-zinc-400" />
        </div>
        <span className="nexa-badge bg-zinc-800 border-zinc-700 text-zinc-300 text-xs mb-2">
          Match Broadcast Concluded
        </span>
        <h3 className="text-xl font-bold text-white mb-2">{matchTitle}</h3>
        <p className="text-sm text-zinc-400 mb-4">
          This match broadcast on channel <strong>twitch.tv/{cleanChannel}</strong> has finished.
        </p>
        <a
          href={`https://twitch.tv/${cleanChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nexa-btn-secondary text-xs"
        >
          Watch VODs on Twitch <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black border border-zinc-800 shadow-2xl">
      {/* Top stream banner */}
      <div className="px-4 py-2.5 bg-zinc-900 flex items-center justify-between border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-rose-600 text-white text-[11px] animate-pulse">
            <Radio className="w-3 h-3" />
            LIVE ON TWITCH
          </span>
          <span className="text-zinc-300 font-semibold truncate max-w-xs sm:max-w-md">
            {roundName} · twitch.tv/{cleanChannel}
          </span>
        </div>
        <a
          href={`https://twitch.tv/${cleanChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition font-medium"
        >
          <span>Open on Twitch</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Embedded iframe */}
      <div className="relative w-full aspect-video bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`Twitch Stream - ${cleanChannel}`}
            className="w-full h-full border-0"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            Loading stream player...
          </div>
        )}
      </div>

      {/* Stream note */}
      <div className="px-4 py-2 bg-zinc-950 text-[11px] text-zinc-400 flex items-center justify-between">
        <span>Verified by Tournament Admin · Host domain: {hostname}</span>
        <span className="text-zinc-500">Free broadcast · No subscription required</span>
      </div>
    </div>
  );
}

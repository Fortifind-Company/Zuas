'use client';

import React, { useRef, useState } from 'react';
import { TournamentMatch } from '@/lib/types';
import { X, Share2, Download, Copy, Check, MessageCircle, Trophy, Radio, Shield } from 'lucide-react';

interface Props {
  match: TournamentMatch;
  tournamentName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchdayFlyerModal({
  match,
  tournamentName = 'eFootball Ghana Championship',
  isOpen,
  onClose,
}: Props) {
  const flyerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const matchUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/matches/${match.id}`
    : `https://zuas.vercel.app/matches/${match.id}`;

  const shareText = `⚽ *MATCHDAY CLASH — eFOOTBALL GHANA* 🇬🇭\n\n🏆 *${tournamentName}*\n⚔️ *${match.participant1Name || 'TBD'}* VS *${match.participant2Name || 'TBD'}*\n📌 *Stage:* ${match.roundName}\n⏰ *Kickoff:* ${new Date(match.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n📺 *Watch Free Live / View Scores:* ${matchUrl}`;

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = async () => {
    if (!flyerRef.current) return;
    setDownloading(true);

    try {
      // Use standard HTML5 Canvas rendering for the flyer
      const canvas = document.createElement('canvas');
      const scale = 2; // retina resolution
      const width = 600;
      const height = 600;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.scale(scale, scale);

        // Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#09090b'); // zinc-950
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Emerald accent circle glow
        const glow = ctx.createRadialGradient(width / 2, 200, 10, width / 2, 200, 300);
        glow.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
        glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Header Tournament Tag
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GHANA eFOOTBALL MOBILE CHAMPIONSHIP · OFFICIAL MATCHDAY', width / 2, 50);

        // Tournament Title
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px sans-serif';
        ctx.fillText(tournamentName.toUpperCase(), width / 2, 85);

        // Round Badge
        ctx.fillStyle = '#3f3f46';
        ctx.roundRect(width / 2 - 80, 105, 160, 26, 13);
        ctx.fill();
        ctx.fillStyle = '#e4e4e7';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(match.roundName.toUpperCase(), width / 2, 122);

        // VS Graphic & Player Cards
        const p1 = match.participant1Name || 'Player 1';
        const p2 = match.participant2Name || 'Player 2';

        // Player 1 Card
        ctx.fillStyle = '#18181b';
        ctx.roundRect(40, 170, 220, 200, 20);
        ctx.fill();
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('SLOT 1', 150, 210);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 20px sans-serif';
        ctx.fillText(p1, 150, 260);

        ctx.fillStyle = '#a1a1aa';
        ctx.font = '12px sans-serif';
        ctx.fillText('Score: ' + match.participant1Score, 150, 310);

        // VS Circle
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(width / 2, 270, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '900 16px sans-serif';
        ctx.fillText('VS', width / 2, 276);

        // Player 2 Card
        ctx.fillStyle = '#18181b';
        ctx.roundRect(340, 170, 220, 200, 20);
        ctx.fill();
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('SLOT 2', 450, 210);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 20px sans-serif';
        ctx.fillText(p2, 450, 260);

        ctx.fillStyle = '#a1a1aa';
        ctx.font = '12px sans-serif';
        ctx.fillText('Score: ' + match.participant2Score, 450, 310);

        // Kickoff Time & Venue
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        const dateStr = new Date(match.scheduledTime).toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const timeStr = new Date(match.scheduledTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        ctx.fillText(`🗓️ ${dateStr} · ⏰ ${timeStr} GMT`, width / 2, 430);

        // Stream or Broadcast info
        ctx.fillStyle = match.streamStatus === 'LIVE' ? '#ef4444' : '#10b981';
        ctx.font = 'bold 13px sans-serif';
        const streamText = match.twitchChannel
          ? `📺 Twitch: twitch.tv/${match.twitchChannel}`
          : '🎮 Community Live Stream';
        ctx.fillText(streamText, width / 2, 465);

        // Footer disclaimer
        ctx.fillStyle = '#71717a';
        ctx.font = '11px sans-serif';
        ctx.fillText('100% Free Entry · Community eFootball Championship · Accra, Ghana', width / 2, 530);
        ctx.fillText('Powered by Zuas Esports Engine', width / 2, 550);

        // Download
        const link = document.createElement('a');
        link.download = `matchday-${p1}-vs-${p2}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      console.error('Error generating graphic:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-800 overflow-y-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Matchday Graphic & Share</h3>
              <p className="text-xs text-zinc-400">Share official card to WhatsApp, Discord, or Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Graphic Preview Card */}
        <div
          ref={flyerRef}
          className="relative rounded-2xl bg-gradient-to-b from-zinc-900 to-black p-6 border border-zinc-800 shadow-inner overflow-hidden mb-6 text-center select-none"
        >
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-3 h-3" />
              Ghana eFootball Championship
            </div>

            <h4 className="text-xl font-black text-white tracking-tight">
              {tournamentName}
            </h4>

            <div className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
              {match.roundName}
            </div>

            {/* VS Clash Grid */}
            <div className="grid grid-cols-5 items-center gap-2 pt-2 pb-2">
              <div className="col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  Slot 1
                </span>
                <span className="text-base font-black text-white block truncate">
                  {match.participant1Name || 'Player 1'}
                </span>
                <span className="text-2xl font-black text-white mt-2 block">
                  {match.participant1Score}
                </span>
              </div>

              <div className="col-span-1 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-black font-black flex items-center justify-center text-xs shadow-lg shadow-amber-400/20">
                  VS
                </div>
              </div>

              <div className="col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                  Slot 2
                </span>
                <span className="text-base font-black text-white block truncate">
                  {match.participant2Name || 'Player 2'}
                </span>
                <span className="text-2xl font-black text-white mt-2 block">
                  {match.participant2Score}
                </span>
              </div>
            </div>

            {/* Match info footer */}
            <div className="pt-2 text-xs text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-200">
                Kickoff: {new Date(match.scheduledTime).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })} GMT
              </p>
              {match.twitchChannel && (
                <p className="text-rose-400 font-bold flex items-center justify-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Live Stream: twitch.tv/{match.twitchChannel}
                </p>
              )}
              <p className="text-[10px] text-zinc-500">
                100% Free Entry Community Competition · Ghana eFootball
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Primary */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Share to WhatsApp (1-Click Broadcast)
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Rendering...' : 'Download PNG'}
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-700 transition flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Details!' : 'Copy Text & Link'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

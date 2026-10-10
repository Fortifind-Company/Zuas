'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TwitchEmbed from '@/components/TwitchEmbed';
import EvidenceSubmissionModal from '@/components/EvidenceSubmissionModal';
import MatchdayFlyerModal from '@/components/MatchdayFlyerModal';
import { TournamentMatch, MatchEvidence } from '@/lib/types';
import { getTwitchChatEmbedUrl } from '@/lib/twitch';
import {
  Trophy,
  ArrowLeft,
  Tv,
  Radio,
  Clock,
  ShieldCheck,
  FileText,
  MessageSquare,
  ExternalLink,
  Users,
  Camera,
  Share2,
  CheckCircle2,
  Clock3,
  XCircle,
  Eye,
} from 'lucide-react';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  const [match, setMatch] = useState<TournamentMatch | null>(null);
  const [evidenceList, setEvidenceList] = useState<MatchEvidence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'INFO' | 'CHAT' | 'EVIDENCE'>('INFO');
  const [chatUrl, setChatUrl] = useState<string>('');

  // Modals
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const fetchMatchData = () => {
    Promise.all([
      fetch(`/api/matches/${matchId}`).then(r => r.json()),
      fetch(`/api/evidence?matchId=${matchId}`).then(r => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([matchRes, evRes]) => {
        if (matchRes.success && matchRes.data) {
          setMatch(matchRes.data);
          if (matchRes.data.twitchChannel && typeof window !== 'undefined') {
            setChatUrl(getTwitchChatEmbedUrl(matchRes.data.twitchChannel, [window.location.hostname]));
          }
        }
        if (evRes.success && evRes.data) {
          setEvidenceList(evRes.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatchData();
    // Poll every 8s for live score sync
    const interval = setInterval(fetchMatchData, 8000);
    return () => clearInterval(interval);
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-zinc-400">
        Loading match details...
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <h2 className="text-2xl font-black text-zinc-950 mb-2">Match Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">The requested fixture does not exist or has been modified.</p>
        <Link href="/live" className="nexa-btn-primary text-xs">
          Return to Live Arena
        </Link>
      </div>
    );
  }

  const isLive = match.streamStatus === 'LIVE' || match.status === 'LIVE';

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200 text-xs">
          <Link
            href="/live"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Arena</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFlyerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold transition"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Share Matchday Card</span>
            </button>

            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Submit Screenshot Evidence</span>
            </button>
          </div>
        </div>

        {/* Match Title & Scoreboard Header */}
        <div className="nexa-card p-6 mb-8 bg-zinc-950 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Round info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {match.roundName}
                </span>
                {isLive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                    <Radio className="w-3 h-3" />
                    BROADCASTING LIVE
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">Status: {match.status}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {match.participant1Name ? (
                  <Link href={`/players/${encodeURIComponent(match.participant1Name)}`} className="hover:text-emerald-400 transition">
                    {match.participant1Name}
                  </Link>
                ) : 'TBD'}{' '}
                vs{' '}
                {match.participant2Name ? (
                  <Link href={`/players/${encodeURIComponent(match.participant2Name)}`} className="hover:text-emerald-400 transition">
                    {match.participant2Name}
                  </Link>
                ) : 'TBD'}
              </h1>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center gap-6 bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl">
              <div className="text-center">
                <span className="text-xs font-bold text-zinc-300 block truncate max-w-[120px]">
                  {match.participant1Name || 'Player 1'}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {match.participant1Score}
                </span>
              </div>
              <span className="text-xl font-bold text-zinc-600">:</span>
              <div className="text-center">
                <span className="text-xs font-bold text-zinc-300 block truncate max-w-[120px]">
                  {match.participant2Name || 'Player 2'}
                </span>
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {match.participant2Score}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content Layout: Embedded Player + Match Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Player Stream Video & Evidence Gallery */}
          <div className="lg:col-span-8 space-y-6">
            <TwitchEmbed
              channel={match.twitchChannel}
              streamStatus={match.streamStatus}
              matchTitle={`${match.participant1Name || 'Player 1'} vs ${match.participant2Name || 'Player 2'}`}
              roundName={match.roundName}
              scheduledTime={match.scheduledTime}
            />

            {/* Match Evidence Submissions Section */}
            <div className="nexa-card p-6 bg-white border border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-zinc-950">Result Evidence & Screenshots</h3>
                </div>
                <button
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
                >
                  + Upload Screenshot
                </button>
              </div>

              {evidenceList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center text-xs text-zinc-500">
                  <p className="font-semibold text-zinc-700">No match screenshot submitted yet.</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Players can upload their full-time result screen for referee review and bracket progression.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {evidenceList.map(ev => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">{ev.submittedBy}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ev.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ev.status === 'APPROVED' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : ev.status === 'REJECTED' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock3 className="w-3 h-3" />
                          )}
                          {ev.status === 'APPROVED'
                            ? 'Approved by Referee'
                            : ev.status === 'REJECTED'
                            ? 'Rejected'
                            : 'Pending Verification'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-zinc-200">
                        <span className="text-zinc-500">Reported Score:</span>
                        <span className="font-black text-zinc-950">
                          {ev.reportedScore1} - {ev.reportedScore2}
                        </span>
                      </div>

                      {ev.screenshotUrl && (
                        <div className="relative group cursor-pointer" onClick={() => setSelectedPreviewImage(ev.screenshotUrl)}>
                          <img
                            src={ev.screenshotUrl}
                            alt="Screenshot proof"
                            className="w-full h-32 object-cover rounded-xl border border-zinc-200 group-hover:opacity-90 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" /> View Full Image
                          </div>
                        </div>
                      )}

                      {ev.notes && (
                        <p className="text-[11px] text-zinc-500 italic bg-white p-2 rounded-lg border border-zinc-100">
                          &ldquo;{ev.notes}&rdquo;
                        </p>
                      )}

                      <span className="text-[10px] text-zinc-400 block">
                        Submitted: {new Date(ev.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Match Rules & Specifications */}
            <div className="nexa-card p-6">
              <h3 className="text-base font-bold text-zinc-950 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Match Specifications & Referee Guidelines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Game Format:</span>
                  <span>10-Minute Friend Match · Extra Time ON · Penalties ON</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Platform:</span>
                  <span>eFootball Mobile (Android & iOS Cross-Play)</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Result Reporting:</span>
                  <span>Final whistle screenshot uploaded to referee coordinator.</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-0.5">Disconnection Rule:</span>
                  <span>Preserve scoreline; replay remaining fixture minutes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Chat / Info Tabs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="nexa-card p-6">
              {/* Tab Selector */}
              <div className="flex border-b border-zinc-200 pb-3 mb-4 gap-2">
                <button
                  onClick={() => setActiveTab('INFO')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'INFO'
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Match Details
                </button>
                <button
                  onClick={() => setActiveTab('CHAT')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    activeTab === 'CHAT'
                      ? 'bg-black text-white'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Twitch Chat
                </button>
              </div>

              {activeTab === 'INFO' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block font-semibold mb-1">Scheduled Date & Time</span>
                    <span className="text-zinc-900 font-bold block">
                      {new Date(match.scheduledTime).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-zinc-400 block font-semibold mb-1">Tournament Stage</span>
                    <span className="text-zinc-900 font-bold block">{match.roundName}</span>
                  </div>

                  {/* Competitor Links */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <span className="text-zinc-400 block font-semibold text-[10px] uppercase">Competitor Dossiers</span>
                    <div className="flex flex-col gap-1.5">
                      {match.participant1Name && (
                        <Link
                          href={`/players/${encodeURIComponent(match.participant1Name)}`}
                          className="font-bold text-zinc-900 hover:text-emerald-600 flex items-center justify-between"
                        >
                          <span>{match.participant1Name}</span>
                          <span className="text-[10px] text-zinc-400">View H2H &rarr;</span>
                        </Link>
                      )}
                      {match.participant2Name && (
                        <Link
                          href={`/players/${encodeURIComponent(match.participant2Name)}`}
                          className="font-bold text-zinc-900 hover:text-emerald-600 flex items-center justify-between"
                        >
                          <span>{match.participant2Name}</span>
                          <span className="text-[10px] text-zinc-400">View H2H &rarr;</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {match.twitchChannel && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-purple-950">
                      <span className="font-bold block mb-1">Verified Twitch Stream:</span>
                      <a
                        href={`https://twitch.tv/${match.twitchChannel}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-purple-700 hover:underline flex items-center gap-1"
                      >
                        twitch.tv/{match.twitchChannel}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => setIsFlyerModalOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Generate Matchday Flyer
                    </button>

                    <Link
                      href="/bracket"
                      className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      View Tournament Bracket
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === 'CHAT' && (
                <div className="space-y-3">
                  {match.twitchChannel && chatUrl ? (
                    <div className="w-full h-80 rounded-xl overflow-hidden border border-zinc-200">
                      <iframe
                        src={chatUrl}
                        title="Twitch Chat"
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="py-12 text-center text-zinc-400 text-xs">
                      <MessageSquare className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                      Twitch chat is available when a channel is actively configured.
                    </div>
                  )}

                  {match.twitchChannel && (
                    <a
                      href={`https://twitch.tv/${match.twitchChannel}/chat`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-center block text-purple-700 font-bold hover:underline"
                    >
                      Open Chat in Twitch App / New Window →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Fair Play Note */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
              <span className="font-bold text-zinc-950 block mb-1">Notice for Spectators</span>
              <p className="leading-relaxed">
                Stream delays may be implemented by players to prevent tactical screen-watching during competitive gameplay.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <EvidenceSubmissionModal
        match={match}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmitted={ev => {
          setEvidenceList(prev => [ev, ...prev]);
          fetchMatchData();
        }}
      />

      <MatchdayFlyerModal
        match={match}
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
      />

      {/* Image Preview Modal */}
      {selectedPreviewImage && (
        <div
          onClick={() => setSelectedPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={selectedPreviewImage}
            alt="Full Preview"
            className="max-w-4xl max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

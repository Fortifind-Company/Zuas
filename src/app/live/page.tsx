'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TournamentMatch } from '@/lib/types';
import { Tv, Radio, Clock, CheckCircle2, Filter, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function LiveArenaPage() {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/tournaments/efootball-mobile-ghana-championship-s1/bracket')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setMatches(json.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const liveMatches = matches.filter(m => m.streamStatus === 'LIVE' || m.status === 'LIVE');
  const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED' && m.streamStatus !== 'LIVE');
  const completedMatches = matches.filter(m => m.status === 'COMPLETED');

  const filteredMatches =
    filter === 'LIVE'
      ? liveMatches
      : filter === 'UPCOMING'
      ? upcomingMatches
      : filter === 'COMPLETED'
      ? completedMatches
      : matches;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Twitch Broadcasting Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Live Arena
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Watch Ghanaian tournament matches live on embedded Twitch streams. No paid subscription required.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 mr-2">Streaming Provider:</span>
            <span className="nexa-badge bg-zinc-50 text-zinc-800 text-xs font-bold">
              🟣 Twitch Interactive
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilter('LIVE')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filter === 'LIVE'
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Now ({liveMatches.length})
          </button>
          <button
            onClick={() => setFilter('UPCOMING')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'UPCOMING'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Upcoming ({upcomingMatches.length})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              filter === 'COMPLETED'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            Completed ({completedMatches.length})
          </button>
        </div>

        {/* Matches Grid */}
        {loading ? (
          <div className="py-20 text-center text-zinc-400">Loading live arena schedule...</div>
        ) : filteredMatches.length === 0 ? (
          <div className="nexa-card p-12 text-center text-zinc-500">
            <Tv className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <h4 className="text-lg font-bold text-zinc-800 mb-1">No Matches Found in this Filter</h4>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              {filter === 'LIVE'
                ? 'There are currently no active live Twitch streams broadcasting. Matches are verified by organizers before being marked live.'
                : 'Check back soon for newly scheduled tournament fixtures.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => {
              const isLive = match.streamStatus === 'LIVE' || match.status === 'LIVE';

              return (
                <div
                  key={match.id}
                  className={`nexa-card p-5 flex flex-col justify-between transition-all ${
                    isLive ? 'border-rose-400 ring-2 ring-rose-500/10' : ''
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-zinc-100">
                      <span className="font-bold text-zinc-500 uppercase tracking-wider text-[11px]">
                        {match.roundName} · #{match.matchNumber}
                      </span>
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                          <Radio className="w-3 h-3 animate-pulse" />
                          LIVE ON TWITCH
                        </span>
                      ) : match.status === 'COMPLETED' ? (
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                          Final Result
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-medium text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(match.scheduledTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    {/* Participants score */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-xs flex items-center justify-center font-bold">
                            {match.participant1Name ? match.participant1Name.charAt(0) : '?'}
                          </span>
                          <span className="text-sm font-bold text-zinc-900 truncate">
                            {match.participant1Name || 'TBD'}
                          </span>
                        </div>
                        <span className="text-base font-black font-mono text-zinc-950">
                          {match.participant1Score}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-xs flex items-center justify-center font-bold">
                            {match.participant2Name ? match.participant2Name.charAt(0) : '?'}
                          </span>
                          <span className="text-sm font-bold text-zinc-900 truncate">
                            {match.participant2Name || 'TBD'}
                          </span>
                        </div>
                        <span className="text-base font-black font-mono text-zinc-950">
                          {match.participant2Score}
                        </span>
                      </div>
                    </div>

                    {/* Channel info if available */}
                    {match.twitchChannel && (
                      <div className="mb-4 p-2 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-purple-900 flex items-center justify-between">
                        <span>Channel: <strong>twitch.tv/{match.twitchChannel}</strong></span>
                        <span className="text-[10px] text-purple-700 font-semibold">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <Link
                    href={`/matches/${match.id}`}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition flex items-center justify-center gap-1.5 ${
                      isLive
                        ? 'bg-black text-white hover:bg-zinc-800'
                        : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                    }`}
                  >
                    {isLive ? (
                      <>
                        <Tv className="w-4 h-4 text-rose-500" />
                        <span>Watch Live Match</span>
                      </>
                    ) : (
                      <>
                        <span>Open Match Viewer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

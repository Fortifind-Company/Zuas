'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PlayerProfile, TournamentMatch, HeadToHeadStats } from '@/lib/types';
import {
  Trophy,
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  Swords,
  ShieldCheck,
  Calendar,
  Activity,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';

export default function PlayerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<(PlayerProfile & { matches: TournamentMatch[] }) | null>(null);
  const [allProfiles, setAllProfiles] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // Head-to-Head state
  const [selectedOpponent, setSelectedOpponent] = useState<string>('');
  const [h2hStats, setH2hStats] = useState<HeadToHeadStats | null>(null);
  const [loadingH2h, setLoadingH2h] = useState(false);

  useEffect(() => {
    // Fetch profile and all profiles for H2H picker
    Promise.all([
      fetch(`/api/players/${encodeURIComponent(id)}`).then(r => r.json()),
      fetch('/api/registrations').then(r => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([profRes, regRes]) => {
        if (profRes.success && profRes.data) {
          setProfile(profRes.data);
        }
        if (regRes.success && regRes.data) {
          // unique display names
          const unique: PlayerProfile[] = [];
          const seen = new Set<string>();
          for (const reg of regRes.data) {
            if (!seen.has(reg.displayName) && reg.displayName !== id) {
              seen.add(reg.displayName);
              unique.push({
                id: reg.profileId || reg.displayName,
                displayName: reg.displayName,
                fullName: reg.fullName,
                inGameId: reg.inGameId,
                platform: reg.platform,
                email: reg.email,
                phone: reg.phone,
                createdAt: reg.registeredAt,
                stats: { tournamentsPlayed: 1, matchesPlayed: 0, matchesWon: 0, matchesLost: 0, championships: 0 },
              });
            }
          }
          setAllProfiles(unique);
          if (unique.length > 0) {
            setSelectedOpponent(unique[0].displayName);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Load H2H when opponent changes
  useEffect(() => {
    if (!profile || !selectedOpponent) return;
    setLoadingH2h(true);
    fetch(`/api/players/h2h?p1=${encodeURIComponent(profile.displayName)}&p2=${encodeURIComponent(selectedOpponent)}`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          setH2hStats(json.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingH2h(false));
  }, [profile, selectedOpponent]);

  const handleCopyInGameId = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.inGameId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-zinc-400">
        Loading player profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white py-20 text-center">
        <h2 className="text-2xl font-black text-zinc-950 mb-2">Player Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">The profile could not be located in the tournament registry.</p>
        <Link href="/players" className="nexa-btn-primary text-xs">
          View All Players
        </Link>
      </div>
    );
  }

  const matches = profile.matches || [];
  const wonMatches = matches.filter(
    m =>
      (m.participant1Name === profile.displayName && m.participant1Score > m.participant2Score) ||
      (m.participant2Name === profile.displayName && m.participant2Score > m.participant1Score)
  ).length;

  const totalMatchesCount = Math.max(matches.length, profile.stats?.matchesPlayed || 0);
  const winRate = totalMatchesCount > 0 ? Math.round((wonMatches / totalMatchesCount) * 100) : 0;

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 text-xs">
          <Link
            href="/players"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Players Directory</span>
          </Link>
          <span className="text-zinc-400">Verified Competitor</span>
        </div>

        {/* Player Header Card */}
        <div className="nexa-card p-6 sm:p-8 bg-zinc-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-emerald-400 shadow-xl">
                {profile.displayName.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{profile.displayName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ghana
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-3">{profile.fullName}</p>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <button
                    onClick={handleCopyInGameId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
                  >
                    <span>ID: {profile.inGameId}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <Smartphone className="w-3 h-3 text-emerald-400" />
                    {profile.platform}
                  </span>
                </div>
              </div>
            </div>

            {/* Win Rate Quick Indicator */}
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Career Win Rate</span>
                <span className="text-3xl font-black text-emerald-400">{winRate}%</span>
              </div>
              <div className="w-px h-10 bg-zinc-800" />
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Wins / Matches</span>
                <span className="text-base font-bold text-white">{wonMatches} / {totalMatchesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="nexa-card p-5 bg-white border border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Tournaments
            </span>
            <span className="text-2xl font-black text-zinc-950">
              {profile.stats?.tournamentsPlayed || 1}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-1">Official registrations</span>
          </div>

          <div className="nexa-card p-5 bg-white border border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Matches Played
            </span>
            <span className="text-2xl font-black text-zinc-950">
              {totalMatchesCount}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-1">Head-to-head fixtures</span>
          </div>

          <div className="nexa-card p-5 bg-white border border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Matches Won
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {wonMatches}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-1">Competitive victories</span>
          </div>

          <div className="nexa-card p-5 bg-white border border-zinc-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Championships
            </span>
            <span className="text-2xl font-black text-amber-500">
              {profile.stats?.championships || 0}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-1">Titles hoisted</span>
          </div>
        </div>

        {/* Head-to-Head (H2H) Rivalry Tool */}
        <div className="nexa-card p-6 sm:p-8 bg-zinc-50 border border-zinc-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-zinc-200 text-zinc-800 mb-2">
                <Swords className="w-3.5 h-3.5 text-zinc-900" />
                Head-to-Head (H2H) Analyzer
              </div>
              <h3 className="text-lg font-black text-zinc-950">Direct Rivalry Comparison</h3>
              <p className="text-xs text-zinc-500">Compare historic clash records against any Ghanaian competitor.</p>
            </div>

            {/* Opponent Selector */}
            {allProfiles.length > 0 && (
              <div className="w-full sm:w-64">
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Select Rival</label>
                <select
                  value={selectedOpponent}
                  onChange={e => setSelectedOpponent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-zinc-300 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allProfiles.map(p => (
                    <option key={p.id} value={p.displayName}>
                      {p.displayName} ({p.platform})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {loadingH2h ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading rivalry stats...</div>
          ) : h2hStats ? (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-6">
              
              {/* Rivalry Scoreboard */}
              <div className="grid grid-cols-3 items-center text-center">
                <div className="space-y-1">
                  <span className="text-sm font-black text-zinc-950 block">{profile.displayName}</span>
                  <span className="text-3xl font-black text-emerald-600 block">{h2hStats.player1.wins}</span>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Wins</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-400 block uppercase">Draws</span>
                  <span className="text-2xl font-black text-zinc-700 block">{h2hStats.draws}</span>
                  <span className="text-[10px] text-zinc-400">{h2hStats.totalMatches} Clashes</span>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-black text-zinc-950 block">{h2hStats.player2.name}</span>
                  <span className="text-3xl font-black text-rose-600 block">{h2hStats.player2.wins}</span>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Wins</span>
                </div>
              </div>

              {/* Rivalry Ratio Bar */}
              {h2hStats.totalMatches > 0 && (
                <div className="space-y-1.5">
                  <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden flex">
                    <div
                      style={{
                        width: `${(h2hStats.player1.wins / h2hStats.totalMatches) * 100}%`,
                      }}
                      className="h-full bg-emerald-500"
                    />
                    <div
                      style={{
                        width: `${(h2hStats.draws / h2hStats.totalMatches) * 100}%`,
                      }}
                      className="h-full bg-zinc-300"
                    />
                    <div
                      style={{
                        width: `${(h2hStats.player2.wins / h2hStats.totalMatches) * 100}%`,
                      }}
                      className="h-full bg-rose-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                    <span>{profile.displayName} Dominance</span>
                    <span>{h2hStats.player2.name} Dominance</span>
                  </div>
                </div>
              )}

              {/* Direct Matches list */}
              {h2hStats.recentMatches.length > 0 ? (
                <div className="pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-2">Previous Encounters</span>
                  <div className="space-y-2">
                    {h2hStats.recentMatches.map(m => (
                      <Link
                        key={m.id}
                        href={`/matches/${m.id}`}
                        className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-600 font-medium">{m.roundName}</span>
                        <span className="font-black text-zinc-950">
                          {m.participant1Score} - {m.participant2Score}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                          View Match <ChevronRight className="w-3 h-3" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 text-center py-2">
                  No previous competitive encounters recorded yet between these two players.
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Complete Match History */}
        <div className="nexa-card p-6 bg-white border border-zinc-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-zinc-950">Match History & Fixtures</h3>
            <span className="text-xs text-zinc-400">{matches.length} Total Matches</span>
          </div>

          {matches.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">
              No tournament matches scheduled or completed for this player yet.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {matches.map(m => {
                const isP1 = m.participant1Name === profile.displayName;
                const myScore = isP1 ? m.participant1Score : m.participant2Score;
                const oppScore = isP1 ? m.participant2Score : m.participant1Score;
                const opponentName = isP1 ? m.participant2Name : m.participant1Name;

                let outcome = 'DRAW';
                let outcomeClass = 'bg-zinc-100 text-zinc-700';

                if (m.status === 'COMPLETED') {
                  if (myScore > oppScore) {
                    outcome = 'WON';
                    outcomeClass = 'bg-emerald-100 text-emerald-800';
                  } else if (myScore < oppScore) {
                    outcome = 'LOST';
                    outcomeClass = 'bg-rose-100 text-rose-800';
                  }
                } else {
                  outcome = m.status;
                  outcomeClass = 'bg-zinc-100 text-zinc-500';
                }

                return (
                  <Link
                    key={m.id}
                    href={`/matches/${m.id}`}
                    className="py-3.5 flex items-center justify-between hover:bg-zinc-50 px-2 rounded-xl transition group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${outcomeClass}`}>
                          {outcome}
                        </span>
                        <span className="text-xs text-zinc-400">{m.roundName}</span>
                      </div>
                      <div className="text-xs font-bold text-zinc-900">
                        vs {opponentName || 'TBD'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-black text-zinc-950">
                        {myScore} - {oppScore}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

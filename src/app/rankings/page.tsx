'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayerRanking, RankTier } from '@/lib/types';
import { getTierBadgeStyle } from '@/lib/elo';
import { Trophy, Search, Smartphone, Apple, Shield, ChevronRight, Award, Flame, Users } from 'lucide-react';

export default function RankingsPage() {
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<'ALL' | 'Android' | 'iOS'>('ALL');
  const [tierCounts, setTierCounts] = useState<Record<string, number>>({});

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (platform !== 'ALL') params.append('platform', platform);
      if (search) params.append('search', search);

      const res = await fetch(`/api/rankings?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setRankings(json.data);
        if (json.meta?.tierDistribution) {
          setTierCounts(json.meta.tierDistribution);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [platform, search]);

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-emerald-400">
              <span>🇬🇭</span> National Competitive Circuit · Season 1
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ghana National eFootball Elo Leaderboard
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Official competitive standings calculated using international tournament Elo ranking formulas. Points update dynamically with each verified championship result.
            </p>
          </div>

          {/* Tier breakdown chips */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-8 pt-6 border-t border-white/10">
            {[
              { tier: 'GRANDMASTER' as RankTier, label: 'Grandmaster (1800+)' },
              { tier: 'MASTER' as RankTier, label: 'Master (1600+)' },
              { tier: 'DIAMOND' as RankTier, label: 'Diamond (1450+)' },
              { tier: 'GOLD' as RankTier, label: 'Gold (1300+)' },
              { tier: 'SILVER' as RankTier, label: 'Silver (1150+)' },
              { tier: 'BRONZE' as RankTier, label: 'Bronze (<1150)' },
            ].map(item => {
              const style = getTierBadgeStyle(item.tier);
              const count = tierCounts[item.tier] || 0;
              return (
                <div key={item.tier} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-lg">{style.icon}</div>
                  <div className="text-[11px] font-bold text-white mt-1">{style.label.split(' ')[0]}</div>
                  <div className="text-[10px] text-zinc-400">{count} Players</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: Search & Platform filter */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-black/[0.06] shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search player nickname or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/[0.08] bg-zinc-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-zinc-100 p-1 rounded-xl">
            {(['ALL', 'Android', 'iOS'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  platform === p
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {p === 'ALL' ? 'All Platforms' : p}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] bg-zinc-50/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Player</th>
                  <th className="py-4 px-6">Tier</th>
                  <th className="py-4 px-6 text-center">Elo Rating</th>
                  <th className="py-4 px-6 text-center">Peak Elo</th>
                  <th className="py-4 px-6 text-center">Win Rate</th>
                  <th className="py-4 px-6 text-center">W - L</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400">
                      Loading national ranking ladder...
                    </td>
                  </tr>
                ) : rankings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400">
                      No ranked players matched the criteria.
                    </td>
                  </tr>
                ) : (
                  rankings.map((player) => {
                    const tierStyle = getTierBadgeStyle(player.rankTier);
                    const isTopThree = player.nationalRank <= 3;

                    return (
                      <tr key={player.playerId} className="hover:bg-zinc-50/60 transition group">
                        {/* Rank Position */}
                        <td className="py-4 px-6 text-center">
                          {player.nationalRank === 1 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm">
                              👑 1
                            </span>
                          ) : player.nationalRank === 2 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 font-black text-sm">
                              🥈 2
                            </span>
                          ) : player.nationalRank === 3 ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 font-black text-sm">
                              🥉 3
                            </span>
                          ) : (
                            <span className="font-bold text-zinc-500 text-sm">
                              #{player.nationalRank}
                            </span>
                          )}
                        </td>

                        {/* Player Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-800 border border-black/[0.06]">
                              {player.displayName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-zinc-950 flex items-center gap-1.5">
                                {player.displayName}
                                {player.platform === 'iOS' ? (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-semibold">iOS</span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">Android</span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                ID: {player.efootballId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Rank Tier */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                            <span>{tierStyle.icon}</span>
                            <span>{tierStyle.label}</span>
                          </span>
                        </td>

                        {/* Current Elo */}
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-sm text-zinc-950">
                            {player.elo}
                          </span>
                        </td>

                        {/* Peak Elo */}
                        <td className="py-4 px-6 text-center text-zinc-500 font-medium">
                          {player.peakElo}
                        </td>

                        {/* Win Rate */}
                        <td className="py-4 px-6 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="w-16 h-2 rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${player.winRatePct}%` }}
                              />
                            </div>
                            <span className="font-bold text-xs text-zinc-800">
                              {player.winRatePct}%
                            </span>
                          </div>
                        </td>

                        {/* W - L */}
                        <td className="py-4 px-6 text-center text-zinc-600 font-medium">
                          <span className="text-emerald-700 font-bold">{player.matchesWon}W</span>
                          <span className="text-zinc-300 mx-1">/</span>
                          <span className="text-rose-600 font-bold">{player.matchesLost}L</span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/players/${player.playerId}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition"
                          >
                            <span>Profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

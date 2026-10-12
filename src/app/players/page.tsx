'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Trophy, Smartphone, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

interface PlayerItem {
  id: string;
  displayName: string;
  fullName: string;
  platform: 'Android' | 'iOS';
  inGameId: string;
  city: string;
  stats: {
    tournamentsPlayed: number;
    matchesWon: number;
    matchesLost: number;
    championships: number;
  };
}

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'Android' | 'iOS'>('ALL');
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/registrations')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          const list: PlayerItem[] = json.data.map((reg: any) => ({
            id: reg.profileId || reg.displayName,
            displayName: reg.displayName,
            fullName: reg.fullName,
            platform: reg.platform,
            inGameId: reg.inGameId,
            city: 'Ghana',
            stats: { tournamentsPlayed: 1, matchesWon: 0, matchesLost: 0, championships: 0 },
          }));
          setPlayers(list);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.inGameId.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || p.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              <Users className="w-3.5 h-3.5" />
              Official Roster & Leaderboard
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">Competitor Directory</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Explore profiles, career head-to-head records, and in-game credentials of verified Ghanaian eFootballers.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player, city, or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Platform filter pills */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setPlatformFilter('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              platformFilter === 'ALL'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setPlatformFilter('Android')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              platformFilter === 'Android'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            🤖 Android
          </button>
          <button
            onClick={() => setPlatformFilter('iOS')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${
              platformFilter === 'iOS'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            🍎 iOS
          </button>
        </div>

        {/* Players Grid */}
        {filtered.length === 0 ? (
          <div className="nexa-card p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
              ⚽
            </div>
            <h3 className="text-xl font-black text-zinc-950 mb-2">
              {search || platformFilter !== 'ALL' ? 'No Competitors Found' : 'Be The First Competitor'}
            </h3>
            <p className="text-sm text-zinc-500 mb-6">
              {search || platformFilter !== 'ALL'
                ? 'Try adjusting your search filters or platform selection.'
                : 'Registration is live! Register your eFootball Mobile gamer tag to claim your seed.'}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-800 transition shadow-md"
            >
              Register for Ghana Cup &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((player) => (
              <Link
                key={player.id}
                href={`/players/${encodeURIComponent(player.displayName)}`}
                className="nexa-card p-6 flex flex-col justify-between hover:border-zinc-400 hover:shadow-lg transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-base border border-zinc-200 group-hover:bg-zinc-950 group-hover:text-emerald-400 transition">
                      {player.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                      {player.platform}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-zinc-950 group-hover:text-emerald-600 transition">
                      {player.displayName}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-950 transition" />
                  </div>
                  <span className="text-xs text-zinc-400 block mb-4">{player.city}, Ghana</span>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-center mb-4">
                    <div>
                      <span className="text-xs font-black text-zinc-950 block">{player.stats.matchesWon}</span>
                      <span className="text-[10px] text-zinc-400">Wins</span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-zinc-950 block">{player.stats.matchesLost}</span>
                      <span className="text-[10px] text-zinc-400">Losses</span>
                    </div>
                    <div>
                      <span className="text-xs font-black text-amber-600 block">{player.stats.championships}</span>
                      <span className="text-[10px] text-zinc-400">Titles</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span>View H2H & Stats</span>
                  <span className="text-emerald-600 font-semibold group-hover:underline">Profile &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

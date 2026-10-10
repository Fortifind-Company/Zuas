'use client';

import React, { useState } from 'react';
import { getProfiles } from '@/lib/db';
import { Users, Search, Trophy, Smartphone, ShieldCheck, Award } from 'lucide-react';

export default function PlayersPage() {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'Android' | 'iOS'>('ALL');

  // Load profiles
  const profiles = [
    {
      id: 'user_1',
      displayName: 'KingPro GH',
      fullName: 'Kofi Asare',
      platform: 'Android' as const,
      inGameId: 'GH-EF-9000',
      city: 'Accra',
      stats: { tournamentsPlayed: 3, matchesWon: 12, matchesLost: 2, championships: 1 },
    },
    {
      id: 'user_2',
      displayName: 'DarkX',
      fullName: 'Samuel Doe',
      platform: 'iOS' as const,
      inGameId: 'GH-EF-9001',
      city: 'Kumasi',
      stats: { tournamentsPlayed: 2, matchesWon: 8, matchesLost: 3, championships: 0 },
    },
    {
      id: 'user_3',
      displayName: 'NanaEsports',
      fullName: 'Nana Yaw',
      platform: 'Android' as const,
      inGameId: 'GH-EF-9002',
      city: 'Tema',
      stats: { tournamentsPlayed: 2, matchesWon: 7, matchesLost: 3, championships: 0 },
    },
    {
      id: 'user_4',
      displayName: 'FootyStar',
      fullName: 'Kwame Tetteh',
      platform: 'iOS' as const,
      inGameId: 'GH-EF-9003',
      city: 'Accra',
      stats: { tournamentsPlayed: 2, matchesWon: 6, matchesLost: 4, championships: 0 },
    },
    {
      id: 'user_5',
      displayName: 'ProLegend',
      fullName: 'Eric Mensah',
      platform: 'Android' as const,
      inGameId: 'GH-EF-9004',
      city: 'Takoradi',
      stats: { tournamentsPlayed: 1, matchesWon: 4, matchesLost: 2, championships: 0 },
    },
    {
      id: 'user_6',
      displayName: 'KwekuBall',
      fullName: 'Daniel Osei',
      platform: 'Android' as const,
      inGameId: 'GH-EF-9005',
      city: 'Cape Coast',
      stats: { tournamentsPlayed: 1, matchesWon: 3, matchesLost: 2, championships: 0 },
    },
    {
      id: 'user_7',
      displayName: 'Samurai',
      fullName: 'Michael Boateng',
      platform: 'iOS' as const,
      inGameId: 'GH-EF-9006',
      city: 'Accra',
      stats: { tournamentsPlayed: 2, matchesWon: 5, matchesLost: 3, championships: 0 },
    },
    {
      id: 'user_8',
      displayName: 'JayFlex',
      fullName: 'Joseph Annan',
      platform: 'Android' as const,
      inGameId: 'GH-EF-9007',
      city: 'Kasoa',
      stats: { tournamentsPlayed: 1, matchesWon: 2, matchesLost: 2, championships: 0 },
    },
  ];

  const filtered = profiles.filter((p) => {
    const matchesSearch =
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = platformFilter === 'ALL' || p.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>National Roster & Rankings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Player Directory
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Verified Ghanaian mobile competitors across Android & iOS.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player or city..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((player) => (
            <div key={player.id} className="nexa-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-black text-base border border-zinc-200">
                    {player.displayName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                    {player.platform}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-zinc-950 mb-0.5">{player.displayName}</h3>
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
                <span>Verified Account</span>
                <span className="text-emerald-600 font-semibold">Active Roster</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

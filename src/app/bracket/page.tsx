import React from 'react';
import Link from 'next/link';
import { getFeaturedTournament, getMatches } from '@/lib/db';
import BracketTree from '@/components/BracketTree';
import { Trophy, Tv, Radio, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function BracketPage() {
  const tournament = getFeaturedTournament();
  const matches = getMatches(tournament.id);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Knockout Tree · {tournament.edition}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Tournament Bracket
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Single-elimination format. Verified Ghanaian mobile tacticians competing for the championship trophy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/live" className="nexa-btn-secondary text-xs">
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              Watch Live Streams
            </Link>
            <Link href="/register" className="nexa-btn-primary text-xs">
              Register for Tournament
            </Link>
          </div>
        </div>

        {/* Bracket Canvas */}
        <div className="nexa-card p-6 mb-12">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-zinc-900">Format:</span>
              <span className="text-zinc-600">16 Players · Single Elimination</span>
              <span className="text-zinc-300">·</span>
              <span className="text-emerald-700 font-semibold">Referee Verified</span>
            </div>
            <span className="text-[11px] text-zinc-400">
              Scroll horizontally on smaller screens to inspect all rounds →
            </span>
          </div>

          <BracketTree matches={matches} />
        </div>

        {/* Bracket Rules & Seeding notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nexa-card p-6">
            <h4 className="text-sm font-bold text-zinc-950 mb-2">Seeding Protocol</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Bracket positions are assigned from confirmed registrations using randomized draw or regional seeding by tournament administrators.
            </p>
          </div>

          <div className="nexa-card p-6">
            <h4 className="text-sm font-bold text-zinc-950 mb-2">Result Verification</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Winner advancement occurs only after match referees review end-of-game screenshots or official Twitch video records.
            </p>
          </div>

          <div className="nexa-card p-6">
            <h4 className="text-sm font-bold text-zinc-950 mb-2">Dispute Resolution</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              In the event of an unresolvable match discrepancy, the tournament committee reviews submitted screen recordings and logs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

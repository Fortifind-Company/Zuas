import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentBySlug, getMatches, getTournamentGroups } from '@/lib/db';
import BracketTree from '@/components/BracketTree';
import GroupStageTable from '@/components/GroupStageTable';
import { Trophy, ArrowLeft, Tv, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentSlugBracketPage({
  params,
}: {
  params: { slug: string };
}) {
  const tournament = getTournamentBySlug(params.slug);
  if (!tournament) return notFound();

  const matches = getMatches(tournament.id);
  const groups = getTournamentGroups(tournament.id);

  const isGroupFormat = tournament.format === 'GROUP_STAGE_KNOCKOUT';
  const knockoutMatches = isGroupFormat
    ? matches.filter(m => m.stageType !== 'GROUP')
    : matches;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 text-xs">
          <Link
            href={`/tournaments/${tournament.slug}`}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {tournament.name}</span>
          </Link>
          <span className="font-bold text-zinc-500">{tournament.edition}</span>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Format: {tournament.format.replace('_', ' ')}</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
            Tournament Stages & Brackets
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Official fixtures, real-time standings, and advancement progression for {tournament.name}.
          </p>
        </div>

        {/* If Group Stage Tournament, show Group Tables */}
        {isGroupFormat && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-black text-zinc-950">Phase 1: Group Stage Standings</h2>
            </div>
            <GroupStageTable
              groups={groups}
              matches={matches.filter(m => m.stageType === 'GROUP')}
              tournamentSlug={tournament.slug}
            />
          </div>
        )}

        {/* Knockout Stage Bracket */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
            <h2 className="text-lg font-black text-zinc-950">
              {isGroupFormat ? 'Phase 2: Championship Knockout Tree' : 'Single-Elimination Knockout Bracket'}
            </h2>
          </div>
          <div className="nexa-card p-6">
            <BracketTree matches={knockoutMatches} />
          </div>
        </div>

      </div>
    </div>
  );
}

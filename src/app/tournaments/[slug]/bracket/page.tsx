import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentBySlug, getMatches } from '@/lib/db';
import BracketTree from '@/components/BracketTree';
import { Trophy, ArrowLeft, Tv } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentSlugBracketPage({
  params,
}: {
  params: { slug: string };
}) {
  const tournament = getTournamentBySlug(params.slug);
  if (!tournament) return notFound();

  const matches = getMatches(tournament.id);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-200 text-xs">
          <Link
            href={`/tournaments/${tournament.slug}`}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {tournament.name}</span>
          </Link>
          <span className="font-bold text-zinc-500">{tournament.edition}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
            Knockout Bracket
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Single elimination bracket for {tournament.name}.
          </p>
        </div>

        <div className="nexa-card p-6 mb-8">
          <BracketTree matches={matches} />
        </div>

      </div>
    </div>
  );
}

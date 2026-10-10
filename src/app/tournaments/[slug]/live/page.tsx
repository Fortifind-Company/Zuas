import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentBySlug, getMatches } from '@/lib/db';
import { Tv, Radio, ArrowLeft, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentSlugLivePage({
  params,
}: {
  params: { slug: string };
}) {
  const tournament = getTournamentBySlug(params.slug);
  if (!tournament) return notFound();

  const matches = getMatches(tournament.id);
  const liveMatches = matches.filter(m => m.streamStatus === 'LIVE' || m.status === 'LIVE');

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
            Live Arena — {tournament.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Twitch match broadcasts for {tournament.name}.
          </p>
        </div>

        {liveMatches.length === 0 ? (
          <div className="nexa-card p-12 text-center text-zinc-500">
            <Tv className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <h4 className="text-lg font-bold text-zinc-800 mb-1">No Active Live Streams</h4>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-4">
              Matches are currently scheduled or waiting for player broadcasts to be verified.
            </p>
            <Link href={`/tournaments/${tournament.slug}/bracket`} className="nexa-btn-secondary text-xs">
              Check Bracket Schedule →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveMatches.map((match) => (
              <div key={match.id} className="nexa-card p-6 border-rose-300 ring-2 ring-rose-500/10">
                <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-zinc-100">
                  <span className="font-bold text-zinc-500">{match.roundName}</span>
                  <span className="font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-full">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="font-extrabold text-base text-zinc-950">{match.participant1Name || 'Player 1'}</span>
                  <span className="font-mono text-xl font-black text-emerald-600">
                    {match.participant1Score} - {match.participant2Score}
                  </span>
                  <span className="font-extrabold text-base text-zinc-950">{match.participant2Name || 'Player 2'}</span>
                </div>

                <Link
                  href={`/matches/${match.id}`}
                  className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 transition font-bold text-xs text-center block"
                >
                  Watch Stream on Twitch →
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

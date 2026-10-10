import React from 'react';
import Link from 'next/link';
import { getTournaments } from '@/lib/db';
import { Trophy, Calendar, Users, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentsDirectoryPage() {
  const tournaments = getTournaments();

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Multi-Tournament Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              All Competitions & Seasons
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">
              Explore active championships, upcoming editions, and archived historical tournaments in Ghana.
            </p>
          </div>

          <Link href="/admin/tournaments/create" className="nexa-btn-primary text-xs">
            + Create New Tournament
          </Link>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t) => {
            const isActive = t.status === 'LIVE' || t.status === 'REGISTRATION_OPEN';

            return (
              <div key={t.id} className="nexa-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-zinc-500 uppercase tracking-wider text-[11px]">
                      {t.region}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'LIVE'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                          : t.status === 'REGISTRATION_OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-zinc-950 mb-1">{t.name}</h3>
                  <span className="text-xs font-semibold text-zinc-500 block mb-3">{t.edition}</span>
                  <p className="text-xs text-zinc-600 line-clamp-3 mb-6 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs mb-6">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">Max Players</span>
                      <span className="font-bold text-zinc-900">{t.maxParticipants} Slots</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px]">Sponsor Rewards</span>
                      <span className="font-bold text-zinc-900">GH₵{t.prizePoolGhc}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <Link
                    href={`/tournaments/${t.slug}`}
                    className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 transition text-xs font-semibold text-center block"
                  >
                    View Tournament Overview →
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/tournaments/${t.slug}/bracket`}
                      className="py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold text-center block"
                    >
                      Bracket
                    </Link>
                    <Link
                      href={`/tournaments/${t.slug}/register`}
                      className="py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold text-center block"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

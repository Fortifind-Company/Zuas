import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTournamentBySlug, getMatches, getAnnouncements, getRegistrations } from '@/lib/db';
import { Trophy, Calendar, Users, Shield, Tv, Clock, ArrowRight, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tournament = getTournamentBySlug(params.slug);
  if (!tournament) return notFound();

  const matches = getMatches(tournament.id);
  const announcements = getAnnouncements(tournament.id);
  const registrations = getRegistrations(tournament.id);
  const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-3">
              <span>{tournament.region}</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">{tournament.status}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              {tournament.name}
            </h1>
            <p className="text-zinc-600 mt-1 text-sm">{tournament.edition}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/tournaments/${tournament.slug}/bracket`}
              className="nexa-btn-secondary text-xs"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              View Bracket
            </Link>
            <Link
              href={`/tournaments/${tournament.slug}/register`}
              className="nexa-btn-primary text-xs"
            >
              Register Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Registered Players
            </span>
            <span className="text-2xl font-black text-zinc-950 block">
              {approvedCount} / {tournament.maxParticipants}
            </span>
            <span className="text-[11px] text-zinc-500 block mt-1">Confirmed participants</span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Format
            </span>
            <span className="text-lg font-bold text-zinc-950 block">{tournament.format.replace('_', ' ')}</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Single Match Knockout</span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Sponsor Rewards
            </span>
            <span className="text-2xl font-black text-zinc-950">GH₵{tournament.prizePoolGhc}</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Non-Cash Top 3 Pool</span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Entry Cost
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono">GH₵0.00</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Free to Enter (Ghana)</span>
          </div>
        </div>

        {/* Overview & Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="nexa-card p-8">
              <h2 className="text-xl font-bold text-zinc-950 mb-3">Tournament Description</h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line mb-6">
                {tournament.description}
              </p>

              <h3 className="text-base font-bold text-zinc-950 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-700" />
                Tournament Rules
              </h3>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
                {tournament.rules}
              </div>
            </div>

            {/* Quick links to matches & bracket */}
            <div className="flex gap-4">
              <Link
                href={`/tournaments/${tournament.slug}/bracket`}
                className="flex-1 nexa-card p-5 text-center hover:bg-zinc-50 transition"
              >
                <Trophy className="w-6 h-6 mx-auto text-amber-500 mb-2" />
                <span className="text-sm font-bold text-zinc-950 block">Knockout Bracket</span>
                <span className="text-xs text-zinc-500">View stages & seedings</span>
              </Link>
              <Link
                href={`/tournaments/${tournament.slug}/live`}
                className="flex-1 nexa-card p-5 text-center hover:bg-zinc-50 transition"
              >
                <Tv className="w-6 h-6 mx-auto text-rose-500 mb-2" />
                <span className="text-sm font-bold text-zinc-950 block">Live Arena</span>
                <span className="text-xs text-zinc-500">Watch Twitch broadcasts</span>
              </Link>
            </div>
          </div>

          {/* Announcements sidebar */}
          <div className="space-y-6">
            <div className="nexa-card p-6">
              <h3 className="text-base font-bold text-zinc-950 mb-4">Announcements</h3>
              {announcements.length === 0 ? (
                <p className="text-xs text-zinc-400">No announcements posted for this tournament yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((a) => (
                    <div key={a.id} className="pb-3 border-b border-zinc-100 last:border-b-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                        {a.category}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-900">{a.title}</h4>
                      <p className="text-[11px] text-zinc-600 mt-1">{a.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="nexa-card p-6 bg-zinc-950 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
                Sponsor Rewards
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{tournament.sponsorInfo}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

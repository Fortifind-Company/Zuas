import React from 'react';
import Link from 'next/link';
import { getFeaturedTournament, getMatches, getAnnouncements, getRegistrations } from '@/lib/db';
import { Trophy, Calendar, Users, Shield, Tv, Clock, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TournamentPage() {
  const tournament = getFeaturedTournament();
  const matches = getMatches(tournament.id);
  const announcements = getAnnouncements(tournament.id);
  const registrations = getRegistrations(tournament.id);

  const approvedPlayers = registrations.filter(r => r.status === 'APPROVED');
  const completedMatches = matches.filter(m => m.status === 'COMPLETED');
  const scheduledMatches = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'LIVE');

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip */}
        <div className="border-b border-zinc-200 pb-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold mb-3">
              <span>{tournament.region}</span>
              <span>·</span>
              <span className="text-emerald-700">{tournament.status}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              {tournament.name}
            </h1>
            <p className="text-zinc-600 mt-1 text-base">{tournament.edition}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/bracket" className="nexa-btn-secondary text-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              Tournament Bracket
            </Link>
            <Link href="/register" className="nexa-btn-primary text-sm">
              Register Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Participants
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-zinc-950">{approvedPlayers.length}</span>
              <span className="text-xs text-zinc-500 font-medium">/ {tournament.maxParticipants} Max</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              {approvedPlayers.length >= tournament.maxParticipants ? 'Slots Full' : 'Registration Active'}
            </span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Competition Format
            </span>
            <span className="text-lg font-bold text-zinc-950 block">Single Elimination</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Knockout Stage (10 min)</span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Sponsor Rewards
            </span>
            <span className="text-2xl font-black text-zinc-950">GH₵{tournament.prizePoolGhc}</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Non-Cash Top 3 Awards</span>
          </div>

          <div className="nexa-card p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Entry Processing
            </span>
            <span className="text-2xl font-black text-emerald-600 font-mono">GH₵0.00</span>
            <span className="text-[11px] text-zinc-500 block mt-1">Free to Enter (Ghana)</span>
          </div>
        </div>

        {/* Tournament Description & Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="nexa-card p-8">
              <h2 className="text-xl font-black text-zinc-950 mb-3">About this Tournament</h2>
              <p className="text-zinc-600 leading-relaxed text-sm whitespace-pre-line mb-6">
                {tournament.description}
              </p>

              <h3 className="text-base font-bold text-zinc-950 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-700" />
                Competition Rules & Match Duration
              </h3>
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed">
                {tournament.rules}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  Starts: {new Date(tournament.startDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Timezone: {tournament.timezone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-zinc-400" />
                  Organizer: Accra Esports League
                </span>
              </div>
            </div>

            {/* Upcoming Fixtures */}
            <div className="nexa-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-zinc-950">Current Phase Fixtures</h3>
                <Link href="/live" className="text-xs font-bold text-zinc-900 hover:underline">
                  Live Arena →
                </Link>
              </div>

              <div className="space-y-3">
                {scheduledMatches.slice(0, 5).map((match) => (
                  <div
                    key={match.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {match.roundName} · Match #{match.matchNumber}
                      </span>
                      <span className="text-sm font-bold text-zinc-900">
                        {match.participant1Name || 'TBD'} vs {match.participant2Name || 'TBD'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700">
                        {match.status}
                      </span>
                      <Link
                        href={`/matches/${match.id}`}
                        className="nexa-btn-secondary text-xs px-3 py-1.5"
                      >
                        Watch
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Announcements & Sponsor Info */}
          <div className="space-y-6">
            <div className="nexa-card p-6">
              <h3 className="text-base font-bold text-zinc-950 mb-4">Official Announcements</h3>
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="pb-4 border-b border-zinc-100 last:border-b-0 last:pb-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 mb-1 inline-block">
                      {ann.category}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 mt-1">{ann.title}</h4>
                    <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-zinc-400 mt-2 block">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nexa-card p-6 bg-zinc-950 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
                Sponsor Rewards
              </span>
              <h4 className="text-lg font-bold mb-2">Non-Cash Prize Distribution</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {tournament.sponsorInfo}
              </p>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                ⚠️ In accordance with tournament rules, no cash deposits or gambling wagers are permitted. Awards are supported by local gaming sponsors.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

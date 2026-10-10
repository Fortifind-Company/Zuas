'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentRegistration, TournamentMatch } from '@/lib/types';
import {
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Tv,
  PlusCircle,
  Eye,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tRes, rRes, mRes] = await Promise.all([
        fetch('/api/tournaments'),
        fetch('/api/registrations'),
        fetch('/api/tournaments/efootball-mobile-ghana-championship-s1/bracket'),
      ]);

      const [tJson, rJson, mJson] = await Promise.all([tRes.json(), rRes.json(), mRes.json()]);

      if (tJson.success) setTournaments(tJson.data || []);
      if (rJson.success) setRegistrations(rJson.data || []);
      if (mJson.success) setMatches(mJson.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (registrationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, status }),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations(prev =>
          prev.map(r => (r.id === registrationId ? { ...r, status } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmedCount = registrations.filter(r => r.status === 'APPROVED').length;
  const pendingCount = registrations.filter(r => r.status === 'PENDING').length;
  const liveCount = matches.filter(m => m.streamStatus === 'LIVE').length;

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">Tournament Dashboard</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Overview of multi-tournament operations, player rosters, and live broadcasts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/tournaments/create"
                className="nexa-btn-primary text-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Create Tournament
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="nexa-card p-5 bg-white">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Total Registrations
              </span>
              <span className="text-3xl font-black text-zinc-950">{registrations.length}</span>
              <span className="text-[10px] text-zinc-500 block mt-1">Across all tournaments</span>
            </div>

            <div className="nexa-card p-5 bg-white">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Confirmed Players
              </span>
              <span className="text-3xl font-black text-emerald-600">{confirmedCount}</span>
              <span className="text-[10px] text-zinc-500 block mt-1">Ready for bracket seeding</span>
            </div>

            <div className="nexa-card p-5 bg-white">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Pending Review
              </span>
              <span className="text-3xl font-black text-amber-600">{pendingCount}</span>
              <span className="text-[10px] text-zinc-500 block mt-1">Awaiting referee approval</span>
            </div>

            <div className="nexa-card p-5 bg-white">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Live Broadcasts
              </span>
              <span className="text-3xl font-black text-rose-600">{liveCount}</span>
              <span className="text-[10px] text-zinc-500 block mt-1">Active Twitch channels</span>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="nexa-card p-6 bg-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-base text-zinc-950">Recent Registrations</h3>
              <Link href="/admin/registrations" className="text-xs font-bold text-zinc-600 hover:text-zinc-950">
                View All Registrations →
              </Link>
            </div>

            {registrations.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No registrations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Player Name</th>
                      <th className="py-2.5 px-3">Gamer Tag</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {registrations.slice(0, 8).map((reg) => (
                      <tr key={reg.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 px-3 font-semibold text-zinc-900">{reg.fullName}</td>
                        <td className="py-3 px-3 font-bold text-zinc-950">{reg.displayName}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-700">
                            {reg.platform}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-zinc-500 font-mono">{reg.phone}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              reg.status === 'APPROVED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : reg.status === 'REJECTED'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, 'APPROVED')}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                title="Approve Player"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {reg.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, 'REJECTED')}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                                title="Reject Player"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tournaments Snapshot */}
          <div className="nexa-card p-6 bg-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-base text-zinc-950">All Tournaments</h3>
              <Link href="/admin/tournaments" className="text-xs font-bold text-zinc-600 hover:text-zinc-950">
                Manage Tournaments →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((t) => (
                <div key={t.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-zinc-400 text-[10px] uppercase">{t.region}</span>
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                        {t.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-zinc-950">{t.name}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.edition}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">{t.maxParticipants} max participants</span>
                    <Link
                      href={`/tournaments/${t.slug}`}
                      className="font-bold text-zinc-900 hover:underline flex items-center gap-1"
                    >
                      <span>Public URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

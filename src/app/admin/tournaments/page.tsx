'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentStatus } from '@/lib/types';
import {
  Trophy,
  PlusCircle,
  Copy,
  Archive,
  ExternalLink,
  Edit,
  Play,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const json = await res.json();
      if (json.success) setTournaments(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleStatusChange = async (slug: string, newStatus: TournamentStatus) => {
    try {
      const res = await fetch(`/api/tournaments/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setTournaments(prev =>
          prev.map(t => (t.slug === slug ? { ...t, status: newStatus } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (slug: string) => {
    if (!confirm('Duplicate this tournament configuration? (Note: participants and match results will NOT be copied)')) return;
    try {
      const res = await fetch(`/api/tournaments/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DUPLICATE' }),
      });
      const json = await res.json();
      if (json.success) {
        fetchTournaments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">All Tournaments</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage tournament lifecycles, statuses, duplicates, and archives.
              </p>
            </div>

            <Link href="/admin/tournaments/create" className="nexa-btn-primary text-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Create Tournament
            </Link>
          </div>

          {/* Tournaments List */}
          <div className="space-y-4">
            {tournaments.map((t) => (
              <div key={t.id} className="nexa-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 uppercase">
                      {t.region}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        t.status === 'LIVE'
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : t.status === 'REGISTRATION_OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-zinc-950">{t.name}</h3>
                  <p className="text-xs text-zinc-500">{t.edition}</p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                    <span>{t.maxParticipants} Max Slots</span>
                    <span>·</span>
                    <span>{t.format.replace('_', ' ')}</span>
                    <span>·</span>
                    <Link
                      href={`/tournaments/${t.slug}`}
                      target="_blank"
                      className="text-zinc-900 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Public Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Actions & Lifecycle transitions */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.slug, e.target.value as TournamentStatus)}
                    className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold bg-zinc-50 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                    <option value="REGISTRATION_CLOSED">REGISTRATION CLOSED</option>
                    <option value="READY">READY</option>
                    <option value="LIVE">LIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button
                    onClick={() => handleDuplicate(t.slug)}
                    className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1 transition"
                    title="Duplicate Tournament Settings (Starts fresh without copying participants)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentRegistration } from '@/lib/types';
import { Users, Check, X, Filter } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournId, setSelectedTournId] = useState<string>('');
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setTournaments(json.data);
          setSelectedTournId(json.data[0].id);
        }
      });
  }, []);

  const fetchRegistrations = async () => {
    try {
      const url = selectedTournId
        ? `/api/registrations?tournamentId=${selectedTournId}`
        : '/api/registrations';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setRegistrations(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedTournId]);

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

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">Registration Management</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Review applicant player profiles, verify gamer IDs, and approve tournament entry.
              </p>
            </div>

            {/* Tournament Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-600">Select Tournament:</span>
              <select
                value={selectedTournId}
                onChange={(e) => setSelectedTournId(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold bg-white text-zinc-950 focus:outline-none"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="nexa-card p-6 bg-white">
            {registrations.length === 0 ? (
              <p className="text-xs text-zinc-400 py-12 text-center">
                No player registrations recorded for this tournament.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Full Legal Name</th>
                      <th className="py-2.5 px-3">Tournament Gamer Tag</th>
                      <th className="py-2.5 px-3">eFootball In-Game ID</th>
                      <th className="py-2.5 px-3">Platform</th>
                      <th className="py-2.5 px-3">Contact Phone</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 px-3 font-semibold text-zinc-900">{reg.fullName}</td>
                        <td className="py-3 px-3 font-bold text-zinc-950">{reg.displayName}</td>
                        <td className="py-3 px-3 font-mono text-zinc-600">{reg.inGameId}</td>
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
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                            )}
                            {reg.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(reg.id, 'REJECTED')}
                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                Reject
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

        </div>
      </main>
    </div>
  );
}

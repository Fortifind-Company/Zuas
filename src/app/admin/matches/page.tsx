'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentMatch } from '@/lib/types';
import { Swords, Check, Trophy, Radio, AlertCircle } from 'lucide-react';

export default function AdminMatchesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournSlug, setSelectedTournSlug] = useState<string>('');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit match state
  const [editingMatch, setEditingMatch] = useState<TournamentMatch | null>(null);
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);
  const [winnerId, setWinnerId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setTournaments(json.data);
          setSelectedTournSlug(json.data[0].slug);
        }
      });
  }, []);

  const fetchMatches = async () => {
    if (!selectedTournSlug) return;
    try {
      const res = await fetch(`/api/tournaments/${selectedTournSlug}/bracket`);
      const json = await res.json();
      if (json.success) setMatches(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedTournSlug]);

  const handleOpenScoreModal = (match: TournamentMatch) => {
    setEditingMatch(match);
    setScore1(match.participant1Score);
    setScore2(match.participant2Score);
    setWinnerId(match.winnerId || match.participant1Id || '');
  };

  const handleSaveScore = async () => {
    if (!editingMatch || !winnerId) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/matches/${editingMatch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SCORE',
          winnerId,
          score1: Number(score1),
          score2: Number(score2),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setEditingMatch(null);
        fetchMatches();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
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
              <h1 className="text-2xl font-black text-zinc-950">Match Manager & Scores</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Record verified final results and advance winners in the single-elimination tree.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-600">Select Tournament:</span>
              <select
                value={selectedTournSlug}
                onChange={(e) => setSelectedTournSlug(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold bg-white text-zinc-950 focus:outline-none"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matches List */}
          <div className="nexa-card p-6 bg-white space-y-4">
            {matches.length === 0 ? (
              <p className="text-xs text-zinc-400 py-12 text-center">
                No matches generated yet. Go to Bracket Generator to build the tree.
              </p>
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="font-bold text-zinc-400 text-[10px] uppercase">
                          {m.roundName} · Match #{m.matchNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'LIVE'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm font-bold text-zinc-950">
                        <span className={m.winnerId === m.participant1Id ? 'text-emerald-600' : ''}>
                          {m.participant1Name || 'TBD'} ({m.participant1Score})
                        </span>
                        <span className="text-zinc-400 font-normal">vs</span>
                        <span className={m.winnerId === m.participant2Id ? 'text-emerald-600' : ''}>
                          {m.participant2Name || 'TBD'} ({m.participant2Score})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenScoreModal(m)}
                        className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 transition text-xs font-bold"
                      >
                        Set Score & Advance Winner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Score Modal */}
          {editingMatch && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-950">Record Match Score</h3>
                  <p className="text-xs text-zinc-500">
                    {editingMatch.roundName} · Match #{editingMatch.matchNumber}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1 truncate">
                        {editingMatch.participant1Name || 'Player 1'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score1}
                        onChange={(e) => setScore1(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 font-mono text-base font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1 truncate">
                        {editingMatch.participant2Name || 'Player 2'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score2}
                        onChange={(e) => setScore2(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 font-mono text-base font-bold text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Declare Advancing Winner
                    </label>
                    <select
                      value={winnerId}
                      onChange={(e) => setWinnerId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold bg-zinc-50"
                    >
                      {editingMatch.participant1Id && (
                        <option value={editingMatch.participant1Id}>
                          {editingMatch.participant1Name || 'Player 1'}
                        </option>
                      )}
                      {editingMatch.participant2Id && (
                        <option value={editingMatch.participant2Id}>
                          {editingMatch.participant2Name || 'Player 2'}
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setEditingMatch(null)}
                    className="nexa-btn-secondary text-xs flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveScore}
                    disabled={saving}
                    className="nexa-btn-primary text-xs flex-1"
                  >
                    {saving ? 'Saving...' : 'Save & Advance'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

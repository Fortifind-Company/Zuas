'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentMatch, MatchEvidence } from '@/lib/types';
import { Swords, Check, Trophy, Radio, AlertCircle, Camera, CheckCircle2, XCircle, Eye, Clock } from 'lucide-react';

export default function AdminMatchesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournSlug, setSelectedTournSlug] = useState<string>('');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [evidenceList, setEvidenceList] = useState<MatchEvidence[]>([]);
  const [activeTab, setActiveTab] = useState<'MATCHES' | 'EVIDENCE'>('MATCHES');
  const [loading, setLoading] = useState(true);

  // Edit match state
  const [editingMatch, setEditingMatch] = useState<TournamentMatch | null>(null);
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);
  const [winnerId, setWinnerId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Preview screenshot state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

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

  const fetchEvidence = async () => {
    try {
      const res = await fetch('/api/evidence');
      const json = await res.json();
      if (json.success) setEvidenceList(json.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchEvidence();
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

  const handleReviewEvidence = async (evidenceId: string, decision: 'APPROVED' | 'REJECTED') => {
    setReviewingId(evidenceId);
    try {
      const res = await fetch('/api/evidence', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidenceId,
          decision,
          reviewedBy: 'Admin Referee',
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchEvidence();
        fetchMatches();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewingId(null);
    }
  };

  const pendingEvidenceCount = evidenceList.filter(e => e.status === 'PENDING').length;

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">Match Manager & Referee Control</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Verify player screenshots, approve match results, and advance winners in the single-elimination tree.
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

          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
            <button
              onClick={() => setActiveTab('MATCHES')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeTab === 'MATCHES'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              Fixtures & Scores ({matches.length})
            </button>

            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'EVIDENCE'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-500" />
              <span>Screenshot Submissions</span>
              {pendingEvidenceCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-zinc-950">
                  {pendingEvidenceCount} New
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Matches List */}
          {activeTab === 'MATCHES' && (
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
                          {m.evidence && m.evidence.length > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                              <Camera className="w-3 h-3" /> {m.evidence.length} Proof Attached
                            </span>
                          )}
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
                          Manual Score Override
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Evidence Review */}
          {activeTab === 'EVIDENCE' && (
            <div className="space-y-4">
              {evidenceList.length === 0 ? (
                <div className="nexa-card p-12 bg-white text-center text-zinc-400 text-xs">
                  <Camera className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
                  No player match screenshot evidence submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evidenceList.map((ev) => (
                    <div
                      key={ev.id}
                      className="nexa-card p-5 bg-white border border-zinc-200 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-zinc-950 block">
                            Submitted by {ev.submittedBy}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(ev.submittedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ev.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>

                      {/* Reported Scores */}
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                        <span className="text-zinc-600">Reported Final Score:</span>
                        <span className="text-base font-black text-zinc-950 font-mono">
                          {ev.reportedScore1} - {ev.reportedScore2}
                        </span>
                      </div>

                      {/* Screenshot Preview */}
                      {ev.screenshotUrl && (
                        <div
                          className="relative cursor-pointer group"
                          onClick={() => setPreviewImage(ev.screenshotUrl)}
                        >
                          <img
                            src={ev.screenshotUrl}
                            alt="Match Screenshot Proof"
                            className="w-full h-40 object-cover rounded-xl border border-zinc-200 group-hover:opacity-90 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" /> Tap to Enlarge
                          </div>
                        </div>
                      )}

                      {ev.notes && (
                        <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                          &ldquo;{ev.notes}&rdquo;
                        </p>
                      )}

                      {/* Referee Actions */}
                      {ev.status === 'PENDING' ? (
                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                          <button
                            onClick={() => handleReviewEvidence(ev.id, 'APPROVED')}
                            disabled={reviewingId === ev.id}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve & Advance Winner
                          </button>
                          <button
                            onClick={() => handleReviewEvidence(ev.id, 'REJECTED')}
                            disabled={reviewingId === ev.id}
                            className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-rose-50 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-zinc-200"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                          Reviewed by {ev.reviewedBy} at {ev.reviewedAt ? new Date(ev.reviewedAt).toLocaleTimeString() : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {/* Full Screenshot Zoom Modal */}
          {previewImage && (
            <div
              onClick={() => setPreviewImage(null)}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            >
              <img
                src={previewImage}
                alt="Full Screenshot"
                className="max-w-4xl max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

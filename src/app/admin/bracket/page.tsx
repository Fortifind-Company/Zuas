'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import BracketTree from '@/components/BracketTree';
import GroupStageTable from '@/components/GroupStageTable';
import { Tournament, TournamentMatch, TournamentGroup } from '@/lib/types';
import { Trophy, RefreshCw, AlertTriangle, CheckCircle, Layers } from 'lucide-react';

export default function AdminBracketPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournSlug, setSelectedTournSlug] = useState<string>('');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [groups, setGroups] = useState<TournamentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const fetchTournamentData = async () => {
    if (!selectedTournSlug) return;
    try {
      const [bRes, gRes] = await Promise.all([
        fetch(`/api/tournaments/${selectedTournSlug}/bracket`).then(r => r.json()),
        fetch(`/api/tournaments/${selectedTournSlug}/groups`).then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      if (bRes.success) setMatches(bRes.data || []);
      if (gRes.success) setGroups(gRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentData();
  }, [selectedTournSlug]);

  const currentTourn = tournaments.find(t => t.slug === selectedTournSlug);

  const handleGenerateBracket = async () => {
    if (!confirm('Generate/Regenerate bracket? Existing match score data for this tournament will be refreshed.')) {
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/tournaments/${selectedTournSlug}/bracket`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success) {
        setMatches(json.data || []);
        setMessage('Single elimination bracket successfully generated!');
      } else {
        alert(json.error || 'Failed to generate bracket.');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateGroupStage = async () => {
    if (!confirm('Generate round-robin groups and fixtures? Existing group data will be refreshed.')) {
      return;
    }

    setGenerating(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/tournaments/${selectedTournSlug}/groups`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success) {
        setGroups(json.data?.groups || []);
        setMatches(json.data?.matches || []);
        setMessage('Group stage and fixtures successfully generated!');
      } else {
        alert(json.error || 'Failed to generate group stage.');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setGenerating(false);
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-zinc-950">Stages & Bracket Engine</h1>
                {currentTourn && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                    {currentTourn.format}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Generate single-elimination trees or round-robin group stages with real-time standings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

              <button
                onClick={handleGenerateGroupStage}
                disabled={generating}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generate Groups</span>
              </button>

              <button
                onClick={handleGenerateBracket}
                disabled={generating}
                className="nexa-btn-primary text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'Generating...' : 'Generate Bracket'}</span>
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {/* Group Tables Preview if Groups exist */}
          {groups.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-zinc-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Group Stage Standings Preview
              </h3>
              <GroupStageTable
                groups={groups}
                matches={matches.filter(m => m.stageType === 'GROUP')}
                tournamentSlug={selectedTournSlug}
              />
            </div>
          )}

          {/* Bracket Canvas Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-zinc-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-950" />
              Knockout Stage Bracket
            </h3>
            <div className="nexa-card p-6 bg-white">
              <BracketTree matches={matches.filter(m => m.stageType !== 'GROUP')} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

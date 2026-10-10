'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import BracketTree from '@/components/BracketTree';
import { Tournament, TournamentMatch } from '@/lib/types';
import { Trophy, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminBracketPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournSlug, setSelectedTournSlug] = useState<string>('');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
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

  const fetchBracket = async () => {
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
    fetchBracket();
  }, [selectedTournSlug]);

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

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">Bracket Generator</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Generate single-elimination tournament structures with seeds and power-of-two byes.
              </p>
            </div>

            <div className="flex items-center gap-3">
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
                onClick={handleGenerateBracket}
                disabled={generating}
                className="nexa-btn-primary text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                {generating ? 'Generating...' : 'Generate / Reset Bracket'}
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {/* Bracket Canvas Card */}
          <div className="nexa-card p-6 bg-white">
            <BracketTree matches={matches} />
          </div>

        </div>
      </main>
    </div>
  );
}

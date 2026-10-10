'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, TournamentMatch, StreamStatus } from '@/lib/types';
import { extractTwitchChannel } from '@/lib/twitch';
import { Tv, Radio, CheckCircle, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminStreamsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournSlug, setSelectedTournSlug] = useState<string>('');
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit stream state
  const [selectedMatch, setSelectedMatch] = useState<TournamentMatch | null>(null);
  const [channelInput, setChannelInput] = useState<string>('');
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('CONFIGURED');
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

  const handleOpenAssignModal = (m: TournamentMatch) => {
    setSelectedMatch(m);
    setChannelInput(m.twitchChannel || '');
    setStreamStatus(m.streamStatus || 'CONFIGURED');
  };

  const handleSaveStream = async () => {
    if (!selectedMatch) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/matches/${selectedMatch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'STREAM',
          twitchChannel: channelInput,
          streamStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedMatch(null);
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
              <h1 className="text-2xl font-black text-zinc-950">Twitch Stream Management</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Verify player mobile broadcasts, associate Twitch channels, and control Live Arena broadcast states.
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

          {/* Matches Streaming Grid */}
          <div className="nexa-card p-6 bg-white space-y-4">
            <h3 className="font-extrabold text-base text-zinc-950 pb-2 border-b border-zinc-100">
              Tournament Fixtures Stream Status
            </h3>

            <div className="space-y-3">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">
                        {m.roundName} · #{m.matchNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.streamStatus === 'LIVE'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                            : m.streamStatus === 'CONFIGURED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : m.streamStatus === 'ENDED'
                            ? 'bg-zinc-200 text-zinc-700'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {m.streamStatus}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-950">
                      {m.participant1Name || 'TBD'} vs {m.participant2Name || 'TBD'}
                    </h4>

                    {m.twitchChannel ? (
                      <span className="text-xs text-purple-700 font-mono font-semibold block mt-1">
                        twitch.tv/{m.twitchChannel}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 block mt-1">No channel assigned</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAssignModal(m)}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 transition text-xs font-bold"
                    >
                      Assign / Update Stream
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal */}
          {selectedMatch && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-950">Configure Match Broadcast</h3>
                  <p className="text-xs text-zinc-500">
                    {selectedMatch.roundName} · Match #{selectedMatch.matchNumber}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Twitch Channel URL or Username
                    </label>
                    <input
                      type="text"
                      value={channelInput}
                      onChange={(e) => setChannelInput(e.target.value)}
                      placeholder="e.g. kingpro_gh or https://twitch.tv/kingpro_gh"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-[10px] text-zinc-400 block mt-1">
                      Extracts verified username automatically.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Broadcast Status
                    </label>
                    <select
                      value={streamStatus}
                      onChange={(e) => setStreamStatus(e.target.value as StreamStatus)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold bg-zinc-50"
                    >
                      <option value="NONE">NONE (No Stream)</option>
                      <option value="CONFIGURED">CONFIGURED (Waiting for Player)</option>
                      <option value="LIVE">LIVE (Broadcasting Now)</option>
                      <option value="ENDED">ENDED (Broadcast Finished)</option>
                      <option value="UNAVAILABLE">UNAVAILABLE (Offline/Dropped)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="nexa-btn-secondary text-xs flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStream}
                    disabled={saving}
                    className="nexa-btn-primary text-xs flex-1"
                  >
                    {saving ? 'Saving...' : 'Save Stream Settings'}
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

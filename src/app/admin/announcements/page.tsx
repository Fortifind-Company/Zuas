'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Tournament, Announcement } from '@/lib/types';
import { Megaphone, Plus, Pin } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournId, setSelectedTournId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'URGENT' | 'SCHEDULE' | 'GENERAL' | 'STREAM'>('GENERAL');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.success) setAnnouncements(json.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: selectedTournId,
          title,
          content,
          category,
          isPinned,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setTitle('');
        setContent('');
        setIsPinned(false);
        fetchAnnouncements();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-zinc-950">Tournament Announcements</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Publish urgent notices, schedule updates, or stream alerts to the public website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Create form */}
            <div className="md:col-span-5 nexa-card p-6 bg-white">
              <h3 className="font-extrabold text-sm text-zinc-950 mb-3">Publish New Announcement</h3>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    Select Tournament
                  </label>
                  <select
                    value={selectedTournId}
                    onChange={(e) => setSelectedTournId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold"
                  >
                    {tournaments.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Quarter Finals Streaming Now"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs"
                  >
                    <option value="GENERAL">GENERAL</option>
                    <option value="URGENT">URGENT</option>
                    <option value="SCHEDULE">SCHEDULE</option>
                    <option value="STREAM">STREAM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase mb-1">
                    Content
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Detailed notice text..."
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded"
                  />
                  <span>Pin to top banner on Homepage</span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full nexa-btn-primary py-2.5 text-xs justify-center"
                >
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </form>
            </div>

            {/* List */}
            <div className="md:col-span-7 nexa-card p-6 bg-white space-y-3">
              <h3 className="font-extrabold text-sm text-zinc-950 mb-2">Existing Announcements</h3>

              {announcements.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {a.category}
                    </span>
                    {a.isPinned && (
                      <span className="flex items-center gap-1 font-bold text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-zinc-900 mt-1">{a.title}</h4>
                  <p className="text-zinc-600 mt-0.5 leading-relaxed">{a.content}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

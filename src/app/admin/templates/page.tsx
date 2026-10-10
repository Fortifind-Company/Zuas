'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { TournamentTemplate } from '@/lib/types';
import { FileText, PlusCircle, Play, CheckCircle2 } from 'lucide-react';

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TournamentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for launching tournament from template
  const [selectedTemplate, setSelectedTemplate] = useState<TournamentTemplate | null>(null);
  const [newTournName, setNewTournName] = useState('');
  const [newEdition, setNewEdition] = useState('');
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(json => {
        if (json.success) setTemplates(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !newTournName.trim()) return;
    setLaunching(true);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_TOURNAMENT',
          templateId: selectedTemplate.id,
          name: newTournName,
          edition: newEdition || 'New Edition',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedTemplate(null);
        router.push('/admin/tournaments');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <h1 className="text-2xl font-black text-zinc-950">Tournament Templates</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Reusable competition blueprints to launch new seasons in seconds without copying past player state.
            </p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tpl) => (
              <div key={tpl.id} className="nexa-card p-6 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-zinc-400 uppercase text-[10px]">
                      {tpl.gamePlatform}
                    </span>
                    {tpl.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Default Template
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-zinc-950 mb-1">{tpl.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4">{tpl.description}</p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs mb-4">
                    <div>
                      <span className="text-zinc-400 text-[10px] block">Capacity</span>
                      <span className="font-bold text-zinc-900">{tpl.maxParticipants} Players</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] block">Format</span>
                      <span className="font-bold text-zinc-900">{tpl.format.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTemplate(tpl);
                    setNewTournName(`${tpl.name} — Season 2`);
                    setNewEdition('Season 2');
                  }}
                  className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 transition text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start New Tournament from Template</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Launch Modal */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-950">Launch Tournament</h3>
                  <p className="text-xs text-zinc-500">
                    From template: <strong>{selectedTemplate.name}</strong>
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      New Tournament Name
                    </label>
                    <input
                      type="text"
                      value={newTournName}
                      onChange={(e) => setNewTournName(e.target.value)}
                      placeholder="e.g. Accra City Championship 2025"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Edition / Season Label
                    </label>
                    <input
                      type="text"
                      value={newEdition}
                      onChange={(e) => setNewEdition(e.target.value)}
                      placeholder="e.g. Season 2"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="nexa-btn-secondary text-xs flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFromTemplate}
                    disabled={launching}
                    className="nexa-btn-primary text-xs flex-1"
                  >
                    {launching ? 'Creating...' : 'Launch Tournament'}
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

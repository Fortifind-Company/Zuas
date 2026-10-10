'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { GlobalSettings } from '@/lib/types';
import { Sliders, Save, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(json => {
        if (json.success) setSettings(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex min-h-screen bg-zinc-100">
        <AdminSidebar />
        <main className="flex-1 p-8">Loading settings...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-zinc-950">Global Platform Settings</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Configure system-wide configurations distinct from individual tournament rules.
            </p>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Platform settings updated successfully!</span>
            </div>
          )}

          <div className="nexa-card p-8 bg-white">
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Platform Brand Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Default Timezone
                </label>
                <input
                  type="text"
                  value={settings.defaultTimezone}
                  onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Twitch Embed Allowed Parent Hostnames (Comma separated)
                </label>
                <input
                  type="text"
                  value={settings.twitchParentDomains.join(', ')}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      twitchParentDomains: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono text-xs"
                />
                <span className="text-[10px] text-zinc-400 block mt-1">
                  e.g. localhost, 127.0.0.1, zuas.vercel.app (Twitch requires exact parent host parameter)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={settings.contactWhatsapp}
                    onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Legal Disclaimer
                </label>
                <textarea
                  rows={3}
                  value={settings.rulesDisclaimer}
                  onChange={(e) => setSettings({ ...settings, rulesDisclaimer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="nexa-btn-primary text-xs flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

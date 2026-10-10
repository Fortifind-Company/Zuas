'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tv,
  Calendar,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

export default function CreateTournamentWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic
    name: '',
    edition: '2025 Accra Cup',
    description: '',
    bannerUrl: '/images/hero-banner.jpg',
    gameTitle: 'eFootball 2025 Mobile',
    gamePlatform: 'Android & iOS',
    region: 'Ghana 🇬🇭',
    
    // Step 2: Format & Capacity
    format: 'SINGLE_ELIMINATION' as 'SINGLE_ELIMINATION' | 'ROUND_ROBIN',
    maxParticipants: 16,
    registrationDeadline: '',

    // Step 3: Competition Config
    startDate: '',
    endDate: '',
    timezone: 'Africa/Accra (GMT)',
    rules: '1. All matches played on eFootball Mobile. 2. 10-Minute Friend Matches with Extra Time & PKs ON. 3. Final score screenshot uploaded to referee.',
    sponsorInfo: 'Community & Gaming Lounge Non-Cash Awards for Top 3.',
    prizePoolGhc: 500,

    // Step 4: Streaming
    isLiveArenaEnabled: true,
    defaultTwitchChannel: '',

    // Step 5: Lifecycle Status
    status: 'REGISTRATION_OPEN' as 'DRAFT' | 'REGISTRATION_OPEN',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === 1 && !formData.name.trim()) {
      return setError('Tournament name is required.');
    }
    if (step === 2 && !formData.maxParticipants) {
      return setError('Please configure tournament participant capacity.');
    }

    setStep(prev => prev + 1);
  };

  const handleSubmit = async (publishStatus: 'DRAFT' | 'REGISTRATION_OPEN') => {
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        status: publishStatus,
        maxParticipants: Number(formData.maxParticipants),
        prizePoolGhc: Number(formData.prizePoolGhc || 0),
      };

      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to create tournament.');
      }

      router.push('/admin/tournaments');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div>
              <h1 className="text-2xl font-black text-zinc-950">Tournament Creation Wizard</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Configure a new independent eFootball competition.
              </p>
            </div>
            <Link href="/admin/tournaments" className="text-xs font-bold text-zinc-600 hover:text-zinc-950">
              Cancel
            </Link>
          </div>

          {/* Stepper Header */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Format & Capacity' },
              { num: 3, label: 'Competition' },
              { num: 4, label: 'Streaming' },
              { num: 5, label: 'Review & Publish' },
            ].map((s) => (
              <div
                key={s.num}
                className={`p-2.5 rounded-xl border text-[11px] font-bold transition ${
                  step === s.num
                    ? 'bg-black text-white border-black'
                    : step > s.num
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-zinc-400 border-zinc-200'
                }`}
              >
                <span>Step {s.num}: {s.label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Step Form Box */}
          <div className="nexa-card p-8 bg-white">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-black text-zinc-950 mb-3">Step 1: Basic Information</h3>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. eFootball Mobile Kumasi Super Cup"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Edition / Season
                    </label>
                    <input
                      type="text"
                      name="edition"
                      value={formData.edition}
                      onChange={handleInputChange}
                      placeholder="e.g. Season 2 — Kumasi Series"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Region / Target Audience
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="e.g. Ghana 🇬🇭"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the tournament theme, qualifications, and glory..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="nexa-btn-primary text-xs">
                    Next: Format & Capacity →
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Format & Capacity */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-black text-zinc-950 mb-3">Step 2: Format & Capacity</h3>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Competition Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, format: 'SINGLE_ELIMINATION' }))}
                      className={`p-4 rounded-xl border text-left transition ${
                        formData.format === 'SINGLE_ELIMINATION'
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-xs block">Single Elimination (Knockout)</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        Definitive brackets: Round of 16, Quarter-finals, Semi-finals, Grand Final.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, format: 'ROUND_ROBIN' }))}
                      className={`p-4 rounded-xl border text-left transition ${
                        formData.format === 'ROUND_ROBIN'
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                      }`}
                    >
                      <span className="font-bold text-xs block">Round Robin (Group Stage)</span>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        Group tables with points, goal difference, and standings.
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Participant Capacity Options
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[4, 8, 16, 32, 64].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, maxParticipants: cap }))}
                        className={`py-3 rounded-xl border font-black text-sm transition ${
                          formData.maxParticipants === cap
                            ? 'bg-black text-white border-black'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        {cap} Players
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="nexa-btn-secondary text-xs">
                    ← Back
                  </button>
                  <button type="submit" className="nexa-btn-primary text-xs">
                    Next: Competition Config →
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Competition Config */}
            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-black text-zinc-950 mb-3">Step 3: Competition & Rules</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Default Time Zone
                    </label>
                    <input
                      type="text"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Sponsor Rewards Pool (GH₵ Non-Cash equivalent)
                  </label>
                  <input
                    type="number"
                    name="prizePoolGhc"
                    value={formData.prizePoolGhc}
                    onChange={handleInputChange}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="text-[10px] text-zinc-500 block mt-1">
                    No cash entry or gambling. Rewards are sponsored items, trophies, or non-cash perks for Top 3.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Match Rules & Procedures
                  </label>
                  <textarea
                    rows={3}
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="pt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="nexa-btn-secondary text-xs">
                    ← Back
                  </button>
                  <button type="submit" className="nexa-btn-primary text-xs">
                    Next: Streaming Config →
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Streaming */}
            {step === 4 && (
              <form onSubmit={handleNext} className="space-y-4">
                <h3 className="text-lg font-black text-zinc-950 mb-3">Step 4: Twitch Live Arena Integration</h3>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isLiveArenaEnabled"
                      checked={formData.isLiveArenaEnabled}
                      onChange={handleInputChange}
                      className="rounded border-zinc-300 text-black focus:ring-black"
                    />
                    <div>
                      <span className="font-bold text-xs text-zinc-900 block">Enable Twitch Live Arena</span>
                      <span className="text-[11px] text-zinc-500 block">
                        Allow administrators to link mobile player Twitch streams directly to fixtures.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
                  <span className="font-bold block">🟣 Free-First Twitch Protocol:</span>
                  <p className="text-[11px] text-purple-800 leading-relaxed">
                    Uses Twitch&apos;s standard player embed with verified parent domain configuration (localhost and production host). Zero paid streaming subscriptions or infrastructure costs required.
                  </p>
                </div>

                <div className="pt-6 flex justify-between">
                  <button type="button" onClick={() => setStep(3)} className="nexa-btn-secondary text-xs">
                    ← Back
                  </button>
                  <button type="submit" className="nexa-btn-primary text-xs">
                    Next: Review & Publish →
                  </button>
                </div>
              </form>
            )}

            {/* Step 5: Review & Publish */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-zinc-950">Step 5: Review & Confirm</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Verify configuration before making tournament live.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Tournament Name:</span>
                    <span className="font-bold text-zinc-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Edition:</span>
                    <span className="font-bold text-zinc-900">{formData.edition}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Format:</span>
                    <span className="font-bold text-zinc-900">{formData.format}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Capacity:</span>
                    <span className="font-bold text-zinc-900">{formData.maxParticipants} Players</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Rewards Pool:</span>
                    <span className="font-bold text-zinc-900">GH₵{formData.prizePoolGhc}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Live Arena:</span>
                    <span className="font-bold text-emerald-600">
                      {formData.isLiveArenaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="nexa-btn-secondary text-xs"
                  >
                    ← Back
                  </button>
                  <div className="flex-1 flex gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmit('DRAFT')}
                      className="nexa-btn-secondary flex-1 text-xs py-3"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmit('REGISTRATION_OPEN')}
                      className="nexa-btn-primary flex-1 text-xs py-3"
                    >
                      {submitting ? 'Creating...' : 'Publish Tournament (Open Reg)'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

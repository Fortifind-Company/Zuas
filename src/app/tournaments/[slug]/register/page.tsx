'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Tournament } from '@/lib/types';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TournamentSlugRegisterPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    phone: '',
    email: '',
    platform: 'Android' as 'Android' | 'iOS',
    inGameId: '',
    rulesAccepted: false,
  });

  useEffect(() => {
    fetch(`/api/tournaments/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setTournament(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rulesAccepted) {
      return setError('You must agree to the tournament rules.');
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/tournaments/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete registration.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-400">Loading registration...</div>;
  }

  if (!tournament) {
    return <div className="py-20 text-center text-zinc-400">Tournament not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          href={`/tournaments/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-950 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {tournament.name}</span>
        </Link>

        <div className="nexa-card p-6 sm:p-8">
          <div className="mb-6 pb-4 border-b border-zinc-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
              Free Registration
            </span>
            <h1 className="text-2xl font-black text-zinc-950">{tournament.name}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{tournament.edition}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-zinc-950">Registration Submitted!</h3>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Your entry for {tournament.name} is verified. Check the bracket to see your match schedule.
              </p>
              <div className="pt-4">
                <Link href={`/tournaments/${slug}/bracket`} className="nexa-btn-primary text-xs">
                  View Knockout Bracket →
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Kofi Mensah"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Gamer Tag / Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="e.g. KingPro GH"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="024 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="kofi@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  In-Game Player ID
                </label>
                <input
                  type="text"
                  name="inGameId"
                  required
                  value={formData.inGameId}
                  onChange={handleInputChange}
                  placeholder="e.g. 123-456-789"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Device Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, platform: 'Android' }))}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${
                      formData.platform === 'Android'
                        ? 'bg-black text-white border-black'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    🤖 Android
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, platform: 'iOS' }))}
                    className={`p-3 rounded-xl border text-xs font-bold transition ${
                      formData.platform === 'iOS'
                        ? 'bg-black text-white border-black'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}
                  >
                    🍎 iOS
                  </button>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rulesAccepted"
                    checked={formData.rulesAccepted}
                    onChange={handleInputChange}
                    className="mt-0.5 rounded border-zinc-300 text-black focus:ring-black"
                  />
                  <span>
                    I accept the tournament rules, fair play guidelines, and agree to stream or provide match screenshots.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full nexa-btn-primary py-3.5 text-xs justify-center"
              >
                {submitting ? 'Submitting...' : 'Register for Tournament'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, AlertCircle, Smartphone, ArrowRight, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    phone: '',
    email: '',
    platform: 'Android' as 'Android' | 'iOS',
    inGameId: '',
    rulesAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) return setError('Please enter your full legal name.');
    if (!formData.displayName.trim()) return setError('Please enter your tournament gamer tag.');
    if (!formData.phone.trim()) return setError('Please enter your valid phone/WhatsApp number in Ghana.');
    if (!formData.email.trim() || !formData.email.includes('@')) return setError('Please enter a valid email address.');
    if (!formData.inGameId.trim()) return setError('Please enter your eFootball Mobile User ID.');

    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.rulesAccepted) {
      return setError('You must agree to the tournament rules and privacy policy.');
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/tournaments/efootball-mobile-ghana-championship-s1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit tournament registration.');
      }

      setSuccessData(json.data);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-zinc-950' : 'text-zinc-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                1
              </span>
              <span>Player Details</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-black' : 'bg-zinc-200'}`} />
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-zinc-950' : 'text-zinc-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                2
              </span>
              <span>Confirm & Rules</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-black' : 'bg-zinc-200'}`} />
            <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-zinc-950' : 'text-zinc-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                3
              </span>
              <span>Submitted</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Box */}
          <div className="md:col-span-7 apple-card p-6 sm:p-8">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950">Player Registration</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Free entry into eFootball Mobile Ghana Season 1. Fill in your details below.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Kofi Mensah"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Tournament Gamer Tag / Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="e.g. KingPro GH"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Ghana Phone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 024 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    eFootball In-Game User ID
                  </label>
                  <input
                    type="text"
                    name="inGameId"
                    value={formData.inGameId}
                    onChange={handleInputChange}
                    placeholder="e.g. 123-456-789 (from eFootball Profile)"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Mobile Device Platform
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, platform: 'Android' }))}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        formData.platform === 'Android'
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span>🤖 Android</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, platform: 'iOS' }))}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        formData.platform === 'iOS'
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span>🍎 iOS (iPhone/iPad)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full apple-btn-primary py-3.5 text-xs">
                    Continue to Confirmation →
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950">Review & Confirm</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Please review your entry details before final submission.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Player Name:</span>
                    <span className="font-bold text-zinc-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Tournament Gamer Tag:</span>
                    <span className="font-bold text-zinc-900">{formData.displayName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">In-Game ID:</span>
                    <span className="font-bold text-zinc-900 font-mono">{formData.inGameId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Platform:</span>
                    <span className="font-bold text-zinc-900">{formData.platform}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Contact:</span>
                    <span className="font-bold text-zinc-900">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Entry Fee:</span>
                    <span className="font-bold text-emerald-600">GH₵0.00 (100% Free)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-100 text-xs text-zinc-700 leading-relaxed space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rulesAccepted"
                      checked={formData.rulesAccepted}
                      onChange={handleInputChange}
                      className="mt-0.5 rounded border-zinc-300 text-black focus:ring-black"
                    />
                    <span>
                      I agree to the official eFootball Mobile Tournament Rules, Fair Play Charter, and agree to broadcast or provide match result screenshots upon request.
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="apple-btn-secondary text-xs flex-1"
                  >
                    ← Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="apple-btn-primary text-xs flex-1 py-3.5"
                  >
                    {submitting ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-zinc-950">Registration Confirmed!</h2>
                <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Congratulations, <strong>{formData.displayName}</strong>! You have been verified and added to the tournament roster.
                </p>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-left max-w-sm mx-auto space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <span className="font-bold text-emerald-600">Approved</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Seed Slot:</span>
                    <span className="font-bold text-zinc-900 font-mono">Assigned</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Platform:</span>
                    <span className="font-bold text-zinc-900">{formData.platform}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link href="/bracket" className="apple-btn-primary text-xs">
                    View Tournament Bracket
                  </Link>
                  <Link href="/live" className="apple-btn-secondary text-xs">
                    Go to Live Arena
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Tournament Details Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="apple-card p-6 space-y-4">
              <h3 className="text-base font-bold text-zinc-950 pb-3 border-b border-zinc-100">
                Tournament Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Entry Fee:</span>
                  <span className="font-bold text-emerald-600">GH₵ 0.00 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Game:</span>
                  <span className="font-semibold text-zinc-900">eFootball 2025 Mobile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Platform:</span>
                  <span className="font-semibold text-zinc-900">Android & iOS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Capacity:</span>
                  <span className="font-semibold text-zinc-900">16 Players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sponsor Rewards:</span>
                  <span className="font-bold text-zinc-900">GH₵ 800 (Top 3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Format:</span>
                  <span className="font-semibold text-zinc-900">Single Elimination Knockout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100">
                <span className="text-[11px] font-bold text-zinc-900 block mb-1">Need Assistance?</span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Join our official player WhatsApp group or contact the organizers for match scheduling assistance.
                </p>
                <Link href="/contact" className="text-[11px] font-bold text-zinc-950 underline mt-2 block">
                  Contact Organizers →
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

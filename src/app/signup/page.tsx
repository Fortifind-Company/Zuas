'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Shield, Lock, Mail, User, Phone, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phone: '',
    platform: 'Android' as 'Android' | 'iOS',
    efootballId: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);
    const res = await register({
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
      platform: formData.platform,
      efootballId: formData.efootballId,
      phone: formData.phone,
    });
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-md mb-4">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
            Create Gamer Account
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Join Ghana&apos;s eFootball Mobile Championship Platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Gamer Tag / Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your Gamer Tag"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Gaming Device
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              >
                <option value="Android">🤖 Android</option>
                <option value="iOS">🍎 iOS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="024 XXX XXXX"
                className="w-full px-3.5 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              eFootball Mobile User ID
            </label>
            <input
              type="text"
              name="efootballId"
              value={formData.efootballId}
              onChange={handleChange}
              placeholder="e.g. 123-456-789"
              className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Gamer Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-black hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

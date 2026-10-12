'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Shield, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email.includes('admin') || email.includes('referee')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-md mb-4">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
            Sign In to Zuas
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            eFootball Mobile Ghana Championship Esports Portal
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
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] bg-zinc-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick test credentials */}
        <div className="mt-8 pt-6 border-t border-black/[0.06]">
          <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 text-center">
            ⚡ Quick-Fill Verified Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@zuas.gh', 'AdminPass2026!')}
              className="py-2 px-2.5 rounded-xl border border-black/[0.08] bg-zinc-50 hover:bg-zinc-100 text-left transition"
            >
              <span className="block text-[10px] font-bold text-zinc-900">👑 Admin</span>
              <span className="block text-[9px] text-zinc-500 truncate">Superuser</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('referee@zuas.gh', 'RefPass2026!')}
              className="py-2 px-2.5 rounded-xl border border-black/[0.08] bg-zinc-50 hover:bg-zinc-100 text-left transition"
            >
              <span className="block text-[10px] font-bold text-zinc-900">🛡️ Referee</span>
              <span className="block text-[9px] text-zinc-500 truncate">Match Review</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('player@zuas.gh', 'PlayerPass2026!')}
              className="py-2 px-2.5 rounded-xl border border-black/[0.08] bg-zinc-50 hover:bg-zinc-100 text-left transition"
            >
              <span className="block text-[10px] font-bold text-zinc-900">🎮 Player</span>
              <span className="block text-[9px] text-zinc-500 truncate">Competitor</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-500">
          New to tournament play?{' '}
          <Link href="/register" className="font-bold text-black hover:underline">
            Register for Championship
          </Link>
        </div>
      </div>
    </div>
  );
}

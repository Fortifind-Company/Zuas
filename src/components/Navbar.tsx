'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Tv, Users, FileText, Menu, X, Shield, ChevronRight, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/tournament', label: 'Tournament' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/live', label: 'Live Arena', badge: 'LIVE' },
    { href: '/bracket', label: 'Bracket' },
    { href: '/players', label: 'Players' },
    { href: '/rules', label: 'Rules' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-[14px] bg-black text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-all duration-300">
            ⚡
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] tracking-tight text-zinc-950">
                eFootball
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                GHANA
              </span>
            </div>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              Mobile Championship
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/70 p-1.5 rounded-full border border-black/[0.04]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-600 hover:text-black hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Notifications */}
          <NotificationCenter />

          {/* User Auth or Sign In */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 bg-zinc-100/80 pl-2 pr-3 py-1 rounded-full border border-black/[0.05]">
                <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-zinc-900 leading-tight">
                    {user.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-700 leading-none">
                    {user.role}
                  </span>
                </div>
              </div>

              {(user.role === 'ADMIN' || user.role === 'REFEREE') && (
                <Link
                  href="/admin"
                  className="text-xs font-semibold px-3 py-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full transition flex items-center gap-1"
                  title="Admin Command Portal"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-full transition"
              >
                Sign In
              </Link>
              <Link href="/register" className="apple-btn-primary text-xs py-2 px-4">
                <span>Register</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <NotificationCenter />
          {user ? (
            <button
              onClick={logout}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-800"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-black text-white"
            >
              Sign In
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                isActive(link.href)
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-rose-500 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-full"
            >
              <Shield className="w-4 h-4" />
              Tournament Admin Portal
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-black text-white font-bold rounded-full text-xs shadow-md"
            >
              Register for Tournament
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

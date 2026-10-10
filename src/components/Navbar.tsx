'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Tv, Users, FileText, Menu, X, Shield, ChevronRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/tournament', label: 'Tournament' },
    { href: '/live', label: 'Live Arena', badge: 'LIVE' },
    { href: '/bracket', label: 'Bracket' },
    { href: '/players', label: 'Players' },
    { href: '/rules', label: 'Rules' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo - Apple aesthetic with cute gaming icon */}
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

        {/* Desktop Nav Links - Apple Pill Design */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100/70 p-1.5 rounded-full border border-black/[0.04]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
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
        <div className="hidden md:flex items-center gap-3">
          {/* Ghana Region Capsule */}
          <div className="apple-badge text-xs bg-zinc-50 border-black/[0.05]">
            <span>🇬🇭</span>
            <span className="font-semibold text-zinc-900">Accra</span>
            <span className="text-zinc-300">·</span>
            <span className="text-emerald-700 font-bold">Free Entry</span>
          </div>

          <Link
            href="/admin"
            className="text-xs font-semibold px-3 py-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100/80 rounded-full transition"
            title="Tournament Command Portal"
          >
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </span>
          </Link>

          <Link href="/register" className="apple-btn-primary text-xs py-2.5 px-5">
            <span>Register Now</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-black text-white"
          >
            Register
          </Link>
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
          <div className="apple-badge w-full justify-between mb-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span>🇬🇭</span>
              <span className="font-semibold">Ghanaian Esports Community</span>
            </span>
            <span className="text-emerald-700 font-bold">100% Free Entry</span>
          </div>
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

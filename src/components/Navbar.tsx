'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Tv, Users, FileText, Phone, Menu, X, Shield, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-zinc-950">
                eFootball
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                GHANA
              </span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              Mobile Championship
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-colors ${
                  active
                    ? 'text-zinc-950 font-semibold bg-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.label}
                  {link.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </span>
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-black rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Region / Currency pill */}
          <div className="nexa-badge text-xs text-zinc-700 bg-zinc-50 border-zinc-200">
            <span>🇬🇭</span>
            <span className="font-semibold text-zinc-900">GHC 0.00</span>
            <span className="text-zinc-400">·</span>
            <span className="text-emerald-700 font-semibold">Free Entry</span>
          </div>

          <Link
            href="/admin"
            className="text-xs font-semibold px-3 py-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition"
            title="Tournament Management Dashboard"
          >
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </span>
          </Link>

          <Link href="/register" className="nexa-btn-primary">
            Register Now
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/register"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black text-white"
          >
            Register
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="nexa-badge w-full justify-between mb-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span>🇬🇭</span>
              <span>Ghana Official Championship</span>
            </span>
            <span className="text-emerald-700 font-semibold">Free Entry</span>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.href)
                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 rounded-full"
            >
              <Shield className="w-4 h-4" />
              Tournament Admin Portal
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-black text-white font-semibold rounded-full text-sm shadow-sm"
            >
              Register for Tournament
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

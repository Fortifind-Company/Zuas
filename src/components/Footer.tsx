import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-50/80 border-t border-black/[0.06] pt-16 pb-14 text-zinc-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-black/[0.06]">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[12px] bg-black text-white flex items-center justify-center font-black text-xs shadow-sm">
                ⚡
              </div>
              <span className="font-extrabold text-base tracking-tight text-zinc-950">
                eFootball Mobile
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Ghana&apos;s free-to-enter competitive mobile tournament series. Empowering gamers across Accra, Kumasi, Takoradi, and Cape Coast with authentic esports tournaments.
            </p>
            <div className="apple-badge text-[11px] bg-white text-zinc-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free · No Gambling · Community Verified</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Competition
            </h4>
            <ul className="space-y-2.5 text-zinc-500">
              <li>
                <Link href="/tournament" className="hover:text-black transition">
                  Tournament Overview
                </Link>
              </li>
              <li>
                <Link href="/bracket" className="hover:text-black transition">
                  Knockout Bracket
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-black transition flex items-center gap-1.5">
                  Live Arena
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-black transition">
                  Tournament Archive & Seasons
                </Link>
              </li>
              <li>
                <Link href="/players" className="hover:text-black transition">
                  Player Directory & Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Fair play & rules */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Governance & Rules
            </h4>
            <ul className="space-y-2.5 text-zinc-500">
              <li>
                <Link href="/rules" className="hover:text-black transition">
                  Official Tournament Rules
                </Link>
              </li>
              <li>
                <Link href="/rules#disconnections" className="hover:text-black transition">
                  Disconnection & Dispute Policy
                </Link>
              </li>
              <li>
                <Link href="/rules#streaming" className="hover:text-black transition">
                  Twitch Streaming Protocol
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition">
                  Organizer Contact & WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-black transition flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Streaming & Region */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Broadcasting Hub
            </h4>
            <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
              Powered by free-first Twitch live streams embedded directly for Ghanaian mobile spectators on Android and iOS.
            </p>
            <div className="p-3.5 bg-white border border-black/[0.06] rounded-2xl shadow-sm space-y-1">
              <span className="text-xs font-bold text-zinc-900 block">Host Region:</span>
              <span className="text-[11px] text-zinc-500 block">Accra, Ghana (UTC+0 / GMT)</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">● Twitch Embedded Player Active</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <p>
            © {new Date().getFullYear()} eFootball Mobile Ghana Championship. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-lg">
            Independent community tournament platform. eFootball is a registered trademark of Konami Digital Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}

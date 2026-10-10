import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200/80 pt-16 pb-12 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-200">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-950">
                eFootball Mobile
              </span>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Ghana&apos;s free-to-enter competitive mobile tournament series. Empowering gamers across Accra, Kumasi, Takoradi, and Cape Coast with authentic esports tournaments.
            </p>
            <div className="nexa-badge text-xs bg-white text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Free · No Gambling · Community Verified</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Competition
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tournament" className="hover:text-zinc-950 transition">
                  Tournament Overview
                </Link>
              </li>
              <li>
                <Link href="/bracket" className="hover:text-zinc-950 transition">
                  Knockout Bracket
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-zinc-950 transition flex items-center gap-1.5">
                  Live Arena
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-zinc-950 transition">
                  Tournament Archive & Seasons
                </Link>
              </li>
              <li>
                <Link href="/players" className="hover:text-zinc-950 transition">
                  Player Directory & Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Fair play & rules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Governance & Rules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/rules" className="hover:text-zinc-950 transition">
                  Official Tournament Rules
                </Link>
              </li>
              <li>
                <Link href="/rules#disconnections" className="hover:text-zinc-950 transition">
                  Disconnection & Dispute Policy
                </Link>
              </li>
              <li>
                <Link href="/rules#streaming" className="hover:text-zinc-950 transition">
                  Twitch Streaming Protocol
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-950 transition">
                  Organizer Contact & WhatsApp
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-950 transition flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-zinc-500" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Streaming & Tech */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">
              Broadcasting Hub
            </h4>
            <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
              Powered by free-first Twitch live streams embedded directly for Ghanaian mobile spectators on Android and iOS.
            </p>
            <div className="p-3 bg-white border border-zinc-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-zinc-900 block">Host Region:</span>
              <span className="text-xs text-zinc-600 block">Accra, Ghana (UTC+0 / GMT)</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">● Twitch Embedded Player Active</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} eFootball Mobile Ghana Championship. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-lg">
            Independent community tournament platform. eFootball is a registered trademark of Konami Digital Entertainment. This site is not affiliated with or endorsed by Konami.
          </p>
        </div>
      </div>
    </footer>
  );
}

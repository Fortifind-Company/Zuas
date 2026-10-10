'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  PlusCircle,
  FileText,
  Users,
  Swords,
  Tv,
  Megaphone,
  Sliders,
  History,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/tournaments', label: 'All Tournaments', icon: Trophy },
    { href: '/admin/tournaments/create', label: 'Create Tournament', icon: PlusCircle, highlight: true },
    { href: '/admin/templates', label: 'Tournament Templates', icon: FileText },
    { href: '/admin/registrations', label: 'Registrations', icon: Users },
    { href: '/admin/matches', label: 'Match Manager', icon: Swords },
    { href: '/admin/bracket', label: 'Bracket Generator', icon: Trophy },
    { href: '/admin/streams', label: 'Twitch Streams', icon: Tv },
    { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/admin/settings', label: 'Global Settings', icon: Sliders },
    { href: '/admin/audit', label: 'Audit Logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-white flex flex-col justify-between p-4 border-r border-zinc-800 min-h-screen">
      <div>
        {/* Brand header */}
        <div className="pb-6 mb-6 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black text-sm">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block">
                eFootball GH Admin
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block uppercase">
                Tournament Command
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-zinc-800 text-white font-bold'
                    : link.highlight
                    ? 'text-emerald-400 hover:bg-zinc-900 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : link.highlight ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to public website */}
      <div className="pt-4 border-t border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-zinc-400 hover:text-white transition px-2 py-2"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TournamentGroup, TournamentMatch } from '@/lib/types';
import { Trophy, CheckCircle2, ChevronRight, Shield, Calendar, Tv } from 'lucide-react';

interface Props {
  groups: TournamentGroup[];
  matches?: TournamentMatch[];
  tournamentSlug: string;
}

export default function GroupStageTable({ groups, matches = [], tournamentSlug }: Props) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  if (!groups || groups.length === 0) {
    return (
      <div className="nexa-card p-8 text-center text-zinc-500">
        <Trophy className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
        <p className="text-sm font-semibold">Group stage fixtures have not been generated yet.</p>
        <p className="text-xs text-zinc-400 mt-1">Once generated, standings and tables will appear here live.</p>
      </div>
    );
  }

  const currentGroup = groups[selectedGroupIndex] || groups[0];
  const groupMatches = matches.filter(
    m => m.groupId === currentGroup.id || m.roundName?.toLowerCase().includes(currentGroup.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200">
        {groups.map((group, idx) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroupIndex(idx)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              selectedGroupIndex === idx
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <span>{group.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedGroupIndex === idx ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-600'
            }`}>
              {group.standings.length} players
            </span>
          </button>
        ))}
      </div>

      {/* Group Table Card */}
      <div className="nexa-card overflow-hidden bg-white border border-zinc-200">
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider">{currentGroup.name} Standings</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Top 2 advance to Knockout Stage
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-12 text-center">Pos</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-3 text-center">P</th>
                <th className="py-3 px-3 text-center">W</th>
                <th className="py-3 px-3 text-center">D</th>
                <th className="py-3 px-3 text-center">L</th>
                <th className="py-3 px-3 text-center">GF</th>
                <th className="py-3 px-3 text-center">GA</th>
                <th className="py-3 px-3 text-center">GD</th>
                <th className="py-3 px-4 text-center font-black text-zinc-950">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium">
              {currentGroup.standings.map((row, pos) => {
                const isQualifying = pos < 2;
                return (
                  <tr
                    key={row.participantId}
                    className={`hover:bg-zinc-50/80 transition ${
                      isQualifying ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          pos === 0
                            ? 'bg-amber-100 text-amber-800'
                            : pos === 1
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'text-zinc-500'
                        }`}
                      >
                        {pos + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/players/${encodeURIComponent(row.displayName)}`}
                        className="font-bold text-zinc-900 hover:text-emerald-600 transition flex items-center gap-1.5"
                      >
                        <span>{row.displayName}</span>
                        {isQualifying && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-700">
                            Q
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-center text-zinc-600">{row.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">{row.won}</td>
                    <td className="py-3 px-3 text-center text-zinc-500">{row.drawn}</td>
                    <td className="py-3 px-3 text-center text-rose-600">{row.lost}</td>
                    <td className="py-3 px-3 text-center text-zinc-600">{row.goalsFor}</td>
                    <td className="py-3 px-3 text-center text-zinc-600">{row.goalsAgainst}</td>
                    <td className="py-3 px-3 text-center font-semibold text-zinc-700">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3 px-4 text-center font-black text-sm text-zinc-950 bg-zinc-50">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Fixtures List */}
      {groupMatches.length > 0 && (
        <div className="nexa-card p-6 bg-white border border-zinc-200">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">
            {currentGroup.name} Fixtures & Results
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupMatches.map(match => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200 transition flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">
                      Match #{match.matchNumber}
                    </span>
                    {match.status === 'LIVE' && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-full border border-rose-200 animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-zinc-900">
                    {match.participant1Name || 'TBD'} vs {match.participant2Name || 'TBD'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-zinc-950">
                      {match.participant1Score} - {match.participant2Score}
                    </span>
                    <span className="block text-[10px] text-zinc-400 uppercase font-semibold">
                      {match.status}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

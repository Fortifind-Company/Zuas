'use client';

import React from 'react';
import Link from 'next/link';
import { TournamentMatch } from '@/lib/types';
import { Trophy, Tv, Radio, ArrowRight } from 'lucide-react';

interface BracketTreeProps {
  matches: TournamentMatch[];
}

export default function BracketTree({ matches }: BracketTreeProps) {
  if (!matches || matches.length === 0) {
    return (
      <div className="apple-card p-12 text-center text-zinc-500">
        <Trophy className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h4 className="text-base font-bold text-zinc-800 mb-1">Bracket Not Generated Yet</h4>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Tournament administrators generate the bracket once registration closes and participants are verified.
        </p>
      </div>
    );
  }

  // Group matches by round
  const maxRound = Math.max(...matches.map((m) => m.round));
  const rounds: { roundNumber: number; roundName: string; matches: TournamentMatch[] }[] = [];

  for (let r = 1; r <= maxRound; r++) {
    const roundMatches = matches
      .filter((m) => m.round === r)
      .sort((a, b) => a.matchNumber - b.matchNumber);

    if (roundMatches.length > 0) {
      rounds.push({
        roundNumber: r,
        roundName: roundMatches[0].roundName,
        matches: roundMatches,
      });
    }
  }

  return (
    <div className="w-full overflow-x-auto pb-8 pt-2">
      <div className="min-w-[940px] flex items-stretch gap-8 px-2">
        {rounds.map((round) => (
          <div key={round.roundNumber} className="flex-1 flex flex-col">
            {/* Round Header */}
            <div className="mb-6 pb-2.5 border-b border-black/[0.05] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Stage {round.roundNumber}
                </span>
                <h3 className="font-extrabold text-[15px] tracking-tight text-zinc-950 flex items-center gap-1.5">
                  {round.roundName}
                  {round.roundNumber === maxRound && (
                    <Trophy className="w-4 h-4 text-amber-500" />
                  )}
                </h3>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
              </span>
            </div>

            {/* Matches in Round */}
            <div className="flex-1 flex flex-col justify-around gap-6">
              {round.matches.map((match) => {
                const isP1Winner = match.winnerId && match.winnerId === match.participant1Id;
                const isP2Winner = match.winnerId && match.winnerId === match.participant2Id;
                const isLive = match.streamStatus === 'LIVE' || match.status === 'LIVE';

                return (
                  <div
                    key={match.id}
                    className={`relative apple-card p-4 transition-all duration-300 ${
                      isLive ? 'border-rose-400 ring-2 ring-rose-500/10' : ''
                    }`}
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3 pb-2 border-b border-black/[0.04]">
                      <span className="font-bold uppercase tracking-wider text-zinc-400 text-[10px]">
                        #{match.matchNumber}
                      </span>
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                          <Radio className="w-3 h-3 animate-pulse" />
                          LIVE
                        </span>
                      ) : match.status === 'COMPLETED' ? (
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                          Final Score
                        </span>
                      ) : (
                        <span className="font-medium text-zinc-400 text-[10px]">
                          {match.scheduledTime
                            ? new Date(match.scheduledTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Scheduled'}
                        </span>
                      )}
                    </div>

                    {/* Participant 1 */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-2xl mb-1.5 transition-colors ${
                        isP1Winner
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80'
                          : 'bg-zinc-50/80 text-zinc-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-6 h-6 rounded-full bg-zinc-200/80 text-zinc-700 text-xs flex items-center justify-center font-bold">
                          {match.participant1Name ? match.participant1Name.charAt(0) : '?'}
                        </span>
                        <span className="truncate text-xs">
                          {match.participant1Name || 'TBD (Awaiting)'}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-lg ${
                          isP1Winner ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-200/70 text-zinc-800'
                        }`}
                      >
                        {match.participant1Score}
                      </span>
                    </div>

                    {/* Participant 2 */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-2xl mb-3 transition-colors ${
                        isP2Winner
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80'
                          : 'bg-zinc-50/80 text-zinc-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-6 h-6 rounded-full bg-zinc-200/80 text-zinc-700 text-xs flex items-center justify-center font-bold">
                          {match.participant2Name ? match.participant2Name.charAt(0) : '?'}
                        </span>
                        <span className="truncate text-xs">
                          {match.participant2Name || 'TBD (Awaiting)'}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-lg ${
                          isP2Winner ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-200/70 text-zinc-800'
                        }`}
                      >
                        {match.participant2Score}
                      </span>
                    </div>

                    {/* Link */}
                    <Link
                      href={`/matches/${match.id}`}
                      className="w-full py-1.5 text-xs font-bold rounded-xl bg-zinc-100/80 hover:bg-black hover:text-white transition flex items-center justify-center gap-1 text-zinc-700"
                    >
                      {isLive ? (
                        <>
                          <Tv className="w-3.5 h-3.5 text-rose-500" />
                          <span>Watch Stream</span>
                        </>
                      ) : (
                        <>
                          <span>Match Room</span>
                          <ArrowRight className="w-3 h-3 opacity-60" />
                        </>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

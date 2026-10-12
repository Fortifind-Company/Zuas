import React from 'react';
import Link from 'next/link';
import { getFeaturedTournament, getMatches, getAnnouncements } from '@/lib/db';
import {
  Trophy,
  Tv,
  Users,
  Smartphone,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Radio,
  Award,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const tournament = getFeaturedTournament();
  const allMatches = getMatches(tournament.id);
  const announcements = getAnnouncements(tournament.id);

  const liveMatches = allMatches.filter(m => m.streamStatus === 'LIVE' || m.status === 'LIVE');
  const featuredLiveMatch = liveMatches[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Apple-style Notification Pill */}
      {announcements.length > 0 && announcements[0].isPinned && (
        <div className="bg-zinc-950 text-white text-xs py-2 px-4 text-center border-b border-zinc-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">Notice:</span>
            <span>{announcements[0].title}</span>
            <Link href="/tournament" className="underline font-semibold hover:text-emerald-300 ml-1">
              Read details →
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section — Apple Production Craftsmanship */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-36 overflow-hidden">
        {/* Subtle radial ambient light on canvas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-zinc-50 to-transparent -z-10 rounded-full blur-3xl opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typography, Tag & CTAs */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Cute Apple Capsule Tag */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-100/80 backdrop-blur-md text-zinc-900 border border-black/[0.05] text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-tight">Ghanaian Mobile Esports</span>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-600 font-medium">Season 1 Tournament</span>
              </div>

              {/* Apple-grade Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-[-0.035em] text-zinc-950 leading-[1.04]">
                  eFOOTBALL MOBILE <br />
                  <span className="text-zinc-900">CHAMPIONSHIP.</span>
                </h1>
                <p className="text-lg sm:text-xl text-zinc-600 max-w-xl font-normal leading-relaxed pt-1">
                  Play. Compete. Stream. Become the Champion. Ghana’s premier free-to-enter online tournament for Android and iOS tacticians.
                </p>
              </div>

              {/* Cute Highlight Chips */}
              <div className="flex flex-wrap gap-2 text-xs text-zinc-700">
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-50 border border-black/[0.05] font-medium shadow-sm">
                  📱 Android & iOS Cross-Play
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-50 border border-black/[0.05] font-medium shadow-sm">
                  ⚡ 10-Min Online Fixtures
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-zinc-50 border border-black/[0.05] font-medium shadow-sm">
                  🇬🇭 Region: Ghana (UTC+0)
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold shadow-sm">
                  ✨ 100% Free Entry
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/register" className="apple-btn-primary text-sm px-8 py-3.5">
                  <span>Register for Tournament</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link href="/live" className="apple-btn-secondary text-sm px-7 py-3.5">
                  <Tv className="w-4 h-4 text-rose-500" />
                  <span>Watch Live Arena</span>
                  {liveMatches.length > 0 && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </Link>
              </div>

              {/* Apple-style Metric Capsules Strip */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/[0.06] max-w-lg">
                <div>
                  <span className="block text-3xl font-black tracking-tight text-zinc-950">
                    {tournament.maxParticipants}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Player Roster Slots</span>
                </div>
                <div>
                  <span className="block text-3xl font-black tracking-tight text-zinc-950">
                    GH₵{tournament.prizePoolGhc}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Non-Cash Sponsor Pool</span>
                </div>
                <div>
                  <span className="block text-3xl font-black tracking-tight text-emerald-600 font-mono">
                    0.00
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">Entry Cost (Free)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Apple-level iPhone Pro Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                
                {/* iPhone Titanium Body with subtle gloss reflection */}
                <div className="relative rounded-[48px] bg-zinc-950 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-zinc-800/80">
                  
                  {/* Dynamic Island */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-zinc-400 font-mono font-bold">LIVE MATCH</span>
                  </div>

                  {/* Phone Screen Canvas */}
                  <div className="rounded-[40px] bg-zinc-900 text-white overflow-hidden p-4 pt-10 border border-zinc-800/80 min-h-[580px] flex flex-col justify-between">
                    
                    {/* In-App Header */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white text-zinc-950 flex items-center justify-center text-[10px] font-black">
                            ⚡
                          </span>
                          <span className="font-bold text-xs tracking-tight">eFootball Mobile GH</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                          STAGE: QF
                        </span>
                      </div>

                      {/* Prize Card */}
                      <div className="my-4 p-4 rounded-2xl bg-gradient-to-b from-zinc-800/90 to-zinc-800/50 border border-zinc-700/60 shadow-inner">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                          Tournament Reward Pool
                        </span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-2xl font-black tracking-tight text-white">GH₵ 800.00</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            FREE ENTRY
                          </span>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-zinc-700/40 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>16 Player Knockout</span>
                          <span className="text-zinc-300 font-semibold">Accra Cup</span>
                        </div>
                      </div>

                      {/* Live Scoreboard or Registration Status Inside Phone */}
                      {featuredLiveMatch && featuredLiveMatch.participant1Name ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold px-1">
                            <span className="text-zinc-300">{featuredLiveMatch.roundName}</span>
                            <span className="flex items-center gap-1 text-rose-400 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              LIVE ON TWITCH
                            </span>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-full bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                {featuredLiveMatch.participant1Name.substring(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <span className="text-xs font-bold block text-zinc-100">{featuredLiveMatch.participant1Name}</span>
                                <span className="text-[9px] text-zinc-500 block">Player 1</span>
                              </div>
                            </div>

                            <div className="text-center px-2">
                              <span className="text-lg font-black font-mono text-emerald-400">
                                {featuredLiveMatch.participant1Score} - {featuredLiveMatch.participant2Score}
                              </span>
                              <span className="text-[9px] text-rose-400 block font-bold">Live Stream</span>
                            </div>

                            <div className="flex items-center gap-2 text-right">
                              <div>
                                <span className="text-xs font-bold block text-zinc-100">{featuredLiveMatch.participant2Name || 'TBD'}</span>
                                <span className="text-[9px] text-zinc-500 block">Player 2</span>
                              </div>
                              <span className="w-8 h-8 rounded-full bg-zinc-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                                {featuredLiveMatch.participant2Name ? featuredLiveMatch.participant2Name.substring(0, 2).toUpperCase() : 'P2'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold px-1">
                            <span className="text-zinc-300">{tournament.edition}</span>
                            <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              REGISTRATIONS OPEN
                            </span>
                          </div>

                          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 text-center shadow-sm space-y-1.5">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-xs font-bold text-zinc-300">16-Player Ghana Cup</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                                Free Entry
                              </span>
                            </div>
                            <div className="text-sm font-black text-white">
                              Prize Pool: GH₵{tournament.prizePoolGhc.toLocaleString()}
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              Android & iOS mobile tacticians · Register to claim seed
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Device Chips inside Phone */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-center">
                          <span className="text-[11px] font-bold block text-zinc-200">🤖 Android</span>
                          <span className="text-[9px] text-zinc-500">eFootball v4.x</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-center">
                          <span className="text-[11px] font-bold block text-zinc-200">🍎 iOS</span>
                          <span className="text-[9px] text-zinc-500">iPhone / iPad</span>
                        </div>
                      </div>
                    </div>

                    {/* Phone Bottom CTA */}
                    <Link
                      href={featuredLiveMatch ? "/live" : "/register"}
                      className="w-full py-3 bg-white text-zinc-950 font-bold text-xs rounded-full text-center hover:bg-zinc-100 transition shadow-sm mt-4"
                    >
                      {featuredLiveMatch ? "Watch Stream on Twitch →" : "Register Your Player Tag →"}
                    </Link>
                  </div>
                </div>

                {/* Apple-style Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xl text-zinc-900 border border-black/[0.08] p-3.5 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-base shadow-sm">
                    🏆
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-zinc-950">Verified Ghanaian Fixtures</span>
                    <span className="text-[10px] text-zinc-500 font-medium">Single Elimination Knockout</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Live Match Banner if live fixture exists */}
      {featuredLiveMatch && (
        <section className="bg-zinc-950 text-white py-10 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-[32px] bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Radio className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                      LIVE BROADCAST
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs text-zinc-400 font-medium">{featuredLiveMatch.roundName}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {featuredLiveMatch.participant1Name} vs {featuredLiveMatch.participant2Name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Twitch Channel: <strong className="text-white">twitch.tv/{featuredLiveMatch.twitchChannel || 'esports'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <div className="text-center px-5 py-2.5 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">Score</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {featuredLiveMatch.participant1Score} - {featuredLiveMatch.participant2Score}
                  </span>
                </div>
                <Link
                  href={`/matches/${featuredLiveMatch.id}`}
                  className="apple-btn-primary bg-white text-zinc-950 hover:bg-zinc-100 text-xs py-3 px-6"
                >
                  Watch Stream Now
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apple-style 4-Pillar Feature Grid */}
      <section className="py-24 bg-zinc-50/60 border-b border-black/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
              Esports Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-[-0.025em]">
              Engineered for Ghanaian Mobile Competitors
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Zero registration fees, zero wagering. Transparent tournament brackets and live Twitch broadcasting built for community integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="apple-card p-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">100% Free Entry</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No entry fees or deposits. A genuine platform for mobile football skill, community pride, and national rankings.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">Single-Elimination Knockout</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Bracket matches with standard 10-minute friend matches, extra time, and penalty shootouts for definitive winners.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
                <Tv className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">Free Twitch Streaming</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Players broadcast mobile gameplay directly to Twitch. Embedded viewing for spectators across Ghana with zero paywalls.
              </p>
            </div>

            <div className="apple-card p-7 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 tracking-tight">Sponsor-Backed Rewards</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Non-cash prizes and community sponsor rewards for Top 3 finalists, verified through official tournament refereeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Fixtures Strip */}
      <section className="py-20 bg-white border-b border-black/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Schedule & Fixtures
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Tournament Matches
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/bracket" className="apple-btn-secondary text-xs">
                View Full Bracket
              </Link>
              <Link href="/live" className="apple-btn-primary text-xs">
                Go to Live Arena →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="apple-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 pb-2.5 border-b border-black/[0.04]">
                    <span className="font-semibold text-zinc-700">{match.roundName}</span>
                    {match.streamStatus === 'LIVE' ? (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-zinc-400 font-medium text-[11px]">Match #{match.matchNumber}</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50/80">
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {match.participant1Name || 'TBD'}
                      </span>
                      <span className="text-sm font-black font-mono text-zinc-950">
                        {match.participant1Score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50/80">
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {match.participant2Name || 'TBD'}
                      </span>
                      <span className="text-sm font-black font-mono text-zinc-950">
                        {match.participant2Score}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/matches/${match.id}`}
                  className="w-full py-2.5 rounded-2xl bg-zinc-100 hover:bg-black hover:text-white transition text-xs font-bold text-center text-zinc-800"
                >
                  View Match Room
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-500">
              Everything you need to know about competing in Ghana’s eFootball Mobile Championship.
            </p>
          </div>

          <div className="space-y-4">
            <div className="apple-card p-7">
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5">
                Is there any registration fee or cash deposit?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                No. The championship is 100% free to enter for all verified players in Ghana. There are no paid-entry processing fees, deposits, or wagering elements.
              </p>
            </div>

            <div className="apple-card p-7">
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5">
                How do I broadcast my gameplay on Twitch?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Players use a mobile broadcasting tool (such as Twitch App, Streamlabs Mobile, or Prism Live Studio) on Android or iOS. You submit your channel URL to administrators, who verify the stream and embed it in the website’s Live Arena.
              </p>
            </div>

            <div className="apple-card p-7">
              <h4 className="text-sm font-bold text-zinc-950 mb-1.5">
                What happens if a match disconnects due to network issues?
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                As per official rules, the score at the moment of disconnection is retained, and players replay the remaining match minutes. Match referee verification applies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

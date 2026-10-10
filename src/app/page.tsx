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
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const tournament = getFeaturedTournament();
  const allMatches = getMatches(tournament.id);
  const announcements = getAnnouncements(tournament.id);

  const liveMatches = allMatches.filter(m => m.streamStatus === 'LIVE' || m.status === 'LIVE');
  const upcomingMatches = allMatches.filter(m => m.status === 'SCHEDULED').slice(0, 3);
  const featuredLiveMatch = liveMatches[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Notification / Banner */}
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

      {/* Hero Section — Clean NexaData aesthetic with phone mockup & bold typography */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge / Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">Ghanaian Mobile Esports</span>
                <span className="text-zinc-400">·</span>
                <span>Verified Tournament</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08]">
                eFOOTBALL MOBILE <br />
                <span className="text-zinc-900">CHAMPIONSHIP</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-zinc-600 max-w-xl font-normal leading-relaxed">
                Play. Compete. Stream. Become the Champion. Ghana’s premier free-to-enter online tournament for Android and iOS tacticians.
              </p>

              {/* Tournament Highlights Pills */}
              <div className="flex flex-wrap gap-2 text-xs text-zinc-700">
                <span className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 font-medium">
                  🎮 Mobile (Android & iOS)
                </span>
                <span className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 font-medium">
                  🌐 100% Online Friendly Matches
                </span>
                <span className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 font-medium">
                  🇬🇭 Region: Ghana (UTC+0)
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                  🆓 Free to Enter
                </span>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/register" className="nexa-btn-primary text-base px-8 py-3.5 shadow-md">
                  Register for Tournament
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link href="/live" className="nexa-btn-secondary text-base px-7 py-3.5">
                  <Tv className="w-4 h-4 text-rose-500" />
                  Watch Live Matches
                  {liveMatches.length > 0 && (
                    <span className="ml-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </Link>
              </div>

              {/* Stat Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-100 max-w-lg">
                <div>
                  <span className="block text-2xl font-black text-zinc-950">{tournament.maxParticipants}</span>
                  <span className="text-xs text-zinc-500 font-medium">Player Slots</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-zinc-950">GH₵{tournament.prizePoolGhc}</span>
                  <span className="text-xs text-zinc-500 font-medium">Sponsor Rewards</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-emerald-600 font-mono">0.00</span>
                  <span className="text-xs text-zinc-500 font-medium">Entry Fee (Free)</span>
                </div>
              </div>
            </div>

            {/* Right Column: NexaData-style Smartphone Device Mockup Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                
                {/* Phone Container Outer Bezel */}
                <div className="relative rounded-[44px] bg-zinc-950 p-3 shadow-2xl ring-1 ring-zinc-800">
                  {/* Dynamic Island / Camera Notch */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-end px-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  </div>

                  {/* Phone Screen Canvas */}
                  <div className="rounded-[36px] bg-zinc-900 text-white overflow-hidden p-4 pt-9 border border-zinc-800 min-h-[580px] flex flex-col justify-between">
                    
                    {/* Phone App Header */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="w-5 h-5 rounded-md bg-white text-zinc-950 flex items-center justify-center text-[10px]">⚡</span>
                          <span>eFootball Mobile GH</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                          STAGE: QF
                        </span>
                      </div>

                      {/* Phone Balance / Tournament Card */}
                      <div className="my-4 p-4 rounded-2xl bg-zinc-800/80 border border-zinc-700/60">
                        <span className="text-[11px] text-zinc-400 uppercase font-medium block">Tournament Prize Pool</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-2xl font-black tracking-tight text-white">GH₵ 800.00</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            FREE ENTRY
                          </span>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-700/50 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>16 Player Knockout</span>
                          <span className="text-zinc-300 font-semibold">Accra Cup</span>
                        </div>
                      </div>

                      {/* Live Match Card Inside Mockup */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold px-1">
                          <span className="text-zinc-300">Quarter Final Match 1</span>
                          <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            LIVE
                          </span>
                        </div>

                        {/* Match Score Display */}
                        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-emerald-400">
                              KP
                            </span>
                            <div>
                              <span className="text-xs font-bold block text-zinc-100">KingPro GH</span>
                              <span className="text-[10px] text-zinc-500 block">Android</span>
                            </div>
                          </div>

                          <div className="text-center px-2">
                            <span className="text-base font-black font-mono text-emerald-400">2 - 1</span>
                            <span className="text-[9px] text-zinc-500 block">62&apos; Live</span>
                          </div>

                          <div className="flex items-center gap-2 text-right">
                            <div>
                              <span className="text-xs font-bold block text-zinc-100">DarkX</span>
                              <span className="text-[10px] text-zinc-500 block">iOS</span>
                            </div>
                            <span className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-amber-400">
                              DX
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Platform Selectors inside Phone */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700 text-center">
                          <span className="text-[11px] font-bold block text-zinc-200">🤖 Android</span>
                          <span className="text-[9px] text-zinc-400">eFootball v4.x</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700 text-center">
                          <span className="text-[11px] font-bold block text-zinc-200">🍎 iOS</span>
                          <span className="text-[9px] text-zinc-400">iPhone / iPad</span>
                        </div>
                      </div>
                    </div>

                    {/* Phone Bottom CTA */}
                    <Link
                      href="/live"
                      className="w-full py-3 bg-white text-zinc-950 font-bold text-xs rounded-full text-center hover:bg-zinc-100 transition shadow-sm mt-4"
                    >
                      Watch Stream on Twitch →
                    </Link>
                  </div>
                </div>

                {/* Floating Badge (like NexaData "Fast. Reliable.") */}
                <div className="absolute -bottom-4 -left-4 bg-white text-zinc-900 border border-zinc-200 p-3 rounded-2xl shadow-elevated flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">
                    🏆
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-zinc-950">Verified Ghanaian Fixtures</span>
                    <span className="text-[10px] text-zinc-500 font-medium">Single Elimination Bracket</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Live Match Banner if live fixture exists */}
      {featuredLiveMatch && (
        <section className="bg-zinc-950 text-white py-8 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Featured Live Broadcast
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs text-zinc-400">{featuredLiveMatch.roundName}</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {featuredLiveMatch.participant1Name} vs {featuredLiveMatch.participant2Name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Twitch Channel: <strong className="text-white">twitch.tv/{featuredLiveMatch.twitchChannel || 'esports'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <div className="text-center px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-xs text-zinc-400 block font-medium">Score</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {featuredLiveMatch.participant1Score} - {featuredLiveMatch.participant2Score}
                  </span>
                </div>
                <Link
                  href={`/matches/${featuredLiveMatch.id}`}
                  className="nexa-btn-primary bg-white text-zinc-950 hover:bg-zinc-100"
                >
                  Watch Stream Now
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tournament Overview & Value Props */}
      <section className="py-20 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 block">
              Official Competition Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight sm:text-4xl">
              Engineered for Ghanaian Mobile Competitors
            </h2>
            <p className="text-base text-zinc-600 mt-3">
              Zero registration fees, zero wagering. Transparent tournament brackets and live Twitch broadcasting built for community integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="nexa-card p-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-1">100% Free Entry</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                No entry fees or deposits. A genuine platform for mobile football skill, community pride, and national rankings.
              </p>
            </div>

            <div className="nexa-card p-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Single-Elimination Knockout</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Bracket matches with standard 10-minute friend matches, extra time, and penalty shootouts for definitive winners.
              </p>
            </div>

            <div className="nexa-card p-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold mb-4">
                <Tv className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Free Twitch Streaming</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Players broadcast mobile gameplay directly to Twitch. Embedded viewing for spectators across Ghana with zero paywalls.
              </p>
            </div>

            <div className="nexa-card p-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Sponsor-Backed Rewards</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Non-cash prizes and community sponsor rewards for Top 3 finalists, verified through official tournament refereeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Upcoming Fixtures Strip */}
      <section className="py-16 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Schedule & Fixtures
              </span>
              <h2 className="text-2xl font-black text-zinc-950">Tournament Matches</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/bracket" className="nexa-btn-secondary text-xs">
                View Full Bracket
              </Link>
              <Link href="/live" className="nexa-btn-primary text-xs">
                Go to Live Arena →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="nexa-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 pb-2 border-b border-zinc-100">
                    <span className="font-semibold text-zinc-700">{match.roundName}</span>
                    {match.streamStatus === 'LIVE' ? (
                      <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-medium">Match #{match.matchNumber}</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                      <span className="text-sm font-bold text-zinc-900 truncate">
                        {match.participant1Name || 'TBD'}
                      </span>
                      <span className="text-sm font-black font-mono text-zinc-950">
                        {match.participant1Score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50">
                      <span className="text-sm font-bold text-zinc-900 truncate">
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
                  className="w-full py-2 rounded-xl bg-zinc-100 hover:bg-black hover:text-white transition text-xs font-semibold text-center text-zinc-700"
                >
                  View Match Room
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-zinc-950">Frequently Asked Questions</h2>
            <p className="text-sm text-zinc-600 mt-2">
              Everything you need to know about competing in Ghana’s eFootball Mobile Championship.
            </p>
          </div>

          <div className="space-y-4">
            <div className="nexa-card p-6">
              <h4 className="text-base font-bold text-zinc-950 mb-2">
                Is there any registration fee or cash deposit?
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                No. The championship is 100% free to enter for all verified players in Ghana. There are no paid-entry processing fees, deposits, or wagering elements.
              </p>
            </div>

            <div className="nexa-card p-6">
              <h4 className="text-base font-bold text-zinc-950 mb-2">
                How do I broadcast my gameplay on Twitch?
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Players use a mobile broadcasting tool (such as Twitch App, Streamlabs Mobile, or Prism Live Studio) on Android or iOS. You submit your channel URL to administrators, who verify the stream and embed it in the website’s Live Arena.
              </p>
            </div>

            <div className="nexa-card p-6">
              <h4 className="text-base font-bold text-zinc-950 mb-2">
                What happens if a match disconnects due to network issues?
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                As per official rules, the score at the moment of disconnection is retained, and players replay the remaining match minutes. Match referee verification applies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

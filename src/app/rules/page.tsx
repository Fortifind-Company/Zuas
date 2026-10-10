import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Smartphone, AlertTriangle, Tv, CheckCircle2 } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tournament Regulations & Fair Play</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Official Competition Rules
          </h1>
          <p className="text-zinc-600 mt-2 text-sm leading-relaxed">
            Standard operating procedures, in-game match configurations, streaming requirements, and dispute resolution for all participants.
          </p>
        </div>

        {/* Rules Sections */}
        <div className="space-y-8">
          
          {/* Section 1: In-game settings */}
          <div className="nexa-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-zinc-950 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-black text-white text-xs flex items-center justify-center font-bold">1</span>
              Match Configurations
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 list-disc list-inside leading-relaxed">
              <li><strong>Game Mode:</strong> eFootball Mobile Online Friend Match (Match Room).</li>
              <li><strong>Match Duration:</strong> 10 Minutes standard regulation time.</li>
              <li><strong>Injuries & Extra Time:</strong> Injuries OFF, Extra Time ON, Penalty Shootout (PK) ON.</li>
              <li><strong>Substitutions:</strong> Maximum 5 substitutions per match during standard stoppages.</li>
              <li><strong>Condition:</strong> Home and Away conditions set to &apos;Normal&apos; (Neutral).</li>
              <li><strong>Squads:</strong> Authentic and Dream Team squads are allowed according to each tournament edition&apos;s specific rules. Unauthorized third-party APK mods or speed cheats will result in immediate disqualification.</li>
            </ul>
          </div>

          {/* Section 2: Mobile Twitch Streaming Workflow */}
          <div className="nexa-card p-6 sm:p-8 bg-zinc-50 border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-950 mb-2 flex items-center gap-2">
              <Tv className="w-5 h-5 text-purple-600" />
              Twitch Mobile Streaming Guide
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Step-by-step instructions for Android and iOS mobile broadcasting to the tournament Live Arena:
            </p>

            <div className="space-y-3 text-xs text-zinc-700">
              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-start gap-3">
                <span className="font-bold text-zinc-900 bg-zinc-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">A</span>
                <div>
                  <strong>Twitch Account Setup:</strong> Create a free Twitch account at <a href="https://twitch.tv" target="_blank" className="text-purple-600 underline">twitch.tv</a> and enable two-factor authentication.
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-start gap-3">
                <span className="font-bold text-zinc-900 bg-zinc-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">B</span>
                <div>
                  <strong>Mobile Broadcasting Apps:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-zinc-600">
                    <li><strong>Android:</strong> Twitch App (Stream Games feature), Streamlabs Mobile, or Prism Live Studio.</li>
                    <li><strong>iOS:</strong> Twitch App or Streamlabs Mobile utilizing iOS Screen Broadcast permissions.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-start gap-3">
                <span className="font-bold text-zinc-900 bg-zinc-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">C</span>
                <div>
                  <strong>Submit Channel:</strong> Share your Twitch channel link with the tournament administrator before match start. The referee will inspect your broadcast and mark your fixture live in the Live Arena.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Disconnections & Disputes */}
          <div id="disconnections" className="nexa-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-zinc-950 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Disconnection & Dispute Handling
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              <p>
                <strong>Accidental Network Drop:</strong> If a match disconnects due to mobile telecom signal loss or power disruption, the existing scoreline at the moment of disconnection is strictly retained. Players create a new match room and play only the remaining minutes (e.g. if dropped in the 60th minute, a new 5-minute match is played to conclude the fixture).
              </p>
              <p>
                <strong>Dispute Escalation:</strong> In the event of a disagreement, both participants must submit raw screenshots of the match result screen to the referee committee within 15 minutes of conclusion.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

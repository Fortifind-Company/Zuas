'use client';

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>Community Support & Referees</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Contact Tournament Organizers
          </h1>
          <p className="text-zinc-600 mt-2 text-sm">
            Have questions regarding match schedules, Twitch stream verification, or tournament rules? Reach out to our Ghana administrative team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Methods */}
          <div className="md:col-span-5 space-y-4">
            <div className="nexa-card p-6">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-zinc-950 text-base mb-1">WhatsApp Player Channel</h3>
              <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
                Direct coordinator hotline for match room IDs and live score reporting.
              </p>
              <a
                href="https://wa.me/233240000000"
                target="_blank"
                rel="noopener noreferrer"
                className="nexa-btn-primary w-full text-xs justify-center"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="nexa-card p-6">
              <span className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-zinc-950 text-base mb-1">Official Email</h3>
              <p className="text-xs text-zinc-500 mb-2 leading-relaxed">
                For sponsorship inquiries, partnership proposals, and administrative requests.
              </p>
              <span className="text-xs font-mono font-bold text-zinc-900 block">
                tournaments@efootballghana.org
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 nexa-card p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-950">Inquiry Sent Successfully</h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  A tournament referee will review your message and reply via WhatsApp or email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-zinc-950 mb-1">Send a Message</h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Fill in the form below and an administrator will assist you.
                </p>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Your Name / Gamer Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KingPro GH"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 024 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Subject / Match ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Match 1 Stream Verification"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or match issue..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button type="submit" className="w-full nexa-btn-primary py-3 text-xs justify-center">
                  Send Message to Organizers
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

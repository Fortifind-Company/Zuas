'use client';

import React, { useState } from 'react';
import { TournamentMatch, MatchEvidence } from '@/lib/types';
import { Camera, Check, AlertCircle, Upload, X, ShieldAlert } from 'lucide-react';

interface Props {
  match: TournamentMatch;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (evidence: MatchEvidence) => void;
}

export default function EvidenceSubmissionModal({
  match,
  isOpen,
  onClose,
  onSubmitted,
}: Props) {
  const [submittedBy, setSubmittedBy] = useState(match.participant1Name || '');
  const [participantIndex, setParticipantIndex] = useState<1 | 2>(1);
  const [reportedScore1, setReportedScore1] = useState<number>(match.participant1Score || 0);
  const [reportedScore2, setReportedScore2] = useState<number>(match.participant2Score || 0);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotUrl(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittedBy.trim()) {
      setError('Please provide your player name / Gamertag.');
      return;
    }
    if (!screenshotUrl) {
      setError('Please attach an eFootball post-match screenshot proof.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: match.id,
          submittedBy: submittedBy.trim(),
          participantIndex,
          reportedScore1: Number(reportedScore1),
          reportedScore2: Number(reportedScore2),
          screenshotUrl,
          notes: notes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit match evidence.');
      }

      onSubmitted(json.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error submitting evidence.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-950">Submit Match Evidence</h3>
              <p className="text-xs text-zinc-500">Match #{match.matchNumber} · {match.roundName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Submitter Name & Identity */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Submitting As (Your Player Tag)
            </label>
            <input
              type="text"
              value={submittedBy}
              onChange={e => setSubmittedBy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Kwesi_eF"
              required
            />
          </div>

          {/* Participant Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Which slot are you in this fixture?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setParticipantIndex(1);
                  if (match.participant1Name) setSubmittedBy(match.participant1Name);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-left ${
                  participantIndex === 1
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Slot 1: {match.participant1Name || 'Player 1'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setParticipantIndex(2);
                  if (match.participant2Name) setSubmittedBy(match.participant2Name);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition text-left ${
                  participantIndex === 2
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Slot 2: {match.participant2Name || 'Player 2'}
              </button>
            </div>
          </div>

          {/* Reported Scores */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Final In-Game Score (Full-Time)
            </label>
            <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <span className="block text-[11px] font-medium text-zinc-500 truncate mb-1">
                  {match.participant1Name || 'Player 1'}
                </span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={reportedScore1}
                  onChange={e => setReportedScore1(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-xl font-black py-2 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <span className="block text-[11px] font-medium text-zinc-500 truncate mb-1">
                  {match.participant2Name || 'Player 2'}
                </span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={reportedScore2}
                  onChange={e => setReportedScore2(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-xl font-black py-2 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Screenshot Upload / Data URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Upload Post-Match Screenshot (Results Screen)
            </label>
            
            <div className="border-2 border-dashed border-zinc-200 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition relative bg-zinc-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {screenshotUrl ? (
                <div className="space-y-2">
                  <img
                    src={screenshotUrl}
                    alt="Uploaded Evidence"
                    className="max-h-36 mx-auto rounded-lg object-contain border border-zinc-200 shadow-sm"
                  />
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Screenshot Attached (Tap to replace)
                  </span>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="w-6 h-6 mx-auto text-zinc-400 mb-2" />
                  <span className="text-xs font-semibold text-zinc-700 block">
                    Tap to upload screenshot from device
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    PNG, JPG, or WEBP up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Match Notes or Extra Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Disconnect, extra time, penalty shootout result..."
              className="w-full px-4 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Evidence...' : 'Submit Evidence for Referee Verification'}
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-2">
              Tournament referees verify screenshot authenticity before officially advancing the bracket.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

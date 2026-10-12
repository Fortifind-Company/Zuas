'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Smartphone, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

function PaymentSimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reference = searchParams.get('ref') || 'ZUAS-DEMO-REF';
  const amount = searchParams.get('amount') || '25';
  const tournamentId = searchParams.get('tournament') || 'tourn_ghana_season_1';

  const [provider, setProvider] = useState<'MTN' | 'TELECEL' | 'AT' | 'CARD'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('0241234567');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulatePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });

      const json = await res.json();
      if (json.success) {
        setCompleted(true);
        setTimeout(() => {
          router.push(`/tournament?paid=true&ref=${reference}`);
        }, 2000);
      } else {
        setError(json.error || 'Payment failed to process');
      }
    } catch (e: any) {
      setError(e.message || 'Network error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-black/[0.08] rounded-3xl p-8 shadow-xl">
        
        {completed ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-zinc-950">Payment Confirmed!</h2>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              GH₵{amount} paid successfully. Your tournament registration is verified. Redirecting...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-black/[0.06]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/80 mb-2">
                <span>🇬🇭</span> Paystack Ghana Gateway
              </div>
              <h1 className="text-2xl font-black text-zinc-950">
                GH₵{amount}.00
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Ref: {reference}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Select Mobile Money Network
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'MTN', name: 'MTN MoMo', color: 'bg-yellow-400/20 text-yellow-800 border-yellow-400/50' },
                  { id: 'TELECEL', name: 'Telecel Cash', color: 'bg-red-50 text-red-700 border-red-200' },
                  { id: 'AT', name: 'AT Money', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { id: 'CARD', name: 'Debit Card', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProvider(item.id as any)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      provider === item.id
                        ? `${item.color} ring-2 ring-black`
                        : 'border-black/[0.08] hover:bg-zinc-50 text-zinc-600'
                    }`}
                  >
                    <span>{item.name}</span>
                    {provider === item.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {provider !== 'CARD' && (
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Mobile Money Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="024XXXXXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-black/[0.1] text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={processing}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 px-4 rounded-2xl bg-black text-white font-bold text-sm hover:bg-zinc-800 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing MoMo Prompt...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm & Pay GH₵{amount}.00
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
              <span>🔒</span> Secured with 256-bit SSL encryption
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PaymentSimulationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment gateway...</div>}>
      <PaymentSimulationContent />
    </Suspense>
  );
}

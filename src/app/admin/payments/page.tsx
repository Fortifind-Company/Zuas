'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { PaymentTransaction } from '@/lib/types';
import { CreditCard, CheckCircle2, Clock, XCircle, Search, RefreshCw, DollarSign, Smartphone } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments');
      const json = await res.json();
      if (json.success && json.data) {
        setPayments(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalCollectedGhc = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.amountGhc || 0), 0);

  const successfulCount = payments.filter(p => p.status === 'SUCCESS').length;
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;

  const filtered = payments.filter(
    p =>
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.customerPhone.includes(search)
  );

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
              Mobile Money & Payment Transactions
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Live ledger for Paystack, MTN Mobile Money, Telecel Cash, and AT Money tournament payments.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-black/[0.08] rounded-xl text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-50 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Ledger
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Total Revenue Collected
            </span>
            <div className="text-2xl font-black text-zinc-950 mt-1 flex items-center gap-1">
              <span>GH₵{totalCollectedGhc.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
              Across all tournaments & entry fees
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Successful Transactions
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successfulCount}</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium mt-1 block">
              Verified and settled
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Pending MoMo Prompts
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{pendingCount}</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium mt-1 block">
              Awaiting phone OTP / PIN confirmation
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-2xl border border-black/[0.06] shadow-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by payment reference, email, or Ghana phone number..."
            className="w-full text-xs bg-transparent focus:outline-none"
          />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black/[0.06] bg-zinc-50/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4 text-center">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      Loading payment records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                        {p.reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-950">{p.customerEmail}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{p.customerPhone || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700">
                          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                          {p.provider}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-zinc-950">
                        GH₵{p.amountGhc}.00
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {p.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : p.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-zinc-400 text-[11px]">
                        {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

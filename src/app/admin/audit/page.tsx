'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { AdminAuditLog } from '@/lib/types';
import { History, Shield, Clock } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit')
      .then(res => res.json())
      .then(json => {
        if (json.success) setLogs(json.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div>
            <h1 className="text-2xl font-black text-zinc-950">Administrative Audit Logs</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Immutable activity records for tournament creation, bracket changes, scores, and streams.
            </p>
          </div>

          <div className="nexa-card p-6 bg-white">
            {logs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-12 text-center">No audit logs recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Entity Type</th>
                      <th className="py-2.5 px-3">Performed By</th>
                      <th className="py-2.5 px-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 px-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.performedAt).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </td>
                        <td className="py-3 px-3 font-bold text-zinc-900">{log.action}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-700">
                            {log.entityType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-zinc-700">{log.performedBy}</td>
                        <td className="py-3 px-3 text-zinc-600 max-w-md">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

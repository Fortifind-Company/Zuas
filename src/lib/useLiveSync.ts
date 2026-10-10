'use client';

import { useState, useEffect, useCallback } from 'react';
import { TournamentMatch, Tournament, Announcement } from './types';

interface LiveSyncData {
  timestamp: string;
  liveCount: number;
  tournaments: Tournament[];
  liveMatches: TournamentMatch[];
  allMatches: TournamentMatch[];
  recentAnnouncements: Announcement[];
}

export function useLiveSync(tournamentId?: string, pollIntervalMs: number = 7000) {
  const [data, setData] = useState<LiveSyncData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      const url = tournamentId
        ? `/api/live-sync?tournamentId=${encodeURIComponent(tournamentId)}`
        : '/api/live-sync';

      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Sync failed');
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchSync();
    const interval = setInterval(fetchSync, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchSync, pollIntervalMs]);

  return {
    data,
    loading,
    error,
    isSyncing,
    refresh: fetchSync,
  };
}

'use client';

import { useEffect, useMemo, useState } from 'react';

type SenderRun = {
  id: string;
  tenantId: string;
  campaignId: string;
  leadId: string;
  status: 'pending' | 'running' | 'failed' | 'done';
  stepIndex: number;
  nextAt: number;
  updatedAt: number;
  lastError?: string | null;
};

function fmt(ms?: number) {
  if (!ms) return '-';
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return String(ms);
  }
}

export function SenderQueueDashboard() {
  const [runs, setRuns] = useState<SenderRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'all' | SenderRun['status']>('all');
  const [limit, setLimit] = useState(100);
  const [message, setMessage] = useState<string>('');

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(limit));
      if (status !== 'all') qs.set('status', status);
      const res = await fetch(`/api/sender/runs?${qs.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Failed to load runs');
      setRuns(Array.isArray(json?.runs) ? json.runs : []);
    } catch (e: any) {
      setMessage(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function processNow() {
    setLoading(true);
    setMessage('');
    try {
      const qs = new URLSearchParams();
      qs.set('limit', String(Math.min(Math.max(limit, 1), 200)));
      const res = await fetch(`/api/sender/process?${qs.toString()}`, { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Process failed');
      setMessage(`Processed ${json?.processed ?? 0} runs.`);
      await load();
    } catch (e: any) {
      setMessage(e?.message || 'Process failed');
    } finally {
      setLoading(false);
    }
  }

  async function retry(runId: string) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/sender/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Retry failed');
      setMessage('Retry queued.');
      await load();
    } catch (e: any) {
      setMessage(e?.message || 'Retry failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, limit]);

  const stats = useMemo(() => {
    const s = { pending: 0, running: 0, failed: 0, done: 0 };
    for (const r of runs) {
      if (r.status === 'pending') s.pending += 1;
      else if (r.status === 'running') s.running += 1;
      else if (r.status === 'failed') s.failed += 1;
      else if (r.status === 'done') s.done += 1;
    }
    return s;
  }, [runs]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Sender Queue</h1>
            <p className="text-sm text-zinc-400">Runs are per-lead, per-campaign. This is your execution truth.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              onClick={processNow}
              disabled={loading}
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-zinc-50 hover:bg-emerald-500 disabled:opacity-50"
            >
              Process Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-zinc-900 p-3">
            <div className="text-xs text-zinc-400">Pending</div>
            <div className="text-2xl font-semibold text-zinc-100">{stats.pending}</div>
          </div>
          <div className="rounded-lg bg-zinc-900 p-3">
            <div className="text-xs text-zinc-400">Running</div>
            <div className="text-2xl font-semibold text-zinc-100">{stats.running}</div>
          </div>
          <div className="rounded-lg bg-zinc-900 p-3">
            <div className="text-xs text-zinc-400">Failed</div>
            <div className="text-2xl font-semibold text-zinc-100">{stats.failed}</div>
          </div>
          <div className="rounded-lg bg-zinc-900 p-3">
            <div className="text-xs text-zinc-400">Done</div>
            <div className="text-2xl font-semibold text-zinc-100">{stats.done}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-zinc-900 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-md bg-zinc-800 px-2 py-1 text-sm text-zinc-100"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="failed">Failed</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Limit</span>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value || 100))}
              className="w-24 rounded-md bg-zinc-800 px-2 py-1 text-sm text-zinc-100"
              min={10}
              max={200}
            />
          </div>
          {message ? <div className="text-sm text-zinc-300">{message}</div> : null}
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Step</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Next At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Updated</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Error</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 bg-zinc-950">
              {runs.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm text-zinc-200">{r.status}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{r.campaignId}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{r.leadId}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{r.stepIndex}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{fmt(r.nextAt)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{fmt(r.updatedAt)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{r.lastError || ''}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'failed' ? (
                      <button
                        onClick={() => retry(r.id)}
                        disabled={loading}
                        className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
                      >
                        Retry
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!runs.length ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-zinc-500">
                    {loading ? 'Loading...' : 'No runs found.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

type Action = {
  id: string;
  type: string;
  entityId: string;
  campaignId?: string;
  createdAt: number;
  fromTier?: string;
  toTier?: string;
  payload?: Record<string, any>;
};

function fmtTime(ms: number) {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return String(ms);
  }
}

export default function AudienceActionsPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const withinDays = 30;

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/audience/actions/list?limit=200', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || 'Failed to load actions');
      setLoading(false);
      return;
    }
    setActions(data?.actions || []);
    setLoading(false);
  }

  async function runNow() {
    setRunning(true);
    setError(null);
    const res = await fetch('/api/audience/actions/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withinDays }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || 'Failed to run actions');
      setRunning(false);
      return;
    }
    setRunning(false);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Audience Actions</h1>
          <div className="text-sm opacity-70">
            This is the execution log: transitions and suppression hooks.
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="px-3 py-2 rounded border">
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button onClick={runNow} disabled={running} className="px-3 py-2 rounded bg-black text-white">
            {running ? 'Running…' : `Run (${withinDays}d)`}
          </button>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="border rounded p-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Entity</th>
              <th className="py-2 pr-4">Tier</th>
              <th className="py-2 pr-4">Campaign</th>
              <th className="py-2 pr-4">Payload</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2 pr-4 whitespace-nowrap">{fmtTime(a.createdAt)}</td>
                <td className="py-2 pr-4 font-medium">{a.type}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{a.entityId}</td>
                <td className="py-2 pr-4 whitespace-nowrap">
                  {a.fromTier || '—'} → {a.toTier || '—'}
                </td>
                <td className="py-2 pr-4 whitespace-nowrap">{a.campaignId || '—'}</td>
                <td className="py-2 pr-4 max-w-[420px] truncate" title={JSON.stringify(a.payload || {})}>
                  {JSON.stringify(a.payload || {})}
                </td>
              </tr>
            ))}
            {actions.length === 0 ? (
              <tr>
                <td className="py-6 opacity-70" colSpan={6}>
                  No actions yet. Click Run.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

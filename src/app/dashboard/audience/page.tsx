'use client';

import { useEffect, useMemo, useState } from 'react';

type Segment = {
  id: string;
  tier: 'cold' | 'warm' | 'hot';
  size: number;
  updatedAt: number;
  scope: { type: 'all' } | { type: 'campaign'; campaignId: string };
  rule: { minWeight: number; withinDays: number };
  breakdown?: { withLeadId: number; anonymous: number };
};

function fmtTime(ms: number) {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return String(ms);
  }
}

export default function AudienceDashboardPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const withinDays = 30;

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/audience/segments/list', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || 'Failed to load segments');
      setLoading(false);
      return;
    }
    setSegments(data?.segments || []);
    setLoading(false);
  }

  async function buildNow() {
    setBuilding(true);
    setError(null);
    const res = await fetch('/api/audience/segments/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withinDays }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || 'Failed to build segments');
      setBuilding(false);
      return;
    }
    // Prefer immediate result, then refresh persisted list
    setSegments(data?.segments || []);
    setBuilding(false);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const groups = useMemo(() => {
    const all = segments.filter((s) => s.scope?.type === 'all');
    const campaigns = segments.filter((s) => s.scope?.type === 'campaign');
    return { all, campaigns };
  }, [segments]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Audience Network</h1>
          <div className="text-sm opacity-70">Segments are derived from events (no PII stored).</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="px-3 py-2 rounded border"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            onClick={buildNow}
            disabled={building}
            className="px-3 py-2 rounded bg-black text-white"
          >
            {building ? 'Building…' : `Build (${withinDays}d)`}
          </button>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="grid md:grid-cols-3 gap-3">
        {(['hot', 'warm', 'cold'] as const).map((tier) => {
          const seg = groups.all.find((s) => s.tier === tier);
          return (
            <div key={tier} className="border rounded p-4">
              <div className="font-medium capitalize">{tier}</div>
              <div className="text-2xl font-semibold mt-1">{seg?.size ?? 0}</div>
              <div className="text-xs opacity-70 mt-1">
                min weight ≥ {seg?.rule?.minWeight ?? (tier === 'hot' ? 21 : tier === 'warm' ? 13 : 3)}
              </div>
              <div className="text-xs opacity-70">
                updated {seg?.updatedAt ? fmtTime(seg.updatedAt) : '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border rounded p-4">
        <div className="font-medium">All segments (debug)</div>
        <div className="text-sm opacity-70">Includes campaign-scoped segments when you build them via API.</div>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left opacity-70">
                <th className="py-2 pr-4">Segment</th>
                <th className="py-2 pr-4">Scope</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Rule</th>
                <th className="py-2 pr-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 pr-4 font-medium">{s.id}</td>
                  <td className="py-2 pr-4">
                    {s.scope?.type === 'all' ? 'all' : `campaign:${s.scope.campaignId}`}
                  </td>
                  <td className="py-2 pr-4">{s.size}</td>
                  <td className="py-2 pr-4">
                    ≥{s.rule?.minWeight} (last {s.rule?.withinDays}d)
                  </td>
                  <td className="py-2 pr-4">{s.updatedAt ? fmtTime(s.updatedAt) : '—'}</td>
                </tr>
              ))}
              {segments.length === 0 ? (
                <tr>
                  <td className="py-6 opacity-70" colSpan={5}>
                    No segments yet. Click Build.
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

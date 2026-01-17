'use client';

import { useEffect, useState } from 'react';
import { authorizedFetch } from '@/lib/auth-fetch';

type HandoffTicket = {
  id: string;
  leadId?: string;
  campaignId?: string;
  status?: string;
  channel?: string;
  reason?: string | null;
  notes?: string | null;
  createdAt?: any;
};

type TicketForm = {
  leadId: string;
  campaignId: string;
  channel: 'call' | 'whatsapp' | 'email' | 'other';
  reason: string;
  notes: string;
};

const CHANNELS: TicketForm['channel'][] = ['call', 'whatsapp', 'email', 'other'];

function toMillis(value: any) {
  if (!value) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  if (typeof value === 'object') {
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value._seconds === 'number') return value._seconds * 1000;
    if (typeof value.seconds === 'number') return value.seconds * 1000;
  }
  return undefined;
}

function fmt(value: any) {
  const ms = toMillis(value);
  if (!ms) return '-';
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return String(ms);
  }
}

export function HandoffTicketDashboard() {
  const [tickets, setTickets] = useState<HandoffTicket[]>([]);
  const [form, setForm] = useState<TicketForm>({
    leadId: '',
    campaignId: '',
    channel: 'call',
    reason: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadTickets() {
    setLoading(true);
    setMessage('');
    try {
      const res = await authorizedFetch('/api/handoff/tickets', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Failed to load tickets');
      setTickets(Array.isArray(json?.tickets) ? json.tickets : []);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  async function submitTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        leadId: form.leadId.trim(),
        campaignId: form.campaignId.trim(),
        channel: form.channel,
        reason: form.reason.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };
      if (!payload.leadId || !payload.campaignId) {
        throw new Error('Lead ID and campaign ID are required.');
      }
      const res = await authorizedFetch('/api/handoff/tickets', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Failed to create ticket');
      setMessage('Handoff ticket created. Automation is now suppressed for this lead.');
      setForm((prev) => ({ ...prev, leadId: '', campaignId: '', reason: '', notes: '' }));
      await loadTickets();
    } catch (err: any) {
      setMessage(err?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="p-6 text-white">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Handoff Tickets</h1>
            <p className="text-sm text-zinc-400">
              Create a ticket to move a lead to human takeover and suppress automation immediately.
            </p>
          </div>
          <button
            onClick={loadTickets}
            disabled={loading}
            className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <form onSubmit={submitTicket} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-zinc-300">
              Lead ID
              <input
                value={form.leadId}
                onChange={(event) => setForm((prev) => ({ ...prev, leadId: event.target.value }))}
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="lead_123"
              />
            </label>
            <label className="text-sm text-zinc-300">
              Campaign ID
              <input
                value={form.campaignId}
                onChange={(event) => setForm((prev) => ({ ...prev, campaignId: event.target.value }))}
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="cmp_456"
              />
            </label>
            <label className="text-sm text-zinc-300">
              Channel
              <select
                value={form.channel}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, channel: event.target.value as TicketForm['channel'] }))
                }
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                {CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-300">
              Reason
              <input
                value={form.reason}
                onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="Pricing negotiation, viewing request..."
              />
            </label>
          </div>
          <label className="mt-4 block text-sm text-zinc-300">
            Notes
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-2 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              rows={3}
              placeholder="Add context for the human agent."
            />
          </label>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-zinc-50 hover:bg-emerald-500 disabled:opacity-50"
            >
              Create Ticket
            </button>
            {message ? <span className="text-sm text-zinc-300">{message}</span> : null}
          </div>
        </form>

        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 bg-zinc-950">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-3 text-sm text-zinc-200">{ticket.status || 'open'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{ticket.leadId || '-'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{ticket.campaignId || '-'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{ticket.channel || '-'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{ticket.reason || '-'}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{fmt(ticket.createdAt)}</td>
                </tr>
              ))}
              {!tickets.length && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-zinc-500">
                    No handoff tickets yet.
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

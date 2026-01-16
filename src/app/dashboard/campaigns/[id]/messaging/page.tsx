'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Save } from 'lucide-react';

type SmartSequenceDraft = {
  email: { subject: string; body: string };
  sms: { message: string };
  whatsapp: { message: string };
};

export default function CampaignMessagingPage() {
  const { id } = useParams<{ id: string }>();

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [running, setRunning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [runReport, setRunReport] = useState<any>(null);

  const [enabled, setEnabled] = useState(false);
  const [draft, setDraft] = useState<SmartSequenceDraft>({
    email: { subject: 'New launch details', body: 'Hi!\n\nHere are the details.\n\n{{landing_url}}\n' },
    sms: { message: 'Sent you full details by email. Check inbox. Link: {{landing_url}}' },
    whatsapp: { message: 'I just emailed you the full details. Want the brochure here too? {{landing_url}}' },
  });

  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');

  const landingUrl = useMemo(() => {
    const raw = campaign?.landing?.url || '';
    if (!raw) return '';
    try {
      const u = new URL(raw);
      if (!u.searchParams.get('campaignDocId')) {
        u.searchParams.set('campaignDocId', String(id));
      }
      if (!u.searchParams.get('channel')) {
        u.searchParams.set('channel', 'sender');
      }
      return u.toString();
    } catch {
      const sep = raw.includes('?') ? '&' : '?';
      const has = raw.includes('campaignDocId=');
      const base = has ? raw : `${raw}${sep}campaignDocId=${encodeURIComponent(String(id))}`;
      return base.includes('channel=') ? base : `${base}&channel=sender`;
    }
  }, [campaign, id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        const data = await res.json();
        if (!mounted) return;
        setCampaign(data?.campaign);

        const sender = data?.campaign?.bindings?.sender;
        if (sender) {
          setEnabled(!!sender.enabled);
          if (sender.smartSequenceDraft) {
            setDraft(sender.smartSequenceDraft);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  function renderTemplate(s: string) {
    return s.replaceAll('{{landing_url}}', landingUrl || '');
  }

  async function save() {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/bindings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bindings: {
            sender: {
              enabled,
              smartSequenceDraft: draft,
              updatedAt: Date.now(),
            },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save');
      setCampaign(data?.campaign);
      setSuccess('Saved');
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setError(null);
    setSuccess(null);

    if (!landingUrl) {
      setError('Set campaign landing first.');
      return;
    }
    if (!testEmail && !testPhone) {
      setError('Provide a test email and/or phone.');
      return;
    }

    setSending(true);
    try {
      // Email first
      if (testEmail) {
        const emailRes = await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: testEmail,
            subject: renderTemplate(draft.email.subject),
            body: renderTemplate(draft.email.body).replaceAll('\n', '<br/>'),
          }),
        });
        const emailData = await emailRes.json();
        if (!emailRes.ok) throw new Error(emailData?.error || 'Email failed');
      }

      // Then SMS
      if (testPhone) {
        const smsRes = await fetch('/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: testPhone,
            message: renderTemplate(draft.sms.message),
          }),
        });
        const smsData = await smsRes.json();
        if (!smsRes.ok) throw new Error(smsData?.error || 'SMS failed');
      }

      // Optional WhatsApp (best-effort)
      if (testPhone) {
        const waRes = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: testPhone,
            message: renderTemplate(draft.whatsapp.message),
          }),
        });
        if (waRes.ok) {
          // ok
        }
      }

      setSuccess('Test sent (email → sms → whatsapp where available)');
    } catch (e: any) {
      setError(e?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  async function startRun(mode: 'new' | 'all') {
    setError(null);
    setSuccess(null);
    setRunReport(null);

    if (!landingUrl) {
      setError('Set campaign landing first.');
      return;
    }
    if (!enabled) {
      setError('Enable sender first.');
      return;
    }

    setRunning(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/sender/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, limit: 25 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to start run');
      setRunReport(data);
      setSuccess(`Run started: touched ${data.touched}, created ${data.created}, processed ${data.processed}`);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setRunning(false);
    }
  }

  async function processQueue() {
    setError(null);
    setSuccess(null);
    setRunReport(null);

    if (!enabled) {
      setError('Enable sender first.');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/campaigns/${id}/sender/process?limit=25`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to process queue');
      setRunReport(data);
      setSuccess(`Queue processed: ${data.processed}`);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm opacity-70 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!campaign) return <div className="p-6">Campaign not found.</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Smart Sender</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{campaign.status}</Badge>
            <span className="text-sm opacity-70">{campaign.name}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/campaigns/${id}`}>
            <Button variant="outline">Back</Button>
          </Link>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="ml-2">Save</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
          <CardDescription>Enable the sender for this campaign and define the default sequence draft.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm">
            Landing: {landingUrl ? <a className="underline" href={landingUrl} target="_blank" rel="noreferrer">open</a> : <span className="opacity-70">not set</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Enabled</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email</CardTitle>
            <CardDescription>Full details + links + attachments later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              value={draft.email.subject}
              onChange={(e) => setDraft({ ...draft, email: { ...draft.email, subject: e.target.value } })}
              placeholder="Subject"
            />
            <Textarea
              value={draft.email.body}
              onChange={(e) => setDraft({ ...draft, email: { ...draft.email, body: e.target.value } })}
              rows={8}
            />
            <div className="text-xs opacity-70">Use <code>{{'{{landing_url}}'}}</code> in templates.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SMS</CardTitle>
            <CardDescription>Short follow-up that points to email/landing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={draft.sms.message}
              onChange={(e) => setDraft({ ...draft, sms: { message: e.target.value } })}
              rows={8}
            />
            <div className="text-xs opacity-70">Keep it under 160–300 chars when possible.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">WhatsApp</CardTitle>
            <CardDescription>Optional. Will send only if provider is configured.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={draft.whatsapp.message}
              onChange={(e) => setDraft({ ...draft, whatsapp: { message: e.target.value } })}
              rows={8}
            />
            <div className="text-xs opacity-70">If /api/whatsapp/send isn’t configured, it will be skipped.</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Run on campaign leads</CardTitle>
          <CardDescription>
            Creates per-lead sender runs for this campaign and processes the first due step. Next steps stay queued.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" onClick={() => startRun('new')} disabled={running}>
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span className={running ? 'ml-2' : ''}>Send to new leads</span>
            </Button>
            <Button variant="outline" onClick={() => startRun('all')} disabled={running}>
              Re-run all leads
            </Button>
            <Button variant="secondary" onClick={processQueue} disabled={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span className={processing ? 'ml-2' : ''}>Process queue now</span>
            </Button>
          </div>

          {runReport ? (
            <div className="text-sm opacity-80">
              <div>Last report:</div>
              <pre className="mt-2 text-xs bg-muted rounded-md p-3 overflow-auto max-h-48">{JSON.stringify(runReport, null, 2)}</pre>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Send test</CardTitle>
          <CardDescription>Runs the sequence now: Email → SMS → WhatsApp (best-effort).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-sm">Test email</div>
              <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="name@company.com" />
            </div>
            <div className="space-y-2">
              <div className="text-sm">Test phone</div>
              <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="+9715…" />
            </div>
          </div>

          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          {success ? <div className="text-sm text-green-500">{success}</div> : null}

          <Button onClick={sendTest} disabled={sending}>
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="ml-2">Send test</span>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}

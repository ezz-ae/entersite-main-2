import { getAdminDb } from '@/server/firebase-admin';
import { CAP } from '@/lib/capabilities';
import { resend, fromEmail } from '@/lib/resend';
import { checkUsageLimit, enforceUsageLimit } from '@/lib/server/billing';
import {
  DEFAULT_SENDER_DELAYS,
  type SmartSequenceDraft,
  type SenderDelays,
  type SenderRun,
} from './sender-types';
import {
  listDueSenderRuns,
  listDueSenderRunsForTenant,
  updateSenderRun,
} from './sender-store';
import { writeSenderEvent } from './sender-events';
import { writeAudienceEvent } from '@/server/audience/write-event';
import type { AudienceProfile } from '@/server/audience/profile-types';
import { writeAudienceAction } from '@/server/audience/write-action';
import type { LeadDirection } from '@/lib/lead-direction';

function renderTemplate(text: string, vars: Record<string, string>) {
  let out = text || '';
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const TWILIO_WHATSAPP_FROM_NUMBER = process.env.TWILIO_WHATSAPP_FROM_NUMBER;

function toWhatsAppNumber(raw: string) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('whatsapp:')) return trimmed;
  return `whatsapp:${trimmed}`;
}

async function sendEmail(payload: { tenantId: string; to: string; subject: string; bodyHtml: string }) {
  if (!CAP.resend || !resend) throw new Error('Email provider is not configured');
  const db = getAdminDb();
  await checkUsageLimit(db, payload.tenantId, 'email_sends');

  const { error } = await resend.emails.send({
    from: `Entrelead <${fromEmail()}>`,
    to: payload.to,
    subject: payload.subject,
    html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${payload.bodyHtml}</div>`,
  });
  if (error) throw new Error(error.message || 'Email failed');

  try {
    await enforceUsageLimit(db, payload.tenantId, 'email_sends', 1);
  } catch {
    // already sent; ignore
  }
}

async function sendSms(payload: { tenantId: string; to: string; message: string }) {
  if (!CAP.twilio || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    throw new Error('SMS provider is not configured');
  }
  const db = getAdminDb();
  await checkUsageLimit(db, payload.tenantId, 'sms_sends');

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: payload.to,
      From: TWILIO_FROM_NUMBER,
      Body: payload.message,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || 'SMS failed');

  try {
    await enforceUsageLimit(db, payload.tenantId, 'sms_sends', 1);
  } catch {
    // ignore
  }
}

async function sendWhatsapp(payload: { tenantId: string; to: string; message: string }) {
  // Best-effort: if not configured, treat as skipped.
  if (!CAP.twilio || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM_NUMBER) return;
  const db = getAdminDb();
  await checkUsageLimit(db, payload.tenantId, 'sms_sends'); // reuse sms meter

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: toWhatsAppNumber(payload.to),
      From: toWhatsAppNumber(TWILIO_WHATSAPP_FROM_NUMBER),
      Body: payload.message,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || 'WhatsApp failed');

  try {
    await enforceUsageLimit(db, payload.tenantId, 'sms_sends', 1);
  } catch {
    // ignore
  }
}

function getVars(args: {
  landingUrl: string;
  lead: any;
  campaign: any;
}) {
  const name = (args.lead?.name || args.lead?.fullName || args.lead?.firstName || '').toString();
  return {
    landing_url: args.landingUrl || '',
    lead_name: name || 'there',
    campaign_name: (args.campaign?.name || '').toString(),
  };
}

function resolveLandingUrl(campaign: any) {
  const raw = campaign?.landing?.url || '';
  const campaignId = campaign?.id || campaign?.campaignId || campaign?.docId;
  if (!raw) return '';
  try {
    const u = new URL(raw);
    if (campaignId && !u.searchParams.get('campaignDocId')) {
      u.searchParams.set('campaignDocId', String(campaignId));
    }
    return u.toString();
  } catch {
    return raw;
  }
}

async function loadCampaignAndLead(params: {
  tenantId: string;
  campaignId: string;
  leadId: string;
}) {
  const db = getAdminDb();
  const campRef = db.collection('tenants').doc(params.tenantId).collection('campaigns').doc(params.campaignId);
  const leadRef = db.collection('tenants').doc(params.tenantId).collection('leads').doc(params.leadId);
  const [campSnap, leadSnap] = await Promise.all([campRef.get(), leadRef.get()]);
  if (!campSnap.exists) throw new Error('Campaign not found');
  if (!leadSnap.exists) throw new Error('Lead not found');
  const campaignData = (campSnap.data() || {}) as Record<string, any>;
  const leadData = (leadSnap.data() || {}) as Record<string, any>;
  return { campaign: { id: campSnap.id, ...campaignData }, lead: { id: leadSnap.id, ...leadData } };
}

function resolveDraft(campaign: any): { enabled: boolean; draft: SmartSequenceDraft; delays: SenderDelays } {
  const sender = campaign?.bindings?.sender || {};
  const enabled = !!sender.enabled;
  const draft = (sender.smartSequenceDraft || {}) as SmartSequenceDraft;
  const delays: SenderDelays = {
    emailToSmsMs: Number(sender.delays?.emailToSmsMs ?? DEFAULT_SENDER_DELAYS.emailToSmsMs),
    smsToWhatsappMs: Number(sender.delays?.smsToWhatsappMs ?? DEFAULT_SENDER_DELAYS.smsToWhatsappMs),
  };
  return { enabled, draft, delays };
}

async function processOneRun(run: SenderRun) {
  const loaded = await loadCampaignAndLead({
    tenantId: run.tenantId,
    campaignId: run.campaignId,
    leadId: run.leadId,
  });
  const campaign = loaded.campaign as Record<string, any>;
  const lead = loaded.lead as Record<string, any>;
  const leadDirection = (lead?.direction as LeadDirection | null) ?? null;
  const leadHotScore = typeof lead?.hotScore === 'number' ? lead.hotScore : null;
  const baseEvent = {
    tenantId: run.tenantId,
    campaignId: run.campaignId,
    leadId: run.leadId,
    runId: run.id,
    direction: leadDirection,
    hotScore: leadHotScore,
  };

  // Audience action hook: if a lead is already HOT, suppress further automation.
  // This prevents spamming high-intent leads while keeping the pipe deterministic.
  try {
    const db = getAdminDb();
    const profileId = `lead:${run.leadId}`;
    const profileSnap = await db
      .collection('tenants')
      .doc(run.tenantId)
      .collection('audience_profiles')
      .doc(profileId)
      .get();
    const profile = (profileSnap.exists ? (profileSnap.data() as AudienceProfile) : null) as any;
    const tier = profile?.tier || 'none';
    if (tier === 'hot' && run.stepIndex >= 1) {
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'suppressed',
          lastError: 'Suppressed: lead is hot',
          history: [
            ...(run.history || []),
            { at: Date.now(), channel: 'skip', ok: true, message: 'Suppressed (hot lead)' },
          ],
        },
      });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.suppressed_hot',
          stepIndex: run.stepIndex,
          channel: 'none',
          reason: 'Suppressed: lead is hot',
          hotScore: profile?.totalWeight ?? leadHotScore,
        });
      } catch {
        // never block
      }
      try {
        await writeAudienceAction({
          tenantId: run.tenantId,
          campaignId: run.campaignId,
          entityId: profileId,
          type: 'sender.suppressed_hot',
          fromTier: tier,
          toTier: tier,
          payload: {
            runId: run.id,
            stepIndex: run.stepIndex,
            leadId: run.leadId,
            hotScore: profile?.totalWeight ?? null,
          },
        });
      } catch {
        // never block
      }
      return { ok: true, action: 'suppressed_hot' };
    }
  } catch {
    // ignore profile lookup failures
  }

  const { enabled, draft, delays } = resolveDraft(campaign);
  if (!enabled) {
    await updateSenderRun({
      tenantId: run.tenantId,
      runId: run.id,
      patch: {
        status: 'failed',
        lastError: 'Sender disabled for campaign',
        history: [...(run.history || []), { at: Date.now(), channel: 'skip', ok: false, message: 'Sender disabled' }],
      },
    });
    return { ok: false, reason: 'sender_disabled' };
  }

  const landingUrl = resolveLandingUrl(campaign);
  const vars = getVars({ landingUrl, lead, campaign });

  const emailTo = (lead?.email || lead?.contact?.email || '').toString();
  const phoneTo = (lead?.phone || lead?.mobile || lead?.contact?.phone || '').toString();

  const history = [...(run.history || [])];

  const now = Date.now();
  await updateSenderRun({
    tenantId: run.tenantId,
    runId: run.id,
    patch: { status: 'running' },
  });

  // Step resolution with skipping if channel not available
  if (run.stepIndex === 0) {
    if (!draft.email || !emailTo) {
      const reason = 'Skip email (missing draft or lead email)';
      history.push({ at: now, channel: 'skip', ok: true, message: reason });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.skipped',
          stepIndex: 0,
          channel: 'email',
          reason,
        });
      } catch {
        // never block
      }
      await updateSenderRun({ tenantId: run.tenantId, runId: run.id, patch: { stepIndex: 1, nextAt: now } });
      return { ok: true, action: 'skipped_email' };
    }

    const subject = renderTemplate(draft.email.subject, vars);
    const body = renderTemplate(draft.email.body, vars).replaceAll('\n', '<br/>');
    try {
      await sendEmail({ tenantId: run.tenantId, to: emailTo, subject, bodyHtml: body });
      history.push({ at: now, channel: 'email', ok: true });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.sent',
          stepIndex: 0,
          channel: 'email',
        });
      } catch {
        // never block
      }
    } catch (err: any) {
      const message = err?.message || 'Email failed';
      history.push({ at: now, channel: 'email', ok: false, message });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.failed',
          stepIndex: 0,
          channel: 'email',
          reason: message,
        });
      } catch {
        // never block
      }
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history,
        },
      });
      return { ok: false, reason: 'email_failed' };
    }

    try {
      await writeAudienceEvent({
        tenantId: run.tenantId,
        campaignId: run.campaignId,
        actor: { type: 'lead', leadId: run.leadId },
        type: 'sender.email.sent',
        payload: { runId: run.id },
      });
    } catch {
      // never block delivery pipeline
    }

    await updateSenderRun({
      tenantId: run.tenantId,
      runId: run.id,
      patch: {
        history,
        stepIndex: 1,
        nextAt: now + delays.emailToSmsMs,
      },
    });

    return { ok: true, action: 'sent_email' };
  }

  if (run.stepIndex === 1) {
    if (!draft.sms || !phoneTo) {
      const reason = 'Skip SMS (missing draft or lead phone)';
      history.push({ at: now, channel: 'skip', ok: true, message: reason });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.skipped',
          stepIndex: 1,
          channel: 'sms',
          reason,
        });
      } catch {
        // never block
      }
      await updateSenderRun({ tenantId: run.tenantId, runId: run.id, patch: { stepIndex: 2, nextAt: now } });
      return { ok: true, action: 'skipped_sms' };
    }

    const msg = renderTemplate(draft.sms.message, vars);
    try {
      await sendSms({ tenantId: run.tenantId, to: phoneTo, message: msg });
      history.push({ at: now, channel: 'sms', ok: true });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.sent',
          stepIndex: 1,
          channel: 'sms',
        });
      } catch {
        // never block
      }
    } catch (err: any) {
      const message = err?.message || 'SMS failed';
      history.push({ at: now, channel: 'sms', ok: false, message });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.failed',
          stepIndex: 1,
          channel: 'sms',
          reason: message,
        });
      } catch {
        // never block
      }
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history,
        },
      });
      return { ok: false, reason: 'sms_failed' };
    }

    try {
      await writeAudienceEvent({
        tenantId: run.tenantId,
        campaignId: run.campaignId,
        actor: { type: 'lead', leadId: run.leadId },
        type: 'sender.sms.sent',
        payload: { runId: run.id },
      });
    } catch {
      // never block delivery pipeline
    }

    await updateSenderRun({
      tenantId: run.tenantId,
      runId: run.id,
      patch: {
        history,
        stepIndex: 2,
        nextAt: now + delays.smsToWhatsappMs,
      },
    });

    return { ok: true, action: 'sent_sms' };
  }

  if (run.stepIndex === 2) {
    if (!draft.whatsapp || !phoneTo) {
      const reason = 'Skip WhatsApp (missing draft or lead phone)';
      history.push({ at: now, channel: 'skip', ok: true, message: reason });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.skipped',
          stepIndex: 2,
          channel: 'whatsapp',
          reason,
        });
      } catch {
        // never block
      }
      await updateSenderRun({ tenantId: run.tenantId, runId: run.id, patch: { stepIndex: 3, nextAt: now } });
      return { ok: true, action: 'skipped_whatsapp' };
    }

    const msg = renderTemplate(draft.whatsapp.message, vars);
    try {
      await sendWhatsapp({ tenantId: run.tenantId, to: phoneTo, message: msg });
      history.push({ at: now, channel: 'whatsapp', ok: true });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.sent',
          stepIndex: 2,
          channel: 'whatsapp',
        });
      } catch {
        // never block
      }
    } catch (err: any) {
      const message = err?.message || 'WhatsApp failed';
      history.push({ at: now, channel: 'whatsapp', ok: false, message });
      try {
        await writeSenderEvent({
          ...baseEvent,
          type: 'sender.step.failed',
          stepIndex: 2,
          channel: 'whatsapp',
          reason: message,
        });
      } catch {
        // never block
      }
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history,
        },
      });
      return { ok: false, reason: 'whatsapp_failed' };
    }

    try {
      await writeAudienceEvent({
        tenantId: run.tenantId,
        campaignId: run.campaignId,
        actor: { type: 'lead', leadId: run.leadId },
        type: 'sender.whatsapp.sent',
        payload: { runId: run.id },
      });
    } catch {
      // never block delivery pipeline
    }

    await updateSenderRun({
      tenantId: run.tenantId,
      runId: run.id,
      patch: {
        history,
        stepIndex: 3,
        nextAt: now,
        status: 'done',
      },
    });

    return { ok: true, action: 'sent_whatsapp' };
  }

  // Done
  await updateSenderRun({
    tenantId: run.tenantId,
    runId: run.id,
    patch: { status: 'done' },
  });
  return { ok: true, action: 'done' };
}

// Exported for cron/global processing.
export async function processSenderRun(run: SenderRun) {
  return processOneRun(run);
}

export async function processDueSenderRuns(params: {
  tenantId: string;
  campaignId: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit ?? 25, 1), 100);
  const runs = await listDueSenderRuns({ tenantId: params.tenantId, campaignId: params.campaignId, limit });
  const results: Array<{ runId: string; ok: boolean; action?: string; error?: string }> = [];

  for (const run of runs) {
    try {
      const r = await processOneRun(run);
      results.push({ runId: run.id, ok: !!r.ok, action: (r as any).action });
    } catch (err: any) {
      const message = err?.message || 'Failed';
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history: [...(run.history || []), { at: Date.now(), channel: 'skip', ok: false, message }],
        },
      });
      results.push({ runId: run.id, ok: false, error: message });
    }
  }

  return { processed: results.length, results };
}

export async function processDueSenderRunsForTenant(params: {
  tenantId: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit ?? 50, 1), 200);
  const runs = await listDueSenderRunsForTenant({ tenantId: params.tenantId, limit });
  const results: Array<{ runId: string; ok: boolean; action?: string; error?: string }> = [];

  for (const run of runs) {
    try {
      const r = await processOneRun(run);
      results.push({ runId: run.id, ok: !!r.ok, action: (r as any).action });
    } catch (err: any) {
      const message = err?.message || 'Failed';
      await updateSenderRun({
        tenantId: run.tenantId,
        runId: run.id,
        patch: {
          status: 'failed',
          lastError: message,
          history: [...(run.history || []), { at: Date.now(), channel: 'skip', ok: false, message }],
        },
      });
      results.push({ runId: run.id, ok: false, error: message });
    }
  }

  return { processed: results.length, results };
}

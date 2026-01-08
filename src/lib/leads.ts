'use client';

export interface LeadAttribution {
  campaignId?: string;
  campaignDocId?: string;
  channel?: string;
  value?: number;
}

export interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
  project?: string;
  context?: { page?: string; buttonId?: string; service?: string };
  attribution?: LeadAttribution;
  metadata?: Record<string, any>;
  tenantId?: string;
  siteId?: string;
}

export async function captureLead(payload: LeadPayload) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to capture lead');
  }

  return res.json();
}

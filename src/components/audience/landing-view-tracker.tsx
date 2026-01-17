"use client";

import { useEffect } from 'react';

type Props = {
  siteId: string;
  campaignDocId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

function getOrCreateFingerprint(): string {
  // Keep it simple: stable per browser via localStorage.
  // No PII, no device fingerprinting.
  const key = 'entrestate_fp_v1';
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const fp = `fp_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
    localStorage.setItem(key, fp);
    return fp;
  } catch {
    // If storage blocked, fall back to ephemeral.
    return `fp_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }
}

function shouldDedupe(siteId: string, campaignDocId?: string): boolean {
  const day = new Date();
  const dayKey = `${day.getUTCFullYear()}-${String(day.getUTCMonth() + 1).padStart(2, '0')}-${String(day.getUTCDate()).padStart(2, '0')}`;
  const key = `entrestate_viewed_v1:${siteId}:${campaignDocId || 'none'}:${dayKey}`;
  try {
    const seen = localStorage.getItem(key);
    if (seen) return true;
    localStorage.setItem(key, '1');
    return false;
  } catch {
    return false;
  }
}

export function LandingViewTracker(props: Props) {
  useEffect(() => {
    if (!props.siteId) return;
    if (shouldDedupe(props.siteId, props.campaignDocId)) return;

    const fingerprint = getOrCreateFingerprint();

    // Fire-and-forget; don't block render.
    fetch('/api/public/events/landing-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: props.siteId,
        campaignDocId: props.campaignDocId,
        fingerprint,
        utm: {
          source: props.utmSource,
          medium: props.utmMedium,
          campaign: props.utmCampaign,
        },
      }),
    }).catch(() => {
      // ignore
    });
  }, [props.siteId, props.campaignDocId, props.utmSource, props.utmMedium, props.utmCampaign]);

  return null;
}

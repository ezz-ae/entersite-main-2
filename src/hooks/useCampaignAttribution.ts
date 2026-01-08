'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { LeadAttribution } from '@/lib/leads';

const STORAGE_KEY = 'entrestate-campaign-attribution';

function parseStoredValue(): LeadAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeadAttribution) : null;
  } catch {
    return null;
  }
}

function persistAttribution(data: LeadAttribution | null) {
  if (typeof window === 'undefined') return;
  try {
    if (data) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // no-op
  }
}

function normalizeAttribution(input: Partial<Omit<LeadAttribution, 'value'>> & { value?: string | number | null }) {
  const normalized: LeadAttribution = {};
  if (input.campaignDocId) normalized.campaignDocId = input.campaignDocId;
  if (input.campaignId) normalized.campaignId = input.campaignId;
  if (input.channel) normalized.channel = input.channel;
  if (input.value !== undefined && input.value !== null) {
    const numeric = typeof input.value === 'number' ? input.value : Number(input.value);
    if (!Number.isNaN(numeric)) {
      normalized.value = numeric;
    }
  }
  return Object.keys(normalized).length ? normalized : null;
}

export function useCampaignAttribution(): LeadAttribution | null {
  const searchParams = useSearchParams();
  const [attribution, setAttribution] = useState<LeadAttribution | null>(null);

  useEffect(() => {
    const stored = parseStoredValue();
    if (!searchParams) {
      setAttribution(stored);
      return;
    }

    const campaignId = searchParams.get('campaignId') || searchParams.get('utm_campaign') || undefined;
    const campaignDocId = searchParams.get('campaignDocId') || undefined;
    const channel = searchParams.get('channel') || searchParams.get('utm_source') || undefined;
    const valueParam = searchParams.get('attributionValue') || searchParams.get('value') || undefined;

    const rawAttribution: Partial<Omit<LeadAttribution, 'value'>> & { value?: string | number | null } = {
      campaignId: campaignId ?? undefined,
      campaignDocId,
      channel,
    };
    if (valueParam !== null && valueParam !== undefined) {
      rawAttribution.value = valueParam;
    }

    const fromQuery = normalizeAttribution(rawAttribution);

    if (fromQuery) {
      persistAttribution(fromQuery);
      setAttribution(fromQuery);
    } else {
      setAttribution(stored);
    }
  }, [searchParams]);

  return useMemo(() => attribution, [attribution]);
}

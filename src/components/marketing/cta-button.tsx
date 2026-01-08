'use client';

import { useState } from 'react';
import { captureLead, type LeadAttribution } from '@/lib/leads';
import { cn } from '@/lib/utils';
import { useCampaignAttribution } from '@/hooks/useCampaignAttribution';

interface CTAButtonProps {
  label: string;
  buttonId: string;
  variant?: 'solid' | 'outline';
  context?: {
    page?: string;
    service?: string;
  };
  tenantId?: string;
  source?: string;
  project?: string;
  attribution?: LeadAttribution | null;
}

export function CTAButton({
  label,
  buttonId,
  variant = 'solid',
  context = {},
  tenantId = 'public',
  source,
  project,
  attribution,
}: CTAButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const campaignAttribution = useCampaignAttribution();

  const handleClick = async () => {
    setSubmitting(true);
    try {
      await captureLead({
        source: source || context.service || 'cta',
        project,
        context: { ...context, buttonId },
        attribution: attribution ?? campaignAttribution ?? undefined,
        tenantId,
      });
    } catch (error) {
      console.error('Lead capture failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  const baseClasses = 'h-24 px-20 rounded-full font-black text-3xl transition-transform disabled:opacity-60 disabled:cursor-not-allowed';
  const style = variant === 'solid'
    ? 'bg-white text-black hover:scale-110 shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)]'
    : 'border border-white/10 bg-white/5 text-white backdrop-blur-3xl hover:bg-white/10';

  return (
    <button
      onClick={handleClick}
      className={cn(baseClasses, style)}
      disabled={submitting}
    >
      {submitting ? 'Processing…' : label}
    </button>
  );
}

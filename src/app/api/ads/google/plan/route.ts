import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { generateCampaignStructure } from '@/lib/ai/marketing-os';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

const requestSchema = z.object({
  goal: z.string().min(1),
  location: z.string().min(1),
  budget: z.number().positive(),
  duration: z.number().positive(),
  landingPage: z.string().url().optional(),
  notes: z.string().optional(),
});

const GOAL_MAP: Record<string, 'leads' | 'calls' | 'traffic'> = {
  'Lead Generation': 'leads',
  Leads: 'leads',
  Calls: 'calls',
  'Website Visits': 'traffic',
  'Brand Awareness': 'traffic',
};

const CPC_RANGES: Record<string, { low: number; high: number }> = {
  low: { low: 5, high: 10 },
  medium: { low: 10, high: 18 },
  high: { low: 18, high: 32 },
};

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

function estimateVolume(term: string) {
  const seed = hashString(term);
  const base = 700;
  const variance = seed % 9500;
  return base + variance;
}

function estimatePerformance({
  dailyBudget,
  durationDays,
  goal,
}: {
  dailyBudget: number;
  durationDays: number;
  goal: 'leads' | 'calls' | 'traffic';
}) {
  const totalSpend = dailyBudget * durationDays;
  const cpcRange = goal === 'traffic' ? { low: 6, high: 16 } : { low: 8, high: 22 };
  const clicksLow = Math.max(1, Math.floor(totalSpend / cpcRange.high));
  const clicksHigh = Math.max(clicksLow, Math.floor(totalSpend / cpcRange.low));
  const conversionRange = goal === 'traffic' ? { low: 0.01, high: 0.03 } : { low: 0.02, high: 0.05 };
  const leadsLow = Math.max(1, Math.floor(clicksLow * conversionRange.low));
  const leadsHigh = Math.max(leadsLow, Math.floor(clicksHigh * conversionRange.high));
  const cplLow = Math.round(totalSpend / leadsHigh);
  const cplHigh = Math.round(totalSpend / leadsLow);

  return {
    dailyBudget,
    durationDays,
    totalSpend,
    cpcRange,
    clicksRange: { low: clicksLow, high: clicksHigh },
    leadsRange: { low: leadsLow, high: leadsHigh },
    cplRange: { low: cplLow, high: cplHigh },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const ip = getRequestIp(req);
    if (!enforceRateLimit(`ads:plan:${tenantId}:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    const payload = requestSchema.parse(await req.json());

    const goal = GOAL_MAP[payload.goal] || 'leads';
    const siteUrl = payload.landingPage || 'https://entrestate.com';

    let plan;
    try {
      plan = await generateCampaignStructure({
        siteUrl,
        budget: payload.budget,
        durationDays: payload.duration,
        goal,
        location: payload.location,
      });
    } catch (error) {
      console.error('[ads/google/plan] ai generation failed', error);
      plan = {
        keywords: [
          { term: `buy property ${payload.location}`, competition: 'medium' },
          { term: `off plan projects ${payload.location}`, competition: 'high' },
          { term: `real estate investment ${payload.location}`, competition: 'medium' },
        ],
        headlines: [
          `Invest in ${payload.location} Properties`,
          'Limited Off-Plan Launches',
          'Book a Viewing Today',
        ],
        descriptions: [
          'Browse verified listings and secure priority access.',
          'Flexible payment plans and trusted developers.',
        ],
      };
    }

    const keywords = (plan.keywords || []).map((keyword: any) => {
      const competition = keyword.competition || 'medium';
      const cpc = CPC_RANGES[competition] || CPC_RANGES.medium;
      return {
        term: keyword.term,
        competition,
        volume: estimateVolume(keyword.term),
        cpc,
      };
    });

    const expectations = estimatePerformance({
      dailyBudget: payload.budget,
      durationDays: payload.duration,
      goal,
    });

    return NextResponse.json({
      goal: payload.goal,
      location: payload.location,
      keywords,
      headlines: plan.headlines || [],
      descriptions: plan.descriptions || [],
      expectations,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[ads/google/plan] error', error);
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}

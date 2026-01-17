import { NextRequest, NextResponse } from 'next/server';
import { getCampaign } from '@/server/ads/google/campaignSpine';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const PlanSchema = z.object({
  campaignId: z.string().optional(),
  goal: z.string().optional(),
  location: z.string().optional(),
  audience: z.string().optional(),
  intent: z.string().optional(),
  unitType: z.string().optional(),
  language: z.string().optional(),
  timeline: z.string().optional(),
  contactRoute: z.string().optional(),
  strategyPreset: z.string().optional(),
  advancedOptions: z.object({
    competitorIntercept: z.boolean().optional(),
    negativeKeywordsPreset: z.string().optional(),
    schedulePreset: z.string().optional(),
    deviceTargeting: z.string().optional(),
    languageTargeting: z.string().optional(),
    callOnlyFallback: z.boolean().optional(),
  }).optional(),
  budget: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  landingPage: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const payload = PlanSchema.parse(body);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    let campaign = null;
    if (payload.campaignId) {
      campaign = await getCampaign(tenantId, payload.campaignId);
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }
    }

    const location = payload.location
      || campaign?.planner?.cityArea
      || 'Dubai, UAE';
    const unitType = payload.unitType
      || campaign?.planner?.unitType
      || 'Apartment';
    const intent = payload.intent || 'Buy';
    const budget = Number.isFinite(payload.budget) ? Number(payload.budget) : 150;
    const duration = Number.isFinite(payload.duration) ? Number(payload.duration) : 30;

    const isHighIntent = /buy|off-plan|invest/i.test(intent);
    const cpcLow = isHighIntent ? 12 : 7;
    const cpcHigh = isHighIntent ? 24 : 14;
    const cplLow = isHighIntent ? 90 : 55;
    const cplHigh = isHighIntent ? 160 : 95;
    const totalSpend = Math.max(0, Math.round(budget * duration));
    const clicksLow = Math.floor(totalSpend / cpcHigh);
    const clicksHigh = Math.floor(totalSpend / cpcLow);
    const leadsLow = Math.floor(totalSpend / cplHigh);
    const leadsHigh = Math.floor(totalSpend / cplLow);

    const keywords = [
      `${intent.toLowerCase()} ${unitType.toLowerCase()} ${location.toLowerCase()}`,
      `${unitType.toLowerCase()} for sale ${location.toLowerCase()}`,
      `${location.toLowerCase()} payment plan`,
      `${location.toLowerCase()} new launch`,
    ];

    const headlines = [
      `${unitType} in ${location}`,
      `Flexible Payment Plan`,
      `Book a Viewing Today`,
      `Prime ${location} Listings`,
      `${intent} ${unitType} Now`,
    ];

    const descriptions = [
      `Explore premium ${unitType.toLowerCase()} options in ${location}. Limited units available.`,
      `Get pricing, payment plans, and availability. Fast response via ${payload.contactRoute || 'WhatsApp'}.`,
      `Secure your ${unitType.toLowerCase()} with flexible terms and verified listings.`,
    ];

    const expectations = {
      dailyBudget: budget,
      durationDays: duration,
      totalSpend,
      cpcRange: { low: cpcLow, high: cpcHigh },
      clicksRange: { low: clicksLow, high: clicksHigh },
      leadsRange: { low: leadsLow, high: leadsHigh },
      cplRange: { low: cplLow, high: cplHigh },
    };

    return NextResponse.json({
      keywords,
      headlines,
      descriptions,
      expectations,
    });
  } catch (error) {
    console.error('Failed to generate plan:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate plan' }, { status: 500 });
  }
}

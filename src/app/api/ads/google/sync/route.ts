import { NextRequest, NextResponse } from 'next/server';
import { syncCampaign, getCampaign, updateCampaign } from '@/server/ads/google/googleAdsService';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';
import { createCampaign as createCampaignSpine } from '@/server/ads/google/campaignSpine';

const SyncSchema = z.object({
  campaignId: z.string().optional(),
  name: z.string().optional(),
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
  keywords: z.array(z.string()).optional(),
  headlines: z.array(z.string()).optional(),
  descriptions: z.array(z.string()).optional(),
  expectations: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const validation = SyncSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request', details: validation.error }, { status: 400 });
    }

    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const payload = validation.data;
    let campaignId = payload.campaignId;

    if (!campaignId) {
      const created = await createCampaignSpine({
        tenantId,
        landingPageUrl: payload.landingPage,
      });
      campaignId = created.campaignId;
    }

    const campaign = await getCampaign(tenantId, campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const planner = {
      cityArea: payload.location || campaign.planner?.cityArea || 'Dubai, UAE',
      unitType: payload.unitType || campaign.planner?.unitType || 'Apartment',
      dailyBudgetAED: Number.isFinite(payload.budget) ? Number(payload.budget) : campaign.planner?.dailyBudgetAED || 150,
      contactRoute: payload.contactRoute || campaign.planner?.contactRoute || 'WhatsApp',
      timeline: {
        startDate: payload.timeline || undefined,
        endDate: payload.duration ? `${payload.duration}d` : undefined,
      },
    };

    await updateCampaign(tenantId, campaignId, {
      landingPageUrl: payload.landingPage || campaign.landingPageUrl,
      planner,
      status: 'launching',
      updatedAt: new Date().toISOString(),
    });

    const updated = await getCampaign(tenantId, campaignId);
    if (!updated) {
      return NextResponse.json({ error: 'Campaign not found after update' }, { status: 404 });
    }
    const result = await syncCampaign({ campaign: updated });

    if (result.status === 'error') {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      status: 'launching',
      sync: result.status,
      campaignId,
    });
  } catch (error: any) {
    console.error('Sync failed:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { updateCampaign, getCampaign } from '@/server/ads/google/googleAdsService';
import type { GoogleAdsCampaign } from '@/types/ads';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const UpdateCampaignSchema = z.object({
  landingPageUrl: z.string().url().optional(),
  planner: z.object({
    cityArea: z.string().optional(),
    unitType: z.string().optional(),
    dailyBudgetAED: z.number().optional(),
    contactRoute: z.enum(['Call', 'WhatsApp', 'Form']).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
  occalizer: z.object({
    momentum: z.number().min(0).max(100).optional(),
    verdict: z.enum(['TOP', 'FAIR', 'RISKY']).optional(),
    projections: z.object({
      leadsMin: z.number().optional(),
      leadsMax: z.number().optional(),
      cplMinAED: z.number().optional(),
      cplMaxAED: z.number().optional(),
      competition: z.enum(['low', 'mid', 'high']).optional(),
    }).optional(),
  }).optional(),
  intercept: z.object({
    enabled: z.boolean().optional(),
    brands: z.array(z.string()).optional(),
  }).optional(),
  caps: z.object({
    dailyCapAED: z.number().optional(),
    totalCapAED: z.number().optional(),
  }).optional(),
  riskControl: z.object({
    enabled: z.boolean().optional(),
    windowDays: z.number().optional(),
    metric: z.enum(['visits', 'whatsappClicks', 'leads']).optional(),
    minimum: z.number().optional(),
    response: z.enum(['pause', 'lowerBudget', 'suggestLandingShift', 'suggestAutoRedesign']).optional(),
  }).optional(),
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const { searchParams } = new URL(req.url);
    if (searchParams.get('tenantId')) {
      return NextResponse.json({ error: 'Do not send tenantId in request query.' }, { status: 400 });
    }
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const campaign = await getCampaign(tenantId, id);

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to get campaign:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    enforceSameOrigin(req);
    const params = await props.params;
    const { id } = params;
    
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const validation = UpdateCampaignSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request', details: validation.error }, { status: 400 });
    }

    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const updates = validation.data;

    await updateCampaign(tenantId, id, updates as Partial<GoogleAdsCampaign>);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

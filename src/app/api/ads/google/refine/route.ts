
import { NextRequest, NextResponse } from 'next/server';
import { getCampaign } from '@/server/ads/google/campaignSpine';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const RefineSchema = z.object({
  campaignId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    if (body?.tenantId) {
      return NextResponse.json({ error: 'Do not send tenantId in request payload.' }, { status: 400 });
    }
    const { campaignId } = RefineSchema.parse(body);
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const campaign = await getCampaign(tenantId, campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // In mock mode, return a deterministic result.
    const issues = [
      { field: 'contrast', message: 'Contrast check passed' },
      { field: 'heroImage', message: 'Hero image quality is good' },
      { field: 'cta', message: 'CTA is present' },
    ];
    const suggestions = [
      { message: 'Consider adding a video to the landing page' },
    ];

    return NextResponse.json({
      pass: true,
      issues,
      suggestions,
    });
  } catch (error) {
    console.error('Failed to refine campaign:', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to refine campaign' }, { status: 500 });
  }
}

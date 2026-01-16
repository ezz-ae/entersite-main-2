import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';
import { setCampaignLanding } from '@/server/campaigns/campaign-store';
import { assertCampaignOwnedByTenant } from '@/server/campaigns/campaign-guards';

const externalSchema = z.object({
  mode: z.literal('external'),
  url: z.string().url(),
});

const surfaceSchema = z.object({
  mode: z.literal('surface'),
  siteId: z.string().min(1),
});

async function resolveSiteUrl(tenantId: string, siteId: string) {
  const db = getAdminDb();
  const snap = await db.collection('sites').doc(siteId).get();
  if (!snap.exists) return '';
  const data = snap.data() as any;
  if (data?.tenantId !== tenantId) return '';

  const publishedUrl = String(data?.publishedUrl || '').trim();
  const customDomain = String(data?.customDomain || '').trim();

  if (customDomain) return `https://${customDomain}`;
  return publishedUrl;
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    await assertCampaignOwnedByTenant({ campaignId: ctx.params.id, tenantId });

    const raw = await req.json();
    const mode = raw?.mode;

    if (mode === 'external') {
      const body = externalSchema.parse(raw);
      const campaign = await setCampaignLanding({
        campaignId: ctx.params.id,
        landing: { mode: 'external', url: body.url },
      });
      return NextResponse.json({ campaign });
    }

    if (mode === 'surface') {
      const body = surfaceSchema.parse(raw);
      const url = await resolveSiteUrl(tenantId, body.siteId);
      if (!url) return NextResponse.json({ error: 'Surface not published or not found' }, { status: 404 });

      const campaign = await setCampaignLanding({
        campaignId: ctx.params.id,
        landing: { mode: 'surface', siteId: body.siteId, url },
      });
      return NextResponse.json({ campaign });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (err?.name === 'ZodError') return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 });
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

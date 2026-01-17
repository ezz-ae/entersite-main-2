import { NextResponse } from 'next/server';

import { getPublishedSite } from '@/server/publish-service';
import { writeAudienceEvent } from '@/server/audience/write-event';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

// Public endpoint: accepts only a siteId and derives tenantId from the published site.
// No PII allowed in payload.

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`public:landing-view:${ip}`, 240, 60_000))) {
      return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
    }
    const body = await req.json();
    const siteId = String(body?.siteId || '').trim();
    const campaignDocId = body?.campaignDocId ? String(body.campaignDocId).trim() : undefined;
    const fingerprint = body?.fingerprint ? String(body.fingerprint).trim() : undefined;

    if (!siteId) {
      return NextResponse.json({ ok: false, error: 'Missing siteId' }, { status: 400 });
    }

    const page = await getPublishedSite(siteId);
    if (!page) {
      return NextResponse.json({ ok: false, error: 'Site not found' }, { status: 404 });
    }

    const tenantId = (page as any).tenantId;
    if (!tenantId) {
      return NextResponse.json({ ok: false, error: 'Tenant not resolved' }, { status: 500 });
    }

    const utm = body?.utm && typeof body.utm === 'object' ? body.utm : {};

    await writeAudienceEvent({
      tenantId,
      campaignId: campaignDocId,
      actor: {
        type: 'anonymous',
        fingerprint: fingerprint || undefined,
      },
      type: 'landing.view',
      payload: {
        siteId,
        utm: {
          source: utm?.source || undefined,
          medium: utm?.medium || undefined,
          campaign: utm?.campaign || undefined,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[public][events][landing-view] error', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

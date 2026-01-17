import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import {
  enforceUsageLimit,
  PlanLimitError,
  planLimitErrorResponse,
} from '@/lib/server/billing';
import { enforceSameOrigin } from '@/lib/server/security';

const payloadSchema = z.object({
  site: z.record(z.any()),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const tenantSnapshot = await db
      .collection('sites')
      .where('tenantId', '==', tenantId)
      .limit(50)
      .get();

    const formatTimestamp = (value: any) => {
      if (!value) return null;
      if (typeof value === 'string') return value;
      if (typeof value?.toDate === 'function') {
        try {
          return value.toDate().toISOString();
        } catch {
          return null;
        }
      }
      return null;
    };

    const sites = tenantSnapshot.docs.map((doc) => {
      const data = doc.data();
      const published = Boolean(data.published);
      const customDomain = data.customDomain || null;
      const publishedUrl = data.publishedUrl || null;
      const url = customDomain ? `https://${customDomain}` : publishedUrl;
      return {
        id: doc.id,
        title: data.title || 'Untitled Site',
        subdomain: data.subdomain || null,
        customDomain,
        publishedUrl,
        url,
        published,
        refinerStatus: data.refinerStatus || null,
        lastRefinedAt: formatTimestamp(data.lastRefinedAt),
        lastPublishedAt: formatTimestamp(data.lastPublishedAt),
      };
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('[sites] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const payload = payloadSchema.parse(await req.json());
    const db = getAdminDb();
    const site = payload.site || {};
    const siteId = typeof site.id === 'string' && site.id.trim() ? site.id.trim() : null;

    if (siteId) {
      const siteRef = db.collection('sites').doc(siteId);
      const siteSnap = await siteRef.get();
      if (siteSnap.exists) {
        const siteData = siteSnap.data() || {};
        if (!siteData.tenantId || siteData.tenantId !== tenantId) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        await siteRef.set(
          {
            ...site,
            id: siteId,
            tenantId,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        return NextResponse.json({ siteId });
      }
    }

    await enforceUsageLimit(db, tenantId, 'landing_pages', 1);
    const newSiteRef = siteId ? db.collection('sites').doc(siteId) : db.collection('sites').doc();
    const newSiteId = newSiteRef.id;
    await newSiteRef.set(
      {
        ...site,
        id: newSiteId,
        tenantId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json({ siteId: newSiteId }, { status: 201 });
  } catch (error) {
    console.error('[sites] save error', error);
    if (error instanceof PlanLimitError) {
      return NextResponse.json(planLimitErrorResponse(error), { status: 402 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save site' }, { status: 500 });
  }
}

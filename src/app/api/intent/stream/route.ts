import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { getAdminDb } from '@/server/firebase-admin';

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
  cursor: z.string().optional(),
});

function toIso(value: any) {
  if (!value) return null;
  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    const parsed = schema.parse({
      limit: req.nextUrl.searchParams.get('limit') ?? undefined,
      cursor: req.nextUrl.searchParams.get('cursor') ?? undefined,
    });
    const limit = parsed.limit ?? 100;

    const db = getAdminDb();
    const leadsRef = db.collection('tenants').doc(tenantId).collection('leads');
    let query = leadsRef.orderBy('createdAt', 'desc').limit(limit);

    if (parsed.cursor) {
      const cursorSnap = await leadsRef.doc(parsed.cursor).get();
      if (!cursorSnap.exists) {
        return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 });
      }
      query = query.startAfter(cursorSnap);
    }

    const snap = await query.get();
    const items = snap.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
        direction: data.direction ?? null,
        status: data.status ?? null,
        priority: data.priority ?? null,
        fairnessScore: data.fairnessScore ?? null,
        hotScore: data.hotScore ?? null,
        source: data.source ?? null,
        campaignId: data.campaignId ?? null,
        siteId: data.siteId ?? null,
        projectId: data.projectId ?? null,
        project: data.project ?? null,
        pageSlug: data.pageSlug ?? null,
        contact: {
          name: data.name ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          whatsapp: data.contact?.whatsapp ?? null,
        },
        attribution: data.attribution ?? null,
      };
    });

    const lastDoc = snap.docs[snap.docs.length - 1];
    const nextCursor = lastDoc ? lastDoc.id : null;

    return NextResponse.json({ success: true, items, nextCursor });
  } catch (error) {
    console.error('[intent/stream] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid params', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load intent stream' }, { status: 500 });
  }
}

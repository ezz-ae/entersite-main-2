import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const payloadSchema = z.object({
  siteIds: z.array(z.string().min(1)).min(1),
});

type SiteStats = {
  leads: number;
  views: number;
};

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const body = await req.json();
    const { siteIds } = payloadSchema.parse(body);
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const db = getAdminDb();
    const tenantRef = db.collection('tenants').doc(tenantId);
    const leadsRef = tenantRef.collection('leads');
    const eventsRef = tenantRef.collection('events');

    const entries = await Promise.all(
      siteIds.map(async (siteId) => {
        const [leadsSnapshot, eventsSnapshot] = await Promise.all([
          leadsRef.where('siteId', '==', siteId).get(),
          eventsRef.where('siteId', '==', siteId).get(),
        ]);
        const views = eventsSnapshot.docs.reduce((count, doc) => {
          const data = doc.data();
          if (!data.type || data.type === 'cta_click') {
            return count + 1;
          }
          return count;
        }, 0);
        const stats: SiteStats = {
          leads: leadsSnapshot.size,
          views,
        };
        return [siteId, stats] as const;
      }),
    );

    return NextResponse.json({ data: Object.fromEntries(entries) as Record<string, SiteStats> });
  } catch (error) {
    console.error('[sites/stats] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to load site stats' }, { status: 500 });
  }
}

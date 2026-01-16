import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceRateLimit, getRequestIp } from '@/lib/server/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const ip = getRequestIp(req);
    if (!(await enforceRateLimit(`ads:campaigns:${tenantId}:${ip}`, 60, 60_000))) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('ads_campaigns')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ data: [] });
    }

    const campaigns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: campaigns });
  } catch (error) {
    console.error('[ads/google/campaigns] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ data: [] });
  }
}

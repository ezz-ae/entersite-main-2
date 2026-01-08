import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { DEFAULT_MARKETING_METRICS } from '@/data/marketing-metrics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COLLECTION = 'analytics';
const DOC_ID = 'marketing';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedTenant = searchParams.get('tenantId') || undefined;
    const { tenantId } = await requireTenantScope(req, requestedTenant);

    const db = getAdminDb();
    const docRef = db.collection('tenants').doc(tenantId).collection(COLLECTION).doc(DOC_ID);
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return NextResponse.json({ data: snapshot.data() });
    }

    return NextResponse.json({ data: DEFAULT_MARKETING_METRICS });
  } catch (error) {
    console.error('[marketing/metrics] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load marketing metrics' }, { status: 500 });
  }
}

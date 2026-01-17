import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

// Lists leads routed to a campaign. This is the backbone for "campaign CRM" views.
// Note: Ordering by createdAt may require a Firestore composite index for (campaignId, createdAt).

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { id } = await paramsPromise;
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const campaignId = id;
    const db = getAdminDb();

    // Ensure campaign exists and belongs to tenant
    const campSnap = await db.collection('campaigns').doc(campaignId).get();
    if (!campSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const camp = campSnap.data() as any;
    if (camp?.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get('limit') || 50), 200);

    let query = db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .where('campaignId', '==', campaignId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const snap = await query.get();
    const leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ leads });
  } catch (e: any) {
    console.error('[campaigns/:id/leads] error', e);
    return NextResponse.json({ error: e?.message || 'Failed to load leads' }, { status: 500 });
  }
}

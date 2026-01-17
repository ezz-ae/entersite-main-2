import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { DEFAULT_MARKETING_METRICS } from '@/data/marketing-metrics';

const SUMMARIES_COLLECTION = 'analytics';
const MARKETING_DOC = 'marketing';

async function countLeadsByStatus(db: ReturnType<typeof getAdminDb>, tenantId: string, status: string) {
  const leadsRef = db.collection('tenants').doc(tenantId).collection('leads');
  const snap = await leadsRef.where('status', '==', status).get();
  return snap.size;
}

async function countEvents(db: ReturnType<typeof getAdminDb>, tenantId: string, types: string[]) {
  if (!types.length) return 0;
  const eventsRef = db.collection('tenants').doc(tenantId).collection('events');
  const snap = await eventsRef.where('type', 'in', types).get();
  return snap.size;
}

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();

    const [newLeads, contactedLeads, revivedLeads] = await Promise.all([
      countLeadsByStatus(db, tenantId, 'New'),
      countLeadsByStatus(db, tenantId, 'Contacted'),
      countLeadsByStatus(db, tenantId, 'Qualified'), // We treat Qualified as a proxy for "revived" leads.
    ]);

    const [delivered, opened, replied] = await Promise.all([
      countEvents(db, tenantId, ['sender.email.sent', 'sender.sms.sent', 'sender.whatsapp.sent']),
      countEvents(db, tenantId, ['sender.email.sent']), // Email sends are currently the signal we have for opens.
      countEvents(db, tenantId, ['sender.reply']),
    ]);

    const marketingRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection(SUMMARIES_COLLECTION)
      .doc(MARKETING_DOC);
    const marketingSnap = await marketingRef.get();
    const marketingData = marketingSnap.exists
      ? (marketingSnap.data() as typeof DEFAULT_MARKETING_METRICS)
      : DEFAULT_MARKETING_METRICS;

    const totals = marketingData?.totals || DEFAULT_MARKETING_METRICS.totals;
    const adSpend = totals.adSpend ?? 0;
    const conversions = totals.conversions ?? 0;
    const cpl = totals.cpl ?? (conversions > 0 ? adSpend / conversions : 0);

    const report = {
      leads: {
        new: newLeads,
        contacted: contactedLeads,
        revived: revivedLeads,
      },
      sender: {
        delivered,
        opened,
        replied,
      },
      ads: {
        spend: adSpend,
        leads: conversions,
        costPerLead: cpl,
        currency: marketingData.currencySymbol || DEFAULT_MARKETING_METRICS.currencySymbol,
      },
    };

    return NextResponse.json({ data: report });
  } catch (error) {
    console.error('[reports/summary] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load report summary' }, { status: 500 });
  }
}

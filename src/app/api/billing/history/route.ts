import { NextResponse, type NextRequest } from 'next/server';
import { requireRole } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { createApiLogger } from '@/lib/logger';
import { ADMIN_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'GET /api/billing/history' });
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);
    
    if (tenantId === 'public' || tenantId === 'anonymous') {
      return NextResponse.json({ history: [] });
    }

    logger.setTenant(tenantId);

    const db = getAdminDb();
    const historySnapshot = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('billing_events')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const history = historySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore Timestamps need to be converted for JSON serialization.
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });
    
    logger.logSuccess(200, { message: `Fetched ${history.length} billing events.` });
    return NextResponse.json({ history });

  } catch (error) {
    logger.logError(error, 500);
    if (error instanceof Error && (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}

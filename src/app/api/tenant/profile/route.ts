import { NextResponse, type NextRequest } from 'next/server';
import { requireRole } from '@/lib/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { createApiLogger } from '@/lib/logger';

// Admins should be able to update tenant profile
const ADMIN_ROLES: Role[] = ['team_admin', 'agency_admin', 'super_admin'];
const ALL_ROLES: Role[] = ['public', 'agent', ...ADMIN_ROLES];

export async function GET(req: NextRequest) {
  const logger = createApiLogger(req, { route: 'GET /api/tenant/profile' });
  try {
    const { tenantId } = await requireRole(req, ALL_ROLES);
    
    if (tenantId === 'public' || tenantId === 'anonymous') {
      return NextResponse.json({ profile: null });
    }
    logger.setTenant(tenantId);

    const db = getAdminDb();
    const tenantDoc = await db.collection('tenants').doc(tenantId).get();

    if (!tenantDoc.exists) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const data = tenantDoc.data();
    const profile = {
        companyName: data?.companyName || '',
        vatId: data?.vatId || '',
    };
    
    logger.logSuccess(200, { message: 'Fetched tenant profile.' });
    return NextResponse.json({ profile });

  } catch (error) {
    logger.logError(error, 500);
    if (error instanceof Error && (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const logger = createApiLogger(req, { route: 'POST /api/tenant/profile' });
    try {
      const { tenantId } = await requireRole(req, ADMIN_ROLES);
      logger.setTenant(tenantId);
      
      const body = await req.json();
      const { companyName, vatId } = body;

      const updateData: { [key: string]: any } = {};
      if (typeof companyName === 'string') {
        updateData.companyName = companyName;
      }
      if (typeof vatId === 'string') {
        updateData.vatId = vatId;
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
      }

      const db = getAdminDb();
      await db.collection('tenants').doc(tenantId).set(updateData, { merge: true });
      
      logger.logSuccess(200, { message: 'Tenant profile updated.' });
      return NextResponse.json({ success: true });
  
    } catch (error) {
      logger.logError(error, 500);
      if (error instanceof Error && (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}

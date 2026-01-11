import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const ALLOWED_CHANNELS = new Set(['email', 'sms']);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = (searchParams.get('channel') || 'email').toLowerCase();
    if (!ALLOWED_CHANNELS.has(channel)) {
      return NextResponse.json({ error: 'Invalid channel.' }, { status: 400 });
    }

    const { tenantId } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();

    const importedSnap = await db
      .collection('contacts')
      .where('tenantId', '==', tenantId)
      .where('channel', '==', channel)
      .get();

    const pilotSnap = await db
      .collection('contacts')
      .where('tenantId', '==', 'pilot')
      .where('channel', '==', channel)
      .get();

    return NextResponse.json({
      importedCount: importedSnap.size,
      pilotCount: pilotSnap.size,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[contacts/summary] error', error);
    return NextResponse.json({ error: 'Failed to load contact summary.' }, { status: 500 });
  }
}

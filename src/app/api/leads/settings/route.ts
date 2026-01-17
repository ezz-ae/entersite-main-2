import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

const payloadSchema = z.object({
  notificationEmail: z.string().email().optional().nullable(),
  crmWebhookUrl: z.string().url().optional().nullable(),
  crmProvider: z.enum(['hubspot', 'custom']).optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const db = getAdminDb();
    const docSnap = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('settings')
      .doc('leads')
      .get();

    const settings = docSnap.exists ? docSnap.data() : null;
    return NextResponse.json({
      settings,
      hubspotAvailable: CAP.hubspot,
    });
  } catch (error) {
    console.error('[leads/settings] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    enforceSameOrigin(req);
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ADMIN_ROLES);

    const db = getAdminDb();
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('settings')
      .doc('leads')
      .set(
        {
          notificationEmail: payload.notificationEmail || null,
          crmWebhookUrl: payload.crmWebhookUrl || null,
          crmProvider: payload.crmProvider || null,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[leads/settings] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

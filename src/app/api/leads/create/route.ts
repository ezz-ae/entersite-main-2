import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const payloadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { tenantId } = await requireRole(req, ALL_ROLES);

    const db = getAdminDb();
    const leadRef = await db
      .collection('tenants')
      .doc(tenantId)
      .collection('leads')
      .add({
        tenantId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        message: payload.message || null,
        status: 'New',
        priority: 'Warm',
        source: 'Manual Entry',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

    return NextResponse.json({ id: leadRef.id }, { status: 201 });
  } catch (error) {
    console.error('[leads/create] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const db = getAdminDb();
    const snapshot = await db
      .collection('tenants')
      .doc(user.uid || 'public')
      .collection('marketing_plans')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: plans });
  } catch (error) {
    console.error('[agents/marketing/plans] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to load marketing plans' }, { status: 500 });
  }
}

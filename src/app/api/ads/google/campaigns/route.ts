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

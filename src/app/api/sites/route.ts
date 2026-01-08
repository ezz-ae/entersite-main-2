import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const { decoded } = await requireTenantScope(req);
    const db = getAdminDb();
    const snapshot = await db
      .collection('sites')
      .where('ownerUid', '==', decoded.uid)
      .limit(50)
      .get();

    const sites = snapshot.docs.map((doc) => {
      const data = doc.data();
      const published = Boolean(data.published);
      const customDomain = data.customDomain || null;
      const publishedUrl = data.publishedUrl || null;
      const url = customDomain ? `https://${customDomain}` : publishedUrl;
      return {
        id: doc.id,
        title: data.title || 'Untitled Site',
        subdomain: data.subdomain || null,
        customDomain,
        publishedUrl,
        url,
        published,
      };
    });

    return NextResponse.json({ sites });
  } catch (error) {
    console.error('[sites] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

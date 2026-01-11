import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function GET(req: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(req, ALL_ROLES);
    const db = getAdminDb();
    const [tenantSnapshot, ownerSnapshot] = await Promise.all([
      db.collection('sites').where('tenantId', '==', tenantId).limit(50).get(),
      db.collection('sites').where('ownerUid', '==', uid).limit(50).get(),
    ]);

    const siteMap = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>();
    tenantSnapshot.docs.forEach((doc) => siteMap.set(doc.id, doc));
    ownerSnapshot.docs.forEach((doc) => siteMap.set(doc.id, doc));

    const sites = Array.from(siteMap.values()).map((doc) => {
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

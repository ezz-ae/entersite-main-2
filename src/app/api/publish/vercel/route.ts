
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/server/firebase-admin';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const normalizeDomain = (domain: string) => domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export async function POST(request: NextRequest) {
  try {
    const { siteId } = await request.json();
    if (!siteId) {
      return NextResponse.json({ message: 'Site ID is required' }, { status: 400 });
    }

    const { tenantId, uid } = await requireRole(request, ALL_ROLES);
    const db = getAdminDb();
    const siteRef = db.collection('sites').doc(siteId);
    const siteSnap = await siteRef.get();

    if (!siteSnap.exists) {
      return NextResponse.json({ message: 'Site not found' }, { status: 404 });
    }

    const siteData = siteSnap.data() || {};
    const ownerUid = siteData.ownerUid as string | undefined;
    const siteTenantId = siteData.tenantId as string | undefined;
    if (siteTenantId && siteTenantId !== tenantId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    if (!siteTenantId && ownerUid && ownerUid !== uid) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const rootDomain = normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com');
    const siteDomain = normalizeDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${rootDomain}`);
    const existingSubdomain = typeof siteData.subdomain === 'string' ? siteData.subdomain : '';
    const suffix = siteId.slice(0, 4);
    const baseSlug = slugify(String(siteData.title || 'site'));
    const subdomain = existingSubdomain || (baseSlug ? `${baseSlug}-${suffix}` : `site-${suffix}`);
    const customDomain = typeof siteData.customDomain === 'string' ? siteData.customDomain : '';
    const publishedUrl = customDomain ? `https://${customDomain}` : `https://${subdomain}.${siteDomain}`;

    await siteRef.set(
      {
        published: true,
        publishedUrl,
        subdomain,
        lastPublishedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      siteId,
      publishedUrl,
      subdomain,
    });
  } catch (error) {
    console.error('[publish/vercel] error', error);
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred during publishing.' }, { status: 500 });
  }
}

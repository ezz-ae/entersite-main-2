import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';
import { CAP } from '@/lib/capabilities';
import { ADMIN_ROLES } from '@/lib/server/roles';

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

const requestSchema = z.object({
  domain: z.string().min(3),
  siteId: z.string().optional(),
});

const normalizeDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export async function POST(req: NextRequest) {
  try {
    const { tenantId, uid } = await requireRole(req, ADMIN_ROLES);
    if (!CAP.vercel || !VERCEL_TOKEN || !PROJECT_ID) {
      return NextResponse.json({ error: 'Domain connection is not set up yet.' }, { status: 500 });
    }

    const { domain, siteId } = requestSchema.parse(await req.json());
    const normalizedDomain = normalizeDomain(domain);

    const response = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/domains${TEAM_ID ? `?teamId=${TEAM_ID}` : ''}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: normalizedDomain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to add domain' }, { status: response.status });
    }

    if (siteId) {
      const db = getAdminDb();
      const siteRef = db.collection('sites').doc(siteId);
      const siteSnap = await siteRef.get();
      if (!siteSnap.exists) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }
      const siteData = siteSnap.data() || {};
      if (siteData.tenantId && siteData.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (!siteData.tenantId && siteData.ownerUid && siteData.ownerUid !== uid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await siteRef.set(
        {
          customDomain: normalizedDomain,
          publishedUrl: siteData.published ? `https://${normalizedDomain}` : siteData.publishedUrl || null,
        },
        { merge: true }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'pending_verification',
      domain: normalizedDomain,
      records: [
        { type: 'A', name: '@', value: '76.76.21.21' },
        { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
      ],
    });
  } catch (error) {
    console.error('Domain connection error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
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

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { requireTenantScope, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { getAdminDb } from '@/server/firebase-admin';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const DOMAIN_REQUEST_EMAIL = process.env.DOMAIN_REQUEST_EMAIL;

const payloadSchema = z.object({
  domain: z.string().min(3),
  provider: z.enum(['namecheap', 'vercel']),
  siteId: z.string().optional(),
});

const normalizeDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/+$/, '');

export async function POST(req: NextRequest) {
  try {
    const payload = payloadSchema.parse(await req.json());
    const { decoded, tenantId } = await requireTenantScope(req);
    const normalizedDomain = normalizeDomain(payload.domain);

    const db = getAdminDb();
    if (payload.siteId) {
      const siteRef = db.collection('sites').doc(payload.siteId);
      const siteSnap = await siteRef.get();
      if (!siteSnap.exists) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
      }
      const siteData = siteSnap.data() || {};
      if (siteData.ownerUid && siteData.ownerUid !== decoded.uid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const requestRef = db
      .collection('tenants')
      .doc(tenantId)
      .collection('domain_requests')
      .doc();

    await requestRef.set({
      domain: normalizedDomain,
      provider: payload.provider,
      siteId: payload.siteId || null,
      status: 'requested',
      requestedBy: {
        uid: decoded.uid || null,
        email: decoded.email || null,
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (RESEND_API_KEY && FROM_EMAIL && DOMAIN_REQUEST_EMAIL) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: `Entrestate <${FROM_EMAIL}>`,
        to: DOMAIN_REQUEST_EMAIL,
        subject: `Domain purchase request - ${normalizedDomain}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
            <h2 style="margin: 0 0 12px;">Domain Purchase Request</h2>
            <p><strong>Domain:</strong> ${normalizedDomain}</p>
            <p><strong>Provider:</strong> ${payload.provider}</p>
            <p><strong>Tenant:</strong> ${tenantId}</p>
            <p><strong>Requested by:</strong> ${decoded.email || decoded.uid || 'Unknown'}</p>
            ${payload.siteId ? `<p><strong>Site ID:</strong> ${payload.siteId}</p>` : ''}
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, requestId: requestRef.id });
  } catch (error) {
    console.error('[domains/request] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.errors }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to submit domain request' }, { status: 500 });
  }
}

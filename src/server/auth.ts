import { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getAdminAuth } from './firebase-admin';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

function getAuthHeader(req: NextRequest) {
  const header = req.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing Authorization header');
  }
  const token = header.slice(7).trim();
  if (!token) {
    throw new UnauthorizedError('Invalid Authorization header');
  }
  return token;
}

function collectAllowedTenants(token: DecodedIdToken) {
  const allowed = new Set<string>(['public']);
  if (token.uid) {
    allowed.add(token.uid);
  }
  const claimTenant =
    (token as Record<string, unknown>)['tenantId'] ??
    (token as Record<string, unknown>)['tenant'];
  if (typeof claimTenant === 'string' && claimTenant) {
    allowed.add(claimTenant);
  }
  return allowed;
}

export async function requireAuth(req: NextRequest): Promise<DecodedIdToken> {
  const tokenString = getAuthHeader(req);
  try {
    const auth = getAdminAuth();
    return await auth.verifyIdToken(tokenString);
  } catch (error) {
    console.error('[auth] token verification failed', error);
    throw new UnauthorizedError('Invalid token');
  }
}

export async function requireTenantScope(req: NextRequest, requestedTenantId?: string) {
  const decoded = await requireAuth(req);
  const allowed = collectAllowedTenants(decoded);

  const fallbackTenant =
    (typeof (decoded as Record<string, unknown>)['tenantId'] === 'string'
      ? String((decoded as Record<string, unknown>)['tenantId'])
      : undefined) || decoded.uid || 'public';

  const tenantId = requestedTenantId || fallbackTenant;

  if (!allowed.has(tenantId)) {
    throw new ForbiddenError('Tenant access denied');
  }

  return { decoded, tenantId };
}

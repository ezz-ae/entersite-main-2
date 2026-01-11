export {
  ForbiddenError,
  UnauthorizedError,
  requireAuth,
  requireRole,
  requireTenant,
  verifyFirebaseIdToken,
  type AuthContext,
  type Role,
} from '@/lib/server/auth';

import type { NextRequest } from 'next/server';
import { requireTenant } from '@/lib/server/auth';

export async function requireTenantScope(req: NextRequest, _requestedTenantId?: string) {
  const context = await requireTenant(req);
  return { decoded: context.claims, tenantId: context.tenantId };
}

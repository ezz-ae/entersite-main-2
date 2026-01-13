import type { DecodedIdToken } from 'firebase-admin/auth';
import type { NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/server/firebase-admin';

export type Role = 'public' | 'agent' | 'team_admin' | 'agency_admin' | 'super_admin';

export type AuthContext = {
  uid: string;
  email: string | null;
  tenantId: string;
  role: Role;
  roles: Role[];
  claims: DecodedIdToken;
};

const ROLE_PRIORITY: Role[] = ['public', 'agent', 'team_admin', 'agency_admin', 'super_admin'];
const ROLE_RANK = new Map<Role, number>(ROLE_PRIORITY.map((role, index) => [role, index]));

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

function normalizeRole(value: string | null | undefined): Role | null {
  if (!value) return null;
  const raw = value.toLowerCase().replace(/[^a-z_]+/g, '');
  if (raw === 'public' || raw === 'anon' || raw === 'anonymous') return 'public';
  if (raw === 'superadmin' || raw === 'super_admin' || raw === 'root') return 'super_admin';
  if (raw === 'agencyadmin' || raw === 'agency_admin' || raw === 'owner') return 'agency_admin';
  if (raw === 'teamadmin' || raw === 'team_admin' || raw === 'editor') return 'team_admin';
  if (raw === 'admin') return 'agency_admin';
  if (raw === 'developer') return 'super_admin';
  if (raw === 'viewer' || raw === 'agent') return 'agent';
  return null;
}

function normalizeRoles(input: unknown): Role[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((value) => normalizeRole(String(value)))
      .filter(Boolean) as Role[];
  }
  if (typeof input === 'string') {
    if (input.includes(',')) {
      return input
        .split(',')
        .map((value) => normalizeRole(value.trim()))
        .filter(Boolean) as Role[];
    }
    const role = normalizeRole(input);
    return role ? [role] : [];
  }
  return [];
}

function getHighestRole(roles: Role[]): Role {
  if (!roles.length) return 'agent';
  return roles.reduce((best, current) => {
    const currentRank = ROLE_RANK.get(current) ?? 0;
    const bestRank = ROLE_RANK.get(best) ?? 0;
    return currentRank > bestRank ? current : best;
  }, roles[0]);
}

function getAuthHeader(req: NextRequest | Request) {
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

async function loadUserProfile(uid: string) {
  const db = getAdminDb();
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function loadTenantMember(tenantId: string, uid: string) {
  const db = getAdminDb();
  const doc = await db.collection('tenants').doc(tenantId).collection('members').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

function getClaimsTenant(claims: DecodedIdToken) {
  const raw =
    (claims as Record<string, unknown>)['tenantId'] ??
    (claims as Record<string, unknown>)['tenant'];
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

function getClaimsRoles(claims: DecodedIdToken) {
  const rawRoles = (claims as Record<string, unknown>)['roles'];
  const rawRole = (claims as Record<string, unknown>)['role'];
  const roles = normalizeRoles(rawRoles);
  if (roles.length) return roles;
  return normalizeRoles(rawRole);
}

export async function verifyFirebaseIdToken(req: NextRequest | Request) {
  const tokenString = getAuthHeader(req);
  try {
    const auth = getAdminAuth();
    const claims = await auth.verifyIdToken(tokenString);
    return { uid: claims.uid, email: claims.email ?? null, claims };
  } catch (error) {
    console.error('[auth] token verification failed', error);
    throw new UnauthorizedError('Invalid token');
  }
}

async function resolveTenantAndRoles(claims: DecodedIdToken) {
  const claimTenant = getClaimsTenant(claims);
  const claimRoles = getClaimsRoles(claims);

  let tenantId = claimTenant;
  let roles = claimRoles;
  let memberProfile: Record<string, unknown> | null = null;

  if (!tenantId) {
    const profile = await loadUserProfile(claims.uid);
    const profileTenant = typeof profile?.tenantId === 'string' ? profile.tenantId : null;
    tenantId = profileTenant || claims.uid;
    if (!roles.length && profile?.role) {
      roles = normalizeRoles(profile.role);
    }
  }

  if (tenantId && !roles.length) {
    memberProfile = (await loadTenantMember(tenantId, claims.uid)) ?? null;
    if (memberProfile?.role) {
      roles = normalizeRoles(memberProfile.role);
    }
    if (memberProfile?.roles && !roles.length) {
      roles = normalizeRoles(memberProfile.roles);
    }
  }

  if (!roles.length) {
    roles = tenantId === claims.uid ? ['agency_admin'] : ['agent'];
  }

  return { tenantId: tenantId || claims.uid, roles };
}

export async function requireAuth(req: NextRequest | Request): Promise<AuthContext> {
  const { uid, email, claims } = await verifyFirebaseIdToken(req);
  const { tenantId, roles } = await resolveTenantAndRoles(claims);
  return {
    uid,
    email,
    tenantId,
    roles,
    role: getHighestRole(roles),
    claims,
  };
}

export async function requireTenant(req: NextRequest | Request): Promise<AuthContext> {
  return requireAuth(req);
}

export async function requireRole(
  req: NextRequest | Request,
  allowedRoles: Role[],
): Promise<AuthContext> {
  try {
    const context = await requireAuth(req);
    if (allowedRoles.includes('public')) {
      return context;
    }
    const hasRole = context.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenError('Role access denied');
    }
    return context;
  } catch (error) {
    if (error instanceof UnauthorizedError && allowedRoles.includes('public')) {
      return {
        uid: 'anonymous',
        email: null,
        tenantId: 'public',
        role: 'public',
        roles: ['public'],
        claims: {} as DecodedIdToken,
      };
    }
    throw error;
  }
}

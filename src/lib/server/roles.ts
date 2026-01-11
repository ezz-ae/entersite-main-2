import type { Role } from '@/lib/server/auth';

export const ALL_ROLES: Role[] = ['agent', 'team_admin', 'agency_admin', 'super_admin'];
export const ADMIN_ROLES: Role[] = ['team_admin', 'agency_admin', 'super_admin'];
export const AGENCY_ADMIN_ROLES: Role[] = ['agency_admin', 'super_admin'];
export const SUPER_ADMIN_ROLES: Role[] = ['super_admin'];

import type { NextRequest } from 'next/server';

/**
 * Security helpers.
 *
 * Goal: keep the platform "secure by design" with minimal friction.
 * - We do NOT try to "block bots" on public pages.
 * - We DO protect authenticated & money/ops endpoints against CSRF + cross-site abuse.
 */

const EXTRA_ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((v) => v.trim())
  .filter(Boolean);

function normalizeOrigin(origin: string) {
  try {
    const u = new URL(origin);
    return `${u.protocol}//${u.host}`;
  } catch {
    return '';
  }
}

export function getRequestOrigin(req: NextRequest) {
  const origin = req.headers.get('origin');
  return origin ? normalizeOrigin(origin) : '';
}

export function getHostOrigin(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  return host ? `${proto}://${host}` : '';
}

/**
 * Allow:
 * - same-origin browser requests
 * - server-to-server requests (Origin missing)
 * - explicitly allowed origins (multi-domain setups)
 */
export function isAllowedOrigin(req: NextRequest) {
  const origin = getRequestOrigin(req);
  if (!origin) return true; // server-to-server or non-browser
  const hostOrigin = getHostOrigin(req);
  if (origin === hostOrigin) return true;
  return EXTRA_ALLOWED_ORIGINS.includes(origin);
}

export function enforceSameOrigin(req: NextRequest) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return;
  if (!isAllowedOrigin(req)) {
    const err = new Error('Cross-site request blocked');
    (err as any).statusCode = 403;
    throw err;
  }
}

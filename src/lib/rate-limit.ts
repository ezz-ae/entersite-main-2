import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();
const limiterCache = new Map<string, Ratelimit>();

const RATE_LIMIT_DISABLED = process.env.RATE_LIMIT_DISABLED === 'true';
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    : null;

function getLimiter(limit: number, windowMs: number) {
  const key = `${limit}:${windowMs}`;
  const existing = limiterCache.get(key);
  if (existing) return existing;
  if (!redis) return null;
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    analytics: false,
  });
  limiterCache.set(key, limiter);
  return limiter;
}

export async function consumeRateLimit(key: string, limit: number, windowMs: number) {
  if (RATE_LIMIT_DISABLED) return true;

  const limiter = getLimiter(limit, windowMs);
  if (limiter) {
    const result = await limiter.limit(key);
    return result.success;
  }

  // Fallback: in-memory sliding window.
  // This is not perfect in serverless environments (state is per-instance),
  // but it still meaningfully reduces abuse and accidental request storms.

  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.expiresAt < now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export async function enforceRateLimit(key: string, limit: number, windowMs: number) {
  return consumeRateLimit(key, limit, windowMs);
}

export function getRequestIp(request: Request | { headers: Headers; ip?: string | null }) {
  const forwarded =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip');
  if (forwarded) {
    const [ip] = forwarded.split(',');
    if (ip) return ip.trim();
  }
  const reqIp = 'ip' in request ? request.ip : undefined;
  return reqIp || '0.0.0.0';
}

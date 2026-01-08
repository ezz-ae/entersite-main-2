type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

const RATE_LIMIT_DISABLED = process.env.RATE_LIMIT_DISABLED === 'true';

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
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

export function enforceRateLimit(key: string, limit: number, windowMs: number) {
  if (RATE_LIMIT_DISABLED) return true;
  return consumeRateLimit(key, limit, windowMs);
}

export function getRequestIp(request: Request | { headers: Headers; ip?: string | null }) {
  const header = request.headers.get('x-forwarded-for');
  if (header) {
    const [ip] = header.split(',');
    if (ip) return ip.trim();
  }
  const reqIp = 'ip' in request ? request.ip : undefined;
  return reqIp || '0.0.0.0';
}

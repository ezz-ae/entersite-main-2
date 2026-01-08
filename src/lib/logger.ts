import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export type ApiLogLevel = 'info' | 'error';

interface ApiLoggerContext {
  route: string;
  requestId?: string;
  tenantId?: string;
}

interface LogPayload {
  level: ApiLogLevel;
  route: string;
  requestId: string;
  tenantId?: string;
  method: string;
  message: string;
  status?: number;
  durationMs?: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export function createApiLogger(req: NextRequest, context: { route: string }) {
  const start = Date.now();
  const requestId = req.headers.get('x-request-id') || randomUUID();
  const method = req.method;
  let tenantId: string | undefined;

  const commit = (payload: Omit<LogPayload, 'route' | 'requestId' | 'method'>) => {
    const body: LogPayload = {
      level: payload.level,
      route: context.route,
      requestId,
      method,
      tenantId: tenantId || payload.tenantId,
      message: payload.message,
      status: payload.status,
      durationMs: payload.durationMs,
      error: payload.error,
      metadata: payload.metadata,
    };
    console.log(JSON.stringify(body));
  };

  return {
    requestId,
    setTenant(id?: string) {
      tenantId = id || tenantId;
    },
    logSuccess(status: number, metadata?: Record<string, unknown>) {
      commit({
        level: 'info',
        message: 'api.success',
        status,
        durationMs: Date.now() - start,
        metadata,
      });
    },
    logError(error: unknown, status = 500, metadata?: Record<string, unknown>) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
          ? error.message
          : 'Unknown error';
      commit({
        level: 'error',
        message: 'api.error',
        status,
        durationMs: Date.now() - start,
        error: message,
        metadata,
      });
    },
    logRateLimit() {
      commit({
        level: 'error',
        message: 'api.rate_limited',
        status: 429,
        durationMs: Date.now() - start,
      });
    },
  };
}

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import * as Sentry from '@sentry/nextjs';

export type ApiLogLevel = 'info' | 'error';

interface ApiLoggerContext {
  route: string;
  requestId?: string;
  tenantId?: string;
  userId?: string;
}

interface LogPayload {
  level: ApiLogLevel;
  route: string;
  requestId: string;
  timestamp: string;
  tenantId?: string;
  userId?: string;
  method: string;
  message: string;
  outcome: 'success' | 'failure' | 'rate_limited';
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
  let userId: string | undefined;

  const commit = (
    payload: Omit<LogPayload, 'route' | 'requestId' | 'method' | 'timestamp'> & {
      timestamp?: string;
    }
  ) => {
    const body: LogPayload = {
      level: payload.level,
      route: context.route,
      requestId,
      timestamp: payload.timestamp ?? new Date().toISOString(),
      method,
      tenantId: tenantId || payload.tenantId,
      userId: userId || payload.userId,
      message: payload.message,
      outcome: payload.outcome,
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
    setActor(id?: string) {
      userId = id || userId;
    },
    logSuccess(status: number, metadata?: Record<string, unknown>) {
      commit({
        level: 'info',
        message: 'api.success',
        outcome: 'success',
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
      Sentry.captureException(error, {
        tags: {
          route: context.route,
          tenantId: tenantId || undefined,
        },
        extra: {
          requestId,
          status,
          metadata,
        },
      });
      commit({
        level: 'error',
        message: 'api.error',
        outcome: 'failure',
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
        outcome: 'rate_limited',
        status: 429,
        durationMs: Date.now() - start,
      });
    },
  };
}

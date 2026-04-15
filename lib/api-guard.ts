import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { getUserFromRequest } from '@/lib/auth-utils';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

type RateLimiter = (
  request: NextRequest,
) => Promise<{ success: boolean; remaining: number; reset: number }>;

interface GuardOptions<TBody = unknown> {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireVerifiedEmail?: boolean;
  csrf?: boolean;
  rateLimit?: RateLimiter;
  bodySchema?: ZodSchema<TBody>;
}

type GuardContext<
  TBody = unknown,
  TRouteContext extends Record<string, unknown> = Record<string, unknown>,
> = TRouteContext & {
  user?: Awaited<ReturnType<typeof getUserFromRequest>>;
  body?: TBody;
};

type GuardedHandler<
  TBody = unknown,
  TRouteContext extends Record<string, unknown> = Record<string, unknown>,
> = (
  request: NextRequest,
  context: GuardContext<TBody, TRouteContext>,
) => Promise<NextResponse>;

export function withApiGuard<
  TBody = unknown,
  TRouteContext extends Record<string, unknown> = Record<string, unknown>,
>(
  options: GuardOptions<TBody>,
  handler: GuardedHandler<TBody, TRouteContext>,
) {
  return async (
    request: NextRequest,
    routeContext?: TRouteContext,
  ): Promise<NextResponse> => {
    const logger = createLogger('api:guard');

    try {
      if (options.rateLimit) {
        const result = await options.rateLimit(request);
        if (!result.success) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 },
          );
        }
      }

      if (options.csrf) {
        const csrfResult = validateCsrf(request);
        if (!csrfResult.valid) {
          return NextResponse.json(
            { error: csrfResult.error || 'Invalid request' },
            { status: 403 },
          );
        }
      }

      let user: Awaited<ReturnType<typeof getUserFromRequest>> | undefined;
      if (options.requireAuth || options.requireAdmin || options.requireVerifiedEmail) {
        user = await getUserFromRequest(request);
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (options.requireAdmin && user.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // TEMP: email verification disabled
        // if (options.requireVerifiedEmail && !user.emailVerified) {
        //   return NextResponse.json(
        //     { error: 'Email verification required' },
        //     { status: 403 },
        //   );
        // }
      }

      let body: TBody | undefined;
      if (options.bodySchema) {
        body = options.bodySchema.parse(await request.json());
      }

      return handler(
        request,
        {
          ...(routeContext || ({} as TRouteContext)),
          user,
          body,
        } as GuardContext<TBody, TRouteContext>,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 },
        );
      }
      logger.error('Guarded handler failed', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  };
}

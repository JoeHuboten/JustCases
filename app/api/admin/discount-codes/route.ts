import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { discountCodeSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:admin:discount-codes');

// GET - Fetch all discount codes
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (_request: NextRequest) => {
    try {
      const codes = await prisma.discountCode.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(codes);
    } catch (error) {
      logger.error('Failed to fetch discount codes', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch discount codes' },
        { status: 500 },
      );
    }
  },
);

// POST - Create new discount code
export const POST = withApiGuard(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: discountCodeSchema,
  },
  async (_request: NextRequest, { body }) => {
    try {
      const existing = await prisma.discountCode.findUnique({
        where: { code: body!.code.toUpperCase() },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Discount code already exists' },
          { status: 400 },
        );
      }

      const discountCode = await prisma.discountCode.create({
        data: {
          code: body!.code.toUpperCase(),
          percentage: body!.percentage,
          expiresAt: body!.expiresAt ? new Date(body!.expiresAt) : null,
          maxUses: body!.maxUses || null,
          active: body!.active !== undefined ? body!.active : true,
        },
      });

      return NextResponse.json(discountCode, { status: 201 });
    } catch (error) {
      logger.error('Failed to create discount code', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to create discount code' },
        { status: 500 },
      );
    }
  },
);

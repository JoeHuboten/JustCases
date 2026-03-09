import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { discountCodeUpdateSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { z } from 'zod';

const logger = createLogger('api:admin:discount-codes:id');

// PUT - Update discount code
export const PUT = withApiGuard<z.infer<typeof discountCodeUpdateSchema>, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: discountCodeUpdateSchema,
  },
  async (_request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const body = context.body!;

      if (body.code) {
        const existing = await prisma.discountCode.findUnique({
          where: { code: body.code.toUpperCase() },
        });

        if (existing && existing.id !== id) {
          return NextResponse.json(
            { error: 'Discount code already exists' },
            { status: 400 },
          );
        }
      }

      const discountCode = await prisma.discountCode.update({
        where: { id },
        data: {
          code: body.code ? body.code.toUpperCase() : undefined,
          percentage: body.percentage,
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
          maxUses: body.maxUses !== undefined ? body.maxUses : undefined,
          active: body.active,
        },
      });

      return NextResponse.json(discountCode);
    } catch (error) {
      logger.error('Failed to update discount code', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to update discount code' },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete discount code
export const DELETE = withApiGuard<unknown, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
  },
  async (_request: NextRequest, context) => {
    try {
      const { id } = await context.params;

      await prisma.discountCode.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      logger.error('Failed to delete discount code', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to delete discount code' },
        { status: 500 },
      );
    }
  },
);

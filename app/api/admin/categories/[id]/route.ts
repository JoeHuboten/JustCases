import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { strictRateLimit } from '@/lib/rate-limit';
import { categoryUpdateSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { logAdminAction } from '@/lib/audit-log';
import { z } from 'zod';

const logger = createLogger('api:admin:categories:id');

// PUT - Update category
export const PUT = withApiGuard<z.infer<typeof categoryUpdateSchema>, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: categoryUpdateSchema,
  },
  async (request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const body = context.body!;

      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.slug !== undefined && { slug: body.slug }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.image !== undefined && { image: body.image }),
        },
      });

      await logAdminAction({
        action: 'CATEGORY_UPDATE',
        actor: context.user!,
        request,
        target: { type: 'Category', id },
        metadata: { name: category.name, slug: category.slug },
      });

      return NextResponse.json({ category });
    } catch (error) {
      logger.error('Failed to update category', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete category
export const DELETE = withApiGuard<unknown, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
  },
  async (request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const productsCount = await prisma.product.count({
        where: { categoryId: id },
      });

      if (productsCount > 0) {
        return NextResponse.json(
          { error: 'Cannot delete category with existing products' },
          { status: 400 },
        );
      }

      await prisma.category.delete({
        where: { id },
      });

      await logAdminAction({
        action: 'CATEGORY_DELETE',
        actor: context.user!,
        request,
        target: { type: 'Category', id },
      });

      return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete category', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 },
      );
    }
  },
);

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { categorySchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { logAdminAction } from '@/lib/audit-log';

const logger = createLogger('api:admin:categories');

// GET - Fetch all categories
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (_request: NextRequest) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ categories });
    } catch (error) {
      logger.error('Failed to fetch categories', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 },
      );
    }
  },
);

// POST - Create new category
export const POST = withApiGuard(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: categorySchema,
  },
  async (request: NextRequest, { user, body }) => {
    try {
      const category = await prisma.category.create({
        data: {
          name: body!.name,
          slug: body!.slug,
          description: body!.description,
          image: body!.image,
        },
      });

      await logAdminAction({
        action: 'category.create',
        actor: { id: user!.id, email: user!.email!, role: user!.role },
        request,
        target: { type: 'Category', id: category.id },
        metadata: { name: category.name, slug: category.slug },
      });

      return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
      logger.error('Failed to create category', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 },
      );
    }
  },
);

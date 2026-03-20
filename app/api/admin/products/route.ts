import { NextRequest, NextResponse } from 'next/server';
import { prisma, getPaginationParams } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { productSchema } from '@/lib/validation';
import { Prisma } from '@prisma/client';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { writeAuditLog } from '@/lib/audit-log';

const logger = createLogger('api:admin:products');

// GET - Fetch products with pagination
export const GET = withApiGuard(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
      const search = searchParams.get('search')?.trim();
      const category = searchParams.get('category');
      const inStock = searchParams.get('inStock');
      const featured = searchParams.get('featured');

      const { take, skip } = getPaginationParams(page, limit);

      const where: Prisma.ProductWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category) {
        where.categoryId = category;
      }

      if (inStock === 'true') {
        where.inStock = true;
      } else if (inStock === 'false') {
        where.inStock = false;
      }

      if (featured === 'true') {
        where.featured = true;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take,
          skip,
        }),
        prisma.product.count({ where }),
      ]);

      return NextResponse.json({
        products,
        total,
        page,
        limit: take,
        totalPages: Math.ceil(total / take),
      });
    } catch (error) {
      logger.error('Failed to fetch products', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 },
      );
    }
  },
);

// POST - Create new product
export const POST = withApiGuard(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: productSchema,
  },
  async (request: NextRequest, { body, user }) => {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: body!.slug },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product with this slug already exists' },
          { status: 400 },
        );
      }

      const product = await prisma.product.create({
        data: body!,
      });

      await writeAuditLog({
        action: 'product.create',
        actor: { id: user!.id, email: user!.email!, role: user!.role },
        request,
        targetType: 'product',
        targetId: product.id,
        metadata: { name: product.name, slug: product.slug },
      });

      return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
      logger.error('Failed to create product', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 },
      );
    }
  },
);

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiGuard } from '@/lib/api-guard';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { productUpdateSchema } from '@/lib/validation';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

const logger = createLogger('api:admin:products:id');

// GET - Fetch single product
export const GET = withApiGuard<unknown, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    rateLimit: apiRateLimit,
  },
  async (_request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ product });
    } catch (error) {
      logger.error('Failed to fetch product', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 },
      );
    }
  },
);

// PUT - Update product
export const PUT = withApiGuard<z.infer<typeof productUpdateSchema>, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
    bodySchema: productUpdateSchema,
  },
  async (_request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      const body = context.body!;

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.slug !== undefined && { slug: body.slug }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.price !== undefined && { price: body.price }),
          ...(body.oldPrice !== undefined && { oldPrice: body.oldPrice }),
          ...(body.discount !== undefined && { discount: body.discount }),
          ...(body.image !== undefined && { image: body.image }),
          ...(body.images !== undefined && { images: body.images }),
          ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
          ...(body.colors !== undefined && { colors: body.colors }),
          ...(body.sizes !== undefined && { sizes: body.sizes }),
          ...(body.rating !== undefined && { rating: body.rating }),
          ...(body.reviews !== undefined && { reviews: body.reviews }),
          ...(body.inStock !== undefined && { inStock: body.inStock }),
          ...(body.featured !== undefined && { featured: body.featured }),
          ...(body.specifications !== undefined && { specifications: body.specifications }),
        } as Prisma.ProductUncheckedUpdateInput,
        include: {
          category: true,
        },
      });

      return NextResponse.json({ product });
    } catch (error) {
      logger.error('Failed to update product', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete product
export const DELETE = withApiGuard<unknown, { params: Promise<{ id: string }> }>(
  {
    requireAdmin: true,
    csrf: true,
    rateLimit: strictRateLimit,
  },
  async (_request: NextRequest, context) => {
    try {
      const { id } = await context.params;
      await prisma.product.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete product', { error: getSafeErrorDetails(error) });
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 },
      );
    }
  },
);

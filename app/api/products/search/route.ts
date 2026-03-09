import { NextRequest, NextResponse } from 'next/server';
import { prisma, productSelectFields } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/validation';
import { apiCache, cacheKeys } from '@/lib/cache';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:products:search');

/**
 * Server-side product search endpoint
 * Performs database-level filtering instead of client-side filtering
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const categoryId = searchParams.get('categoryId') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Require at least 2 characters for search
    if (query && query.length < 2) {
      return NextResponse.json({ products: [], total: 0 });
    }

    // Sanitize search query to prevent injection
    const sanitizedQuery = query ? sanitizeInput(query) : '';

    // Build where clause
    const where: any = {};

    if (sanitizedQuery) {
      where.OR = [
        { name: { contains: sanitizedQuery, mode: 'insensitive' } },
        { description: { contains: sanitizedQuery, mode: 'insensitive' } },
        { colors: { contains: sanitizedQuery, mode: 'insensitive' } },
        { sizes: { contains: sanitizedQuery, mode: 'insensitive' } },
        { category: { name: { contains: sanitizedQuery, mode: 'insensitive' } } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Build cache key for search
    const cacheKey = cacheKeys.search(`${sanitizedQuery}-${categoryId || ''}-${limit}-${offset}`);
    const cached = await apiCache.getDistributed<{ products: unknown[]; total: number; limit: number; offset: number; hasMore: boolean }>(cacheKey);
    if (cached && cached.total === total) {
      return NextResponse.json(cached);
    }

    // Fetch products with pagination
    const products = await prisma.product.findMany({
      where,
      select: {
        ...productSelectFields,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    const result = {
      products,
      total,
      limit,
      offset,
      hasMore: offset + products.length < total,
    };

    // Cache search results for 30 seconds (TTL in seconds, see cacheTTL.search)
    await apiCache.setDistributed(cacheKey, result, 30);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error searching products', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

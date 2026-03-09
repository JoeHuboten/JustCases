import { NextRequest, NextResponse } from 'next/server';
import { prisma, productSelectFields, getPaginationParams } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { apiCache, cacheKeys, cacheTTL } from '@/lib/cache';
import { Prisma } from '@prisma/client';
import { createLogger, getRequestId, getSafeErrorDetails } from '@/lib/logger';

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

function getOrderBy(sort: SortOption): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price-low':
      return { price: 'asc' };
    case 'price-high':
      return { price: 'desc' };
    case 'rating':
      return { rating: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    case 'popular':
    default:
      return { reviews: 'desc' };
  }
}

export async function GET(request: NextRequest) {
  const requestId = getRequestId(request.headers);
  const logger = createLogger('api:products').withRequestId(requestId);
  const startTime = Date.now();

  logger.debug('GET /api/products', {
    query: {
      page: request.nextUrl.searchParams.get('page') || '1',
      limit: request.nextUrl.searchParams.get('limit') || '12',
      category: request.nextUrl.searchParams.get('category') || null,
      featured: request.nextUrl.searchParams.get('featured') || null,
      inStock: request.nextUrl.searchParams.get('inStock') || null,
      sort: request.nextUrl.searchParams.get('sort') || 'popular',
      hasSearch: Boolean(request.nextUrl.searchParams.get('search')?.trim()),
    },
  });

  // Rate limiting
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    logger.warn('Rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.', requestId },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination params
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    
    // Filter params
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('inStock');
    const search = searchParams.get('search')?.trim();
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
    const sort = (searchParams.get('sort') || 'popular') as SortOption;
    
    // Build cache key from all params
    const cacheKey = cacheKeys.products(
      `${page}-${limit}-${category || ''}-${featured || ''}-${inStock || ''}-${search || ''}-${minPrice}-${maxPrice}-${sort}`
    );
    
    // Try cache first
    const cached = await apiCache.getDistributed<{ products: unknown[]; total: number; page: number; totalPages: number; limit: number }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const { take, skip } = getPaginationParams(page, limit);
    
    // Build where clause
    const where: Prisma.ProductWhereInput = {};
    
    // Category filter
    if (category && category !== 'all') {
      where.category = { slug: category };
    }
    
    // Featured filter
    if (featured === 'true') {
      where.featured = true;
    }
    
    // In stock filter
    if (inStock === 'true') {
      where.inStock = true;
    }
    
    // Price range filter
    if (minPrice > 0 || maxPrice > 0) {
      where.price = {};
      if (minPrice > 0) {
        where.price.gte = minPrice;
      }
      if (maxPrice > 0) {
        where.price.lte = maxPrice;
      }
    }
    
    // Search filter - search in name and description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get order by clause
    const orderBy = getOrderBy(sort);

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: productSelectFields,
        take,
        skip,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);
    
    const result = {
      products,
      total,
      page,
      limit: take,
      totalPages,
      requestId,
    };

    // Cache the result (shorter TTL for search queries)
    const ttl = search ? 30 : cacheTTL.products;
    await apiCache.setDistributed(cacheKey, result, ttl);

    const duration = Date.now() - startTime;
    logger.info(`Found ${products.length} products`, { total, page, totalPages, duration: `${duration}ms` });

    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Error fetching products', { error: getSafeErrorDetails(error), duration: `${duration}ms` });
    return NextResponse.json(
      { error: 'Failed to fetch products', requestId }, 
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}

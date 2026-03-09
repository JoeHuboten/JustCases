import { NextRequest, NextResponse } from 'next/server';
import { prisma, categorySelectFields } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { apiCache, cacheKeys, cacheTTL } from '@/lib/cache';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:categories');

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
    const cacheKey = cacheKeys.categories();
    
    // Try cache first
    const cached = await apiCache.getDistributed<unknown[]>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const categories = await prisma.category.findMany({
      select: categorySelectFields,
      orderBy: { name: 'asc' },
    });

    // Cache for 10 minutes
    await apiCache.setDistributed(cacheKey, categories, cacheTTL.categories);

    return NextResponse.json(categories);
  } catch (error) {
    logger.error('Error fetching categories', { error: getSafeErrorDetails(error) });
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

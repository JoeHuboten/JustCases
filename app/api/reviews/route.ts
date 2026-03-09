import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { reviewSchema, sanitizeInput } from '@/lib/validation';
import { getUserFromRequest } from '@/lib/auth-utils';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:reviews');

// GET - Fetch product reviews
export async function GET(request: NextRequest) {
  // Rate limiting - 60 requests per minute
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const sortBy = searchParams.get('sortBy') || 'newest';

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Determine sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'highest') orderBy = { rating: 'desc' };
    else if (sortBy === 'lowest') orderBy = { rating: 'asc' };
    else if (sortBy === 'helpful') orderBy = { helpful: 'desc' };

    // Get total count
    const totalReviews = await prisma.review.count({
      where: {
        productId,
        verified: true,
      },
    });

    // Calculate pagination
    const totalPages = Math.ceil(totalReviews / limit);
    const skip = (page - 1) * limit;

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        verified: true, // Only show verified reviews
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    // Calculate average rating
    const allReviews = await prisma.review.findMany({
      where: {
        productId,
        verified: true,
      },
      select: {
        rating: true,
      },
    });

    const averageRating = allReviews.length > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0;

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalPages,
      },
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    });
  } catch (error) {
    logger.error('Error fetching reviews', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: 'Invalid request. Please refresh and try again.' },
      { status: 403 }
    );
  }

  // Rate limiting - 60 requests per minute
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    // Require authentication
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to leave a review' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment, title } = body;

    // Validate required fields
    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const sanitizedTitle = title ? sanitizeInput(title) : null;
    const sanitizedComment = comment ? sanitizeInput(comment) : null;

    // Create review (not verified by default)
    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(rating),
        comment: sanitizedComment,
        title: sanitizedTitle,
        verified: false, // Require admin verification
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        review,
        message: 'Review submitted and pending verification'
      },
      { status: 201 }
    );
  } catch (error: any) {
    logger.error('Error creating review', { error: getSafeErrorDetails(error) });
    
    // Handle unique constraint violation (user already reviewed this product)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

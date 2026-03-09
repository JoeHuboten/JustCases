import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:wishlist');

// GET - Fetch user's wishlist
export async function GET(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match expected format
    const items = wishlistItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      oldPrice: item.product.oldPrice,
      discount: item.product.discount,
      image: item.product.image,
      category: item.product.category,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    logger.error('Error fetching wishlist', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: csrfResult.error || 'Invalid request' },
      { status: 403 }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add to wishlist (upsert to avoid duplicates)
    const wishlistItem = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        productId,
      },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      item: {
        id: wishlistItem.product.id,
        name: wishlistItem.product.name,
        slug: wishlistItem.product.slug,
        price: wishlistItem.product.price,
        oldPrice: wishlistItem.product.oldPrice,
        discount: wishlistItem.product.discount,
        image: wishlistItem.product.image,
        category: wishlistItem.product.category,
      },
    });
  } catch (error) {
    logger.error('Error adding to wishlist', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // CSRF protection
  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json(
      { error: csrfResult.error || 'Invalid request' },
      { status: 403 }
    );
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Handle case where item doesn't exist
    if (error.code === 'P2025') {
      return NextResponse.json({ success: true });
    }

    logger.error('Error removing from wishlist', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}

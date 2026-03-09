import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { apiRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:cart');

// GET - Retrieve user's saved cart
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
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ items: [] });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            oldPrice: true,
            discount: true,
            image: true,
          },
        },
      },
    });

    const items = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price,
      oldPrice: item.product.oldPrice,
      discount: item.product.discount,
      image: item.product.image,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    logger.error('Error fetching cart', { error: getSafeErrorDetails(error) });
    return NextResponse.json({ items: [] });
  }
}

// POST - Sync user's cart (merge or replace)
export async function POST(request: NextRequest) {
  // Rate limiting
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
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { items, merge = false } = await request.json();

    // If not merging, clear existing cart first
    if (!merge) {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });

      if (Array.isArray(items) && items.length > 0) {
        await prisma.cartItem.createMany({
          data: items.map((item: any) => ({
            userId: user.id,
            productId: item.id,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          })),
        });
      }

      return NextResponse.json({ success: true });
    }

    const typedItems = (items as Array<{ id: string; quantity: number; color?: string; size?: string }>).map(
      (item) => ({
        id: String(item.id),
        quantity: Number(item.quantity),
        color: item.color,
        size: item.size,
      }),
    );
    const productIds: string[] = Array.from(new Set(typedItems.map((item) => item.id)));
    const existingItems = await prisma.cartItem.findMany({
      where: {
        userId: user.id,
        productId: { in: productIds },
      },
      select: {
        id: true,
        productId: true,
        color: true,
        size: true,
        quantity: true,
      },
    });

    const existingMap = new Map(
      existingItems.map((item) => [`${item.productId}:${item.color || ''}:${item.size || ''}`, item]),
    );

    const creates: Array<{
      userId: string;
      productId: string;
      quantity: number;
      color: string | null;
      size: string | null;
    }> = [];

    const updates = [];
    for (const item of typedItems) {
      const key = `${item.id}:${item.color || ''}:${item.size || ''}`;
      const existingItem = existingMap.get(key);
      if (existingItem) {
        updates.push(
          prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          }),
        );
      } else {
        creates.push({
          userId: user.id,
          productId: item.id,
          quantity: item.quantity,
          color: item.color || null,
          size: item.size || null,
        });
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    if (creates.length > 0) {
      await prisma.cartItem.createMany({
        data: creates,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error saving cart', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear user's cart
export async function DELETE(request: NextRequest) {
  // Rate limiting
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
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error clearing cart', { error: getSafeErrorDetails(error) });
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

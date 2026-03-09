import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';
import { apiRateLimit, strictRateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';
import { createLogger, getSafeErrorDetails } from '@/lib/logger';

const logger = createLogger('api:addresses');

// GET - Fetch all addresses for authenticated user
export async function GET(request: NextRequest) {
  const rateLimitResult = await apiRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    logger.error('Error fetching addresses', { error: getSafeErrorDetails(error) });
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST - Create a new address
export async function POST(request: NextRequest) {
  const rateLimitResult = await strictRateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const csrfResult = validateCsrf(request);
  if (!csrfResult.valid) {
    return NextResponse.json({ error: csrfResult.error || 'Invalid request' }, { status: 403 });
  }

  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { firstName, lastName, address1, address2, city, state, postalCode, country, phone, isDefault } = data;

    // Validate required fields
    if (!firstName || !lastName || !address1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    // Check if this is the first address (auto-set as default)
    const existingCount = await prisma.address.count({ where: { userId: user.id } });
    const shouldBeDefault = isDefault || existingCount === 0;

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        address1,
        address2: address2 || null,
        city,
        state,
        postalCode,
        country,
        phone: phone || null,
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    logger.error('Error creating address', { error: getSafeErrorDetails(error) });
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}

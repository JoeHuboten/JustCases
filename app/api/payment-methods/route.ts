import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';

// GET - Fetch all payment methods for authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        type: true,
        cardBrand: true,
        cardNumber: true, // Only last 4 digits stored
        expiryMonth: true,
        expiryYear: true,
        holderName: true,
        isDefault: true,
        createdAt: true,
      },
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 });
  }
}

// POST - Create a new payment method
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { type, cardNumber, cardBrand, expiryMonth, expiryYear, holderName, isDefault } = data;

    // Validate required fields for card payments
    if (type === 'CARD') {
      if (!cardNumber || !expiryMonth || !expiryYear || !holderName) {
        return NextResponse.json({ error: 'Missing required card fields' }, { status: 400 });
      }
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    // Check if this is the first payment method (auto-set as default)
    const existingCount = await prisma.paymentMethod.count({ where: { userId: user.id } });
    const shouldBeDefault = isDefault || existingCount === 0;

    // Only store last 4 digits for security
    const last4 = cardNumber ? cardNumber.slice(-4) : null;

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        type: type || 'CARD',
        cardNumber: last4,
        cardBrand: cardBrand || detectCardBrand(cardNumber),
        expiryMonth: expiryMonth ? parseInt(expiryMonth) : null,
        expiryYear: expiryYear ? parseInt(expiryYear) : null,
        holderName: holderName || null,
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json(paymentMethod, { status: 201 });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: 'Failed to create payment method' }, { status: 500 });
  }
}

// Detect card brand from number
function detectCardBrand(cardNumber: string): string {
  if (!cardNumber) return 'Unknown';
  const num = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num)) return 'Mastercard';
  if (/^3[47]/.test(num)) return 'Amex';
  if (/^6(?:011|5)/.test(num)) return 'Discover';
  if (/^(?:2131|1800|35)/.test(num)) return 'JCB';
  
  return 'Unknown';
}

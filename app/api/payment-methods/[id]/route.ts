import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth-utils';

// GET - Fetch a specific payment method
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    return NextResponse.json({ error: 'Failed to fetch payment method' }, { status: 500 });
  }
}

// PUT - Update a payment method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Verify ownership
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (data.isDefault && !existingMethod.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: {
        expiryMonth: data.expiryMonth ? parseInt(data.expiryMonth) : existingMethod.expiryMonth,
        expiryYear: data.expiryYear ? parseInt(data.expiryYear) : existingMethod.expiryYear,
        holderName: data.holderName ?? existingMethod.holderName,
        isDefault: data.isDefault ?? existingMethod.isDefault,
      },
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

// DELETE - Delete a payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    await prisma.paymentMethod.delete({ where: { id } });

    // If deleted method was default, set another as default
    if (paymentMethod.isDefault) {
      const firstMethod = await prisma.paymentMethod.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });
      if (firstMethod) {
        await prisma.paymentMethod.update({
          where: { id: firstMethod.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}

// PATCH - Set payment method as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    });

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // Unset all defaults
    await prisma.paymentMethod.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    // Set this one as default
    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return NextResponse.json({ error: 'Failed to set default payment method' }, { status: 500 });
  }
}

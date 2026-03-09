import { Prisma, PaymentType, CheckoutSessionStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { checkoutSessionSchema } from '@/lib/validation';

export interface CheckoutLineItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  color?: string | null;
  size?: string | null;
}

interface CreateCheckoutSessionInput {
  items: Array<{
    productId?: string;
    id?: string;
    quantity: number;
    color?: string | null;
    size?: string | null;
  }>;
  discountCode?: string | null;
  shippingAddress?: Record<string, unknown> | null;
}

interface CheckoutSnapshot {
  items: CheckoutLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCodeId?: string;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeItems(items: CreateCheckoutSessionInput['items']) {
  return items.map((item) => ({
    productId: item.productId || item.id || '',
    quantity: item.quantity,
    color: item.color || null,
    size: item.size || null,
  }));
}

export async function buildCheckoutSnapshot(input: CreateCheckoutSessionInput): Promise<CheckoutSnapshot> {
  const normalized = normalizeItems(input.items);
  const parsed = checkoutSessionSchema.parse({
    items: normalized,
    discountCode: input.discountCode || null,
    shippingAddress: input.shippingAddress || null,
  });

  const productIds = parsed.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      price: true,
      discount: true,
      inStock: true,
      stock: true,
    },
  });

  const productById = new Map(products.map((p) => [p.id, p]));
  const lineItems: CheckoutLineItem[] = [];

  for (const item of parsed.items) {
    const product = productById.get(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (!product.inStock || product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const unitPrice = product.discount
      ? roundMoney(product.price * (1 - product.discount / 100))
      : roundMoney(product.price);

    lineItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitPrice,
      color: item.color || null,
      size: item.size || null,
    });
  }

  const subtotal = roundMoney(
    lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  let discount = 0;
  let discountCodeId: string | undefined;
  const discountCode = parsed.discountCode?.trim().toUpperCase();
  if (discountCode) {
    const code = await prisma.discountCode.findUnique({
      where: { code: discountCode },
      select: {
        id: true,
        percentage: true,
        active: true,
        expiresAt: true,
        maxUses: true,
        currentUses: true,
      },
    });

    if (code && code.active) {
      const expired = code.expiresAt && code.expiresAt <= new Date();
      const exhausted = code.maxUses !== null && code.currentUses >= code.maxUses;
      if (!expired && !exhausted) {
        discount = roundMoney((subtotal * code.percentage) / 100);
        discountCodeId = code.id;
      }
    }
  }

  const total = roundMoney(Math.max(0, subtotal - discount));
  return { items: lineItems, subtotal, discount, total, discountCodeId };
}

export async function createCheckoutSession(
  userId: string,
  input: CreateCheckoutSessionInput,
) {
  const snapshot = await buildCheckoutSnapshot(input);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const session = await prisma.checkoutSession.create({
    data: {
      userId,
      subtotal: snapshot.subtotal,
      discount: snapshot.discount,
      total: snapshot.total,
      discountCodeId: snapshot.discountCodeId,
      items: snapshot.items as unknown as Prisma.InputJsonValue,
      shippingAddress: (input.shippingAddress || null) as Prisma.InputJsonValue,
      expiresAt,
      status: CheckoutSessionStatus.PENDING,
      currency: 'EUR',
    },
  });

  return {
    checkoutSessionId: session.id,
    subtotal: session.subtotal,
    discount: session.discount,
    total: session.total,
    currency: session.currency,
    expiresAt: session.expiresAt.toISOString(),
  };
}

export async function getCheckoutSessionForUser(userId: string, checkoutSessionId: string) {
  return prisma.checkoutSession.findFirst({
    where: { id: checkoutSessionId, userId },
  });
}

export async function finalizeCheckoutSession(params: {
  userId: string;
  checkoutSessionId: string;
  provider: PaymentType;
  providerPaymentId: string;
  statusNote: string;
}) {
  const { userId, checkoutSessionId, provider, providerPaymentId, statusNote } = params;

  const existingByPayment = await prisma.order.findFirst({
    where: {
      OR: [
        { paymentId: providerPaymentId },
        { paymentIntentId: providerPaymentId },
        { checkoutSessionId },
      ],
    },
    select: { id: true },
  });
  if (existingByPayment) {
    return { orderId: existingByPayment.id, idempotent: true };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const session = await tx.checkoutSession.findFirst({
        where: { id: checkoutSessionId, userId },
      });

      if (!session) {
        throw new Error('Checkout session not found');
      }

      if (session.status === 'COMPLETED') {
        const existingOrder = await tx.order.findFirst({
          where: { checkoutSessionId },
          select: { id: true },
        });
        if (existingOrder) return { orderId: existingOrder.id, idempotent: true };
      }

      if (session.expiresAt <= new Date()) {
        await tx.checkoutSession.update({
          where: { id: session.id },
          data: { status: 'EXPIRED' },
        });
        throw new Error('Checkout session expired');
      }

      const items = (session.items as unknown as CheckoutLineItem[]) || [];
      if (items.length === 0) {
        throw new Error('Checkout session is empty');
      }

      // Stock-safe decrement (no oversell): update only if stock is still sufficient.
      for (const item of items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            inStock: true,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (updated.count !== 1) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
      }

      await tx.product.updateMany({
        where: {
          id: { in: items.map((i) => i.productId) },
          stock: { lte: 0 },
        },
        data: { inStock: false },
      });

      let shippingAddressId: string | undefined;
      const shippingAddress = session.shippingAddress as Record<string, unknown> | null;
      if (shippingAddress && shippingAddress.firstName) {
        const created = await tx.address.create({
          data: {
            userId,
            firstName: String(shippingAddress.firstName || ''),
            lastName: String(shippingAddress.lastName || ''),
            phone: String(shippingAddress.phone || ''),
            address1: String(shippingAddress.address || ''),
            city: String(shippingAddress.city || ''),
            state: String(shippingAddress.state || ''),
            postalCode: String(shippingAddress.postalCode || ''),
            country: String(shippingAddress.country || 'България'),
            isDefault: false,
          },
        });
        shippingAddressId = created.id;
      }

      if (session.discountCodeId) {
        const code = await tx.discountCode.findUnique({
          where: { id: session.discountCodeId },
          select: {
            id: true,
            active: true,
            expiresAt: true,
            maxUses: true,
            currentUses: true,
          },
        });
        if (
          code &&
          code.active &&
          (!code.expiresAt || code.expiresAt > new Date()) &&
          (code.maxUses === null || code.currentUses < code.maxUses)
        ) {
          await tx.discountCode.update({
            where: { id: code.id },
            data: { currentUses: { increment: 1 } },
          });
        }
      }

      const order = await tx.order.create({
        data: {
          userId,
          total: session.total,
          subtotal: session.subtotal,
          discount: session.discount,
          deliveryFee: 0,
          status: 'PROCESSING',
          paymentType: provider,
          paymentId: provider === 'PAYPAL' ? providerPaymentId : null,
          paymentIntentId: provider === 'CARD' ? providerPaymentId : null,
          discountCodeId: session.discountCodeId || null,
          checkoutSessionId: session.id,
          trackingNumber: `${provider === 'PAYPAL' ? 'PP' : 'ST'}${Date.now()}`,
          shippingAddressId,
          customerNotes: shippingAddress?.notes ? String(shippingAddress.notes) : null,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
              color: item.color || null,
              size: item.size || null,
            })),
          },
        },
        select: { id: true },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: 'PROCESSING',
          notes: statusNote,
          createdBy: userId,
        },
      });

      await tx.checkoutSession.update({
        where: { id: session.id },
        data: {
          status: 'COMPLETED',
          provider,
          providerPaymentId,
          finalizedAt: new Date(),
        },
      });

      return { orderId: order.id, idempotent: false };
    });

    return result;
  } catch (error: unknown) {
    // Unique constraints enforce idempotency under races.
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002') {
      const existing = await prisma.order.findFirst({
        where: { checkoutSessionId },
        select: { id: true },
      });
      if (existing) {
        return { orderId: existing.id, idempotent: true };
      }
    }
    throw error;
  }
}

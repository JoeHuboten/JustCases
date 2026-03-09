import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with logging in dev
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['warn', 'error'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Common select fields for optimized queries
export const productSelectFields = {
  id: true,
  name: true,
  slug: true,
  price: true,
  oldPrice: true,
  discount: true,
  image: true,
  rating: true,
  reviews: true,
  inStock: true,
  stock: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const;

export const productDetailFields = {
  ...productSelectFields,
  description: true,
  images: true,
  colors: true,
  sizes: true,
  specifications: true,
  featured: true,
  lowStockThreshold: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const categorySelectFields = {
  id: true,
  name: true,
  slug: true,
  description: true,
  image: true,
} as const;

export const orderSelectFields = {
  id: true,
  total: true,
  status: true,
  paymentType: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const orderDetailFields = {
  ...orderSelectFields,
  subtotal: true,
  discount: true,
  deliveryFee: true,
  paymentIntentId: true,
  paymentId: true,
  notes: true,
  customerNotes: true,
  courierService: true,
  estimatedDelivery: true,
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
        },
      },
    },
  },
  shippingAddress: true,
  statusHistory: {
    orderBy: { createdAt: 'desc' as const },
  },
} as const;

// Helper for pagination
export function getPaginationParams(page: number = 1, limit: number = 12) {
  const take = Math.min(Math.max(limit, 1), 100); // Cap at 100
  const skip = (Math.max(page, 1) - 1) * take;
  return { take, skip };
}


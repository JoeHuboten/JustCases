import { prisma } from '@/lib/prisma';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

// Force dynamic rendering - don't prerender at build time
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [products, orders, users, recentOrders] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.findMany(),
    prisma.user.findMany({ select: { id: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    price: p.price,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
    image: p.image,
  }));

  const serializedOrders = recentOrders.map((o) => ({
    id: o.id,
    total: o.total,
    status: o.status,
    userName: o.user.name || '',
    userEmail: o.user.email || '',
    createdAt: o.createdAt.toISOString(),
  }));

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue,
    pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
    outOfStock: outOfStockCount,
    lowStock: lowStockCount,
  };

  return (
    <AdminDashboardClient
      products={serializedProducts}
      recentOrders={serializedOrders}
      stats={stats}
    />
  );
}

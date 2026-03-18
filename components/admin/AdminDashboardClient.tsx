'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectDashboard, {
  type Project,
  type Message,
  type Stat,
  type SidebarLink,
} from '@/components/ui/project-management-dashboard';

type SerializedProduct = {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  createdAt: string;
  image: string;
};

type SerializedOrder = {
  id: string;
  total: number;
  status: string;
  userName: string;
  userEmail: string;
  createdAt: string;
};

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  outOfStock: number;
  lowStock: number;
};

type AdminDashboardClientProps = {
  products: SerializedProduct[];
  recentOrders: SerializedOrder[];
  stats: DashboardStats;
};

function getProductStatus(p: SerializedProduct): 'inProgress' | 'upcoming' | 'completed' | 'paused' {
  if (p.stock === 0) return 'paused';
  if (p.stock <= p.lowStockThreshold) return 'upcoming';
  if (p.featured) return 'completed';
  return 'inProgress';
}

function getAccentColor(status: string): string {
  switch (status) {
    case 'paused': return '#ef4444';
    case 'upcoming': return '#f59e0b';
    case 'completed': return '#10b981';
    default: return '#6366f1';
  }
}

function getBgClass(status: string): string {
  switch (status) {
    case 'paused': return 'bg-red-50 dark:bg-red-900/20';
    case 'upcoming': return 'bg-amber-50 dark:bg-amber-900/20';
    case 'completed': return 'bg-emerald-50 dark:bg-emerald-900/20';
    default: return 'bg-indigo-50 dark:bg-indigo-900/20';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminDashboardClient({
  products,
  recentOrders,
  stats,
}: AdminDashboardClientProps) {
  const router = useRouter();

  // Map products to Project format
  const projectData: Project[] = products.map((p) => {
    const status = getProductStatus(p);
    const stockPercent = Math.min(Math.round((p.stock / Math.max(p.lowStockThreshold * 4, 20)) * 100), 100);
    return {
      id: p.id,
      name: p.name,
      subtitle: p.categoryName,
      date: formatDate(p.createdAt),
      progress: stockPercent,
      status,
      accentColor: getAccentColor(status),
      bgColorClass: getBgClass(status),
      daysLeft: p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`,
      participants: [],
    };
  });

  // Map orders to Message format
  const messageData: Message[] = recentOrders.map((o) => ({
    id: o.id,
    name: o.userName || o.userEmail || 'Customer',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(o.userName || o.userEmail || 'C')}&backgroundColor=6366f1`,
    text: `Order #${o.id.slice(0, 8)} — $${o.total.toFixed(2)} — ${o.status}`,
    date: formatDate(o.createdAt),
    starred: o.status === 'PENDING',
  }));

  // Stats
  const dashboardStats: Stat[] = [
    { id: 'products', label: 'Products', value: stats.totalProducts },
    { id: 'orders', label: 'Orders', value: stats.totalOrders },
    { id: 'users', label: 'Users', value: stats.totalUsers },
    { id: 'revenue', label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}` },
  ];

  // Sidebar links
  const sidebarLinks: SidebarLink[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin', active: true },
    { id: 'products', label: 'Products', href: '/admin/products' },
    { id: 'orders', label: 'Orders', href: '/admin/orders' },
    { id: 'users', label: 'Users', href: '/admin/users' },
    { id: 'analytics', label: 'Analytics', href: '/admin/analytics' },
    { id: 'messages', label: 'Messages', href: '/admin/messages' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' },
  ];

  const [data, setData] = useState<Project[]>(projectData);

  return (
    <ProjectDashboard
      title="Admin Dashboard"
      user={{ name: 'Admin', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=6366f1' }}
      sidebarLinks={sidebarLinks}
      stats={dashboardStats}
      projects={data}
      messages={messageData}
      persistKey="admin-dashboard"
      defaultView="grid"
      searchPlaceholder="Search products..."
      emptyProjectsLabel="No products match your search."
      emptyMessagesLabel="No recent orders."
      allowCreate={false}
      showThemeToggle={true}
      defaultTheme="dark"
      pageSize={9}
      onProjectClick={(id) => {
        router.push(`/admin/products?search=${encodeURIComponent(data.find(p => p.id === id)?.name || '')}`);
      }}
      onProjectUpdate={(proj) => {
        setData((arr) => arr.map((p) => (p.id === proj.id ? proj : p)));
      }}
      onProjectsReorder={(ids) => {
        setData((arr) => {
          const map = new Map(arr.map((p) => [p.id, p]));
          return ids.map((id) => map.get(id)!).filter(Boolean);
        });
      }}
    />
  );
}

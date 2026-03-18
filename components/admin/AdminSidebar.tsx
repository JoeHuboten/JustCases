'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  MessageCircle,
  Tag,
  Ticket,
  Mail,
  X,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/messages', label: 'Messages', icon: MessageCircle },
  { href: '/admin/discount-codes', label: 'Discounts', icon: Ticket },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-900 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-slate-900 border-r border-slate-700
          transform transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-3">
            <svg viewBox="0 0 512 512" className="size-9 rounded-lg" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" rx="96" fill="#0d2d2a"/>
              <g transform="translate(256, 240)">
                <path d="M0,-120 L140,-50 L0,20 L-140,-50 Z" fill="#4eeadb"/>
                <path d="M-140,-50 L0,20 L0,160 L-140,90 Z" fill="#1a9e8f"/>
                <path d="M140,-50 L0,20 L0,160 L140,90 Z" fill="#2bc4b0"/>
              </g>
            </svg>
            <span className="text-lg font-semibold text-white">JustCases</span>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/admin' && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="size-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

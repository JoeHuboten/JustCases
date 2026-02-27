'use client';

import { useEffect, useState } from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiCreditCard, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { OrderListSkeleton } from '@/components/SkeletonLoaders';

interface Order {
  id: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  status: string;
  trackingNumber: string | null;
  courierService: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    color?: string;
    size?: string;
    product: {
      id: string;
      name: string;
      image: string;
      slug: string;
      category?: {
        id: string;
        name: string;
      };
    };
  }>;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FiPackage className="text-yellow-400" />;
      case 'PROCESSING':
        return <FiTruck className="text-blue-400" />;
      case 'SHIPPED':
        return <FiTruck className="text-purple-400" />;
      case 'DELIVERED':
        return <FiCheckCircle className="text-green-400" />;
      case 'CANCELLED':
        return <FiXCircle className="text-red-400" />;
      default:
        return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'PROCESSING':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/20';
      case 'SHIPPED':
        return 'text-purple-400 bg-purple-400/20';
      case 'DELIVERED':
        return 'text-green-400 bg-green-400/20';
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-9 w-40 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-700/50 rounded-lg animate-pulse" />
          </div>
          <OrderListSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <Link
            href="/shop"
            className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light transition"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="mx-auto h-24 w-24 text-text-secondary mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
            <p className="text-text-secondary mb-8">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                href={`/orders/${order.id}`}
                className="block bg-background-secondary rounded-lg p-6 hover:ring-2 hover:ring-accent/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      Placed on {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {(order.total ?? 0).toFixed(2)} €
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    <FiChevronRight className="text-gray-500" size={24} />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-lg"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-text-secondary">
                            <span>Qty: {item.quantity}</span>
                            {item.color && <span>• {item.color}</span>}
                            {item.size && <span>• {item.size}</span>}
                          </div>
                        </div>
                        <div className="text-white font-medium text-sm">
                          {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-text-secondary text-sm self-center">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-text-secondary">
                      <span>Subtotal: {(order.subtotal ?? 0).toFixed(2)} €</span>
                      <span>Delivery: {order.deliveryFee === 0 ? 'Free' : `${(order.deliveryFee ?? 0).toFixed(2)} €`}</span>
                    </div>
                    <span className="text-accent text-sm font-medium">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

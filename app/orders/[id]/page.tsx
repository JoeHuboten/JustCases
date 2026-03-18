'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiPackage, FiTruck, FiCheckCircle, FiXCircle, 
  FiArrowLeft, FiMapPin, FiPhone, FiMail, FiCopy, FiExternalLink 
} from 'react-icons/fi';
import { OrderDetailSkeleton } from '@/components/SkeletonLoaders';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderItem {
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
  };
}

interface StatusHistoryItem {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
}

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
  actualDelivery: string | null;
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  } | null;
  statusHistory?: StatusHistoryItem[];
}

const STATUS_CONFIG = {
  PENDING: { 
    label: 'Pending', 
    labelBg: 'В очакване',
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-400/10',
    icon: FiPackage,
    step: 1
  },
  PROCESSING: { 
    label: 'Processing', 
    labelBg: 'В обработка',
    color: 'text-teal-400', 
    bgColor: 'bg-teal-400/10',
    icon: FiPackage,
    step: 2
  },
  SHIPPED: { 
    label: 'Shipped', 
    labelBg: 'Изпратена',
    color: 'text-purple-400', 
    bgColor: 'bg-purple-400/10',
    icon: FiTruck,
    step: 3
  },
  DELIVERED: { 
    label: 'Delivered', 
    labelBg: 'Доставена',
    color: 'text-green-400', 
    bgColor: 'bg-green-400/10',
    icon: FiCheckCircle,
    step: 4
  },
  CANCELLED: { 
    label: 'Cancelled', 
    labelBg: 'Отменена',
    color: 'text-red-400', 
    bgColor: 'bg-red-400/10',
    icon: FiXCircle,
    step: -1
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('orderDetail.notFound');
          } else if (response.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            setError('orderDetail.loadFailed');
          }
          return;
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('orderDetail.loadFailed');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  const copyTrackingNumber = async () => {
    if (order?.trackingNumber) {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const getTrackingUrl = (courier: string | null, trackingNumber: string | null) => {
    if (!trackingNumber) return null;
    
    const courierUrls: Record<string, string> = {
      'Econt': `https://www.econt.com/services/track-shipment/${trackingNumber}`,
      'Speedy': `https://www.speedy.bg/bg/track-shipment?shipmentNumber=${trackingNumber}`,
      'DHL': `https://www.dhl.com/bg-en/home/tracking.html?tracking-id=${trackingNumber}`,
    };
    
    return courier ? courierUrls[courier] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-10">
        <div className="container-custom max-w-4xl">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-10">
        <div className="container-custom max-w-4xl text-center">
          <FiPackage className="mx-auto text-6xl text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t(error || 'orderDetail.notFound')}</h1>
          <p className="text-text-secondary mb-6">{t('orderDetail.notFoundDesc')}</p>
          <Link 
            href="/orders"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FiArrowLeft />
            {t('orderDetail.backToOrders')}
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusConfig.icon;
  const currentStep = statusConfig.step;
  const trackingUrl = getTrackingUrl(order.courierService, order.trackingNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-10">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/orders"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft />
          {t('orderDetail.backToOrders')}
        </Link>

        {/* Order Header */}
        <div className="bg-background-secondary rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {t('orderDetail.orderPrefix')}{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-text-secondary">
                {t('orderDetail.placedOn')} {new Date(order.createdAt).toLocaleDateString('bg-BG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor}`}>
              <StatusIcon className={statusConfig.color} />
              <span className={`font-medium ${statusConfig.color}`}>
                {t(`orderDetail.status.${order.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          {order.status !== 'CANCELLED' && (
            <div className="relative">
              <div className="flex justify-between">
                {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, index) => {
                  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                  const isActive = currentStep >= config.step;
                  const isCurrent = order.status === status;
                  const Icon = config.icon;
                  
                  return (
                    <div key={status} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-accent text-white' 
                          : 'bg-gray-700 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-accent/30' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {t(`orderDetail.status.${status.toLowerCase()}`)}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700 -z-0">
                <div 
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tracking Information */}
        {order.trackingNumber && (
          <div className="bg-background-secondary rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiTruck className="text-accent" />
              {t('orderDetail.trackingInfo')}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-text-secondary text-sm mb-1">{t('orderDetail.trackingNumber')}</p>
                <div className="flex items-center gap-2">
                  <code className="text-white font-mono bg-gray-800 px-3 py-2 rounded">
                    {order.trackingNumber}
                  </code>
                  <button
                    onClick={copyTrackingNumber}
                    className="p-2 hover:bg-gray-700 rounded transition-colors"
                    title="Copy tracking number"
                  >
                    <FiCopy className={copiedTracking ? 'text-green-400' : 'text-gray-400'} />
                  </button>
                </div>
              </div>
              
              {order.courierService && (
                <div>
                  <p className="text-text-secondary text-sm mb-1">{t('orderDetail.courier')}</p>
                  <p className="text-white font-medium">{order.courierService}</p>
                </div>
              )}
              
              {order.estimatedDelivery && (
                <div>
                  <p className="text-text-secondary text-sm mb-1">{t('orderDetail.estimatedDelivery')}</p>
                  <p className="text-white font-medium">
                    {new Date(order.estimatedDelivery).toLocaleDateString('bg-BG')}
                  </p>
                </div>
              )}
            </div>
            
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent hover:underline"
              >
                {t('orderDetail.trackOnCourier')} {order.courierService}
                <FiExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-background-secondary rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('orderDetail.orderItems')}</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-700 last:border-0">
                <Link href={`/product/${item.product.slug}`} className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="80px"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/product/${item.product.slug}`}
                    className="text-white font-medium hover:text-accent transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-text-secondary">
                    {item.color && <span>{t('orderDetail.color')} {item.color}</span>}
                    {item.size && <span>{t('orderDetail.size')} {item.size}</span>}
                    <span>{t('orderDetail.qty')} {item.quantity}</span>
                  </div>
                  
                  <p className="text-accent font-medium mt-2">
                    {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-background-secondary rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiMapPin className="text-accent" />
                {t('orderDetail.shippingAddress')}
              </h2>
              
              <div className="text-text-secondary space-y-1">
                <p className="text-white font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="flex items-center gap-2 mt-2">
                    <FiPhone size={14} />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-background-secondary rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t('orderDetail.orderSummary')}</h2>
            
            <div className="space-y-3 text-text-secondary">
              <div className="flex justify-between">
                <span>{t('orderDetail.subtotal')}</span>
                <span className="text-white">{(order.subtotal ?? 0).toFixed(2)} €</span>
              </div>
              
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>{t('orderDetail.discount')}</span>
                  <span>-{(order.discount ?? 0).toFixed(2)} €</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>{t('orderDetail.deliveryFee')}</span>
                <span className="text-white">
                  {(order.deliveryFee ?? 0) > 0 ? `${(order.deliveryFee ?? 0).toFixed(2)} €` : t('orderDetail.free')}
                </span>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-700 text-lg font-semibold">
                <span className="text-white">{t('orderDetail.total')}</span>
                <span className="text-accent">{(order.total ?? 0).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Notes */}
        {order.customerNotes && (
          <div className="bg-background-secondary rounded-2xl p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-2">{t('orderDetail.notes')}</h2>
            <p className="text-text-secondary">{order.customerNotes}</p>
          </div>
        )}

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-background-secondary rounded-2xl p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t('orderDetail.orderHistory')}</h2>
            
            <div className="space-y-4">
              {order.statusHistory.map((entry, index) => {
                const config = STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                return (
                  <div key={entry.id} className="flex gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${config.color.replace('text-', 'bg-')}`} />
                    <div className="flex-1">
                      <p className="text-white font-medium">{t(`orderDetail.status.${entry.status.toLowerCase()}`)}</p>
                      {entry.notes && <p className="text-text-secondary text-sm">{entry.notes}</p>}
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(entry.createdAt).toLocaleString('bg-BG')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

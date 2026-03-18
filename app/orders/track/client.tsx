'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
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

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
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
  discount: number;
  deliveryFee: number;
  status: string;
  paymentType: string;
  trackingNumber?: string;
  courierService?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: Address;
  statusHistory: StatusHistoryItem[];
}

const statusConfig: Record<string, { color: string; icon: any }> = {
  PENDING: {
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: FiClock,
  },
  PROCESSING: {
    color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    icon: FiPackage,
  },
  SHIPPED: {
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: FiTruck,
  },
  DELIVERED: {
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: FiCheckCircle,
  },
  CANCELLED: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: FiXCircle,
  },
};

export default function OrderTrackingPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}

function OrderTrackingContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const statusLabels: Record<string, string> = {
    PENDING: t('orderTrack.status.pending'),
    PROCESSING: t('orderTrack.status.processing'),
    SHIPPED: t('orderTrack.status.shipped'),
    DELIVERED: t('orderTrack.status.delivered'),
    CANCELLED: t('orderTrack.status.cancelled'),
  };

  const statusDescriptions: Record<string, string> = {
    PENDING: t('orderTrack.status.pendingDesc'),
    PROCESSING: t('orderTrack.status.processingDesc'),
    SHIPPED: t('orderTrack.status.shippedDesc'),
    DELIVERED: t('orderTrack.status.deliveredDesc'),
    CANCELLED: t('orderTrack.status.cancelledDesc'),
  };

  const orderId = searchParams.get('orderId');
  const trackingNumber = searchParams.get('trackingNumber');

  useEffect(() => {
    if (orderId || trackingNumber) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, trackingNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (orderId) params.append('orderId', orderId);
      if (trackingNumber) params.append('trackingNumber', trackingNumber);

      const response = await fetch(`/api/orders/track?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      window.location.href = `/orders/track?trackingNumber=${encodeURIComponent(trackingInput.trim())}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return `${(price ?? 0).toFixed(2)} €.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-text-secondary">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            {t('orderTrack.loading')}
          </div>
        </div>
      </div>
    );
  }

  if (!orderId && !trackingNumber) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FiPackage size={64} className="text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">{t('orderTrack.title')}</h1>
            <p className="text-text-secondary">{t('orderTrack.subtitle')}</p>
          </div>

          <form onSubmit={handleTrackingSubmit} className="max-w-md mx-auto">
            <div className="bg-primary/30 p-6 rounded-xl border border-gray-700">
              <label htmlFor="tracking" className="block text-sm font-medium text-text-secondary mb-2">
                {t('orderTrack.trackingNumber')}
              </label>
              <input
                type="text"
                id="tracking"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder={t('orderTrack.placeholder')}
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent mb-4"
              />
              <button
                type="submit"
                className="w-full btn-primary"
              >
                {t('orderTrack.trackButton')}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/orders" className="text-accent hover:underline">
              {t('orderTrack.viewAllOrders')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <FiXCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">{t('orderTrack.notFound')}</h2>
            <p className="text-text-secondary mb-4">{error}</p>
            <Link href="/orders/track" className="btn-primary inline-block">
              {t('orderTrack.tryAgain')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStatus = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;

  const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="text-accent hover:underline mb-4 inline-block">
            {t('orderTrack.backToOrders')}
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{t('orderTrack.orderTracking')}</h1>
          <p className="text-text-secondary">{t('orderTrack.orderPrefix')}{order.id.slice(0, 8)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full ${currentStatus.color} border flex items-center justify-center`}>
                  <StatusIcon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{statusLabels[order.status] || order.status}</h2>
                  <p className="text-text-secondary">{statusDescriptions[order.status] || ''}</p>
                </div>
              </div>

              {/* Progress Timeline */}
              {!isCancelled && (
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    {statusSteps.map((step, index) => {
                      const stepConfig = statusConfig[step];
                      const StepIcon = stepConfig.icon;
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;

                      return (
                        <div key={step} className="flex-1 relative">
                          <div className={`flex flex-col items-center ${index !== 0 ? '-ml-12' : ''}`}>
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                              isCompleted
                                ? 'bg-accent border-accent text-white'
                                : 'bg-background border-gray-700 text-gray-500'
                            } ${isCurrent ? 'ring-4 ring-accent/30' : ''}`}>
                              <StepIcon size={20} />
                            </div>
                            <span className={`text-xs text-center ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                              {statusLabels[step] || step}
                            </span>
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                              index < currentStepIndex ? 'bg-accent' : 'bg-gray-700'
                            }`} style={{ transform: 'translateY(-50%)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-secondary text-sm">{t('orderTrack.trackingNumber')}</label>
                      <p className="text-white font-mono">{order.trackingNumber}</p>
                    </div>
                    {order.courierService && (
                      <div>
                        <label className="text-text-secondary text-sm">{t('orderTrack.courierService')}</label>
                        <p className="text-white">{order.courierService}</p>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <label className="text-text-secondary text-sm">{t('orderTrack.estimatedDelivery')}</label>
                        <p className="text-white">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    )}
                    {order.actualDelivery && (
                      <div>
                        <label className="text-text-secondary text-sm">{t('orderTrack.deliveredOn')}</label>
                        <p className="text-green-400">{formatDate(order.actualDelivery)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status History */}
            <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{t('orderTrack.orderHistory')}</h3>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => {
                  const historyStatus = statusConfig[history.status] || statusConfig.PENDING;
                  const HistoryIcon = historyStatus.icon;
                  
                  return (
                    <div key={history.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full ${historyStatus.color} border flex items-center justify-center`}>
                          <HistoryIcon size={18} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium">{statusLabels[history.status] || history.status}</h4>
                          <span className="text-text-secondary text-sm">{formatDate(history.createdAt)}</span>
                        </div>
                        {history.notes && (
                          <p className="text-text-secondary text-sm">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{t('orderTrack.orderItems')}</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/product/${item.product.slug}`} className="text-white hover:text-accent transition-colors">
                        {item.product.name}
                      </Link>
                      <div className="text-text-secondary text-sm mt-1">
                        {item.color && <span>{t('orderTrack.color')} {item.color}</span>}
                        {item.color && item.size && <span className="mx-2">•</span>}
                        {item.size && <span>{t('orderTrack.size')} {item.size}</span>}
                      </div>
                      <div className="text-text-secondary text-sm">
                        {t('orderTrack.quantity')} {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="text-white font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">{t('orderTrack.orderSummary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>{t('orderTrack.subtotal')}</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>{t('orderTrack.discount')}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-secondary">
                  <span>{t('orderTrack.deliveryFee')}</span>
                  <span>{order.deliveryFee === 0 ? t('orderTrack.free') : formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>{t('orderTrack.total')}</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-text-secondary text-sm">
                <p>{t('orderTrack.paymentMethod')} {order.paymentType}</p>
                <p>{t('orderTrack.orderDate')} {formatDate(order.createdAt)}</p>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FiMapPin className="text-accent" />
                  {t('orderTrack.shippingAddress')}
                </h3>
                <div className="text-text-secondary space-y-1">
                  <p className="text-white">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
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

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-primary/30 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">{t('orderTrack.notes')}</h3>
                <p className="text-text-secondary">{order.customerNotes}</p>
              </div>
            )}

            {/* Support */}
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
              <h3 className="text-white font-bold mb-2">{t('orderTrack.needHelp')}</h3>
              <p className="text-text-secondary text-sm mb-4">{t('orderTrack.needHelpDesc')}</p>
              <div className="space-y-2">
                <a href="mailto:support@justcases.bg" className="flex items-center gap-2 text-accent hover:underline text-sm">
                  <FiMail size={16} />
                  support@justcases.bg
                </a>
                <a href="tel:+359888123456" className="flex items-center gap-2 text-accent hover:underline text-sm">
                  <FiPhone size={16} />
                  +359 888 123 456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

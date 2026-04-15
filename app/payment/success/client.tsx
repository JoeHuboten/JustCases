'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/client-api';
import { useCartStore } from '@/store/cartStore';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { clearCart } = useCartStore();
  const orderId = searchParams.get('orderId');
  const paypalToken = searchParams.get('token');
  const paypalPayerId = searchParams.get('PayerID');
  const paypalCheckoutSessionId = searchParams.get('checkoutSessionId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [captureError, setCaptureError] = useState('');

  useEffect(() => {
    // PayPal redirect flow: token + PayerID present means PayPal sent the user back
    if (paypalToken && paypalPayerId && paypalCheckoutSessionId && !orderId) {
      const capturePayPalOrder = async () => {
        try {
          const res = await apiFetch('/api/payment/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              checkoutSessionId: paypalCheckoutSessionId,
              providerPaymentId: paypalToken,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            if (data.stockErrors && Array.isArray(data.stockErrors)) {
              throw new Error(data.stockErrors.join('. '));
            }
            throw new Error(data.message || data.error || 'Payment capture failed');
          }
          clearCart();
          router.replace(`/payment/success?orderId=${data.orderId}`);
        } catch (err: any) {
          setCaptureError(err.message || 'Payment capture failed');
          setLoading(false);
        }
      };
      capturePayPalOrder();
      return;
    }

    if (!orderId) {
      router.push('/');
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, paypalToken, paypalPayerId, paypalCheckoutSessionId, router, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
          {paypalToken && !orderId && (
            <p className="text-white/60 text-sm">Finalizing your PayPal payment...</p>
          )}
        </div>
      </div>
    );
  }

  if (captureError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-primary border border-gray-800 rounded-xl p-8 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 rounded-full p-4">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Payment Failed</h1>
          <p className="text-gray-400 mb-6">{captureError}</p>
          <a href="/checkout" className="btn-primary inline-block">Try Again</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-primary border border-gray-800 rounded-xl p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/10 rounded-full p-4">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-3">
            {t('paymentSuccess.title')}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('paymentSuccess.subtitle')}
          </p>

          {/* Order Details */}
          {order && (
            <div className="bg-background border border-gray-800 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-lg font-semibold text-white">{t('paymentSuccess.orderDetails')}</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('paymentSuccess.orderId')}</span>
                  <span className="text-white font-mono text-sm">{orderId}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('paymentSuccess.trackingNumber')}</span>
                    <span className="text-white font-mono text-sm">{order.trackingNumber}</span>
                  </div>
                )}
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('paymentSuccess.paymentId')}</span>
                    <span className="text-white font-mono text-sm">{order.paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-800">
                  <span className="text-gray-400">{t('paymentSuccess.totalPaid')}</span>
                  <span className="text-white font-bold text-lg">{order.total != null ? `${order.total.toFixed(2)} €` : t('paymentSuccess.na')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Confirmation Message */}
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 mb-8">
            <p className="text-teal-400 text-sm">
              {t('paymentSuccess.emailSent')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="btn-primary flex items-center justify-center gap-2"
            >
              {t('paymentSuccess.viewOrders')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/shop"
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {t('paymentSuccess.continueShopping')}
            </Link>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mt-8 bg-primary border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('paymentSuccess.whatNext')}</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium">{t('paymentSuccess.step1')}</p>
                <p className="text-gray-400 text-sm">{t('paymentSuccess.step1Desc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium">{t('paymentSuccess.step2')}</p>
                <p className="text-gray-400 text-sm">{t('paymentSuccess.step2Desc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium">{t('paymentSuccess.step3')}</p>
                <p className="text-gray-400 text-sm">{t('paymentSuccess.step3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

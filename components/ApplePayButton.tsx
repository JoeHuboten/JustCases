'use client';

import { useState, useEffect } from 'react';
import { PaymentRequest } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe-client';
import { apiFetch } from '@/lib/client-api';

interface ApplePayButtonProps {
  amount: number;
  checkoutSessionId: string | null;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

function ApplePayButtonInner({ amount, checkoutSessionId, onSuccess, onError }: ApplePayButtonProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!stripe || !checkoutSessionId) return;

    const pr = stripe.paymentRequest({
      country: 'BG',
      currency: 'eur',
      total: {
        label: 'Just Cases - Поръчка',
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setCanMakePayment(true);
        setPaymentRequest(pr);
      }
    });

    pr.on('paymentmethod', async (event) => {
      setIsProcessing(true);
      try {
        const intentResponse = await apiFetch('/api/payment/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutSessionId }),
        });
        const intentData = await intentResponse.json();
        if (!intentResponse.ok) {
          event.complete('fail');
          onError(intentData.message || intentData.error || 'Failed to create payment intent');
          setIsProcessing(false);
          return;
        }

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          intentData.clientSecret,
          { payment_method: event.paymentMethod.id },
          { handleActions: false },
        );

        if (confirmError) {
          event.complete('fail');
          onError(confirmError.message || 'Payment failed');
          setIsProcessing(false);
          return;
        }

        event.complete('success');

        if (paymentIntent?.status === 'requires_action') {
          const { error: actionError } = await stripe.confirmCardPayment(intentData.clientSecret);
          if (actionError) {
            onError(actionError.message || 'Authentication failed');
            setIsProcessing(false);
            return;
          }
        }

        const providerPaymentId = paymentIntent?.id || intentData.paymentIntentId;
        const captureResponse = await apiFetch('/api/payment/stripe/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkoutSessionId,
            providerPaymentId,
          }),
        });
        const captureData = await captureResponse.json();
        if (!captureResponse.ok) {
          onError(captureData.message || captureData.error || 'Failed to finalize order');
          setIsProcessing(false);
          return;
        }

        onSuccess(captureData.orderId);
      } catch (err: any) {
        event.complete('fail');
        onError(err?.message || 'Unknown payment error');
        setIsProcessing(false);
      }
    });
  }, [stripe, amount, checkoutSessionId, onSuccess, onError]);

  if (!canMakePayment || !paymentRequest || !checkoutSessionId) return null;

  return (
    <div className="w-full">
      {isProcessing ? (
        <div className="w-full py-3 bg-black rounded-lg flex items-center justify-center gap-2">
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          <span className="text-white font-medium">Обработка...</span>
        </div>
      ) : (
        <PaymentRequestButtonElement
          options={{
            paymentRequest,
            style: {
              paymentRequestButton: {
                type: 'buy',
                theme: 'dark',
                height: '48px',
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default function ApplePayButton(props: ApplePayButtonProps) {
  const [stripeConfigured, setStripeConfigured] = useState(true);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      setStripeConfigured(false);
      setStripePromise(null);
      return;
    }
    const s = getStripe();
    if (!s) {
      setStripeConfigured(false);
      setStripePromise(null);
    } else {
      setStripePromise(s);
    }
  }, []);

  if (!stripeConfigured || !stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <ApplePayButtonInner {...props} />
    </Elements>
  );
}

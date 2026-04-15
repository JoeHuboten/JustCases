'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiTruck, FiShield, FiCheckCircle, FiCreditCard, FiPackage } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { apiFetch } from '@/lib/client-api';

// Dynamically import payment components to avoid SSR issues
const ApplePayButton = dynamic(() => import('@/components/ApplePayButton'), { 
  ssr: false,
  loading: () => null,
});

const StripeCardPayment = dynamic(() => import('@/components/StripeCardPayment'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-white/[0.03] rounded-lg h-32" />
  ),
});

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

// InputField component defined outside to prevent re-creation on every render
const InputField = ({ 
  icon: Icon, 
  label, 
  name, 
  type = 'text', 
  placeholder,
  required = true,
  error: fieldError,
  value,
  onChange,
  onClearError
}: { 
  icon: any; 
  label: string; 
  name: string; 
  type?: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-white/70 mb-2 font-body">
      <span className="flex items-center gap-2">
        <Icon size={16} className="text-teal-400" />
        {label} {required && <span className="text-red-400">*</span>}
      </span>
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        if (fieldError && onClearError) onClearError();
      }}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-white/[0.03] border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all font-body ${
        fieldError 
          ? 'border-red-500 focus:ring-red-500/50' 
          : 'border-white/10 focus:ring-teal-500/50 focus:border-teal-500'
      }`}
    />
    {fieldError && <p className="text-red-400 text-sm mt-1 font-body">{fieldError}</p>}
  </div>
);

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getTotal, discountCode, clearCart } = useCartStore();
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isValidating, setIsValidating] = useState(false);
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const isPayPalEnabled = Boolean(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'your_paypal_client_id');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'България',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(false);
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState('');
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [checkoutTotals, setCheckoutTotals] = useState<{ subtotal: number; discount: number; total: number } | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<'SPEEDY' | 'ECONT' | ''>('');
  const [courierError, setCourierError] = useState('');
  const [isPlacingCod, setIsPlacingCod] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
    if (items.length === 0 && !paymentComplete) router.push('/cart');
  }, [authLoading, user, items, paymentComplete, router]);

  useEffect(() => {
    if (user?.email && !shippingAddress.email) {
      setShippingAddress(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!user) return;

      setLoadingSavedAddresses(true);
      try {
        const res = await apiFetch('/api/addresses');
        if (!res.ok) return;

        const data: SavedAddress[] = await res.json();
        setSavedAddresses(data);

        if (data.length > 0) {
          const defaultAddress = data.find(address => address.isDefault) || data[0];
          if (!defaultAddress) return;

          setSelectedSavedAddressId(defaultAddress.id);

          setShippingAddress(prev => {
            const isShippingFormEmpty = !prev.firstName && !prev.lastName && !prev.address && !prev.city && !prev.postalCode;
            if (!isShippingFormEmpty) return prev;

            return {
              ...prev,
              firstName: defaultAddress.firstName || '',
              lastName: defaultAddress.lastName || '',
              phone: defaultAddress.phone || '',
              address: [defaultAddress.address1, defaultAddress.address2].filter(Boolean).join(', '),
              city: defaultAddress.city || '',
              postalCode: defaultAddress.postalCode || '',
              country: defaultAddress.country || 'България',
            };
          });
        }
      } catch {
        setSavedAddresses([]);
      } finally {
        setLoadingSavedAddresses(false);
      }
    };

    fetchSavedAddresses();
  }, [user]);

  const handleSelectSavedAddress = (addressId: string) => {
    setSelectedSavedAddressId(addressId);

    const selectedAddress = savedAddresses.find(address => address.id === addressId);
    if (!selectedAddress) return;

    setShippingAddress(prev => ({
      ...prev,
      firstName: selectedAddress.firstName || '',
      lastName: selectedAddress.lastName || '',
      phone: selectedAddress.phone || '',
      address: [selectedAddress.address1, selectedAddress.address2].filter(Boolean).join(', '),
      city: selectedAddress.city || '',
      postalCode: selectedAddress.postalCode || '',
      country: selectedAddress.country || 'България',
    }));

    setErrors({});
    setError('');
  };

  const validateShippingForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.firstName.trim() || shippingAddress.firstName.length < 2) {
      newErrors.firstName = t('checkout.validation.firstNameMin');
    }
    if (!shippingAddress.lastName.trim() || shippingAddress.lastName.length < 2) {
      newErrors.lastName = t('checkout.validation.lastNameMin');
    }
    if (!shippingAddress.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = t('checkout.validation.invalidEmail');
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 6) {
      newErrors.phone = t('checkout.validation.phoneTooShort');
    }
    if (!shippingAddress.address.trim() || shippingAddress.address.length < 5) {
      newErrors.address = t('checkout.validation.addressMin');
    }
    if (!shippingAddress.city.trim() || shippingAddress.city.length < 2) {
      newErrors.city = t('checkout.validation.cityMin');
    }
    if (!shippingAddress.postalCode.trim() || shippingAddress.postalCode.length < 4) {
      newErrors.postalCode = t('checkout.validation.postalCodeMin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = async () => {
    setIsValidating(true);
    if (!validateShippingForm()) {
      setIsValidating(false);
      return;
    }
    if (!selectedCourier) {
      setCourierError(t('checkout.validation.courierRequired'));
      setIsValidating(false);
      return;
    }
    setCourierError('');

    try {
      const res = await apiFetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          })),
          discountCode: discountCode?.code || null,
          shippingAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('checkout.error.createOrder'));
      }

      setCheckoutSessionId(data.checkoutSessionId);
      setCheckoutTotals({
        subtotal: Number(data.subtotal || 0),
        discount: Number(data.discount || 0),
        total: Number(data.total || 0),
      });
      setStep('payment');
      setError('');
    } catch (err: any) {
      setError(err.message || t('checkout.error.createOrder'));
    }

    setIsValidating(false);
  };

  const handlePayPalRedirect = async () => {
    if (!checkoutSessionId) {
      setError('Checkout session is missing. Please go back and try again.');
      return;
    }
    setIsPayPalLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutSessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.stockErrors && Array.isArray(data.stockErrors)) {
          throw new Error(data.stockErrors.join('. '));
        }
        throw new Error(data.message || data.error || t('checkout.error.createOrder'));
      }
      if (!data.approveUrl) {
        throw new Error('Could not get PayPal checkout URL.');
      }
      window.location.href = data.approveUrl;
    } catch (err: any) {
      setError(err.message || t('checkout.error.unknown'));
      setIsPayPalLoading(false);
    }
  };

  const handleCodOrder = async () => {
    if (!checkoutSessionId) {
      setError('Checkout session is missing. Please go back and try again.');
      return;
    }
    if (!selectedCourier) {
      setError(t('checkout.validation.courierRequired'));
      return;
    }
    setIsPlacingCod(true);
    try {
      const res = await apiFetch('/api/payment/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutSessionId, courierService: selectedCourier }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || t('checkout.error.createOrder'));
      }
      setPaymentComplete(true);
      clearCart();
      router.push(`/payment/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError(err.message || t('checkout.error.unknown'));
    } finally {
      setIsPlacingCod(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const checkoutContent = (
      <div className="min-h-screen bg-[#0a0a0f] py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Email Verification Warning - TEMP: disabled */}

          {/* Header with Steps */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4 sm:mb-6">{t('checkout.pageTitle')}</h1>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step === 'shipping' ? 'text-teal-400' : 'text-green-400'}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'shipping' ? 'bg-teal-500' : 'bg-green-500'
                }`}>
                  {step === 'payment' ? <FiCheckCircle size={16} /> : '1'}
                </div>
                <span className="font-medium text-sm sm:text-base font-body">{t('checkout.step.shipping')}</span>
              </div>
              
              <div className={`flex-1 h-0.5 sm:h-1 ${step === 'payment' ? 'bg-green-500' : 'bg-white/10'}`} />
              
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step === 'payment' ? 'text-teal-400' : 'text-white/40'}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'payment' ? 'bg-teal-500' : 'bg-white/10'
                }`}>
                  2
                </div>
                <span className="font-medium text-sm sm:text-base font-body">{t('checkout.step.payment')}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {step === 'shipping' ? (
                /* Shipping Form */
                <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                    <FiTruck className="text-teal-400" size={20} />
                    {t('checkout.shippingAddress')}
                  </h2>

                  {user && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                      <label className="block text-sm font-medium text-white/70 mb-2 font-body">
                        {t('checkout.savedAddress')}
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {loadingSavedAddresses ? (
                          <div className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white/40 font-body animate-pulse">
                            Зареждане...
                          </div>
                        ) : savedAddresses.length === 0 ? (
                          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg">
                            <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-white/40 text-sm font-body">{t('checkout.noSavedAddresses')}</span>
                          </div>
                        ) : (
                          <select
                            value={selectedSavedAddressId}
                            onChange={(e) => handleSelectSavedAddress(e.target.value)}
                            className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-body"
                          >
                            <option value="">{t('checkout.selectSaved')}</option>
                            {savedAddresses.map((address) => (
                              <option key={address.id} value={address.id}>
                                {address.firstName} {address.lastName} - {address.address1}, {address.city}
                              </option>
                            ))}
                          </select>
                        )}

                        <button
                          type="button"
                          onClick={() => router.push('/account')}
                          className="px-4 py-3 border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors font-body"
                        >
                          {t('checkout.manage')}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      icon={FiUser}
                      label={t('checkout.form.firstName')}
                      name="firstName"
                      placeholder={t('checkout.form.firstNamePlaceholder')}
                      error={errors.firstName}
                      value={shippingAddress.firstName}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, firstName: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, firstName: undefined }))}
                    />
                    <InputField
                      icon={FiUser}
                      label={t('checkout.form.lastName')}
                      name="lastName"
                      placeholder={t('checkout.form.lastNamePlaceholder')}
                      error={errors.lastName}
                      value={shippingAddress.lastName}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, lastName: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, lastName: undefined }))}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <InputField
                      icon={FiMail}
                      label={t('checkout.form.email')}
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      error={errors.email}
                      value={shippingAddress.email}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, email: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, email: undefined }))}
                    />
                    <InputField
                      icon={FiPhone}
                      label={t('checkout.form.phone')}
                      name="phone"
                      type="tel"
                      placeholder="+359 888 123 456"
                      error={errors.phone}
                      value={shippingAddress.phone}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, phone: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, phone: undefined }))}
                    />
                  </div>

                  <div className="mt-4">
                    <InputField
                      icon={FiMapPin}
                      label={t('checkout.form.address')}
                      name="address"
                      placeholder={t('checkout.form.addressPlaceholder')}
                      error={errors.address}
                      value={shippingAddress.address}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, address: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, address: undefined }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <InputField
                      icon={FiMapPin}
                      label={t('checkout.form.city')}
                      name="city"
                      placeholder={t('checkout.form.cityPlaceholder')}
                      error={errors.city}
                      value={shippingAddress.city}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, city: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, city: undefined }))}
                    />
                    <InputField
                      icon={FiMapPin}
                      label={t('checkout.form.postalCode')}
                      name="postalCode"
                      placeholder="1000"
                      error={errors.postalCode}
                      value={shippingAddress.postalCode}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, postalCode: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, postalCode: undefined }))}
                    />
                    <InputField
                      icon={FiMapPin}
                      label={t('checkout.form.country')}
                      name="country"
                      placeholder={t('checkout.form.countryPlaceholder')}
                      error={errors.country}
                      value={shippingAddress.country}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, country: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, country: undefined }))}
                    />
                  </div>

                  {/* Courier selection */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white/70 mb-2 font-body">
                      <span className="flex items-center gap-2">
                        <FiTruck size={16} className="text-teal-400" />
                        {t('checkout.courier')} <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['SPEEDY', 'ECONT'] as const).map((courier) => (
                        <button
                          key={courier}
                          type="button"
                          onClick={() => { setSelectedCourier(courier); setCourierError(''); }}
                          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg font-body transition-all ${
                            selectedCourier === courier
                              ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                              : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <FiPackage size={16} />
                          {courier === 'SPEEDY' ? t('checkout.courierSpeedy') : t('checkout.courierEcont')}
                        </button>
                      ))}
                    </div>
                    {courierError && <p className="text-red-400 text-sm mt-1 font-body">{courierError}</p>}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white/70 mb-2 font-body">
                      <span className="flex items-center gap-2">
                        <FiFileText size={16} className="text-teal-400" />
                        {t('checkout.notes')}
                      </span>
                    </label>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={t('checkout.notesPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none font-body"
                    />
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isValidating}
                    className="w-full mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 font-body"
                  >
                    {isValidating ? t('checkout.validating') : t('checkout.continueToPayment')}
                  </button>
                </div>
              ) : (
                /* Payment Step */
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                        <FiTruck className="text-teal-400" />
                        {t('checkout.shippingAddress')}
                      </h2>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-teal-400 hover:text-teal-300 text-sm font-body"
                      >
                        {t('checkout.change')}
                      </button>
                    </div>
                    <div className="text-white/60 text-sm space-y-1 font-body">
                      <p className="font-medium text-white">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>{shippingAddress.address}</p>
                      <p>{shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.email}</p>
                      {selectedCourier && (
                        <p className="flex items-center gap-1 text-teal-400 mt-1">
                          <FiPackage size={13} />
                          {selectedCourier === 'SPEEDY' ? t('checkout.courierSpeedy') : t('checkout.courierEcont')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                      <FiShield className="text-teal-400" />
                      {t('checkout.paymentMethodTitle')}
                    </h2>
                    
                    {/* Apple Pay / Google Pay (only shows on supported devices) */}
                    <div className="mb-4">
                      <ApplePayButton
                        amount={checkoutTotals?.total ?? getTotal()}
                        checkoutSessionId={checkoutSessionId}
                        onSuccess={(orderId) => {
                          setPaymentComplete(true);
                          clearCart();
                          router.push(`/payment/success?orderId=${orderId}`);
                        }}
                        onError={(err) => setError(err)}
                      />
                    </div>

                    {/* Stripe Card Payment */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <FiCreditCard className="text-teal-400" size={20} />
                        <span className="text-white font-medium">{t('checkout.cardPayment')}</span>
                      </div>
                      <StripeCardPayment
                        amount={checkoutTotals?.total ?? getTotal()}
                        checkoutSessionId={checkoutSessionId}
                        onSuccess={(orderId) => {
                          setPaymentComplete(true);
                          clearCart();
                          router.push(`/payment/success?orderId=${orderId}`);
                        }}
                        onError={(err) => setError(err)}
                      />
                    </div>

                    {isPayPalEnabled ? (
                      <>
                        {/* Divider */}
                        <div className="relative my-8">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#0a0a0f] text-white/40 font-body tracking-wide uppercase text-xs">{t('checkout.orPayWithPaypal')}</span>
                          </div>
                        </div>

                        <button
                          onClick={handlePayPalRedirect}
                          disabled={isPayPalLoading}
                          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold font-body text-sm transition-all bg-[#FFC439] hover:bg-[#f0b429] disabled:opacity-60 disabled:cursor-not-allowed text-[#003087]"
                        >
                          {isPayPalLoading ? (
                            <>
                              <span className="inline-block w-4 h-4 border-2 border-[#003087]/40 border-t-[#003087] rounded-full animate-spin" />
                              <span>Connecting to PayPal...</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-[#003087] text-base tracking-tight">Pay<span className="text-[#009cde]">Pal</span></span>
                              <span>Pay with PayPal</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : null}

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#0a0a0f] text-white/40 font-body">{t('checkout.orCashOnDelivery')}</span>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <FiPackage className="text-amber-400" size={22} />
                        <div>
                          <p className="text-white font-medium font-body">{t('checkout.codTitle')}</p>
                          <p className="text-white/50 text-sm font-body">{t('checkout.codDescPrefix')}{selectedCourier === 'SPEEDY' ? t('checkout.courierSpeedy') : t('checkout.courierEcont')}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCodOrder}
                        disabled={isPlacingCod}
                        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors font-body flex items-center justify-center gap-2"
                      >
                        <FiPackage size={18} />
                        {isPlacingCod ? t('checkout.placingOrder') : t('checkout.placeCodOrder')}
                      </button>
                    </div>

                    <button 
                      onClick={() => setStep('shipping')}
                      className="w-full mt-4 border border-white/10 text-white/60 hover:text-white hover:border-white/20 py-3 rounded-xl transition-colors font-body"
                    >
                      {t('checkout.backToAddress')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-heading font-bold text-white mb-6">{t('checkout.summary')}</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          className="object-cover rounded-lg" 
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 rounded-full text-xs flex items-center justify-center text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate font-body">{item.name}</p>
                        {item.color && <p className="text-white/40 text-xs font-body">{t('checkout.colorLabel')} {item.color}</p>}
                        {item.size && <p className="text-white/40 text-xs font-body">{t('checkout.sizeLabel')} {item.size}</p>}
                      </div>
                      <p className="text-white font-bold text-sm font-body">
                        {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between text-white/50 font-body">
                    <span>{t('checkout.subtotalLabel')}</span>
                    <span>{(checkoutTotals?.subtotal ?? getSubtotal() ?? 0).toFixed(2)} €</span>
                  </div>
                  
                  {discountCode && (
                    <div className="flex justify-between text-green-400 font-body">
                      <span>{t('checkout.discountLabel')} ({discountCode.percentage}%)</span>
                      <span>-{(checkoutTotals?.discount ?? getDiscount() ?? 0).toFixed(2)} €</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-white/50 font-body">
                    <span>{t('checkout.shippingLabel')}</span>
                    <span className="text-green-400">{t('checkout.freeShipping')}</span>
                  </div>
                  
                  <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/10">
                    <span className="font-heading">{t('checkout.totalLabel')}</span>
                    <span className="text-teal-400 font-heading">{(checkoutTotals?.total ?? getTotal() ?? 0).toFixed(2)} €</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-white/50 text-sm font-body">
                  <FiShield className="text-green-400" />
                  <span>{t('checkout.sslNote')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  return checkoutContent;
}

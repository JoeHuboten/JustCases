'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Image from 'next/image';
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiTruck, FiShield, FiCheckCircle, FiCreditCard } from 'react-icons/fi';
import dynamic from 'next/dynamic';

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
        <Icon size={16} className="text-blue-400" />
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
          : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
      }`}
    />
    {fieldError && <p className="text-red-400 text-sm mt-1 font-body">{fieldError}</p>}
  </div>
);

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getTotal, discountCode, clearCart } = useCartStore();
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isValidating, setIsValidating] = useState(false);
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

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
        const res = await fetch('/api/addresses');
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
      newErrors.firstName = 'Името трябва да е поне 2 символа';
    }
    if (!shippingAddress.lastName.trim() || shippingAddress.lastName.length < 2) {
      newErrors.lastName = 'Фамилията трябва да е поне 2 символа';
    }
    if (!shippingAddress.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      newErrors.email = 'Въведете валиден имейл адрес';
    }
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 6) {
      newErrors.phone = 'Въведете валиден телефонен номер';
    }
    if (!shippingAddress.address.trim() || shippingAddress.address.length < 5) {
      newErrors.address = 'Адресът трябва да е поне 5 символа';
    }
    if (!shippingAddress.city.trim() || shippingAddress.city.length < 2) {
      newErrors.city = 'Въведете валиден град';
    }
    if (!shippingAddress.postalCode.trim() || shippingAddress.postalCode.length < 4) {
      newErrors.postalCode = 'Въведете валиден пощенски код';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    setIsValidating(true);
    if (validateShippingForm()) {
      setStep('payment');
      setError('');
    }
    setIsValidating(false);
  };

  const createOrder = async () => {
    const res = await fetch('/api/payment/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        items, 
        discountCode: discountCode?.code,
        shippingAddress 
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      // Handle stock errors
      if (data.stockErrors && Array.isArray(data.stockErrors)) {
        throw new Error(data.stockErrors.join('. '));
      }
      throw new Error(data.message || data.error || 'Грешка при създаване на поръчка');
    }
    return data.orderId;
  };

  const onApprove = async (data: any) => {
    try {
      const res = await fetch('/api/payment/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: data.orderID, 
          items, 
          discountCode: discountCode?.code,
          shippingAddress 
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        // Handle stock errors
        if (result.stockErrors && Array.isArray(result.stockErrors)) {
          throw new Error(result.stockErrors.join('. '));
        }
        throw new Error(result.message || result.error || 'Плащането не е успешно');
      }
      setPaymentComplete(true);
      clearCart();
      router.push(`/payment/success?orderId=${result.orderId}`);
    } catch (err: any) {
      setError('Плащането не е успешно: ' + (err.message || 'Неизвестна грешка'));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'your_paypal_client_id') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f]">
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">PayPal не е конфигуриран</h2>
          <p className="text-white/50 mb-6 font-body">Моля, конфигурирайте PayPal в .env файла</p>
          <button onClick={() => router.push('/cart')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-body">
            Обратно към кошницата
          </button>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div className="min-h-screen bg-[#0a0a0f] py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Email Verification Warning */}
          {user && !user.emailVerified && (
            <div className="mb-4 sm:mb-6 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <FiMail className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
                <div>
                  <p className="text-yellow-500 font-medium mb-1 text-sm sm:text-base font-body">Email Not Verified</p>
                  <p className="text-yellow-400 text-xs sm:text-sm font-body">
                    Please verify your email address to complete your purchase. Check your inbox for the verification link.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header with Steps */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4 sm:mb-6">Плащане</h1>
            
            {/* Progress Steps */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step === 'shipping' ? 'text-blue-400' : 'text-green-400'}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'shipping' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {step === 'payment' ? <FiCheckCircle size={16} /> : '1'}
                </div>
                <span className="font-medium text-sm sm:text-base font-body">Доставка</span>
              </div>
              
              <div className={`flex-1 h-0.5 sm:h-1 ${step === 'payment' ? 'bg-green-500' : 'bg-white/10'}`} />
              
              <div className={`flex items-center gap-1.5 sm:gap-2 ${step === 'payment' ? 'text-blue-400' : 'text-white/40'}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 'payment' ? 'bg-blue-500' : 'bg-white/10'
                }`}>
                  2
                </div>
                <span className="font-medium text-sm sm:text-base font-body">Плащане</span>
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
                    <FiTruck className="text-blue-400" size={20} />
                    Адрес за доставка
                  </h2>

                  {user && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                      <label className="block text-sm font-medium text-white/70 mb-2 font-body">
                        Запазен адрес
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <select
                          value={selectedSavedAddressId}
                          onChange={(e) => handleSelectSavedAddress(e.target.value)}
                          disabled={loadingSavedAddresses || savedAddresses.length === 0}
                          className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-body disabled:opacity-60"
                        >
                          {savedAddresses.length === 0 ? (
                            <option value="">Няма запазени адреси</option>
                          ) : (
                            <>
                              <option value="">Изберете запазен адрес</option>
                              {savedAddresses.map((address) => (
                                <option key={address.id} value={address.id}>
                                  {address.firstName} {address.lastName} - {address.address1}, {address.city}
                                </option>
                              ))}
                            </>
                          )}
                        </select>

                        <button
                          type="button"
                          onClick={() => router.push('/account')}
                          className="px-4 py-3 border border-white/10 rounded-lg text-white/70 hover:text-white hover:border-white/30 transition-colors font-body"
                        >
                          Управление
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      icon={FiUser}
                      label="Име"
                      name="firstName"
                      placeholder="Въведете името си"
                      error={errors.firstName}
                      value={shippingAddress.firstName}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, firstName: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, firstName: undefined }))}
                    />
                    <InputField
                      icon={FiUser}
                      label="Фамилия"
                      name="lastName"
                      placeholder="Въведете фамилията си"
                      error={errors.lastName}
                      value={shippingAddress.lastName}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, lastName: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, lastName: undefined }))}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <InputField
                      icon={FiMail}
                      label="Имейл"
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
                      label="Телефон"
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
                      label="Адрес"
                      name="address"
                      placeholder="ул. Примерна 123, бл. 1, ап. 1"
                      error={errors.address}
                      value={shippingAddress.address}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, address: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, address: undefined }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <InputField
                      icon={FiMapPin}
                      label="Град"
                      name="city"
                      placeholder="София"
                      error={errors.city}
                      value={shippingAddress.city}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, city: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, city: undefined }))}
                    />
                    <InputField
                      icon={FiMapPin}
                      label="Пощенски код"
                      name="postalCode"
                      placeholder="1000"
                      error={errors.postalCode}
                      value={shippingAddress.postalCode}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, postalCode: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, postalCode: undefined }))}
                    />
                    <InputField
                      icon={FiMapPin}
                      label="Държава"
                      name="country"
                      placeholder="България"
                      error={errors.country}
                      value={shippingAddress.country}
                      onChange={(value) => setShippingAddress(prev => ({ ...prev, country: value }))}
                      onClearError={() => setErrors(prev => ({ ...prev, country: undefined }))}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white/70 mb-2 font-body">
                      <span className="flex items-center gap-2">
                        <FiFileText size={16} className="text-blue-400" />
                        Бележки към поръчката (по избор)
                      </span>
                    </label>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Допълнителни инструкции за доставка..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none font-body"
                    />
                  </div>

                  <button
                    onClick={handleContinueToPayment}
                    disabled={isValidating}
                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 font-body"
                  >
                    {isValidating ? 'Валидиране...' : 'Продължи към плащане'}
                  </button>
                </div>
              ) : (
                /* Payment Step */
                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                        <FiTruck className="text-blue-400" />
                        Адрес за доставка
                      </h2>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-blue-400 hover:text-blue-300 text-sm font-body"
                      >
                        Промени
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
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                      <FiShield className="text-blue-400" />
                      Метод на плащане
                    </h2>
                    
                    {/* Apple Pay / Google Pay (only shows on supported devices) */}
                    <div className="mb-4">
                      <ApplePayButton
                        amount={getTotal()}
                        items={items.map(item => ({
                          ...item,
                          productId: item.id,
                        }))}
                        shippingAddress={shippingAddress}
                        discountCode={discountCode?.code}
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
                        <FiCreditCard className="text-blue-400" size={20} />
                        <span className="text-white font-medium">Плащане с карта</span>
                      </div>
                      <StripeCardPayment
                        amount={getTotal()}
                        items={items.map(item => ({
                          ...item,
                          productId: item.id,
                        }))}
                        shippingAddress={shippingAddress}
                        discountCode={discountCode?.code}
                        onSuccess={(orderId) => {
                          setPaymentComplete(true);
                          clearCart();
                          router.push(`/payment/success?orderId=${orderId}`);
                        }}
                        onError={(err) => setError(err)}
                      />
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#0a0a0f] text-white/40 font-body">или платете с PayPal</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.03] p-4 rounded-lg mb-4">
                      <p className="text-white/50 text-sm mb-4 font-body">
                        Плащането се обработва сигурно чрез PayPal. Можете да платите с PayPal акаунт или директно с карта.
                      </p>
                    </div>

                    <PayPalButtons 
                      createOrder={createOrder} 
                      onApprove={onApprove} 
                      onError={(err) => setError('PayPal грешка: ' + err)}
                      style={{ layout: 'vertical', shape: 'rect' }}
                    />

                    <button 
                      onClick={() => setStep('shipping')}
                      className="w-full mt-4 border border-white/10 text-white/60 hover:text-white hover:border-white/20 py-3 rounded-xl transition-colors font-body"
                    >
                      ← Обратно към адреса
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-heading font-bold text-white mb-6">Обобщение на поръчката</h2>
                
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
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate font-body">{item.name}</p>
                        {item.color && <p className="text-white/40 text-xs font-body">Цвят: {item.color}</p>}
                        {item.size && <p className="text-white/40 text-xs font-body">Размер: {item.size}</p>}
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
                    <span>Междинна сума</span>
                    <span>{(getSubtotal() ?? 0).toFixed(2)} €</span>
                  </div>
                  
                  {discountCode && (
                    <div className="flex justify-between text-green-400 font-body">
                      <span>Отстъпка ({discountCode.percentage}%)</span>
                      <span>-{(getDiscount() ?? 0).toFixed(2)} €</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-white/50 font-body">
                    <span>Доставка</span>
                    <span className="text-green-400">Безплатна</span>
                  </div>
                  
                  <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/10">
                    <span className="font-heading">Общо</span>
                    <span className="text-blue-400 font-heading">{(getTotal() ?? 0).toFixed(2)} €</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center gap-2 text-white/50 text-sm font-body">
                  <FiShield className="text-green-400" />
                  <span>Сигурно плащане с SSL криптиране</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

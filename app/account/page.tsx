'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FiUser, FiShield, FiLogOut, FiPackage, FiHeart, FiSettings, FiLock, FiMapPin, FiCreditCard, FiPlus, FiTrash2, FiEdit2, FiStar, FiX, FiCheck } from 'react-icons/fi';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  cardBrand?: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('details');

  // State for addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [addressError, setAddressError] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    holderName: '',
    cvv: ''
  });
  const [paymentError, setPaymentError] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  // State for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/auth/signin');
    }
  }, [user, loading, router, mounted]);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  // Fetch payment methods
  const fetchPaymentMethods = useCallback(async () => {
    try {
      const res = await fetch('/api/payment-methods');
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    if (user && mounted) {
      fetchAddresses();
      fetchPaymentMethods();
    }
  }, [user, mounted, fetchAddresses, fetchPaymentMethods]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    router.push('/');
  };

  // Address handlers
  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: ''
    });
    setAddressError('');
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || ''
    });
    setAddressError('');
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    setAddressError('');

    try {
      const url = editingAddress 
        ? `/api/addresses/${editingAddress.id}` 
        : '/api/addresses';
      const method = editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save address');
      }

      await fetchAddresses();
      setShowAddressModal(false);
    } catch (error) {
      setAddressError(error instanceof Error ? error.message : 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  // Payment method handlers
  const handleAddPayment = () => {
    setPaymentForm({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      holderName: '',
      cvv: ''
    });
    setPaymentError('');
    setShowPaymentModal(true);
  };

  const handleSavePayment = async () => {
    setSavingPayment(true);
    setPaymentError('');

    if (paymentForm.cardNumber.replace(/\s/g, '').length < 13) {
      setPaymentError('Please enter a valid card number');
      setSavingPayment(false);
      return;
    }

    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CARD',
          cardNumber: paymentForm.cardNumber.replace(/\s/g, ''),
          expiryMonth: parseInt(paymentForm.expiryMonth),
          expiryYear: parseInt(paymentForm.expiryYear),
          holderName: paymentForm.holderName
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save payment method');
      }

      await fetchPaymentMethods();
      setShowPaymentModal(false);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Failed to save payment method');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      const res = await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPaymentMethods(paymentMethods.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleSetDefaultPayment = async (id: string) => {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      });
      if (res.ok) {
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error('Error setting default payment:', error);
    }
  };

  // Password change handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setSavingPassword(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setSavingPassword(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
          <p className="text-text-secondary">Manage your account settings and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-light rounded-full flex items-center justify-center mb-4">
                <FiUser size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'User'}</h2>
              <p className="text-text-secondary text-sm mb-2">{user.email}</p>
              {user.role === 'ADMIN' && (
                <div className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                  <FiShield size={14} />
                  <span>Admin</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('details')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-white ${activeTab === 'details' ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}`}
              >
                <FiUser size={20} />
                <span>Account Details</span>
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-white ${activeTab === 'password' ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}`}
              >
                <FiLock size={20} />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-white ${activeTab === 'addresses' ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}`}
              >
                <FiMapPin size={20} />
                <span>Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-white ${activeTab === 'payments' ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}`}
              >
                <FiCreditCard size={20} />
                <span>Payment Methods</span>
              </button>
              
              <div className="border-t border-gray-700 my-3"></div>
              
              <Link
                href="/orders"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
              >
                <FiPackage size={20} />
                <span>My Orders</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
              >
                <FiHeart size={20} />
                <span>Wishlist</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors text-white"
                >
                  <FiSettings size={20} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400"
              >
                <FiLogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="details">
                  <FiUser size={16} className="mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="password">
                  <FiLock size={16} className="mr-2" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="addresses">
                  <FiMapPin size={16} className="mr-2" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <FiCreditCard size={16} className="mr-2" />
                  Payments
                </TabsTrigger>
              </TabsList>
              
              <TabsContents>
                {/* Account Details Tab */}
                <TabsContent value="details">
                  <h3 className="text-2xl font-bold text-white mb-6">Account Details</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-text-secondary text-sm mb-2">Full Name</label>
                        <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                          {user.name || 'Not set'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-text-secondary text-sm mb-2">Email Address</label>
                        <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Account Type</label>
                      <div className="bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white">
                        {user.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <h4 className="text-xl font-bold text-white mb-4">Quick Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-3xl font-bold text-accent mb-1">0</div>
                          <div className="text-text-secondary text-sm">Total Orders</div>
                        </div>
                        <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-3xl font-bold text-accent mb-1">0</div>
                          <div className="text-text-secondary text-sm">Wishlist Items</div>
                        </div>
                        <div className="bg-background/50 border border-gray-700 rounded-lg p-4">
                          <div className="text-3xl font-bold text-accent mb-1">$0</div>
                          <div className="text-text-secondary text-sm">Total Spent</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <p className="text-text-secondary text-sm">
                        Need to update your information? Contact our support team for assistance.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="password">
                  <h3 className="text-2xl font-bold text-white mb-6">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Current Password</label>
                      <input 
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">New Password</label>
                      <input 
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                        required
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-400 text-sm">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                      <p className="text-green-400 text-sm">{passwordSuccess}</p>
                    )}
                    <button 
                      type="submit" 
                      disabled={savingPassword}
                      className="bg-accent hover:bg-accent-light text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Saved Addresses</h3>
                    <button 
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <FiPlus size={18} />
                      Add Address
                    </button>
                  </div>
                  
                  {loadingAddresses ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                      <FiMapPin size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No saved addresses yet.</p>
                      <p className="text-sm">Add an address for faster checkout.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`p-4 rounded-lg border ${address.isDefault ? 'border-accent/50 bg-accent/10' : 'border-gray-700 bg-background/30'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{address.firstName} {address.lastName}</span>
                                {address.isDefault && (
                                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <FiStar size={10} /> Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-secondary">{address.address1}</p>
                              {address.address2 && <p className="text-sm text-text-secondary">{address.address2}</p>}
                              <p className="text-sm text-text-secondary">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-text-secondary">{address.country}</p>
                              {address.phone && (
                                <p className="text-sm text-text-secondary mt-1">{address.phone}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!address.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  className="p-2 text-text-secondary hover:text-white transition-colors"
                                  title="Set as default"
                                >
                                  <FiCheck size={18} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleEditAddress(address)}
                                className="p-2 text-text-secondary hover:text-white transition-colors"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Payment Methods Tab */}
                <TabsContent value="payments">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Payment Methods</h3>
                    <button 
                      onClick={handleAddPayment}
                      className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <FiPlus size={18} />
                      Add Card
                    </button>
                  </div>
                  
                  {loadingPayments ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                      <FiCreditCard size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No saved payment methods yet.</p>
                      <p className="text-sm">Add a card for faster checkout.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((payment) => (
                        <div 
                          key={payment.id} 
                          className={`p-4 rounded-lg border ${payment.isDefault ? 'border-accent/50 bg-accent/10' : 'border-gray-700 bg-background/30'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded flex items-center justify-center">
                                <FiCreditCard size={18} className="text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">
                                    •••• •••• •••• {payment.cardNumber}
                                  </span>
                                  {payment.isDefault && (
                                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <FiStar size={10} /> Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-text-secondary">
                                  {payment.holderName} • Expires {payment.expiryMonth.toString().padStart(2, '0')}/{payment.expiryYear}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!payment.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultPayment(payment.id)}
                                  className="p-2 text-text-secondary hover:text-white transition-colors"
                                  title="Set as default"
                                >
                                  <FiCheck size={18} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeletePayment(payment.id)}
                                className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </TabsContents>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-primary border border-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button onClick={() => setShowAddressModal(false)} className="text-text-secondary hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">First Name</label>
                  <input
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Last Name</label>
                  <input
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Address Line 1</label>
                <input
                  value={addressForm.address1}
                  onChange={(e) => setAddressForm({...addressForm, address1: e.target.value})}
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Address Line 2 (Optional)</label>
                <input
                  value={addressForm.address2}
                  onChange={(e) => setAddressForm({...addressForm, address2: e.target.value})}
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="Apt 4"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">City</label>
                  <input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">State</label>
                  <input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Postal Code</label>
                  <input
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Country</label>
                  <input
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="United States"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Phone Number (Optional)</label>
                <input
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {addressError && (
                <p className="text-red-400 text-sm">{addressError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 border border-gray-700 text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAddress}
                  disabled={savingAddress}
                  className="flex-1 bg-accent hover:bg-accent-light text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {savingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-primary border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Add Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-text-secondary hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">Card Number</label>
                <input
                  value={paymentForm.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentForm({...paymentForm, cardNumber: formatted});
                  }}
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">Cardholder Name</label>
                <input
                  value={paymentForm.holderName}
                  onChange={(e) => setPaymentForm({...paymentForm, holderName: e.target.value})}
                  className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="JOHN DOE"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Month</label>
                  <input
                    value={paymentForm.expiryMonth}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setPaymentForm({...paymentForm, expiryMonth: value});
                    }}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Year</label>
                  <input
                    value={paymentForm.expiryYear}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPaymentForm({...paymentForm, expiryYear: value});
                    }}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="YYYY"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">CVV</label>
                  <input
                    type="password"
                    value={paymentForm.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPaymentForm({...paymentForm, cvv: value});
                    }}
                    className="w-full bg-background/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder="•••"
                  />
                </div>
              </div>
              {paymentError && (
                <p className="text-red-400 text-sm">{paymentError}</p>
              )}
              <p className="text-xs text-text-secondary">
                Your card information is stored securely. Only the last 4 digits are saved for display purposes.
              </p>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 border border-gray-700 text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePayment}
                  disabled={savingPayment}
                  className="flex-1 bg-accent hover:bg-accent-light text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {savingPayment ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

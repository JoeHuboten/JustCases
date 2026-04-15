'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiEye, FiX, FiPackage, FiTruck, FiCheck, FiClock, FiXCircle } from 'react-icons/fi';
import Image from 'next/image';
import AdminPagination from '@/components/admin/AdminPagination';

interface Order {
  id: string;
  userId: string;
  total: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  status: string;
  trackingNumber: string | null;
  courierService: string | null;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  adminNotes: string | null;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    color: string | null;
    size: string | null;
    product: {
      id: string;
      name: string;
      image: string;
      slug: string;
    };
  }[];
  statusHistory?: {
    id: string;
    status: string;
    notes: string | null;
    createdAt: string;
    createdBy: string | null;
  }[];
}

interface PaginatedResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-500',
  PROCESSING: 'bg-teal-500/20 text-teal-500',
  SHIPPED: 'bg-purple-500/20 text-purple-500',
  DELIVERED: 'bg-green-500/20 text-green-500',
  CANCELLED: 'bg-red-500/20 text-red-500',
};

const statusIcons = {
  PENDING: FiClock,
  PROCESSING: FiPackage,
  SHIPPED: FiTruck,
  DELIVERED: FiCheck,
  CANCELLED: FiXCircle,
};

const statusLabels: Record<string, string> = {
  PENDING: 'Чакаща',
  PROCESSING: 'Обработва се',
  SHIPPED: 'Изпратена',
  DELIVERED: 'Доставена',
  CANCELLED: 'Отказана',
};

export default function AdminOrders() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '20');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus,
          notes,
        }),
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          // Refresh the order data
          const updatedData = data?.orders.find(o => o.id === orderId);
          if (updatedData) setSelectedOrder(updatedData);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdateOrder = async (orderId: string, updates: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  const limit = data?.limit || 20;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Поръчки</h1>
        <p className="text-text-secondary mt-2">Управление на клиентски поръчки</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Търси поръчки..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-3 bg-background-secondary border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
        >
          <option value="ALL">Всички статуси</option>
          <option value="PENDING">Чакаща</option>
          <option value="PROCESSING">Обработва се</option>
          <option value="SHIPPED">Изпратена</option>
          <option value="DELIVERED">Доставена</option>
          <option value="CANCELLED">Отказана</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Номер на поръчка
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Продукти
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Общо
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                return (
                  <tr key={order.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-white">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.user.name || 'Гост'}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {order.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-white">
                        {order.items.length} продукт{order.items.length !== 1 ? 'а' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-white">
                        ${(order.total ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}
                      >
                        {StatusIcon && <StatusIcon size={14} />}
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-accent hover:text-accent/80"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 pb-4">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-lg border border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-background-secondary">
              <h2 className="text-xl font-bold text-white">
                Поръчка #{selectedOrder.id.slice(0, 8)}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-secondary hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Информация за клиента</h3>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <p className="text-white">{selectedOrder.user.name || 'Гост'}</p>
                  <p className="text-text-secondary">{selectedOrder.user.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Продукти в поръчката</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-background p-4 rounded-lg"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-text-secondary text-sm">
                          Количество: {item.quantity}
                          {item.color && ` • Цвят: ${item.color}`}
                          {item.size && ` • Размер: ${item.size}`}
                        </p>
                      </div>
                      <p className="text-white font-semibold">
                        ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Общество на поръчката</h3>
                <div className="bg-background p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Подобщо:</span>
                    <span>${(selectedOrder.subtotal ?? 0).toFixed(2)}</span>
                  </div>
                  {(selectedOrder.discount ?? 0) > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Отстъпка:</span>
                      <span>-${(selectedOrder.discount ?? 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-secondary">
                    <span>Такса доставка:</span>
                    <span>${(selectedOrder.deliveryFee ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-gray-700">
                    <span>Общо:</span>
                    <span>${(selectedOrder.total ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Статус на поръчката</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const notes = prompt('Добавете бележка (по избор):');
                    handleUpdateStatus(selectedOrder.id, e.target.value, notes || undefined);
                  }}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="PENDING">Чакаща</option>
                  <option value="PROCESSING">Обработва се</option>
                  <option value="SHIPPED">Изпратена</option>
                  <option value="DELIVERED">Доставена</option>
                  <option value="CANCELLED">Отказана</option>
                </select>
              </div>

              {/* Tracking Number */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Номер за проследяване</h3>
                <input
                  type="text"
                  defaultValue={selectedOrder.trackingNumber || ''}
                  onBlur={(e) => handleUpdateOrder(selectedOrder.id, { trackingNumber: e.target.value })}
                  placeholder="Въведете номер за проследяване"
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Courier Service */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Куриерска служба</h3>
                <select
                  defaultValue={selectedOrder.courierService || ''}
                  onChange={(e) => handleUpdateOrder(selectedOrder.id, { courierService: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                >
                  <option value="">Изберете куриер</option>
                  <option value="Speedy">Speedy</option>
                  <option value="Econt">Econt</option>
                  <option value="Bulgarian Posts">Български пощи</option>
                  <option value="DHL">DHL</option>
                  <option value="FedEx">FedEx</option>
                </select>
              </div>

              {/* Estimated Delivery */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Очаквана дата на доставка</h3>
                <input
                  type="datetime-local"
                  defaultValue={selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toISOString().slice(0, 16) : ''}
                  onBlur={(e) => handleUpdateOrder(selectedOrder.id, { estimatedDelivery: e.target.value ? new Date(e.target.value).toISOString() : null })}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Бележки на администратора</h3>
                <textarea
                  defaultValue={selectedOrder.adminNotes || ''}
                  onBlur={(e) => handleUpdateOrder(selectedOrder.id, { adminNotes: e.target.value })}
                  placeholder="Вътрешни бележки за тази поръчка..."
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">История на статусите</h3>
                  <div className="bg-background rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-3">
                      {selectedOrder.statusHistory.map((history, index) => {
                        const HistoryIcon = statusIcons[history.status as keyof typeof statusIcons] || FiClock;
                        return (
                          <div key={history.id} className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${statusColors[history.status as keyof typeof statusColors] || 'bg-gray-500/20 text-gray-500'}`}>
                              <HistoryIcon size={14} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm">{statusLabels[history.status] ?? history.status}</span>
                                <span className="text-text-secondary text-xs">
                                  {new Date(history.createdAt).toLocaleString('bg-BG')}
                                </span>
                              </div>
                              {history.notes && (
                                <p className="text-text-secondary text-sm mt-1">{history.notes}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiFetch } from '@/lib/client-api';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface DiscountCode {
  code: string;
  percentage: number;
}

interface CartStore {
  items: CartItem[];
  discountCode: DiscountCode | null;
  isLoading: boolean;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string, color?: string, size?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => Promise<void>;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  applyDiscountCode: (code: string) => Promise<boolean>;
  removeDiscountCode: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      isLoading: false,

      addItem: async (item: CartItem) => {
        set({ isLoading: true });
        try {
          const items = get().items;
          const existingItem = items.find(i => i.id === item.id && i.color === item.color && i.size === item.size);
          if (existingItem) {
            const updatedItems = items.map(i =>
              i.id === item.id && i.color === item.color && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            set({ items: updatedItems });
          } else {
            const newItems = [...items, item];
            set({ items: newItems });
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (productId: string, color?: string, size?: string) => {
        set({ isLoading: true });
        try {
          const items = get().items.filter(item => 
            !(item.id === productId && item.color === color && item.size === size)
          );
          set({ items });
        } catch (error) {
          console.error('Error removing item from cart:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId: string, quantity: number, color?: string, size?: string) => {
        set({ isLoading: true });
        try {
          if (quantity <= 0) {
            await get().removeItem(productId, color, size);
            return;
          }
          const items = get().items.map(item =>
            item.id === productId && item.color === color && item.size === size
              ? { ...item, quantity }
              : item
          );
          set({ items });
        } catch (error) {
          console.error('Error updating quantity:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], discountCode: null });
      },

      loadCart: async () => {
        set({ isLoading: true });
        try {
          // Cart is already loaded from localStorage via persist middleware
          // This function exists for potential future API integration
          const currentItems = get().items || [];
          set({ items: currentItems });
        } catch (error) {
          console.error('Error loading cart:', error);
          set({ items: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      applyDiscountCode: async (code: string) => {
        try {
          const response = await apiFetch('/api/discount/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
          if (response.ok) {
            const data = await response.json();
            set({ discountCode: { code, percentage: data.percentage } });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error applying discount code:', error);
          return false;
        }
      },

      removeDiscountCode: () => {
        set({ discountCode: null });
      },

      getSubtotal: () => {
        const items = get().items;
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const discountCode = get().discountCode;
        if (discountCode) {
          return (subtotal * discountCode.percentage) / 100;
        }
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return subtotal - discount;
      },

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Deduplicate items that may have been double-persisted
          const seen = new Set<string>();
          const deduped: CartItem[] = [];
          for (const item of state.items) {
            const key = `${item.id}-${item.color ?? ''}-${item.size ?? ''}`;
            if (seen.has(key)) {
              // Merge quantity into the first occurrence
              const existing = deduped.find(
                i => i.id === item.id && i.color === item.color && i.size === item.size
              );
              if (existing) existing.quantity += item.quantity;
            } else {
              seen.add(key);
              deduped.push({ ...item });
            }
          }
          state.items = deduped;
          state.setHasHydrated(true);
        }
      },
    }
  )
);

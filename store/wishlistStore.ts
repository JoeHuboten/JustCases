'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/client-api';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  category: {
    name: string;
    slug: string;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  isSynced: boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSynced: false,

      addItem: async (item: WishlistItem) => {
        const { items } = get();

        // Check if item already exists
        if (items.some(wishlistItem => wishlistItem.id === item.id)) {
          return;
        }

        // Optimistically add to local state
        set({ items: [...items, item] });

        try {
          const response = await apiFetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.id }),
          });

          if (response.ok) {
            set({ isSynced: true });
          }
        } catch {
          // Keep local state even if server sync fails – no console noise
        }
      },

      removeItem: async (productId: string) => {
        const { items } = get();

        // Optimistically remove from local state
        set({ items: items.filter(item => item.id !== productId) });

        try {
          await apiFetch(`/api/wishlist?productId=${productId}`, {
            method: 'DELETE',
          });
        } catch {
          // Keep local state even if server sync fails
        }
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [], isSynced: false });
      },

      syncWithServer: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true });

        try {
          const response = await apiFetch('/api/wishlist');

          if (response.ok) {
            const data = await response.json();
            set({ items: data.items || [], isSynced: true });
          }
        } catch {
          // Silently fail – local state is the source of truth for guests
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

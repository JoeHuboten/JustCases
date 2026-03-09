'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { apiFetch } from '@/lib/client-api';

export default function CartSync() {
  const { user, loading } = useAuth();
  const syncedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);
  const initialSyncDoneRef = useRef(false);
  
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state._hasHydrated);

  // Handle user login/logout sync - only runs once per login
  useEffect(() => {
    if (!hasHydrated || loading) return;

    const currentUserId = user?.id || null;
    const previousUserId = previousUserIdRef.current;

    // User just logged in - sync once
    if (currentUserId && !previousUserId && !syncedRef.current) {
      syncedRef.current = true;
      initialSyncDoneRef.current = false;
      
      const syncCart = async () => {
        try {
          // Get current local items before any server fetch
          const localItems = useCartStore.getState().items;
          
          // Fetch server cart
          const response = await apiFetch('/api/cart');
          if (response.ok) {
            const data = await response.json();
            const serverItems = data.items || [];
            
            // Merge: combine unique items from both
            const mergedItems = [...serverItems];
            for (const localItem of localItems) {
              const exists = mergedItems.some(
                s => s.id === localItem.id && s.color === localItem.color && s.size === localItem.size
              );
              if (!exists) {
                mergedItems.push(localItem);
              }
            }
            
            // Update local store with merged items
            useCartStore.setState({ items: mergedItems });
            
            // Save merged cart to server
            if (mergedItems.length > 0) {
              await apiFetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: mergedItems, merge: false }),
              });
            }
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        } finally {
          initialSyncDoneRef.current = true;
        }
      };

      syncCart();
    }

    // User logged out
    if (!currentUserId && previousUserId) {
      syncedRef.current = false;
      initialSyncDoneRef.current = false;
    }

    previousUserIdRef.current = currentUserId;
  }, [user?.id, loading, hasHydrated]);

  // Sync cart changes to server (debounced) - only after initial sync is done
  useEffect(() => {
    if (!user?.id || !hasHydrated || !syncedRef.current || !initialSyncDoneRef.current) return;

    const debounceTimer = setTimeout(async () => {
      try {
        await apiFetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, merge: false }),
        });
      } catch (error) {
        console.error('Error saving cart to server:', error);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [items, user?.id, hasHydrated]);

  return null;
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/client-api';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  emailVerified: Date | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted]);

  const checkAuth = async () => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently handle network errors during initial load
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Auth check timed out');
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // This can happen during SSR or when the server is unavailable
        console.warn('Auth check failed - server may be unavailable');
      } else {
        console.error('Error checking auth:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await apiFetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // Recheck auth to ensure cookie is working
        await checkAuth();
        return { success: true };
      }

      return { success: false, error: data.error || 'Sign in failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await apiFetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        // If email verification is required, don't set user
        if (data.requiresVerification) {
          return { success: true, requiresVerification: true };
        }
        
        // Otherwise, set user and check auth
        setUser(data.user);
        await checkAuth();
        return { success: true, requiresVerification: false };
      }

      return { success: false, error: data.error || 'Sign up failed' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signOut = async () => {
    try {
      await apiFetch('/api/auth/signout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

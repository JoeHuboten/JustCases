'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { t } = useLanguage();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError(t('auth.reset.invalidLink'));
    }
  }, [token]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return t('auth.reset.minLength');
    if (!/[A-Z]/.test(pwd)) return t('auth.reset.needUppercase');
    if (!/[a-z]/.test(pwd)) return t('auth.reset.needLowercase');
    if (!/[0-9]/.test(pwd)) return t('auth.reset.needDigit');
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.reset.mismatch'));
      return;
    }

    if (!token) {
      setError(t('auth.reset.invalidToken'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setError(data.error || t('auth.reset.failed'));
      }
    } catch (err) {
      setError(t('auth.reset.error'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-primary border border-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-green-400 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{t('auth.reset.success')}</h1>
            <p className="text-text-secondary mb-6">
              {t('auth.reset.successDesc')}
            </p>
            <Link href="/auth/signin" className="btn-primary inline-block">
              {t('auth.reset.signInNow')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-primary border border-gray-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="text-accent text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('auth.reset.title')}</h1>
            <p className="text-text-secondary">
              {t('auth.reset.subtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                {t('auth.reset.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                {t('auth.reset.requirements')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                {t('auth.reset.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className={`w-full btn-primary py-3 ${loading || !token ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? t('auth.reset.resetting') : t('auth.reset.resetButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              {t('auth.reset.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

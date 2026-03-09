'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || t('auth.forgot.error'));
      }
    } catch (err) {
      setError(t('auth.forgot.error'));
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
              <FiMail className="text-green-400 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{t('auth.forgot.success')}</h1>
            <p className="text-text-secondary mb-6">
              {t('auth.forgot.successMessage')}
            </p>
            <p className="text-sm text-text-secondary mb-6">
              {t('auth.forgot.successHint')}
            </p>
            <Link href="/auth/signin" className="btn-primary inline-flex items-center gap-2">
              <FiArrowLeft />
              {t('auth.forgot.backToLogin')}
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
              <FiMail className="text-accent text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('auth.forgot.title')}</h1>
            <p className="text-text-secondary">
              {t('auth.forgot.subtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                {t('auth.forgot.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                placeholder={t('auth.forgot.emailPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? t('auth.forgot.loading') : t('auth.forgot.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/signin"
              className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-2"
            >
              <FiArrowLeft />
              {t('auth.forgot.backToLogin')}
            </Link>
          </div>
        </div>

        <p className="text-center text-text-secondary text-sm mt-6">
          {t('auth.forgot.noAccount')}{' '}
          <Link href="/auth/signup" className="text-accent hover:underline">
            {t('auth.forgot.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}

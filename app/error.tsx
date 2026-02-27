'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
    
    // TODO: Send to error tracking service (Sentry, etc.)
    // if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-red-500/30 animate-ping" />
        </div>

        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          {t('error.title', 'Възникна грешка')}
        </h1>
        
        <p className="text-white/50 text-lg mb-4 font-body">
          {t('error.description', 'Извиняваме се за неудобството. Възникна неочаквана грешка.')}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-left">
            <p className="text-red-400 font-mono text-sm break-all mb-2">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-red-400/50 text-xs">
                {t('error.id', 'Идентификатор на грешка')}: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Production Error Message */}
        {process.env.NODE_ENV === 'production' && error.digest && (
          <p className="text-white/40 text-sm mb-8 font-body">
            {t('error.id', 'Идентификатор на грешка')}: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 font-body"
          >
            <FiRefreshCw size={20} />
            {t('error.tryAgain', 'Опитай отново')}
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium transition-colors font-body"
          >
            <FiHome size={20} />
            {t('notFound.goHome', 'Към началото')}
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm font-body">
            {t('error.supportPrefix', 'Ако проблемът продължава, моля ')}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
              {t('error.contactSupport', 'свържете се с поддръжката')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

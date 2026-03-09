'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('auth.verify.noToken'));
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          setAlreadyVerified(data.alreadyVerified || false);
          
          // Redirect to signin after 3 seconds if not already verified
          if (!data.alreadyVerified) {
            setTimeout(() => {
              router.push('/auth/signin?verified=true');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage(data.error || t('auth.verify.failed'));
        }
      } catch (error) {
        setStatus('error');
        setMessage(t('auth.verify.error'));
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Status Icon */}
        <div className="relative mb-8">
          {status === 'loading' && (
            <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <FiLoader className="w-16 h-16 text-accent animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-green-500/30 animate-ping" />
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <FiXCircle className="w-16 h-16 text-red-500" />
              </div>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-red-500/30 animate-ping" />
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          {status === 'loading' && t('auth.verify.loading')}
          {status === 'success' && (alreadyVerified ? t('auth.verify.alreadyVerified') : t('auth.verify.success'))}
          {status === 'error' && t('auth.verify.failed')}
        </h1>

        {/* Message */}
        <p className="text-text-secondary text-lg mb-8">
          {status === 'loading' && t('auth.verify.subtitle')}
          {message}
        </p>

        {/* Action Buttons */}
        {status === 'success' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-accent/20"
            >
              {alreadyVerified ? t('auth.verify.signIn') : t('auth.verify.signInNow')}
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-medium transition-colors"
            >
              {t('auth.verify.goHome')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-accent/20"
            >
              {t('auth.verify.tryAgain')}
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-medium transition-colors"
            >
              {t('auth.verify.contactSupport')}
            </Link>
          </div>
        )}

        {/* Auto-redirect notice */}
        {status === 'success' && !alreadyVerified && (
          <p className="text-text-secondary text-sm mt-8">
            {t('auth.verify.redirecting')}
          </p>
        )}
      </div>
    </div>
  );
}

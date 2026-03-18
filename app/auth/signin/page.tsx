'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GlassInput = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors focus-within:border-teal-400/70 focus-within:bg-teal-500/10">
    {children}
  </div>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password, rememberMe);
      if (result.success) {
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl') || '/account';
        router.push(callbackUrl);
      } else {
        setError(result.error || t('auth.signin.error', 'Invalid email or password'));
      }
    } catch {
      setError(t('auth.signin.error', 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0f]">
      {/* Left: Sign In Form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-heading font-semibold leading-tight text-white">
              {t('auth.signin.title', 'Welcome Back')}
            </h1>
            <p className="animate-element animate-delay-200 text-white/50">
              {t('auth.signin.subtitle', 'Sign in to your account to continue')}
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signin.email', 'Email Address')}</label>
                <GlassInput>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.signin.emailPlaceholder', 'Enter your email address')}
                    className="w-full bg-transparent text-sm text-white p-4 rounded-2xl focus:outline-none placeholder:text-white/25"
                  />
                </GlassInput>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signin.password', 'Password')}</label>
                <GlassInput>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={t('auth.signin.passwordPlaceholder', 'Enter your password')}
                      className="w-full bg-transparent text-sm text-white p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-white/25"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword
                        ? <EyeOff className="w-5 h-5 text-white/30 hover:text-white/60 transition-colors" />
                        : <Eye className="w-5 h-5 text-white/30 hover:text-white/60 transition-colors" />
                      }
                    </button>
                  </div>
                </GlassInput>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <span
                    style={{
                      transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.1s',
                      transform: 'scale(1)',
                    }}
                    onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.82)')}
                    onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    className={[
                      'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0',
                      rememberMe
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 border-transparent shadow-[0_0_10px_2px_rgba(20,184,166,0.45)]'
                        : 'bg-white/[0.04] border-white/20 group-hover:border-teal-400/50',
                    ].join(' ')}
                  >
                    {rememberMe && (
                      <Check
                        className="w-3 h-3 text-white"
                        strokeWidth={3}
                        style={{ animation: 'checkPop 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
                      />
                    )}
                  </span>
                  <span className="text-white/60 group-hover:text-white/80 transition-colors">{t('auth.signin.rememberMe', 'Keep me signed in')}</span>
                </button>
                <Link href="/auth/forgot-password" className="hover:underline text-teal-400 transition-colors">
                  {t('auth.signin.forgotPassword', 'Reset password')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 py-4 font-medium text-white hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('auth.signin.loading', 'Signing in...') : t('auth.signin.submit', 'Sign In')}
              </button>
            </form>

            <p className="animate-element animate-delay-700 text-center text-sm text-white/40">
              {t('auth.signin.noAccount', "Don't have an account?")}{' '}
              <Link href="/auth/signup" className="text-teal-400 hover:underline transition-colors">
                {t('auth.signin.signUp', 'Create Account')}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right: Hero Image + Testimonials */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200&q=80)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl" />
        </div>

      </section>
    </div>
  );
}

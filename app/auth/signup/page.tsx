'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GlassInput = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors focus-within:border-teal-400/70 focus-within:bg-teal-500/10">
    {children}
  </div>
);

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError(t('auth.signup.passwordMismatch', 'Passwords do not match'));
      return;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPassword.test(password)) {
      setError(t('auth.signup.passwordTooShort', 'Password must be at least 8 characters with uppercase, lowercase, and a number'));
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);

    if (result.success) {
      if (result.requiresVerification) {
        setSuccess(true);
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || t('auth.signup.failed', 'Registration failed'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0f]">
      {/* Left: Sign Up Form */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-heading font-semibold leading-tight text-white">
              {t('auth.signup.title', 'Create Account')}
            </h1>
            <p className="animate-element animate-delay-200 text-white/50">
              {t('auth.signup.subtitle', 'Join us and discover premium mobile accessories')}
            </p>

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-4">
                <p className="text-green-400 text-sm font-medium mb-1">{t('auth.signup.success', 'Account created!')}</p>
                <p className="text-green-400/80 text-sm">{t('auth.signup.checkEmail', 'Check your email to verify your account.')}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!success && (
              <>
              {/* Google Sign Up */}
              <div>
                <a
                  href="/api/auth/google?callbackUrl=%2Faccount"
                  className="flex items-center justify-center gap-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm py-4 px-4 font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {t('auth.signup.google', 'Continue with Google')}
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 uppercase tracking-wider">{t('auth.signup.or', 'or')}</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="animate-element animate-delay-300">
                  <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signup.name', 'Full Name')}</label>
                  <GlassInput>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={t('auth.signup.namePlaceholder', 'Enter your full name')}
                      className="w-full bg-transparent text-sm text-white p-4 rounded-2xl focus:outline-none placeholder:text-white/25"
                    />
                  </GlassInput>
                </div>

                <div className="animate-element animate-delay-400">
                  <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signup.email', 'Email Address')}</label>
                  <GlassInput>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t('auth.signup.emailPlaceholder', 'Enter your email address')}
                      className="w-full bg-transparent text-sm text-white p-4 rounded-2xl focus:outline-none placeholder:text-white/25"
                    />
                  </GlassInput>
                </div>

                <div className="animate-element animate-delay-500">
                  <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signup.password', 'Password')}</label>
                  <GlassInput>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder={t('auth.signup.passwordPlaceholder', 'Create a strong password')}
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

                <div className="animate-element animate-delay-600">
                  <label className="text-sm font-medium text-white/50 mb-1 block">{t('auth.signup.confirmPassword', 'Confirm Password')}</label>
                  <GlassInput>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder={t('auth.signup.confirmPlaceholder', 'Re-enter your password')}
                        className="w-full bg-transparent text-sm text-white p-4 pr-12 rounded-2xl focus:outline-none placeholder:text-white/25"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center">
                        {showConfirm
                          ? <EyeOff className="w-5 h-5 text-white/30 hover:text-white/60 transition-colors" />
                          : <Eye className="w-5 h-5 text-white/30 hover:text-white/60 transition-colors" />
                        }
                      </button>
                    </div>
                  </GlassInput>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="animate-element animate-delay-700 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 py-4 font-medium text-white hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('auth.signup.creating', 'Creating account...') : t('auth.signup.create', 'Create Account')}
                </button>
              </form>
              </>
            )}

            <p className="animate-element animate-delay-800 text-center text-sm text-white/40">
              {success ? (
                <>
                  {t('auth.signup.noEmail', "Didn't receive the email?")}{' '}
                  <button onClick={() => setSuccess(false)} className="text-teal-400 hover:underline transition-colors">
                    {t('auth.signup.tryAgain', 'Try again')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.signup.hasAccount', 'Already have an account?')}{' '}
                  <Link href="/auth/signin" className="text-teal-400 hover:underline transition-colors">
                    {t('auth.signup.signIn', 'Sign In')}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Right: Hero Image */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-3xl" />
        </div>
      </section>
    </div>
  );
}

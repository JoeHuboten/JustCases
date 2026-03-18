'use client'

import { useState, useEffect, useRef } from "react"
import { Check, ChevronUp, ShoppingBag, Settings, Globe, Crown, DoorOpen, User, LogIn, Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage, type Language } from '@/contexts/LanguageContext'
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
    }
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-white/5" aria-hidden="true" />
    )
  }

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
    router.push('/')
  }

  const menuItems = [
    {
      icon: <ShoppingBag className="w-4 h-4" />,
      label: t('nav.orders', 'Orders'),
      href: '/orders',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: t('nav.account', 'Settings'),
      href: '/account',
    },
  ]

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user && initials ? (
          <span className="text-xs font-bold text-teal-400 group-hover:text-white transition-colors">
            {initials}
          </span>
        ) : (
          <User size={16} className="text-slate-400 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl bg-[#12121a] border border-white/10 shadow-2xl shadow-black/40 z-50"
          >
            {/* User Info */}
            {user ? (
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-white truncate">{user.name || 'User'}</h3>
                      {user.role === 'ADMIN' && (
                        <div className="flex items-center justify-center w-4 h-4 bg-teal-500 rounded-full flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                      <ChevronUp className="w-4 h-4" />
                    </motion.div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-white/5">
                <p className="text-sm text-slate-400 mb-3">{t('profile.signInPrompt', 'Sign in to your account')}</p>
                <div className="flex gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t('nav.signin', 'Sign In')}
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    {t('nav.signup', 'Sign Up')}
                  </Link>
                </div>
              </div>
            )}

            {/* Language Switcher */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-400">{t('language.switcherTitle', 'Language')}</span>
              </div>
              <div className="flex bg-white/5 rounded-lg p-1">
                {(['bg', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "flex-1 flex items-center justify-center py-1.5 px-3 rounded-md text-xs font-semibold transition-all",
                      language === lang
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {lang === 'bg' ? '🇧🇬 BG' : '🇬🇧 EN'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                {mounted && theme === 'bright' ? <Sun className="w-4 h-4 text-slate-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
                <span className="text-xs font-medium text-slate-400">{t('theme.switcherTitle', 'Theme')}</span>
              </div>
              <div className="flex bg-white/5 rounded-lg p-1">
                {(['dark', 'bright']).map((tMode) => (
                  <button
                    key={tMode}
                    onClick={() => setTheme(tMode)}
                    className={cn(
                      "flex-1 flex items-center justify-center py-1.5 px-3 rounded-md text-xs font-semibold transition-all",
                      mounted && theme === tMode
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tMode === 'dark' ? 'Dark' : 'Aura Bright'}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items (only when logged in) */}
            {user && (
              <div className="p-2 space-y-0.5 border-b border-white/5">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-slate-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-slate-500"><Crown className="w-4 h-4" /></span>
                    <span>{t('nav.admin', 'Admin Panel')}</span>
                  </Link>
                )}

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>{t('nav.signout', 'Sign Out')}</span>
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Just Cases</span>
              <span className="text-[11px] text-slate-600">v1.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

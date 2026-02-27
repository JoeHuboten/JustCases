'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiShoppingBag, FiX, FiHeart, FiUser, FiMenu, FiArrowRight } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSearch from './AdvancedSearch';
import LanguageSwitcher from './LanguageSwitcher';
import type { Product } from '@/types';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { addToHistory } = useSearchStore();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  // Scroll detection for navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setMobileOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); setSearchLoading(false); return; }
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.ok) { const data = await res.json(); setSuggestions(data.products || []); }
      } catch {}
      setSearchLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const cartCount = mounted ? cartItems.reduce((s, i) => s + i.quantity, 0) : 0;
  const wishCount = mounted ? wishlistItems.length : 0;
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const handleSearch = (q: string) => {
    if (q.trim()) {
      addToHistory(q.trim());
      router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Single Row Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl shadow-black/20' 
          : 'bg-[#0a0a0f]/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
            
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}}>
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-base font-black text-white">J</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-white tracking-tight leading-none">Just Cases</div>
                <div className="text-[10px] text-blue-400 font-medium">Premium Quality</div>
              </div>
            </Link>

            {/* Center: Navigation */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center px-8">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white ring-1 ring-blue-500/30' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t(`nav.${item.label.toLowerCase()}`, item.label)}
                  </Link>
                );
              })}
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <div className="hidden md:block">
                {searchOpen ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#12121a]/80 border border-blue-500/30 rounded-full w-56 shadow-lg shadow-blue-500/10">
                    <FiSearch size={14} className={`flex-shrink-0 ${searchLoading ? 'text-blue-400 animate-pulse' : 'text-blue-400'}`} />
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      placeholder={t('header.search', 'Търси...')}
                      className="flex-1 bg-transparent text-white text-[13px] placeholder:text-slate-500 focus:outline-none"
                    />
                    <button onClick={() => {setSearchOpen(false); setSearchQuery(''); setSuggestions([]);}} className="text-slate-500 hover:text-white transition-colors">
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                  >
                    <FiSearch size={16} className="text-slate-400" />
                  </button>
                )}
              </div>

              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                title={t('header.search', 'Търси')}
              >
                <FiSearch size={16} className="text-slate-400" />
              </button>

              {/* Language */}
              <LanguageSwitcher />

              {/* Wishlist */}
              <Link href="/wishlist" className="relative group">
                <div className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <FiHeart size={16} className="text-slate-400 group-hover:text-pink-400 transition-colors" />
                </div>
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-pink-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <div className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <FiShoppingBag size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link href="/account" className="hidden sm:block group">
                <div className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <FiUser size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </Link>

              {/* Mobile Menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden ml-1">
                <div className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <FiMenu size={18} className="text-slate-400" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search Results - Modern Card Layout */}
        {searchOpen && (suggestions.length > 0 || searchLoading) && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-6 lg:mx-8 bg-[#12121a] border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-500/5 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {searchLoading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-slate-400">{t('header.searching', 'Търсене...')}</p>
              </div>
            ) : (
              <>
                <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {suggestions.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => { router.push(`/product/${p.slug}`); setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5 rounded-lg transition-all duration-300 text-left group animate-in fade-in slide-in-from-top-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0a0a0f] flex-shrink-0 ring-1 ring-white/5 group-hover:ring-blue-500/30 transition-all">
                        {p.image && <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium mb-1 truncate group-hover:text-blue-400 transition-colors">{p.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-blue-400 text-sm font-bold">{(p.price ?? 0).toFixed(2)} €</div>
                          {p.stock && p.stock < 5 && (
                            <span className="text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">{t('header.lowStock', 'Ограничена наличност')}</span>
                          )}
                        </div>
                      </div>
                      <FiArrowRight className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" size={18} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setIsAdvancedSearchOpen(true); setSearchOpen(false); }}
                  className="w-full py-3 text-sm text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-cyan-500/5 transition-all duration-300 font-medium border-t border-white/5 flex items-center justify-center gap-2 group"
                >
                  <span>{t('header.advancedSearch', 'Разширено търсене')}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu - Slide Down */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-3">
              {/* Mobile Search */}
              <div className="mb-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#0a0a0f] border border-white/5 rounded-lg focus-within:border-blue-500/30 transition-colors">
                  <FiSearch size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(searchQuery); setMobileOpen(false); setSuggestions([]); }}}
                    placeholder={t('header.searchProducts', 'Търсене на продукти...')}
                    className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-white/5">
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 p-2.5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 rounded-lg transition-all">
                  <FiHeart size={16} className="text-pink-400" />
                  <span className="text-sm text-white font-medium">{wishCount}</span>
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 p-2.5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-lg transition-all">
                  <FiShoppingBag size={16} className="text-cyan-400" />
                  <span className="text-sm text-white font-medium">{cartCount}</span>
                </Link>
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 mb-1 ${
                      active ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-white shadow-lg shadow-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t(`nav.${item.label.toLowerCase()}`, item.label)}
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50" />}
                  </Link>
                );
              })}

              {/* Mobile Account */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  <FiUser size={16} />
                  {t('nav.account', 'Акаунт')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className={scrolled ? 'h-[60px]' : 'h-[68px]'} />

      {/* Backdrop */}
      {(searchOpen || mobileOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setMobileOpen(false); }}
        />
      )}

      <AdvancedSearch isOpen={isAdvancedSearchOpen} onClose={() => setIsAdvancedSearchOpen(false)} onSearch={(q) => handleSearch(q)} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
};

export default Header;


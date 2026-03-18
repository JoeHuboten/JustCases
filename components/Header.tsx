'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiShoppingBag, FiX, FiHeart, FiUser, FiArrowRight } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdvancedSearch from './AdvancedSearch';
import { ProfileDropdown } from './ui/profile-dropdown';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
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
  const scrolled = useScroll(10);

  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchLabel = mounted ? t('header.search', 'Търси...') : 'Търси...';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

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
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`,
          { signal: controller.signal },
        );
        if (res.ok) { const data = await res.json(); setSuggestions(data.products || []); }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
      setSearchLoading(false);
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
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
      <header
        className={cn(
          'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
          {
            'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
              scrolled && !mobileOpen,
            'bg-background/90': mobileOpen,
          },
        )}
      >
        <nav
          className={cn(
            'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
            { 'md:px-2': scrolled },
          )}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 flex-shrink-0" onClick={(e) => { if (pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}}>
            <JustCasesLogo className="h-7 sm:h-8" />
          </Link>

          {/* Center: Navigation Links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    active && 'bg-accent text-accent-foreground',
                  )}
                >
                  {t(`nav.${item.label.toLowerCase()}`, item.label)}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Desktop Search */}
            <div className="hidden md:block">
              {searchOpen ? (
                <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-background rounded-md w-56">
                  <FiSearch size={14} className={cn('flex-shrink-0 text-muted-foreground', searchLoading && 'animate-pulse')} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    placeholder={searchLabel}
                    className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }} className="text-muted-foreground hover:text-foreground transition-colors">
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="h-9 w-9">
                  <FiSearch size={16} />
                </Button>
              )}
            </div>

            {/* Mobile Search */}
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="md:hidden h-9 w-9" title={searchLabel}>
              <FiSearch size={16} />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <span>
                  <FiHeart size={16} />
                </span>
              </Button>
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-pink-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <span>
                  <FiShoppingBag size={16} />
                </span>
              </Button>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown (desktop) */}
            <div className="hidden sm:block">
              <ProfileDropdown />
            </div>

            {/* Mobile Menu Toggle */}
            <Button size="icon" variant="outline" onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden h-9 w-9">
              <MenuToggleIcon open={mobileOpen} className="size-5" duration={300} />
            </Button>
          </div>
        </nav>

        {/* Search Results Dropdown */}
        {searchOpen && (suggestions.length > 0 || searchLoading) && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden z-50">
            {searchLoading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">{t('header.searching', 'Търсене...')}</p>
              </div>
            ) : (
              <>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {suggestions.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => { router.push(`/product/${p.slug}`); setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}
                      className="w-full flex items-center gap-4 p-3 hover:bg-accent rounded-lg transition-all duration-200 text-left group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 ring-1 ring-border group-hover:ring-primary/30 transition-all">
                        {p.image && <Image src={p.image} alt={p.name ?? ''} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1 truncate group-hover:text-primary transition-colors">{p.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-primary text-sm font-bold">{(p.price ?? 0).toFixed(2)} €</div>
                          {p.stock && p.stock < 5 && (
                            <span className="text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">{t('header.lowStock', 'Ограничена наличност')}</span>
                          )}
                        </div>
                      </div>
                      <FiArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" size={18} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setIsAdvancedSearchOpen(true); setSearchOpen(false); }}
                  className="w-full py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 font-medium border-t border-border flex items-center justify-center gap-2 group"
                >
                  <span>{t('header.advancedSearch', 'Разширено търсене')}</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile Full-Screen Menu */}
        <div
          className={cn(
            'bg-background/95 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y border-border md:hidden',
            mobileOpen ? 'block' : 'hidden',
          )}
        >
          <div
            data-slot={mobileOpen ? 'open' : 'closed'}
            className={cn(
              'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
              'flex h-full w-full flex-col justify-between gap-y-2 p-4',
            )}
          >
            {/* Mobile Search */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-muted border border-border rounded-lg focus-within:border-primary/30 transition-colors mb-3">
                <FiSearch size={16} className="text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(searchQuery); setMobileOpen(false); setSuggestions([]); }}}
                  placeholder={t('header.searchProducts', 'Търсене на продукти...')}
                  className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border">
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 p-2.5 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-all">
                  <FiHeart size={16} className="text-pink-500" />
                  <span className="text-sm font-medium">{wishCount}</span>
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 p-2.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-all">
                  <FiShoppingBag size={16} className="text-primary" />
                  <span className="text-sm font-medium">{cartCount}</span>
                </Link>
              </div>

              {/* Nav Links */}
              <div className="grid gap-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'ghost', className: 'justify-start' }),
                      isActive(item.href) && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {t(`nav.${item.label.toLowerCase()}`, item.label)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom: Account */}
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ variant: 'outline', className: 'w-full justify-start gap-2' }))}
              >
                <FiUser size={16} />
                {t('nav.account', 'Акаунт')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for search */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}
        />
      )}

      <AdvancedSearch isOpen={isAdvancedSearchOpen} onClose={() => setIsAdvancedSearchOpen(false)} onSearch={(q) => handleSearch(q)} />
    </>
  );
};

const JustCasesLogo = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 200 40" fill="none" {...props}>
    {/* 3D Cube icon */}
    <g transform="translate(18, 20)">
      {/* Top face */}
      <path d="M0,-14 L16,-6 L0,2 L-16,-6 Z" fill="#4eeadb" />
      {/* Left face */}
      <path d="M-16,-6 L0,2 L0,18 L-16,10 Z" fill="#1a9e8f" />
      {/* Right face */}
      <path d="M16,-6 L0,2 L0,18 L16,10 Z" fill="#2bc4b0" />
      {/* J cutout on left */}
      <path d="M-12.5,-3.5 L-4.5,1 L-4.5,6 L-8,4.2 L-8,0.5 L-12.5,-1.5 Z" fill="#0d2d2a" opacity="0.85" />
      <path d="M-8,4.2 L-4.5,6 L-4.5,8.5 Q-4.5,11 -7,10 L-9.5,8.6 L-8,7.5 L-6.2,8.6 Q-5.2,9 -5.5,8 L-5.5,6 L-8,4.2 Z" fill="#0d2d2a" opacity="0.85" />
      {/* C cutout on right */}
      <path d="M12.5,-3.5 L7,-0.5 Q5,1 5,5 Q5,9 7,10.5 L12.5,7 L12.5,9 L8,12 Q3.5,9.5 3.5,5 Q3.5,0.5 8,-2 L12.5,-4.5 Z" fill="#0d2d2a" opacity="0.85" />
    </g>
    {/* "Just" text */}
    <text x="40" y="26" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="500" fill="currentColor" letterSpacing="-0.3">Just</text>
    {/* "Cases" text in teal */}
    <text x="77" y="26" fontFamily="system-ui, -apple-system, sans-serif" fontSize="19" fontWeight="500" fill="#2bc4b0" letterSpacing="-0.3">Cases</text>
  </svg>
);

export default Header;

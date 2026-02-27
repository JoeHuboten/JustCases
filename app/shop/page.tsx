'use client';

import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ProductGridSkeleton, ShopSidebarSkeleton } from '@/components/SkeletonLoaders';
import { FiChevronRight, FiFilter, FiX, FiSearch, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect, Suspense, useCallback, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product, Category } from '@/types';

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function ShopContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Get current filter values from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = parseFloat(searchParams.get('minPrice') || '0');
  const currentMaxPrice = parseFloat(searchParams.get('maxPrice') || '200');
  
  // Local state
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build URL with updated params
  const buildUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all' || (key === 'minPrice' && value === '0') || (key === 'maxPrice' && value === '200')) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset page when filters change (except when changing page)
    if (!('page' in updates)) {
      params.delete('page');
    }
    
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, searchParams]);

  // Update URL with transition
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    startTransition(() => {
      router.push(buildUrl(updates), { scroll: false });
    });
  }, [router, buildUrl]);

  // Fetch products when URL params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', '12');
        if (currentCategory !== 'all') params.set('category', currentCategory);
        if (currentSort) params.set('sort', currentSort);
        if (currentSearch) params.set('search', currentSearch);
        if (currentMinPrice > 0) params.set('minPrice', currentMinPrice.toString());
        if (currentMaxPrice < 200) params.set('maxPrice', currentMaxPrice.toString());
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, currentCategory, currentSort, currentSearch, currentMinPrice, currentMaxPrice]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Sync temp price range with URL
  useEffect(() => {
    setTempPriceRange([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const handlePriceApply = () => {
    updateFilters({
      minPrice: tempPriceRange[0].toString(),
      maxPrice: tempPriceRange[1].toString()
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setTempPriceRange([0, 200]);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Build search params for pagination
  const paginationParams: Record<string, string> = {};
  if (currentCategory !== 'all') paginationParams.category = currentCategory;
  if (currentSort !== 'popular') paginationParams.sort = currentSort;
  if (currentSearch) paginationParams.search = currentSearch;
  if (currentMinPrice > 0) paginationParams.minPrice = currentMinPrice.toString();
  if (currentMaxPrice < 200) paginationParams.maxPrice = currentMaxPrice.toString();

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const hasActiveFilters = currentCategory !== 'all' || currentSearch || currentMinPrice > 0 || currentMaxPrice < 200;

  const getCategoryLabel = useCallback((category: Category) => {
    return t(`category.${category.slug}`, category.name);
  }, [t]);

  const productsFoundText = loading
    ? t('common.loading', 'Зареждане...')
    : language === 'bg'
      ? `Намерени продукти: ${total}`
      : `${total} products found`;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <div className="flex items-center gap-2 text-sm font-body">
          <Link href="/" className="text-white/40 hover:text-blue-400 transition-colors">{t('nav.home', 'Начало')}</Link>
          <FiChevronRight className="text-white/30" />
          <span className="text-white font-medium">{t('nav.shop', 'Магазин')}</span>
        </div>
      </div>

      {/* Mobile Search & Filter Bar */}
      <div className="lg:hidden container-custom mb-4 sm:mb-6">
        <div className="flex gap-2 sm:gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder={t('shop.searchProducts', 'Търсене на продукти...')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm sm:text-base font-body"
            />
          </form>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-xl relative min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label={t('shop.openFilters', 'Отвори филтри')}
          >
            <FiFilter size={20} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 sticky top-6 shadow-2xl">
              <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                <FiSliders className="text-blue-400" />
                {t('shop.filters', 'Филтри')}
              </h2>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    placeholder={t('shop.searchProducts', 'Търсене на продукти...')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all font-body"
                  />
                </div>
              </form>

              {/* Product Type Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-heading font-semibold text-white mb-4">{t('shop.productType', 'Тип продукт')}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilters({ category: null })}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group font-body ${
                      currentCategory === 'all'
                        ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-400 shadow-lg shadow-blue-500/10'
                        : 'border-white/5 hover:border-white/10 text-white/50 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="font-medium">{t('shop.allProducts', 'Всички продукти')}</span>
                    <FiChevronRight className={`transition-all duration-200 ${currentCategory === 'all' ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => updateFilters({ category: category.slug })}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group font-body ${
                        currentCategory === category.slug
                          ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/5 hover:border-white/10 text-white/50 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="font-medium">{getCategoryLabel(category)}</span>
                      <FiChevronRight className={`transition-all duration-200 ${currentCategory === category.slug ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-heading font-semibold text-white mb-4">{t('shop.priceRange', 'Ценови диапазон')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-white/40 text-sm mb-1 font-body">{t('search.minPrice', 'Минимална цена')}</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(200, parseInt(e.target.value) || 0));
                          setTempPriceRange([value, tempPriceRange[1]]);
                        }}
                        className="w-full bg-white/[0.03] text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-body"
                      />
                    </div>
                    <span className="text-white/40 mt-6">-</span>
                    <div className="flex-1">
                      <label className="block text-white/40 text-sm mb-1 font-body">{t('search.maxPrice', 'Максимална цена')}</label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const value = Math.max(0, Math.min(200, parseInt(e.target.value) || 0));
                          setTempPriceRange([tempPriceRange[0], value]);
                        }}
                        className="w-full bg-white/[0.03] text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-body"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handlePriceApply}
                    disabled={tempPriceRange[0] === currentMinPrice && tempPriceRange[1] === currentMaxPrice}
                    className="w-full py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-body"
                  >
                    {t('shop.applyPrice', 'Приложи цена')}
                  </button>
                </div>
              </div>

              {/* Clear All Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.03] rounded-xl transition-all font-body"
                >
                  <FiX size={18} />
                  {t('search.clearFilters', 'Изчисти филтрите')}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <p className="text-white/50 text-sm sm:text-base font-body">
                  {productsFoundText}
                </p>
                {isPending && (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                )}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 w-full xs:w-auto sm:w-auto">
                {/* Sort Dropdown */}
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value === 'popular' ? null : e.target.value })}
                  className="flex-1 xs:flex-none sm:flex-none bg-white/[0.03] border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:border-blue-500/50 cursor-pointer min-h-[44px] font-body"
                >
                  <option value="popular">{t('shop.sort.popular', 'Най-популярни')}</option>
                  <option value="newest">{t('shop.sort.newest', 'Най-нови')}</option>
                  <option value="price-low">{t('shop.sort.priceLow', 'Цена: ниска към висока')}</option>
                  <option value="price-high">{t('shop.sort.priceHigh', 'Цена: висока към ниска')}</option>
                  <option value="rating">{t('shop.sort.rating', 'Най-висок рейтинг')}</option>
                </select>
                
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}
                    aria-label={t('shop.gridView', 'Изглед мрежа')}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-white/50 hover:text-white'}`}
                    aria-label={t('shop.listView', 'Изглед списък')}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                      oldPrice={product.oldPrice || undefined}
                      discount={product.discount || undefined}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/shop"
                  searchParams={paginationParams}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiSearch className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-2">{t('shop.noProducts', 'Няма намерени продукти')}</h3>
                <p className="text-white/50 mb-6 font-body">{t('shop.noProductsHint', 'Опитайте да промените филтрите или търсенето')}</p>
                <button
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-body"
                >
                  {t('search.clearFilters', 'Изчисти филтрите')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-[85vw] max-w-[320px] bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-white/5 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
                <FiSliders className="text-blue-400" size={18} />
                {t('shop.filters', 'Филтри')}
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2.5 text-white/50 hover:text-white rounded-lg hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('shop.closeFilters', 'Затвори филтри')}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Mobile Category Filter */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-3 sm:mb-4">{t('shop.productType', 'Тип продукт')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    updateFilters({ category: null });
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 sm:p-3 rounded-lg border transition-all min-h-[48px] font-body ${
                    currentCategory === 'all'
                      ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-400'
                      : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <span className="font-medium text-sm sm:text-base">{t('shop.allProducts', 'Всички продукти')}</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      updateFilters({ category: category.slug });
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 sm:p-3 rounded-lg border transition-all min-h-[48px] font-body ${
                      currentCategory === category.slug
                        ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-blue-500/5 text-blue-400'
                        : 'border-white/10 text-white/50 hover:text-white'
                    }`}
                  >
                    <span className="font-medium text-sm sm:text-base">{getCategoryLabel(category)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price Filter */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-heading font-semibold text-white mb-3 sm:mb-4">{t('shop.priceRange', 'Ценови диапазон')}</h3>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-blue-400 font-semibold font-body">${tempPriceRange[0]}</span>
                <span className="text-blue-400 font-semibold font-body">${tempPriceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                className="w-full h-2"
              />
              <button
                onClick={() => {
                  handlePriceApply();
                  setMobileFiltersOpen(false);
                }}
                className="w-full mt-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all min-h-[48px] font-medium font-body"
              >
                {t('shop.applyPrice', 'Приложи цена')}
              </button>
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full min-h-[48px] px-6 py-3 border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.03] rounded-xl transition-all font-body"
              >
                {t('search.clearFilters', 'Изчисти филтрите')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-white/50 font-body">{t('shop.loadingProducts', 'Зареждане на продукти...')}</p>
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}

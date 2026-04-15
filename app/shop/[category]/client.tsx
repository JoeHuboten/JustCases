'use client';

import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  image: string;
  rating?: number;
  reviews?: number;
  category?: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface CategoryPageClientProps {
  category: Category;
  products: Product[];
}

export default function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const { t } = useLanguage();

  const categoryName = t(`category.${category.slug}`, category.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-background-secondary to-background py-16 border-b border-white/5">
        <div className="container-custom">
          <div className="flex items-center space-x-6">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
              <Image
                src={category.image || '/placeholder-category.jpg'}
                alt={categoryName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{categoryName}</h1>
              <p className="text-text-secondary text-lg">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-background-secondary py-4 border-b border-white/5">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-text-secondary hover:text-white transition-colors">
              {t('product.breadcrumb.home', 'Начало')}
            </Link>
            <span className="text-text-muted">/</span>
            <Link href="/shop" className="text-text-secondary hover:text-white transition-colors">
              {t('product.breadcrumb.shop', 'Магазин')}
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {products.length} {t('shop.productsInCategory', 'Products in')} {categoryName}
            </h2>
            <div className="flex items-center space-x-4">
              <select className="bg-background-secondary text-white px-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent">
                <option>{t('shop.sortByFeatured', 'Sort by: Featured')}</option>
                <option>{t('shop.sort.priceLow', 'Price: Low to High')}</option>
                <option>{t('shop.sort.priceHigh', 'Price: High to Low')}</option>
                <option>{t('shop.sort.newest', 'Newest')}</option>
                <option>{t('shop.sort.popular', 'Most Popular')}</option>
              </select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-text-muted text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('shop.noProducts', 'Няма намерени продукти')}
              </h3>
              <p className="text-text-secondary mb-6">
                {t('shop.noProductsInCategory', 'We\'re working on adding more products to this category.')}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
              >
                {t('shop.browseAllProducts', 'Разгледай всички продукти')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';
import ProductDetails from '@/components/ProductDetails';
import ProductReviews from '@/components/ProductReviews';
import ProductImageGallery from '@/components/ProductImageGallery';
import RecentlyViewed from '@/components/RecentlyViewed';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import {
  localizeProductDescription,
  localizeSpecificationKey,
  localizeSpecificationValue,
} from '@/lib/productLocalization';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  discount?: number | null;
  rating: number;
  reviews: number;
  image: string;
  images: string;
  description: string | null;
  specifications?: any;
  inStock: boolean;
  stock: number;
  lowStockThreshold: number;
  colors?: string | null;
  sizes?: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  slug: string;
}

interface ProductPageClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const { t, formatPrice, language } = useLanguage();
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);
  const categoryLabel = t(`category.${product.category.slug}`, product.category.name);
  const localizedDescription = localizeProductDescription(product.slug, product.description, language);

  // Track product view
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
  }, [product.id, product.name, product.slug, product.price, product.image, addToRecentlyViewed]);

  // Parse images from JSON string or create array with single image
  const productImages = (() => {
    try {
      return product.images ? JSON.parse(product.images) : [product.image];
    } catch {
      return [product.image];
    }
  })();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Breadcrumb */}
      <div className="container-custom">
        <Breadcrumbs
          items={[
            { label: t('product.breadcrumb.shop', 'Магазин'), href: '/shop' },
            { label: categoryLabel, href: `/shop/${product.category.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <ProductImageGallery images={productImages} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-heading font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'
                        }`}
                        size={20}
                      />
                    ))}
                  </div>
                  <span className="text-white/50 font-body">
                    {product.rating} ({product.reviews} {t('product.reviews', 'отзива')})
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-heading font-bold text-white">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-2xl text-white/40 line-through font-body">{formatPrice(product.oldPrice)}</span>
                  {product.discount && (
                    <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-semibold font-body">
                      -{product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-heading font-semibold text-white mb-3">
                {t('product.description', 'Описание')}
              </h3>
              <p className="text-white/60 leading-relaxed font-body">{localizedDescription}</p>
            </div>

            {/* Interactive Product Details */}
            <ProductDetails product={product} />

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="text-xl font-heading font-semibold text-white mb-3">
                  {t('product.specifications', 'Спецификации')}
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="flex justify-between font-body">
                      <span className="text-white/50 capitalize">{localizeSpecificationKey(key, language)}:</span>
                      <span className="text-white">
                        {(() => {
                          const localizedValue = localizeSpecificationValue(value, language);
                          return Array.isArray(localizedValue) ? localizedValue.join(', ') : localizedValue;
                        })()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-8">
              {t('product.relatedProducts', 'Свързани продукти')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition"
                >
                  <div className="relative aspect-square bg-white/[0.02]">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-heading font-semibold mb-2 group-hover:text-blue-400 transition">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold font-body">{formatPrice(relatedProduct.price)}</span>
                      {relatedProduct.oldPrice && (
                        <span className="text-white/40 line-through font-body">{formatPrice(relatedProduct.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <RecentlyViewed excludeProductId={product.id} maxItems={4} />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiHeart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function WishlistPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { items, removeItem, isLoading } = useWishlistStore();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const handleRemoveFromWishlist = async (productId: string) => {
    setIsRemoving(productId);
    try {
      await removeItem(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-background">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>{t('wishlist.backToShop')}</span>
          </Link>
        </div>

        <ScrollAnimation animation="fadeIn">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('wishlist.pageTitle')}</h1>
              <p className="text-text-secondary">
                {items.length === 0 
                  ? t('wishlist.noProducts') 
                  : `${items.length} ${items.length === 1 ? t('wishlist.countSuffixSingular') : t('wishlist.countSuffix')}`
                }
              </p>
            </div>
          </div>
        </ScrollAnimation>

        {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
            </div>
          ) : items.length === 0 ? (
            <ScrollAnimation animation="fadeIn">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiHeart size={32} className="text-text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{t('wishlist.emptyTitle')}</h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  {t('wishlist.emptyDesc')}
                </p>
                <Link
                  href="/shop"
                  className="btn-primary inline-block"
                >
                  {t('wishlist.browseProducts')}
                </Link>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <ScrollAnimation key={item.id} animation="scaleUp" delay={index * 0.1}>
                  <div className="bg-gradient-to-br from-primary/80 to-primary backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover hover:scale-110 transition-transform duration-500 ease-out"
                          priority={false}
                          quality={85}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </Link>
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={isRemoving === item.id}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-white font-semibold mb-2 hover:text-accent transition-colors duration-200 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {item.category && (
                        <p className="text-text-secondary text-sm mb-3">
                          {item.category.name}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg">
                          ${item.price}
                        </span>
                        {item.oldPrice && (
                          <span className="text-text-secondary line-through text-sm">
                            ${item.oldPrice}
                          </span>
                        )}
                        {item.discount && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

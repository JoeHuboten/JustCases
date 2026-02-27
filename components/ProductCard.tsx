'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, memo, useCallback } from 'react';
import { useToast } from '@/components/Toast';

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
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps extends Product {
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({
  id,
  name,
  slug,
  price,
  oldPrice,
  discount,
  image,
  rating = 0,
  reviews = 0,
  category,
  onQuickView,
}: ProductCardProps) => {
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice, t } = useLanguage();
  const { showToast } = useToast();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const inWishlist = isInWishlist(id);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      await addToCart({
        id,
        name,
        price,
        oldPrice: oldPrice ?? undefined,
        discount: discount ?? undefined,
        image,
        quantity: 1,
      });
      showToast(`${name} добавен в количката`, 'cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Грешка при добавяне', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  }, [id, name, price, oldPrice, discount, image, addToCart, showToast]);

  const handleWishlistToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        showToast('Премахнат от любими', 'wishlist');
      } else {
        await addToWishlist({
          id,
          name,
          slug,
          price,
          oldPrice: oldPrice ?? undefined,
          discount: discount ?? undefined,
          image,
          category: category || { name: '', slug: '' }
        });
        showToast('Добавен в любими', 'wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  }, [id, name, slug, price, oldPrice, discount, image, category, inWishlist, addToWishlist, removeFromWishlist, showToast]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.({ id, name, slug, price, oldPrice, discount, image, rating, reviews, category });
  }, [id, name, slug, price, oldPrice, discount, image, rating, reviews, category, onQuickView]);

  const categoryLabel = category ? t(`category.${category.slug}`, category.name) : '';

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative bg-[#0a0a0f] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-1">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-white/[0.03] to-white/[0.01] overflow-hidden">
          <Image
            src={image || '/placeholder.svg'}
            alt={`${name} - Премиум мобилен аксесоар от Just Cases`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-heading font-bold shadow-lg shadow-red-500/30 z-10 flex items-center gap-1">
              <span className="text-white/80">-</span>{discount}%
            </div>
          )}
          
          {/* Wishlist Button - Always visible on mobile, hover on desktop */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            aria-label={inWishlist ? `Премахни ${name} от любими` : `Добави ${name} в любими`}
            className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-10 h-10 sm:w-10 sm:h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out sm:hover:scale-110 backdrop-blur-md sm:transform sm:hover:-translate-y-1 ${
              inWishlist
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30'
                : 'bg-black/40 sm:bg-white/10 text-white sm:hover:bg-white/20'
            }`}
          >
            <FiHeart size={16} className={inWishlist ? 'fill-current' : ''} />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={handleQuickView}
              aria-label={`Бърз преглед на ${name}`}
              className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center bg-black/40 sm:bg-white/10 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-20 cursor-pointer transition-all duration-500 ease-out sm:hover:scale-110 backdrop-blur-md sm:hover:bg-white/20 sm:transform sm:hover:-translate-y-1"
            >
              <FiEye size={16} />
            </button>
          )}
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            aria-label={`Добави ${name} в количката`}
            className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50 z-20 cursor-pointer transition-all duration-500 ease-out sm:hover:scale-110 shadow-lg shadow-blue-500/30 backdrop-blur-md sm:transform sm:hover:-translate-y-1"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 relative">
          {/* Category badge */}
          {category && (
            <span className="inline-block text-[10px] sm:text-xs text-blue-400/80 font-body font-medium mb-1.5 sm:mb-2 tracking-wide uppercase">
              {categoryLabel}
            </span>
          )}
          
          <h3 className="text-white font-heading font-semibold mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-snug text-sm sm:text-base">
            {name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`transition-colors duration-300 ${
                      i < Math.floor(rating) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-white/10'
                    }`}
                    size={12}
                  />
                ))}
              </div>
              <span className="text-white/40 text-[10px] sm:text-xs font-body font-medium">
                {(rating ?? 0).toFixed(1)} <span className="text-white/20">({reviews ?? 0})</span>
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-blue-400 transition-colors duration-300">
              {formatPrice(price)}
            </span>
            {oldPrice && (
              <span className="text-white/30 line-through text-xs sm:text-sm font-body">
                {formatPrice(oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.price === nextProps.price &&
    prevProps.oldPrice === nextProps.oldPrice &&
    prevProps.discount === nextProps.discount &&
    prevProps.image === nextProps.image &&
    prevProps.rating === nextProps.rating &&
    prevProps.reviews === nextProps.reviews &&
    prevProps.category?.slug === nextProps.category?.slug
  );
});


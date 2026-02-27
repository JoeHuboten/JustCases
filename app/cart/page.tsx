"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiArrowRight,
  FiTag,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

export default function CartPage() {
  const router = useRouter();
  const { t, formatPrice, language } = useLanguage();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscount,
    getTotal,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
  } = useCartStore();
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Cart mounted, items:", items);
  }, [items]);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    setApplyingDiscount(true);
    setDiscountError("");
    const success = await applyDiscountCode(discountInput.toUpperCase());
    if (!success) {
      setDiscountError(t('cart.invalidCoupon', 'Невалиден или изтекъл код за отстъпка'));
    } else {
      setDiscountInput("");
    }
    setApplyingDiscount(false);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const itemsCountText =
    language === 'bg'
      ? `Имате ${items.length} ${items.length === 1 ? 'продукт' : 'продукта'} в количката`
      : `You have ${items.length} item${items.length !== 1 ? 's' : ''} in your cart`;

  const subtotalItemsText =
    language === 'bg'
      ? `${items.length} ${items.length === 1 ? 'продукт' : 'продукта'}`
      : `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="container-custom py-16">
          <div className="text-center max-w-lg mx-auto">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-full animate-pulse"></div>
              <div className="relative w-full h-full bg-white/[0.02] rounded-full flex items-center justify-center border border-white/10">
                <FiShoppingCart size={48} className="text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('cart.empty', 'Your Cart')}
            </h1>
            <p className="text-white/50 mb-8 text-lg font-body">
              {t('cart.emptyCart', 'Your cart is empty. Start shopping to add items.')}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium font-body hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
            >
              <FiShoppingCart size={20} />
              <span>{t('cart.continueShopping', 'Continue Shopping')}</span>
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-6 sm:py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <FiShoppingCart size={20} className="text-white sm:hidden" />
              <FiShoppingCart size={24} className="text-white hidden sm:block" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white">{t('cart.shoppingCart', 'Shopping Cart')}</h1>
              <p className="text-white/50 text-sm sm:text-base font-body">
                {itemsCountText}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.color || "default"}-${item.size || "default"}`}
                className="group bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-28 h-32 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {item.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Details and Controls - Responsive Layout */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-heading font-semibold text-base sm:text-lg mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {item.name}
                      </h3>

                    {/* Variants */}
                    {(item.color || item.size) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.color && (
                          <span className="inline-flex items-center gap-1 bg-white/[0.03] text-white/50 text-xs px-3 py-1 rounded-full border border-white/10 font-body">
                            <div
                              className="w-3 h-3 rounded-full border border-white/20"
                              style={{
                                backgroundColor: item.color.toLowerCase(),
                              }}
                            ></div>
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-white/[0.03] text-white/50 text-xs px-3 py-1 rounded-full border border-white/10 font-body">
                            {t('product.size', 'Размер')}: {item.size}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="text-blue-400 font-bold text-xl sm:text-2xl font-heading">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <span className="text-white/40 text-xs sm:text-sm font-body">
                        {formatPrice(item.price)} {t('cart.each', 'за брой')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-4">
                    <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg sm:rounded-xl p-0.5 sm:p-1 border border-white/10">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.color,
                            item.size,
                          )
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:bg-blue-500 hover:text-white rounded-md sm:rounded-lg transition-all min-w-[36px]"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} className="sm:hidden" />
                        <FiMinus size={18} className="hidden sm:block" />
                      </button>
                      <span className="text-white font-medium w-8 sm:w-12 text-center text-base sm:text-lg font-body">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.color,
                            item.size,
                          )
                        }
                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white hover:bg-blue-500 hover:text-white rounded-md sm:rounded-lg transition-all min-w-[36px]"
                      >
                        <FiPlus size={16} className="sm:hidden" />
                        <FiPlus size={18} className="hidden sm:block" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.color, item.size)}
                      className="flex items-center gap-1.5 sm:gap-2 text-red-400 hover:text-red-300 transition-colors group/btn p-2 -m-2"
                    >
                      <FiTrash2
                        size={18}
                        className="group-hover/btn:scale-110 transition-transform"
                      />
                      <span className="text-sm hidden xs:inline font-body">{t('cart.remove', 'Remove')}</span>
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button */}
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 text-white/50 hover:text-white hover:border-blue-500/30 transition-all group font-body"
            >
              <FiShoppingCart size={20} />
              <span>{t('cart.continueShopping', 'Continue Shopping')}</span>
              <FiArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FiPackage size={18} className="text-blue-400 sm:hidden" />
                  <FiPackage size={20} className="text-blue-400 hidden sm:block" />
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">{t('cart.orderSummary', 'Order Summary')}</h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/50 text-sm font-body">
                    {t('cart.subtotal', 'Subtotal')} ({subtotalItemsText})
                  </span>
                  <span className="text-white font-semibold text-lg font-body">
                    {formatPrice(getSubtotal())}
                  </span>
                </div>

                {discountCode && (
                  <div className="flex justify-between items-center bg-green-500/10 rounded-lg p-3 border border-green-500/30 my-2">
                    <span className="text-green-400 flex items-center gap-2 text-sm font-body">
                      <FiTag size={14} />
                      {t('cart.discount', 'Discount')} ({discountCode.percentage}%)
                    </span>
                    <span className="text-green-400 font-semibold font-body">
                      -{formatPrice(getDiscount())}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-white/50 text-sm font-body">{t('cart.shipping', 'Shipping')}</span>
                  <span className="font-semibold text-green-400 text-sm font-body">
                    {t('cart.freeShipping', 'Free')}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-white text-lg font-heading font-bold">{t('cart.total', 'Total')}</span>
                  <div className="text-right">
                    <div className="text-blue-400 text-3xl font-bold font-heading">
                      {formatPrice(getTotal())}
                    </div>
                    {discountCode && (
                      <div className="text-white/40 text-xs line-through mt-1 font-body">
                        {formatPrice(getSubtotal())}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white font-medium mb-3 font-body">
                  <FiTag size={18} />
                  {t('cart.discountCode', 'Discount Code')}
                </label>
                {discountCode ? (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiTag size={20} className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-green-400 font-bold text-lg font-heading">
                            {discountCode.code}
                          </div>
                          <div className="text-green-400/70 text-sm font-body">
                            -{discountCode.percentage}% {t('cart.discountApplied', 'приложена отстъпка')}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={removeDiscountCode}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={discountInput}
                        onChange={(e) =>
                          setDiscountInput(e.target.value.toUpperCase())
                        }
                        placeholder="SUMMER20"
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all font-body"
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={applyingDiscount || !discountInput.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-3 rounded-xl hover:scale-105 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center font-body"
                      >
                        {applyingDiscount ? t('cart.applying', 'Applying...') : t('cart.apply', 'Apply')}
                      </button>
                    </div>
                    {discountError && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2 font-body">
                        <span>⚠️</span>
                        <span>{discountError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all transform active:scale-95 shadow-lg shadow-blue-500/20 group font-body"
              >
                <span>{t('cart.proceedToCheckout', 'Proceed to Checkout')}</span>
                <FiArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3 text-white/50 text-sm font-body">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">✓</span>
                  </div>
                  <span>{t('cart.secureCheckout', '100% Secure Checkout')}</span>
                </div>
                <div className="flex items-center gap-3 text-white/50 text-sm font-body">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <FiTruck size={16} className="text-blue-400" />
                  </div>
                  <span>{t('cart.freeShipping', 'Free Shipping on All Orders')}</span>
                </div>
                <div className="flex items-center gap-3 text-white/50 text-sm font-body">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400">↺</span>
                  </div>
                  <span>{t('cart.returnPolicy30Days', '30-дневна политика за връщане')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

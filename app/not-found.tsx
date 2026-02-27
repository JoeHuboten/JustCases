'use client';

import Link from 'next/link';
import { FiHome, FiSearch, FiShoppingBag } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-[180px] font-heading font-bold text-white/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-full animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          {t('notFound.title', 'Страницата не е намерена')}
        </h1>
        
        <p className="text-white/50 text-lg mb-8 font-body">
          {t('notFound.description', 'Опа! Страницата, която търсите, не съществува или е преместена.')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 font-body"
          >
            <FiHome size={20} />
            {t('notFound.goHome', 'Към началото')}
          </Link>
          
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-medium transition-colors font-body"
          >
            <FiShoppingBag size={20} />
            {t('notFound.browseShop', 'Към магазина')}
          </Link>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4 font-body">
            {t('notFound.lookingFor', 'Търсите нещо конкретно?')}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-body"
          >
            <FiSearch size={16} />
            {t('notFound.searchProducts', 'Потърсете продукт')}
          </Link>
        </div>
      </div>
    </div>
  );
}

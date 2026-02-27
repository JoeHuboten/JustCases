'use client';

import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1"
      role="group"
      aria-label={t('language.switcherTitle', 'Смяна на език')}
      title={t('language.switcherTitle', 'Смяна на език')}
    >
      <div className="flex h-8 w-8 items-center justify-center text-white/70" aria-hidden="true">
        <FiGlobe size={14} />
      </div>

      <button
        type="button"
        onClick={() => setLanguage('bg')}
        aria-pressed={language === 'bg'}
        className={`h-8 rounded-lg px-2.5 text-xs font-semibold transition-all ${
          language === 'bg'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        BG
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`h-8 rounded-lg px-2.5 text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
    </div>
  );
}

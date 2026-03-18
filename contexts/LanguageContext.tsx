'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bgTranslations from '@/locales/bg.json';
import enTranslations from '@/locales/en.json';

export type Language = 'bg' | 'en';
export type Currency = 'BGN' | 'USD' | 'EUR';

type TranslationDictionary = Record<string, string>;

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  t: (key: string, fallback?: string) => string;
  formatPrice: (price: number) => string;
  formatDate: (date: Date | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries loaded from external JSON files
const translations: Record<Language, TranslationDictionary> = {
  bg: bgTranslations,
  en: enTranslations,
};


// Currency conversion rates (simplified - in real app, use real-time rates)
const currencyRates = {
  EUR: 1,
  USD: 1.08,
  BGN: 1.96,
};

const currencySymbols = {
  EUR: '€',
  USD: '$',
  BGN: '€',
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('bg');
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  useEffect(() => {
    // Load saved preferences
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      const savedCurrency = localStorage.getItem('currency') as Currency;
      
      if (savedLanguage && ['bg', 'en'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
      
      if (savedCurrency && ['BGN', 'USD', 'EUR'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  useEffect(() => {
    // Save preferences
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
      localStorage.setItem('currency', currency);
      
      // Update document language
      document.documentElement.lang = language;
      
      // Debug logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Language changed to:', language);
        console.log('Currency changed to:', currency);
      }
    }
  }, [language, currency]);

  const t = (key: string, fallback?: string): string => {
    return translations[language][key] || fallback || key;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = price * currencyRates[currency];
    const symbol = currencySymbols[currency];
    
    if (currency === 'EUR') {
      return `${convertedPrice.toFixed(2)} ${symbol}`;
    } else {
      return `${symbol}${convertedPrice.toFixed(2)}`;
    }
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const locale = language === 'bg' ? 'bg-BG' : 'en-US';
    return dateObj.toLocaleDateString(locale);
  };

  const setLanguage = (lang: Language) => {
    try {
      console.log('setLanguage called with:', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const setCurrency = (curr: Currency) => {
    try {
      console.log('setCurrency called with:', curr);
      setCurrencyState(curr);
    } catch (error) {
      console.error('Error setting currency:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    currency,
    setLanguage,
    setCurrency,
    t,
    formatPrice,
    formatDate,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage must be used within a LanguageProvider');
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'en' | 'he';
type Translations = { [key: string]: string };

type I18nContextType = {
  locale: Locale;
  t: (key: string) => string;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<{ [lang in Locale]?: Translations }>({});

  // Load translations
  useEffect(() => {
    const fetchTranslations = async () => {
      const res = await fetch('/translation.json');
      const data = await res.json();
      setTranslations(data);
    };

    fetchTranslations();
  }, []);

  // Set document direction and html lang
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'he' : 'en'));
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

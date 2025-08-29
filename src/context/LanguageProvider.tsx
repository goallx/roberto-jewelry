'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import i18n from '@/lib/i18n';

type Lang = 'en' | 'he';

const LanguageContext = createContext<{
  lang: Lang;
  toggleLang: () => void;
}>({
  lang: 'en',
  toggleLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    i18n.changeLanguage(lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'he' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

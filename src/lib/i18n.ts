import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend'; // Add this import
import LanguageDetector from 'i18next-browser-languagedetector'; // Add this import

// Remove the direct import of translation.json
// import translation from '@/locales/translation.json';

i18n
  .use(Backend) // Add backend plugin
  .use(LanguageDetector) // Add language detector plugin
  .use(initReactI18next)
  .init({
    // Remove the resources property since we're loading from backend
    // resources: translation,
    
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable debug only in development
    
    // Configure backend to load translations from public folder
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Configure detection options
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
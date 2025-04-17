
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Import translations
import en from './locales/en';
import sw from './locales/sw';
import fr from './locales/fr';
import es from './locales/es';

export const resources = {
  en: {
    translation: en
  },
  sw: {
    translation: sw
  },
  fr: {
    translation: fr
  },
  es: {
    translation: es
  }
};

// Available languages
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export const useLanguage = () => {
  const [language, setLanguage] = useLocalStorage('language', i18n.language);
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };
  
  return { language, changeLanguage, languages };
};

export default i18n;

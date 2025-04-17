
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useEffect } from 'react';

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
  
  // Apply the stored language when component mounts
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    
    // Set HTML lang attribute for accessibility
    document.documentElement.setAttribute("lang", lang);
    
    // Update any text-to-speech settings if needed
    // This depends on how your TTS is implemented
  };
  
  return { language, changeLanguage, languages };
};

// Set the initial HTML lang attribute
document.documentElement.setAttribute("lang", i18n.language);

export default i18n;

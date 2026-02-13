import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, getTranslation } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('language');
    if (saved && ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'hi', 'pt', 'ru'].includes(saved)) {
      return saved as Language;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'hi', 'pt', 'ru'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Set document direction for RTL languages
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  useEffect(() => {
    // Set initial direction
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    }
  }, []);

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

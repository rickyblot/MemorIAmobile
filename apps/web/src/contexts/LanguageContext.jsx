import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';
import { getStoredLanguage, setStoredLanguage, getDefaultLanguage } from '@/lib/languageUtils';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState(getDefaultLanguage());

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = (langCode) => {
    if (LANGUAGES.some(l => l.code === langCode)) {
      setCurrentLanguageState(langCode);
      setStoredLanguage(langCode);
    }
  };

  const t = (key, vars) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    if (value === undefined) {
      value = translations['en'];
      for (const k of keys) {
        if (value === undefined) return key;
        value = value[k];
      }
    }
    let result = value || key;
    if (typeof result === 'string' && vars && typeof vars === 'object') {
      for (const [name, replacement] of Object.entries(vars)) {
        result = result.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, availableLanguages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};
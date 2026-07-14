export const getStoredLanguage = () => {
  try {
    const item = localStorage.getItem('language');
    return item ? item : null;
  } catch (error) {
    return null;
  }
};

export const setStoredLanguage = (lang) => {
  try {
    localStorage.setItem('language', lang);
  } catch (error) {
    console.warn('Failed to save language to localStorage');
  }
};

export const getDefaultLanguage = () => {
  const stored = getStoredLanguage();
  if (stored) return stored;
  
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.split('-')[0];
    const supported = ['en', 'es', 'fr', 'de', 'pt', 'it'];
    if (supported.includes(browserLang)) {
      return browserLang;
    }
  }
  return 'en';
};
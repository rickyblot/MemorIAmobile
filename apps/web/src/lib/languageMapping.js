export const getLanguageName = (languageCode) => {
  const mapping = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese',
    it: 'Italian'
  };
  
  return mapping[languageCode] || 'English';
};
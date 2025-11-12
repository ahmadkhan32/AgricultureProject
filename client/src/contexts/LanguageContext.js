import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE, detectBrowserLanguage } from '../config/languages';

// Import translation files
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';
import arTranslations from '../locales/ar.json';
import comTranslations from '../locales/com.json';

const LanguageContext = createContext({});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState(enTranslations);
  const [isRTL, setIsRTL] = useState(false);

  // Translation files mapping
  const translationFiles = {
    en: enTranslations,
    fr: frTranslations,
    ar: arTranslations,
    com: comTranslations,
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    const languageToUse = savedLanguage || detectBrowserLanguage();
    setLanguage(languageToUse);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Set language and update translations
  const setLanguage = (languageCode) => {
    const upperCode = languageCode.toUpperCase();
    if (!LANGUAGES[upperCode]) {
      console.warn(`Language ${languageCode} not supported, falling back to ${DEFAULT_LANGUAGE}`);
      setCurrentLanguage(DEFAULT_LANGUAGE);
      setTranslations(translationFiles[DEFAULT_LANGUAGE]);
      const defaultUpper = DEFAULT_LANGUAGE.toUpperCase();
      setIsRTL(LANGUAGES[defaultUpper]?.rtl || false);
      return;
    }

    const language = LANGUAGES[upperCode];
    setCurrentLanguage(languageCode.toLowerCase());
    setTranslations(translationFiles[languageCode.toLowerCase()] || translationFiles[DEFAULT_LANGUAGE]);
    setIsRTL(language.rtl);
    
    // Save to localStorage
    localStorage.setItem('preferred-language', languageCode);
    
    // Update document direction and language
    document.documentElement.lang = languageCode;
    document.documentElement.dir = language.direction;
    
    // Update body class for RTL support
    if (language.rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  // Translation function with interpolation support
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`);
        return key; // Return the key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value for key "${key}" is not a string`);
      return key;
    }
    
    // Replace parameters in the translation
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  };

  // Get current language info
  const getCurrentLanguageInfo = () => {
    const upperCode = currentLanguage.toUpperCase();
    return LANGUAGES[upperCode] || LANGUAGES[DEFAULT_LANGUAGE.toUpperCase()];
  };

  // Get all available languages
  const getAvailableLanguages = () => {
    return Object.values(LANGUAGES);
  };

  // Check if a language is RTL
  const checkIsRTL = (languageCode) => {
    const language = LANGUAGES[languageCode.toUpperCase()];
    return language ? language.rtl : false;
  };

  // Format number according to current language
  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(currentLanguage, options).format(number);
    } catch (error) {
      console.warn('Error formatting number:', error);
      return number.toString();
    }
  };

  // Format date according to current language
  const formatDate = (date, options = {}) => {
    try {
      const dateObj = new Date(date);
      return new Intl.DateTimeFormat(currentLanguage, options).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return date.toString();
    }
  };

  // Format currency according to current language
  const formatCurrency = (amount, currency = 'KMF', options = {}) => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency,
        ...options,
      }).format(amount);
    } catch (error) {
      console.warn('Error formatting currency:', error);
      return `${amount} ${currency}`;
    }
  };

  // Get plural form for a key
  const tPlural = (key, count, params = {}) => {
    const pluralKey = count === 1 ? `${key}_one` : `${key}_other`;
    return t(pluralKey, { count, ...params });
  };

  // Context value
  const value = {
    // Current language state
    currentLanguage,
    translations,
    isRTL,
    
    // Language management
    setLanguage,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    checkIsRTL,
    
    // Translation functions
    t,
    tPlural,
    
    // Formatting functions
    formatNumber,
    formatDate,
    formatCurrency,
    
    // Constants
    LANGUAGES,
    DEFAULT_LANGUAGE,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

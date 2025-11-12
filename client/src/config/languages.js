// Language configuration for Comorian context
// Prioritizing French and Comorian for Comoros
export const LANGUAGES = {
  FR: {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    rtl: false,
  },
  COM: {
    code: 'com',
    name: 'Comorian',
    nativeName: 'Shikomori',
    flag: '🇰🇲',
    direction: 'ltr',
    rtl: false,
  },
  EN: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    rtl: false,
  },
  AR: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    rtl: true,
  },
};

// Default to French for Comoros context
export const DEFAULT_LANGUAGE = LANGUAGES.FR.code;

export const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

// Language detection from browser
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map browser language to supported languages
  // Prioritize French and Comorian
  const languageMap = {
    'fr': LANGUAGES.FR.code,
    'com': LANGUAGES.COM.code,
    'en': LANGUAGES.EN.code,
    'ar': LANGUAGES.AR.code,
  };
  
  return languageMap[langCode] || DEFAULT_LANGUAGE;
};

// Get language direction
export const getLanguageDirection = (langCode) => {
  const language = Object.values(LANGUAGES).find(lang => lang.code === langCode);
  return language ? language.direction : 'ltr';
};

// Check if language is RTL
export const isRTL = (langCode) => {
  const language = Object.values(LANGUAGES).find(lang => lang.code === langCode);
  return language ? language.rtl : false;
};

export default LANGUAGES;

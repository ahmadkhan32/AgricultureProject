// Language configuration for Comorian context
export const LANGUAGES = {
  EN: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    rtl: false,
  },
  FR: {
    code: 'fr',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷',
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
  COM: {
    code: 'com',
    name: 'Comorian',
    nativeName: 'Shikomori',
    flag: '🇰🇲',
    direction: 'ltr',
    rtl: false,
  },
};

export const DEFAULT_LANGUAGE = LANGUAGES.EN.code;

export const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

// Language detection from browser
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Map browser language to supported languages
  const languageMap = {
    'en': LANGUAGES.EN.code,
    'fr': LANGUAGES.FR.code,
    'ar': LANGUAGES.AR.code,
    'com': LANGUAGES.COM.code,
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

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = ({ className = '', showLabel = true, size = 'default' }) => {
  const { currentLanguage, setLanguage, getCurrentLanguageInfo, getAvailableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangInfo = getCurrentLanguageInfo();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    default: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3',
  };

  // Check if we're in a dark navbar context (parent has dark background)
  const isDarkContext = className.includes('dark') || className.includes('navbar');
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-colors duration-200
          ${sizeClasses[size]}
          ${isDarkContext 
            ? 'bg-orange-500 hover:bg-orange-600 text-white border-0' 
            : 'bg-white border border-gray-300 hover:bg-gray-50'
          }
          ${isOpen ? 'ring-2 ring-primary-500 border-primary-500' : ''}
        `}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className={`w-4 h-4 ${isDarkContext ? 'text-white' : 'text-gray-600'}`} />
        {showLabel && (
          <span className={`font-medium ${isDarkContext ? 'text-white' : 'text-gray-700'}`}>
            {currentLangInfo.flag} {currentLangInfo.nativeName}
          </span>
        )}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isDarkContext ? 'text-white' : 'text-gray-500'
          } ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1" role="listbox">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center justify-between px-4 py-2 text-left
                    hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    transition-colors duration-150
                    ${currentLanguage === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                  `}
                  role="option"
                  aria-selected={currentLanguage === language.code}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-sm text-gray-500">{language.name}</div>
                    </div>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Compact version for mobile/small spaces
export const CompactLanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, setLanguage, getCurrentLanguageInfo, getAvailableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangInfo = getCurrentLanguageInfo();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLangInfo.flag}</span>
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-2 px-3 py-2 text-left
                    hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    transition-colors duration-150
                    ${currentLanguage === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                  `}
                  role="option"
                  aria-selected={currentLanguage === language.code}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  {currentLanguage === language.code && (
                    <Check className="w-3 h-3 text-primary-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Icon-only version
export const IconLanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, setLanguage, getCurrentLanguageInfo, getAvailableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangInfo = getCurrentLanguageInfo();
  const availableLanguages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
        aria-label={`Current language: ${currentLangInfo.nativeName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLangInfo.flag}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    w-full flex items-center space-x-2 px-3 py-2 text-left
                    hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                    transition-colors duration-150
                    ${currentLanguage === language.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}
                  `}
                  role="option"
                  aria-selected={currentLanguage === language.code}
                >
                  <span className="text-base">{language.flag}</span>
                  <span className="text-sm">{language.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;

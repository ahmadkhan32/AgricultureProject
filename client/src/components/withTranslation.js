import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Higher-order component for adding translation capabilities
export const withTranslation = (WrappedComponent) => {
  const WithTranslationComponent = (props) => {
    const { t, tPlural, formatNumber, formatDate, formatCurrency, currentLanguage, isRTL } = useLanguage();
    
    return (
      <WrappedComponent
        {...props}
        t={t}
        tPlural={tPlural}
        formatNumber={formatNumber}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        currentLanguage={currentLanguage}
        isRTL={isRTL}
      />
    );
  };

  WithTranslationComponent.displayName = `withTranslation(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithTranslationComponent;
};

// Hook for using translations in functional components
export const useTranslation = () => {
  const { t, tPlural, formatNumber, formatDate, formatCurrency, currentLanguage, isRTL } = useLanguage();
  
  return {
    t,
    tPlural,
    formatNumber,
    formatDate,
    formatCurrency,
    currentLanguage,
    isRTL,
  };
};

// Component for conditional rendering based on language
export const LanguageConditional = ({ children, languages = [], fallback = null }) => {
  const { currentLanguage } = useLanguage();
  
  if (languages.length === 0 || languages.includes(currentLanguage)) {
    return children;
  }
  
  return fallback;
};

// Component for rendering different content based on language
export const LanguageContent = ({ children, language, fallback = null }) => {
  const { currentLanguage } = useLanguage();
  
  if (currentLanguage === language) {
    return children;
  }
  
  return fallback;
};

// Component for rendering content for multiple languages
export const MultiLanguageContent = ({ children, fallback = null }) => {
  const { currentLanguage } = useLanguage();
  
  // If children is an object with language keys
  if (typeof children === 'object' && children !== null && !React.isValidElement(children)) {
    return children[currentLanguage] || fallback;
  }
  
  // If children is a function, call it with current language
  if (typeof children === 'function') {
    return children(currentLanguage);
  }
  
  // Otherwise, return children as is
  return children;
};

// Utility function for creating language-specific class names
export const useLanguageClasses = () => {
  const { isRTL, currentLanguage } = useLanguage();
  
  return {
    rtl: isRTL,
    ltr: !isRTL,
    direction: isRTL ? 'rtl' : 'ltr',
    language: currentLanguage,
    // Common RTL/LTR class combinations
    textAlign: isRTL ? 'text-right' : 'text-left',
    marginStart: isRTL ? 'mr-auto' : 'ml-auto',
    marginEnd: isRTL ? 'ml-auto' : 'mr-auto',
    paddingStart: isRTL ? 'pr-4' : 'pl-4',
    paddingEnd: isRTL ? 'pl-4' : 'pr-4',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
    // Flexbox utilities
    flexStart: isRTL ? 'justify-end' : 'justify-start',
    flexEnd: isRTL ? 'justify-start' : 'justify-end',
    itemsStart: isRTL ? 'items-end' : 'items-start',
    itemsEnd: isRTL ? 'items-start' : 'items-end',
  };
};

// Component for rendering formatted numbers
export const FormattedNumber = ({ value, options = {} }) => {
  const { formatNumber } = useLanguage();
  return formatNumber(value, options);
};

// Component for rendering formatted dates
export const FormattedDate = ({ value, options = {} }) => {
  const { formatDate } = useLanguage();
  return formatDate(value, options);
};

// Component for rendering formatted currency
export const FormattedCurrency = ({ value, currency = 'KMF', options = {} }) => {
  const { formatCurrency } = useLanguage();
  return formatCurrency(value, currency, options);
};

// Component for rendering translated text with parameters
export const TranslatedText = ({ translationKey, params = {}, fallback = null }) => {
  const { t } = useLanguage();
  const translatedText = t(translationKey, params);
  
  // If translation key is returned (meaning translation not found), use fallback
  if (translatedText === translationKey && fallback) {
    return fallback;
  }
  
  return translatedText;
};

// Component for rendering pluralized text
export const PluralizedText = ({ translationKey, count, params = {}, fallback = null }) => {
  const { tPlural } = useLanguage();
  const translatedText = tPlural(translationKey, count, params);
  
  // If translation key is returned (meaning translation not found), use fallback
  if (translatedText === translationKey && fallback) {
    return fallback;
  }
  
  return translatedText;
};

export default withTranslation;

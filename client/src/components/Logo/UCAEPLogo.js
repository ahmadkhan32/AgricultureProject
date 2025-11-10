import React from 'react';
import { Link } from 'react-router-dom';

const UCAEPLogo = ({ 
  size = 'medium', 
  showText = true, 
  showFullName = false,
  variant = 'default', // 'default', 'light', 'dark'
  className = '',
  linkTo = '/'
}) => {
  // Size configurations
  const sizes = {
    small: {
      emblem: 'w-12 h-12',
      topText: 'text-[8px]',
      acronym: 'text-xs',
      fullName: 'text-[8px]',
      spacing: 'space-y-0.5'
    },
    medium: {
      emblem: 'w-16 h-16 md:w-20 md:h-20',
      topText: 'text-xs md:text-sm',
      acronym: 'text-sm md:text-base',
      fullName: 'text-[10px] md:text-xs',
      spacing: 'space-y-1'
    },
    large: {
      emblem: 'w-20 h-20 md:w-24 md:h-24',
      topText: 'text-xs md:text-sm',
      acronym: 'text-sm md:text-base',
      fullName: 'text-[10px] md:text-xs',
      spacing: 'space-y-1'
    }
  };

  const config = sizes[size] || sizes.medium;

  // Color variants
  const colorVariants = {
    default: {
      topText: 'text-[#1e5f3a]',
      acronym: 'text-[#1e5f3a]',
      fullName: 'text-gray-700'
    },
    light: {
      topText: 'text-orange-400',
      acronym: 'text-orange-400',
      fullName: 'text-gray-300'
    },
    dark: {
      topText: 'text-white',
      acronym: 'text-white',
      fullName: 'text-gray-300'
    }
  };

  const colors = colorVariants[variant] || colorVariants.default;

  const alignment = className.includes('items-start') ? 'items-start' : 'items-center';
  const textAlignment = className.includes('items-start') ? 'text-left' : 'text-center';
  
  const LogoContent = () => (
    <div className={`flex flex-col ${alignment} ${config.spacing} ${className}`}>
      {/* Top Text */}
      {showText && (
        <div className={`${colors.topText} font-bold ${config.topText} uppercase tracking-tight`}>
          UNION DES COMORES
        </div>
      )}
      
      {/* Circular Emblem */}
      <div className={`relative ${config.emblem}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Upper Half - Green (Agriculture) */}
          <circle cx="100" cy="100" r="100" fill="#2d7a3f" />
          
          {/* Lower Half - Blue (Fisheries) */}
          <path d="M 0 100 Q 100 100 200 100 L 200 200 L 0 200 Z" fill="#1e3a5f" />
          
          {/* Grass/Leaves on left edge */}
          <path d="M 20 80 Q 15 60 20 50 Q 25 40 30 50 Q 25 60 20 80" fill="#1e5f3a" stroke="#1e5f3a" strokeWidth="2" />
          <path d="M 25 85 Q 20 65 25 55 Q 30 45 35 55 Q 30 65 25 85" fill="#1e5f3a" stroke="#1e5f3a" strokeWidth="2" />
          
          {/* Grass/Leaves on right edge */}
          <path d="M 180 80 Q 185 60 180 50 Q 175 40 170 50 Q 175 60 180 80" fill="#1e5f3a" stroke="#1e5f3a" strokeWidth="2" />
          <path d="M 175 85 Q 180 65 175 55 Q 170 45 165 55 Q 170 65 175 85" fill="#1e5f3a" stroke="#1e5f3a" strokeWidth="2" />
          
          {/* Wheat/Rice Stalks on left */}
          <path d="M 40 70 Q 35 50 40 40 Q 45 30 50 40" fill="#d4a574" stroke="#b8864a" strokeWidth="1.5" />
          <path d="M 45 75 Q 40 55 45 45 Q 50 35 55 45" fill="#d4a574" stroke="#b8864a" strokeWidth="1.5" />
          <path d="M 50 72 Q 45 52 50 42 Q 55 32 60 42" fill="#d4a574" stroke="#b8864a" strokeWidth="1.5" />
          
          {/* Cow Silhouette in center */}
          <path d="M 75 85 Q 70 75 75 70 Q 80 65 85 70 Q 90 75 95 80 Q 100 85 105 80 Q 110 75 115 70 Q 120 65 125 70 Q 130 75 125 85 Q 120 90 115 88 Q 110 86 105 88 Q 100 90 95 88 Q 90 86 85 88 Q 80 90 75 85" fill="#8b4513" />
          <circle cx="90" cy="75" r="3" fill="#8b4513" />
          <circle cx="110" cy="75" r="3" fill="#8b4513" />
          
          {/* Fish in blue section - Larger fish */}
          <path d="M 130 140 Q 150 130 160 140 Q 150 150 130 140" fill="white" />
          <path d="M 160 140 Q 170 135 175 140" stroke="white" strokeWidth="2" fill="none" />
          <circle cx="145" cy="138" r="2" fill="#1e3a5f" />
          
          {/* Smaller fish */}
          <path d="M 50 150 Q 65 145 75 150 Q 65 155 50 150" fill="white" />
          <path d="M 75 150 Q 80 148 85 150" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="62" cy="149" r="1.5" fill="#1e3a5f" />
        </svg>
      </div>
      
      {/* Bottom Text */}
      {showText && (
        <div className={`flex flex-col ${alignment}`}>
          <div className={`${colors.acronym} font-bold ${config.acronym} uppercase tracking-tight`}>
            UCAEP
          </div>
          {showFullName && (
            <div className={`${colors.fullName} ${config.fullName} ${textAlignment} leading-tight max-w-[200px]`}>
              Union des Chambres de l'Agriculture, de l'Élevage et de la Pêche
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default UCAEPLogo;


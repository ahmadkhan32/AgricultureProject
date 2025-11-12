import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../Images/Logo.jpeg';

const UCAEPLogo = ({ 
  size = 'medium', 
  showText = true, 
  showFullName = false,
  showFullNameBeforeLogo = false, // Show full name before the logo image
  variant = 'default', // 'default', 'light', 'dark'
  className = '',
  linkTo = '/'
}) => {
  // Size configurations
  const sizes = {
    small: {
      emblem: 'w-[100px] h-16 md:w-[100px] md:h-14', // Increased width for rectangular box
      topText: 'text-[8px]',
      acronym: 'text-xs',
      fullName: 'text-[8px]',
      spacing: 'space-y-0.5'
    },
    medium: {
      emblem: 'w-20 h-20 md:w-24 md:h-24',
      topText: 'text-xs md:text-sm',
      acronym: 'text-sm md:text-base',
      fullName: 'text-[10px] md:text-xs',
      spacing: 'space-y-1'
    },
    large: {
      emblem: 'w-24 h-24 md:w-[88px] md:h-20',
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
      topText: 'text-[#2d7a3f]', // Green for UNION DES COMORES
      acronym: 'text-[#2d7a3f]', // Green for UCAEP
      fullName: 'text-gray-800' // Dark grey/black for full name
    },
    light: {
      topText: 'text-white', // White for UNION DES COMORES on green background
      acronym: 'text-white', // White for UCAEP on green background
      fullName: 'text-white' // White for full name on green background
    },
    dark: {
      topText: 'text-[#2d7a3f]', // Green for UNION DES COMORES
      acronym: 'text-[#2d7a3f]', // Green for UCAEP
      fullName: 'text-gray-300' // Light grey for full name on dark background
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
      
      {/* Full Name Before Logo - if showFullNameBeforeLogo is true */}
      {showFullNameBeforeLogo && (
        <div className={`${colors.fullName} ${config.fullName} ${textAlignment} leading-tight max-w-[200px] mb-1`}>
          Union des Chambres de l'Agriculture, de l'Élevage et de la Pêche
        </div>
      )}
      
      {/* Square Box Emblem - Using Logo.jpeg image with white background */}
      <div className={`relative ${config.emblem} bg-white flex items-center justify-center p-1 border border-gray-200`}>
        <img 
          src={logoImage} 
          alt="UCAEP Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Bottom Text */}
      {showText && (
        <div className={`flex flex-col ${alignment}`}>
          <div className={`${colors.acronym} font-bold ${config.acronym} uppercase tracking-tight`}>
            UCAEP
          </div>
          {showFullName && !showFullNameBeforeLogo && (
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


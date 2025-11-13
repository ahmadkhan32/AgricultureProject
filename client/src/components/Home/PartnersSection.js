import React from 'react';
import { Globe, Building2, Users, Award } from 'lucide-react';

const PartnersSection = () => {
  const partners = [
    { name: 'FAO', logo: '/Images/fao.webp', type: 'International' },
    { name: 'Gouvernement des Comores', logo: null, type: 'Government' },
    { name: 'Union Européenne', logo: null, type: 'International' },
    { name: 'Banque Mondiale', logo: null, type: 'International' },
    { name: 'ONG Locales', logo: null, type: 'NGO' },
    { name: 'Secteur Privé', logo: null, type: 'Private' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'International':
        return Globe;
      case 'Government':
        return Building2;
      case 'NGO':
        return Users;
      case 'Private':
        return Award;
      default:
        return Building2;
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500 mb-3 sm:mb-4 uppercase tracking-wide">Nos Partenaires</h2>
          <p className="text-sm sm:text-base md:text-lg text-text-medium max-w-3xl mx-auto px-4">
            Organisations et institutions qui nous accompagnent dans notre mission
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {partners.map((partner, index) => {
            const Icon = getIcon(partner.type);
            return (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 bg-bg-light rounded-lg border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-12 sm:h-14 md:h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`${partner.logo ? 'hidden' : 'flex'} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-lg items-center justify-center mb-2 sm:mb-3 group-hover:bg-accent-100 transition-colors`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-500 group-hover:text-accent-500" />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-text-dark text-center mt-1 sm:mt-2 line-clamp-2">
                  {partner.name}
                </h3>
                <span className="text-[10px] sm:text-xs text-text-light mt-1">{partner.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;


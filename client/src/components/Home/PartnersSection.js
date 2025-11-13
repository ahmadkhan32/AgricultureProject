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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos Partenaires</h2>
          <p className="section-subtitle">
            Organisations et institutions qui nous accompagnent dans notre mission
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8">
          {partners.map((partner, index) => {
            const Icon = getIcon(partner.type);
            return (
              <div
                key={index}
                className="group flex flex-col items-center justify-center p-6 bg-bg-light rounded-lg border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`${partner.logo ? 'hidden' : 'flex'} w-16 h-16 bg-primary-100 rounded-lg items-center justify-center mb-3 group-hover:bg-accent-100 transition-colors`}
                >
                  <Icon className="w-8 h-8 text-primary-500 group-hover:text-accent-500" />
                </div>
                <h3 className="text-sm font-semibold text-text-dark text-center mt-2">
                  {partner.name}
                </h3>
                <span className="text-xs text-text-light mt-1">{partner.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;


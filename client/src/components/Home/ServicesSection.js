import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Users2, TrendingUp } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Users,
      title: 'Soutien aux Producteurs',
      description: 'Assistance complète pour les agriculteurs, éleveurs et pêcheurs',
      features: ['Conseil technique', 'Accès au marché', 'Normes de qualité'],
    },
    {
      icon: BookOpen,
      title: 'Programmes de Formation',
      description: 'Initiatives éducatives pour améliorer les compétences agricoles',
      features: ['Ateliers', 'Cours de certification', 'Bonnes pratiques'],
    },
    {
      icon: Users2,
      title: 'Développement de Partenariats',
      description: 'Connecter les producteurs avec des partenaires locaux et internationaux',
      features: ['Réseautage commercial', 'Opportunités d\'investissement', 'Collaboration'],
    },
    {
      icon: TrendingUp,
      title: 'Développement du Marché',
      description: 'Soutenir la croissance et l\'expansion des marchés agricoles',
      features: ['Recherche de marché', 'Assistance à l\'exportation', 'Développement de la chaîne de valeur'],
    },
  ];

  return (
    <section className="py-16 bg-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos Services</h2>
          <p className="section-subtitle text-white">
            Soutien complet pour les secteurs agricole, d'élevage et de pêche
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="btn-primary"
          >
            Explorer Tous les Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sprout, Users, Briefcase, Book } from 'lucide-react';

const ThematicsSection = () => {
  const thematics = [
    {
      icon: Sprout,
      title: 'Agroécologie',
      description: 'Promouvoir des pratiques agricoles durables et respectueuses de l\'environnement',
      image: '/Images/Farmning 1.jpg',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Users,
      title: 'Genre',
      description: 'Renforcer la participation et l\'autonomisation des femmes dans le secteur agricole',
      image: '/Images/pattern-light.jpg',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: Briefcase,
      title: 'Insertion',
      description: 'Faciliter l\'insertion professionnelle des jeunes dans les métiers agricoles',
      image: '/Images/pattern-light.jpg',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Book,
      title: 'Outils Méthodologiques',
      description: 'Développer et partager des outils pratiques pour améliorer les performances',
      image: '/Images/pattern-light.jpg',
      color: 'from-purple-500 to-violet-600',
    },
  ];

  return (
    <section className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos Thématiques</h2>
          <p className="section-subtitle">
            Les domaines d'intervention prioritaires pour le développement durable du secteur
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {thematics.map((thematic, index) => {
            const Icon = thematic.icon;
            return (
              <Link
                key={index}
                to="/resources"
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Background Image with Overlay */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={thematic.image}
                    alt={thematic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${thematic.color} opacity-80`}></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">
                      {thematic.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                      {thematic.description}
                    </p>
                    <div className="flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      En savoir plus
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThematicsSection;


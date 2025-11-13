import React from 'react';
import { Users, BookOpen, FileText, Network, Megaphone } from 'lucide-react';

const ActionsSection = () => {
  const actions = [
    {
      icon: Users,
      title: 'Accompagner',
      description: 'Soutenir les producteurs dans leur développement et leur croissance professionnelle',
      color: 'text-accent-500',
      bgColor: 'bg-accent-50',
    },
    {
      icon: Network,
      title: 'Connecter',
      description: 'Créer des liens entre les acteurs du secteur agricole, d\'élevage et de pêche',
      color: 'text-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      icon: BookOpen,
      title: 'Former',
      description: 'Développer les compétences à travers des programmes de formation adaptés',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: FileText,
      title: 'Documenter',
      description: 'Capitaliser et partager les connaissances et bonnes pratiques',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Megaphone,
      title: 'Mobiliser',
      description: 'Sensibiliser et mobiliser les acteurs autour des enjeux du secteur',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Nos Actions</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-2">
            Les actions clés que nous menons pour soutenir le développement agricole, d'élevage et de pêche aux Comores
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 hover:border-accent-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${action.color}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-primary-500 mb-2 sm:mb-3 uppercase tracking-wide">
                  {action.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-medium leading-relaxed">
                  {action.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActionsSection;


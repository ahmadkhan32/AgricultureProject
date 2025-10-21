import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Users, BookOpen, Users2, TrendingUp } from 'lucide-react';
import crudService from '../services/crudService';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: servicesData, isLoading, error } = useQuery(
    ['services', { search: searchTerm, category: selectedCategory }],
    async () => {
      let filters = {};
      if (selectedCategory) filters.category = selectedCategory;

      const allServices = await crudService.services.fetchAll(filters);
      let filteredServices = allServices || [];

      if (searchTerm) {
        filteredServices = filteredServices.filter(
          (service) =>
            service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return { services: filteredServices };
    },
    { keepPreviousData: true }
  );

  const categories = [
    { value: '', label: 'Tous les services' },
    { value: 'support', label: 'Soutien aux producteurs' },
    { value: 'training', label: 'Programmes de formation' },
    { value: 'assistance', label: 'Programmes d’assistance' },
    { value: 'project', label: 'Projets' },
  ];

  const serviceIcons = {
    support: Users,
    training: BookOpen,
    assistance: Users2,
    project: TrendingUp,
  };

  const handleSearch = (e) => e.preventDefault();
  const handleCategoryChange = (category) => setSelectedCategory(category);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement des services</h2>
          <p className="text-gray-600">Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ==== En-tête ==== */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Nos Services
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
            Des programmes complets de soutien conçus pour renforcer les professionnels de l'agriculture,
            de l'élevage et de la pêche à travers les Comores.
          </p>
        </div>
      </section>

      {/* ==== Filtres ==== */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch sm:items-center justify-between">
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </form>

            {/* Filtre de catégorie */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="flex-1 sm:flex-none border border-gray-300 rounded-lg py-2 sm:py-2.5 px-3 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ==== Grille des services ==== */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {isLoading ? (
            // Chargement
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-6 animate-pulse">
                  <div className="h-24 sm:h-32 md:h-40 lg:h-48 bg-gray-200 rounded-lg mb-2 sm:mb-3 md:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : servicesData?.services?.length > 0 ? (
            // Liste des services
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {servicesData.services.map((service) => {
                const Icon = serviceIcons[service.category] || Users;
                return (
                  <div key={service.id} className="bg-white rounded-xl shadow p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    {service.image_url && (
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
                      />
                    )}

                    <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-600" />
                      </div>
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 truncate">
                        {service.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-4 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {service.content && (
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                        {service.content}
                      </p>
                    )}

                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center text-sm sm:text-base text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      En savoir plus
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            // Aucun service trouvé
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                {searchTerm || selectedCategory
                  ? 'Essayez d\'ajuster vos critères de recherche.'
                  : 'Revenez plus tard pour découvrir nos services disponibles.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==== Catégories de services ==== */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Catégories de services</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services conçus pour accompagner votre parcours agricole.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(serviceIcons).map(([category, Icon]) => (
              <div key={category} className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 capitalize">
                  {category.replace('_', ' ')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {category === 'suotion' && 'Nous offrons un accompagnement complet aux producteurs, incluant des conseils personnalisés, un suivi sur le terrain et des ressources adaptées pour améliorer leurs pratiques et leur rentabilité..'}
                  {category === 'Développement de capacités' && 'Nous mettons en œuvre des initiatives et des partenariats visant à renforcer les compétences des acteurs locaux, encourager l’innovation et construire des systèmes agricoles durables à long terme.'}
                  {category === 'Assistance' && 'Nous proposons une aide technique spécialisée et un appui financier ciblé pour permettre l’adoption de solutions durables et renforcer la résilience des producteurs.'}
                  {category === 'Projet' && 'Nous développons et mettons en œuvre des projets structurants en partenariat avec des acteurs locaux et internationaux, axés sur le développement des capacités, l’innovation locale et la transformation durable des filières agricoles.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==== Comment accéder aux services ==== */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Comment accéder à nos services</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Des étapes simples pour obtenir le soutien dont vous avez besoin.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Inscrivez-vous</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Créez votre compte et complétez votre profil producteur pour accéder à nos services.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Explorez</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Parcourez nos services et trouvez les programmes qui correspondent le mieux à vos besoins.
              </p>
            </div>

            <div className="p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Postulez</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Soumettez votre demande et notre équipe vous guidera tout au long du processus.
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/register" className="btn-primary text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4">
              Commencez dès aujourd'hui
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

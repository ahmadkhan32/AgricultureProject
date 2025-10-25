import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Fish, Heart, BookOpen, Users, Globe, Search, Filter, UserCheck, GraduationCap, Hand, Briefcase, Eye, ExternalLink } from "lucide-react";
import service1 from "../Images/Agricul (2).jpeg";
import service2 from "../Images/fisheries-management.jpg";
import service3 from "../Images/Livestock vaccines.jpg";
import service4 from "../Images/BRECOMA-1.jpg";
import contentService from "../services/contentService";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous les services");
  const [generatedServices, setGeneratedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load generated content on component mount
  useEffect(() => {
    const generated = contentService.getServices();
    setGeneratedServices(generated);
  }, []);

  // Handle read more click
  const handleReadMore = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const services = [
    {
      id: 1,
      title: "Soutien aux producteurs agricoles",
      category: "Soutien aux producteurs",
      icon: <Leaf className="w-10 h-10 text-green-600" />,
      image: service1,
      description:
        "Des programmes d'appui technique et logistique pour aider les agriculteurs à adopter des pratiques durables et à améliorer leur productivité.",
    },
    {
      id: 2,
      title: "Développement de la pêche",
      category: "Programmes de formation",
      icon: <Fish className="w-10 h-10 text-blue-600" />,
      image: service2,
      description:
        "Renforcement du secteur halieutique à travers la modernisation des équipements, la formation des pêcheurs et la protection des ressources marines.",
    },
    {
      id: 3,
      title: "Appui à l'élevage",
      category: "Programmes d'assistance",
      icon: <Heart className="w-10 h-10 text-amber-600" />,
      image: service3,
      description:
        "Des initiatives pour la santé animale, la nutrition du bétail et l'amélioration génétique afin d'assurer une production durable.",
    },
    {
      id: 4,
      title: "Formations et programmes d'appui",
      category: "Programmes de formation",
      icon: <BookOpen className="w-10 h-10 text-indigo-600" />,
      image: service4,
      description:
        "Des sessions de formation et des ateliers destinés à renforcer les compétences des producteurs dans les domaines agricoles et maritimes.",
    },
    {
      id: 5,
      title: "Projet de développement rural",
      category: "Projets",
      icon: <Globe className="w-10 h-10 text-purple-600" />,
      image: service1,
      description:
        "Projets structurants pour le développement des zones rurales et l'amélioration des infrastructures agricoles.",
    },
    {
      id: 6,
      title: "Accompagnement technique",
      category: "Soutien aux producteurs",
      icon: <Users className="w-10 h-10 text-green-600" />,
      image: service2,
      description:
        "Accompagnement personnalisé des producteurs pour l'adoption de nouvelles technologies et pratiques agricoles.",
    },
  ];

  const categories = [
    "Tous les services",
    "Soutien aux producteurs",
    "Programmes de formation",
    "Programmes d'assistance",
    "Projets",
  ];

  // Service categories data
  const serviceCategories = [
    {
      name: "Soutien",
      icon: UserCheck,
      description: "Nous offrons un accompagnement complet aux producteurs, incluant des conseils personnalisés, un suivi sur le terrain et des ressources adaptées pour améliorer leurs pratiques et leur rentabilité."
    },
    {
      name: "Développement de capacités",
      icon: GraduationCap,
      description: "Nous mettons en œuvre des initiatives et des partenariats visant à renforcer les compétences des acteurs locaux, encourager l'innovation et construire des systèmes agricoles durables à long terme."
    },
    {
      name: "Assistance",
      icon: Hand,
      description: "Nous proposons une aide technique spécialisée et un appui financier ciblé pour permettre l'adoption de solutions durables et renforcer la résilience des producteurs."
    },
    {
      name: "Projets",
      icon: Briefcase,
      description: "Nous développons et mettons en œuvre des projets structurants en partenariat avec des acteurs locaux et internationaux, axés sur le développement des capacités, l'innovation locale et la transformation durable des filières agricoles."
    }
  ];

  // Combine static and generated services
  const allServices = [...services, ...generatedServices.map(service => ({
    ...service,
    icon: <BookOpen className="w-10 h-10 text-blue-600" />,
    image: service.image || service1, // Use default image if none provided
    isGenerated: true
  }))];

  // Filter services based on search term and category
  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tous les services" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6 md:px-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
          <Users className="mr-2 w-5 h-5" />
          Nos Services
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Des programmes complets de soutien
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Conçus pour renforcer les professionnels de l'agriculture, de l'élevage et de la pêche à travers les Comores.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="pl-10 pr-4 py-2 border rounded-full w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            className="border rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-contain bg-gray-100"
              />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>{service.icon}</div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {service.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <button 
                  onClick={() => handleReadMore(service)}
                  className="mt-auto inline-flex items-center text-green-700 font-medium hover:underline"
                >
                  {service.isGenerated ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Lire l'article complet →
                    </>
                  ) : (
                    'En savoir plus →'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service trouvé</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== "Tous les services"
              ? "Essayez d'ajuster vos critères de recherche."
              : "Revenez plus tard pour découvrir nos services disponibles."}
          </p>
        </div>
      )}

      {/* Service Categories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Catégories de services</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services conçus pour accompagner votre parcours agricole.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {serviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="text-center p-4 sm:p-6 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Comment accéder à nos services</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">Des étapes simples pour obtenir le soutien dont vous avez besoin.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Inscrivez-vous</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Créez votre compte et complétez votre profil producteur pour accéder à nos services.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Explorez</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Parcourez nos services et trouvez les programmes qui correspondent le mieux à vos besoins.
              </p>
            </div>

            <div className="p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Postulez</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Soumettez votre demande et notre équipe vous guidera tout au long du processus.
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-colors">
              Commencez dès aujourd'hui
            </Link>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="mt-20 text-center bg-green-700 text-white py-12 rounded-3xl shadow-lg">
        <Globe className="mx-auto w-10 h-10 mb-4" />
        <h2 className="text-3xl font-bold mb-4">Partenariats et Coopérations</h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          Nous collaborons avec des institutions locales et internationales pour promouvoir le développement durable et renforcer les capacités des acteurs du secteur agricole et maritime.
        </p>
        <button className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition">
          Découvrir nos partenaires
        </button>
      </section>

      {/* Read More Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedService.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                />
              </div>
              
              <div className="prose max-w-none">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedService.category}
                  </span>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">{selectedService.description}</p>
                
                {selectedService.blogContent && (
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Article Complet</h3>
                    <div 
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedService.blogContent.replace(/\n/g, '<br/>') 
                      }}
                    />
                  </div>
                )}
                
                {selectedService.tags && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;

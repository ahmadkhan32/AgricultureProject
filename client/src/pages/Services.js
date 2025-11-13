import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Fish, Heart, BookOpen, Users, Globe, Search, Filter, UserCheck, GraduationCap, Hand, Briefcase, Eye, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import service1 from "../Images/Agricul (2).jpeg";
import service2 from "../Images/fisheries-management.jpg";
import service3 from "../Images/Livestock vaccines.jpg";
import service4 from "../Images/BRECOMA-1.jpg";
import enhancedContentService from "../services/enhancedCrudService";
import { fetchServices } from "../services/api";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous les services");
  const [generatedServices, setGeneratedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form state for animated submit button
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [submitState, setSubmitState] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  // Load services from backend API
  useEffect(() => {
    const loadServices = async () => {
      try {
        // Fetch from MySQL backend API
        const response = await fetchServices({ limit: 100 });
        const backendServices = response.services || [];
        
        // Transform backend services to match frontend format
        // Only show active services
        const transformedServices = backendServices
          .filter(service => service.status === 'active') // Only active services
          .map(service => {
            // Map backend categories to French display names
            const categoryMap = {
              'support': 'Soutien aux producteurs',
              'training': 'Programmes de formation',
              'assistance': 'Programmes d\'assistance',
              'project': 'Projets'
            };
            
            return {
              id: service.id,
              title: service.title,
              description: service.description,
              category: categoryMap[service.category] || 'Programmes de formation',
              backendCategory: service.category, // Keep original for filtering
              content: service.content || service.description,
              blogContent: service.content,
              tags: service.tags ? (Array.isArray(service.tags) ? service.tags : JSON.parse(service.tags || '[]')) : [],
              image: service.imageUrl || service.image_url,
              createdAt: service.createdAt || service.created_at,
              status: service.status,
              isGenerated: true
            };
          });
        
        setGeneratedServices(transformedServices);
      } catch (error) {
        console.error('❌ Error loading services from backend:', error);
        console.error('❌ Error response:', error.response);
        console.error('❌ Error response data:', error.response?.data);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error status:', error.response?.status);
        
        // Extract detailed error information
        const errorData = error.response?.data || {};
        const errorMessage = errorData.message || error.message || 'Unknown error';
        const errorType = errorData.errorType || 'Unknown';
        const originalError = errorData.originalError || errorData.error || '';
        
        console.error('📋 Error Details:', {
          message: errorMessage,
          type: errorType,
          originalError: originalError,
          status: error.response?.status,
          hint: errorData.hint
        });
        
        // Check if it's a table-not-found error
        if (errorMessage.includes('does not exist') || errorMessage.includes('table') || originalError.includes('doesn\'t exist')) {
          console.error('⚠️ Services table not found in database. Please run the SQL migration script.');
          console.error('📄 Check: database/services-table-xampp.sql');
          console.error('💡 Solution: Run the SQL script in phpMyAdmin to create the services table');
        }
        
        // Check if it's a database connection error
        if (errorMessage.includes('connection') || errorMessage.includes('Connection')) {
          console.error('⚠️ Database connection failed. Please check:');
          console.error('  1. Is MySQL/XAMPP running?');
          console.error('  2. Are database credentials correct in .env?');
          console.error('  3. Is the backend server running on port 5000?');
        }
        
        // Fallback to local storage
        try {
          const localServices = enhancedContentService.getLocalServices();
          setGeneratedServices(localServices);
        } catch (localError) {
          console.error('Error loading local services:', localError);
          setGeneratedServices([]);
        }
      }
    };
    loadServices();
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission with animation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state
    setSubmitState('loading');
    
    try {
      // Simulate API call to Supabase/backend
      const response = await fetch('/api/services/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Success state
        setSubmitState('success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            service: '',
            message: ''
          });
          setSubmitState('idle');
        }, 2000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      // Error state with fallback to localStorage
      console.error('Error submitting form:', error);
      
      // Save to localStorage as fallback
      const submissions = JSON.parse(localStorage.getItem('serviceSubmissions') || '[]');
      submissions.push({
        ...formData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('serviceSubmissions', JSON.stringify(submissions));
      
      setSubmitState('success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
        setSubmitState('idle');
      }, 2000);
    }
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
    <section className="bg-gray-50 min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm">
          <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Nos Services
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
          Des programmes complets de soutien
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-4">
          Conçus pour renforcer les professionnels de l'agriculture, de l'élevage et de la pêche à travers les Comores.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border rounded-full w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
          <select
            className="border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none w-full sm:w-auto text-sm sm:text-base"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-center">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-40 sm:h-48 object-contain bg-gray-100"
              />
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="scale-75 sm:scale-100">{service.icon}</div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {service.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2">
                  {service.title}
                </h3>
                 <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 line-clamp-3">{service.description}</p>
                 <button 
                   onClick={() => handleReadMore(service)}
                   className="mt-auto inline-flex items-center text-green-700 font-medium hover:underline text-sm sm:text-base"
                 >
                   {service.isGenerated ? (
                     <>
                       <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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

      {/* Contact Form with Animated Submit Button */}
      <section className="mt-20 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Demander un Service</h2>
          <p className="text-gray-600">Remplissez le formulaire ci-dessous pour demander des informations sur nos services</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="+269 XXX XX XX"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Service demandé
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              >
                <option value="">Sélectionnez un service</option>
                <option value="soutien">Soutien aux producteurs</option>
                <option value="formation">Formations et programmes d'appui</option>
                <option value="elevage">Appui à l'élevage</option>
                <option value="peche">Développement de la pêche</option>
                <option value="rural">Projets de développement rural</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Décrivez votre demande..."
            />
          </div>

          {/* Animated Submit Button */}
          <button
            type="submit"
            disabled={submitState === 'loading' || submitState === 'success'}
            className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-green-700 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden group"
          >
            {/* Loading State */}
            {submitState === 'loading' && (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </>
            )}

            {/* Success State */}
            {submitState === 'success' && (
              <>
                <CheckCircle className="w-5 h-5 animate-bounce" />
                <span>Envoyé avec succès!</span>
              </>
            )}

            {/* Idle State */}
            {submitState === 'idle' && (
              <>
                <span>Envoyer la demande</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}

            {/* Animated background effect */}
            {submitState === 'idle' && (
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-green-700 transition-transform duration-500 ease-in-out" />
            )}
          </button>
        </form>
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

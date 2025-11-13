import React, { useState, useEffect } from "react";
import { MapPin, Search, Leaf, Fish, PawPrint, Eye, ExternalLink } from "lucide-react";
import producer1 from "../Images/Ahmed_Photo.jpg";
import producer2 from "../Images/Ahmed_Said_gamaou.jpg";
import producer3 from "../Images/Ali_Mouignidah.jpg";
import crudService from "../services/crudService";

// Helper function to map business type to French
const mapBusinessTypeToFrench = (businessType) => {
  const typeMap = {
    'agriculture': 'Agriculture',
    'livestock': 'Élevage',
    'fisheries': 'Pêche',
    'mixed': 'Mixte'
  };
  return typeMap[businessType] || 'Agriculture';
};

// Helper function to get default image based on type
const getDefaultImage = (businessType) => {
  if (businessType === 'agriculture') return producer1;
  if (businessType === 'fisheries') return producer2;
  if (businessType === 'livestock') return producer3;
  return producer1;
};

// Static fallback producers
const staticProducers = [
  {
    id: 1,
    name: "Ahmed Ali",
    type: "Agriculture",
    region: "Grande Comore",
    products: ["Vanille", "Banane", "Clous de girofle"],
    image: producer1,
    description: "Producteur expérimenté spécialisé dans la culture de vanille et de bananes biologiques.",
    isGenerated: false
  },
  {
    id: 2,
    name: "Fatima Said",
    type: "Pêche",
    region: "Anjouan",
    products: ["Thon", "Poisson frais", "Crustacés"],
    image: producer2,
    description: "Pêcheuse professionnelle avec plus de 15 ans d'expérience dans la pêche traditionnelle.",
    isGenerated: false
  },
  {
    id: 3,
    name: "Omar Abdallah",
    type: "Élevage",
    region: "Mohéli",
    products: ["Bovins", "Volaille", "Lait frais"],
    image: producer3,
    description: "Éleveur passionné pratiquant l'élevage durable et respectueux de l'environnement.",
    isGenerated: false
  },
];

const Producers = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Toutes les régions");
  const [type, setType] = useState("Tous les types");
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load producers from API
  useEffect(() => {
    const loadProducers = async () => {
      try {
        setIsLoading(true);
        // Fetch approved producers from backend API
        const allProducers = await crudService.producers.fetchAll({ status: 'approved' });
        
        // Transform API data to match component format
        const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
        const baseUrl = API_URL.replace('/api', '');
        
        const transformedProducers = allProducers.map(producer => {
          // Ensure image URL is absolute
          let imageUrl = producer.image;
          if (imageUrl && imageUrl.startsWith('/uploads/')) {
            imageUrl = `${baseUrl}${imageUrl}`;
          } else if (!imageUrl || !imageUrl.startsWith('http')) {
            // Use default image if no image URL or invalid format
            imageUrl = getDefaultImage(producer.business_type);
          }
          
          return {
            id: producer.id,
            name: producer.name || producer.business_name,
            business_name: producer.business_name,
            type: mapBusinessTypeToFrench(producer.business_type),
            business_type: producer.business_type,
            region: producer.region,
            location: producer.location,
            products: Array.isArray(producer.products) 
              ? producer.products 
              : (typeof producer.products === 'string' ? JSON.parse(producer.products || '[]') : []),
            description: producer.description,
            image: imageUrl,
            contact_email: producer.contact_email,
            contact_phone: producer.contact_phone,
            website: producer.website,
            isGenerated: producer.is_ai_generated || false
          };
        });
        
        setProducers(transformedProducers);
      } catch (error) {
        console.error('Error loading producers:', error);
        // Fallback to static producers if API fails
        setProducers(staticProducers);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle read more click
  const handleReadMore = (producer) => {
    setSelectedProducer(producer);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProducer(null);
  };

  // Filter producers based on search, region, and type
  const filtered = producers.filter(
    (p) =>
      (region === "Toutes les régions" || p.region === region) &&
      (type === "Tous les types" || p.type === type) &&
      (p.name?.toLowerCase().includes(search.toLowerCase()) ||
       p.business_name?.toLowerCase().includes(search.toLowerCase()) ||
       p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section className="bg-gray-50 min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm">
          <Leaf className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Nos Producteurs
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
          Découvrez nos producteurs
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-4">
          Découvrez les agriculteurs, éleveurs et pêcheurs locaux membres de notre réseau.
          Connectez-vous avec les producteurs de votre région et explorez leurs produits.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Rechercher un producteur..."
            className="pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border rounded-full w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm sm:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            className="border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm sm:text-base w-full sm:w-auto"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option>Toutes les régions</option>
            <option>Grande Comore</option>
            <option>Anjouan</option>
            <option>Mohéli</option>
          </select>
          <select
            className="border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm sm:text-base w-full sm:w-auto"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Tous les types</option>
            <option>Agriculture</option>
            <option>Élevage</option>
            <option>Pêche</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8 sm:py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Chargement des producteurs...</p>
        </div>
      )}

      {/* Producers Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filtered.length > 0 ? filtered.map((producer) => (
          <div
            key={producer.id}
            className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={producer.image || getDefaultImage(producer.business_type)}
              alt={producer.name || producer.business_name}
              className="w-full h-48 sm:h-56 object-cover"
              onError={(e) => {
                // Fallback to default image if uploaded image fails to load
                if (e.target.src !== getDefaultImage(producer.business_type)) {
                  e.target.src = getDefaultImage(producer.business_type);
                }
              }}
            />
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {producer.region}
                </span>
                <span className="flex items-center">
                  {producer.type === "Agriculture" && <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />}
                  {producer.type === "Pêche" && <Fish className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                  {producer.type === "Élevage" && <PawPrint className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />}
                  <span className="ml-1">{producer.type}</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{producer.name || producer.business_name}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                {producer.description || `Produits : ${producer.products?.join(", ") || "Non spécifié"}`}
              </p>
              <button 
                onClick={() => handleReadMore(producer)}
                className="inline-flex items-center text-green-700 font-medium hover:underline text-sm sm:text-base"
              >
                {producer.isGenerated ? (
                  <>
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Lire le profil complet →
                  </>
                ) : (
                  'Voir le profil →'
                )}
              </button>
            </div>
          </div>
                )) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-gray-600 text-lg">No producers found matching your criteria.</p>
                  </div>
                )}
        </div>
      )}

      {/* Read More Modal */}
      {showModal && selectedProducer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProducer.name}</h2>
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
                  src={selectedProducer.image || getDefaultImage(selectedProducer.business_type)}
                  alt={selectedProducer.name || selectedProducer.business_name}
                  className="w-full h-64 object-cover bg-gray-100 rounded-lg"
                  onError={(e) => {
                    // Fallback to default image if uploaded image fails to load
                    const defaultImg = getDefaultImage(selectedProducer.business_type);
                    if (e.target.src !== defaultImg) {
                      e.target.src = defaultImg;
                    }
                  }}
                />
              </div>
              
              <div className="prose max-w-none">
                <div className="mb-4 flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {selectedProducer.type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedProducer.region}
                  </span>
                </div>
                
                <p className="text-lg text-gray-600 mb-6">{selectedProducer.description}</p>
                
                {selectedProducer.products && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Produits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducer.products.map((product, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProducer.blogContent && (
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Profil Complet</h3>
                    <div 
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedProducer.blogContent.replace(/\n/g, '<br/>') 
                      }}
                    />
                  </div>
                )}
                
                {selectedProducer.tags && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProducer.tags.map((tag, index) => (
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
                  Contacter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </section>
  );
};

export default Producers;

import React, { useState, useEffect } from "react";
import { MapPin, Search, Leaf, Fish, PawPrint, Eye, ExternalLink } from "lucide-react";
import producer1 from "../Images/Ahmed_Photo.jpg";
import producer2 from "../Images/Ahmed_Said_gamaou.jpg";
import producer3 from "../Images/Ali_Mouignidah.jpg";
import contentService from "../services/contentService";

const Producers = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Toutes les régions");
  const [type, setType] = useState("Tous les types");
  const [generatedProducers, setGeneratedProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load generated content on component mount
  useEffect(() => {
    const generated = contentService.getProducers();
    setGeneratedProducers(generated);
  }, []);

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

  // Combine static and generated producers
  const allProducers = [...staticProducers, ...generatedProducers];

  const filtered = allProducers.filter(
    (p) =>
      (region === "Toutes les régions" || p.region === region) &&
      (type === "Tous les types" || p.type === type) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6 md:px-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
          <Leaf className="mr-2 w-5 h-5" />
          Nos Producteurs
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Découvrez nos producteurs
            </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Découvrez les agriculteurs, éleveurs et pêcheurs locaux membres de notre réseau.
          Connectez-vous avec les producteurs de votre région et explorez leurs produits.
            </p>
          </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
            placeholder="Rechercher un producteur..."
            className="pl-10 pr-4 py-2 border rounded-full w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
                />
              </div>
                <select
          className="border rounded-full px-4 py-2"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option>Toutes les régions</option>
          <option>Grande Comore</option>
          <option>Anjouan</option>
          <option>Mohéli</option>
                </select>
              <select
          className="border rounded-full px-4 py-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Tous les types</option>
          <option>Agriculture</option>
          <option>Élevage</option>
          <option>Pêche</option>
              </select>
            </div>

      {/* Producers Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filtered.map((producer) => (
          <div
            key={producer.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={producer.image}
              alt={producer.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {producer.region}
                </span>
                <span className="flex items-center">
                  {producer.type === "Agriculture" && <Leaf className="w-4 h-4 text-green-600" />}
                  {producer.type === "Pêche" && <Fish className="w-4 h-4 text-blue-600" />}
                  {producer.type === "Élevage" && <PawPrint className="w-4 h-4 text-amber-600" />}
                  <span className="ml-1">{producer.type}</span>
                      </span>
                    </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{producer.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {producer.description || `Produits : ${producer.products?.join(", ") || "Non spécifié"}`}
              </p>
              <button 
                onClick={() => handleReadMore(producer)}
                className="inline-flex items-center text-green-700 font-medium hover:underline"
              >
                {producer.isGenerated ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Lire le profil complet →
                  </>
                ) : (
                  'Voir le profil →'
                )}
              </button>
                        </div>
                  </div>
                ))}
        </div>

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
                  src={selectedProducer.image}
                  alt={selectedProducer.name}
                  className="w-full h-64 object-cover bg-gray-100 rounded-lg"
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

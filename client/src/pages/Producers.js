import React, { useState } from "react";
import { MapPin, Search, Leaf, Fish, PawPrint } from "lucide-react";
import producer1 from "../Images/Ahmed_Photo.jpg";
import producer2 from "../Images/Ahmed_Said_gamaou.jpg";
import producer3 from "../Images/Ali_Mouignidah.jpg";

const Producers = () => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Toutes les régions");
  const [type, setType] = useState("Tous les types");

  const producers = [
    {
      id: 1,
      name: "Ahmed Ali",
      type: "Agriculture",
      region: "Grande Comore",
      products: ["Vanille", "Banane", "Clous de girofle"],
      image: producer1,
    },
    {
      id: 2,
      name: "Fatima Said",
      type: "Pêche",
      region: "Anjouan",
      products: ["Thon", "Poisson frais", "Crustacés"],
      image: producer2,
    },
    {
      id: 3,
      name: "Omar Abdallah",
      type: "Élevage",
      region: "Mohéli",
      products: ["Bovins", "Volaille", "Lait frais"],
      image: producer3,
    },
  ];

  const filtered = producers.filter(
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
                Produits : {producer.products.join(", ")}
              </p>
              <button className="inline-flex items-center text-green-700 font-medium hover:underline">
                Voir le profil →
              </button>
                        </div>
                  </div>
                ))}
        </div>
      </section>
  );
};

export default Producers;

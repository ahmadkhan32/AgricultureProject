import React from "react";
import { Calendar, ArrowRight, Newspaper, Megaphone, Fish, Tractor, PawPrint } from "lucide-react";
import agricultureNews from "../Images/Farmning 1.jpg";
import fisheriesNews from "../Images/fisheries-management.jpg";
import livestockNews from "../Images/Livestock vaccines.jpg";
import pressRelease from "../Images/fao.webp";
import eventNews from "../Images/BRECOMA-1.jpg";

const News = () => {
  const newsData = [
    {
      id: 1,
      category: "Agriculture",
      title: "Les Comores lancent une nouvelle initiative d’agriculture durable",
      date: "10 octobre 2025",
      image: agricultureNews,
      description:
        "Le ministère de l’Agriculture a introduit un nouveau programme visant à promouvoir l’agriculture biologique, réduire l’utilisation de pesticides chimiques et améliorer la santé des sols à travers les îles.",
    },
    {
      id: 2,
      category: "Pêches",
      title: "De nouveaux bateaux de pêche livrés aux communautés locales",
      date: "25 septembre 2025",
      image: fisheriesNews,
      description:
        "Afin de renforcer la capacité de pêche locale, le Département des Pêches a distribué 20 bateaux écologiques équipés de moteurs alimentés à l’énergie solaire.",
    },
    {
      id: 3,
      category: "Élevage",
      title: "Campagne de vaccination – Semaine de la santé du bétail 2025",
      date: "12 septembre 2025",
      image: livestockNews,
      description:
        "Plus de 5 000 animaux ont été vaccinés dans le cadre de la campagne de la Semaine de la santé du bétail, visant à prévenir les maladies contagieuses dans les zones rurales.",
    },
    {
      id: 4,
      category: "Communiqué officiel",
      title: "L’UCAEP s’associe à la FAO pour le développement agricole",
      date: "30 août 2025",
      image: pressRelease,
      description:
        "L’Union des Chambres d’Agriculture, d’Élevage et de Pêche (UCAEP) a signé un accord avec la FAO pour soutenir le développement rural durable aux Comores.",
    },
    {
      id: 5,
      category: "Événement à venir",
      title: "Forum national sur l’agriculture et la pêche 2025",
      date: "18 novembre 2025",
      image: eventNews,
      description:
        "Rejoignez les acteurs nationaux et les partenaires internationaux pour discuter de l’innovation, de la durabilité et de l’investissement dans les secteurs de l’agriculture et de la pêche.",
    },
  ];

  const categoryIcons = {
    Agriculture: <Tractor className="w-5 h-5 text-green-600" />,
    Pêches: <Fish className="w-5 h-5 text-blue-600" />,
    Élevage: <PawPrint className="w-5 h-5 text-amber-600" />,
    "Communiqué officiel": <Megaphone className="w-5 h-5 text-red-600" />,
    "Événement à venir": <Newspaper className="w-5 h-5 text-indigo-600" />,
  };

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 min-h-screen">
      {/* Section d’en-tête */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
          <Newspaper className="mr-2 w-5 h-5" />
          Actualités et annonces
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Dernières actualités de l’agriculture, de l’élevage et de la pêche
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Restez informé des derniers développements, communiqués officiels et événements à venir dans les secteurs agricoles, de l’élevage et de la pêche aux Comores.
        </p>
      </div>

      {/* Grille des actualités */}
      <div className="grid md:grid-cols-3 gap-8">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center space-x-2">
                  {categoryIcons[news.category]}
                  <span className="font-semibold text-gray-700">{news.category}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {news.date}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {news.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
              <button className="inline-flex items-center text-green-700 font-medium hover:underline">
                Lire la suite <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pied de page - Appel à l’action */}
      <div className="mt-20 text-center bg-green-700 text-white py-12 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Abonnez-vous pour recevoir nos actualités</h2>
        <p className="text-green-100 mb-6">
          Recevez les nouvelles, événements et annonces des secteurs agricoles et halieutiques des Comores directement dans votre boîte mail.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Entrez votre adresse e-mail"
            className="w-full px-4 py-3 rounded-full outline-none text-gray-800"
          />
          <button
            type="submit"
            className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition"
          >
            S’abonner
          </button>
        </form>
      </div>
    </section>
  );
};

export default News;

import React from 'react';
import { Users, Target, Award, Globe, MapPin, Phone, Mail } from 'lucide-react';
import AbdillahMsaidie from '../Images/Abdillah_Msaidie.jpg';
import AhmedSaidGamaou from '../Images/Ahmed_Photo.jpg';
import AliMouignidah from '../Images/Ali Ahmed gamaou.jpeg';

const About = () => {
  const team = [
    {
      name: 'Abdillah Msaidie',
      position: 'Président',
      image: AbdillahMsaidie,
      Objective: "Est l'exècutif de la chambre ,il  assume la responsabilité de tous les services de la chambre:convoque les assemblées,les présides est assure l'exécution des décision qui y sont prises."
    },
    {
      name: 'ALI MOUIGNIDAHO',
      position: 'president',
      image: AliMouignidah,
      bio: "Spécialiste en gestion du bétail et en programmes de développement rural."
    },
    {
      name: 'Ahmed mze Ali Said gamaou ',
      position: 'Directeur des Pêches',
      image: AhmedSaidGamaou,
      bio: "Le directeur assure la coordination des activités entre les chambres insulaires d'agriculture, d'élevage et de pêche, ainsi qu'au sein de l'UCAEP elle‑même."
    }
  ];

  const values = [
    {
      icon: Users,
      title: 'Communauté d’abord',
      description: 'Nous donnons la priorité aux besoins et au bien-être de nos membres de la communauté agricole.'
    },
    {
      icon: Target,
      title: 'Développement durable',
      description: 'Promouvoir des pratiques agricoles respectueuses de l’environnement et économiquement viables.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons les plus hauts standards dans tous nos programmes et services.'
    },
    {
      icon: Globe,
      title: 'Partenariat mondial',
      description: 'Construire de solides relations internationales pour le partage des connaissances et le développement.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Section Héro */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              À propos de l'UCAEP
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              La Chambre de l'Agriculture, de l'Élevage et des Pêches des Comores (UCAEP)
              est dédiée à la promotion du développement agricole durable et au soutien
              des producteurs locaux à travers l'archipel.
            </p>
          </div>
        </div>
      </section>

      {/* Mission et Vision */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div className="card">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">Notre Mission</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Promouvoir et soutenir le développement de l'agriculture, de l'élevage et des pêches
                aux Comores grâce au renforcement des capacités, au transfert de technologies,
                à l'accès aux marchés et aux pratiques durables qui profitent aux communautés locales
                et à l'environnement.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-lg">
                <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">Notre Vision</h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Être l'organisation de référence aux Comores qui transforme les secteurs de l'agriculture,
                de l'élevage et des pêches en industries durables, rentables et respectueuses de
                l'environnement, contribuant à la sécurité alimentaire et au développement économique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Nos Valeurs
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Les principes qui guident notre travail et définissent notre engagement envers la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Notre Histoire
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Un parcours de croissance et d'impact dans le secteur agricole comorien
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">2014</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    Fondation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  UCAEP a été créée par la loi pour structurer et soutenir le secteur agricole national.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">2018</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    Expansion
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Lancement de programmes de formation complets et création de partenariats
                    avec des organisations internationales pour le transfert de connaissances.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">2023</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    Transformation numérique
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Inauguration officielle d'une nouvelle ère technologique pour le secteur agricole comorien.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">2024</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                    Nouvelle ère, transformation numérique
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Mise en place de plateformes numériques complète pour connecter les producteurs, partager les connaissances et promouvoir les pratiques agricoles durables et d'outils modernes de communication pour mieux servir nos membres et partenaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Notre Équipe de Direction
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Rencontrez les professionnels dévoués qui dirigent la mission de l'UCAEP
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover"
                />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 leading-tight">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  {member.position}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {member.bio || member.Objective}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Contactez-nous
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Nous sommes là pour soutenir votre parcours agricole
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                Venez nous voir
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Route de la corniche, Moroni, Grande Comore<br />
                Union des Comores
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                Appelez-nous
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                +269 7332394<br />
                Lundi – Vendredi, 8h – 17h
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 leading-tight">
                Envoyez-nous un e-mail
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                contactcomores@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

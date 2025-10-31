import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowRight, Users, FileText, Users2, MapPin, Award, Globe, Star, CheckCircle, TrendingUp, Shield, Heart, Zap } from 'lucide-react';
import crudService from '../services/crudService';
import { useTranslation } from '../components/withTranslation';
import Hero from '../components/Home/Hero';
import StatsSection from '../components/Home/StatsSection';
import NewsSection from '../components/Home/NewsSection';
import ServicesSection from '../components/Home/ServicesSection';
import ProducersSection from '../components/Home/ProducersSection';

const Home = () => {
  const { t } = useTranslation();

  const { data: newsData, isLoading: newsLoading } = useQuery('home-news', async () => {
    try {
      const allNews = await crudService.news.fetchAll();
      return allNews.slice(0, 3);
    } catch (error) {
      console.error('Erreur lors du chargement des actualités :', error);
      return [];
    }
  });

  const features = [
    {
      icon: Users,
      title: t('home.features.producer_network.title'),
      description: t('home.features.producer_network.description'),
      link: '/producers',
      image: '/images/features/producer-network.jpg',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: FileText,
      title: t('home.features.latest_news.title'),
      description: t('home.features.latest_news.description'),
      link: '/news',
      image: '/images/features/latest-news.jpg',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Users2,
      title: t('home.features.partnerships.title'),
      description: t('home.features.partnerships.description'),
      link: '/partnerships',
      image: '/images/features/partnerships.jpg',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: MapPin,
      title: t('home.features.interactive_map.title'),
      description: t('home.features.interactive_map.description'),
      link: '/producers/map',
      image: '/images/features/interactive-map.jpg',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Sécurité Alimentaire',
      description: 'Renforcer la sécurité alimentaire des Comores',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      title: 'Développement Économique',
      description: 'Stimuler la croissance économique locale',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Heart,
      title: 'Communauté Unie',
      description: 'Créer une communauté agricole solidaire',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Promouvoir les technologies agricoles modernes',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const stats = [
    { label: 'Producteurs actifs', value: '1000', icon: Users },
    { label: 'Régions soutenues', value: '4', icon: MapPin },
    { label: 'Années de service', value: '15+', icon: Award },
    { label: 'Partenaires internationaux', value: '25+', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Section Héros */}
      <Hero />

      {/* Section Statistiques */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-100 py-6 sm:py-8 md:py-10 lg:py-12">
        <StatsSection stats={stats} />
      </section>

      {/* Section Fonctionnalités avec Images */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "url(/images/pattern-light.svg)", backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Pourquoi choisir l'UCAEP ?
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Nous offrons un soutien complet pour le développement de l'agriculture, de l'élevage et de la pêche aux Comores.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:scale-105 hover:-translate-y-2"
                >
                  {/* Image Header */}
                  <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90 flex items-center justify-center`}
                      style={{ display: 'none' }}
                    >
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                      {feature.description}
                    </p>
                    <Link
                      to={feature.link}
                      className={`inline-flex items-center text-xs sm:text-sm md:text-base ${feature.iconColor} hover:opacity-80 font-semibold transition-all duration-300 group-hover:translate-x-1`}
                    >
                      En savoir plus
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Bénéfices */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Nos Bénéfices
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Découvrez les avantages de rejoindre notre communauté agricole
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
        <NewsSection news={newsData} loading={newsLoading} />
      </section>

      {/* Section Services */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-8 sm:py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
            Nos Services
          </h2>
          <ServicesSection />
        </div>
      </section>

      {/* Section Producteurs */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <ProducersSection />
      </section>

      {/* Section Témoignages */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Témoignages
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
              Ce que disent nos membres de la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                name: "Ahmed Mohamed",
                role: "Producteur de Vanille",
                location: "Anjouan",
                content: "L'UCAEP m'a aidé à moderniser mes techniques de culture et à accéder à de nouveaux marchés.",
                rating: 5,
                image: "/images/testimonials/ahmed.jpg"
              },
              {
                name: "Fatima Ali",
                role: "Éleveuse",
                location: "Mohéli",
                content: "Grâce aux formations de l'UCAEP, j'ai pu améliorer la santé de mon bétail et augmenter mes revenus.",
                rating: 5,
                image: "/images/testimonials/fatima.jpg"
              },
              {
                name: "Omar Said",
                role: "Pêcheur",
                location: "Ngazidja",
                content: "Les conseils techniques et le soutien de l'UCAEP ont transformé ma pratique de la pêche.",
                rating: 5,
                image: "/images/testimonials/omar.jpg"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-3"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=random&color=fff&size=64`;
                    }}
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-2 sm:mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section d'Appel à l'action */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              Prêt à rejoindre notre communauté ?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-primary-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Inscrivez-vous comme producteur et connectez-vous avec la communauté agricole des Comores.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl transition-all duration-300 text-sm sm:text-base md:text-lg w-full xs:w-auto shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                S'inscrire maintenant
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl transition-all duration-300 text-sm sm:text-base md:text-lg w-full xs:w-auto shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

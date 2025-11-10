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
import ActionsSection from '../components/Home/ActionsSection';
import ThematicsSection from '../components/Home/ThematicsSection';
import PartnersSection from '../components/Home/PartnersSection';

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
      image: '/Images/pattern-light.jpg', // Fallback image
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Users2,
      title: t('home.features.partnerships.title'),
      description: t('home.features.partnerships.description'),
      link: '/partnerships',
      image: '/Images/pattern-light.jpg', // Fallback image
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: MapPin,
      title: t('home.features.interactive_map.title'),
      description: t('home.features.interactive_map.description'),
      link: '/producers/map',
      image: '/Images/pattern-light.jpg', // Fallback image
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Section Héros - Réseau FAR Style */}
      <Hero />

      {/* Section Statistiques / Quick Facts - Réseau FAR Style */}
      <StatsSection stats={stats} />

      {/* Section Nos Actions - Réseau FAR Style */}
      <ActionsSection />

      {/* Section Nos Thématiques - Réseau FAR Style */}
      <ThematicsSection />

      {/* Section Actualités / News - Réseau FAR Style */}
      <NewsSection news={newsData} loading={newsLoading} />

      {/* Section Partenaires / Partners - Réseau FAR Style */}
      <PartnersSection />

      {/* Section Services - Réseau FAR Style */}
      <section className="bg-primary-500 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-wide">Nos Services</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Soutien complet pour les secteurs agricole, d'élevage et de pêche
            </p>
          </div>
          <ServicesSection />
        </div>
      </section>

      {/* Section d'Appel à l'action - Réseau FAR Style */}
      <section className="py-16 lg:py-20 bg-primary-500 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-wide">
            Prêt à rejoindre notre communauté ?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Inscrivez-vous comme producteur et connectez-vous avec la communauté agricole des Comores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-base uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              S'inscrire maintenant
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-500 font-bold py-4 px-8 rounded-lg transition-all duration-300 text-base uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

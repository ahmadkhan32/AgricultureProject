import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Users, MapPin, Award, Globe, CheckCircle } from 'lucide-react';
import crudService from '../services/crudService';
import { useTranslation } from '../components/withTranslation';
import Hero from '../components/Home/Hero';
import StatsSection from '../components/Home/StatsSection';
import NewsSection from '../components/Home/NewsSection';
import ServicesSection from '../components/Home/ServicesSection';
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

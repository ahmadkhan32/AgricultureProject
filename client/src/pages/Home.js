import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowRight, Users, FileText, Users2, MapPin, Award, Globe } from 'lucide-react';
import crudService from '../services/crudService';
import { useTranslation } from '../components/withTranslation';
import Hero from '../components/Home/Hero';
import StatsSection from '../components/Home/StatsSection';
import NewsSection from '../components/Home/NewsSection';
import ServicesSection from '../components/Home/ServicesSection';
import ProducersSection from '../components/Home/ProducersSection';

const Home = () => {
  const { t } = useTranslation();
  
  const { data: newsData, isLoading: newsLoading } = useQuery(
    'home-news',
    async () => {
      try {
        const allNews = await crudService.news.fetchAll();
        // Get the latest 3 news articles
        return allNews.slice(0, 3);
      } catch (error) {
        console.error('Error fetching news for home page:', error);
        return [];
      }
    }
  );

  const features = [
    {
      icon: Users,
      title: t('home.features.producer_network.title'),
      description: t('home.features.producer_network.description'),
      link: '/producers',
    },
    {
      icon: FileText,
      title: t('home.features.latest_news.title'),
      description: t('home.features.latest_news.description'),
      link: '/news',
    },
    {
      icon: Users2,
      title: t('home.features.partnerships.title'),
      description: t('home.features.partnerships.description'),
      link: '/partnerships',
    },
    {
      icon: MapPin,
      title: t('home.features.interactive_map.title'),
      description: t('home.features.interactive_map.description'),
      link: '/producers/map',
    },
  ];

  const stats = [
    { label: 'Active Producers', value: '500+', icon: Users },
    { label: 'Supported Regions', value: '4', icon: MapPin },
    { label: 'Years of Service', value: '15+', icon: Award },
    { label: 'International Partners', value: '25+', icon: Globe },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose UCAEP?</h2>
            <p className="section-subtitle">
              We provide comprehensive support for agricultural, livestock, and fisheries development in the Comoros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection news={newsData} loading={newsLoading} />

      {/* Services Section */}
      <ServicesSection />

      {/* Producers Section */}
      <ProducersSection />

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Register as a producer and connect with the agricultural community in the Comoros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Register Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

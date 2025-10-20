import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import crudService from '../../services/crudService';

const ProducersSection = () => {
  const { data: producersData, isLoading } = useQuery(
    'home-producers',
    async () => {
      const allProducers = await crudService.producers.fetchAll();
      // Filter only approved producers and limit to 6
      return allProducers.filter(p => p.status === 'approved').slice(0, 6);
    }
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Producers</h2>
            <p className="section-subtitle">
              Discover local farmers, breeders, and fishers in our network
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-orange-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Featured Producers</h2>
          <p className="section-subtitle text-white">
            Discover local farmers, breeders, and fishers in our network
          </p>
        </div>

        {producersData && producersData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {producersData.map((producer) => (
              <div key={producer.id} className="card hover:shadow-lg transition-shadow">
                {producer.images && producer.images.length > 0 && (
                  <img
                    src={producer.images[0]}
                    alt={producer.business_name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {producer.region}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {producer.business_name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {producer.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {producer.business_type}
                  </span>
                  <Link
                    to={`/producers/${producer.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Profile
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-white">No producers available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/producers"
              className="btn-primary"
            >
              View All Producers
            </Link>
            <Link
              to="/producers/map"
              className="btn-outline"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProducersSection;

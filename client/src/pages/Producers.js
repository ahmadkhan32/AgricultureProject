import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, ArrowRight, Users, Map } from 'lucide-react';
import crudService from '../services/crudService';
import { ensureProducersData } from '../utils/populateNewsData';

const Producers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: producersData, isLoading, error } = useQuery(
    ['producers', { search: searchTerm, region: selectedRegion, business_type: selectedType, page: currentPage }],
    async () => {
      try {
        // Ensure producers data exists
        await ensureProducersData();
        
        const allProducers = await crudService.producers.fetchAll();
        
        // Filter producers based on search term, region, and business type
        let filteredProducers = allProducers.filter(producer => producer.status === 'approved');
        
        if (searchTerm) {
          filteredProducers = filteredProducers.filter(producer => 
            producer.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (producer.products && producer.products.some(product => 
              product.toLowerCase().includes(searchTerm.toLowerCase())
            ))
          );
        }
        
        if (selectedRegion) {
          filteredProducers = filteredProducers.filter(producer => producer.region === selectedRegion);
        }
        
        if (selectedType) {
          filteredProducers = filteredProducers.filter(producer => producer.business_type === selectedType);
        }
        
        // Sort by created_at date (newest first)
        filteredProducers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        // Pagination
        const limit = 12;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducers = filteredProducers.slice(startIndex, endIndex);
        
        return {
          producers: paginatedProducers || [],
          pagination: {
            currentPage,
            pages: Math.ceil((filteredProducers.length || 0) / limit),
            total: filteredProducers.length || 0
          }
        };
      } catch (error) {
        console.error('Error fetching producers:', error);
        throw error;
      }
    },
    {
      keepPreviousData: true,
    }
  );

  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'Grande Comore', label: 'Grande Comore' },
    { value: 'Anjouan', label: 'Anjouan' },
    { value: 'Mohéli', label: 'Mohéli' },
    { value: 'Mayotte', label: 'Mayotte' },
  ];

  const businessTypes = [
    { value: '', label: 'All Types' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'fisheries', label: 'Fisheries' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFilterChange = (filter, value) => {
    if (filter === 'region') setSelectedRegion(value);
    if (filter === 'type') setSelectedType(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Producers</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Producers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover local farmers, breeders, and fishers who are part of our network. 
              Connect with producers in your region and explore their products and services.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search producers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="input-field"
                >
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedType}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Map View Button */}
            <Link
              to="/producers/map"
              className="btn-outline flex items-center"
            >
              <Map className="w-4 h-4 mr-2" />
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* Producers Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : producersData?.producers?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {producersData.producers.map((producer) => (
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

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {producer.business_name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {producer.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {producer.business_type}
                      </span>
                    </div>

                    {producer.products && producer.products.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Products:</p>
                        <div className="flex flex-wrap gap-1">
                          {producer.products.slice(0, 3).map((product, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              {product}
                            </span>
                          ))}
                          {producer.products.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{producer.products.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/producers/${producer.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {producersData.pagination && producersData.pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, producersData.pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(producersData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === producersData.pagination.pages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No producers found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedRegion || selectedType
                  ? 'Try adjusting your search criteria.'
                  : 'Check back later for producer profiles.'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Producer Network Statistics</h2>
            <p className="section-subtitle">
              Our growing community of agricultural professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {producersData?.pagination?.total || 0}
              </div>
              <div className="text-gray-600">Total Producers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4</div>
              <div className="text-gray-600">Regions Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4</div>
              <div className="text-gray-600">Business Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Verified Profiles</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Producer Network
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Register your business and connect with the agricultural community in the Comoros
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Producers;

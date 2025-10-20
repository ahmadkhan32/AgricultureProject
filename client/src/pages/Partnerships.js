import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, Globe, Users2, ArrowRight, Building, Users } from 'lucide-react';
import crudService from '../services/crudService';
import { ensurePartnershipsData } from '../utils/populateNewsData';

const Partnerships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const { data: partnershipsData, isLoading, error } = useQuery(
    ['partnerships', { search: searchTerm, partner_type: selectedType }],
    async () => {
      try {
        // Ensure partnerships data exists
        await ensurePartnershipsData();
        
        const allPartnerships = await crudService.partnerships.fetchAll();
        
        // Filter partnerships based on search term and partner type
        let filteredPartnerships = allPartnerships;
        
        if (searchTerm) {
          filteredPartnerships = filteredPartnerships.filter(partnership => 
            partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partnership.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (partnership.organization && partnership.organization.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        if (selectedType) {
          filteredPartnerships = filteredPartnerships.filter(partnership => partnership.partner_type === selectedType);
        }
        
        // Sort by created_at date (newest first)
        filteredPartnerships.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return {
          partnerships: filteredPartnerships || []
        };
      } catch (error) {
        console.error('Error fetching partnerships:', error);
        throw error;
      }
    },
    {
      keepPreviousData: true,
    }
  );

  const partnerTypes = [
    { value: '', label: 'All Partners' },
    { value: 'local', label: 'Local Partners' },
    { value: 'international', label: 'International Partners' },
    { value: 'government', label: 'Government' },
    { value: 'ngo', label: 'NGOs' },
    { value: 'private', label: 'Private Sector' },
  ];

  const typeIcons = {
    local: Users,
    international: Globe,
    government: Building,
    ngo: Users2,
    private: Building,
  };

  const typeColors = {
    local: 'bg-blue-100 text-blue-600',
    international: 'bg-green-100 text-green-600',
    government: 'bg-purple-100 text-purple-600',
    ngo: 'bg-orange-100 text-orange-600',
    private: 'bg-gray-100 text-gray-600',
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Partnerships</h2>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partnerships</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building strong relationships with local and international organizations 
              to advance agricultural development in the Comoros.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search partnerships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                {partnerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
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
          ) : partnershipsData?.partnerships?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnershipsData.partnerships.map((partnership) => {
                const Icon = typeIcons[partnership.partner_type] || Building;
                const colorClass = typeColors[partnership.partner_type] || 'bg-gray-100 text-gray-600';
                
                return (
                  <div key={partnership.id} className="card hover:shadow-lg transition-shadow">
                    {partnership.logo_url && (
                      <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <img
                          src={partnership.logo_url}
                          alt={partnership.name}
                          className="max-h-24 max-w-full object-contain"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {partnership.partner_type.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {partnership.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {partnership.description}
                    </p>

                    {partnership.website && (
                      <a
                        href={partnership.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Visit Website
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No partnerships found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedType 
                  ? 'Try adjusting your search criteria.'
                  : 'Check back later for partnership information.'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Types Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Partnership Categories</h2>
            <p className="section-subtitle">
              We collaborate with diverse organizations to maximize our impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {Object.entries(typeIcons).map(([type, Icon]) => (
              <div key={type} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {type === 'local' && 'Local organizations and businesses'}
                  {type === 'international' && 'Global development partners'}
                  {type === 'government' && 'Government agencies and ministries'}
                  {type === 'ngo' && 'Non-governmental organizations'}
                  {type === 'private' && 'Private sector companies'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Benefits of Partnership</h2>
            <p className="section-subtitle">
              Why organizations choose to partner with UCAEP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Access to a network of agricultural professionals across the Comoros and beyond.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Make a meaningful difference in the lives of local farmers, breeders, and fishers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaborative Growth</h3>
              <p className="text-gray-600">
                Work together to develop innovative solutions for sustainable agriculture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Interested in Partnering with Us?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our network of partners and help us advance agricultural development in the Comoros
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;

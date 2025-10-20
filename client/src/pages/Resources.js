import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Search, Filter, Download, FileText, File, BookOpen, BarChart, Scale } from 'lucide-react';
import crudService from '../services/crudService';
import { ensureResourcesData } from '../utils/populateNewsData';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: resourcesData, isLoading, error } = useQuery(
    ['resources', { search: searchTerm, category: selectedCategory, page: currentPage }],
    async () => {
      try {
        // Ensure resources data exists
        await ensureResourcesData();
        
        const allResources = await crudService.resources.fetchAll();
        
        // Filter resources based on search term and category
        let filteredResources = allResources;
        
        if (searchTerm) {
          filteredResources = filteredResources.filter(resource => 
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.tags && resource.tags.some(tag => 
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
          );
        }
        
        if (selectedCategory) {
          filteredResources = filteredResources.filter(resource => resource.category === selectedCategory);
        }
        
        // Sort by download_count (most downloaded first)
        filteredResources.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
        
        // Pagination
        const limit = 12;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedResources = filteredResources.slice(startIndex, endIndex);
        
        return {
          resources: paginatedResources || [],
          pagination: {
            currentPage,
            pages: Math.ceil((filteredResources.length || 0) / limit),
            total: filteredResources.length || 0
          }
        };
      } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
      }
    },
    {
      keepPreviousData: true,
    }
  );

  const categories = [
    { value: '', label: 'All Resources' },
    { value: 'document', label: 'Documents' },
    { value: 'form', label: 'Forms' },
    { value: 'report', label: 'Reports' },
    { value: 'law', label: 'Laws & Regulations' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'guide', label: 'Guides' },
  ];

  const categoryIcons = {
    document: FileText,
    form: File,
    report: BarChart,
    law: Scale,
    statistics: BarChart,
    guide: BookOpen,
  };

  const categoryColors = {
    document: 'bg-blue-100 text-blue-600',
    form: 'bg-green-100 text-green-600',
    report: 'bg-purple-100 text-purple-600',
    law: 'bg-red-100 text-red-600',
    statistics: 'bg-yellow-100 text-yellow-600',
    guide: 'bg-indigo-100 text-indigo-600',
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleDownload = async (resource) => {
    try {
      // In a real application, this would trigger the download
      window.open(resource.file_url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Resources</h2>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access documents, forms, reports, and other resources to support your 
              agricultural, livestock, and fisheries activities.
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
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : resourcesData?.resources?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourcesData.resources.map((resource) => {
                  const Icon = categoryIcons[resource.category] || FileText;
                  const colorClass = categoryColors[resource.category] || 'bg-gray-100 text-gray-600';
                  
                  return (
                    <div key={resource.id} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                            {resource.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      {resource.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                          {resource.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{resource.file_type.toUpperCase()}</span>
                        {resource.file_size && (
                          <span>{formatFileSize(resource.file_size)}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {resource.download_count} downloads
                        </span>
                        <button
                          onClick={() => handleDownload(resource)}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {resourcesData.pagination && resourcesData.pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, resourcesData.pagination.pages) }, (_, i) => {
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
                      onClick={() => setCurrentPage(Math.min(resourcesData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === resourcesData.pagination.pages}
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
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria.'
                  : 'Check back later for available resources.'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Resource Categories</h2>
            <p className="section-subtitle">
              Find the information you need across different resource types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <div key={category} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category === 'document' && 'Official documents and publications'}
                  {category === 'form' && 'Application forms and templates'}
                  {category === 'report' && 'Research reports and studies'}
                  {category === 'law' && 'Laws, regulations, and policies'}
                  {category === 'statistics' && 'Data and statistical information'}
                  {category === 'guide' && 'How-to guides and manuals'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Most Downloaded Resources</h2>
            <p className="section-subtitle">
              Popular documents and resources from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would typically show the most downloaded resources */}
            <div className="card">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm text-gray-500">Document</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Agricultural Best Practices Guide</h3>
              <p className="text-gray-600 text-sm mb-3">Comprehensive guide for sustainable farming practices</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">1,234 downloads</span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-3">
                <File className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-500">Form</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Producer Registration Form</h3>
              <p className="text-gray-600 text-sm mb-3">Application form for new producer members</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">856 downloads</span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center mb-3">
                <BarChart className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm text-gray-500">Report</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Annual Agricultural Report 2023</h3>
              <p className="text-gray-600 text-sm mb-3">Comprehensive overview of agricultural sector performance</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">642 downloads</span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;

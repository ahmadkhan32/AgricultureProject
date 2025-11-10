import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, File, BookOpen, BarChart } from 'lucide-react';
import { fetchResources } from '../services/api';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load resources from backend API
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        // Fetch from MySQL backend API
        const params = { limit: 100 };
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await fetchResources(params);
        const backendResources = response.resources || [];
        
        // Transform backend resources to match frontend format
        const transformedResources = backendResources.map(resource => {
          // Map backend categories to display names
          const categoryMap = {
            'reports': 'Reports',
            'guidelines': 'Guidelines',
            'forms': 'Forms',
            'documents': 'Documents',
            'others': 'Others'
          };
          
          return {
            id: resource.id,
            title: resource.title,
            description: resource.description,
            category: categoryMap[resource.category] || resource.category,
            backendCategory: resource.category, // Keep original for filtering
            fileUrl: resource.fileUrl || resource.file_url,
            fileType: resource.fileType || resource.file_type,
            fileSize: resource.fileSize || resource.file_size,
            downloadCount: resource.downloadCount || resource.download_count || 0,
            createdAt: resource.createdAt || resource.created_at,
            status: resource.status,
            isGenerated: true
          };
        });
        
        setResources(transformedResources);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading resources from backend:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error response data:', err.response?.data);
        const errorData = err.response?.data || {};
        const errorMessage = errorData.message || err.message || 'Failed to load resources';
        const originalError = errorData.originalError || errorData.error || '';
        
        console.error('📋 Error Details:', {
          message: errorMessage,
          type: errorData.errorType || 'Unknown',
          originalError: originalError,
          status: err.response?.status,
          hint: errorData.hint
        });
        
        // Check if it's a table-not-found error
        if (errorMessage.includes('does not exist') || errorMessage.includes('table') || originalError.includes('doesn\'t exist')) {
          console.error('⚠️ Resources table not found in database. Please run the SQL migration script.');
          console.error('📄 Check: database/resources-table-setup.sql');
          console.error('💡 Solution: Run the SQL script in phpMyAdmin to create/update the resources table');
        }
        
        // Check if it's a missing status column error
        if (errorMessage.includes('status column') || originalError.includes('status')) {
          console.error('⚠️ Resources table is missing the status column.');
          console.error('📄 Check: database/resources-table-setup.sql');
          console.error('💡 Solution: Run the SQL script to add the status column');
        }
        
        // Check if it's a database connection error
        if (errorMessage.includes('connection') || errorMessage.includes('Connection')) {
          console.error('⚠️ Database connection failed. Please check:');
          console.error('  1. Is MySQL/XAMPP running?');
          console.error('  2. Are database credentials correct in .env?');
          console.error('  3. Is the backend server running on port 5000?');
        }
        
        setError(errorMessage);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResources();
  }, [selectedCategory, searchTerm]); // Reload when category or search term changes

  // Filter resources based on search term (client-side)
  const filteredResources = resources.filter((resource) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description?.toLowerCase().includes(searchLower)
    );
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'reports', label: 'Reports' },
    { value: 'guidelines', label: 'Guidelines' },
    { value: 'forms', label: 'Forms' },
    { value: 'documents', label: 'Documents' },
    { value: 'others', label: 'Others' },
  ];

  const categoryIcons = {
    reports: BarChart,
    guidelines: BookOpen,
    forms: File,
    documents: FileText,
    others: FileText,
  };

  const categoryColors = {
    reports: 'bg-purple-100 text-purple-800',
    guidelines: 'bg-indigo-100 text-indigo-800',
    forms: 'bg-green-100 text-green-800',
    documents: 'bg-blue-100 text-blue-800',
    others: 'bg-gray-100 text-gray-800',
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (resource) => {
    if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  if (error && !resources.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Resources</h2>
          <p className="text-gray-600">{error}</p>
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
              Access documents, forms, reports, and other resources to support your agricultural, 
              livestock, and fishing activities.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base"
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
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = categoryIcons[resource.backendCategory] || FileText;
                const colorClass = categoryColors[resource.backendCategory] || 'bg-gray-100 text-gray-800';
                
                return (
                  <div key={resource.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                          {resource.category}
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
                      <span className="font-medium">{resource.fileType || 'Unknown'}</span>
                      {resource.fileSize && (
                        <span>{formatFileSize(resource.fileSize)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDownload(resource)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your search criteria."
                  : "No resources available at the moment."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Resources;

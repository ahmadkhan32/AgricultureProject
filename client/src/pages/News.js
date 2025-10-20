import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, ArrowRight } from 'lucide-react';
import crudService from '../services/crudService';
import { format } from 'date-fns';
import { ensureNewsData } from '../utils/populateNewsData';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: newsData, isLoading, error } = useQuery(
    ['news', { search: searchTerm, category: selectedCategory, page: currentPage }],
    async () => {
      try {
        // Ensure news data exists
        await ensureNewsData();
        
        const allNews = await crudService.news.fetchAll();
        
        // Filter news based on search term and category
        let filteredNews = allNews;
        
        if (searchTerm) {
          filteredNews = filteredNews.filter(news => 
            news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            news.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (selectedCategory) {
          filteredNews = filteredNews.filter(news => news.category === selectedCategory);
        }
        
        // Sort by published_at date (newest first)
        filteredNews.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        
        // Pagination
        const limit = 9;
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNews = filteredNews.slice(startIndex, endIndex);
        
        return {
          news: paginatedNews || [],
          pagination: {
            currentPage,
            pages: Math.ceil((filteredNews.length || 0) / limit),
            total: filteredNews.length || 0
          }
        };
      } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
    },
    {
      keepPreviousData: true,
    }
  );

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'press_release', label: 'Press Releases' },
    { value: 'event', label: 'Events' },
    { value: 'announcement', label: 'Announcements' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Error Loading News
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight">
              News & Updates
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
              Stay informed with the latest news, press releases, and announcements 
              from the agricultural, livestock, and fisheries sectors in the Comoros.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9 sm:pl-10 text-xs sm:text-sm md:text-base"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field flex-1 sm:flex-none text-xs sm:text-sm md:text-base"
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

      {/* News Grid */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-24 sm:h-32 md:h-40 lg:h-48 bg-gray-200 rounded-lg mb-2 sm:mb-3 md:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3 md:mb-4"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : newsData?.news?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {newsData.news.map((article) => (
                  <article key={article.id} className="card hover:shadow-lg transition-shadow">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(article.published_at), 'MMM dd, yyyy')}
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {article.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </p>
                    <Link
                      to={`/news/${article.id}`}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {newsData.pagination && newsData.pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, newsData.pagination.pages) }, (_, i) => {
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
                      onClick={() => setCurrentPage(Math.min(newsData.pagination.pages, currentPage + 1))}
                      disabled={currentPage === newsData.pagination.pages}
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
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria.'
                  : 'Check back later for the latest updates.'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const NewsSection = ({ news, loading }) => {
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Latest News</h2>
            <p className="section-subtitle">
              Stay updated with the latest developments in agriculture, livestock, and fisheries
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
    <section className="py-16 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Actualités</h2>
          <p className="section-subtitle">
            Restez informé des dernières actualités dans le secteur agricole, d'élevage et de pêche
          </p>
        </div>

        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {news.map((article) => {
              // Safely get date with fallback and validation
              const publishedDate = article.publishedAt || article.published_at || article.createdAt || article.created_at;
              const dateObj = publishedDate ? new Date(publishedDate) : null;
              const isValidDate = dateObj && !isNaN(dateObj.getTime());
              
              return (
                <article key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-accent-200 hover:-translate-y-1">
                  {(article.imageUrl || article.image_url) && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.imageUrl || article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-text-light mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {isValidDate ? format(dateObj, 'dd MMM yyyy') : 'Date non disponible'}
                    </div>
                    <h3 className="text-lg font-bold text-primary-500 mb-3 line-clamp-2 uppercase tracking-wide">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-medium mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt || (article.content ? article.content.substring(0, 150) + '...' : '')}
                    </p>
                    <Link
                      to={`/news/${article.id}`}
                      className="inline-flex items-center text-accent-500 hover:text-accent-600 font-semibold text-sm uppercase tracking-wide group"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No news articles available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/news"
            className="btn-primary inline-flex items-center"
          >
            Voir toutes les actualités
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

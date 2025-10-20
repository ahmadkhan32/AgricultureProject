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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Latest News</h2>
          <p className="section-subtitle">
            Stay updated with the latest developments in agriculture, livestock, and fisheries
          </p>
        </div>

        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No news articles available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/news"
            className="btn-primary"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

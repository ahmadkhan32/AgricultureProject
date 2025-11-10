import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import crudService from '../services/crudService';
import { format } from 'date-fns';
import { ensureNewsData } from '../utils/populateNewsData';

const NewsDetail = () => {
  const { id } = useParams();
  const { data: article, isLoading, error } = useQuery(
    ['news', id],
    async () => {
      try {
        // Ensure news data exists
        await ensureNewsData();
        
        const article = await crudService.news.fetchById(id);
        return article;
      } catch (error) {
        console.error('Error fetching news article:', error);
        throw error;
      }
    },
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/news"
            className="btn-primary"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/news"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {article.category.replace('_', ' ')}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {(() => {
                  const publishedDate = article.publishedAt || article.published_at || article.createdAt || article.created_at;
                  const dateObj = publishedDate ? new Date(publishedDate) : null;
                  const isValidDate = dateObj && !isNaN(dateObj.getTime());
                  return isValidDate ? format(dateObj, 'MMMM dd, yyyy') : 'Date not available';
                })()}
              </div>
              {article.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.author.firstName || article.author.first_name} {article.author.lastName || article.author.last_name}
                </div>
              )}
            </div>
          </div>

          {/* Article Image */}
          {(article.imageUrl || article.image_url) && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.imageUrl || article.image_url}
                alt={article.title}
                className="w-full h-64 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This would typically fetch related articles based on category or tags */}
            <div className="card">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">Related Article Title</h3>
              <p className="text-gray-600 text-sm">Article excerpt...</p>
            </div>
            <div className="card">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">Another Related Article</h3>
              <p className="text-gray-600 text-sm">Article excerpt...</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetail;

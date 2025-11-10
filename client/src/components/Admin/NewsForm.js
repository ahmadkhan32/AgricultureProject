import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';

const NewsForm = ({ news, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: 'news',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (news) {
      reset({
        title: news.title || '',
        content: news.content || '',
        excerpt: news.excerpt || '',
        imageUrl: news.imageUrl || news.image_url || '',
        category: news.category || 'news',
        status: news.status || 'draft',
      });
    }
  }, [news, reset]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {news ? 'Edit News Article' : 'Create News Article'}
          </h1>
          <p className="text-gray-600">
            {news ? 'Update the news article details' : 'Create a new news article, press release, or announcement'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters',
                    },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Enter article title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="news">News</option>
                  <option value="press_release">Press Release</option>
                  <option value="event">Event</option>
                  <option value="announcement">Announcement</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className="input-field"
                placeholder="Brief description of the article (optional)"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                {...register('imageUrl')}
                type="url"
                className="input-field"
                placeholder="https://example.com/image.jpg or /uploads/images/file.jpg"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                {...register('content', {
                  required: 'Content is required',
                  minLength: {
                    value: 50,
                    message: 'Content must be at least 50 characters',
                  },
                })}
                rows={12}
                className="input-field"
                placeholder="Write the article content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="input-field"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            {isLoading ? (
              <div className="spinner w-4 h-4 mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {news ? 'Update Article' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;

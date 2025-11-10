import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Tag } from 'lucide-react';

const ServiceForm = ({ service, onSubmit, onCancel, isLoading }) => {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: 'support',
      icon: '',
      imageUrl: '',
      status: 'active',
      tags: [],
    },
  });

  useEffect(() => {
    if (service) {
      const serviceTags = service.tags 
        ? (Array.isArray(service.tags) ? service.tags : JSON.parse(service.tags || '[]'))
        : [];
      
      reset({
        title: service.title || '',
        description: service.description || '',
        content: service.content || '',
        category: service.category || 'support',
        icon: service.icon || '',
        imageUrl: service.imageUrl || service.image_url || '',
        status: service.status || 'active',
        tags: serviceTags,
      });
      setTags(serviceTags);
    }
  }, [service, reset]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {service ? 'Edit Service' : 'Create New Service'}
            </h1>
            <p className="text-blue-100 font-medium">
              {service ? 'Update the service details' : 'Add a new service or support program to UCAEP'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
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
                    maxLength: {
                      value: 200,
                      message: 'Title must be less than 200 characters',
                    },
                  })}
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Soutien aux producteurs agricoles"
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
                  className="input-field w-full"
                >
                  <option value="support">Support</option>
                  <option value="training">Training</option>
                  <option value="assistance">Consultation</option>
                  <option value="project">Resources</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Description must be less than 1000 characters',
                  },
                })}
                rows={4}
                className="input-field w-full"
                placeholder="Brief description of the service..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Full Content (Optional)
              </label>
              <textarea
                {...register('content', {
                  minLength: {
                    value: 50,
                    message: 'Content must be at least 50 characters if provided',
                  },
                })}
                rows={8}
                className="input-field w-full"
                placeholder="Detailed content about the service..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Optional)
                </label>
                <input
                  {...register('icon')}
                  type="text"
                  className="input-field w-full"
                  placeholder="e.g., Leaf, Fish, Heart"
                  maxLength={100}
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  {...register('imageUrl')}
                  type="url"
                  className="input-field w-full"
                  placeholder="https://example.com/image.jpg"
                  maxLength={500}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="input-field w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {service ? 'Update Service' : 'Create Service'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;


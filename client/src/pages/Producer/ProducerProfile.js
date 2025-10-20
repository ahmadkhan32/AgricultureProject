import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Save } from 'lucide-react';
import crudService from '../../services/crudService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProducerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: producerProfile, isLoading } = useQuery(
    ['user-producer-profile', user?.id],
    async () => {
      if (!user) return null;
      
      try {
        const allProducers = await crudService.producers.fetchAll();
        const userProducer = allProducers.find(p => p.user_id === user.id);
        return userProducer || null;
      } catch (error) {
        console.error('Error fetching user producer profile:', error);
        return null;
      }
    },
    {
      enabled: !!user,
    }
  );

  const createMutation = useMutation(
    (data) => crudService.producers.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-producer-profile', user?.id]);
        setIsEditing(false);
        toast.success('Producer profile created successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create producer profile');
      },
    }
  );

  const updateMutation = useMutation(
    (data) => crudService.producers.update(producerProfile.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user-producer-profile', user?.id]);
        setIsEditing(false);
        toast.success('Producer profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update producer profile');
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      business_name: '',
      business_type: 'agriculture',
      description: '',
      location: '',
      latitude: '',
      longitude: '',
      region: '',
      products: [],
      certifications: [],
      contact_email: '',
      contact_phone: '',
      website: '',
      social_media: {},
      images: [],
    },
  });

  const businessTypes = [
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'fisheries', label: 'Fisheries' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const regions = [
    { value: 'Grande Comore', label: 'Grande Comore' },
    { value: 'Anjouan', label: 'Anjouan' },
    { value: 'Mohéli', label: 'Mohéli' },
    { value: 'Mayotte', label: 'Mayotte' },
  ];

  const onSubmit = (data) => {
    if (!user) {
      toast.error('Please log in to manage your producer profile');
      return;
    }

    // Process form data
    const formData = {
      ...data,
      user_id: user.id,
      products: Array.isArray(data.products) ? data.products.filter(p => p && p.trim() !== '') : [],
      certifications: Array.isArray(data.certifications) ? data.certifications.filter(c => c && c.trim() !== '') : [],
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
    };

    if (producerProfile) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = () => {
    if (producerProfile) {
      reset({
        business_name: producerProfile.business_name || '',
        business_type: producerProfile.business_type || 'agriculture',
        description: producerProfile.description || '',
        location: producerProfile.location || '',
        latitude: producerProfile.latitude || '',
        longitude: producerProfile.longitude || '',
        region: producerProfile.region || '',
        products: producerProfile.products || [],
        certifications: producerProfile.certifications || [],
        contact_email: producerProfile.contact_email || '',
        contact_phone: producerProfile.contact_phone || '',
        website: producerProfile.website || '',
        social_media: producerProfile.social_media || {},
        images: producerProfile.images || [],
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (producerProfile) {
      reset({
        business_name: producerProfile.business_name || '',
        business_type: producerProfile.business_type || 'agriculture',
        description: producerProfile.description || '',
        location: producerProfile.location || '',
        latitude: producerProfile.latitude || '',
        longitude: producerProfile.longitude || '',
        region: producerProfile.region || '',
        products: producerProfile.products || [],
        certifications: producerProfile.certifications || [],
        contact_email: producerProfile.contact_email || '',
        contact_phone: producerProfile.contact_phone || '',
        website: producerProfile.website || '',
        social_media: producerProfile.social_media || {},
        images: producerProfile.images || [],
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to access your producer profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {producerProfile ? 'Producer Profile' : 'Create Producer Profile'}
              </h1>
              <p className="text-gray-600 mt-2">
                {producerProfile 
                  ? 'Manage your business information and showcase your products'
                  : 'Set up your producer profile to connect with the agricultural community'
                }
              </p>
            </div>
            {producerProfile && !isEditing && (
              <button
                onClick={handleEdit}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        {producerProfile && (
          <div className={`mb-8 p-4 rounded-lg border ${
            producerProfile.status === 'approved' ? 'bg-green-50 border-green-200' :
            producerProfile.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
            producerProfile.status === 'rejected' ? 'bg-red-50 border-red-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                producerProfile.status === 'approved' ? 'bg-green-500' :
                producerProfile.status === 'pending' ? 'bg-yellow-500' :
                producerProfile.status === 'rejected' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></div>
              <p className={`text-sm ${
                producerProfile.status === 'approved' ? 'text-green-800' :
                producerProfile.status === 'pending' ? 'text-yellow-800' :
                producerProfile.status === 'rejected' ? 'text-red-800' :
                'text-gray-800'
              }`}>
                Status: <span className="font-medium capitalize">{producerProfile.status}</span>
                {producerProfile.status === 'pending' && ' - Your profile is under review'}
                {producerProfile.status === 'approved' && ' - Your profile is live and visible to the public'}
                {producerProfile.status === 'rejected' && ' - Please update your profile and resubmit'}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  {...register('business_name', {
                    required: 'Business name is required',
                    minLength: {
                      value: 2,
                      message: 'Business name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Enter your business name"
                  disabled={!isEditing && producerProfile}
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  {...register('business_type', { required: 'Business type is required' })}
                  className="input-field"
                  disabled={!isEditing && producerProfile}
                >
                  {businessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.business_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_type.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters',
                  },
                })}
                rows={4}
                className="input-field"
                placeholder="Describe your business, products, and services..."
                disabled={!isEditing && producerProfile}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select
                  {...register('region', { required: 'Region is required' })}
                  className="input-field"
                  disabled={!isEditing && producerProfile}
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  {...register('location', {
                    required: 'Location is required',
                    minLength: {
                      value: 5,
                      message: 'Location must be at least 5 characters',
                    },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Enter your location"
                  disabled={!isEditing && producerProfile}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  {...register('latitude')}
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="e.g., -11.6455"
                  disabled={!isEditing && producerProfile}
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  {...register('longitude')}
                  type="number"
                  step="any"
                  className="input-field"
                  placeholder="e.g., 43.3333"
                  disabled={!isEditing && producerProfile}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  {...register('contact_email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field"
                  placeholder="contact@yourbusiness.com"
                  disabled={!isEditing && producerProfile}
                />
                {errors.contact_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  {...register('contact_phone')}
                  type="tel"
                  className="input-field"
                  placeholder="+269 12 34 56 78"
                  disabled={!isEditing && producerProfile}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                {...register('website')}
                type="url"
                className="input-field"
                placeholder="https://yourbusiness.com"
                disabled={!isEditing && producerProfile}
              />
            </div>
          </div>

          {/* Products */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Products & Services</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products (one per line)
              </label>
              <textarea
                value={Array.isArray(watch('products')) ? watch('products').join('\n') : ''}
                rows={4}
                className="input-field"
                placeholder="Enter your products, one per line..."
                disabled={!isEditing && producerProfile}
                onChange={(e) => {
                  const products = e.target.value.split('\n').filter(p => p.trim() !== '');
                  setValue('products', products);
                }}
              />
              <p className="mt-1 text-sm text-gray-500">
                List the products or services you offer
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications (one per line)
              </label>
              <textarea
                value={Array.isArray(watch('certifications')) ? watch('certifications').join('\n') : ''}
                rows={3}
                className="input-field"
                placeholder="Enter your certifications, one per line..."
                disabled={!isEditing && producerProfile}
                onChange={(e) => {
                  const certifications = e.target.value.split('\n').filter(c => c.trim() !== '');
                  setValue('certifications', certifications);
                }}
              />
              <p className="mt-1 text-sm text-gray-500">
                List any certifications or quality standards you have
              </p>
            </div>
          </div>

          {/* Actions */}
          {(!producerProfile || isEditing) && (
            <div className="flex items-center justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="btn-primary flex items-center"
              >
                {(createMutation.isLoading || updateMutation.isLoading) ? (
                  <div className="spinner w-4 h-4 mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {producerProfile ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProducerProfile;

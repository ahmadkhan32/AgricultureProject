import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Building, MapPin, Phone, Mail, Globe, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProducerForm = ({ producer, onSubmit, onCancel, isLoading }) => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      businessName: '',
      businessType: 'agriculture',
      description: '',
      location: '',
      region: 'Grande Comore',
      contactEmail: '',
      contactPhone: '',
      website: '',
      status: 'approved'
    }
  });

  // Load producer data if editing
  useEffect(() => {
    if (producer) {
      reset({
        businessName: producer.business_name || producer.businessName || '',
        businessType: producer.business_type || producer.businessType || 'agriculture',
        description: producer.description || '',
        location: producer.location || '',
        region: producer.region || 'Grande Comore',
        contactEmail: producer.contact_email || producer.contactEmail || '',
        contactPhone: producer.contact_phone || producer.contactPhone || '',
        website: producer.website || '',
        status: producer.status || 'approved'
      });

      // Set products array
      if (producer.products) {
        const prodArray = typeof producer.products === 'string' 
          ? JSON.parse(producer.products) 
          : producer.products;
        setProducts(Array.isArray(prodArray) ? prodArray : []);
      }

      // Set image
      const existingImage = producer.image || producer.image_url || '';
      setImageUrl(existingImage);
      setImagePreview(existingImage);
      setImageFile(null);
    }
  }, [producer, reset]);

  const handleAddProduct = () => {
    if (currentProduct.trim()) {
      setProducts([...products, currentProduct.trim()]);
      setCurrentProduct('');
    }
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Handle image file selection
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, GIF, SVG, or WebP images.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 10MB.');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to backend
  const uploadImage = async (file) => {
    if (!file) return null;

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      
      // Use the URL returned from backend (should already be full URL)
      let imageUrl = data.url || data.relativeUrl;
      
      // If it's still a relative URL, convert it to full URL
      if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const baseUrl = API_URL.replace('/api', '');
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      toast.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
  };

  const handleFormSubmit = async (data) => {
    try {
      // Clean data - send only camelCase fields that backend expects
      const formData = {
        businessName: data.businessName.trim(),
        businessType: data.businessType,
        location: data.location.trim(),
        region: data.region
      };

      // Add optional fields only if they have values
      if (data.description && data.description.trim().length >= 20) {
        formData.description = data.description.trim();
      }

      if (products.length > 0) {
        formData.products = products;
      }

      if (data.contactEmail && data.contactEmail.trim()) {
        formData.contactEmail = data.contactEmail.trim();
      }

      if (data.contactPhone && data.contactPhone.trim()) {
        formData.contactPhone = data.contactPhone.trim();
      }

      if (data.website && data.website.trim()) {
        // Ensure website starts with http:// or https://
        let website = data.website.trim();
        if (!website.startsWith('http://') && !website.startsWith('https://')) {
          website = 'https://' + website;
        }
        formData.website = website;
      }

      // Handle image - upload file if selected, otherwise use URL
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          formData.image = uploadedUrl;
        }
      } else if (imageUrl && imageUrl.trim()) {
        formData.image = imageUrl.trim();
      }

      // Set status (for admin editing)
      if (data.status) {
        formData.status = data.status;
      } else if (!producer) {
        // New producers default to pending
        formData.status = 'pending';
      }

      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error toast already shown in uploadImage
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {producer ? 'Edit Producer' : 'Add New Producer'}
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Building className="w-5 h-5 mr-2 text-emerald-600" />
              Business Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('businessName', {
                  required: 'Business name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' }
                })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter business name"
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('businessType', { required: 'Business type is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="agriculture">Agriculture</option>
                <option value="livestock">Livestock (Élevage)</option>
                <option value="fisheries">Fisheries (Pêche)</option>
                <option value="mixed">Mixed (Mixte)</option>
              </select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description', {
                  validate: (value) => {
                    if (!value || value.trim() === '') return true; // Optional
                    if (value.trim().length < 20) return 'Description must be at least 20 characters if provided';
                    if (value.length > 1000) return 'Description must be less than 1000 characters';
                    return true;
                  }
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe the business, products, and services... (optional, min 20 chars if provided)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Products */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentProduct}
                  onChange={(e) => setCurrentProduct(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProduct())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter product name"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {products.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {products.map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-sm"
                    >
                      {product}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-600" />
              Location Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                {...register('location', {
                  required: 'Location is required',
                  minLength: { value: 5, message: 'Minimum 5 characters' }
                })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter location (e.g., Moroni, Mutsamudu)"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                {...register('region', { required: 'Region is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Grande Comore">Grande Comore</option>
                <option value="Anjouan">Anjouan</option>
                <option value="Mohéli">Mohéli</option>
              </select>
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-emerald-600" />
              Contact Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                {...register('contactEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="contact@example.com"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </label>
              <input
                {...register('contactPhone')}
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="+269 333 1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Website
              </label>
              <input
                {...register('website')}
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Producer Image <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            
            <div className="space-y-3">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className={`w-8 h-8 mb-2 ${uploadingImage ? 'text-gray-400' : 'text-emerald-600'}`} />
                  <span className={`text-sm ${uploadingImage ? 'text-gray-400' : 'text-gray-700'}`}>
                    {uploadingImage ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, GIF, SVG, WebP (Max 10MB)
                  </span>
                </label>
              </div>

              {/* Or URL Input */}
              <div className="text-center text-xs text-gray-500">OR</div>
              
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                  setImageFile(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                disabled={!!imageFile || uploadingImage}
              />

              {/* Image Preview */}
              {(imagePreview || imageUrl) && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Preview"
                    className="mt-2 w-full max-w-xs h-48 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {imageFile && (
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {imageFile.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status (for admin) */}
          {producer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {producer ? 'Update Producer' : 'Create Producer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProducerForm;


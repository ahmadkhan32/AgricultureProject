import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import crudService from '../../services/crudService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { 
  MapPin, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  Building,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ProducerRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const businessType = watch('business_type');

  const comorianRegions = [
    'Grande Comore (Ngazidja)',
    'Anjouan (Nzwani)',
    'Mohéli (Mwali)',
    'Mayotte (Maore)'
  ];

  const productOptions = {
    agriculture: [
      'Vanilla', 'Cloves', 'Ylang-Ylang', 'Coconut', 'Banana', 'Cassava',
      'Sweet Potato', 'Rice', 'Maize', 'Beans', 'Vegetables', 'Fruits'
    ],
    livestock: [
      'Cattle', 'Goats', 'Sheep', 'Pigs', 'Chickens', 'Ducks',
      'Milk', 'Eggs', 'Meat', 'Honey', 'Wool', 'Leather'
    ],
    fisheries: [
      'Fish', 'Lobster', 'Crab', 'Shrimp', 'Seaweed', 'Sea Cucumber',
      'Octopus', 'Squid', 'Tuna', 'Marlin', 'Snapper', 'Grouper'
    ],
    mixed: [
      'Vanilla', 'Cloves', 'Ylang-Ylang', 'Coconut', 'Banana', 'Cassava',
      'Cattle', 'Goats', 'Chickens', 'Fish', 'Lobster', 'Seaweed'
    ]
  };

  const certificationOptions = [
    'Organic Certification',
    'Fair Trade',
    'ISO 22000',
    'HACCP',
    'GAP (Good Agricultural Practices)',
    'Rainforest Alliance',
    'UTZ Certified',
    '4C Association',
    'Local Quality Standards',
    'Export Certification'
  ];

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProductToggle = (product) => {
    setSelectedProducts(prev => 
      prev.includes(product) 
        ? prev.filter(p => p !== product)
        : [...prev, product]
    );
  };

  const handleCertificationToggle = (certification) => {
    setSelectedCertifications(prev => 
      prev.includes(certification) 
        ? prev.filter(c => c !== certification)
        : [...prev, certification]
    );
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please log in to register as a producer');
      return;
    }

    if (!selectedLocation) {
      toast.error('Please select your location on the map');
      return;
    }

    setIsLoading(true);
    try {
      const producerData = {
        user_id: user.id,
        business_name: data.business_name,
        business_type: data.business_type,
        description: data.description,
        location: data.location,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        region: data.region,
        products: selectedProducts,
        certifications: selectedCertifications,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        website: data.website,
        social_media: {
          facebook: data.facebook,
          twitter: data.twitter,
          instagram: data.instagram,
          linkedin: data.linkedin
        },
        images: uploadedImages.map(img => img.name), // In real app, upload to storage first
        status: 'pending'
      };

      const result = await crudService.producers.create(producerData);
      
      if (result) {
        toast.success('Producer registration submitted successfully! Your application is under review.');
        // Reset form
        setSelectedLocation(null);
        setUploadedImages([]);
        setSelectedProducts([]);
        setSelectedCertifications([]);
      } else {
        toast.error('Failed to submit registration. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Producer Registration</h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Join the UCAEP network and showcase your agricultural, livestock, or fisheries business to the world.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            {/* Business Information */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Business Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    {...register('business_name', { required: 'Business name is required' })}
                    type="text"
                    className="input-field text-sm sm:text-base"
                    placeholder="Enter your business name"
                  />
                  {errors.business_name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.business_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    {...register('business_type', { required: 'Business type is required' })}
                    className="input-field text-sm sm:text-base"
                  >
                    <option value="">Select business type</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="livestock">Livestock</option>
                    <option value="fisheries">Fisheries</option>
                    <option value="mixed">Mixed (Agriculture + Livestock/Fisheries)</option>
                  </select>
                  {errors.business_type && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.business_type.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  {...register('description', { required: 'Business description is required' })}
                  rows={4}
                  className="input-field text-sm sm:text-base"
                  placeholder="Describe your business, products, and services..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <select
                    {...register('region', { required: 'Region is required' })}
                    className="input-field text-sm sm:text-base"
                  >
                    <option value="">Select region</option>
                    {comorianRegions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.region.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Address *
                  </label>
                  <input
                    {...register('location', { required: 'Location address is required' })}
                    type="text"
                    className="input-field text-sm sm:text-base"
                    placeholder="Enter your business address"
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location on Map
              </h2>
              <p className="text-sm text-gray-600">
                Click on the map to mark your business location. This helps customers find you easily.
              </p>
              
              <div className="h-96 border border-gray-300 rounded-lg overflow-hidden">
                <MapContainer
                  center={[-11.6455, 43.3333]} // Comoros center
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                      <Popup>
                        Your business location
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              
              {selectedLocation && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Location selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
              )}
            </div>

            {/* Products */}
            {businessType && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Products & Services
                </h2>
                <p className="text-sm text-gray-600">
                  Select the products or services you offer:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {productOptions[businessType]?.map(product => (
                    <label key={product} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product)}
                        onChange={() => handleProductToggle(product)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{product}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Certifications & Standards
              </h2>
              <p className="text-sm text-gray-600">
                Select any certifications or standards you have:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {certificationOptions.map(certification => (
                  <label key={certification} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCertifications.includes(certification)}
                      onChange={() => handleCertificationToggle(certification)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{certification}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register('contact_email', {
                        required: 'Contact email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="input-field pl-10"
                      placeholder="contact@yourbusiness.com"
                    />
                  </div>
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register('contact_phone', {
                        required: 'Contact phone is required',
                        pattern: {
                          value: /^[+]?[1-9][\d]{0,15}$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      type="tel"
                      className="input-field pl-10"
                      placeholder="+269 XXX XX XX"
                    />
                  </div>
                  {errors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact_phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('website')}
                    type="url"
                    className="input-field pl-10"
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Social Media (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('facebook')}
                        type="url"
                        className="input-field pl-10"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('twitter')}
                        type="url"
                        className="input-field pl-10"
                        placeholder="https://twitter.com/yourhandle"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('instagram')}
                        type="url"
                        className="input-field pl-10"
                        placeholder="https://instagram.com/yourhandle"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('linkedin')}
                        type="url"
                        className="input-field pl-10"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Business Images
              </h2>
              <p className="text-sm text-gray-600">
                Upload images of your business, products, or facilities (up to 10 images):
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload images
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProducerRegistration;

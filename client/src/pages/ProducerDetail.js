import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Share2, Award, Users } from 'lucide-react';
import crudService from '../services/crudService';

const ProducerDetail = () => {
  const { id } = useParams();
  const { data: producer, isLoading, error } = useQuery(
    ['producer', id],
    async () => {
      if (!id) return null;
      try {
        return await crudService.producers.fetchById(id);
      } catch (error) {
        console.error('Error fetching producer:', error);
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

  if (error || !producer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producer Not Found</h2>
          <p className="text-gray-600 mb-6">The producer profile you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/producers"
            className="btn-primary"
          >
            Back to Producers
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: producer.business_name,
          text: producer.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
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
            to="/producers"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Producers
          </Link>
        </div>
      </div>

      {/* Producer Profile */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Main Image */}
          {producer.image && (
            <div className="w-full h-64 md:h-96 bg-gray-100">
              <img
                src={producer.image}
                alt={producer.business_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Header Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mr-3">
                    {producer.business_type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {producer.business_name}
                </h1>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {producer.location}, {producer.region}
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            </div>

            {producer.description && (
              <p className="text-gray-600 leading-relaxed">
                {producer.description}
              </p>
            )}
          </div>

          {/* Images Gallery */}
          {(() => {
            // Handle images - could be array, string, or single image field
            let images = [];
            if (producer.images) {
              if (Array.isArray(producer.images)) {
                images = producer.images;
              } else if (typeof producer.images === 'string') {
                try {
                  images = JSON.parse(producer.images);
                  if (!Array.isArray(images)) images = [];
                } catch {
                  images = [];
                }
              }
            }
            // If no images array but has single image field, use that
            if (images.length === 0 && producer.image) {
              images = [producer.image];
            }
            
            return images.length > 0 && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${producer.business_name} - ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Business Information */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Business Type</h3>
                <p className="text-gray-600 capitalize">{producer.business_type}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Region</h3>
                <p className="text-gray-600">{producer.region}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">{producer.location}</p>
              </div>
              
              {producer.user && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Person</h3>
                  <p className="text-gray-600">
                    {producer.user.first_name} {producer.user.last_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          {(() => {
            // Handle products - could be array or JSON string
            let products = [];
            if (producer.products) {
              if (Array.isArray(producer.products)) {
                products = producer.products;
              } else if (typeof producer.products === 'string') {
                try {
                  products = JSON.parse(producer.products);
                  if (!Array.isArray(products)) products = [];
                } catch {
                  products = [];
                }
              }
            }
            
            return products.length > 0 && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Products & Services</h2>
                <div className="flex flex-wrap gap-2">
                  {products.map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Certifications */}
          {(() => {
            // Handle certifications - could be array or JSON string
            let certifications = [];
            if (producer.certifications) {
              if (Array.isArray(producer.certifications)) {
                certifications = producer.certifications;
              } else if (typeof producer.certifications === 'string') {
                try {
                  certifications = JSON.parse(producer.certifications);
                  if (!Array.isArray(certifications)) certifications = [];
                } catch {
                  certifications = [];
                }
              }
            }
            
            return certifications.length > 0 && (
              <div className="p-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((certification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      <Award className="w-4 h-4 mr-1" />
                      {certification}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Contact Information */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {producer.contact_email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${producer.contact_email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {producer.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {producer.contact_phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${producer.contact_phone}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {producer.contact_phone}
                    </a>
                  </div>
                </div>
              )}

              {producer.website && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={producer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {producer.website}
                    </a>
                  </div>
                </div>
              )}

              {producer.user?.email && (
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">UCAEP Member</p>
                    <p className="text-gray-600">{producer.user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Producers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Producers in {producer.region}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This would typically fetch related producers */}
            <div className="card">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">Related Producer</h3>
              <p className="text-gray-600 text-sm">Producer description...</p>
            </div>
            <div className="card">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="font-semibold text-gray-900 mb-2">Another Producer</h3>
              <p className="text-gray-600 text-sm">Producer description...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDetail;

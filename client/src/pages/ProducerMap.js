import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Filter } from 'lucide-react';
import crudService from '../services/crudService';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ProducerMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [mapCenter, setMapCenter] = useState([-11.6455, 43.3333]); // Comoros center
  const [mapZoom, setMapZoom] = useState(10);

  const { data: regionsData, isLoading, error } = useQuery(
    'producer-regions',
    async () => {
      try {
        const producers = await crudService.producers.fetchAll({ status: 'approved' });
        // Group producers by region
        const groupedByRegion = producers.reduce((acc, producer) => {
          const region = producer.region || 'Unknown';
          if (!acc[region]) {
            acc[region] = [];
          }
          acc[region].push(producer);
          return acc;
        }, {});
        return groupedByRegion;
      } catch (error) {
        console.error('Error fetching producer regions:', error);
        throw error;
      }
    },
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const businessTypes = [
    { value: '', label: 'All Types' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'fisheries', label: 'Fisheries' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const regionCenters = {
    'Grande Comore': { lat: -11.6455, lng: 43.3333, zoom: 10 },
    'Anjouan': { lat: -12.2138, lng: 44.4378, zoom: 11 },
    'Mohéli': { lat: -12.3372, lng: 43.7339, zoom: 11 },
    'Mayotte': { lat: -12.8275, lng: 45.1662, zoom: 11 },
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    if (region && regionCenters[region]) {
      setMapCenter([regionCenters[region].lat, regionCenters[region].lng]);
      setMapZoom(regionCenters[region].zoom);
    } else {
      setMapCenter([-11.6455, 43.3333]);
      setMapZoom(10);
    }
  };

  const getMarkerColor = (businessType) => {
    const colors = {
      agriculture: '#10B981', // green
      livestock: '#F59E0B', // yellow
      fisheries: '#3B82F6', // blue
      mixed: '#8B5CF6', // purple
    };
    return colors[businessType] || '#6B7280'; // gray default
  };

  const createCustomIcon = (businessType) => {
    const color = getMarkerColor(businessType);
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Map</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Producer Map</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our network of producers across the Comoros. Find farmers, breeders, 
              and fishers in your region and discover their products and services.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Regions</option>
                  <option value="Grande Comore">Grande Comore</option>
                  <option value="Anjouan">Anjouan</option>
                  <option value="Mohéli">Mohéli</option>
                  <option value="Mayotte">Mayotte</option>
                </select>
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Agriculture</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Livestock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Fisheries</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Mixed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-screen">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="h-full relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {regionsData && Object.entries(regionsData).map(([region, producers]) => {
                if (selectedRegion && selectedRegion !== region) return null;
                
                return producers
                  .filter(producer => {
                    if (!producer || !producer.latitude || !producer.longitude) return false;
                    return !selectedType || producer.business_type === selectedType;
                  })
                  .map((producer) => (
                    <Marker
                      key={producer.id}
                      position={[producer.latitude, producer.longitude]}
                      icon={createCustomIcon(producer.business_type)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {producer.business_name || 'Unnamed Business'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Type:</span> {producer.business_type || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Region:</span> {producer.region || 'Unknown'}
                          </p>
                          <a
                            href={`/producers/${producer.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View Profile →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ));
              })}
            </MapContainer>

            {/* Map Info Panel */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Producer Statistics</h3>
              {regionsData && (
                <div className="space-y-1 text-sm">
                  {Object.entries(regionsData).map(([region, producers]) => {
                    if (!producers || !Array.isArray(producers)) return null;
                    
                    const filteredProducers = selectedType 
                      ? producers.filter(p => p && p.business_type === selectedType)
                      : producers;
                    
                    if (selectedRegion && selectedRegion !== region) return null;
                    
                    return (
                      <div key={region} className="flex justify-between">
                        <span className="text-gray-600">{region}:</span>
                        <span className="font-medium">{filteredProducers.length} producers</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProducerMap;

import React, { useState } from 'react';
import { Database, CheckCircle } from 'lucide-react';
import { populateNewsData, populateProducersData, populatePartnershipsData, populateResourcesData } from '../../utils/populateNewsData';
import toast from 'react-hot-toast';

const DataPopulator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [populatedNews, setPopulatedNews] = useState(false);
  const [populatedProducers, setPopulatedProducers] = useState(false);
  const [populatedPartnerships, setPopulatedPartnerships] = useState(false);
  const [populatedResources, setPopulatedResources] = useState(false);

  const handlePopulateNews = async () => {
    setIsLoading(true);
    try {
      await populateNewsData();
      setPopulatedNews(true);
      toast.success('News data populated successfully!');
    } catch (error) {
      console.error('Error populating news data:', error);
      toast.error('Failed to populate news data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateProducers = async () => {
    setIsLoading(true);
    try {
      await populateProducersData();
      setPopulatedProducers(true);
      toast.success('Producers data populated successfully!');
    } catch (error) {
      console.error('Error populating producers data:', error);
      toast.error('Failed to populate producers data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulatePartnerships = async () => {
    setIsLoading(true);
    try {
      await populatePartnershipsData();
      setPopulatedPartnerships(true);
      toast.success('Partnerships data populated successfully!');
    } catch (error) {
      console.error('Error populating partnerships data:', error);
      toast.error('Failed to populate partnerships data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateResources = async () => {
    setIsLoading(true);
    try {
      await populateResourcesData();
      setPopulatedResources(true);
      toast.success('Resources data populated successfully!');
    } catch (error) {
      console.error('Error populating resources data:', error);
      toast.error('Failed to populate resources data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-primary-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Data Population</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Use this tool to populate the database with sample data for testing and demonstration purposes.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">News Articles</h4>
              <p className="text-sm text-gray-500">Populate with sample news articles</p>
            </div>
            {populatedNews && (
              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
          <button
            onClick={handlePopulateNews}
            disabled={isLoading || populatedNews}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Populating...' : populatedNews ? 'Populated' : 'Populate News'}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Producers</h4>
              <p className="text-sm text-gray-500">Populate with sample producer profiles</p>
            </div>
            {populatedProducers && (
              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
          <button
            onClick={handlePopulateProducers}
            disabled={isLoading || populatedProducers}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Populating...' : populatedProducers ? 'Populated' : 'Populate Producers'}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Partnerships</h4>
              <p className="text-sm text-gray-500">Populate with sample partnership profiles</p>
            </div>
            {populatedPartnerships && (
              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
          <button
            onClick={handlePopulatePartnerships}
            disabled={isLoading || populatedPartnerships}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Populating...' : populatedPartnerships ? 'Populated' : 'Populate Partnerships'}
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Resources</h4>
              <p className="text-sm text-gray-500">Populate with sample resource documents</p>
            </div>
            {populatedResources && (
              <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
            )}
          </div>
          <button
            onClick={handlePopulateResources}
            disabled={isLoading || populatedResources}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Populating...' : populatedResources ? 'Populated' : 'Populate Resources'}
          </button>
        </div>
      </div>
      
      {(populatedNews || populatedProducers || populatedPartnerships || populatedResources) && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              Sample data has been successfully populated. You can now view the news, producers, partnerships, and resources sections.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPopulator;

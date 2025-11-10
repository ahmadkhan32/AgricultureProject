import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Settings,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminServices, deleteService } from '../../services/api';

const ServicesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: servicesData, isLoading, error } = useQuery(
    ['services', { searchTerm, filterCategory }],
    async () => {
      try {
        let filters = {};
        if (filterCategory !== 'all') {
          // Map frontend categories to backend categories
          const categoryMap = {
            'training': 'training',
            'support': 'support',
            'consultation': 'assistance', // Consultation maps to assistance in backend
            'resources': 'project' // Resources maps to project in backend
          };
          filters.category = categoryMap[filterCategory] || filterCategory;
        }
        if (searchTerm) {
          filters.search = searchTerm;
        }

        const response = await fetchAdminServices(filters);
        const allServices = response.services || [];
        
        // Client-side filtering for search term if needed
        if (searchTerm && !filters.search) {
          return allServices.filter(service =>
            service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return allServices;
      } catch (err) {
        console.error('❌ Error fetching admin services:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error response data:', err.response?.data);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error status:', err.response?.status);
        
        // Extract detailed error information
        const errorData = err.response?.data || {};
        const errorMessage = errorData.message || err.message || 'Unknown error';
        const errorType = errorData.errorType || 'Unknown';
        const originalError = errorData.originalError || errorData.error || '';
        
        console.error('📋 Admin Services Error Details:', {
          message: errorMessage,
          type: errorType,
          originalError: originalError,
          status: err.response?.status,
          hint: errorData.hint
        });
        
        // Check if it's a table-not-found error
        if (errorMessage.includes('does not exist') || errorMessage.includes('table') || originalError.includes('doesn\'t exist')) {
          console.error('⚠️ Services table not found in database. Please run the SQL migration script.');
          console.error('📄 Check: database/services-table-xampp.sql');
          console.error('💡 Solution: Run the SQL script in phpMyAdmin to create the services table');
          toast.error('Services table not found. Please check the database setup.');
        }
        
        // Check if it's a database connection error
        if (errorMessage.includes('connection') || errorMessage.includes('Connection')) {
          console.error('⚠️ Database connection failed. Please check:');
          console.error('  1. Is MySQL/XAMPP running?');
          console.error('  2. Are database credentials correct in .env?');
          console.error('  3. Is the backend server running on port 5000?');
          toast.error('Database connection failed. Please check your backend server.');
        }
        
        throw err;
      }
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const services = servicesData || [];

  const deleteMutation = useMutation(
    async (id) => {
      await deleteService(id);
    },
    {
      onSuccess: () => {
        // Invalidate all service-related queries for real-time sync
        queryClient.invalidateQueries('services');
        queryClient.invalidateQueries(['services']);
        queryClient.invalidateQueries(['service']);
        toast.success('Service deleted successfully!');
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete service';
        toast.error(`Error deleting service: ${errorMessage}`);
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading services: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mr-3 backdrop-blur-lg">
                <Settings className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
            </div>
            <Link 
              to="/admin/services/new" 
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl flex items-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add New Service
            </Link>
          </div>
          <p className="text-blue-100 font-medium">Manage UCAEP services and support programs.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl shadow-xl border-2 border-indigo-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="training">Training</option>
            <option value="support">Support</option>
            <option value="consultation">Consultation</option>
            <option value="resources">Resources</option>
          </select>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.category === 'support' ? 'Support' :
                       service.category === 'training' ? 'Training' :
                       service.category === 'assistance' ? 'Consultation' :
                       service.category === 'project' ? 'Resources' : service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/services/${service.id}`} target="_blank" className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link to={`/admin/services/edit/${service.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No services found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesManagement;

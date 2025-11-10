import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  File,
  Image,
  Video
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminResources, deleteResource } from '../../services/api';

const ResourcesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: resourcesData, isLoading, error } = useQuery(
    ['resources', { searchTerm, filterCategory }],
    async () => {
      try {
        let filters = {};
        if (filterCategory !== 'all') {
          // Map frontend categories to backend categories
          const categoryMap = {
            'reports': 'reports',
            'guidelines': 'guidelines',
            'forms': 'forms',
            'documents': 'documents',
            'other': 'others'
          };
          filters.category = categoryMap[filterCategory] || filterCategory;
        }
        if (searchTerm) {
          filters.search = searchTerm;
        }

        const response = await fetchAdminResources(filters);
        const allResources = response.resources || [];
        
        // Client-side filtering for search term if needed
        if (searchTerm && !filters.search) {
          return allResources.filter(resource =>
            resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return allResources;
      } catch (err) {
        console.error('❌ Error fetching admin resources:', err);
        console.error('❌ Error response:', err.response);
        console.error('❌ Error response data:', err.response?.data);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error status:', err.response?.status);
        
        // Extract detailed error information
        const errorData = err.response?.data || {};
        const errorMessage = errorData.message || err.message || 'Unknown error';
        const originalError = errorData.originalError || errorData.error || '';
        
        console.error('📋 Admin Resources Error Details:', {
          message: errorMessage,
          type: errorData.errorType || 'Unknown',
          originalError: originalError,
          status: err.response?.status,
          hint: errorData.hint
        });
        
        // Check if it's a table-not-found error
        if (errorMessage.includes('does not exist') || errorMessage.includes('table') || originalError.includes('doesn\'t exist')) {
          console.error('⚠️ Resources table not found in database. Please run the SQL migration script.');
          console.error('📄 Check: database/resources-table-setup.sql or database/COMPLETE_RESOURCES_TABLE_SETUP.sql');
          console.error('💡 Solution: Run the SQL script in phpMyAdmin to create/update the resources table');
          toast.error('Resources table not found. Please check the database setup.');
        }
        
        // Check if it's a missing status column error
        if (errorMessage.includes('status column') || originalError.includes('status') || originalError.includes('Unknown column \'status\'')) {
          console.error('⚠️ Resources table is missing the status column.');
          console.error('📄 Check: database/resources-table-setup.sql or database/COMPLETE_RESOURCES_TABLE_SETUP.sql');
          console.error('💡 Solution: Run the SQL script to add the status column');
          toast.error('Resources table is missing the status column. Please run the database migration.');
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

  const resources = resourcesData || [];

  const deleteMutation = useMutation(
    async (id) => {
      await deleteResource(id);
    },
    {
      onSuccess: () => {
        // Invalidate all resource-related queries for real-time sync
        queryClient.invalidateQueries('resources');
        queryClient.invalidateQueries(['resources']);
        queryClient.invalidateQueries(['resource']);
        toast.success('Resource deleted successfully!');
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete resource';
        toast.error(`Error deleting resource: ${errorMessage}`);
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteMutation.mutate(id);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return Image;
    if (type?.includes('video')) return Video;
    return File;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'reports': 'bg-purple-100 text-purple-800 border border-purple-200',
      'guidelines': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'forms': 'bg-green-100 text-green-800 border border-green-200',
      'documents': 'bg-blue-100 text-blue-800 border border-blue-200',
      'others': 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[category] || colors.others;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading resources: {error.message}</div>;
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
                <FileText className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Resources Management</h1>
            </div>
            <Link 
              to="/admin/resources/new" 
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl flex items-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add New Resource
            </Link>
          </div>
          <p className="text-blue-100 font-medium">Manage downloadable resources, documents, and forms for UCAEP.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl shadow-xl border-2 border-indigo-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
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
            <option value="reports">Reports</option>
            <option value="guidelines">Guidelines</option>
            <option value="forms">Forms</option>
            <option value="documents">Documents</option>
            <option value="other">Others</option>
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Type
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
            {resources.length > 0 ? (
              resources.map((resource) => {
                const FileIcon = getFileIcon(resource.file_type);
                const categoryColor = getCategoryColor(resource.category);
                
                return (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <FileIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                          {resource.file_size && (
                            <div className="text-sm text-gray-500">
                              {(resource.file_size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
                        {resource.category === 'reports' ? 'Reports' :
                         resource.category === 'guidelines' ? 'Guidelines' :
                         resource.category === 'forms' ? 'Forms' :
                         resource.category === 'documents' ? 'Documents' :
                         resource.category === 'others' ? 'Others' : resource.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{resource.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.fileType || resource.file_type || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {(resource.fileUrl || resource.file_url) && (
                          <a 
                            href={resource.fileUrl || resource.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900" 
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                        <Link to={`/resources/${resource.id}`} target="_blank" className="text-gray-600 hover:text-gray-900" title="View">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link to={`/admin/resources/edit/${resource.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(resource.id)} className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No resources found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourcesManagement;

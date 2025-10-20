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
import crudService from '../../services/crudService';

const ResourcesManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: resources, isLoading, error } = useQuery(
    ['resources', { searchTerm, filterCategory }],
    async () => {
      let filters = {};
      if (filterCategory !== 'all') filters.category = filterCategory;

      const allResources = await crudService.resources.fetchAll(filters);
      if (searchTerm) {
        return allResources.filter(resource =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return allResources;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.resources.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resources');
        toast.success('Resource deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting resource: ${err.message}`);
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
      'document': 'bg-blue-100 text-blue-800',
      'form': 'bg-green-100 text-green-800',
      'report': 'bg-purple-100 text-purple-800',
      'guide': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading resources: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FileText className="w-7 h-7 mr-3 text-primary-600" /> Resources Management
        </h1>
        <Link to="/admin/resources/new" className="btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Resource
        </Link>
      </div>

      <p className="text-gray-600">Manage downloadable resources, documents, and forms for UCAEP.</p>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
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
            <option value="document">Documents</option>
            <option value="form">Forms</option>
            <option value="report">Reports</option>
            <option value="guide">Guides</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
                        {resource.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{resource.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.file_type || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {resource.file_url && (
                          <a 
                            href={resource.file_url} 
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
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Users2,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Globe,
  Building,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';

const PartnershipsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: partnerships, isLoading, error } = useQuery(
    ['partnerships', { searchTerm, filterType }],
    async () => {
      let filters = {};
      if (filterType !== 'all') filters.partner_type = filterType;

      const allPartnerships = await crudService.partnerships.fetchAll(filters);
      if (searchTerm) {
        return allPartnerships.filter(partnership =>
          partnership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partnership.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return allPartnerships;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.partnerships.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('partnerships');
        toast.success('Partnership deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting partnership: ${err.message}`);
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this partnership?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      local: Users,
      international: Globe,
      government: Building,
      ngo: Users2,
      private: Building,
    };
    return typeIcons[type] || Building;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      local: 'bg-blue-100 text-blue-800',
      international: 'bg-green-100 text-green-800',
      government: 'bg-purple-100 text-purple-800',
      ngo: 'bg-orange-100 text-orange-800',
      private: 'bg-gray-100 text-gray-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading partnerships...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading partnerships: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users2 className="w-7 h-7 mr-3 text-primary-600" /> Partnerships Management
        </h1>
        <Link to="/admin/partnerships/new" className="btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Partnership
        </Link>
      </div>

      <p className="text-gray-600">Manage local and international partnerships for UCAEP.</p>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partnerships..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="local">Local</option>
            <option value="international">International</option>
            <option value="government">Government</option>
            <option value="ngo">NGO</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Partnerships List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
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
            {partnerships.length > 0 ? (
              partnerships.map((partnership) => {
                const TypeIcon = getTypeIcon(partnership.partner_type);
                const typeColor = getTypeColor(partnership.partner_type);
                
                return (
                  <tr key={partnership.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <TypeIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{partnership.name}</div>
                          {partnership.website && (
                            <div className="text-sm text-gray-500">
                              <a href={partnership.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                        {partnership.partner_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{partnership.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partnership.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {partnership.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/partnerships/${partnership.id}`} target="_blank" className="text-gray-600 hover:text-gray-900" title="View">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link to={`/admin/partnerships/edit/${partnership.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(partnership.id)} className="text-red-600 hover:text-red-900" title="Delete">
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
                  No partnerships found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnershipsManagement;

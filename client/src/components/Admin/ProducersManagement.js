import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MapPin,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';

const ProducersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [filterRegion, setFilterRegion] = useState('all');

  const { data: producers, isLoading, error } = useQuery(
    ['producers', { searchTerm, filterStatus, filterRegion }],
    async () => {
      let filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterRegion !== 'all') filters.region = filterRegion;

      const allProducers = await crudService.producers.fetchAll(filters);
      if (searchTerm) {
        return allProducers.filter(producer =>
          producer.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producer.products?.some(product => product.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return allProducers;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => crudService.producers.update(id, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('producers');
        toast.success('Producer status updated successfully!');
      },
      onError: (err) => {
        toast.error(`Error updating producer status: ${err.message}`);
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.producers.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('producers');
        toast.success('Producer deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting producer: ${err.message}`);
      },
    }
  );

  const handleStatusChange = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this producer?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading producers...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading producers: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Users className="w-7 h-7 mr-3 text-primary-600" /> Producers Management
        </h1>
        <Link to="/admin/producers/new" className="btn-primary flex items-center">
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Producer
        </Link>
      </div>

      <p className="text-gray-600">Manage producer registrations and approvals for the UCAEP network.</p>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by business name, location, or products..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            <option value="Grande Comore">Grande Comore</option>
            <option value="Anjouan">Anjouan</option>
            <option value="Mohéli">Mohéli</option>
          </select>
        </div>
      </div>

      {/* Producers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {producers.length > 0 ? (
              producers.map((producer) => (
                <tr key={producer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{producer.business_name}</div>
                    <div className="text-sm text-gray-500">{producer.contact_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {producer.business_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {producer.location}, {producer.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(producer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producer.products?.slice(0, 2).join(', ')}
                    {producer.products?.length > 2 && '...'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/producers/${producer.id}`} className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link to={`/admin/producers/edit/${producer.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit className="w-5 h-5" />
                      </Link>
                      {producer.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(producer.id, 'approved')} 
                          className="text-green-600 hover:text-green-900" 
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {producer.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusChange(producer.id, 'rejected')} 
                          className="text-red-600 hover:text-red-900" 
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(producer.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No producers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProducersManagement;

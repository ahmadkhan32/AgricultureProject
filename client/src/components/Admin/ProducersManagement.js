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
import ProducerForm from './ProducerForm';

const ProducersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [filterRegion, setFilterRegion] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProducer, setEditingProducer] = useState(null);

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

  const createMutation = useMutation(
    (data) => crudService.producers.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('producers');
        setShowForm(false);
        toast.success('Producer created successfully!');
      },
      onError: (err) => {
        // Show detailed error message
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create producer';
        console.error('Create producer error:', err.response?.data || err);
        toast.error(`Error: ${errorMessage}`);
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => crudService.producers.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('producers');
        setShowForm(false);
        setEditingProducer(null);
        toast.success('Producer updated successfully!');
      },
      onError: (err) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update producer';
        console.error('Update producer error:', err.response?.data || err);
        toast.error(`Error: ${errorMessage}`);
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

  const handleCreate = () => {
    setEditingProducer(null);
    setShowForm(true);
  };

  const handleEdit = (producer) => {
    setEditingProducer(producer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this producer?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data) => {
    if (editingProducer) {
      updateMutation.mutate({ id: editingProducer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Helper function to normalize products (handle both array and JSON string)
  const normalizeProducts = (products) => {
    if (!products) return [];
    if (Array.isArray(products)) return products;
    if (typeof products === 'string') {
      try {
        const parsed = JSON.parse(products);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-amber-100 text-amber-800 border border-amber-200', icon: Clock },
      approved: { color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border border-red-200', icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${config.color} shadow-sm`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mr-3 backdrop-blur-lg">
                <Users className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Producers Management</h1>
            </div>
            <button
              onClick={handleCreate}
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl flex items-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add New Producer
            </button>
          </div>
          <p className="text-blue-100 font-medium">Manage producer registrations and approvals for the UCAEP network.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl shadow-xl border-2 border-indigo-100 flex flex-col sm:flex-row gap-4">
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
      <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-100">
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
                    {(() => {
                      const productsArray = normalizeProducts(producer.products);
                      const displayProducts = productsArray.slice(0, 2);
                      return (
                        <>
                          {displayProducts.length > 0 ? displayProducts.join(', ') : 'No products'}
                          {productsArray.length > 2 && '...'}
                        </>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/producers/${producer.id}`} className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleEdit(producer)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
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

      {/* Producer Form Modal */}
      {showForm && (
        <ProducerForm
          producer={editingProducer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProducer(null);
          }}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      )}
    </div>
  );
};

export default ProducersManagement;

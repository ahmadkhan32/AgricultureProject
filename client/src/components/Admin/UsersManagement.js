import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Shield,
  User,
  Mail,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';

const UsersManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data: users, isLoading, error } = useQuery(
    ['users', { searchTerm, filterRole }],
    async () => {
      let filters = {};
      if (filterRole !== 'all') filters.role = filterRole;

      const allUsers = await crudService.profiles.fetchAll(filters);
      if (searchTerm) {
        return allUsers.filter(user =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return allUsers;
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );

  const updateRoleMutation = useMutation(
    ({ id, role }) => crudService.profiles.update(id, { role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User role updated successfully!');
      },
      onError: (err) => {
        toast.error(`Error updating user role: ${err.message}`);
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => crudService.profiles.remove(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('User deleted successfully!');
      },
      onError: (err) => {
        toast.error(`Error deleting user: ${err.message}`);
      },
    }
  );

  const handleRoleChange = (id, newRole) => {
    updateRoleMutation.mutate({ id, role: newRole });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800 border border-red-200', icon: Shield },
      producer: { color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: User },
    };
    
    const config = roleConfig[role] || roleConfig.producer;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${config.color} shadow-sm`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">Error loading users: {error.message}</div>;
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
                <UserCheck className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
            </div>
            <Link 
              to="/admin/users/new" 
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-3 px-6 rounded-2xl flex items-center shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Add New User
            </Link>
          </div>
          <p className="text-blue-100 font-medium">Manage user accounts and roles for the UCAEP platform.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl shadow-xl border-2 border-indigo-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            className="input-field pl-10"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="producer">Producers</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.email_confirmed_at ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/users/${user.id}`} className="text-gray-600 hover:text-gray-900" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link to={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit className="w-5 h-5" />
                      </Link>
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleRoleChange(user.id, user.role === 'producer' ? 'admin' : 'producer')} 
                          className="text-green-600 hover:text-green-900" 
                          title="Change Role"
                        >
                          <Shield className="w-5 h-5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;

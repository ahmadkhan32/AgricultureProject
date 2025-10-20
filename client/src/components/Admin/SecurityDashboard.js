import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ShieldCheck, Users, UserCog, RefreshCcw, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';
import crudService from '../../services/crudService';
import { useSecurity } from '../../contexts/SecurityContext';
import { ROLES, PERMISSIONS } from '../../utils/security';

const SecurityDashboard = () => {
  const { userRole, logAuditEvent, AUDIT_ACTIONS } = useSecurity();
  // const [selectedUser, setSelectedUser] = useState(null); // For future use
  const [showPermissions, setShowPermissions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const queryClient = useQueryClient();

  // Fetch users with profiles
  const { data: users, isLoading: usersLoading } = useQuery(
    'admin-users',
    async () => {
      try {
        const profiles = await crudService.profiles.fetchAll();
        return profiles.map(profile => ({
          id: profile.id,
          email: profile.email || 'N/A',
          firstName: profile.first_name || 'N/A',
          lastName: profile.last_name || 'N/A',
          role: profile.role || ROLES.VIEWER,
          status: profile.status || 'active',
          lastLogin: profile.last_login || 'Never',
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        return [];
      }
    }
  );

  // Update user role mutation
  const updateRoleMutation = useMutation(
    async ({ userId, newRole }) => {
      const updatedProfile = await crudService.profiles.update(userId, {
        role: newRole,
        updated_at: new Date().toISOString(),
      });
      return updatedProfile;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('admin-users');
        logAuditEvent(AUDIT_ACTIONS.ROLE_CHANGE, 'user_role', {
          targetUserId: variables.userId,
          newRole: variables.newRole,
        });
        toast.success('User role updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update user role');
        console.error('Role update error:', error);
      },
    }
  );

  // Toggle user status mutation
  const toggleStatusMutation = useMutation(
    async ({ userId, currentStatus }) => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const updatedProfile = await crudService.profiles.update(userId, {
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
      return updatedProfile;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('admin-users');
        logAuditEvent(AUDIT_ACTIONS.UPDATE, 'user_status', {
          targetUserId: variables.userId,
          newStatus: variables.currentStatus === 'active' ? 'inactive' : 'active',
        });
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update user status');
        console.error('Status update error:', error);
      },
    }
  );

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  // Get role permissions
  const getRolePermissions = (role) => {
    const rolePermissions = {
      [ROLES.ADMIN]: [
        PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE,
        PERMISSIONS.NEWS_DELETE, PERMISSIONS.NEWS_PUBLISH,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE,
        PERMISSIONS.PRODUCER_DELETE, PERMISSIONS.PRODUCER_APPROVE,
        PERMISSIONS.USER_READ, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE,
        PERMISSIONS.USER_DELETE, PERMISSIONS.USER_MANAGE_ROLES,
        PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS, PERMISSIONS.DASHBOARD_MANAGE,
      ],
      [ROLES.MODERATOR]: [
        PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE, PERMISSIONS.NEWS_PUBLISH,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_APPROVE,
        PERMISSIONS.USER_READ,
        PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS,
      ],
      [ROLES.PRODUCER]: [
        PERMISSIONS.NEWS_READ,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE,
        PERMISSIONS.DASHBOARD_VIEW,
      ],
      [ROLES.VIEWER]: [
        PERMISSIONS.NEWS_READ,
        PERMISSIONS.PRODUCER_READ,
        PERMISSIONS.DASHBOARD_VIEW,
      ],
    };
    
    return rolePermissions[role] || [];
  };

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  // Handle status toggle
  const handleStatusToggle = (userId, currentStatus) => {
    toggleStatusMutation.mutate({ userId, currentStatus });
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-red-100 text-red-800';
      case ROLES.MODERATOR:
        return 'bg-blue-100 text-blue-800';
      case ROLES.PRODUCER:
        return 'bg-green-100 text-green-800';
      case ROLES.VIEWER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <p className="text-gray-600">Manage user roles, permissions, and security settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPermissions(!showPermissions)}
            className="btn-secondary flex items-center"
          >
            {showPermissions ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPermissions ? 'Hide' : 'Show'} Permissions
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users?.filter(u => u.role === ROLES.ADMIN).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UserCog className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moderators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users?.filter(u => u.role === ROLES.MODERATOR).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <RefreshCcw className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users?.filter(u => u.status === 'active').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.MODERATOR}>Moderator</option>
              <option value={ROLES.PRODUCER}>Producer</option>
              <option value={ROLES.VIEWER}>Viewer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      disabled={userRole !== ROLES.ADMIN}
                    >
                      <option value={ROLES.VIEWER}>Viewer</option>
                      <option value={ROLES.PRODUCER}>Producer</option>
                      <option value={ROLES.MODERATOR}>Moderator</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                    
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                        user.status === 'active'
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      disabled={userRole !== ROLES.ADMIN}
                    >
                      {user.status === 'active' ? (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 mr-1" />
                          Enable
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Overview */}
      {showPermissions && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Role Permissions Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(ROLES).map((role) => (
                <div key={role} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">{role}</h4>
                  <div className="space-y-1">
                    {getRolePermissions(role).map((permission) => (
                      <div key={permission} className="text-xs text-gray-600">
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityDashboard;
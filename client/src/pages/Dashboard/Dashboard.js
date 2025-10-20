import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  FileText, 
  Settings, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import crudService from '../../services/crudService';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: producerProfile, isLoading } = useQuery(
    'user-producer-profile',
    async () => {
      if (!user) return null;
      
      try {
        const producers = await crudService.producers.fetchAll({ user_id: user.id });
        return producers.length > 0 ? producers[0] : null;
      } catch (error) {
        console.error('Error fetching user producer profile:', error);
        return null;
      }
    },
    {
      enabled: !!user,
    }
  );

  const stats = [
    {
      title: 'Profile Status',
      value: producerProfile ? 'Complete' : 'Incomplete',
      icon: User,
      color: producerProfile ? 'text-green-600' : 'text-yellow-600',
      bgColor: producerProfile ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      title: 'Business Type',
      value: producerProfile?.business_type || 'Not Set',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Region',
      value: producerProfile?.region || 'Not Set',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Status',
      value: producerProfile?.status || 'Not Registered',
      icon: CheckCircle,
      color: producerProfile?.status === 'approved' ? 'text-green-600' : 
             producerProfile?.status === 'pending' ? 'text-yellow-600' : 'text-gray-600',
      bgColor: producerProfile?.status === 'approved' ? 'bg-green-100' : 
               producerProfile?.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100',
    },
  ];

  const quickActions = [
    {
      title: 'Complete Profile',
      description: 'Set up your producer profile',
      icon: User,
      link: '/producer/profile',
      color: 'bg-blue-600 hover:bg-blue-700',
      show: !producerProfile,
    },
    {
      title: 'Update Profile',
      description: 'Manage your business information',
      icon: Settings,
      link: '/producer/profile',
      color: 'bg-green-600 hover:bg-green-700',
      show: !!producerProfile,
    },
    {
      title: 'View News',
      description: 'Stay updated with latest news',
      icon: FileText,
      link: '/news',
      color: 'bg-purple-600 hover:bg-purple-700',
      show: true,
    },
    {
      title: 'Explore Services',
      description: 'Discover available services',
      icon: TrendingUp,
      link: '/services',
      color: 'bg-orange-600 hover:bg-orange-700',
      show: true,
    },
  ];

  const getStatusMessage = () => {
    if (!producerProfile) {
      return {
        type: 'warning',
        message: 'Complete your producer profile to access all features',
        icon: AlertCircle,
      };
    }
    
    switch (producerProfile.status) {
      case 'pending':
        return {
          type: 'info',
          message: 'Your profile is under review. We\'ll notify you once it\'s approved.',
          icon: Clock,
        };
      case 'approved':
        return {
          type: 'success',
          message: 'Your profile is approved and visible to the public.',
          icon: CheckCircle,
        };
      case 'rejected':
        return {
          type: 'error',
          message: 'Your profile was rejected. Please update and resubmit.',
          icon: AlertCircle,
        };
      default:
        return {
          type: 'info',
          message: 'Complete your profile to get started.',
          icon: User,
        };
    }
  };

  const statusMessage = getStatusMessage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your producer profile and stay updated with UCAEP activities.
          </p>
        </div>

        {/* Status Message */}
        <div className={`mb-8 p-4 rounded-lg border ${
          statusMessage.type === 'success' ? 'bg-green-50 border-green-200' :
          statusMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          statusMessage.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center">
            <statusMessage.icon className={`w-5 h-5 mr-3 ${
              statusMessage.type === 'success' ? 'text-green-600' :
              statusMessage.type === 'warning' ? 'text-yellow-600' :
              statusMessage.type === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`} />
            <p className={`text-sm ${
              statusMessage.type === 'success' ? 'text-green-800' :
              statusMessage.type === 'warning' ? 'text-yellow-800' :
              statusMessage.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {statusMessage.message}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-lg font-semibold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions
              .filter(action => action.show)
              .map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} text-white p-4 rounded-lg hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className="w-6 h-6 mr-2" />
                      <h3 className="font-semibold">{action.title}</h3>
                    </div>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h2>
            {producerProfile ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{producerProfile.business_name}</h3>
                  <p className="text-sm text-gray-600">{producerProfile.business_type} • {producerProfile.region}</p>
                </div>
                {producerProfile.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {producerProfile.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {producerProfile.products?.slice(0, 3).map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-800"
                    >
                      {product}
                    </span>
                  ))}
                  {producerProfile.products?.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{producerProfile.products.length - 3} more
                    </span>
                  )}
                </div>
                <Link
                  to="/producer/profile"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Full Profile →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't created a producer profile yet.</p>
                <Link
                  to="/producer/profile"
                  className="btn-primary"
                >
                  Create Profile
                </Link>
              </div>
            )}
          </div>

          {/* Recent News */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent News</h2>
              <Link
                to="/news"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {/* This would typically fetch recent news */}
              <div className="border-l-4 border-primary-600 pl-4">
                <h3 className="font-medium text-gray-900 text-sm">New Training Program Available</h3>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-medium text-gray-900 text-sm">Agricultural Market Update</h3>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-medium text-gray-900 text-sm">Partnership Announcement</h3>
                <p className="text-xs text-gray-500">2 weeks ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Newspaper, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  MapPin,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Plus,
  Settings,
  UserCheck,
  Handshake
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { analyticsService, enhancedNewsService, enhancedProducersService, enhancedContactMessagesService, enhancedEventsService, enhancedResourcesService } from '../../services/crudService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentNews, setRecentNews] = useState([]);
  const [pendingProducers, setPendingProducers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [producerStats, setProducerStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        statsResult,
        recentNewsResult,
        pendingProducersResult,
        unreadMessagesResult,
        upcomingEventsResult,
        producerStatsResult
      ] = await Promise.all([
        analyticsService.getDashboardStats(),
        enhancedNewsService.getPublishedNews(5),
        enhancedProducersService.getPendingProducers(),
        enhancedContactMessagesService.getUnreadMessages(),
        enhancedEventsService.getUpcomingEvents(5),
        analyticsService.getProducerStatsByRegion()
      ]);

      setStats(statsResult.data);
      setRecentNews(recentNewsResult.data || []);
      setPendingProducers(pendingProducersResult.data || []);
      setUnreadMessages(unreadMessagesResult.data || []);
      setUpcomingEvents(upcomingEventsResult.data || []);
      setProducerStats(producerStatsResult.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProducer = async (producerId) => {
    try {
      const { error } = await enhancedProducersService.approveProducer(producerId);
      if (!error) {
        toast.success('Producer approved successfully');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error('Failed to approve producer');
      }
    } catch (error) {
      toast.error('Error approving producer');
    }
  };

  const handleRejectProducer = async (producerId) => {
    try {
      const { error } = await enhancedProducersService.rejectProducer(producerId);
      if (!error) {
        toast.success('Producer rejected');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error('Failed to reject producer');
      }
    } catch (error) {
      toast.error('Error rejecting producer');
    }
  };

  const handleMarkMessageAsRead = async (messageId) => {
    try {
      const { error } = await enhancedContactMessagesService.markAsRead(messageId);
      if (!error) {
        toast.success('Message marked as read');
        fetchDashboardData(); // Refresh data
      } else {
        toast.error('Failed to mark message as read');
      }
    } catch (error) {
      toast.error('Error marking message as read');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      title: 'Total News',
      value: stats?.totalNews || 0,
      icon: Newspaper,
      color: 'blue',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Approved Producers',
      value: stats?.totalProducers || 0,
      icon: UserCheck,
      color: 'green',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: Calendar,
      color: 'purple',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      color: 'orange',
      change: '+3',
      changeType: 'neutral',
    },
  ];

  const secondaryStats = [
    {
      title: 'Total Resources',
      value: stats?.totalResources || 0,
      icon: FileText,
      color: 'indigo',
    },
    {
      title: 'Pending Producers',
      value: pendingProducers.length,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Published News',
      value: recentNews.length,
      icon: Eye,
      color: 'green',
    },
    {
      title: 'Active Services',
      value: 12, // This would come from services API
      icon: Settings,
      color: 'red',
    },
  ];

  // Chart data for producer statistics by region
  const regionChartData = producerStats ? Object.entries(producerStats).map(([region, data]) => ({
    region,
    total: data.total,
    agriculture: data.agriculture,
    livestock: data.livestock,
    fisheries: data.fisheries,
    mixed: data.mixed
  })) : [];

  // Chart data for business type distribution
  const businessTypeData = producerStats ? Object.values(producerStats).reduce((acc, regionData) => {
    acc.agriculture += regionData.agriculture;
    acc.livestock += regionData.livestock;
    acc.fisheries += regionData.fisheries;
    acc.mixed += regionData.mixed;
    return acc;
  }, { agriculture: 0, livestock: 0, fisheries: 0, mixed: 0 }) : {};

  const pieChartData = Object.entries(businessTypeData).map(([type, value]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UCAEP Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with UCAEP today.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {secondaryStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Producer Statistics by Region */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Producers by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Business Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Producers */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Producer Approvals</h3>
            <Link to="/admin/producers" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {pendingProducers.slice(0, 5).map((producer) => (
              <div key={producer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{producer.business_name}</p>
                  <p className="text-sm text-gray-600">{producer.business_type} • {producer.region}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveProducer(producer.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    title="Approve"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRejectProducer(producer.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Reject"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {pendingProducers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No pending producer approvals</p>
            )}
          </div>
        </div>

        {/* Unread Messages */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Unread Messages</h3>
            <Link to="/admin/messages" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {unreadMessages.slice(0, 5).map((message) => (
              <div key={message.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{message.name}</p>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-800 mt-1 line-clamp-2">{message.message}</p>
                  </div>
                  <button
                    onClick={() => handleMarkMessageAsRead(message.id)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded ml-2"
                    title="Mark as read"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {unreadMessages.length === 0 && (
              <p className="text-gray-500 text-center py-4">No unread messages</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/news/create"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-6 h-6 text-primary-600" />
            <span className="font-medium">Create News</span>
          </Link>
          <Link
            to="/admin/producers"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserCheck className="w-6 h-6 text-primary-600" />
            <span className="font-medium">Manage Producers</span>
          </Link>
          <Link
            to="/admin/events/create"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-600" />
            <span className="font-medium">Create Event</span>
          </Link>
          <Link
            to="/admin/partnerships"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Handshake className="w-6 h-6 text-primary-600" />
            <span className="font-medium">Manage Partnerships</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;

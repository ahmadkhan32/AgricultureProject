import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Newspaper, 
  Settings, 
  Users2, 
  FileText, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import crudService from '../../services/crudService';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import ProducerStats from './ProducerStats';
import { useTranslation } from '../withTranslation';

const DashboardOverview = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useQuery(
    'dashboard-stats',
    async () => {
      // Fetch all data in parallel
      const [news, producers, services, partnerships, resources, events, contactMessages, profiles] = await Promise.all([
        crudService.news.fetchAll(),
        crudService.producers.fetchAll(),
        crudService.services.fetchAll(),
        crudService.partnerships.fetchAll(),
        crudService.resources.fetchAll(),
        crudService.events.fetchAll(),
        crudService.contactMessages.fetchAll(),
        crudService.profiles.fetchAll(),
      ]);

      return {
        overview: {
          totalUsers: profiles.length,
          approvedProducers: producers.filter(p => p.status === 'approved').length,
          publishedNews: news.filter(n => n.status === 'published').length,
          newContactMessages: contactMessages.filter(m => !m.is_read).length,
          totalServices: services.length,
          totalPartnerships: partnerships.length,
          totalResources: resources.length,
          totalEvents: events.length,
        },
        statistics: {
          producersByType: producers.reduce((acc, p) => {
            acc[p.business_type] = (acc[p.business_type] || 0) + 1;
            return acc;
          }, {}),
          producersByRegion: producers.reduce((acc, p) => {
            acc[p.region] = (acc[p.region] || 0) + 1;
            return acc;
          }, {}),
        },
        recentActivity: [
          ...producers.slice(0, 3).map(p => ({
            type: 'producer_registered',
            data: { business_name: p.business_name },
            timestamp: p.created_at,
          })),
          ...contactMessages.slice(0, 2).map(m => ({
            type: 'message_received',
            data: { name: m.name },
            timestamp: m.created_at,
          })),
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
      };
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
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

  const overviewStats = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Producers',
      value: stats?.overview?.approvedProducers || 0,
      icon: UserCheck,
      color: 'green',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Published News',
      value: stats?.overview?.publishedNews || 0,
      icon: Newspaper,
      color: 'purple',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'New Messages',
      value: stats?.overview?.newContactMessages || 0,
      icon: MessageSquare,
      color: 'orange',
      change: '+3',
      changeType: 'neutral',
    },
  ];

  const serviceStats = [
    {
      title: 'Services',
      value: stats?.overview?.totalServices || 0,
      icon: Settings,
      color: 'indigo',
    },
    {
      title: 'Partnerships',
      value: stats?.overview?.totalPartnerships || 0,
      icon: Users2,
      color: 'pink',
    },
    {
      title: 'Resources',
      value: stats?.overview?.totalResources || 0,
      icon: FileText,
      color: 'yellow',
    },
    {
      title: 'Events',
      value: stats?.overview?.totalEvents || 0,
      icon: TrendingUp,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">{t('admin.dashboard.overview')}</h1>
          <p className="text-blue-100 text-lg font-medium">Welcome back! Here's what's happening with UCAEP today.</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Producer Statistics */}
        <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl p-8 border-2 border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {t('admin.dashboard.producer_statistics')}
          </h3>
          <ProducerStats stats={stats?.statistics} />
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl p-8 border-2 border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            {t('admin.dashboard.recent_activity')}
          </h3>
          <RecentActivity activity={stats?.recentActivity} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl shadow-xl p-8 border-2 border-indigo-100 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
            <Settings className="w-5 h-5 text-white" />
          </div>
          {t('admin.dashboard.quick_actions')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/news" className="flex flex-col items-center justify-center space-y-3 p-8 border-2 border-indigo-200 rounded-2xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 to-indigo-50 transition-all group shadow-md hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-blue-700">{t('admin.management.create')} {t('admin.news')}</span>
          </Link>
          <Link to="/admin/producers" className="flex flex-col items-center justify-center space-y-3 p-8 border-2 border-indigo-200 rounded-2xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 to-pink-50 transition-all group shadow-md hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-purple-700">{t('admin.management.approve')} {t('admin.producers')}</span>
          </Link>
          <Link to="/admin/messages" className="flex flex-col items-center justify-center space-y-3 p-8 border-2 border-indigo-200 rounded-2xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 to-emerald-50 transition-all group shadow-md hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-green-700">{t('admin.management.view')} {t('admin.messages')}</span>
          </Link>
          <Link to="/admin/services" className="flex flex-col items-center justify-center space-y-3 p-8 border-2 border-indigo-200 rounded-2xl hover:border-indigo-500 hover:bg-gradient-to-br hover:from-indigo-50 to-blue-50 transition-all group shadow-md hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-indigo-700">{t('admin.management.manage')} {t('admin.services')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

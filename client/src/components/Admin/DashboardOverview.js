import React from 'react';
import { useQuery } from 'react-query';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard.overview')}</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with UCAEP today.</p>
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
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.producer_statistics')}</h3>
          <ProducerStats stats={stats?.statistics} />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.recent_activity')}</h3>
          <RecentActivity activity={stats?.recentActivity} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.dashboard.quick_actions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Newspaper className="w-6 h-6 text-primary-600" />
            <span className="font-medium">{t('admin.management.create')} {t('admin.news')}</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserCheck className="w-6 h-6 text-primary-600" />
            <span className="font-medium">{t('admin.management.approve')} {t('admin.producers')}</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-6 h-6 text-primary-600" />
            <span className="font-medium">{t('admin.management.view')} {t('admin.messages')}</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-6 h-6 text-primary-600" />
            <span className="font-medium">{t('admin.management.manage')} {t('admin.services')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

import React from 'react';
import { 
  UserPlus, 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  Users
} from 'lucide-react';

const RecentActivity = ({ activity = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'user_registered': UserPlus,
      'news_published': FileText,
      'message_received': MessageSquare,
      'producer_approved': CheckCircle,
      'producer_rejected': XCircle,
      'event_created': Calendar,
      'producer_registered': Users,
    };
    return icons[type] || Clock;
  };

  const getActivityColor = (type) => {
    const colors = {
      'user_registered': 'text-blue-600 bg-blue-100',
      'news_published': 'text-green-600 bg-green-100',
      'message_received': 'text-orange-600 bg-orange-100',
      'producer_approved': 'text-green-600 bg-green-100',
      'producer_rejected': 'text-red-600 bg-red-100',
      'event_created': 'text-purple-600 bg-purple-100',
      'producer_registered': 'text-indigo-600 bg-indigo-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const formatActivityMessage = (activity) => {
    switch (activity.type) {
      case 'user_registered':
        return `New user registered: ${activity.data?.name || 'Unknown'}`;
      case 'news_published':
        return `News published: ${activity.data?.title || 'Untitled'}`;
      case 'message_received':
        return `New message from: ${activity.data?.name || 'Unknown'}`;
      case 'producer_approved':
        return `Producer approved: ${activity.data?.business_name || 'Unknown'}`;
      case 'producer_rejected':
        return `Producer rejected: ${activity.data?.business_name || 'Unknown'}`;
      case 'event_created':
        return `Event created: ${activity.data?.title || 'Untitled'}`;
      case 'producer_registered':
        return `Producer registered: ${activity.data?.business_name || 'Unknown'}`;
      default:
        return activity.message || 'Unknown activity';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  // Mock data if no activity provided
  const mockActivity = [
    {
      id: 1,
      type: 'producer_registered',
      message: 'New producer registered',
      data: { business_name: 'Comoros Organic Farm' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      type: 'message_received',
      message: 'New contact message',
      data: { name: 'Ahmed Ali' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      type: 'news_published',
      message: 'News article published',
      data: { title: 'Agricultural Training Program' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      type: 'producer_approved',
      message: 'Producer approved',
      data: { business_name: 'Mohéli Fisheries Co.' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const activities = activity.length > 0 ? activity : mockActivity;

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((item) => {
          const Icon = getActivityIcon(item.type);
          const colorClass = getActivityColor(item.type);
          
          return (
            <div key={item.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {formatActivityMessage(item)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(item.timestamp)}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
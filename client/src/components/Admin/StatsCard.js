import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const bgColor = colorClasses[color] || 'bg-primary-500';

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                {change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
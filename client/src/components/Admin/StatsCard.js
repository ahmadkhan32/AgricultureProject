import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  const gradientClasses = {
    blue: 'from-blue-500 via-blue-600 to-indigo-600',
    green: 'from-green-500 via-emerald-600 to-teal-600',
    purple: 'from-purple-500 via-indigo-600 to-blue-600',
    orange: 'from-orange-500 via-amber-600 to-yellow-600',
    indigo: 'from-indigo-500 via-blue-600 to-purple-600',
    pink: 'from-pink-500 via-rose-600 to-red-600',
    yellow: 'from-yellow-500 via-orange-600 to-red-600',
    red: 'from-red-500 via-pink-600 to-rose-600',
  };

  const gradientBg = gradientClasses[color] || 'from-blue-500 via-indigo-600 to-purple-600';

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl shadow-xl p-6 border-2 border-indigo-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-indigo-600 mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">{value}</p>
            {change && (
              <div className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                changeType === 'positive' ? 'bg-green-100 text-green-700 border border-green-200' : 
                changeType === 'negative' ? 'bg-red-100 text-red-700 border border-red-200' : 
                'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}>
                {changeType === 'positive' && <TrendingUp className="w-3 h-3 mr-1" />}
                {changeType === 'negative' && <TrendingDown className="w-3 h-3 mr-1" />}
                {change}
              </div>
            )}
          </div>
        </div>
        <div className={`w-16 h-16 bg-gradient-to-br ${gradientBg} rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 ring-2 ring-indigo-500/10`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
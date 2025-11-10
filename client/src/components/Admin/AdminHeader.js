import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useTranslation } from '../withTranslation';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-white via-indigo-50/30 to-white shadow-lg border-b border-indigo-100 sticky top-0 z-40 backdrop-blur-xl bg-white/95">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              {t('admin.header.title')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.header.search_placeholder')}
                className="block w-72 pl-12 pr-4 py-3 border-2 border-indigo-100 rounded-2xl leading-5 bg-gradient-to-r from-indigo-50 to-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-2xl transition-all shadow-sm hover:shadow-md">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 ring-2 ring-white shadow-sm"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l-2 border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0] || user?.email?.[0] || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || t('admin.header.admin_user')}
                </p>
                <p className="text-xs text-indigo-600 font-medium">{user?.email || t('admin.header.admin_email')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

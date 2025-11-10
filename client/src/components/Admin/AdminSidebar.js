import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Settings, 
  Users2, 
  FileText, 
  UserCheck, 
  MessageSquare, 
  Calendar,
  Database,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../withTranslation';

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Safe translation helper with fallback - memoized to prevent recreation
  const getTranslation = React.useCallback((key, fallback) => {
    try {
      const translated = t(key);
      return translated && translated !== key ? translated : fallback;
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback;
    }
  }, [t]);

  // Memoize navigation items to prevent recreation on every render
  const navigation = useMemo(() => [
    { name: getTranslation('admin.sidebar.dashboard', 'Dashboard'), href: '/admin', icon: LayoutDashboard, exact: true },
    { name: getTranslation('admin.sidebar.news', 'News'), href: '/admin/news', icon: Newspaper, exact: false },
    { name: getTranslation('admin.sidebar.producers', 'Producers'), href: '/admin/producers', icon: Users, exact: false },
    { name: getTranslation('admin.sidebar.services', 'Services'), href: '/admin/services', icon: Settings, exact: false },
    { name: getTranslation('admin.sidebar.partnerships', 'Partnerships'), href: '/admin/partnerships', icon: Users2, exact: false },
    { name: getTranslation('admin.sidebar.resources', 'Resources'), href: '/admin/resources', icon: FileText, exact: false },
    { name: getTranslation('admin.sidebar.users', 'Users'), href: '/admin/users', icon: UserCheck, exact: false },
    { name: getTranslation('admin.sidebar.messages', 'Messages'), href: '/admin/messages', icon: MessageSquare, exact: false },
    { name: getTranslation('admin.sidebar.events', 'Events'), href: '/admin/events', icon: Calendar, exact: false },
    { name: getTranslation('admin.sidebar.security', 'Security'), href: '/admin/security', icon: ShieldCheck, exact: false },
    { name: getTranslation('admin.sidebar.data_populator', 'Data Populator'), href: '/admin/data-populator', icon: Database, exact: false },
  ], [getTranslation]);

  // Improved active state detection with better edge case handling
  const isActiveRoute = React.useCallback((href, exact = false) => {
    const pathname = location.pathname;
    
    // Normalize paths by removing trailing slashes for comparison
    const normalizePath = (path) => {
      return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    };
    
    const normalizedPathname = normalizePath(pathname);
    const normalizedHref = normalizePath(href);
    
    if (exact) {
      // For dashboard, only match exactly /admin
      return normalizedPathname === normalizedHref;
    } else {
      // For other routes, match the path and any nested paths
      // e.g., /admin/services matches /admin/services, /admin/services/new, /admin/services/edit/1
      if (normalizedPathname === normalizedHref) return true;
      if (normalizedPathname.startsWith(normalizedHref + '/')) return true;
      return false;
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 shadow-2xl h-screen sticky top-0 border-r border-indigo-800/50 backdrop-blur-xl">
      <div className="p-6 h-full flex flex-col">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-indigo-800/50">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <div>
            <span className="font-bold text-xl text-white tracking-tight">{getTranslation('admin.sidebar.title', 'UCAEP')}</span>
            <p className="text-xs text-indigo-300 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const customIsActive = isActiveRoute(item.href, item.exact);
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                className={({ isActive: navIsActive }) => {
                  // Combine NavLink's built-in isActive with our custom logic for nested routes
                  const active = navIsActive || customIsActive;
                  // Store active state in data attribute for CSS/JS access
                  return `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                      : 'text-indigo-200 hover:bg-indigo-800/40 hover:text-white hover:translate-x-1 hover:shadow-md'
                  }`;
                }}
              >
                {customIsActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-lg pointer-events-none z-10" />
                )}
                <Icon className={`w-5 h-5 transition-colors flex-shrink-0 ${customIsActive ? 'text-white' : 'text-indigo-400 group-hover:text-blue-400'}`} />
                <span className="relative flex-1 truncate" title={item.name}>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-indigo-800/50">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-indigo-200 hover:bg-red-600/20 hover:text-red-300 w-full transition-all duration-200 group hover:shadow-md"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
            <span>{getTranslation('admin.sidebar.sign_out', 'Sign Out')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

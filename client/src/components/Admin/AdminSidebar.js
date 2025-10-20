import React from 'react';
import { NavLink } from 'react-router-dom';
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

const AdminSidebar = () => {
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Producers', href: '/admin/producers', icon: Users },
    { name: 'Services', href: '/admin/services', icon: Settings },
    { name: 'Partnerships', href: '/admin/partnerships', icon: Users2 },
    { name: 'Resources', href: '/admin/resources', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: UserCheck },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Security', href: '/admin/security', icon: ShieldCheck },
    { name: 'Data Populator', href: '/admin/data-populator', icon: Database },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="font-bold text-xl text-gray-900">UCAEP Admin</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

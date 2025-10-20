import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../components/withTranslation';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import logo from '../../Images/Logo.jpeg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.news'), href: '/news' },
    { name: t('navigation.services'), href: '/services' },
    { name: t('navigation.producers'), href: '/producers' },
    { name: t('navigation.partnerships'), href: '/partnerships' },
    { name: t('navigation.resources'), href: '/resources' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="UCAEP Logo" className="w-10 h-10 object-contain rounded-full" />
            <span className="font-bold text-xl text-green-600">UCAEP</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-600 transition font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center space-x-5">
            <LanguageSwitcher size="small" showLabel={false} />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{t('navigation.profile')}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2 text-green-600" />
                      {t('navigation.dashboard')}
                    </Link>
                    <Link
                      to="/producer/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      {t('producer_profile.title')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-red-500" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 text-sm font-medium transition"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-gray-700 hover:text-green-600 text-base font-medium py-2 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-3">
              <LanguageSwitcher size="default" showLabel={true} />
            </div>

            {user ? (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  to="/producer/profile"
                  className="block text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('producer_profile.title')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-700 hover:text-red-500 py-2 font-medium"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-green-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/register"
                  className="block bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-full font-medium transition"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

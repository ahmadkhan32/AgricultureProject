import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../components/withTranslation';
import { Menu, X, User, LogOut, Settings, Search, ChevronDown } from 'lucide-react';
import UCAEPLogo from '../Logo/UCAEPLogo';
import LanguageSwitcher from '../LanguageSwitcher';

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
    <nav className="sticky top-0 z-50">
      {/* Navigation Bar - Dark Blue */}
      <div className="bg-[#1e3a5f] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex-shrink-0 mr-4">
              <UCAEPLogo 
                size="small" 
                showText={false}
                showFullName={false}
                variant="dark"
                linkTo="/"
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 flex-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white hover:text-orange-400 transition font-bold text-xs md:text-sm uppercase tracking-wide flex items-center gap-1 group"
                >
                  {item.name}
                  <ChevronDown className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>

            {/* Right Side Controls */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector - Orange Circle */}
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                <span className="text-white font-bold text-sm uppercase">EN</span>
              </div>
              
              {/* Search Icon */}
              <button className="text-white hover:text-orange-400 transition">
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white hover:text-orange-400 transition"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-text-dark hover:bg-bg-light"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2 text-accent-500" />
                        {t('navigation.dashboard')}
                      </Link>
                      <Link
                        to="/producer/profile"
                        className="flex items-center px-4 py-2 text-sm text-text-dark hover:bg-bg-light"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2 text-accent-500" />
                        {t('producer_profile.title')}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-text-dark hover:bg-bg-light"
                      >
                        <LogOut className="w-4 h-4 mr-2 text-red-500" />
                        {t('navigation.logout')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!user && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-white hover:text-orange-400 text-sm font-medium transition"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
                  >
                    {t('navigation.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Logo for Mobile */}
              <div className="flex-shrink-0 mr-2">
                <UCAEPLogo 
                  size="small" 
                  showText={false}
                  showFullName={false}
                  variant="dark"
                  linkTo="/"
                />
              </div>
              <button className="text-white hover:text-orange-400 transition">
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-orange-400 focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Separator - Two White Lines */}
        <div className="h-0.5 bg-white opacity-30"></div>
        <div className="h-0.5 bg-white opacity-20 mt-0.5"></div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#1e3a5f] border-t border-[#2a4a6f]">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-white hover:text-orange-400 text-base font-bold py-2 border-b border-[#2a4a6f] uppercase tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-3">
              <LanguageSwitcher size="default" showLabel={true} />
            </div>

            {user ? (
              <div className="pt-3 border-t border-[#2a4a6f] space-y-2">
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-orange-400 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  to="/producer/profile"
                  className="block text-white hover:text-orange-400 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('producer_profile.title')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-white hover:text-red-300 py-2 font-medium"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#2a4a6f] space-y-2">
                <Link
                  to="/login"
                  className="block text-white hover:text-orange-400 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/register"
                  className="block bg-orange-500 hover:bg-orange-600 text-white text-center py-2 rounded-lg font-medium transition shadow-md"
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

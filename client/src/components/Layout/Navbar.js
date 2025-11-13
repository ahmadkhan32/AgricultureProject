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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14">
            {/* Logo - Visible on all screens */}
            <div className="flex-shrink-0 mr-2 sm:mr-4">
              <UCAEPLogo 
                size="small" 
                showText={false}
                showFullName={false}
                variant="dark"
                linkTo="/"
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-1 ml-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white hover:text-orange-400 transition font-bold text-xs xl:text-sm uppercase tracking-wide flex items-center gap-1 group whitespace-nowrap"
                >
                  {item.name}
                  <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 opacity-70 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>

            {/* Right Side Controls - Desktop */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher size="default" showLabel={false} className="dark navbar" />
              
              {/* Search Icon */}
              <button className="text-white hover:text-orange-400 transition p-1" aria-label="Search">
                <Search className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white hover:text-orange-400 transition p-1"
                    aria-label="User menu"
                  >
                    <User className="w-4 h-4 xl:w-5 xl:h-5" />
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
                <div className="flex items-center gap-2 xl:gap-3">
                  <Link
                    to="/login"
                    className="text-white hover:text-orange-400 text-xs xl:text-sm font-medium transition whitespace-nowrap"
                  >
                    {t('navigation.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition shadow-md whitespace-nowrap"
                  >
                    {t('navigation.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Menu Button */}
            <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
              {/* Language Switcher - Mobile */}
              <div className="hidden sm:block">
                <LanguageSwitcher size="small" showLabel={false} className="dark navbar" />
              </div>
              
              {/* Search Icon - Mobile */}
              <button className="text-white hover:text-orange-400 transition p-1" aria-label="Search">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-orange-400 focus:outline-none p-1"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Separator - Two White Lines */}
        <div className="h-0.5 bg-white opacity-30"></div>
        <div className="h-0.5 bg-white opacity-20 mt-0.5"></div>
      </div>

      {/* Mobile/Tablet Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#1e3a5f] border-t border-[#2a4a6f] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-3 sm:px-4 pt-3 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-white hover:text-orange-400 text-sm sm:text-base font-bold py-2 sm:py-2.5 border-b border-[#2a4a6f] uppercase tracking-wide transition"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Language Switcher - Mobile */}
            <div className="pt-3 sm:hidden">
              <LanguageSwitcher size="default" showLabel={true} />
            </div>

            {user ? (
              <div className="pt-3 border-t border-[#2a4a6f] space-y-2">
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-orange-400 py-2 text-sm sm:text-base transition"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  to="/producer/profile"
                  className="block text-white hover:text-orange-400 py-2 text-sm sm:text-base transition"
                  onClick={() => setIsOpen(false)}
                >
                  {t('producer_profile.title')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-white hover:text-red-300 py-2 font-medium text-sm sm:text-base transition"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#2a4a6f] space-y-2">
                <Link
                  to="/login"
                  className="block text-white hover:text-orange-400 py-2 text-sm sm:text-base transition"
                  onClick={() => setIsOpen(false)}
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  to="/register"
                  className="block bg-orange-500 hover:bg-orange-600 text-white text-center py-2.5 sm:py-3 rounded-lg font-medium transition shadow-md text-sm sm:text-base"
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Globe, GraduationCap, MapPin as LocationPin, AtSign } from 'lucide-react';
import UCAEPLogo from '../Logo/UCAEPLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const quickLinks = [
    { name: 'À propos', href: '/about' },
    { name: 'Actualités', href: '/news' },
    { name: 'Services', href: '/services' },
    { name: 'Producteurs', href: '/producers' },
    { name: 'Partenariats', href: '/partnerships' },
    { name: 'Ressources', href: '/resources' },
  ];

  const services = [
    { name: 'Soutien aux producteurs', href: '/services' },
    { name: 'Programmes de formation', href: '/services' },
    { name: 'Programmes d\'assistance', href: '/services' },
    { name: 'Recherche & Innovation', href: '/services' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', { email });
    // Add your newsletter subscription logic here
  };

  return (
    <footer className="relative w-full overflow-hidden">
      {/* Header Section with Logos */}
      <div className="bg-white px-4 sm:px-6 md:px-12 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto">
          {/* UCAEP Logo */}
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
            <UCAEPLogo 
              size="small" 
              showText={true}
              showFullName={false}
              variant="default"
              linkTo="/"
            />
          </div>

          {/* Connecting Line - Hidden on mobile */}
          <div className="hidden sm:flex flex-1 mx-4 relative">
            <div className="h-0.5 bg-green-600 relative w-full">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>

          {/* UCAEP Actu Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-end">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="text-blue-700 font-bold text-base sm:text-lg italic">UCAEP Actu</div>
          </div>
        </div>
      </div>

      {/* Main Footer - Two Panel Layout */}
      <div className="relative flex flex-col md:flex-row">
        {/* Left Panel - Dark Blue */}
        <div className="bg-[#1e3a5f] text-white flex-[1.3] px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-16 relative min-h-full">
          {/* Diagonal separator - creates angled edge */}
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-[#1e3a5f] transform skew-x-[-12deg] origin-right hidden md:block z-0"></div>
          
          <div className="h-full relative z-10 flex flex-col">
            {/* Grid Layout for Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8 flex-1">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex flex-col items-start">
                <UCAEPLogo 
                  size="small" 
                  showText={true}
                  showFullName={true}
                  variant="light"
                  linkTo="/"
                  className="items-start"
                />
              </div>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Chambre d'Agriculture, d'Élevage et de Pêche des Comores. 
                  Promouvoir des pratiques agricoles durables et soutenir les producteurs locaux.
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        className="w-10 h-10 bg-[#2a4a6f] rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase tracking-wide">Liens rapides</h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-200 hover:text-orange-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase tracking-wide">Nos Services</h3>
                <ul className="space-y-2">
                  {services.map((service) => (
                    <li key={service.name}>
                      <Link
                        to={service.href}
                        className="text-gray-200 hover:text-orange-400 transition-colors text-sm"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase tracking-wide">Informations de contact</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-200 text-sm">
                        Route de la Corniche, Moroni Grande Comore.<br />
                        Union des Comores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <a
                      href="tel:+2697332394"
                      className="text-gray-200 hover:text-orange-400 transition-colors text-sm"
                    >
                      +2697332394
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <a
                      href="mailto:contactucaepcomores@gmail.com"
                      className="text-gray-200 hover:text-orange-400 transition-colors text-sm"
                    >
                      contactucaepcomores@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright - at bottom */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-600">
              <p className="text-xs text-gray-400 text-center">
                © {currentYear} UCAEP. Tous droits réservés.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 mt-2">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-xs"
                >
                  Politique de confidentialité
                </Link>
                <span className="hidden sm:inline text-gray-600">|</span>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-xs"
                >
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Green */}
        <div className="bg-[#2d7a3f] text-white flex-1 px-4 sm:px-6 md:px-12 py-8 sm:py-10 md:py-16 relative min-h-full">
          {/* Diagonal separator - creates angled edge */}
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-[#2d7a3f] transform skew-x-[-12deg] origin-left hidden md:block z-0"></div>
          <div className="h-full flex flex-col justify-center relative z-10">
            <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6">
              {/* Newsletter Heading */}
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-2">
                  Abonnez-vous à notre newsletter
                </h3>
                <p className="text-gray-100 text-xs sm:text-sm md:text-base px-2">
                  Recevez les dernières actualités et informations directement dans votre boîte de réception
                </p>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 sm:space-y-5 px-2">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg bg-white text-gray-900 border-2 border-red-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white font-semibold px-6 py-3 sm:py-4 rounded-lg transition-colors uppercase tracking-wide text-sm sm:text-base shadow-lg"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          {/* Vertical Icon Bar on Right Edge */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col space-y-3 pr-2">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
              <LocationPin className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
              <AtSign className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

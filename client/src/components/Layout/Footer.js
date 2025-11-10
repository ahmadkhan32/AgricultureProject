import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-primary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="font-bold text-xl uppercase tracking-wide">UCAEP</span>
            </div>
            <p className="text-primary-100 text-sm leading-relaxed">
              Chambre d'Agriculture, d'Élevage et de Pêche des Comores. 
              Promouvoir des pratiques agricoles durables et soutenir les producteurs locaux.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-primary-200 hover:text-accent-300 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
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
                    className="text-primary-100 hover:text-accent-300 transition-colors text-sm"
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
                    className="text-primary-100 hover:text-accent-300 transition-colors text-sm"
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
                <MapPin className="w-5 h-5 text-accent-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-primary-100 text-sm">
                  Route de la Corniche, Moroni Grande Comore.<br />
                    Union des Comores
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent-300 flex-shrink-0" />
                <a
                  href="tel:+26912345678"
                  className="text-primary-100 hover:text-accent-300 transition-colors text-sm"
                >
                  +2697332394
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent-300 flex-shrink-0" />
                <a
                  href="mailto:info@ucaeep.km"
                  className="text-primary-100 hover:text-accent-300 transition-colors text-sm"
                >
                  contactucaepcomores@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-primary-400 mt-8 pt-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-center mb-4">
              Abonnez-vous à notre newsletter
            </h3>
            <p className="text-primary-100 text-sm text-center mb-6">
              Recevez les dernières actualités et informations directement dans votre boîte de réception
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-primary-400 bg-primary-600 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors uppercase tracking-wide text-sm"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-400 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-200 text-sm">
              © {currentYear} UCAEP. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-primary-200 hover:text-accent-300 transition-colors text-sm"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/terms"
                className="text-primary-200 hover:text-accent-300 transition-colors text-sm"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

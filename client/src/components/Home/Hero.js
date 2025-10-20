import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-orange-600 from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6 xl font-bold mb-6 leading-tight">
            Union des chambres d’agriculture,d’élevage et de la pêche des Comores .
              <span className="text-secondary-400"> </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            C’est une institution nationale comorienne qui regroupe les trois chambres insulaires d’agriculture,d’élevage et de la pêche (ngazidja,moheli ,anjouan).Elle joue un rôle centrale dans la coordination,la représentation et la promotion des acteurs agricole,de l’élevage et de la pêche à l’échelle nationale et internationale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Join Our Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Learn More
                <Play className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-400 mb-2">500+</div>
                  <div className="text-sm text-primary-100">Active Producers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-400 mb-2">4</div>
                  <div className="text-sm text-primary-100">Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-400 mb-2">25+</div>
                  <div className="text-sm text-primary-100">Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-400 mb-2">15+</div>
                  <div className="text-sm text-primary-100">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-400/20 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-400/20 rounded-full translate-y-24 -translate-x-24"></div>
    </section>
  );
};

export default Hero;

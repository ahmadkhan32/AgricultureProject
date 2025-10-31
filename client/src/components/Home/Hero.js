import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section
      className="relative text-white bg-orange-600 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh]"
      style={{
        backgroundImage: `url(/images/pattern-light.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
          {/* Left Column */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
              Union des chambres d'agriculture, d'élevage et de la pêche des Comores
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-orange-100 mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-2xl">
              C'est une institution nationale comorienne qui regroupe les trois chambres
              insulaires d'agriculture, d'élevage et de la pêche (Ngazidja, Mohéli, Anjouan)...
            </p>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4">
              <Link
                to="/register"
                className="bg-white text-orange-700 hover:bg-orange-100 font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 lg:px-8 rounded-lg transition flex items-center justify-center text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl"
              >
                Join Our Community
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1 sm:ml-1.5 md:ml-2" />
              </Link>

              <Link
                to="/about"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-700 font-medium py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 lg:px-8 rounded-lg transition flex items-center justify-center text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl"
              >
                Learn More
                <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1 sm:ml-1.5 md:ml-2" />
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/20 w-full max-w-md">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {[
                  { number: '1000', label: 'Active Producers' },
                  { number: '4', label: 'Regions' },
                  { number: '25+', label: 'Partners' },
                  { number: '15+', label: 'Years' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-300 mb-1 sm:mb-2">
                      {item.number}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-100 leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-10 sm:-translate-y-16 md:-translate-y-24 lg:-translate-y-32 translate-x-10 sm:translate-x-16 md:translate-x-24 lg:translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-48 lg:h-48 bg-white/10 rounded-full translate-y-8 sm:translate-y-12 md:translate-y-18 lg:translate-y-24 -translate-x-8 sm:-translate-x-12 md:-translate-x-18 lg:-translate-x-24"></div>
    </section>
  );
};

export default Hero;

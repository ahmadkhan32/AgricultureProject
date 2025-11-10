import React from 'react';

const StatsSection = ({ stats }) => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 sm:p-6 bg-bg-light rounded-lg border border-gray-100 hover:border-accent-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-500 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-text-medium font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

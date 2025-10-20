import React from 'react';
import { Users, Target, Award, Globe, MapPin, Phone, Mail } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Dr. Ahmed Mohamed',
      position: 'President',
      image: '/api/placeholder/150/150',
      bio: 'Agricultural expert with 20+ years of experience in sustainable farming practices.'
    },
    {
      name: 'Fatima Ali',
      position: 'Vice President',
      image: '/api/placeholder/150/150',
      bio: 'Specialist in livestock management and rural development programs.'
    },
    {
      name: 'Omar Said',
      position: 'Director of Fisheries',
      image: '/api/placeholder/150/150',
      bio: 'Marine biologist focused on sustainable fishing practices and coastal communities.'
    }
  ];

  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We prioritize the needs and well-being of our agricultural community members.'
    },
    {
      icon: Target,
      title: 'Sustainable Development',
      description: 'Promoting environmentally friendly and economically viable agricultural practices.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Striving for the highest standards in all our programs and services.'
    },
    {
      icon: Globe,
      title: 'Global Partnership',
      description: 'Building strong international relationships for knowledge sharing and development.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About UCAEP
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              The Chamber of Agriculture, Livestock, and Fisheries of the Comoros (UCAEP) 
              is dedicated to promoting sustainable agricultural development and supporting 
              local producers across the archipelago.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To promote and support the development of agriculture, livestock, and fisheries 
                in the Comoros through capacity building, technology transfer, market access, 
                and sustainable practices that benefit local communities and the environment.
              </p>
            </div>

            <div className="card">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-secondary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be the leading organization in the Comoros that transforms the agricultural, 
                livestock, and fisheries sectors into sustainable, profitable, and environmentally 
                responsible industries that contribute to food security and economic development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide our work and define our commitment to the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our History</h2>
            <p className="section-subtitle">
              A journey of growth and impact in the Comorian agricultural sector
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2008</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Foundation</h3>
                  <p className="text-gray-600">
                    UCAEP was established with the vision of unifying agricultural stakeholders 
                    across the Comoros to promote sustainable development.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2012</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expansion</h3>
                  <p className="text-gray-600">
                    Launched comprehensive training programs and established partnerships 
                    with international organizations for knowledge transfer.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2018</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Transformation</h3>
                  <p className="text-gray-600">
                    Implemented digital platforms and modern communication tools to better 
                    serve our members and stakeholders.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2024</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">New Era</h3>
                  <p className="text-gray-600">
                    Launching this comprehensive digital platform to connect producers, 
                    share knowledge, and promote sustainable agricultural practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Leadership Team</h2>
            <p className="section-subtitle">
              Meet the dedicated professionals leading UCAEP's mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              We're here to support your agricultural journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                Moroni, Grande Comore<br />
                Union of the Comoros
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">
                +269 12 34 56 78<br />
                Mon - Fri, 8:00 AM - 5:00 PM
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">
                info@ucaeep.km<br />
                support@ucaeep.km
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

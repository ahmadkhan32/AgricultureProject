import React from "react";
import { Calendar, ArrowRight, Newspaper, Megaphone, Fish, Tractor, PawPrint } from "lucide-react";
import agricultureNews from "../Images/Farmning 1.jpg";
import fisheriesNews from "../Images/fisheries-management.jpg";
import livestockNews from "../Images/Livestock vaccines.jpg";
import pressRelease from "../Images/fao.webp";
import eventNews from "../Images/BRECOMA-1.jpg";

const News = () => {
  const newsData = [
    {
      id: 1,
      category: "Agriculture",
      title: "Comoros Launches New Sustainable Farming Initiative",
      date: "October 10, 2025",
      image: agricultureNews,
      description:
        "The Ministry of Agriculture introduced a new program to promote organic farming, reduce chemical pesticide use, and improve soil health across the islands.",
    },
    {
      id: 2,
      category: "Fisheries",
      title: "New Fishing Boats Delivered to Local Communities",
      date: "September 25, 2025",
      image: fisheriesNews,
      description:
        "To boost local fishing capacity, the Fisheries Department has distributed 20 eco-friendly fishing boats equipped with solar-powered engines.",
    },
    {
      id: 3,
      category: "Livestock",
      title: "Vaccination Drive for Livestock Health Week 2025",
      date: "September 12, 2025",
      image: livestockNews,
      description:
        "Over 5,000 animals have been vaccinated under the Livestock Health Week campaign aimed at preventing contagious diseases in rural areas.",
    },
    {
      id: 4,
      category: "Official Press Release",
      title: "UCAEP Partners with FAO for Agricultural Development",
      date: "August 30, 2025",
      image: pressRelease,
      description:
        "The Union of Chambers of Agriculture, Livestock and Fisheries (UCAEP) has signed an agreement with the FAO to support sustainable rural development in the Comoros.",
    },
    {
      id: 5,
      category: "Upcoming Event",
      title: "National Agriculture & Fisheries Forum 2025",
      date: "November 18, 2025",
      image: eventNews,
      description:
        "Join national stakeholders and international partners to discuss innovation, sustainability, and investment in agriculture and fisheries.",
    },
  ];

  const categoryIcons = {
    Agriculture: <Tractor className="w-5 h-5 text-green-600" />,
    Fisheries: <Fish className="w-5 h-5 text-blue-600" />,
    Livestock: <PawPrint className="w-5 h-5 text-amber-600" />,
    "Official Press Release": <Megaphone className="w-5 h-5 text-red-600" />,
    "Upcoming Event": <Newspaper className="w-5 h-5 text-indigo-600" />,
  };

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
          <Newspaper className="mr-2 w-5 h-5" />
          News & Announcements
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Latest Updates from Agriculture, Livestock & Fisheries
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Stay informed with the most recent developments, official press releases, and upcoming events from Comoros’ agricultural, livestock, and fisheries sectors.
        </p>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center space-x-2">
                  {categoryIcons[news.category]}
                  <span className="font-semibold text-gray-700">{news.category}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {news.date}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {news.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
              <button className="inline-flex items-center text-green-700 font-medium hover:underline">
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-20 text-center bg-green-700 text-white py-12 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Subscribe for Regular Updates</h2>
        <p className="text-green-100 mb-6">
          Get news, events, and announcements from Comoros’ agricultural and fisheries sectors delivered directly to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-full outline-none text-gray-800"
          />
          <button
            type="submit"
            className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-100 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default News;

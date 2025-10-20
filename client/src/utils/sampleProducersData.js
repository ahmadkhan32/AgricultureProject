// Sample producer data for UCAEP website
export const sampleProducersData = [
  {
    business_name: "Comoros Organic Farm",
    business_type: "agriculture",
    description: "A family-owned organic farm specializing in vanilla, cloves, and ylang-ylang cultivation. We practice sustainable farming methods and are committed to producing high-quality organic products.",
    region: "Grande Comore",
    location: "Mitsamiouli, Grande Comore",
    latitude: -11.6455,
    longitude: 43.3333,
    products: ["Vanilla", "Cloves", "Ylang-ylang", "Coconut", "Bananas"],
    certifications: ["Organic Certified", "Fair Trade"],
    contact_person: "Ahmed Said",
    phone: "+269 123 456 789",
    email: "ahmed@comorosorganic.com",
    website: "www.comorosorganic.com",
    social_media: {
      facebook: "comorosorganic",
      instagram: "comorosorganic"
    },
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    business_name: "Anjouan Fisheries Cooperative",
    business_type: "fisheries",
    description: "A cooperative of local fishermen dedicated to sustainable fishing practices. We provide fresh fish and seafood to local markets and restaurants.",
    region: "Anjouan",
    location: "Mutsamudu, Anjouan",
    latitude: -12.2138,
    longitude: 44.4378,
    products: ["Fresh Fish", "Lobster", "Crab", "Octopus", "Seaweed"],
    certifications: ["Sustainable Fishing"],
    contact_person: "Fatima Mohamed",
    phone: "+269 987 654 321",
    email: "fatima@anjouanfisheries.com",
    website: "www.anjouanfisheries.com",
    social_media: {
      facebook: "anjouanfisheries"
    },
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Mohéli Livestock Farm",
    business_type: "livestock",
    description: "Traditional livestock farming with modern techniques. We raise cattle, goats, and chickens using sustainable and ethical practices.",
    region: "Mohéli",
    location: "Fomboni, Mohéli",
    latitude: -12.3372,
    longitude: 43.7339,
    products: ["Beef", "Goat Meat", "Chicken", "Milk", "Eggs"],
    certifications: ["Animal Welfare Certified"],
    contact_person: "Omar Ali",
    phone: "+269 555 123 456",
    email: "omar@mohelilivestock.com",
    social_media: {
      instagram: "mohelilivestock"
    },
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Grande Comore Mixed Farm",
    business_type: "mixed",
    description: "A diversified farm combining agriculture and livestock. We grow vegetables, fruits, and raise poultry and goats for a complete farm-to-table experience.",
    region: "Grande Comore",
    location: "Moroni, Grande Comore",
    latitude: -11.6455,
    longitude: 43.3333,
    products: ["Vegetables", "Fruits", "Chicken", "Goat Milk", "Honey"],
    certifications: ["Local Organic"],
    contact_person: "Aisha Hassan",
    phone: "+269 777 888 999",
    email: "aisha@grandcomoremixed.com",
    social_media: {
      facebook: "grandcomoremixed",
      instagram: "grandcomoremixed"
    },
    images: [
      "https://images.unsplash.com/photo-1574263867126-3b1c4b0b0b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Anjouan Spice Garden",
    business_type: "agriculture",
    description: "Specialized in growing and processing traditional Comorian spices including vanilla, cloves, cinnamon, and nutmeg. We export our products worldwide.",
    region: "Anjouan",
    location: "Domoni, Anjouan",
    latitude: -12.2138,
    longitude: 44.4378,
    products: ["Vanilla", "Cloves", "Cinnamon", "Nutmeg", "Pepper"],
    certifications: ["Export Certified", "Organic"],
    contact_person: "Mohamed Ibrahim",
    phone: "+269 333 444 555",
    email: "mohamed@anjouanspices.com",
    website: "www.anjouanspices.com",
    social_media: {
      facebook: "anjouanspices",
      linkedin: "anjouanspices"
    },
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Mohéli Coconut Plantation",
    business_type: "agriculture",
    description: "Large-scale coconut plantation producing coconut oil, copra, and coconut-based products. We employ sustainable farming practices and support local communities.",
    region: "Mohéli",
    location: "Nioumachoua, Mohéli",
    latitude: -12.3372,
    longitude: 43.7339,
    products: ["Coconut Oil", "Copra", "Coconut Water", "Coconut Milk", "Coconut Flour"],
    certifications: ["Sustainable Agriculture", "Fair Trade"],
    contact_person: "Salma Ahmed",
    phone: "+269 666 777 888",
    email: "salma@mohelicoconut.com",
    website: "www.mohelicoconut.com",
    social_media: {
      facebook: "mohelicoconut",
      instagram: "mohelicoconut"
    },
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Grande Comore Poultry Farm",
    business_type: "livestock",
    description: "Modern poultry farm producing fresh eggs and chicken meat. We use free-range methods and provide high-quality products to local markets.",
    region: "Grande Comore",
    location: "Itsandra, Grande Comore",
    latitude: -11.6455,
    longitude: 43.3333,
    products: ["Fresh Eggs", "Chicken Meat", "Fertilizer", "Chicken Feed"],
    certifications: ["Free Range Certified"],
    contact_person: "Hassan Ali",
    phone: "+269 111 222 333",
    email: "hassan@grandcomorepoultry.com",
    social_media: {
      facebook: "grandcomorepoultry"
    },
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    business_name: "Anjouan Goat Farm",
    business_type: "livestock",
    description: "Traditional goat farming with focus on meat and milk production. We raise local breeds and maintain traditional farming practices.",
    region: "Anjouan",
    location: "Sima, Anjouan",
    latitude: -12.2138,
    longitude: 44.4378,
    products: ["Goat Meat", "Goat Milk", "Cheese", "Leather", "Fertilizer"],
    certifications: ["Traditional Farming"],
    contact_person: "Fatouma Said",
    phone: "+269 444 555 666",
    email: "fatouma@anjouangoat.com",
    social_media: {
      instagram: "anjouangoat"
    },
    images: [
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    status: "approved",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default sampleProducersData;

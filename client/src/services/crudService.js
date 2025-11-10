import { supabase } from '../config/supabase';
import api, { 
  createProducer, 
  updateProducer, 
  fetchProducers, 
  fetchProducerById, 
  createNews, 
  updateNews, 
  deleteNews, 
  fetchAdminNews,
  fetchNews,
  fetchNewsById,
  createService,
  updateService,
  deleteService,
  fetchServices,
  fetchServiceById,
  fetchAdminServices
} from './api';

// Generic CRUD operations using Supabase (for backward compatibility)
class CRUDService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Create
  async create(data) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  // Read all with optional filters
  async fetchAll(filters = {}, options = {}) {
    try {
      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending !== false });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return [];
    }
  }

  // Read by ID
  async fetchById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      throw error;
    }
  }

  // Update
  async update(id, data) {
    try {
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  // Delete
  async remove(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }

  // Search
  async search(searchTerm, searchColumns = []) {
    try {
      let query = supabase.from(this.tableName).select('*');

      if (searchColumns.length > 0) {
        const searchConditions = searchColumns.map(column => 
          `${column}.ilike.%${searchTerm}%`
        ).join(',');
        query = query.or(searchConditions);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      return [];
    }
  }
}

// Producers service using MySQL API
class ProducersAPIService {
  constructor() {
    this.tableName = 'producers';
  }

  // Create producer
  async create(data) {
    try {
      const response = await createProducer(data);
      return response.producer || response; // Handle different response formats
    } catch (error) {
      console.error('Error creating producer:', error);
      throw error;
    }
  }

  // Read all producers
  async fetchAll(filters = {}, options = {}) {
    try {
      const params = { ...filters, ...options };
      const response = await fetchProducers(params);
      return response.producers || [];
    } catch (error) {
      console.error('Error fetching producers:', error);
      return [];
    }
  }

  // Read producer by ID
  async fetchById(id) {
    try {
      const response = await fetchProducerById(id);
      return response.producer || response;
    } catch (error) {
      console.error('Error fetching producer by ID:', error);
      throw error;
    }
  }

  // Update producer
  async update(id, data) {
    try {
      const response = await updateProducer(id, data);
      return response.producer || response;
    } catch (error) {
      console.error('Error updating producer:', error);
      throw error;
    }
  }

  // Delete producer
  async remove(id) {
    try {
      await api.delete(`/producers/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting producer:', error);
      throw error;
    }
  }

  // Search producers
  async search(searchTerm, searchColumns = ['business_name', 'description']) {
    try {
      const response = await fetchProducers({ search: searchTerm });
      return response.producers || [];
    } catch (error) {
      console.error('Error searching producers:', error);
      return [];
    }
  }
}

// Create service instances (for backward compatibility, some still use Supabase)
const partnershipsService = new CRUDService('partnerships');
const resourcesService = new CRUDService('resources');
const eventsService = new CRUDService('events');
const contactMessagesService = new CRUDService('contact_messages');
const profilesService = new CRUDService('profiles');

// News service using MySQL API
class NewsAPIService {
  constructor() {
    this.tableName = 'news';
  }

  // Create news
  async create(data) {
    try {
      const response = await createNews(data);
      return { data: response.news || response, error: null };
    } catch (error) {
      console.error('Error creating news:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to create news article' };
    }
  }

  // Read all news
  async getAll(filters = {}) {
    try {
      const response = await fetchAdminNews(filters);
      return { data: response.news || [], error: null };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { data: [], error: error.response?.data?.message || error.message || 'Failed to fetch news' };
    }
  }

  // Read news by ID
  async getById(id) {
    try {
      const response = await fetchNewsById(id);
      return { data: response.news || response, error: null };
    } catch (error) {
      console.error('Error fetching news by ID:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to fetch news article' };
    }
  }

  // Update news
  async update(id, data) {
    try {
      const response = await updateNews(id, data);
      return { data: response.news || response, error: null };
    } catch (error) {
      console.error('Error updating news:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to update news article' };
    }
  }

  // Delete news
  async delete(id) {
    try {
      await deleteNews(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting news:', error);
      return { error: error.response?.data?.message || error.message || 'Failed to delete news article' };
    }
  }

  // Publish news
  async publishNews(id) {
    try {
      const response = await updateNews(id, { status: 'published', published_at: new Date().toISOString() });
      return { data: response.news || response, error: null };
    } catch (error) {
      console.error('Error publishing news:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to publish news article' };
    }
  }

  // Archive news
  async archiveNews(id) {
    try {
      const response = await updateNews(id, { status: 'archived' });
      return { data: response.news || response, error: null };
    } catch (error) {
      console.error('Error archiving news:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to archive news article' };
    }
  }

  // Get published news
  async getPublishedNews(limit = 10) {
    try {
      const response = await fetchNews({ limit, status: 'published' });
      return { data: response.news || [], error: null };
    } catch (error) {
      console.error('Error fetching published news:', error);
      return { data: [], error: null }; // Return empty array on error for published news
    }
  }

  // Alias methods for backward compatibility with fetchAll pattern
  async fetchAll(filters = {}, options = {}) {
    const result = await this.getAll({ ...filters, ...options });
    return result.data || [];
  }

  async fetchById(id) {
    const result = await this.getById(id);
    return result.data || result;
  }
}

// Services service using MySQL API
class ServicesAPIService {
  constructor() {
    this.tableName = 'services';
  }

  // Create service
  async create(data) {
    try {
      const response = await createService(data);
      return { data: response.service || response, error: null };
    } catch (error) {
      console.error('Error creating service:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to create service' };
    }
  }

  // Read all services
  async getAll(filters = {}) {
    try {
      const response = await fetchAdminServices(filters);
      return { data: response.services || [], error: null };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { data: [], error: error.response?.data?.message || error.message || 'Failed to fetch services' };
    }
  }

  // Read services for public (active only)
  async getPublicServices(filters = {}) {
    try {
      const response = await fetchServices(filters);
      return { data: response.services || [], error: null };
    } catch (error) {
      console.error('Error fetching public services:', error);
      return { data: [], error: null }; // Return empty array on error for public services
    }
  }

  // Read service by ID
  async getById(id) {
    try {
      const response = await fetchServiceById(id);
      return { data: response.service || response, error: null };
    } catch (error) {
      console.error('Error fetching service by ID:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to fetch service' };
    }
  }

  // Update service
  async update(id, data) {
    try {
      const response = await updateService(id, data);
      return { data: response.service || response, error: null };
    } catch (error) {
      console.error('Error updating service:', error);
      return { data: null, error: error.response?.data?.message || error.message || 'Failed to update service' };
    }
  }

  // Delete service
  async remove(id) {
    try {
      await deleteService(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { error: error.response?.data?.message || error.message || 'Failed to delete service' };
    }
  }

  // Search services
  async search(searchTerm, searchColumns = ['title', 'description']) {
    try {
      const response = await fetchAdminServices({ search: searchTerm });
      return { data: response.services || [], error: null };
    } catch (error) {
      console.error('Error searching services:', error);
      return { data: [], error: null };
    }
  }

  // Alias methods for backward compatibility with fetchAll pattern
  async fetchAll(filters = {}, options = {}) {
    const result = await this.getAll({ ...filters, ...options });
    return result.data || [];
  }

  async fetchById(id) {
    const result = await this.getById(id);
    return result.data || result;
  }
}

// Always use ProducersAPIService for MySQL backend integration
const producersService = new ProducersAPIService();

// Always use NewsAPIService for MySQL backend integration
const newsAPIService = new NewsAPIService();

// Always use ServicesAPIService for MySQL backend integration
const servicesAPIService = new ServicesAPIService();

// Export the main crudService object
// Use API-based service for producers, news, and services (MySQL backend), Supabase for other services
const crudService = {
  news: newsAPIService, // This always uses MySQL API
  services: servicesAPIService, // This always uses MySQL API
  producers: producersService, // This always uses MySQL API
  partnerships: partnershipsService,
  resources: resourcesService,
  events: eventsService,
  contactMessages: contactMessagesService,
  profiles: profilesService,
};

// Export enhanced services for backward compatibility
export const enhancedNewsService = newsAPIService;
export const enhancedProducersService = producersService;
export const enhancedServicesService = servicesAPIService;

export default crudService;
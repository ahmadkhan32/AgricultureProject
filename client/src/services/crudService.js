import { supabase, isDevMode } from '../config/supabase';
import mockCrudService from './mockCrudService';

// Generic CRUD operations
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

// Create service instances
const newsService = new CRUDService('news');
const servicesService = new CRUDService('services');
const producersService = new CRUDService('producers');
const partnershipsService = new CRUDService('partnerships');
const resourcesService = new CRUDService('resources');
const eventsService = new CRUDService('events');
const contactMessagesService = new CRUDService('contact_messages');
const profilesService = new CRUDService('profiles');

// Export the main crudService object
// Use mock service in development mode, real service in production
const crudService = isDevMode ? mockCrudService : {
  news: newsService,
  services: servicesService,
  producers: producersService,
  partnerships: partnershipsService,
  resources: resourcesService,
  events: eventsService,
  contactMessages: contactMessagesService,
  profiles: profilesService,
};

export default crudService;
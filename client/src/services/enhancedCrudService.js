import { supabase, isDevMode } from '../config/supabase';
import mockCrudService from './mockCrudService';

// Enhanced CRUD operations with image upload support
class EnhancedCRUDService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Upload image to Supabase storage
  async uploadImage(file, folder = 'images') {
    try {
      if (isDevMode) {
        // In dev mode, return a mock URL
        return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from('agricul-images')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('agricul-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Create with image upload
  async create(data, imageFile = null) {
    try {
      let imageUrl = data.image || null;
      
      // Upload image if provided
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const dataToInsert = {
        ...data,
        image: imageUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isDevMode) {
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.create(dataToInsert);
        }
        console.warn(`No mock service found for table: ${this.tableName}`);
        throw new Error(`Cannot create in mock service for ${this.tableName}`);
      }

      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(dataToInsert)
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
      if (isDevMode) {
        // Use the appropriate table-specific service
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.fetchAll(filters, options);
        }
        console.warn(`No mock service found for table: ${this.tableName}`);
        return [];
      }

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
      throw error;
    }
  }

  // Read by ID
  async fetchById(id) {
    try {
      if (isDevMode) {
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.fetchById(id);
        }
        throw new Error(`Cannot fetch from mock service for ${this.tableName}`);
      }

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

  // Update with image upload
  async update(id, data, imageFile = null) {
    try {
      let updateData = { ...data };

      // Upload new image if provided
      if (imageFile) {
        updateData.image = await this.uploadImage(imageFile);
      }

      updateData.updated_at = new Date().toISOString();

      if (isDevMode) {
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.update(id, updateData);
        }
        throw new Error(`Cannot update in mock service for ${this.tableName}`);
      }

      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(updateData)
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
  async delete(id) {
    try {
      if (isDevMode) {
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.remove(id);
        }
        throw new Error(`Cannot delete from mock service for ${this.tableName}`);
      }

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

  // Search with text search
  async search(searchTerm, fields = ['title', 'description', 'name']) {
    try {
      if (isDevMode) {
        const tableService = mockCrudService[this.tableName];
        if (tableService) {
          return tableService.search(searchTerm, fields);
        }
        return [];
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .or(fields.map(field => `${field}.ilike.%${searchTerm}%`).join(','));

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Create specific service instances
const servicesService = new EnhancedCRUDService('services');
const producersService = new EnhancedCRUDService('producers');

// Enhanced content service that integrates with CRUD
class EnhancedContentService {
  constructor() {
    this.storageKey = 'agricul_generated_content';
    this.servicesKey = 'agricul_services';
    this.producersKey = 'agricul_producers';
  }

  // Get all services (both from database and local storage)
  async getAllServices() {
    try {
      const [dbServices, localServices] = await Promise.all([
        servicesService.fetchAll(),
        this.getLocalServices()
      ]);
      
      // Normalize database services to match page format
      const normalizedDbServices = dbServices.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description || service.content,
        category: service.category || 'Programmes de formation',
        content: service.content,
        tags: service.tags ? (typeof service.tags === 'string' ? JSON.parse(service.tags) : service.tags) : [],
        image: service.image,
        createdAt: service.created_at || service.createdAt,
        isGenerated: service.is_ai_generated || true
      }));
      
      return [...normalizedDbServices, ...localServices];
    } catch (error) {
      console.error('Error getting all services:', error);
      return this.getLocalServices();
    }
  }

  // Get all producers (both from database and local storage)
  async getAllProducers() {
    try {
      const [dbProducers, localProducers] = await Promise.all([
        producersService.fetchAll(),
        this.getLocalProducers()
      ]);
      
      // Normalize database producers to match page format
      const normalizedDbProducers = dbProducers.map(producer => ({
        id: producer.id,
        name: producer.name || producer.business_name,
        business_name: producer.business_name,
        business_type: producer.business_type,
        description: producer.description,
        region: producer.region,
        location: producer.region,
        products: producer.products ? (typeof producer.products === 'string' ? JSON.parse(producer.products) : producer.products) : [],
        contact_email: producer.contact_email,
        contact_phone: producer.contact_phone,
        website: producer.website,
        category: producer.business_type || 'Agriculture',
        image: producer.image,
        createdAt: producer.created_at || producer.createdAt,
        isGenerated: producer.is_ai_generated || true
      }));
      
      return [...normalizedDbProducers, ...localProducers];
    } catch (error) {
      console.error('Error getting all producers:', error);
      return this.getLocalProducers();
    }
  }

  // Save service to database
  async saveServiceToDatabase(serviceData, imageFile = null) {
    try {
      const service = {
        title: serviceData.title || serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        content: serviceData.blogContent || serviceData.content,
        tags: serviceData.tags ? JSON.stringify(serviceData.tags) : null,
        status: 'published',
        is_ai_generated: true,
        created_by: 'ai_system'
      };

      return await servicesService.create(service, imageFile);
    } catch (error) {
      console.error('Error saving service to database:', error);
      throw error;
    }
  }

  // Save producer to database
  async saveProducerToDatabase(producerData, imageFile = null) {
    try {
      const producer = {
        name: producerData.name || producerData.title,
        business_name: producerData.business_name || producerData.name,
        business_type: producerData.business_type || producerData.category,
        description: producerData.description,
        region: producerData.region || producerData.location,
        products: producerData.products ? JSON.stringify(producerData.products) : null,
        contact_email: producerData.contact_email,
        contact_phone: producerData.contact_phone,
        website: producerData.website,
        status: 'approved',
        is_ai_generated: true,
        created_by: 'ai_system'
      };

      return await producersService.create(producer, imageFile);
    } catch (error) {
      console.error('Error saving producer to database:', error);
      throw error;
    }
  }

  // Local storage methods (fallback)
  getLocalServices() {
    try {
      const services = localStorage.getItem(this.servicesKey);
      return services ? JSON.parse(services) : [];
    } catch (error) {
      console.error('Error loading local services:', error);
      return [];
    }
  }

  getLocalProducers() {
    try {
      const producers = localStorage.getItem(this.producersKey);
      return producers ? JSON.parse(producers) : [];
    } catch (error) {
      console.error('Error loading local producers:', error);
      return [];
    }
  }

  // Save to local storage (fallback)
  saveService(service) {
    try {
      const services = this.getLocalServices();
      const newService = {
        id: Date.now(),
        ...service,
        createdAt: new Date().toISOString(),
        type: 'service',
        isLocal: true
      };
      services.push(newService);
      localStorage.setItem(this.servicesKey, JSON.stringify(services));
      return newService;
    } catch (error) {
      console.error('Error saving service locally:', error);
      return null;
    }
  }

  saveProducer(producer) {
    try {
      const producers = this.getLocalProducers();
      const newProducer = {
        id: Date.now(),
        ...producer,
        createdAt: new Date().toISOString(),
        type: 'producer',
        isLocal: true
      };
      producers.push(newProducer);
      localStorage.setItem(this.producersKey, JSON.stringify(producers));
      return newProducer;
    } catch (error) {
      console.error('Error saving producer locally:', error);
      return null;
    }
  }

  // Delete from database or local storage
  async delete(id, type = null) {
    try {
      // Try to delete from database first
      if (!id.toString().includes('local')) {
        try {
          if (type === 'service') {
            return await servicesService.delete(id);
          } else if (type === 'producer') {
            return await producersService.delete(id);
          }
        } catch (dbError) {
          console.warn('Database delete failed, falling back to local storage:', dbError);
        }
      }
      
      // Fallback to local storage
      return this.deleteContent(id, type || (id.toString().includes('local') ? 'service' : 'service'));
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }

  // Delete from local storage
  deleteContent(id, type) {
    try {
      if (type === 'service') {
        const services = this.getLocalServices();
        const filtered = services.filter(s => s.id !== id);
        localStorage.setItem(this.servicesKey, JSON.stringify(filtered));
      } else if (type === 'producer') {
        const producers = this.getLocalProducers();
        const filtered = producers.filter(p => p.id !== id);
        localStorage.setItem(this.producersKey, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  }
}

const enhancedContentService = new EnhancedContentService();

export {
  EnhancedCRUDService,
  servicesService,
  producersService,
  enhancedContentService
};

export default enhancedContentService;

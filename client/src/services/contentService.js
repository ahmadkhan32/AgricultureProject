// Content Management Service for AI-generated content
class ContentService {
  constructor() {
    this.storageKey = 'agricul_generated_content';
    this.servicesKey = 'agricul_services';
    this.producersKey = 'agricul_producers';
  }

  // Get all generated services
  getServices() {
    try {
      const services = localStorage.getItem(this.servicesKey);
      return services ? JSON.parse(services) : [];
    } catch (error) {
      console.error('Error loading services:', error);
      return [];
    }
  }

  // Get all generated producers
  getProducers() {
    try {
      const producers = localStorage.getItem(this.producersKey);
      return producers ? JSON.parse(producers) : [];
    } catch (error) {
      console.error('Error loading producers:', error);
      return [];
    }
  }

  // Save generated service
  saveService(service) {
    try {
      const services = this.getServices();
      const newService = {
        id: Date.now(),
        ...service,
        createdAt: new Date().toISOString(),
        type: 'service'
      };
      services.push(newService);
      localStorage.setItem(this.servicesKey, JSON.stringify(services));
      return newService;
    } catch (error) {
      console.error('Error saving service:', error);
      return null;
    }
  }

  // Save generated producer
  saveProducer(producer) {
    try {
      const producers = this.getProducers();
      const newProducer = {
        id: Date.now(),
        ...producer,
        createdAt: new Date().toISOString(),
        type: 'producer'
      };
      producers.push(newProducer);
      localStorage.setItem(this.producersKey, JSON.stringify(producers));
      return newProducer;
    } catch (error) {
      console.error('Error saving producer:', error);
      return null;
    }
  }

  // Delete content
  deleteContent(id, type) {
    try {
      if (type === 'service') {
        const services = this.getServices();
        const filtered = services.filter(s => s.id !== id);
        localStorage.setItem(this.servicesKey, JSON.stringify(filtered));
      } else if (type === 'producer') {
        const producers = this.getProducers();
        const filtered = producers.filter(p => p.id !== id);
        localStorage.setItem(this.producersKey, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  }

  // Clear all content
  clearAllContent() {
    try {
      localStorage.removeItem(this.servicesKey);
      localStorage.removeItem(this.producersKey);
    } catch (error) {
      console.error('Error clearing content:', error);
    }
  }
}

export default new ContentService();

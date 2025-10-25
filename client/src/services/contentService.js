// Content Management Service for AI-generated content
class ContentService {
  constructor() {
    this.content = this.loadContent();
  }

  // Load content from localStorage
  loadContent() {
    try {
      const saved = localStorage.getItem('agriculture_content');
      return saved ? JSON.parse(saved) : {
        services: [],
        producers: [],
        blogs: []
      };
    } catch (error) {
      console.error('Error loading content:', error);
      return { services: [], producers: [], blogs: [] };
    }
  }

  // Save content to localStorage
  saveContent() {
    try {
      localStorage.setItem('agriculture_content', JSON.stringify(this.content));
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  }

  // Add new service content
  addServiceContent(content) {
    const newService = {
      id: Date.now(),
      type: 'service',
      ...content,
      createdAt: new Date().toISOString(),
      published: false
    };
    
    this.content.services.push(newService);
    this.saveContent();
    return newService;
  }

  // Add new producer content
  addProducerContent(content) {
    const newProducer = {
      id: Date.now(),
      type: 'producer',
      ...content,
      createdAt: new Date().toISOString(),
      published: false
    };
    
    this.content.producers.push(newProducer);
    this.saveContent();
    return newProducer;
  }

  // Get all services
  getServices() {
    return this.content.services.filter(item => item.published);
  }

  // Get all producers
  getProducers() {
    return this.content.producers.filter(item => item.published);
  }

  // Get content by ID
  getContentById(id) {
    const allContent = [...this.content.services, ...this.content.producers, ...this.content.blogs];
    return allContent.find(item => item.id === id);
  }

  // Update content
  updateContent(id, updates) {
    const allContent = [...this.content.services, ...this.content.producers, ...this.content.blogs];
    const index = allContent.findIndex(item => item.id === id);
    
    if (index !== -1) {
      allContent[index] = { ...allContent[index], ...updates };
      
      // Update in the appropriate array
      if (allContent[index].type === 'service') {
        const serviceIndex = this.content.services.findIndex(s => s.id === id);
        if (serviceIndex !== -1) {
          this.content.services[serviceIndex] = allContent[index];
        }
      } else if (allContent[index].type === 'producer') {
        const producerIndex = this.content.producers.findIndex(p => p.id === id);
        if (producerIndex !== -1) {
          this.content.producers[producerIndex] = allContent[index];
        }
      }
      
      this.saveContent();
      return allContent[index];
    }
    return null;
  }

  // Delete content
  deleteContent(id) {
    this.content.services = this.content.services.filter(item => item.id !== id);
    this.content.producers = this.content.producers.filter(item => item.id !== id);
    this.content.blogs = this.content.blogs.filter(item => item.id !== id);
    this.saveContent();
    return true;
  }

  // Publish content
  publishContent(id) {
    return this.updateContent(id, { published: true });
  }

  // Unpublish content
  unpublishContent(id) {
    return this.updateContent(id, { published: false });
  }

  // Get content statistics
  getStats() {
    return {
      totalServices: this.content.services.length,
      publishedServices: this.content.services.filter(s => s.published).length,
      totalProducers: this.content.producers.length,
      publishedProducers: this.content.producers.filter(p => p.published).length,
      totalBlogs: this.content.blogs.length,
      publishedBlogs: this.content.blogs.filter(b => b.published).length
    };
  }

  // Search content
  searchContent(query) {
    const allContent = [...this.content.services, ...this.content.producers, ...this.content.blogs];
    const lowercaseQuery = query.toLowerCase();
    
    return allContent.filter(item => 
      item.title?.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery) ||
      item.blogContent?.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Create singleton instance
const contentService = new ContentService();

export default contentService;

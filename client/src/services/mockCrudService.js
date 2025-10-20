// Mock CRUD Service for development mode
// This provides local storage-based CRUD operations without HTTP requests

// Mock data storage
const mockData = {
  news: [],
  producers: [],
  services: [],
  partnerships: [],
  resources: [],
  events: [],
  contact_messages: [],
  profiles: [],
};

// Initialize mock data from localStorage if available
const initializeMockData = () => {
  try {
    const stored = localStorage.getItem('mockCrudData');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.assign(mockData, parsed);
    }
  } catch (error) {
    console.warn('Failed to load mock data from localStorage:', error);
  }
};

// Save mock data to localStorage
const saveMockData = () => {
  try {
    localStorage.setItem('mockCrudData', JSON.stringify(mockData));
  } catch (error) {
    console.warn('Failed to save mock data to localStorage:', error);
  }
};

// Initialize on import
initializeMockData();

// Generic CRUD operations
class MockCRUDService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Create
  async create(data) {
    try {
      const newItem = {
        id: `${this.tableName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockData[this.tableName].push(newItem);
      saveMockData();
      
      console.log(`Mock: Created ${this.tableName}`, newItem);
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      throw error;
    }
  }

  // Read all with optional filters
  async fetchAll(filters = {}, options = {}) {
    try {
      let items = [...mockData[this.tableName]];

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          items = items.filter(item => item[key] === value);
        }
      });

      // Apply ordering
      if (options.orderBy) {
        items.sort((a, b) => {
          const aVal = a[options.orderBy];
          const bVal = b[options.orderBy];
          if (options.ascending === false) {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        });
      }

      // Apply pagination
      if (options.limit) {
        const offset = options.offset || 0;
        items = items.slice(offset, offset + options.limit);
      }

      console.log(`Mock: Fetched ${items.length} ${this.tableName} items`);
      return items;
    } catch (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      throw error;
    }
  }

  // Read by ID
  async fetchById(id) {
    try {
      const item = mockData[this.tableName].find(item => item.id === id);
      if (!item) {
        throw new Error(`${this.tableName} with id ${id} not found`);
      }
      
      console.log(`Mock: Fetched ${this.tableName} by id`, item);
      return item;
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by id:`, error);
      throw error;
    }
  }

  // Update
  async update(id, data) {
    try {
      const index = mockData[this.tableName].findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${this.tableName} with id ${id} not found`);
      }

      const updatedItem = {
        ...mockData[this.tableName][index],
        ...data,
        updated_at: new Date().toISOString(),
      };

      mockData[this.tableName][index] = updatedItem;
      saveMockData();

      console.log(`Mock: Updated ${this.tableName}`, updatedItem);
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      throw error;
    }
  }

  // Delete
  async remove(id) {
    try {
      const index = mockData[this.tableName].findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${this.tableName} with id ${id} not found`);
      }

      const deletedItem = mockData[this.tableName][index];
      mockData[this.tableName].splice(index, 1);
      saveMockData();

      console.log(`Mock: Deleted ${this.tableName}`, deletedItem);
      return deletedItem;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      throw error;
    }
  }

  // Search
  async search(searchTerm, searchColumns = []) {
    try {
      if (!searchTerm) return this.fetchAll();

      const items = mockData[this.tableName].filter(item => {
        return searchColumns.some(column => {
          const value = item[column];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });

      console.log(`Mock: Searched ${this.tableName} for "${searchTerm}", found ${items.length} items`);
      return items;
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Create service instances
const mockCrudService = {
  news: new MockCRUDService('news'),
  producers: new MockCRUDService('producers'),
  services: new MockCRUDService('services'),
  partnerships: new MockCRUDService('partnerships'),
  resources: new MockCRUDService('resources'),
  events: new MockCRUDService('events'),
  contactMessages: new MockCRUDService('contact_messages'),
  profiles: new MockCRUDService('profiles'),
};

// Helper function to populate mock data
export const populateMockData = (tableName, data) => {
  if (mockData[tableName]) {
    mockData[tableName] = [...data];
    saveMockData();
    console.log(`Mock: Populated ${tableName} with ${data.length} items`);
  }
};

// Helper function to clear mock data
export const clearMockData = (tableName) => {
  if (tableName) {
    mockData[tableName] = [];
  } else {
    Object.keys(mockData).forEach(key => {
      mockData[key] = [];
    });
  }
  saveMockData();
  console.log(`Mock: Cleared ${tableName || 'all'} data`);
};

export default mockCrudService;

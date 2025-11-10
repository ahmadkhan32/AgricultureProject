/**
 * Resource Service - API Client for Resources CRUD Operations
 * 
 * This service handles all API calls to the backend for resources.
 * Location: client/src/services/resourceService.js
 */

// In production, REACT_APP_API_URL should be set in Vercel environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Make authenticated API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/resources${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const resourceService = {
  /**
   * Get all resources with optional filters
   * @param {Object} params - Query parameters (page, limit, category, search)
   * @returns {Promise<Object>} Resources data with pagination
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `?${queryString}` : '';

    return apiRequest(endpoint);
  },

  /**
   * Get a single resource by ID
   * @param {Number} id - Resource ID
   * @returns {Promise<Object>} Resource data
   */
  getById: async (id) => {
    return apiRequest(`/${id}`);
  },

  /**
   * Create a new resource
   * @param {Object} data - Resource data (title, description, fileUrl, fileType, fileSize, category, tags)
   * @returns {Promise<Object>} Created resource
   */
  create: async (data) => {
    return apiRequest('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing resource
   * @param {Number} id - Resource ID
   * @param {Object} data - Updated resource data
   * @returns {Promise<Object>} Updated resource
   */
  update: async (id, data) => {
    return apiRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a resource
   * @param {Number} id - Resource ID
   * @returns {Promise<Object>} Success message
   */
  delete: async (id) => {
    return apiRequest(`/${id}`, {
      method: 'DELETE',
    });
  },
};

export default resourceService;


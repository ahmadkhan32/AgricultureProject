// API service for UCAEP website
import axios from 'axios';

// In production, REACT_APP_API_URL should be set in Vercel environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Cannot connect to backend. Make sure server is running on port 5000');
      }
      error.message = 'Cannot connect to server. Please check if backend is running.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

// News API
export const fetchNews = async (params = {}) => {
  const response = await api.get('/news', { params });
  return response.data;
};

export const fetchNewsById = async (id) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const createNews = async (data) => {
  const response = await api.post('/news', data);
  return response.data;
};

export const updateNews = async (id, data) => {
  const response = await api.put(`/news/${id}`, data);
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};

export const fetchAdminNews = async (params = {}) => {
  const response = await api.get('/news/admin/all', { params });
  return response.data;
};

// Producers API
export const fetchProducers = async (params = {}) => {
  const response = await api.get('/producers', { params });
  return response.data;
};

export const fetchProducerById = async (id) => {
  const response = await api.get(`/producers/${id}`);
  return response.data;
};

export const fetchUserProducerProfile = async () => {
  const response = await api.get('/producers/profile');
  return response.data;
};

export const createProducer = async (data) => {
  const response = await api.post('/producers', data);
  return response.data;
};

export const updateProducer = async (id, data) => {
  const response = await api.put(`/producers/${id}`, data);
  return response.data;
};

export const fetchProducerRegions = async () => {
  const response = await api.get('/producers/regions');
  return response.data;
};

// Services API
export const fetchServices = async (params = {}) => {
  const response = await api.get('/services', { params });
  return response.data;
};

export const fetchServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post('/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

export const fetchAdminServices = async (params = {}) => {
  const response = await api.get('/services/admin/all', { params });
  return response.data;
};

// Partnerships API
export const fetchPartnerships = async (params = {}) => {
  const response = await api.get('/partnerships', { params });
  return response.data;
};

export const fetchPartnershipById = async (id) => {
  const response = await api.get(`/partnerships/${id}`);
  return response.data;
};

// Resources API
export const fetchResources = async (params = {}) => {
  const response = await api.get('/resources', { params });
  return response.data;
};

export const fetchResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post('/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

export const fetchAdminResources = async (params = {}) => {
  const response = await api.get('/resources/admin/all', { params });
  return response.data;
};

// Events API
export const fetchEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Contact Messages API
export const fetchContactMessages = async (params = {}) => {
  const response = await api.get('/contact-messages', { params });
  return response.data;
};

export const fetchContactMessageById = async (id) => {
  const response = await api.get(`/contact-messages/${id}`);
  return response.data;
};

// Dashboard Stats API
export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

// User Profiles API
export const fetchProfiles = async (params = {}) => {
  const response = await api.get('/profiles', { params });
  return response.data;
};

export const fetchProfileById = async (id) => {
  const response = await api.get(`/profiles/${id}`);
  return response.data;
};

// Contact form submission
export const submitContactForm = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};

// File upload
export const uploadFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  // Add type as query parameter for better compatibility
  const uploadUrl = `/upload?type=${type || 'file'}`;
  
  const response = await api.post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
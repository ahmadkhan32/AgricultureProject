// API service for UCAEP website
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// News API
export const fetchNews = async (params = {}) => {
  const response = await api.get('/news', { params });
  return response.data;
};

export const fetchNewsById = async (id) => {
  const response = await api.get(`/news/${id}`);
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
  formData.append('type', type);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
// Constants for the UCAEP website

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Supabase Configuration
export const SUPABASE_CONFIG = {
  URL: process.env.REACT_APP_SUPABASE_URL,
  ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
};

// Business Types
export const BUSINESS_TYPES = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'fisheries', label: 'Fisheries' },
  { value: 'mixed', label: 'Mixed' },
];

// Regions
export const REGIONS = [
  { value: 'Grande Comore', label: 'Grande Comore' },
  { value: 'Anjouan', label: 'Anjouan' },
  { value: 'Mohéli', label: 'Mohéli' },
  { value: 'Mayotte', label: 'Mayotte' },
];

// News Categories
export const NEWS_CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'press_release', label: 'Press Release' },
  { value: 'event', label: 'Event' },
  { value: 'announcement', label: 'Announcement' },
];

// News Status
export const NEWS_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

// Service Categories
export const SERVICE_CATEGORIES = [
  { value: 'support', label: 'Producer Support' },
  { value: 'training', label: 'Training Programs' },
  { value: 'assistance', label: 'Assistance Programs' },
  { value: 'project', label: 'Projects' },
];

// Partnership Types
export const PARTNERSHIP_TYPES = [
  { value: 'local', label: 'Local Partners' },
  { value: 'international', label: 'International Partners' },
  { value: 'government', label: 'Government' },
  { value: 'ngo', label: 'NGOs' },
  { value: 'private', label: 'Private Sector' },
];

// Resource Categories
export const RESOURCE_CATEGORIES = [
  { value: 'document', label: 'Documents' },
  { value: 'form', label: 'Forms' },
  { value: 'report', label: 'Reports' },
  { value: 'law', label: 'Laws & Regulations' },
  { value: 'statistics', label: 'Statistics' },
  { value: 'guide', label: 'Guides' },
];

// User Roles
export const USER_ROLES = [
  { value: 'producer', label: 'Producer' },
  { value: 'admin', label: 'Admin' },
];

// Producer Status
export const PRODUCER_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

// Contact Message Status
export const MESSAGE_STATUS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

// Event Status
export const EVENT_STATUS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGES_SHOWN: 5,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [-11.6455, 43.3333], // Comoros center
  DEFAULT_ZOOM: 10,
  REGION_CENTERS: {
    'Grande Comore': { lat: -11.6455, lng: 43.3333, zoom: 10 },
    'Anjouan': { lat: -12.2138, lng: 44.4378, zoom: 11 },
    'Mohéli': { lat: -12.3372, lng: 43.7339, zoom: 11 },
    'Mayotte': { lat: -12.8275, lng: 45.1662, zoom: 11 },
  },
  MARKER_COLORS: {
    agriculture: '#10B981',
    livestock: '#F59E0B',
    fisheries: '#3B82F6',
    mixed: '#8B5CF6',
  },
};

// Colors - Based on Réseau FAR design scheme
export const COLORS = {
  // Primary Navy Blue - Dominant dark blue/navy for headers and navigation
  primary: {
    50: '#e6e9f0',
    100: '#ccd3e1',
    200: '#99a7c3',
    300: '#667ba5',
    400: '#334f87',
    500: '#0A1F44', // Main navy blue
    600: '#081932',
    700: '#061328',
    800: '#040d1e',
    900: '#020714',
  },
  // Accent Orange - For buttons and call-to-action
  accent: {
    50: '#fef3e8',
    100: '#fde7d1',
    200: '#fbcfa3',
    300: '#f9b775',
    400: '#f79f47',
    500: '#F58C38', // Main orange accent
    600: '#c4702d',
    700: '#935422',
    800: '#623816',
    900: '#311c0b',
  },
  // Secondary Green - For success states and nature themes
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Background colors
  background: {
    white: '#FFFFFF',
    light: '#F5F7FA',
    gray: '#F9FAFB',
  },
  // Text colors
  text: {
    dark: '#1F2937',
    medium: '#4B5563',
    light: '#6B7280',
  },
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'ucaeep_user_preferences',
  THEME: 'ucaeep_theme',
  LANGUAGE: 'ucaeep_language',
  RECENT_SEARCHES: 'ucaeep_recent_searches',
  FAVORITES: 'ucaeep_favorites',
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/ucaeep',
  twitter: 'https://twitter.com/ucaeep',
  instagram: 'https://instagram.com/ucaeep',
  linkedin: 'https://linkedin.com/company/ucaeep',
  youtube: 'https://youtube.com/ucaeep',
};

// Contact Information
export const CONTACT_INFO = {
  address: {
    street: 'Moroni',
    city: 'Grande Comore',
    country: 'Union of the Comoros',
  },
  phone: '+269 12 34 56 78',
  email: {
    general: 'info@ucaeep.km',
    support: 'support@ucaeep.km',
    partnerships: 'partnerships@ucaeep.km',
  },
  hours: {
    weekdays: '8:00 AM - 5:00 PM',
    saturday: '9:00 AM - 1:00 PM',
    sunday: 'Closed',
  },
};

// Website Information
export const WEBSITE_INFO = {
  name: 'UCAEP',
  fullName: 'Chamber of Agriculture, Livestock, and Fisheries of the Comoros',
  description: 'Promoting sustainable agricultural development and supporting local producers across the Comoros',
  version: '1.0.0',
  author: 'UCAEP Development Team',
  copyright: '© 2024 UCAEP. All rights reserved.',
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_PWA: process.env.REACT_APP_ENABLE_PWA === 'true',
  ENABLE_DARK_MODE: process.env.REACT_APP_ENABLE_DARK_MODE === 'true',
  ENABLE_MULTI_LANGUAGE: process.env.REACT_APP_ENABLE_MULTI_LANGUAGE === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROFILE_DELETED: 'Profile deleted successfully!',
  MESSAGE_SENT: 'Message sent successfully!',
  DATA_SAVED: 'Data saved successfully!',
  OPERATION_COMPLETED: 'Operation completed successfully!',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Default Values
export const DEFAULT_VALUES = {
  USER: {
    role: 'producer',
    status: 'active',
  },
  PRODUCER: {
    business_type: 'agriculture',
    status: 'pending',
  },
  NEWS: {
    category: 'news',
    status: 'draft',
  },
  SERVICE: {
    category: 'support',
    status: 'active',
  },
  PARTNERSHIP: {
    partner_type: 'local',
    status: 'active',
  },
  RESOURCE: {
    category: 'document',
  },
  EVENT: {
    status: 'upcoming',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  NEWS: {
    LIST: '/news',
    CREATE: '/news',
    UPDATE: '/news/:id',
    DELETE: '/news/:id',
    ADMIN_LIST: '/news/admin/all',
  },
  PRODUCERS: {
    LIST: '/producers',
    CREATE: '/producers',
    UPDATE: '/producers/:id',
    DELETE: '/producers/:id',
    PROFILE: '/producers/profile/me',
    REGIONS: '/producers/map/regions',
    ADMIN_LIST: '/producers/admin/all',
    UPDATE_STATUS: '/producers/:id/status',
  },
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    UPDATE: '/services/:id',
    DELETE: '/services/:id',
    ADMIN_LIST: '/services/admin/all',
  },
  PARTNERSHIPS: {
    LIST: '/partnerships',
    CREATE: '/partnerships',
    UPDATE: '/partnerships/:id',
    DELETE: '/partnerships/:id',
    ADMIN_LIST: '/partnerships/admin/all',
  },
  RESOURCES: {
    LIST: '/resources',
    CREATE: '/resources',
    UPDATE: '/resources/:id',
    DELETE: '/resources/:id',
    ADMIN_LIST: '/resources/admin/all',
    STATS: '/resources/admin/stats',
  },
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    UPDATE_USER_ROLE: '/admin/users/:id/role',
    CONTACT_MESSAGES: '/admin/contact-messages',
    UPDATE_MESSAGE_STATUS: '/admin/contact-messages/:id/status',
    EVENTS: '/admin/events',
    CREATE_EVENT: '/admin/events',
    UPDATE_EVENT: '/admin/events/:id',
    DELETE_EVENT: '/admin/events/:id',
  },
  CONTACT: {
    SUBMIT: '/contact',
  },
};

// Chart Colors
export const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#6B7280', // gray
];

// Export all constants as a single object
export const CONSTANTS = {
  API_CONFIG,
  SUPABASE_CONFIG,
  BUSINESS_TYPES,
  REGIONS,
  NEWS_CATEGORIES,
  NEWS_STATUS,
  SERVICE_CATEGORIES,
  PARTNERSHIP_TYPES,
  RESOURCE_CATEGORIES,
  USER_ROLES,
  PRODUCER_STATUS,
  MESSAGE_STATUS,
  EVENT_STATUS,
  PAGINATION,
  FILE_UPLOAD,
  MAP_CONFIG,
  COLORS,
  BREAKPOINTS,
  ANIMATION_DURATIONS,
  STORAGE_KEYS,
  SOCIAL_LINKS,
  CONTACT_INFO,
  WEBSITE_INFO,
  FEATURE_FLAGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  DEFAULT_VALUES,
  API_ENDPOINTS,
  CHART_COLORS,
};

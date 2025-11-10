// Security utilities for role-based access control and permissions

// User roles
export const ROLES = {
  ADMIN: 'admin',
  PRODUCER: 'producer',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
};

// Permission levels
export const PERMISSIONS = {
  // News permissions
  NEWS_READ: 'news:read',
  NEWS_CREATE: 'news:create',
  NEWS_UPDATE: 'news:update',
  NEWS_DELETE: 'news:delete',
  NEWS_PUBLISH: 'news:publish',
  
  // Producer permissions
  PRODUCER_READ: 'producer:read',
  PRODUCER_CREATE: 'producer:create',
  PRODUCER_UPDATE: 'producer:update',
  PRODUCER_DELETE: 'producer:delete',
  PRODUCER_APPROVE: 'producer:approve',
  
  // Service permissions
  SERVICE_READ: 'service:read',
  SERVICE_CREATE: 'service:create',
  SERVICE_UPDATE: 'service:update',
  SERVICE_DELETE: 'service:delete',
  
  // Partnership permissions
  PARTNERSHIP_READ: 'partnership:read',
  PARTNERSHIP_CREATE: 'partnership:create',
  PARTNERSHIP_UPDATE: 'partnership:update',
  PARTNERSHIP_DELETE: 'partnership:delete',
  
  // Resource permissions
  RESOURCE_READ: 'resource:read',
  RESOURCE_CREATE: 'resource:create',
  RESOURCE_UPDATE: 'resource:update',
  RESOURCE_DELETE: 'resource:delete',
  
  // Event permissions
  EVENT_READ: 'event:read',
  EVENT_CREATE: 'event:create',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',
  
  // User management permissions
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',
  
  // Contact message permissions
  MESSAGE_READ: 'message:read',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_RESPOND: 'message:respond',
  
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',
  DASHBOARD_MANAGE: 'dashboard:manage',
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Full access to everything
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.NEWS_CREATE,
    PERMISSIONS.NEWS_UPDATE,
    PERMISSIONS.NEWS_DELETE,
    PERMISSIONS.NEWS_PUBLISH,
    
    PERMISSIONS.PRODUCER_READ,
    PERMISSIONS.PRODUCER_CREATE,
    PERMISSIONS.PRODUCER_UPDATE,
    PERMISSIONS.PRODUCER_DELETE,
    PERMISSIONS.PRODUCER_APPROVE,
    
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_UPDATE,
    PERMISSIONS.SERVICE_DELETE,
    
    PERMISSIONS.PARTNERSHIP_READ,
    PERMISSIONS.PARTNERSHIP_CREATE,
    PERMISSIONS.PARTNERSHIP_UPDATE,
    PERMISSIONS.PARTNERSHIP_DELETE,
    
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.RESOURCE_CREATE,
    PERMISSIONS.RESOURCE_UPDATE,
    PERMISSIONS.RESOURCE_DELETE,
    
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_DELETE,
    
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE_ROLES,
    
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_DELETE,
    PERMISSIONS.MESSAGE_RESPOND,
    
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_ANALYTICS,
    PERMISSIONS.DASHBOARD_MANAGE,
  ],
  
  [ROLES.MODERATOR]: [
    // Moderate access - can manage content but not users
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.NEWS_CREATE,
    PERMISSIONS.NEWS_UPDATE,
    PERMISSIONS.NEWS_PUBLISH,
    
    PERMISSIONS.PRODUCER_READ,
    PERMISSIONS.PRODUCER_APPROVE,
    
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.SERVICE_CREATE,
    PERMISSIONS.SERVICE_UPDATE,
    
    PERMISSIONS.PARTNERSHIP_READ,
    PERMISSIONS.PARTNERSHIP_CREATE,
    PERMISSIONS.PARTNERSHIP_UPDATE,
    
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.RESOURCE_CREATE,
    PERMISSIONS.RESOURCE_UPDATE,
    
    PERMISSIONS.EVENT_READ,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    
    PERMISSIONS.MESSAGE_READ,
    PERMISSIONS.MESSAGE_RESPOND,
    
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_ANALYTICS,
  ],
  
  [ROLES.PRODUCER]: [
    // Producer-specific permissions
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.PRODUCER_READ,
    PERMISSIONS.PRODUCER_CREATE,
    PERMISSIONS.PRODUCER_UPDATE, // Only their own profile
    
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.PARTNERSHIP_READ,
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.EVENT_READ,
    
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  
  [ROLES.VIEWER]: [
    // Read-only access
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.PRODUCER_READ,
    PERMISSIONS.SERVICE_READ,
    PERMISSIONS.PARTNERSHIP_READ,
    PERMISSIONS.RESOURCE_READ,
    PERMISSIONS.EVENT_READ,
  ],
};

// Security utility functions
export const hasPermission = (userRole, requiredPermission) => {
  if (!userRole || !requiredPermission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userRole, requiredPermissions) => {
  if (!userRole || !Array.isArray(requiredPermissions)) return false;
  
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, requiredPermissions) => {
  if (!userRole || !Array.isArray(requiredPermissions)) return false;
  
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

// Role checking functions
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;
export const isModerator = (userRole) => userRole === ROLES.MODERATOR;
export const isProducer = (userRole) => userRole === ROLES.PRODUCER;
export const isViewer = (userRole) => userRole === ROLES.VIEWER;

// Permission checking functions for specific actions
export const canManageNews = (userRole) => hasPermission(userRole, PERMISSIONS.NEWS_CREATE);
export const canPublishNews = (userRole) => hasPermission(userRole, PERMISSIONS.NEWS_PUBLISH);
export const canDeleteNews = (userRole) => hasPermission(userRole, PERMISSIONS.NEWS_DELETE);

export const canManageProducers = (userRole) => hasPermission(userRole, PERMISSIONS.PRODUCER_APPROVE);
export const canCreateProducer = (userRole) => hasPermission(userRole, PERMISSIONS.PRODUCER_CREATE);
export const canUpdateProducer = (userRole) => hasPermission(userRole, PERMISSIONS.PRODUCER_UPDATE);

export const canManageUsers = (userRole) => hasPermission(userRole, PERMISSIONS.USER_MANAGE_ROLES);
export const canViewAnalytics = (userRole) => hasPermission(userRole, PERMISSIONS.DASHBOARD_ANALYTICS);
export const canManageDashboard = (userRole) => hasPermission(userRole, PERMISSIONS.DASHBOARD_MANAGE);

// Resource ownership checking
export const canEditResource = (userRole, resourceUserId, currentUserId) => {
  // Admins and moderators can edit any resource
  if (isAdmin(userRole) || isModerator(userRole)) return true;
  
  // Users can only edit their own resources
  return resourceUserId === currentUserId;
};

// Security levels for different operations
export const SECURITY_LEVELS = {
  PUBLIC: 'public',           // No authentication required
  AUTHENTICATED: 'authenticated', // Any logged-in user
  PRODUCER: 'producer',       // Producer role or higher
  MODERATOR: 'moderator',     // Moderator role or higher
  ADMIN: 'admin',            // Admin role only
};

// Route security configuration
export const ROUTE_SECURITY = {
  '/admin': SECURITY_LEVELS.ADMIN,
  '/admin/dashboard': SECURITY_LEVELS.ADMIN,
  '/admin/news': SECURITY_LEVELS.MODERATOR,
  '/admin/producers': SECURITY_LEVELS.MODERATOR,
  '/admin/users': SECURITY_LEVELS.ADMIN,
  '/admin/analytics': SECURITY_LEVELS.ADMIN,
  '/producer/profile': SECURITY_LEVELS.AUTHENTICATED,
  '/producer/register': SECURITY_LEVELS.AUTHENTICATED,
  '/dashboard': SECURITY_LEVELS.AUTHENTICATED,
  '/news': SECURITY_LEVELS.PUBLIC,
  '/producers': SECURITY_LEVELS.PUBLIC,
  '/services': SECURITY_LEVELS.PUBLIC,
  '/partnerships': SECURITY_LEVELS.PUBLIC,
  '/resources': SECURITY_LEVELS.PUBLIC,
  '/contact': SECURITY_LEVELS.PUBLIC,
};

// Input validation and sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Rate limiting utilities
export const createRateLimiter = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Check current requests
    const userRequests = Array.from(requests.values())
      .filter(timestamp => timestamp > windowStart);
    
    if (userRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    requests.set(identifier, now);
    return true; // Request allowed
  };
};

// Session management
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const REFRESH_TOKEN_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

export const isSessionValid = (lastActivity) => {
  if (!lastActivity) return false;
  return Date.now() - lastActivity < SESSION_TIMEOUT;
};

// Audit logging
export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  EXPORT: 'export',
  IMPORT: 'import',
  PERMISSION_CHANGE: 'permission_change',
  ROLE_CHANGE: 'role_change',
};

export const createAuditLog = (action, resource, userId, details = {}) => {
  return {
    action,
    resource,
    userId,
    timestamp: new Date().toISOString(),
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown',
  };
};

const securityUtils = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdmin,
  isModerator,
  isProducer,
  isViewer,
  canManageNews,
  canPublishNews,
  canDeleteNews,
  canManageProducers,
  canCreateProducer,
  canUpdateProducer,
  canManageUsers,
  canViewAnalytics,
  canManageDashboard,
  canEditResource,
  SECURITY_LEVELS,
  ROUTE_SECURITY,
  sanitizeInput,
  validateEmail,
  validatePhone,
  validatePassword,
  createRateLimiter,
  isSessionValid,
  AUDIT_ACTIONS,
  createAuditLog,
};

export default securityUtils;
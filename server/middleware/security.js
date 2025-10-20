const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://demo.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key'
);

// Security configuration
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT) || 30 * 60 * 1000, // 30 minutes
};

// User roles and permissions
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  PRODUCER: 'producer',
  VIEWER: 'viewer',
};

const PERMISSIONS = {
  NEWS_READ: 'news:read',
  NEWS_CREATE: 'news:create',
  NEWS_UPDATE: 'news:update',
  NEWS_DELETE: 'news:delete',
  NEWS_PUBLISH: 'news:publish',
  PRODUCER_READ: 'producer:read',
  PRODUCER_CREATE: 'producer:create',
  PRODUCER_UPDATE: 'producer:update',
  PRODUCER_DELETE: 'producer:delete',
  PRODUCER_APPROVE: 'producer:approve',
  USER_READ: 'user:read',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',
  DASHBOARD_MANAGE: 'dashboard:manage',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE,
    PERMISSIONS.NEWS_DELETE, PERMISSIONS.NEWS_PUBLISH,
    PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE,
    PERMISSIONS.PRODUCER_DELETE, PERMISSIONS.PRODUCER_APPROVE,
    PERMISSIONS.USER_READ, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE, PERMISSIONS.USER_MANAGE_ROLES,
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS, PERMISSIONS.DASHBOARD_MANAGE,
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE, PERMISSIONS.NEWS_PUBLISH,
    PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_APPROVE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS,
  ],
  [ROLES.PRODUCER]: [
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.NEWS_READ,
    PERMISSIONS.PRODUCER_READ,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
};

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message || 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limiter
const generalRateLimit = createRateLimiter(
  SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
  SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
  'Too many requests, please try again later.'
);

// Strict rate limiter for sensitive operations
const strictRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  'Too many attempts, please try again later.'
);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(403).json({ error: 'User profile not found' });
    }

    req.user = {
      ...user,
      role: profile.role || ROLES.VIEWER,
      profile: profile,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Authorization middleware
const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredPermissions,
        userRole: userRole,
      });
    }

    next();
  };
};

// Role-based authorization
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const roleHierarchy = {
      [ROLES.VIEWER]: 1,
      [ROLES.PRODUCER]: 2,
      [ROLES.MODERATOR]: 3,
      [ROLES.ADMIN]: 4,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: 'Insufficient role level',
        required: requiredRole,
        current: userRole,
      });
    }

    next();
  };
};

// Resource ownership middleware
const checkResourceOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const userId = req.user.id;

    // Admins and moderators can access any resource
    if (userRole === ROLES.ADMIN || userRole === ROLES.MODERATOR) {
      return next();
    }

    // Check resource ownership
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId !== userId) {
      return res.status(403).json({
        error: 'Access denied: You can only access your own resources',
      });
    }

    next();
  };
};

// Input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message),
        });
      }

      req.body = value; // Use validated and sanitized data
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Validation error' });
    }
  };
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CLIENT_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Audit logging middleware
const auditLog = (action, resource) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      // Log the action
      const auditData = {
        action,
        resource,
        userId: req.user?.id,
        userRole: req.user?.role,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        statusCode: res.statusCode,
        method: req.method,
        path: req.path,
      };

      console.log('Audit Log:', auditData);
      
      // In production, you would send this to a logging service
      // await logService.create(auditData);
      
      originalSend.call(this, data);
    };

    next();
  };
};

// Session validation middleware
const validateSession = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const sessionTimeout = SECURITY_CONFIG.SESSION_TIMEOUT;
  const lastActivity = req.user.last_activity || new Date();
  const now = new Date();

  if (now - lastActivity > sessionTimeout) {
    return res.status(401).json({ error: 'Session expired' });
  }

  // Update last activity
  req.user.last_activity = now;
  next();
};

module.exports = {
  // Rate limiting
  generalRateLimit,
  strictRateLimit,
  createRateLimiter,
  
  // Authentication & Authorization
  authenticateToken,
  authorize,
  requireRole,
  checkResourceOwnership,
  
  // Input validation
  validateInput,
  
  // Security headers
  securityHeaders,
  corsOptions,
  
  // Audit logging
  auditLog,
  
  // Session management
  validateSession,
  
  // Constants
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  SECURITY_CONFIG,
};
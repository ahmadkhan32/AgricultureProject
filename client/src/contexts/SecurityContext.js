import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  ROLES, 
  PERMISSIONS, 
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
} from '../utils/security';

const SecurityContext = createContext({});

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const { user, getUserProfile } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [securityLoading, setSecurityLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [auditLogs, setAuditLogs] = useState([]);

  // Rate limiter for API calls
  const apiRateLimiter = createRateLimiter(100, 60000); // 100 requests per minute

  // Update last activity on user interaction
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Check if session is still valid
  const checkSessionValidity = () => {
    return isSessionValid(lastActivity);
  };

  // Audit logging
  const logAuditEvent = useCallback((action, resource, details = {}) => {
    if (!user) return;
    
    const auditLog = createAuditLog(action, resource, user.id, {
      ...details,
      userRole,
      timestamp: new Date().toISOString(),
    });
    
    setAuditLogs(prev => [...prev.slice(-99), auditLog]); // Keep last 100 logs
    
    // In a real application, you would send this to a logging service
    console.log('Audit Log:', auditLog);
  }, [user, userRole]);

  // Load user role and permissions
  useEffect(() => {
    const loadUserSecurity = async () => {
      setSecurityLoading(true);
      try {
        if (user) {
          const profile = await getUserProfile();
          const role = profile?.role || ROLES.VIEWER;
          setUserRole(role);
          
          // Get permissions based on role
          const permissions = getRolePermissions(role);
          setUserPermissions(permissions);
          
          // Log security context load
          logAuditEvent(AUDIT_ACTIONS.VIEW, 'security_context', user.id, {
            role,
            permissions: permissions.length,
          });
        } else {
          setUserRole(null);
          setUserPermissions([]);
        }
      } catch (error) {
        console.error('Error loading user security context:', error);
        setUserRole(ROLES.VIEWER);
        setUserPermissions(getRolePermissions(ROLES.VIEWER));
      } finally {
        setSecurityLoading(false);
      }
    };

    loadUserSecurity();
  }, [user, getUserProfile, logAuditEvent]);

  // Get permissions for a role
  const getRolePermissions = (role) => {
    const rolePermissions = {
      [ROLES.ADMIN]: [
        PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE, 
        PERMISSIONS.NEWS_DELETE, PERMISSIONS.NEWS_PUBLISH,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE, 
        PERMISSIONS.PRODUCER_DELETE, PERMISSIONS.PRODUCER_APPROVE,
        PERMISSIONS.SERVICE_READ, PERMISSIONS.SERVICE_CREATE, PERMISSIONS.SERVICE_UPDATE, 
        PERMISSIONS.SERVICE_DELETE,
        PERMISSIONS.PARTNERSHIP_READ, PERMISSIONS.PARTNERSHIP_CREATE, 
        PERMISSIONS.PARTNERSHIP_UPDATE, PERMISSIONS.PARTNERSHIP_DELETE,
        PERMISSIONS.RESOURCE_READ, PERMISSIONS.RESOURCE_CREATE, 
        PERMISSIONS.RESOURCE_UPDATE, PERMISSIONS.RESOURCE_DELETE,
        PERMISSIONS.EVENT_READ, PERMISSIONS.EVENT_CREATE, 
        PERMISSIONS.EVENT_UPDATE, PERMISSIONS.EVENT_DELETE,
        PERMISSIONS.USER_READ, PERMISSIONS.USER_CREATE, 
        PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE, PERMISSIONS.USER_MANAGE_ROLES,
        PERMISSIONS.MESSAGE_READ, PERMISSIONS.MESSAGE_DELETE, PERMISSIONS.MESSAGE_RESPOND,
        PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS, PERMISSIONS.DASHBOARD_MANAGE,
      ],
      [ROLES.MODERATOR]: [
        PERMISSIONS.NEWS_READ, PERMISSIONS.NEWS_CREATE, PERMISSIONS.NEWS_UPDATE, 
        PERMISSIONS.NEWS_PUBLISH,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_APPROVE,
        PERMISSIONS.SERVICE_READ, PERMISSIONS.SERVICE_CREATE, PERMISSIONS.SERVICE_UPDATE,
        PERMISSIONS.PARTNERSHIP_READ, PERMISSIONS.PARTNERSHIP_CREATE, 
        PERMISSIONS.PARTNERSHIP_UPDATE,
        PERMISSIONS.RESOURCE_READ, PERMISSIONS.RESOURCE_CREATE, 
        PERMISSIONS.RESOURCE_UPDATE,
        PERMISSIONS.EVENT_READ, PERMISSIONS.EVENT_CREATE, 
        PERMISSIONS.EVENT_UPDATE,
        PERMISSIONS.MESSAGE_READ, PERMISSIONS.MESSAGE_RESPOND,
        PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS,
      ],
      [ROLES.PRODUCER]: [
        PERMISSIONS.NEWS_READ,
        PERMISSIONS.PRODUCER_READ, PERMISSIONS.PRODUCER_CREATE, PERMISSIONS.PRODUCER_UPDATE,
        PERMISSIONS.SERVICE_READ, PERMISSIONS.PARTNERSHIP_READ, 
        PERMISSIONS.RESOURCE_READ, PERMISSIONS.EVENT_READ,
        PERMISSIONS.DASHBOARD_VIEW,
      ],
      [ROLES.VIEWER]: [
        PERMISSIONS.NEWS_READ, PERMISSIONS.PRODUCER_READ, PERMISSIONS.SERVICE_READ,
        PERMISSIONS.PARTNERSHIP_READ, PERMISSIONS.RESOURCE_READ, PERMISSIONS.EVENT_READ,
      ],
    };
    
    return rolePermissions[role] || [];
  };

  // Permission checking functions
  const checkPermission = (permission) => {
    return hasPermission(userRole, permission);
  };

  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(userRole, permissions);
  };

  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(userRole, permissions);
  };

  // Role checking functions
  const checkRole = (role) => {
    return userRole === role;
  };

  const checkRoleLevel = (requiredLevel) => {
    const roleLevels = {
      [ROLES.VIEWER]: 1,
      [ROLES.PRODUCER]: 2,
      [ROLES.MODERATOR]: 3,
      [ROLES.ADMIN]: 4,
    };
    
    const userLevel = roleLevels[userRole] || 0;
    const required = roleLevels[requiredLevel] || 0;
    
    return userLevel >= required;
  };

  // Route security checking
  const checkRouteAccess = (path) => {
    const requiredLevel = ROUTE_SECURITY[path];
    if (!requiredLevel) return true; // Public route
    
    switch (requiredLevel) {
      case SECURITY_LEVELS.PUBLIC:
        return true;
      case SECURITY_LEVELS.AUTHENTICATED:
        return !!user;
      case SECURITY_LEVELS.PRODUCER:
        return checkRoleLevel(ROLES.PRODUCER);
      case SECURITY_LEVELS.MODERATOR:
        return checkRoleLevel(ROLES.MODERATOR);
      case SECURITY_LEVELS.ADMIN:
        return checkRoleLevel(ROLES.ADMIN);
      default:
        return false;
    }
  };

  // Resource ownership checking
  const checkResourceOwnership = (resourceUserId) => {
    if (!user) return false;
    return resourceUserId === user.id || checkRoleLevel(ROLES.MODERATOR);
  };

  // Rate limiting check
  const checkRateLimit = (action) => {
    const identifier = user ? user.id : 'anonymous';
    return apiRateLimiter(`${identifier}_${action}`);
  };


  // Input validation
  const validateInput = (input, type = 'text') => {
    switch (type) {
      case 'email':
        return validateEmail(input);
      case 'phone':
        return validatePhone(input);
      case 'password':
        return validatePassword(input);
      default:
        return sanitizeInput(input);
    }
  };

  // Security context value
  const value = {
    // User role and permissions
    userRole,
    userPermissions,
    securityLoading,
    
    // Permission checking
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    
    // Role checking
    checkRole,
    checkRoleLevel,
    isAdmin: isAdmin(userRole),
    isModerator: isModerator(userRole),
    isProducer: isProducer(userRole),
    isViewer: isViewer(userRole),
    
    // Specific permission checks
    canManageNews: canManageNews(userRole),
    canPublishNews: canPublishNews(userRole),
    canDeleteNews: canDeleteNews(userRole),
    canManageProducers: canManageProducers(userRole),
    canCreateProducer: canCreateProducer(userRole),
    canUpdateProducer: canUpdateProducer(userRole),
    canManageUsers: canManageUsers(userRole),
    canViewAnalytics: canViewAnalytics(userRole),
    canManageDashboard: canManageDashboard(userRole),
    
    // Resource and route security
    checkRouteAccess,
    checkResourceOwnership,
    canEditResource: (resourceUserId) => canEditResource(userRole, resourceUserId, user?.id),
    
    // Session management
    updateActivity,
    checkSessionValidity,
    isSessionValid: isSessionValid(lastActivity),
    
    // Rate limiting
    checkRateLimit,
    
    // Audit logging
    logAuditEvent,
    auditLogs,
    AUDIT_ACTIONS,
    
    // Input validation
    validateInput,
    sanitizeInput,
    
    // Constants
    ROLES,
    PERMISSIONS,
    SECURITY_LEVELS,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityContext;
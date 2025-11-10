import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSecurity } from '../../contexts/SecurityContext';
import { SECURITY_LEVELS } from '../../utils/security';
import toast from 'react-hot-toast';

const EnhancedProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermissions = [], 
  requiredSecurityLevel = SECURITY_LEVELS.AUTHENTICATED,
  fallbackPath = '/login',
  showToast = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { 
    userRole, 
    securityLoading, 
    checkRouteAccess, 
    checkPermission, 
    checkRoleLevel,
    logAuditEvent,
    AUDIT_ACTIONS 
  } = useSecurity();
  const location = useLocation();

  // Show loading while authentication and security context are loading
  if (authLoading || securityLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    if (showToast) {
      toast.error('Please log in to access this page');
    }
    logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
      path: location.pathname,
      reason: 'not_authenticated',
    });
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check security level access
  if (!checkRouteAccess(location.pathname)) {
    if (showToast) {
      toast.error('You do not have permission to access this page');
    }
    logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
      path: location.pathname,
      reason: 'insufficient_security_level',
      userRole,
      requiredSecurityLevel,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role requirement
  if (requiredRole && userRole !== requiredRole) {
    if (showToast) {
      toast.error(`This page requires ${requiredRole} access`);
    }
    logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
      path: location.pathname,
      reason: 'insufficient_role',
      userRole,
      requiredRole,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role level requirement
  // Get current role from both sources
  const currentRole = userRole || user?.role;
  
  if (requiredSecurityLevel) {
    // For admin routes, check direct role match first
    if (requiredSecurityLevel === SECURITY_LEVELS.ADMIN) {
      if (currentRole === 'admin') {
        // User is admin, allow access - continue
      } else {
        if (showToast) {
          toast.error('Admin access required. Your current role: ' + (currentRole || 'none') + '. Please contact administrator.');
        }
        logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
          path: location.pathname,
          reason: 'insufficient_role_level',
          userRole: currentRole,
          requiredSecurityLevel,
        });
        return <Navigate to="/unauthorized" replace />;
      }
    } else if (!checkRoleLevel(requiredSecurityLevel)) {
      // For non-admin routes, use standard role level check
      if (showToast) {
        toast.error('You do not have sufficient privileges to access this page');
      }
      logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
        path: location.pathname,
        reason: 'insufficient_role_level',
        userRole: currentRole,
        requiredSecurityLevel,
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check specific permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      checkPermission(permission)
    );
    
    if (!hasRequiredPermissions) {
      if (showToast) {
        toast.error('You do not have the required permissions to access this page');
      }
      logAuditEvent(AUDIT_ACTIONS.VIEW, 'unauthorized_access', {
        path: location.pathname,
        reason: 'insufficient_permissions',
        userRole,
        requiredPermissions,
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Log successful access
  logAuditEvent(AUDIT_ACTIONS.VIEW, 'authorized_access', {
    path: location.pathname,
    userRole,
  });

  return children;
};

// Higher-order component for protecting components
export const withSecurity = (Component, securityConfig = {}) => {
  return (props) => (
    <EnhancedProtectedRoute {...securityConfig}>
      <Component {...props} />
    </EnhancedProtectedRoute>
  );
};

// Specific route protection components
export const AdminRoute = ({ children }) => (
  <EnhancedProtectedRoute 
    requiredSecurityLevel={SECURITY_LEVELS.ADMIN}
    fallbackPath="/dashboard"
  >
    {children}
  </EnhancedProtectedRoute>
);

export const ModeratorRoute = ({ children }) => (
  <EnhancedProtectedRoute 
    requiredSecurityLevel={SECURITY_LEVELS.MODERATOR}
    fallbackPath="/dashboard"
  >
    {children}
  </EnhancedProtectedRoute>
);

export const ProducerRoute = ({ children }) => (
  <EnhancedProtectedRoute 
    requiredSecurityLevel={SECURITY_LEVELS.PRODUCER}
    fallbackPath="/login"
  >
    {children}
  </EnhancedProtectedRoute>
);

export const AuthenticatedRoute = ({ children }) => (
  <EnhancedProtectedRoute 
    requiredSecurityLevel={SECURITY_LEVELS.AUTHENTICATED}
    fallbackPath="/login"
  >
    {children}
  </EnhancedProtectedRoute>
);

// Permission-based route protection
export const PermissionRoute = ({ children, permissions, requireAll = true }) => (
  <EnhancedProtectedRoute 
    requiredPermissions={permissions}
    fallbackPath="/dashboard"
  >
    {children}
  </EnhancedProtectedRoute>
);

export default EnhancedProtectedRoute;
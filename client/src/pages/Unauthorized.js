import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSecurity } from '../contexts/SecurityContext';

const Unauthorized = () => {
  const { user } = useAuth();
  const { userRole } = useSecurity();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const getUnauthorizedMessage = () => {
    if (!user) {
      return {
        title: 'Authentication Required',
        message: 'You need to log in to access this page.',
        action: 'Log In',
        actionPath: '/login',
      };
    }

    switch (userRole) {
      case 'viewer':
        return {
          title: 'Insufficient Permissions',
          message: 'You need producer access or higher to view this page.',
          action: 'Upgrade Account',
          actionPath: '/register',
        };
      case 'producer':
        return {
          title: 'Moderator Access Required',
          message: 'This page requires moderator or admin privileges.',
          action: 'Contact Admin',
          actionPath: '/contact',
        };
      case 'moderator':
        return {
          title: 'Admin Access Required',
          message: 'This page requires administrator privileges.',
          action: 'Contact Admin',
          actionPath: '/contact',
        };
      default:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this page.',
          action: 'Go Home',
          actionPath: '/',
        };
    }
  };

  const unauthorizedInfo = getUnauthorizedMessage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <ShieldX className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {unauthorizedInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {unauthorizedInfo.message}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {/* User Info */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Current Access Level: {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                    </p>
                    <p className="text-xs text-blue-600">
                      User: {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to={unauthorizedInfo.actionPath}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {unauthorizedInfo.action}
              </Link>

              <Link
                to={from}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>

              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Contact your administrator for access requests</p>
                <p>• Check if you're logged in with the correct account</p>
                <p>• Verify your account has the required permissions</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 text-center">
                For technical support, contact{' '}
                <a 
                  href="mailto:support@ucaeep.km" 
                  className="text-primary-600 hover:text-primary-500"
                >
                  support@ucaeep.km
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

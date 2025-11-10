import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDevMode } from '../config/supabase';
import mockAuth from '../services/mockAuth';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored token and user
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Verify token is still valid
            const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check if backend server is available
  const checkBackendHealth = async (apiUrl) => {
    try {
      const healthUrl = apiUrl.replace('/api', '/api/health');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(healthUrl, { method: 'GET' }),
        timeoutPromise
      ]);
      
      return response.ok;
    } catch {
      return false;
    }
  };

  const signUp = async (email, password, userData) => {
    try {
      // Use backend API for registration
      const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
      
      // Check if backend is available before attempting registration
      const isBackendAvailable = await checkBackendHealth(API_URL);
      if (!isBackendAvailable) {
        throw new Error(
          `Backend server is not running at ${API_URL}. ` +
          `Please start the backend server: Open terminal and run "npm run server" or "cd server && npm run dev". ` +
          `Wait for "🚀 UCAEP Server running on port 5000" message before trying again.`
        );
      }
      
      // Normalize phone: convert empty strings, undefined, or null to null
      const phone = userData.phone && typeof userData.phone === 'string' && userData.phone.trim() ? userData.phone.trim() : null;
      
      console.log(`📡 Attempting registration to: ${API_URL}/auth/register`);
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: phone,
          role: userData.role || 'producer'
        }),
      }).catch((fetchError) => {
        // Network error (server not running, CORS, etc.)
        console.error('❌ Network error:', fetchError);
        throw new Error(
          `Cannot connect to server at ${API_URL}. ` +
          `Please make sure the backend server is running. ` +
          `Error: ${fetchError.message}`
        );
      });

      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error(
          `Server returned an invalid response. ` +
          `Status: ${response.status}. ` +
          `Please check if the backend server is running correctly.`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || `Registration failed (${response.status})`);
      }

      toast.success('Registration successful! You can now log in.');
      return { data, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      // Dismiss all previous toasts before showing new one
      toast.dismiss();
      
      // Provide helpful error message
      let errorMessage = error.message || 'Registration failed. Please try again.';
      
      // Provide specific guidance for common errors
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('Cannot connect'))) {
        errorMessage = error.message + 
          ' If you\'re running locally, make sure the backend server is started with "npm run dev" or "cd server && npm start".';
      }
      
      toast.error(errorMessage, {
        id: 'registration-error', // Use ID to prevent duplicates
        duration: 8000 // Longer duration for connection errors
      });
      return { data: null, error: { message: errorMessage } };
    }
  };

  const signIn = async (email, password) => {
    try {
      // Use backend API for authentication
      const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Set user state
      setUser(data.user);
      toast.dismiss(); // Clear any previous toasts
      toast.success('Login successful!');
      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      toast.dismiss(); // Clear any previous toasts
      toast.error(error.message || 'Login failed. Please check your credentials.', {
        id: 'login-error', // Use ID to prevent duplicates
        duration: 5000
      });
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserProfile = async () => {
    if (!user) return null;

    try {
      if (isDevMode) {
        // Use mock authentication
        const { data, error } = await mockAuth.getUserProfile(user.id);
        if (error) {
          console.warn('User profile not found in mock data:', error.message);
          return null;
        }
        return data;
      } else {
        // Use real Supabase authentication
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn('User profile not found in database:', error.message);
          return null;
        }
        return data;
      }
    } catch (error) {
      console.warn('Error fetching user profile:', error.message);
      return null;
    }
  };

  const isAdmin = async () => {
    if (!user) return false;
    
    try {
      if (isDevMode) {
        // In dev mode, check user role directly
        return user.role === 'admin';
      } else {
        // Use real Supabase authentication
        const profile = await getUserProfile();
        return profile?.role === 'admin';
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const resetPassword = async (email) => {
    try {
      if (isDevMode) {
        // Use mock authentication
        await mockAuth.resetPassword(email);
        toast.success('Password reset email sent! (Mock)');
        return { error: null };
      } else {
        // Use real Supabase authentication
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        toast.success('Password reset email sent!');
        return { error: null };
      }
    } catch (error) {
      toast.error(error.message);
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      if (isDevMode) {
        // Use mock authentication
        await mockAuth.updatePassword(newPassword);
        toast.success('Password updated successfully! (Mock)');
        return { error: null };
      } else {
        // Use real Supabase authentication
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) throw error;
        toast.success('Password updated successfully!');
        return { error: null };
      }
    } catch (error) {
      toast.error(error.message);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    isAdmin,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

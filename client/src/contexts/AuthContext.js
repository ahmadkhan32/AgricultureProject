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
        if (isDevMode) {
          // Use mock authentication
          const { data } = await mockAuth.getSession();
          setUser(data.session?.user ?? null);
        } else {
          // Use real Supabase authentication
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    if (!isDevMode) {
      // Listen for auth changes (only for real Supabase)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      if (isDevMode) {
        // Use mock authentication
        const { data, error } = await mockAuth.signUp(email, password, userData);
        if (error) throw error;
        
        toast.success('Registration successful! You can now log in.');
        return { data, error: null };
      } else {
        // Use real Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Create profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email,
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone: userData.phone,
              role: userData.role || 'producer',
            });

          if (profileError) throw profileError;
        }

        toast.success('Registration successful! Please check your email to confirm your account.');
        return { data, error: null };
      }
    } catch (error) {
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      if (isDevMode) {
        // Use mock authentication
        const { data, error } = await mockAuth.signIn(email, password);
        if (error) throw error;
        
        setUser(data.user);
        toast.success('Login successful!');
        return { data, error: null };
      } else {
        // Use real Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success('Login successful!');
        return { data, error: null };
      }
    } catch (error) {
      toast.error(error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      if (isDevMode) {
        // Use mock authentication
        await mockAuth.signOut();
        setUser(null);
      } else {
        // Use real Supabase authentication
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
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
        if (error) throw error;
        return data;
      } else {
        // Use real Supabase authentication
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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

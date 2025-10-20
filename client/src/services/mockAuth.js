// Mock authentication service for development
import { isDevMode } from '../config/supabase';

// Mock users database
const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@ucaeep.km',
    password: 'admin123',
    role: 'admin',
    profile: {
      id: 'admin-1',
      email: 'admin@ucaeep.km',
      first_name: 'Admin',
      last_name: 'User',
      phone: '+269 123 456 789',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'producer-1',
    email: 'producer@example.com',
    password: 'producer123',
    role: 'producer',
    profile: {
      id: 'producer-1',
      email: 'producer@example.com',
      first_name: 'John',
      last_name: 'Doe',
      phone: '+269 987 654 321',
      role: 'producer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

// Mock session storage
let currentUser = null;
let currentSession = null;

export const mockAuth = {
  // Sign up
  signUp: async (email, password, userData) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      role: userData.role || 'producer',
      profile: {
        id: `user-${Date.now()}`,
        email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        role: userData.role || 'producer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    mockUsers.push(newUser);
    
    return {
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        }
      },
      error: null
    };
  },

  // Sign in
  signIn: async (email, password) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Create session
    currentUser = user;
    currentSession = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`
    };

    // Store in localStorage for persistence
    localStorage.setItem('mock_user', JSON.stringify(currentUser));
    localStorage.setItem('mock_session', JSON.stringify(currentSession));

    return {
      data: currentSession,
      error: null
    };
  },

  // Sign out
  signOut: async () => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    currentUser = null;
    currentSession = null;
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_session');

    return { error: null };
  },

  // Get current session
  getSession: async () => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    // Try to restore from localStorage
    if (!currentSession) {
      const storedSession = localStorage.getItem('mock_session');
      const storedUser = localStorage.getItem('mock_user');
      
      if (storedSession && storedUser) {
        currentSession = JSON.parse(storedSession);
        currentUser = JSON.parse(storedUser);
      }
    }

    return {
      data: {
        session: currentSession
      },
      error: null
    };
  },

  // Get user profile
  getUserProfile: async (userId) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      data: user.profile,
      error: null
    };
  },

  // Update user profile
  updateUserProfile: async (userId, updates) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].profile = {
      ...mockUsers[userIndex].profile,
      ...updates,
      updated_at: new Date().toISOString()
    };

    return {
      data: mockUsers[userIndex].profile,
      error: null
    };
  },

  // Reset password (mock)
  resetPassword: async (email) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, this would send an email
    console.log(`Mock: Password reset email sent to ${email}`);
    
    return { error: null };
  },

  // Update password
  updatePassword: async (newPassword) => {
    if (!isDevMode) {
      throw new Error('Mock auth only available in development mode');
    }

    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].password = newPassword;
    }

    return { error: null };
  }
};

export default mockAuth;

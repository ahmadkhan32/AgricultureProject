import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'demo_anon_key';
const devMode = process.env.REACT_APP_DEV_MODE === 'true' || (supabaseUrl === 'https://demo.supabase.co' && supabaseKey === 'demo_anon_key');

// For development, we'll use mock Supabase client
if (devMode) {
  console.log('⚠️  Using development mode with mock authentication');
  console.log('📝 To use real Supabase, set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with proper configuration
export const supabase = createClient(
  devMode ? 'http://localhost:3000' : supabaseUrl, // Use localhost in dev mode to prevent network requests
  devMode ? 'mock_key' : supabaseKey,
  {
    auth: {
      persistSession: !devMode, // Disable session persistence in dev mode
      autoRefreshToken: !devMode, // Disable token refresh in dev mode
    },
    global: {
      headers: devMode ? { 'x-mock-mode': 'true' } : {},
    }
  }
);

// Export dev mode flag for use in other components
export const isDevMode = devMode;

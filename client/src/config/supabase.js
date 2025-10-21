import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://nzsydskdetneulvvpqxn.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM';
const devMode = process.env.REACT_APP_DEV_MODE === 'true' || (supabaseUrl === 'https://nzsydskdetneulvvpqxn.supabase.co' && supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzcyMTUsImV4cCI6MjA3NjQ1MzIxNX0.wX0wUeWNaLsng6AWM51CqAFJ9s3RcjNGorRkcaYgYyM');

// For development, we'll use mock Supabase client
if (devMode) {
  console.log('⚠️  Using development mode with mock authentication');
  console.log('📝 To use real Supabase, set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with proper configuration
export const supabase = createClient(
  supabaseUrl, // Always use the real Supabase URL
  supabaseKey, // Always use the real Supabase key
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

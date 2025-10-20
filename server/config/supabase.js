const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://demo.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_role_key';

// For development, we'll use mock Supabase client
if (supabaseUrl === 'https://demo.supabase.co' && supabaseKey === 'demo_service_role_key') {
  console.log('⚠️  Using demo Supabase configuration for development');
  console.log('📝 To use real Supabase, update your .env file with actual credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

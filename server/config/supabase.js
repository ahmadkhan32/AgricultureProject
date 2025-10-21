const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://nzsydskdetneulvvpqxn.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg3NzIxNSwiZXhwIjoyMDc2NDUzMjE1fQ.S-XVHkvna6GtvTbt5osN-00qfZ8OvuAkox8PMG0VzaE';

// For development, we'll use mock Supabase client
if (supabaseUrl === 'https://nzsydskdetneulvvpqxn.supabase.co' && supabaseKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3lkc2tkZXRuZXVsdnZwcXhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg3NzIxNSwiZXhwIjoyMDc2NDUzMjE1fQ.S-XVHkvna6GtvTbt5osN-00qfZ8OvuAkox8PMG0VzaE') {
  console.log('⚠️  Using demo Supabase configuration for development');
  console.log('📝 To use real Supabase, update your .env file with actual credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

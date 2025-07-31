import { initializeSupabase } from '../unified-auth/src/unifiedSupabase';

// Initialize unified auth with CRM-specific environment variables
export const initializeUnifiedAuth = () => {
  // Initialize Supabase with CRM environment variables
  initializeSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
  });
};

// Export the backend URL for CRM
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
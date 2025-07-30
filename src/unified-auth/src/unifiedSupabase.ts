import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const getRedirectUrl = (path: string) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}${path}`;
};
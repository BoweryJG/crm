import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add explicit export to ensure this is treated as a module
export {};

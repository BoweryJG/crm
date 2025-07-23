// Database module that wraps Supabase for analytics
import { supabase } from '../services/supabase/supabase';

// Export the supabase client as 'db' for compatibility with analytics modules
export const db = supabase;

// Export helper functions that mimic Drizzle ORM syntax
export const sql = {
  raw: (query: string) => query,
};

// Re-export types that analytics modules expect
export type Database = typeof supabase;
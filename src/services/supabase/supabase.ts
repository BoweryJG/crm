import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Replace these with your Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Create a mock Supabase client for development when URL is invalid
const createMockClient = (): SupabaseClient => {
  console.warn('Using mock Supabase client due to invalid URL or key');
  
  // Return a mock client with the same interface but no-op methods
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null })
    },
    // Add other methods as needed
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  } as unknown as SupabaseClient;
};

// Create a Supabase client with error handling
let supabase: SupabaseClient;
try {
  // Validate URL format
  new URL(supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  supabase = createMockClient();
}

export { supabase };

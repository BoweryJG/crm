import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';

// Replace these with your Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example';

// Create a mock Supabase client for development when URL is invalid
const createMockClient = (): SupabaseClient => {
  console.warn('Using mock Supabase client due to invalid URL or key');
  
  // Mock user data
  const mockUser: User = {
    id: 'mock-user-id',
    email: 'demo@example.com',
    user_metadata: {
      first_name: 'Demo',
      last_name: 'User'
    },
    app_metadata: {
      role: 'user'
    },
    created_at: new Date().toISOString(),
    aud: 'authenticated',
    role: ''
  };
  
  // Mock session data
  const mockSession: Session = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUser
  };
  
  // Store auth state
  let currentSession: Session | null = null;
  let authChangeCallbacks: ((event: AuthChangeEvent, session: Session | null) => void)[] = [];
  
  // Return a mock client with the same interface but simulated methods
  return {
    auth: {
      getSession: () => Promise.resolve({ 
        data: { session: currentSession }, 
        error: null 
      }),
      
      onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
        authChangeCallbacks.push(callback);
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                authChangeCallbacks = authChangeCallbacks.filter(cb => cb !== callback);
              } 
            } 
          } 
        };
      },
      
      signInWithPassword: ({ email, password }: { email: string; password: string }) => {
        // Simulate successful login
        currentSession = mockSession;
        
        // Notify listeners
        authChangeCallbacks.forEach(callback => 
          callback('SIGNED_IN', { ...mockSession })
        );
        
        return Promise.resolve({ 
          data: { 
            user: mockUser, 
            session: mockSession 
          }, 
          error: null 
        });
      },
      
      signUp: ({ email, password }: { email: string; password: string }) => {
        // Simulate successful signup
        // In a real app, this would create a new user
        return Promise.resolve({ 
          data: { 
            user: { ...mockUser, email }, 
            session: null // No session on signup until email verification
          }, 
          error: null 
        });
      },
      
      signOut: () => {
        // Simulate sign out
        currentSession = null;
        
        // Notify listeners
        authChangeCallbacks.forEach(callback => 
          callback('SIGNED_OUT', null)
        );
        
        return Promise.resolve({ error: null });
      },
      
      resetPasswordForEmail: (email: string) => Promise.resolve({ data: {}, error: null })
    },
    
    // Add other methods as needed
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => Promise.resolve({ data: {}, error: null }),
          data: [], 
          error: null
        }),
        data: [], 
        error: null
      }),
      insert: (data: any) => Promise.resolve({ data, error: null }),
      update: (data: any) => Promise.resolve({ data, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  } as unknown as SupabaseClient;
};

// Create a Supabase client with error handling
let supabase: SupabaseClient;
try {
  // Validate URL format
  new URL(supabaseUrl);
  
  // Check if using placeholder values
  if (supabaseUrl === 'https://example.supabase.co' || 
      supabaseUrl === 'your_supabase_url' ||
      supabaseAnonKey === 'your_supabase_anon_key' ||
      supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example') {
    throw new Error('Using placeholder Supabase credentials');
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  supabase = createMockClient();
}

export { supabase };

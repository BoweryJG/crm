import { createClient, SupabaseClient, Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { logger } from '../../utils/logger';
import {
  generateMockContacts,
  generateMockPractices,
  generateMockResearchProjects,
  generateMockResearchDocuments,
  generateMockResearchTasks,
  generateMockResearchPrompts,
  generateMockResearchNotes,
  generateMockResearchDataQueries
} from '../mockData/mockDataService';
import { 
  enhanceMockDataWithLinguistics,
  generateMultipleMockLinguisticsAnalyses,
  generateMultipleMockCallAnalysesWithLinguistics 
} from '../mockData/mockLinguisticsData';

// Environment variables for Supabase
logger.debug('NODE_ENV:', process.env.NODE_ENV || 'development');

const rawSupabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const rawSupabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

logger.debug('Raw REACT_APP_SUPABASE_URL:', rawSupabaseUrl ? `Set (ends with "${rawSupabaseUrl.slice(-10)}")` : 'Not Set');
logger.debug('Raw REACT_APP_SUPABASE_KEY/ANON_KEY:', rawSupabaseAnonKey ? `Set (starts with "${rawSupabaseAnonKey.substring(0, 10)}...", ends with "${rawSupabaseAnonKey.slice(-4)}")` : 'Not Set');

// Use the actual Supabase credentials from environment variables
const supabaseUrl = rawSupabaseUrl;
const supabaseAnonKey = rawSupabaseAnonKey;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
}

// Log the values being used
logger.debug('Effective Supabase URL being used:', supabaseUrl);
logger.debug('Effective Supabase Anon Key being used:', supabaseAnonKey ? `Starts with "${supabaseAnonKey.substring(0, 10)}...", ends with "${supabaseAnonKey.slice(-4)}"` : 'Not Set');

// Create a mock Supabase client for development when URL is invalid
const createMockClient = (): SupabaseClient => {
  console.warn('FALLBACK: Using mock Supabase client due to invalid/placeholder credentials or other error.');
  
  // Mock user data
  const mockUserId = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd';
  const mockUser: User = {
    id: mockUserId,
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      
      resetPasswordForEmail: (email: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return Promise.resolve({ data: {}, error: null });
      },

      getUser: () => {
        // Simulate fetching the current user based on the session
        if (currentSession && currentSession.user) {
          return Promise.resolve({ data: { user: currentSession.user }, error: null });
        } else {
          // Try to provide a mock user even if session is null for basic functionality
          // In a real scenario, if no session, user would be null.
          // For mock, let's assume mockUser is always available if needed, 
          // or adjust based on desired mock behavior (e.g., return null if currentSession is null)
          return Promise.resolve({ data: { user: mockUser }, error: null }); // Or: data: { user: null } if currentSession is null
        }
      }
    },
    
    // Mock database with our enhanced mock data
    from: (table: string) => {
      // Generate mock data for tables and transform field names to match database conventions
      const transformContactToDatabaseFormat = (contact: any) => ({
        id: contact.id,
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        practice_id: contact.practiceId,
        practice_name: contact.practiceName,
        practice_type: contact.practiceType,
        specialty: contact.specialty,
        is_starred: contact.isStarred,
        last_contact_date: contact.lastContactDate,
        notes: contact.notes,
        tags: contact.tags,
        created_at: contact.createdAt,
        updated_at: contact.updatedAt
      });
      
      const transformPracticeToDatabaseFormat = (practice: any) => ({
        id: practice.id,
        name: practice.name,
        address: practice.address,
        city: practice.city,
        state: practice.state,
        zip_code: practice.zipCode,
        phone: practice.phone,
        email: practice.email,
        website: practice.website,
        type: practice.type,
        size: practice.size,
        is_dso: practice.isDSO,
        num_practitioners: practice.numPractitioners,
        specialties: practice.specialties,
        technologies: practice.technologies,
        procedures: practice.procedures,
        notes: practice.notes,
        last_contact_date: practice.lastContactDate,
        created_at: practice.createdAt,
        updated_at: practice.updatedAt
      });
      
      // Generate and transform mock data
      const mockContacts = generateMockContacts(20).map(transformContactToDatabaseFormat);
      const mockPractices = generateMockPractices(20).map(transformPracticeToDatabaseFormat);

      const mockProjects = generateMockResearchProjects(5);
      const mockDocuments = generateMockResearchDocuments(mockProjects, 2);
      const mockTasks = generateMockResearchTasks(mockProjects, 3);
      const mockPrompts = generateMockResearchPrompts(3);
      const mockNotes = generateMockResearchNotes(mockProjects, 1);
      const mockQueries = generateMockResearchDataQueries(2);
      
      // Generate mock call analyses and linguistics analyses with proper relationships
      const enhancedMockData = enhanceMockDataWithLinguistics({});
      // Use the enhanced mock data that has proper relationships between call_analysis and linguistics_analysis
      const mockCallAnalyses = enhancedMockData.call_analysis as any[];
      const mockLinguisticsAnalyses = enhancedMockData.linguistics_analysis as any[];

      const mockData: Record<string, any[]> = {
        contacts: mockContacts,
        practices: mockPractices,
        public_contacts: mockContacts, // For compatibility with Contacts.tsx
        research_projects: mockProjects,
        research_documents: mockDocuments,
        research_tasks: mockTasks,
        research_prompts: mockPrompts,
        research_notes: mockNotes,
        research_data_queries: mockQueries,
        call_analysis: mockCallAnalyses,
        linguistics_analysis: mockLinguisticsAnalyses
      };
      
      // Get data for the requested table
      const tableData = mockData[table] || [];
      
      return {
        select: (columns?: string) => {
          let queryBuilder = {
            data: tableData,
            error: null,
            
            // Filter by equality
            eq: (column: string, value: any) => {
              const filteredData = tableData.filter(item => item[column] === value);
              
              return {
                ...queryBuilder,
                data: filteredData,
                
                // Return single result
                single: () => {
                  return Promise.resolve({
                    data: filteredData.length > 0 ? filteredData[0] : null,
                    error: null
                  });
                },
                
                // Add order method to maintain chainability
                order: (_column: string, _options: { ascending: boolean }) => {
                  return {
                    ...queryBuilder,
                    data: filteredData
                  };
                }
              };
            },
            
            // Filter by inclusion in array
            in: (column: string, values: any[]) => {
              const filteredData = tableData.filter(item => values.includes(item[column]));
              
              return {
                ...queryBuilder,
                data: filteredData,
                
                // Add order method to maintain chainability
                order: (_column: string, _options: { ascending: boolean }) => {
                  return {
                    ...queryBuilder,
                    data: filteredData
                  };
                }
              };
            },
            
            // Order results
            order: (column: string, options: { ascending: boolean }) => {
              const sortedData = [...tableData].sort((a, b) => {
                if (options.ascending) {
                  return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                } else {
                  return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
                }
              });
              
              return {
                ...queryBuilder,
                data: sortedData
              };
            },
            
            // Limit results
            limit: (limit: number) => {
              return {
                ...queryBuilder,
                data: tableData.slice(0, limit)
              };
            }
          };
          
          return queryBuilder;
        },
        
        // Insert data
        insert: (data: any) => {
          const newData = Array.isArray(data) ? data : [data];
          const insertedData = newData.map((item, index) => ({
            ...item,
            id: item.id || `${table}-${tableData.length + index + 1}`,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString()
          }));
          
          // Return the inserted data
          return Promise.resolve({
            data: insertedData.length === 1 ? insertedData[0] : insertedData,
            error: null,
            select: () => Promise.resolve({
              data: insertedData.length === 1 ? insertedData[0] : insertedData,
              error: null,
              single: () => Promise.resolve({
                data: insertedData.length > 0 ? insertedData[0] : null,
                error: null
              })
            })
          });
        },
        
        // Update data
        update: (updates: any) => {
          return {
            eq: (column: string, value: any) => {
              const index = tableData.findIndex(item => item[column] === value);
              let updatedItem: any = null;
              
              if (index !== -1) {
                updatedItem = {
                  ...tableData[index],
                  ...updates,
                  updated_at: new Date().toISOString()
                };
              }
              
              return Promise.resolve({
                data: updatedItem,
                error: null,
                select: () => Promise.resolve({
                  data: updatedItem,
                  error: null,
                  single: () => Promise.resolve({
                    data: updatedItem,
                    error: null
                  })
                })
              });
            }
          };
        },
        
        // Delete data
        delete: () => {
          return {
            eq: (column: string, value: any) => {
              const index = tableData.findIndex(item => item[column] === value);
              
              return Promise.resolve({
                data: index !== -1 ? tableData[index] : null,
                error: null
              });
            }
          };
        }
      };
    }
  } as unknown as SupabaseClient;
};

// Create a Supabase client with error handling
let supabase: SupabaseClient;

// Check if using placeholder values
const isPlaceholderValue = 
  supabaseUrl === 'https://example.supabase.co' || 
  supabaseUrl === 'your_supabase_url' ||
  supabaseUrl === 'https://your-project.supabase.co' ||
  supabaseAnonKey === 'your_supabase_anon_key' ||
  supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example' ||
  supabaseAnonKey === 'your_supabase_anon_key_here' ||
  !supabaseUrl ||
  !supabaseAnonKey;

try {
  // Validate URL format
  new URL(supabaseUrl);
  
  if (isPlaceholderValue) {
    if (process.env.NODE_ENV === 'production') {
      // In production, use mock client with placeholder values
      console.warn('Using mock Supabase client in production due to placeholder credentials');
      supabase = createMockClient();
    } else {
      // In development, warn about placeholder values
      throw new Error('Using placeholder Supabase credentials in development');
    }
  } else {
    // Use real client with valid credentials
    // Import from the singleton auth instance instead of creating new client
    const { getSupabaseClient } = require('../../auth/supabase');
    supabase = getSupabaseClient();
  }
} catch (error) {
  console.error('Supabase client error:', error);
  supabase = createMockClient();
}

export { supabase };

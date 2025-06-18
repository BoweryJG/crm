// SUIS Error Handler Utility
// Handles common SUIS-related errors gracefully

export interface SUISError {
  code: string;
  message: string;
  details?: any;
}

export const handleSUISError = (error: any, context: string): SUISError | null => {
  console.warn(`SUIS Error in ${context}:`, error);
  
  // Handle common Supabase/PostgreSQL errors
  if (error?.code === 'PGRST204') {
    // No rows returned - this is often not an error
    return null;
  }
  
  if (error?.code === 'PGRST116') {
    // No rows found for single() query - often expected
    return null;
  }
  
  if (error?.code === '42P01') {
    // Table does not exist
    console.error(`SUIS table missing in ${context}. Please run migrations.`);
    return {
      code: 'TABLE_MISSING',
      message: 'SUIS tables not initialized. Please contact support.',
      details: error
    };
  }
  
  if (error?.code === '42501') {
    // Insufficient privileges
    console.error(`SUIS permission denied in ${context}.`);
    return {
      code: 'PERMISSION_DENIED',
      message: 'Access denied. Please check your permissions.',
      details: error
    };
  }
  
  if (error?.message?.includes('JWT')) {
    // Authentication issues
    return {
      code: 'AUTH_ERROR',
      message: 'Authentication error. Please sign in again.',
      details: error
    };
  }
  
  // Return generic error for unhandled cases
  return {
    code: error?.code || 'UNKNOWN_ERROR',
    message: error?.message || 'An unexpected error occurred',
    details: error
  };
};

export const isCriticalError = (error: SUISError | null): boolean => {
  if (!error) return false;
  
  const criticalCodes = ['TABLE_MISSING', 'AUTH_ERROR'];
  return criticalCodes.includes(error.code);
};
import React, { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
}

// Create a mock user
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  user_metadata: {
    first_name: 'Demo',
    last_name: 'User'
  },
  app_metadata: {
    role: 'admin'
  },
  created_at: new Date().toISOString(),
  aud: 'authenticated',
  role: ''
};

// Create a mock session
const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Date.now() + 3600000,
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser
};

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component for authentication
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Always return authenticated state with mock user
  const state: AuthState = {
    session: mockSession,
    user: mockUser,
    loading: false,
  };

  // Mock sign in - always succeeds
  const signIn = async (_email: string, _password: string) => {
    console.log('Mock sign in called');
    return {
      success: true,
      error: null,
    };
  };

  // Mock sign up - always succeeds
  const signUp = async (_email: string, _password: string) => {
    console.log('Mock sign up called');
    return {
      success: true,
      error: null,
    };
  };

  // Mock sign out - doesn't actually do anything
  const signOut = async () => {
    console.log('Mock sign out called');
  };

  // Mock reset password - always succeeds
  const resetPassword = async (_email: string) => {
    console.log('Mock reset password called');
    return {
      success: true,
      error: null,
    };
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a default export for the context
export default AuthContext;

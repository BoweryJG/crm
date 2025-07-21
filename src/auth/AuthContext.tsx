import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, getRedirectUrl } from './supabase';
import type { User, AuthSession, AuthState, AuthProvider as AuthProviderType, SignInOptions } from './types';
import type { Session } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

interface AuthContextType extends AuthState {
  signInWithProvider: (provider: AuthProviderType, options?: SignInOptions) => Promise<void>;
  signInWithGoogle: (intendedPath?: string | null) => Promise<void>;
  signInWithFacebook: (intendedPath?: string | null) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  subscription?: User['subscription'];
  isAdmin: boolean;
  // Aliases for compatibility with auth pages
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  // Convert Supabase session to our AuthSession type
  const mapSession = (session: Session | null): AuthSession | null => {
    if (!session) return null;
    
    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in || 3600,
      expires_at: session.expires_at,
      token_type: session.token_type,
      user: session.user as User,
    };
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        logger.debug('Initial auth check:', session?.user?.email, error);
        
        if (error) throw error;
        
        if (mounted) {
          setState({
            user: session?.user as User | null,
            session: mapSession(session),
            loading: false,
            error: null,
          });
        }
      } catch (error: any) {
        logger.error('Auth initialization error:', error);
        if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
            error: { message: error.message },
          });
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.debug('Auth state changed:', event, session?.user?.email);
        
        // Update stored user email
        if (session?.user?.email) {
          localStorage.setItem('crm_user_email', session.user.email);
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('crm_user_email');
        }
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            user: session?.user as User | null,
            session: mapSession(session),
            loading: false,
            error: null,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithProvider = useCallback(async (
    provider: AuthProviderType, 
    options?: SignInOptions
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Store intended destination for after auth
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('authReturnPath', currentPath);
      
      // Use CRM's own callback URL (like Canvas, MarketData, etc.)
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const redirectUrl = isDevelopment 
        ? 'http://localhost:7003/auth/callback'
        : 'https://crm.repspheres.com/auth/callback';
      
      logger.debug('OAuth sign in - redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectUrl,
          scopes: options?.scopes,
          queryParams: options?.queryParams,
        },
      });
      
      logger.debug('OAuth response:', { data, error });
      
      if (error) throw error;
    } catch (error: any) {
      logger.error('OAuth sign in error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: { message: error.message } 
      }));
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async (intendedPath?: string | null) => {
    if (intendedPath) {
      sessionStorage.setItem('intendedDestination', intendedPath);
    }
    await signInWithProvider('google');
  }, [signInWithProvider]);

  const signInWithFacebook = useCallback(async (intendedPath?: string | null) => {
    if (intendedPath) {
      sessionStorage.setItem('intendedDestination', intendedPath);
    }
    await signInWithProvider('facebook');
  }, [signInWithProvider]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Store user email for Gmail token isolation
      localStorage.setItem('crm_user_email', email);
      
      setState(prev => ({
        ...prev,
        user: data.user as User,
        session: mapSession(data.session),
        loading: false,
        error: null,
      }));
      
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: { message: error.message } 
      }));
      throw error;
    }
  }, []);

  const signUpWithEmail = useCallback(async (
    email: string, 
    password: string, 
    metadata?: any
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        user: data.user as User,
        session: mapSession(data.session),
        loading: false,
        error: null,
      }));
      
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: { message: error.message } 
      }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user email on sign out
      localStorage.removeItem('crm_user_email');
      
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
      
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: { message: error.message } 
      }));
      throw error;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        session: mapSession(data.session),
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: { message: error.message } 
      }));
      throw error;
    }
  }, []);

  // Compatibility methods for auth pages
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await signUpWithEmail(email, password);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl('/login'),
      });
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const value: AuthContextType = {
    ...state,
    signInWithProvider,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshSession,
    subscription: state.user?.subscription,
    isAdmin: state.user?.app_metadata?.roles?.includes('admin') || false,
    // Compatibility methods
    signIn,
    signUp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
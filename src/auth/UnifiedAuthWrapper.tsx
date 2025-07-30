import React, { useContext } from 'react';
import { UnifiedAuthProvider } from '../unified-auth/src/UnifiedAuthContext';
import { AuthContext as UnifiedAuthContext } from '../unified-auth/src/UnifiedAuthContext';
import { supabase, getRedirectUrl } from '../unified-auth/src/unifiedSupabase';
import type { AuthContextType } from '../unified-auth/src/UnifiedAuthContext';

// Re-export the unified auth context
export const AuthContext = UnifiedAuthContext;

// Add CRM-specific extensions if needed
interface CRMAuthContextType extends AuthContextType {
  // Keep these for backward compatibility
  signInWithGoogle: (intendedPath?: string | null) => Promise<void>;
  signInWithFacebook: (intendedPath?: string | null) => Promise<void>;
  // Compatibility methods
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error: Error | null }>;
}

// Export the provider with CRM-specific wrapper
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <UnifiedAuthProvider>{children}</UnifiedAuthProvider>;
};

// Hook with CRM-specific extensions
export const useAuth = (): CRMAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add CRM-specific methods
  const signInWithGoogle = async (intendedPath?: string | null) => {
    if (intendedPath) {
      sessionStorage.setItem('intendedDestination', intendedPath);
    }
    await context.signInWithProvider('google');
  };

  const signInWithFacebook = async (intendedPath?: string | null) => {
    if (intendedPath) {
      sessionStorage.setItem('intendedDestination', intendedPath);
    }
    await context.signInWithProvider('facebook');
  };

  // Compatibility methods
  const signIn = async (email: string, password: string) => {
    try {
      await context.signInWithEmail(email, password);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await context.signUpWithEmail(email, password);
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

  return {
    ...context,
    signInWithGoogle,
    signInWithFacebook,
    signIn,
    signUp,
    resetPassword,
  };
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useRequireAuth } from './hooks';
import { isAdminUser } from '../config/adminUsers';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  allowPublic?: boolean;
  publicComponent?: React.ReactNode;
}

/**
 * Component that requires authentication to render children
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback = <div>Loading...</div>,
  redirectTo = '/login',
  allowPublic = false,
  publicComponent
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Only redirect if auth is required and user is not authenticated
    if (!allowPublic && !loading && !user) {
      // Store the attempted location
      localStorage.setItem('authReturnPath', window.location.pathname + window.location.search);
      console.log('AuthGuard - Storing return path:', window.location.pathname + window.location.search);
      navigate(redirectTo);
    }
  }, [user, loading, allowPublic, redirectTo, navigate]);
  
  if (loading) {
    return <>{fallback}</>;
  }
  
  if (!user) {
    if (allowPublic) {
      // When allowPublic is true, render either publicComponent or children
      return <>{publicComponent || children}</>;
    }
    return null;
  }
  
  return <>{children}</>;
};

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component that only renders for non-authenticated users
 */
export const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user && typeof window !== 'undefined') {
    window.location.href = redirectTo;
    return null;
  }
  
  return <>{children}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  role: string;
  fallback?: React.ReactNode;
}

/**
 * Component that requires specific role to render children
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  role,
  fallback = <div>Unauthorized</div>
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const userRoles = user.app_metadata?.roles || [];
  if (!userRoles.includes(role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

/**
 * Higher-order component for requiring authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
): React.FC<P> {
  return (props: P) => {
    const { user, loading } = useRequireAuth(redirectTo);
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!user) {
      return null;
    }
    
    return <Component {...props} />;
  };
}
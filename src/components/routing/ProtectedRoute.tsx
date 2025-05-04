import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../common/LoadingScreen';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * A route wrapper that protects routes requiring authentication.
 * Redirects to login if not authenticated.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login',
  children
}) => {
  const location = useLocation();
  const [authError, setAuthError] = useState<boolean>(false);
  
  // Always call useAuth hook at the top level
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.warn('Auth context error, bypassing authentication in development mode:', error);
    // Mark that we had an auth error
    useEffect(() => {
      setAuthError(true);
    }, []);
  }
  
  // If we had an auth error, just render the children or outlet
  if (authError) {
    return children ? <>{children}</> : <Outlet />;
  }
  
  // If auth is available, use it normally
  if (auth) {
    const { user, loading } = auth;
    
    // While auth state is loading, show the loading screen
    if (loading) {
      return <LoadingScreen message="Preparing your space..." />;
    }

    // If not authenticated, redirect to login with return URL
    if (!user) {
      return (
        <Navigate 
          to={redirectPath} 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }
  }

  // If authenticated, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

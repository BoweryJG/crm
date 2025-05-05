import React from 'react';
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
  const { user, loading } = useAuth();
  
  // While auth state is loading, show the loading screen
  if (loading) {
    return <LoadingScreen message="Preparing your space..." />;
  }

  // If not authenticated, redirect to login with return URL
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return (
      <Navigate 
        to={redirectPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If authenticated, render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

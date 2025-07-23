import React, { useEffect, useState } from 'react';
import { simpleAuth } from '../../utils/simpleAuth';
import { Box, CircularProgress } from '@mui/material';

interface SimpleAuthGuardProps {
  children: React.ReactNode;
  allowPublic?: boolean;
  publicComponent?: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Simple Auth Guard - Prevents redirect loops
 * Checks auth without causing external redirects
 */
export const SimpleAuthGuard: React.FC<SimpleAuthGuardProps> = ({
  children,
  allowPublic = true,
  publicComponent,
  fallback = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  )
}) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Add delay to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loggedIn = await simpleAuth.isLoggedIn();
      setIsAuthenticated(loggedIn);
      setChecking(false);
      
      // Debug
      console.log('SimpleAuthGuard: Auth check complete', { loggedIn, allowPublic });
    };

    checkAuth();
  }, [allowPublic]);

  if (checking) {
    return <>{fallback}</>;
  }

  // If not authenticated and public access is allowed, show public component
  if (!isAuthenticated && allowPublic && publicComponent) {
    return <>{publicComponent}</>;
  }

  // If not authenticated and public access is not allowed, show nothing
  // (Let the app handle login redirect internally)
  if (!isAuthenticated && !allowPublic) {
    return null;
  }

  // Authenticated or public access allowed
  return <>{children}</>;
};

export default SimpleAuthGuard;
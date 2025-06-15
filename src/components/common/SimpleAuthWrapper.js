import React, { useEffect, useState } from 'react';
import { simpleAuth } from '../../utils/simpleAuth';
import { CircularProgress, Box } from '@mui/material';

/**
 * Simple Auth Wrapper - Wrap your app with this to require authentication
 * Usage: <SimpleAuthWrapper><YourApp /></SimpleAuthWrapper>
 */
export default function SimpleAuthWrapper({ children, requireAuth = true }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit to let auth cookies/storage settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isLoggedIn = await simpleAuth.isLoggedIn();
      
      if (requireAuth && !isLoggedIn) {
        // Not logged in, redirect to login
        simpleAuth.requireAuth();
      } else {
        // Either logged in or auth not required
        setAuthenticated(true);
      }
      
      setChecking(false);
    };

    checkAuth();
  }, [requireAuth]);

  // Show loading while checking auth
  if (checking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a'
        }}
      >
        <CircularProgress sx={{ color: '#00ffc6' }} />
      </Box>
    );
  }

  // Show children if authenticated or auth not required
  if (authenticated || !requireAuth) {
    return <>{children}</>;
  }

  // Redirecting to login...
  return null;
}
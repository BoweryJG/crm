import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Store the attempted location
        localStorage.setItem('authReturnPath', location.pathname + location.search);
        console.log('AuthGuard - Storing return path:', location.pathname + location.search);
        navigate('/login');
      }
    }
  }, [user, loading, requireAuth, location, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};
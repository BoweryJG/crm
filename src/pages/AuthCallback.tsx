import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { supabase } from '../auth/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the current URL for debugging
        console.log('Auth callback - Current URL:', window.location.href);
        
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
          return;
        }
        
        if (session) {
          console.log('Auth callback - Session found:', session.user.email);
          
          // Get the return path from sessionStorage (more secure for redirects)
          const returnPath = sessionStorage.getItem('authReturnPath') || '/';
          sessionStorage.removeItem('authReturnPath'); // Clean up
          
          console.log('Auth callback - Returning to:', returnPath);
          
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            navigate(returnPath, { replace: true });
          }, 100);
        } else {
          console.log('Auth callback - No session found');
          navigate('/login');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
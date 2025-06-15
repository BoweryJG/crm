import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Divider,
  useTheme 
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';

const SimpleLogin: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { signInWithProvider, user } = useAuth();
  const navigate = useNavigate();
  
  // Check if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithProvider('google');
      // OAuth will redirect to callback URL
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: themeMode === 'space' 
          ? 'radial-gradient(circle at 50% 50%, #1a1f35 0%, #0a0e1c 100%)' 
          : 'radial-gradient(circle at 50% 50%, #f5f7fa 0%, #e8ecf1 100%)',
        p: 3
      }}
    >
      <Paper
        elevation={themeMode === 'space' ? 0 : 3}
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 3,
          backgroundColor: themeMode === 'space' 
            ? 'rgba(22, 28, 46, 0.7)' 
            : theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          border: themeMode === 'space' 
            ? '1px solid rgba(255, 255, 255, 0.08)' 
            : 'none',
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={600} gutterBottom color="primary">
            RepSpheres CRM
          </Typography>
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Welcome
          </Typography>
          <Typography color="text.secondary">
            Sign in to access your CRM
          </Typography>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{
            py: 2,
            borderRadius: 2,
            mb: 2,
            backgroundColor: '#4285F4',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#357ae8',
            }
          }}
        >
          Sign in with Google
        </Button>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Independent app login
          </Typography>
        </Divider>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Each RepSpheres app requires separate sign-in for security.
          Use the same Google account across all apps.
        </Typography>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Copyright © RepSpheres {new Date().getFullYear()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SimpleLogin;
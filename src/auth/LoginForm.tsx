import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Alert,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from './AuthContext';

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ open, onClose, onSuccess }) => {
  const { signInWithProvider, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      // Store current location for return after auth
      sessionStorage.setItem('authReturnPath', window.location.pathname + window.location.search);
      
      await signInWithProvider('google', {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      // Don't call onSuccess here - let the OAuth callback handle navigation
    } catch (err) {
      console.error('Login failed:', err);
      setIsSigningIn(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSigningIn(true);
    try {
      // Store current location for return after auth
      sessionStorage.setItem('authReturnPath', window.location.pathname + window.location.search);
      
      await signInWithProvider('facebook', {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      // Don't call onSuccess here - let the OAuth callback handle navigation
    } catch (err) {
      console.error('Login failed:', err);
      setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Sign In to RepSpheres CRM</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Button
            onClick={handleGoogleLogin}
            disabled={loading || isSigningIn}
            variant="outlined"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              borderColor: '#dadce0',
              color: '#3c4043',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#dadce0'
              }
            }}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
            }
          >
            {loading || isSigningIn ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Button
            onClick={handleFacebookLogin}
            disabled={loading || isSigningIn}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              backgroundColor: '#1877f2',
              '&:hover': {
                backgroundColor: '#166fe5'
              }
            }}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            }
          >
            {loading || isSigningIn ? 'Signing in...' : 'Continue with Facebook'}
          </Button>
        </Box>

        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center', 
            display: 'block',
            mt: 3,
            color: 'text.secondary'
          }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
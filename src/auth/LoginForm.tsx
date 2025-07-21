import React, { useState } from 'react';
import {
  Dialog,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Fade,
  Backdrop,
  useTheme
} from '@mui/material';
import { 
  Close as CloseIcon,
  AutoAwesome,
  Google,
  Facebook,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from './AuthContext';
import { keyframes } from '@mui/system';

// Animations matching GlobalAuthModal
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 255, 198, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 198, 0.8), 0 0 30px rgba(0, 255, 198, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 255, 198, 0.5); }
`;

interface LoginFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
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
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(8px)',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          maxWidth: 440,
          width: '90%',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid',
          borderColor: 'rgba(0, 255, 198, 0.3)',
          borderRadius: 4,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(45deg, #00ffc6, #00a693, #00ffc6)',
            borderRadius: 4,
            opacity: 0.3,
            zIndex: -1,
            animation: `${glow} 3s ease-in-out infinite`,
          }
        }}
      >
        {/* Decorative orb */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 255, 198, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />

        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1,
            '&:hover': {
              color: '#00ffc6',
              backgroundColor: 'rgba(0, 255, 198, 0.1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Content */}
        <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <AutoAwesome sx={{ color: '#00ffc6', fontSize: 28 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #fff 0%, #00ffc6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shimmer} 3s linear infinite`,
                backgroundSize: '200% 200%',
              }}
            >
              RepSpheres
            </Typography>
          </Stack>

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 3
            }}
          >
            Access your intelligent sales universe
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#ff6b6b',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b'
                }
              }}
            >
              {error.message}
            </Alert>
          )}

          <Stack spacing={2}>
            {/* Google */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleGoogleLogin}
              disabled={loading || isSigningIn}
              startIcon={loading || isSigningIn ? <CircularProgress size={20} /> : <Google />}
              sx={{
                py: 1.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: '#00ffc6',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 255, 198, 0.3)',
                }
              }}
            >
              Continue with Google
            </Button>

            {/* Facebook */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleFacebookLogin}
              disabled={loading || isSigningIn}
              startIcon={loading || isSigningIn ? <CircularProgress size={20} /> : <Facebook />}
              sx={{
                py: 1.5,
                backgroundColor: 'rgba(24, 119, 242, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(24, 119, 242, 0.3)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(24, 119, 242, 0.3)',
                  borderColor: '#1877F2',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(24, 119, 242, 0.3)',
                }
              }}
            >
              Continue with Facebook
            </Button>
          </Stack>

          <Typography 
            variant="caption" 
            sx={{ 
              textAlign: 'center', 
              display: 'block',
              mt: 3,
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};
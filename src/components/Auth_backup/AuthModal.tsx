import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, mode }) => {
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const { signInWithProvider } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmail = () => {
    onClose();
    navigate(mode === 'login' ? '/login' : '/signup');
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithProvider('google');
      // The OAuth flow will redirect, so we don't need to close the modal
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithProvider('facebook');
      // The OAuth flow will redirect, so we don't need to close the modal
    } catch (err: any) {
      console.error('Facebook sign-in error:', err);
      setError(err.message || 'Failed to sign in with Facebook');
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 3,
          backgroundColor: themeMode === 'space'
            ? 'rgba(22, 28, 46, 0.7)'
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          border: themeMode === 'space'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogle}
            disabled={loading}
          >
            {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
            sx={{ backgroundColor: '#4267B2' }}
            onClick={handleFacebook}
            disabled={loading}
          >
            {mode === 'login' ? 'Sign in with Facebook' : 'Sign up with Facebook'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            onClick={handleEmail}
            disabled={loading}
          >
            {mode === 'login' ? 'Sign in with Email' : 'Sign up with Email'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

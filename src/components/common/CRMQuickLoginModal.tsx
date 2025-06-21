import React, { useState } from 'react';
import { useAuth } from '../../auth';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Google,
  GitHub,
} from '@mui/icons-material';

interface CRMQuickLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CRMQuickLoginModal: React.FC<CRMQuickLoginModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { signInWithEmail, signInWithProvider, loading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError(null);

    try {
      await signInWithEmail(email, password);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLocalLoading(true);
    setLocalError(null);

    try {
      // Store current location for return after auth
      sessionStorage.setItem('authReturnPath', window.location.pathname + window.location.search);
      
      await signInWithProvider(provider, {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;
  const displayError = error?.message || localError;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            RepSpheres CRM
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          disabled={isLoading}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access live CRM data, advanced analytics, and premium features
        </Typography>

        {displayError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {displayError}
          </Alert>
        )}

        {/* Social Auth Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            sx={{
              borderColor: 'rgba(0,0,0,0.12)',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHub />}
            onClick={() => handleSocialAuth('github')}
            disabled={isLoading}
            sx={{
              borderColor: 'rgba(0,0,0,0.12)',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            }}
          >
            GitHub
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            or continue with email
          </Typography>
        </Divider>

        {/* Email Form */}
        <Box component="form" onSubmit={handleEmailAuth}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || !email || !password}
            sx={{
              py: 1.5,
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
            sx={{ 
              color: 'primary.main',
              textTransform: 'none',
              fontSize: '0.9rem'
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </Box>

        {/* CRM Benefits */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1 }}>
          <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
            🚀 Unlock Full CRM Power:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            • Live contact and practice data<br/>
            • Advanced call analytics and linguistics<br/>
            • AI-powered market intelligence<br/>
            • Premium research tools and insights
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
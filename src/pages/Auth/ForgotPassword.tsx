import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme 
} from '@mui/material';
import { 
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, error } = await resetPassword(email);
      
      if (success) {
        setSuccess(true);
      } else {
        setError(error?.message || 'Failed to send password reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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
            RepSpheres
          </Typography>
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Reset Password
          </Typography>
          <Typography color="text.secondary">
            Enter your email address and we'll send you instructions to reset your password.
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success ? (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              Password reset instructions sent! Please check your email.
            </Alert>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.5,
                borderRadius: 2,
                mb: 2,
                background: themeMode === 'space' 
                  ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)' 
                  : undefined,
                '&:hover': {
                  background: themeMode === 'space' 
                    ? 'linear-gradient(45deg, #7C53C3 0%, #4AD3D8 100%)' 
                    : undefined,
                }
              }}
            >
              Return to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                mb: 3,
                background: themeMode === 'space' 
                  ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)' 
                  : undefined,
                '&:hover': {
                  background: themeMode === 'space' 
                    ? 'linear-gradient(45deg, #7C53C3 0%, #4AD3D8 100%)' 
                    : undefined,
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Instructions'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                color="primary"
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  gap: 0.5 
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Login
              </Link>
            </Box>
          </Box>
        )}
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Copyright © RepSpheres {new Date().getFullYear()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;

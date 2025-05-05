import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Link, 
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  LockOutlined as LockIcon 
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';

const Login: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, allow any login with valid format
      if (email.includes('@') && password.length >= 6) {
        const { success, error } = await signIn(email, password);
        
        if (success) {
          // Add a small delay to simulate network request
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          setError(error?.message || 'Invalid email or password');
        }
      } else {
        setError('Please enter a valid email and password (min 6 characters)');
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
            Sign In
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Please sign in to your account.
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
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
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2" 
              color="primary"
            >
              Forgot password?
            </Link>
            
            <Link 
              component={RouterLink} 
              to="/signup" 
              variant="body2"
              color="primary"
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Copyright © RepSpheres {new Date().getFullYear()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

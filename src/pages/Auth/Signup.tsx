import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  LockOutlined as LockIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';

const Signup: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '555-123-4567',
    specialization: 'dental',
    role: 'sales_rep' // Default role
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSignupMessage, setAutoSignupMessage] = useState<string | null>(null);
  
  // Auto-signup effect
  useEffect(() => {
    setAutoSignupMessage("Auto-signup enabled. Redirecting to dashboard...");
    setLoading(true);
    
    // Simulate signup delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Just redirect to dashboard immediately
    navigate('/');
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
          maxWidth: 600,
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
            Create Account
          </Typography>
          <Typography color="text.secondary">
            Join the most advanced CRM for medical sales representatives
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              variant="outlined"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              label="Last Name"
              name="lastName"
              variant="outlined"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
          
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
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
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
          
          <TextField
            label="Phone Number"
            name="phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
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
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
              <InputLabel id="specialization-label">Specialization</InputLabel>
              <Select
                labelId="specialization-label"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                label="Specialization"
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="dental">Dental</MenuItem>
                <MenuItem value="aesthetic">Aesthetic</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              component={RouterLink} 
              to="/login" 
              variant="body2"
              color="primary"
            >
              Already have an account? Sign In
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

export default Signup;

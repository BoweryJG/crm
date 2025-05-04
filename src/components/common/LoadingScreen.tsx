import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

/**
 * A loading screen component that displays a spinner and optional message
 * This version does not depend on ThemeContext to avoid circular dependencies
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  const theme = useTheme();
  
  // Use a default theme mode
  const themeMode = 'corporate';
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
        }}
      >
        {/* Outer spinning circle */}
        <CircularProgress 
          size={120}
          thickness={2}
          sx={{ 
            color: theme.palette.primary.main,
            position: 'absolute',
          }}
        />
        
        {/* Inner spinning circle */}
        <CircularProgress 
          size={90}
          thickness={3}
          sx={{ 
            color: theme.palette.secondary.main,
            position: 'absolute',
            animationDuration: '1.5s',
          }}
        />
        
        {/* Static logo circle */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            R
          </Typography>
        </Box>
      </Box>
      
      <Typography 
        variant="h6" 
        component="div"
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          mb: 1,
        }}
      >
        RepSpheres
      </Typography>
      
      <Typography 
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;

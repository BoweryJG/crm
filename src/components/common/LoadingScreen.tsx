import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface LoadingScreenProps {
  message?: string;
}

// Create a separate component for the themed content
const ThemedLoadingContent: React.FC<LoadingScreenProps & { themeMode: string }> = ({ 
  message = 'Loading...', 
  themeMode 
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: themeMode === 'space' 
          ? 'rgba(10, 14, 28, 0.95)' 
          : theme.palette.background.default,
        backgroundImage: themeMode === 'space' 
          ? 'radial-gradient(circle at 50% 50%, rgba(26, 31, 53, 0.3) 0%, rgba(10, 14, 28, 0.5) 100%)' 
          : 'none',
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
            color: themeMode === 'space' ? '#5CE1E6' : theme.palette.primary.main,
            position: 'absolute',
          }}
        />
        
        {/* Inner spinning circle */}
        <CircularProgress 
          size={90}
          thickness={3}
          sx={{ 
            color: themeMode === 'space' ? '#8860D0' : theme.palette.secondary.main,
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
            backgroundColor: themeMode === 'space' 
              ? 'rgba(22, 28, 46, 0.9)' 
              : theme.palette.background.paper,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: themeMode === 'space'
              ? '0 0 20px rgba(92, 225, 230, 0.3)'
              : '0 0 10px rgba(0, 0, 0, 0.1)',
            border: themeMode === 'space'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : 'none',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: themeMode === 'space'
                ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)'
                : undefined,
              WebkitBackgroundClip: themeMode === 'space' ? 'text' : undefined,
              WebkitTextFillColor: themeMode === 'space' ? 'transparent' : undefined,
              color: themeMode === 'space' ? undefined : theme.palette.primary.main,
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
          color: themeMode === 'space' ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary,
          mb: 1,
        }}
      >
        RepSpheres
      </Typography>
      
      <Typography 
        variant="body1"
        sx={{
          color: themeMode === 'space' ? 'rgba(255, 255, 255, 0.6)' : theme.palette.text.secondary,
        }}
      >
        {message}
      </Typography>

      {themeMode === 'space' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}
          >
            Elevating medical sales to new dimensions
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Main component that decides whether to use ThemeContext or fallback
const LoadingScreen: React.FC<LoadingScreenProps> = (props) => {
  // Default theme mode
  const defaultThemeMode = 'corporate';
  
  // Try to import ThemeContext at the module level
  let ThemeContextModule;
  try {
    ThemeContextModule = require('../../themes/ThemeContext');
  } catch (error) {
    console.warn('ThemeContext module not available, using default theme');
  }
  
  // If ThemeContext is available, use ThemedLoadingScreen
  if (ThemeContextModule && typeof ThemeContextModule.useThemeContext === 'function') {
    return <ThemedLoadingScreenWithContext {...props} ThemeContextModule={ThemeContextModule} />;
  }
  
  // Fallback to default theme
  return <ThemedLoadingContent {...props} themeMode={defaultThemeMode} />;
};

// Separate component that uses ThemeContext
const ThemedLoadingScreenWithContext: React.FC<LoadingScreenProps & { ThemeContextModule: any }> = ({ 
  ThemeContextModule,
  ...props 
}) => {
  try {
    const { useThemeContext } = ThemeContextModule;
    const themeContext = useThemeContext();
    const themeMode = themeContext?.themeMode || 'corporate';
    
    return <ThemedLoadingContent {...props} themeMode={themeMode} />;
  } catch (error) {
    console.warn('Error using ThemeContext, falling back to default theme');
    return <ThemedLoadingContent {...props} themeMode="corporate" />;
  }
};

export default LoadingScreen;

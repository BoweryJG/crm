// SUIS Theme Configuration - Unified styling for all SUIS components
import { createTheme, Theme } from '@mui/material/styles';

export const suisColors = {
  primary: {
    main: '#3B82F6', // Blue
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#8B5CF6', // Purple
    light: '#A78BFA',
    dark: '#7C3AED',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669'
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706'
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626'
  },
  info: {
    main: '#06B6D4',
    light: '#22D3EE',
    dark: '#0891B2'
  },
  background: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glassmorphism: 'rgba(255, 255, 255, 0.1)'
  }
};

export const suisComponentStyles = {
  card: {
    borderRadius: 12,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }
  },
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 12
  },
  button: {
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 20px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  },
  input: {
    borderRadius: 8,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      transition: 'all 0.2s ease',
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: suisColors.primary.main
        }
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: suisColors.primary.main,
          borderWidth: 2
        }
      }
    }
  },
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(156, 163, 175, 0.5)',
      borderRadius: 4,
      '&:hover': {
        background: 'rgba(156, 163, 175, 0.8)'
      }
    }
  }
};

export const suisTheme = (baseTheme: Theme) => createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: suisColors.primary,
    secondary: suisColors.secondary,
    success: suisColors.success,
    warning: suisColors.warning,
    error: suisColors.error,
    info: suisColors.info
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: suisComponentStyles.card
      }
    },
    MuiButton: {
      styleOverrides: {
        root: suisComponentStyles.button,
        contained: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: suisComponentStyles.input
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6
        }
      }
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    ...baseTheme.typography,
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  }
});

// Animation utilities
export const suisAnimations = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out',
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' }
    }
  },
  slideIn: {
    animation: 'slideIn 0.3s ease-in-out',
    '@keyframes slideIn': {
      '0%': { opacity: 0, transform: 'translateX(-20px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' }
    }
  },
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.7 },
      '100%': { opacity: 1 }
    }
  }
};

// Responsive utilities
export const suisResponsive = {
  mobileOnly: {
    '@media (min-width: 768px)': {
      display: 'none'
    }
  },
  desktopOnly: {
    '@media (max-width: 767px)': {
      display: 'none'
    }
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: {
      xs: '16px',
      sm: '24px',
      md: '32px',
      lg: '40px'
    }
  }
};
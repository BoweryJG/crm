import { createTheme } from '@mui/material/styles';

const spaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8860D0', // Vibrant purple
      light: '#A084DC',
      dark: '#5F43A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5CE1E6', // Bright cyan
      light: '#84E8EC',
      dark: '#38B6BA',
      contrastText: '#000000',
    },
    error: {
      main: '#FF5252', // Bright red
      light: '#FF7B7B',
      dark: '#C50E29',
    },
    warning: {
      main: '#FFD700', // Gold
      light: '#FFE74C',
      dark: '#C8A800',
    },
    info: {
      main: '#3D9DF2', // Blue
      light: '#64B5F6',
      dark: '#2175D9',
    },
    success: {
      main: '#00E676', // Bright green
      light: '#69F0AE',
      dark: '#00C853',
    },
    background: {
      default: '#0A0E17', // Deep space background
      paper: '#161B2C', // Slightly lighter than background
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(22, 27, 44, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: '0 0 10px rgba(138, 96, 208, 0.4)',
          '&:hover': {
            boxShadow: '0 0 15px rgba(138, 96, 208, 0.6)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #7B51D3 0%, #9D71E8 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #6A40C2 0%, #8C60D7 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #38B6BA 0%, #5CE1E6 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #27A5A9 0%, #4BD0D5 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(22, 27, 44, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
        },
        elevation4: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
        head: {
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(22, 27, 44, 0.9)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
          padding: '8px 12px',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#5F43A3 #161B2C',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#161B2C',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#5F43A3',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#7B51D3',
          },
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1B2137 0%, #0A0E17 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
});

export default spaceTheme;

import { createTheme } from '@mui/material/styles';

// Luxury Cartier + Airplane Gauges Theme
const luxuryTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C9B037', // Cartier Gold
      light: '#D4C058',
      dark: '#B8A024',
      contrastText: '#1A1A1A',
    },
    secondary: {
      main: '#E8E8E8', // Platinum Silver
      light: '#F5F5F5',
      dark: '#CCCCCC',
      contrastText: '#1A1A1A',
    },
    error: {
      main: '#FF3030', // Aviation Red
      light: '#FF6B6B',
      dark: '#CC0000',
    },
    warning: {
      main: '#FFB000', // Aviation Amber
      light: '#FFC947',
      dark: '#E69500',
    },
    info: {
      main: '#00B4D8', // Aviation Blue
      light: '#48CAE4',
      dark: '#0077B6',
    },
    success: {
      main: '#06D6A0', // Aviation Green
      light: '#40E0D0',
      dark: '#04A777',
    },
    background: {
      default: '#0F0F0F', // Deep Carbon Black
      paper: '#1A1A1A', // Carbon Fiber
    },
    text: {
      primary: '#E8E8E8', // Platinum
      secondary: '#C9B037', // Gold accent
      disabled: 'rgba(232, 232, 232, 0.5)',
    },
    divider: 'rgba(201, 176, 55, 0.2)', // Gold dividers
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto Mono", "Monaco", monospace', // Aviation-style font
    h1: {
      fontWeight: 300,
      fontSize: '3rem',
      letterSpacing: '0.05em',
      fontFamily: '"Playfair Display", serif', // Luxury serif for headlines
    },
    h2: {
      fontWeight: 300,
      fontSize: '2.5rem',
      letterSpacing: '0.04em',
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontWeight: 400,
      fontSize: '2rem',
      letterSpacing: '0.03em',
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.75rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.01em',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.1em',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 300,
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 2, // Sharp, precision edges
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(circle at 20% 80%, rgba(201, 176, 55, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(232, 232, 232, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)
          `,
          backgroundAttachment: 'fixed',
          scrollbarWidth: 'thin',
          scrollbarColor: '#C9B037 #1A1A1A',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1A1A1A',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#C9B037',
            borderRadius: '4px',
            border: '2px solid #1A1A1A',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#D4C058',
          },
        },
        '@keyframes luxuryPulse': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(201, 176, 55, 0.7)',
          },
          '70%': {
            boxShadow: '0 0 0 10px rgba(201, 176, 55, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(201, 176, 55, 0)',
          },
        },
        '@keyframes aviationGlow': {
          '0%, 100%': {
            textShadow: '0 0 5px rgba(201, 176, 55, 0.5)',
          },
          '50%': {
            textShadow: '0 0 20px rgba(201, 176, 55, 0.8), 0 0 30px rgba(201, 176, 55, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201, 176, 55, 0.3)',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(201, 176, 55, 0.8), transparent)',
          },
          '&:hover': {
            border: '1px solid rgba(201, 176, 55, 0.6)',
            boxShadow: `
              0 4px 20px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(201, 176, 55, 0.2)
            `,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.1em',
          padding: '12px 32px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        containedPrimary: {
          background: `
            linear-gradient(45deg, #C9B037 0%, #D4C058 50%, #C9B037 100%)
          `,
          border: '1px solid rgba(201, 176, 55, 0.5)',
          color: '#1A1A1A',
          fontWeight: 700,
          '&:hover': {
            background: `
              linear-gradient(45deg, #D4C058 0%, #E5D169 50%, #D4C058 100%)
            `,
            boxShadow: `
              0 0 20px rgba(201, 176, 55, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
        containedSecondary: {
          background: `
            linear-gradient(45deg, #E8E8E8 0%, #F5F5F5 50%, #E8E8E8 100%)
          `,
          border: '1px solid rgba(232, 232, 232, 0.3)',
          color: '#1A1A1A',
          '&:hover': {
            background: `
              linear-gradient(45deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)
            `,
            boxShadow: `
              0 0 20px rgba(232, 232, 232, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
          },
        },
        outlined: {
          border: '2px solid rgba(201, 176, 55, 0.5)',
          color: '#C9B037',
          '&:hover': {
            border: '2px solid rgba(201, 176, 55, 0.8)',
            backgroundColor: 'rgba(201, 176, 55, 0.1)',
            boxShadow: '0 0 15px rgba(201, 176, 55, 0.3)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          border: '1px solid rgba(201, 176, 55, 0.2)',
          backgroundColor: 'rgba(26, 26, 26, 0.5)',
          '&:hover': {
            backgroundColor: 'rgba(201, 176, 55, 0.1)',
            border: '1px solid rgba(201, 176, 55, 0.4)',
            boxShadow: '0 0 10px rgba(201, 176, 55, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backgroundImage: 'none',
          border: '1px solid rgba(201, 176, 55, 0.2)',
        },
        elevation1: {
          boxShadow: `
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(201, 176, 55, 0.1)
          `,
        },
        elevation2: {
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(201, 176, 55, 0.15)
          `,
        },
        elevation3: {
          boxShadow: `
            0 6px 16px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(201, 176, 55, 0.2)
          `,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(232, 232, 232, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(201, 176, 55, 0.2)',
        },
        bar: {
          background: 'linear-gradient(90deg, #C9B037 0%, #D4C058 50%, #C9B037 100%)',
          borderRadius: '3px',
          boxShadow: '0 0 10px rgba(201, 176, 55, 0.5)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#C9B037',
          filter: 'drop-shadow(0 0 5px rgba(201, 176, 55, 0.5))',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          border: '1px solid rgba(201, 176, 55, 0.3)',
          color: '#E8E8E8',
          fontWeight: 500,
          letterSpacing: '0.05em',
          '&:hover': {
            backgroundColor: 'rgba(201, 176, 55, 0.1)',
            border: '1px solid rgba(201, 176, 55, 0.5)',
          },
        },
        filled: {
          backgroundColor: 'rgba(201, 176, 55, 0.2)',
          color: '#C9B037',
          border: '1px solid rgba(201, 176, 55, 0.5)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(26, 26, 26, 0.5)',
            border: '1px solid rgba(201, 176, 55, 0.3)',
            borderRadius: '6px',
            '&:hover': {
              border: '1px solid rgba(201, 176, 55, 0.5)',
            },
            '&.Mui-focused': {
              border: '2px solid rgba(201, 176, 55, 0.8)',
              boxShadow: '0 0 10px rgba(201, 176, 55, 0.3)',
            },
            '& fieldset': {
              border: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#C9B037',
            '&.Mui-focused': {
              color: '#D4C058',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(201, 176, 55, 0.3)',
        },
        indicator: {
          backgroundColor: '#C9B037',
          height: '3px',
          borderRadius: '2px 2px 0 0',
          boxShadow: '0 0 10px rgba(201, 176, 55, 0.5)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'rgba(232, 232, 232, 0.7)',
          '&.Mui-selected': {
            color: '#C9B037',
            textShadow: '0 0 5px rgba(201, 176, 55, 0.5)',
          },
          '&:hover': {
            color: '#E8E8E8',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(201, 176, 55, 0.2)',
          color: '#E8E8E8',
        },
        head: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          color: '#C9B037',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          borderBottom: '2px solid rgba(201, 176, 55, 0.5)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          border: '1px solid rgba(201, 176, 55, 0.5)',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          color: '#E8E8E8',
          fontSize: '0.75rem',
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
        },
        arrow: {
          color: 'rgba(26, 26, 26, 0.95)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 176, 55, 0.3)',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(201, 176, 55, 0.2)
          `,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 176, 55, 0.3)',
          borderLeft: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderBottom: '1px solid rgba(201, 176, 55, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

export default luxuryTheme;
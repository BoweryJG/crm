import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// REPSPHERES "Gallery of Dominance" Theme
// Inspired by minimalist sculpture and luxury command centers
const sculptureTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D4AF37', // Cold gold - like brass accents in luxury sculptures
      light: '#E5C458',
      dark: '#A38929',
      contrastText: '#0D0D0D',
    },
    secondary: {
      main: '#C0C0C0', // Polished steel
      light: '#ECECEC',
      dark: '#8F8F8F',
      contrastText: '#0D0D0D',
    },
    background: {
      default: '#0D0D0D', // Jet black - gallery after hours
      paper: '#1F1F1F', // Carbon fiber / obsidian glass
    },
    text: {
      primary: '#ECECEC', // Etched platinum
      secondary: '#C0C0C0', // Brushed steel
      disabled: '#5F5F5F',
    },
    error: {
      main: '#8B0000', // Deep blood red - surgical precision warnings
      light: '#B71C1C',
      dark: '#5D0000',
    },
    warning: {
      main: '#D4AF37', // Matches primary for consistency
      light: '#FFD54F',
      dark: '#F57C00',
    },
    info: {
      main: '#2C2C2C', // Graphite
      light: '#424242',
      dark: '#1A1A1A',
    },
    success: {
      main: '#1F1F1F', // Subtle success - confidence doesn't shout
      light: '#2C2C2C',
      dark: '#0D0D0D',
    },
    divider: alpha('#D4AF37', 0.08), // Subtle gold lines
    action: {
      active: '#D4AF37',
      hover: alpha('#D4AF37', 0.08),
      selected: alpha('#D4AF37', 0.12),
      disabled: alpha('#C0C0C0', 0.26),
      disabledBackground: alpha('#C0C0C0', 0.12),
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Headers - tall, engraved serif feel (using weight and spacing to simulate)
    h1: {
      fontSize: '3.5rem',
      fontWeight: 100,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 200,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 300,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0.08em',
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.05em',
      lineHeight: 1.6,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      lineHeight: 1.7,
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.03em',
      lineHeight: 1.8,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.03em',
      lineHeight: 1.7,
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    caption: {
      fontSize: '0.75rem',
      letterSpacing: '0.05em',
      fontWeight: 500,
    },
    overline: {
      fontSize: '0.75rem',
      letterSpacing: '0.2em',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 0, // Sharp edges - like cut stone
  },
  shadows: [
    'none',
    // Custom shadows that feel like gallery lighting
    '0px 4px 20px 0px rgba(13, 13, 13, 0.9)',
    '0px 6px 30px 0px rgba(13, 13, 13, 0.9)',
    '0px 8px 40px 0px rgba(13, 13, 13, 0.9)',
    '0px 10px 50px 0px rgba(13, 13, 13, 0.9)',
    '0px 12px 60px 0px rgba(13, 13, 13, 0.9)',
    '0px 14px 70px 0px rgba(13, 13, 13, 0.9)',
    '0px 16px 80px 0px rgba(13, 13, 13, 0.9)',
    '0px 18px 90px 0px rgba(13, 13, 13, 0.9)',
    '0px 20px 100px 0px rgba(13, 13, 13, 0.9)',
    '0px 22px 110px 0px rgba(13, 13, 13, 0.9)',
    '0px 24px 120px 0px rgba(13, 13, 13, 0.9)',
    '0px 26px 130px 0px rgba(13, 13, 13, 0.9)',
    '0px 28px 140px 0px rgba(13, 13, 13, 0.9)',
    '0px 30px 150px 0px rgba(13, 13, 13, 0.9)',
    '0px 32px 160px 0px rgba(13, 13, 13, 0.9)',
    '0px 34px 170px 0px rgba(13, 13, 13, 0.9)',
    '0px 36px 180px 0px rgba(13, 13, 13, 0.9)',
    '0px 38px 190px 0px rgba(13, 13, 13, 0.9)',
    '0px 40px 200px 0px rgba(13, 13, 13, 0.9)',
    '0px 42px 210px 0px rgba(13, 13, 13, 0.9)',
    '0px 44px 220px 0px rgba(13, 13, 13, 0.9)',
    '0px 46px 230px 0px rgba(13, 13, 13, 0.9)',
    '0px 48px 240px 0px rgba(13, 13, 13, 0.9)',
    '0px 50px 250px 0px rgba(212, 175, 55, 0.2)', // Gold accent shadow at highest elevation
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#2C2C2C #0D0D0D',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '12px',
            backgroundColor: '#0D0D0D',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 0,
            backgroundColor: '#2C2C2C',
            border: '2px solid #0D0D0D',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#D4AF37',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 8,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1F1F1F',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            opacity: 0.1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            opacity: 0.1,
          },
        },
        elevation8: {
          boxShadow: '0px 8px 40px 0px rgba(13, 13, 13, 0.9)',
        },
        elevation16: {
          boxShadow: '0px 16px 80px 0px rgba(13, 13, 13, 0.9)',
        },
        elevation24: {
          boxShadow: '0px 24px 120px 0px rgba(13, 13, 13, 0.9)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F1F1F',
          borderColor: alpha('#D4AF37', 0.08),
          borderWidth: 1,
          borderStyle: 'solid',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 20px 100px 0px rgba(212, 175, 55, 0.1)',
            borderColor: alpha('#D4AF37', 0.2),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 32px',
          fontSize: '0.875rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
            transition: 'left 0.6s ease',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 8px 40px 0px rgba(212, 175, 55, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha('#D4AF37', 0.08),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: alpha('#D4AF37', 0.08),
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderColor: alpha('#D4AF37', 0.2),
          backgroundColor: alpha('#1F1F1F', 0.6),
          '&:hover': {
            backgroundColor: alpha('#D4AF37', 0.08),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 0,
          backgroundColor: '#1F1F1F',
        },
        bar: {
          borderRadius: 0,
          background: 'linear-gradient(90deg, #D4AF37, #E5C458, #D4AF37)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
          '@keyframes shimmer': {
            '0%': {
              backgroundPosition: '200% 0',
            },
            '100%': {
              backgroundPosition: '-200% 0',
            },
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#D4AF37',
        },
        circle: {
          strokeLinecap: 'square',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              borderColor: alpha('#C0C0C0', 0.2),
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: alpha('#D4AF37', 0.3),
            },
            '&.Mui-focused fieldset': {
              borderColor: '#D4AF37',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#D4AF37', 0.1)}`,
        },
        indicator: {
          backgroundColor: '#D4AF37',
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          minHeight: 64,
          '&.Mui-selected': {
            color: '#D4AF37',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#D4AF37', 0.08)}`,
        },
        head: {
          backgroundColor: '#1F1F1F',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha('#D4AF37', 0.08),
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 62,
          height: 34,
          padding: 7,
          '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
              color: '#0D0D0D',
              transform: 'translateX(22px)',
              '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                  '#D4AF37',
                )}" d="M10,2 L10,18 M2,10 L18,10"/></svg>')`,
              },
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#D4AF37',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#C0C0C0',
            width: 32,
            height: 32,
            '&:before': {
              content: "''",
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            },
          },
          '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: '#2C2C2C',
            borderRadius: 0,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#D4AF37',
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#D4AF37',
            border: '2px solid #0D0D0D',
            borderRadius: 0,
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: '0px 0px 20px 0px rgba(212, 175, 55, 0.5)',
            },
            '&:before': {
              display: 'none',
            },
          },
          '& .MuiSlider-rail': {
            color: '#2C2C2C',
            opacity: 1,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0D0D0D',
          borderRight: `1px solid ${alpha('#D4AF37', 0.08)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D0D0D',
          borderBottom: `1px solid ${alpha('#D4AF37', 0.08)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#1F1F1F',
          borderRadius: 0,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '16px 0',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0D0D0D',
          border: `1px solid ${alpha('#D4AF37', 0.2)}`,
          borderRadius: 0,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 0,
          minWidth: 20,
          height: 20,
        },
      },
    },
  },
});

export default sculptureTheme;
import { createTheme } from '@mui/material/styles';

const corporateTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3D52D5', // Professional blue
      light: '#6678DE',
      dark: '#2C3E9E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#44CFCB', // Teal accent
      light: '#76DCD9',
      dark: '#2B9D99',
      contrastText: '#000000',
    },
    error: {
      main: '#D64045', // Professional red
      light: '#E36D71',
      dark: '#B02E32',
    },
    warning: {
      main: '#FFAB4C', // Muted orange
      light: '#FFBD71',
      dark: '#E08F30',
    },
    info: {
      main: '#4A7DE9', // Light blue
      light: '#7499EF',
      dark: '#3260C0',
    },
    success: {
      main: '#4CAF50', // Standard green
      light: '#80E27E',
      dark: '#087F23',
    },
    background: {
      default: '#F5F7FA', // Light gray
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#1E2022', // Near black
      secondary: 'rgba(30, 32, 34, 0.7)',
      disabled: 'rgba(30, 32, 34, 0.5)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E2022',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3D52D5 0%, #5C6DE5 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2C3E9E 0%, #4A5AD3 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #2B9D99 0%, #44CFCB 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #238C88 0%, #32BDB9 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 14px rgba(0, 0, 0, 0.12)',
        },
        elevation4: {
          boxShadow: '0 8px 18px rgba(0, 0, 0, 0.14)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
        head: {
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(30, 32, 34, 0.9)',
          borderRadius: 6,
          padding: '6px 10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#C4C4C4 #F5F7FA',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F5F7FA',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#C4C4C4',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#A0A0A0',
          },
          backgroundImage: 'linear-gradient(135deg, #F9FAFC 0%, #F5F7FA 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
});

export default corporateTheme;

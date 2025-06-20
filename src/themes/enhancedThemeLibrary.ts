import { alpha } from '@mui/material/styles';
import { ExtendedTheme } from './themeLibrary';

// Enhanced themes with more color variety and contrast
export const enhancedThemes: ExtendedTheme[] = [
  // AVIATION THEMES - Enhanced with more contrast
  {
    id: 'boeing-cockpit-enhanced',
    name: 'Boeing Cockpit Pro',
    category: 'aviation',
    description: 'Enhanced Boeing 747 cockpit with high contrast displays',
    preview: {
      primary: '#1e3a8a',
      secondary: '#fbbf24',
      background: '#030712',
      surface: '#111827'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#1e3a8a',
          light: '#3b5fc4',
          dark: '#0f1e4a',
          contrastText: '#ffffff'
        },
        secondary: { 
          main: '#fbbf24',
          light: '#fcd34d',
          dark: '#f59e0b',
          contrastText: '#000000'
        },
        error: { main: '#ef4444' },
        warning: { main: '#f97316' },
        info: { main: '#3b82f6' },
        success: { main: '#10b981' },
        background: { 
          default: '#030712', 
          paper: '#111827' 
        },
        text: { 
          primary: '#f9fafb', 
          secondary: '#d1d5db' 
        },
        divider: alpha('#6b7280', 0.2),
        action: {
          active: '#fbbf24',
          hover: alpha('#fbbf24', 0.08),
          selected: alpha('#fbbf24', 0.12),
          disabled: alpha('#9ca3af', 0.3),
          disabledBackground: alpha('#9ca3af', 0.12)
        }
      },
      typography: {
        fontFamily: '"SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
      },
      shape: {
        borderRadius: 12
      }
    },
    gaugeStyle: 'aircraft',
    animations: true,
    premium: true
  },

  // LUXURY THEMES - Enhanced with richer colors
  {
    id: 'cartier-gold-enhanced',
    name: 'Cartier Royal',
    category: 'luxury',
    description: 'Ultra-luxury Cartier with rose gold and deep burgundy accents',
    preview: {
      primary: '#FFD700',
      secondary: '#8B0000',
      background: '#0a0a0a',
      surface: '#1a1611'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#FFD700',
          light: '#FFED4E',
          dark: '#B8860B',
          contrastText: '#000000'
        },
        secondary: { 
          main: '#8B0000',
          light: '#CD5C5C',
          dark: '#4B0000',
          contrastText: '#ffffff'
        },
        error: { main: '#DC143C' },
        warning: { main: '#FF8C00' },
        info: { main: '#87CEEB' },
        success: { main: '#228B22' },
        background: { 
          default: '#0a0a0a', 
          paper: '#1a1611' 
        },
        text: { 
          primary: '#FFF8DC', 
          secondary: '#DCC5A9' 
        },
        divider: alpha('#DCC5A9', 0.2),
        action: {
          active: '#FFD700',
          hover: alpha('#FFD700', 0.1),
          selected: alpha('#FFD700', 0.15),
          disabled: alpha('#8B7355', 0.3),
          disabledBackground: alpha('#8B7355', 0.12)
        }
      },
      typography: {
        fontFamily: '"Didot", "Georgia", "Times New Roman", serif',
        h1: { fontWeight: 300, letterSpacing: '0.02em' },
        h2: { fontWeight: 300, letterSpacing: '0.02em' },
        h3: { fontWeight: 400 },
      },
      shape: {
        borderRadius: 4
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },

  // BEAUTY THEMES - Enhanced with vibrant gradients
  {
    id: 'chanel-noir-enhanced',
    name: 'Chanel Haute Couture',
    category: 'beauty',
    description: 'Haute couture black with pearl white and gold accents',
    preview: {
      primary: '#000000',
      secondary: '#FFD700',
      background: '#050505',
      surface: '#1a1a1a'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#000000',
          light: '#2d2d2d',
          dark: '#000000',
          contrastText: '#ffffff'
        },
        secondary: { 
          main: '#FFD700',
          light: '#FFF8DC',
          dark: '#DAA520',
          contrastText: '#000000'
        },
        error: { main: '#FF1744' },
        warning: { main: '#FFA726' },
        info: { main: '#E3F2FD' },
        success: { main: '#00E676' },
        background: { 
          default: '#050505', 
          paper: '#1a1a1a' 
        },
        text: { 
          primary: '#FFFFFF', 
          secondary: '#F5F5F5' 
        },
        divider: alpha('#FFFFFF', 0.12),
        action: {
          active: '#FFD700',
          hover: alpha('#FFFFFF', 0.08),
          selected: alpha('#FFD700', 0.12),
          disabled: alpha('#696969', 0.3),
          disabledBackground: alpha('#696969', 0.12)
        }
      },
      typography: {
        fontFamily: '"Futura", "Helvetica Neue", "Arial", sans-serif',
        h1: { fontWeight: 100, letterSpacing: '0.1em', textTransform: 'uppercase' },
        h2: { fontWeight: 200, letterSpacing: '0.08em' },
        h3: { fontWeight: 300, letterSpacing: '0.05em' },
      },
      shape: {
        borderRadius: 0
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },

  // MODERN THEMES - Enhanced with neon and gradients
  {
    id: 'cyber-neon-enhanced',
    name: 'Cyberpunk 2099',
    category: 'modern',
    description: 'Extreme cyberpunk with neon pink, electric blue, and matrix green',
    preview: {
      primary: '#FF006E',
      secondary: '#00F5FF',
      background: '#000000',
      surface: '#0D0D0D'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#FF006E',
          light: '#FF4D9A',
          dark: '#C70053',
          contrastText: '#FFFFFF'
        },
        secondary: { 
          main: '#00F5FF',
          light: '#5EFFFF',
          dark: '#00B8C7',
          contrastText: '#000000'
        },
        error: { main: '#FF0844' },
        warning: { main: '#FFAB00' },
        info: { main: '#00E5FF' },
        success: { main: '#00FF88' },
        background: { 
          default: '#000000', 
          paper: '#0D0D0D' 
        },
        text: { 
          primary: '#FFFFFF', 
          secondary: '#B0B0B0' 
        },
        divider: alpha('#FF006E', 0.2),
        action: {
          active: '#00F5FF',
          hover: alpha('#FF006E', 0.15),
          selected: alpha('#00F5FF', 0.2),
          disabled: alpha('#606060', 0.3),
          disabledBackground: alpha('#606060', 0.12)
        }
      },
      typography: {
        fontFamily: '"Orbitron", "Roboto Mono", monospace',
        h1: { fontWeight: 900, letterSpacing: '0.05em' },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
      },
      shape: {
        borderRadius: 0
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #FF006E10 0%, #00F5FF10 100%)',
                pointerEvents: 'none',
              }
            }
          }
        }
      }
    },
    gaugeStyle: 'modern',
    animations: true,
    premium: true
  },

  // MEDICAL THEMES - Enhanced with clinical precision
  {
    id: 'surgical-precision-enhanced',
    name: 'Surgical Suite Pro',
    category: 'medical',
    description: 'Ultra-clean surgical environment with teal accents and high contrast',
    preview: {
      primary: '#00897B',
      secondary: '#00ACC1',
      background: '#FAFAFA',
      surface: '#FFFFFF'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { 
          main: '#00897B',
          light: '#4DB6AC',
          dark: '#00695C',
          contrastText: '#FFFFFF'
        },
        secondary: { 
          main: '#00ACC1',
          light: '#5DDEF4',
          dark: '#007C91',
          contrastText: '#FFFFFF'
        },
        error: { main: '#E53935' },
        warning: { main: '#FB8C00' },
        info: { main: '#039BE5' },
        success: { main: '#43A047' },
        background: { 
          default: '#FAFAFA', 
          paper: '#FFFFFF' 
        },
        text: { 
          primary: '#212121', 
          secondary: '#616161' 
        },
        divider: alpha('#00897B', 0.12),
        action: {
          active: '#00897B',
          hover: alpha('#00897B', 0.04),
          selected: alpha('#00897B', 0.08),
          disabled: alpha('#616161', 0.26),
          disabledBackground: alpha('#616161', 0.12)
        }
      },
      typography: {
        fontFamily: '"Inter", "Helvetica Neue", "Arial", sans-serif',
        h1: { fontWeight: 600 },
        h2: { fontWeight: 500 },
        h3: { fontWeight: 500 },
      },
      shape: {
        borderRadius: 8
      }
    },
    gaugeStyle: 'medical',
    animations: false,
    premium: true
  },

  // NATURE THEMES - Enhanced with organic colors
  {
    id: 'forest-sanctuary',
    name: 'Forest Sanctuary',
    category: 'nature',
    description: 'Deep forest with emerald greens, earth browns, and morning mist',
    preview: {
      primary: '#2E7D32',
      secondary: '#6A4C93',
      background: '#0D2818',
      surface: '#1A3A2E'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#2E7D32',
          light: '#60AD5E',
          dark: '#1B5E20',
          contrastText: '#FFFFFF'
        },
        secondary: { 
          main: '#6A4C93',
          light: '#8B6BB1',
          dark: '#4A366B',
          contrastText: '#FFFFFF'
        },
        error: { main: '#C62828' },
        warning: { main: '#EF6C00' },
        info: { main: '#0277BD' },
        success: { main: '#2E7D32' },
        background: { 
          default: '#0D2818', 
          paper: '#1A3A2E' 
        },
        text: { 
          primary: '#E8F5E9', 
          secondary: '#A5D6A7' 
        },
        divider: alpha('#4CAF50', 0.2),
        action: {
          active: '#4CAF50',
          hover: alpha('#4CAF50', 0.1),
          selected: alpha('#4CAF50', 0.15),
          disabled: alpha('#689F38', 0.3),
          disabledBackground: alpha('#689F38', 0.12)
        }
      },
      typography: {
        fontFamily: '"Quicksand", "Roboto", "Arial", sans-serif',
        h1: { fontWeight: 600 },
        h2: { fontWeight: 500 },
        h3: { fontWeight: 500 },
      },
      shape: {
        borderRadius: 16
      }
    },
    gaugeStyle: 'modern',
    animations: true,
    premium: true
  },

  // SPECIAL EDITION - Gallery of Dominance Enhanced
  {
    id: 'gallery-dominance-pro',
    name: 'Gallery Dominance Pro',
    category: 'luxury',
    description: 'Ultimate minimalist sculpture gallery with platinum and obsidian contrasts',
    preview: {
      primary: '#E5E4E2',
      secondary: '#FFD700',
      background: '#000000',
      surface: '#0F0F0F'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { 
          main: '#E5E4E2',
          light: '#FFFFFF',
          dark: '#C0C0C0',
          contrastText: '#000000'
        },
        secondary: { 
          main: '#FFD700',
          light: '#FFED4E',
          dark: '#B8860B',
          contrastText: '#000000'
        },
        error: { main: '#FF0000' },
        warning: { main: '#FFA500' },
        info: { main: '#87CEEB' },
        success: { main: '#32CD32' },
        background: { 
          default: '#000000', 
          paper: '#0F0F0F' 
        },
        text: { 
          primary: '#FFFFFF', 
          secondary: '#E5E4E2' 
        },
        divider: alpha('#E5E4E2', 0.1),
        action: {
          active: '#FFD700',
          hover: alpha('#E5E4E2', 0.05),
          selected: alpha('#FFD700', 0.1),
          disabled: alpha('#696969', 0.3),
          disabledBackground: alpha('#696969', 0.12)
        }
      },
      typography: {
        fontFamily: '"Playfair Display", "Georgia", serif',
        h1: { fontWeight: 900, letterSpacing: '-0.03em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 600, letterSpacing: '-0.01em' },
      },
      shape: {
        borderRadius: 0
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  }
];

// Merge with existing themes
export const mergeEnhancedThemes = (existingThemes: ExtendedTheme[]): ExtendedTheme[] => {
  const enhancedIds = enhancedThemes.map(t => t.id);
  const filteredExisting = existingThemes.filter(t => !enhancedIds.includes(t.id));
  return [...filteredExisting, ...enhancedThemes];
};
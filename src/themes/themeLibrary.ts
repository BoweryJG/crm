import { ThemeOptions } from '@mui/material/styles';

export interface ExtendedTheme {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  config: ThemeOptions;
  gaugeStyle?: 'aircraft' | 'medical' | 'luxury' | 'modern' | 'minimal';
  animations?: boolean;
  premium?: boolean;
}

export const themeCategories = {
  aviation: 'Aviation & Aerospace',
  luxury: 'Luxury & Premium',
  medical: 'Medical & Clinical',
  beauty: 'Beauty & Cosmetics',
  modern: 'Modern & Tech',
  classic: 'Classic & Traditional',
  nature: 'Nature & Organic'
};

export const themeLibrary: ExtendedTheme[] = [
  // AVIATION THEMES
  {
    id: 'boeing-cockpit',
    name: 'Boeing Cockpit',
    category: 'aviation',
    description: 'Classic Boeing 747 cockpit aesthetic with authentic gauges',
    preview: {
      primary: '#1e3a8a',
      secondary: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#1e3a8a' },
        secondary: { main: '#f59e0b' },
        background: { default: '#0f172a', paper: '#1e293b' },
        text: { primary: '#f1f5f9', secondary: '#cbd5e1' }
      }
    },
    gaugeStyle: 'aircraft',
    animations: true,
    premium: true
  },
  {
    id: 'airbus-modern',
    name: 'Airbus A350',
    category: 'aviation',
    description: 'Modern Airbus glass cockpit with sleek digital displays',
    preview: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      background: '#020617',
      surface: '#0f172a'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#0ea5e9' },
        secondary: { main: '#06b6d4' },
        background: { default: '#020617', paper: '#0f172a' },
        text: { primary: '#e2e8f0', secondary: '#94a3b8' }
      }
    },
    gaugeStyle: 'aircraft',
    animations: true,
    premium: true
  },
  {
    id: 'gulfstream-elite',
    name: 'Gulfstream Elite',
    category: 'aviation',
    description: 'Private jet luxury with premium materials and finishes',
    preview: {
      primary: '#7c3aed',
      secondary: '#c084fc',
      background: '#1e1b4b',
      surface: '#312e81'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#7c3aed' },
        secondary: { main: '#c084fc' },
        background: { default: '#1e1b4b', paper: '#312e81' },
        text: { primary: '#f1f5f9', secondary: '#cbd5e1' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'cessna-classic',
    name: 'Cessna Classic',
    category: 'aviation',
    description: 'Traditional general aviation with analog instrumentation',
    preview: {
      primary: '#dc2626',
      secondary: '#fbbf24',
      background: '#292524',
      surface: '#44403c'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#dc2626' },
        secondary: { main: '#fbbf24' },
        background: { default: '#292524', paper: '#44403c' },
        text: { primary: '#fafaf9', secondary: '#d6d3d1' }
      }
    },
    gaugeStyle: 'aircraft',
    animations: false
  },
  
  // LUXURY THEMES
  {
    id: 'cartier-gold',
    name: 'Cartier Gold',
    category: 'luxury',
    description: 'Iconic Cartier gold with deep burgundy accents',
    preview: {
      primary: '#C9B037',
      secondary: '#8B0000',
      background: '#1a1611',
      surface: '#2d2417'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#C9B037' },
        secondary: { main: '#8B0000' },
        background: { default: '#1a1611', paper: '#2d2417' },
        text: { primary: '#f7f1e3', secondary: '#d4c5a9' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'rolex-platinum',
    name: 'Rolex Platinum',
    category: 'luxury',
    description: 'Sophisticated platinum with ice blue details',
    preview: {
      primary: '#94a3b8',
      secondary: '#0ea5e9',
      background: '#0f172a',
      surface: '#1e293b'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#94a3b8' },
        secondary: { main: '#0ea5e9' },
        background: { default: '#0f172a', paper: '#1e293b' },
        text: { primary: '#f1f5f9', secondary: '#cbd5e1' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'hermes-orange',
    name: 'Hermès Orange',
    category: 'luxury',
    description: 'Signature Hermès orange with brown leather accents',
    preview: {
      primary: '#ff6b35',
      secondary: '#8b4513',
      background: '#1c1917',
      surface: '#292524'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#ff6b35' },
        secondary: { main: '#8b4513' },
        background: { default: '#1c1917', paper: '#292524' },
        text: { primary: '#fafaf9', secondary: '#e7e5e4' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'tiffany-blue',
    name: 'Tiffany Blue',
    category: 'luxury',
    description: 'Iconic Tiffany blue with silver and white accents',
    preview: {
      primary: '#81d4e6',
      secondary: '#c0c0c0',
      background: '#0c1921',
      surface: '#1e2832'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#81d4e6' },
        secondary: { main: '#c0c0c0' },
        background: { default: '#0c1921', paper: '#1e2832' },
        text: { primary: '#f0f9ff', secondary: '#bae6fd' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },

  // MEDICAL THEMES
  {
    id: 'surgical-precision',
    name: 'Surgical Precision',
    category: 'medical',
    description: 'Clean surgical environment with precise instrumentation',
    preview: {
      primary: '#059669',
      secondary: '#0891b2',
      background: '#f8fafc',
      surface: '#ffffff'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#059669' },
        secondary: { main: '#0891b2' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#0f172a', secondary: '#475569' }
      }
    },
    gaugeStyle: 'medical',
    animations: false
  },
  {
    id: 'dental-clean',
    name: 'Dental Clean',
    category: 'medical',
    description: 'Pristine dental office aesthetic with calming blues',
    preview: {
      primary: '#0284c7',
      secondary: '#06b6d4',
      background: '#fefefe',
      surface: '#f1f5f9'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#0284c7' },
        secondary: { main: '#06b6d4' },
        background: { default: '#fefefe', paper: '#f1f5f9' },
        text: { primary: '#1e293b', secondary: '#64748b' }
      }
    },
    gaugeStyle: 'medical',
    animations: false
  },
  {
    id: 'aesthetic-spa',
    name: 'Aesthetic Spa',
    category: 'medical',
    description: 'Relaxing spa environment with warm, soothing tones',
    preview: {
      primary: '#be185d',
      secondary: '#f97316',
      background: '#fef7ed',
      surface: '#fff7ed'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#be185d' },
        secondary: { main: '#f97316' },
        background: { default: '#fef7ed', paper: '#fff7ed' },
        text: { primary: '#7c2d12', secondary: '#9a3412' }
      }
    },
    gaugeStyle: 'medical',
    animations: true
  },

  // BEAUTY THEMES
  {
    id: 'chanel-noir',
    name: 'Chanel Noir',
    category: 'beauty',
    description: 'Iconic Chanel black with gold accents and timeless elegance',
    preview: {
      primary: '#000000',
      secondary: '#d4af37',
      background: '#1a1a1a',
      surface: '#2d2d2d'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#000000' },
        secondary: { main: '#d4af37' },
        background: { default: '#1a1a1a', paper: '#2d2d2d' },
        text: { primary: '#ffffff', secondary: '#e0e0e0' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'dior-rouge',
    name: 'Dior Rouge',
    category: 'beauty',
    description: 'Signature Dior red with sophisticated gray undertones',
    preview: {
      primary: '#dc143c',
      secondary: '#696969',
      background: '#2f2f2f',
      surface: '#404040'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#dc143c' },
        secondary: { main: '#696969' },
        background: { default: '#2f2f2f', paper: '#404040' },
        text: { primary: '#ffffff', secondary: '#d3d3d3' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'ysl-purple',
    name: 'YSL Purple',
    category: 'beauty',
    description: 'Yves Saint Laurent signature purple with modern sophistication',
    preview: {
      primary: '#663399',
      secondary: '#daa520',
      background: '#1e1e2e',
      surface: '#2a2a3a'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#663399' },
        secondary: { main: '#daa520' },
        background: { default: '#1e1e2e', paper: '#2a2a3a' },
        text: { primary: '#f5f5f5', secondary: '#cccccc' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  },
  {
    id: 'mac-studio',
    name: 'MAC Studio',
    category: 'beauty',
    description: 'Professional makeup studio with bold, artistic colors',
    preview: {
      primary: '#ff1493',
      secondary: '#00ced1',
      background: '#0a0a0a',
      surface: '#1c1c1c'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#ff1493' },
        secondary: { main: '#00ced1' },
        background: { default: '#0a0a0a', paper: '#1c1c1c' },
        text: { primary: '#ffffff', secondary: '#b0b0b0' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  {
    id: 'sephora-glow',
    name: 'Sephora Glow',
    category: 'beauty',
    description: 'Vibrant beauty retail environment with energetic colors',
    preview: {
      primary: '#ff4081',
      secondary: '#ffeb3b',
      background: '#fff8e1',
      surface: '#ffffff'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#ff4081' },
        secondary: { main: '#ffeb3b' },
        background: { default: '#fff8e1', paper: '#ffffff' },
        text: { primary: '#212121', secondary: '#424242' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  {
    id: 'ulta-beauty',
    name: 'Ulta Beauty',
    category: 'beauty',
    description: 'Warm beauty salon atmosphere with coral and peach tones',
    preview: {
      primary: '#ff7043',
      secondary: '#ffcc80',
      background: '#fff3e0',
      surface: '#ffffff'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#ff7043' },
        secondary: { main: '#ffcc80' },
        background: { default: '#fff3e0', paper: '#ffffff' },
        text: { primary: '#3e2723', secondary: '#5d4037' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  {
    id: 'glossier-pink',
    name: 'Glossier Pink',
    category: 'beauty',
    description: 'Millennial pink aesthetic with clean, modern beauty vibes',
    preview: {
      primary: '#f8bbd9',
      secondary: '#e1bee7',
      background: '#fce4ec',
      surface: '#ffffff'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#f8bbd9' },
        secondary: { main: '#e1bee7' },
        background: { default: '#fce4ec', paper: '#ffffff' },
        text: { primary: '#4a148c', secondary: '#7b1fa2' }
      }
    },
    gaugeStyle: 'minimal',
    animations: true
  },

  // MODERN THEMES
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'modern',
    description: 'Futuristic cyberpunk with neon accents and dark aesthetics',
    preview: {
      primary: '#a855f7',
      secondary: '#06ffa5',
      background: '#0a0a0a',
      surface: '#1a1a1a'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#a855f7' },
        secondary: { main: '#06ffa5' },
        background: { default: '#0a0a0a', paper: '#1a1a1a' },
        text: { primary: '#ffffff', secondary: '#a3a3a3' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  {
    id: 'minimal-zen',
    name: 'Minimal Zen',
    category: 'modern',
    description: 'Ultra-minimal design with focus on content and whitespace',
    preview: {
      primary: '#374151',
      secondary: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#374151' },
        secondary: { main: '#6b7280' },
        background: { default: '#ffffff', paper: '#f9fafb' },
        text: { primary: '#111827', secondary: '#6b7280' }
      }
    },
    gaugeStyle: 'minimal',
    animations: false
  },
  {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    category: 'modern',
    description: 'Vibrant gradient backgrounds with sunset-inspired colors',
    preview: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      background: '#7c2d12',
      surface: '#9a3412'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#f59e0b' },
        secondary: { main: '#ef4444' },
        background: { default: '#7c2d12', paper: '#9a3412' },
        text: { primary: '#fef3c7', secondary: '#fed7aa' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },

  // CLASSIC THEMES
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    category: 'classic',
    description: 'Traditional corporate design with professional blue tones',
    preview: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      background: '#f8fafc',
      surface: '#ffffff'
    },
    config: {
      palette: {
        mode: 'light',
        primary: { main: '#1e40af' },
        secondary: { main: '#3b82f6' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#1e293b', secondary: '#475569' }
      }
    },
    gaugeStyle: 'modern',
    animations: false
  },
  {
    id: 'space-exploration',
    name: 'Space Exploration',
    category: 'classic',
    description: 'Deep space theme with stellar navigation aesthetics',
    preview: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      background: '#0c0a09',
      surface: '#1c1917'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#7c3aed' },
        secondary: { main: '#a855f7' },
        background: { default: '#0c0a09', paper: '#1c1917' },
        text: { primary: '#f5f5f4', secondary: '#d6d3d1' }
      }
    },
    gaugeStyle: 'aircraft',
    animations: true
  },

  // NATURE THEMES
  {
    id: 'forest-green',
    name: 'Forest Green',
    category: 'nature',
    description: 'Natural forest environment with earth tones',
    preview: {
      primary: '#15803d',
      secondary: '#65a30d',
      background: '#14532d',
      surface: '#166534'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#15803d' },
        secondary: { main: '#65a30d' },
        background: { default: '#14532d', paper: '#166534' },
        text: { primary: '#f0fdf4', secondary: '#bbf7d0' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    category: 'nature',
    description: 'Deep ocean theme with flowing aquatic elements',
    preview: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      background: '#083344',
      surface: '#0e7490'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#0891b2' },
        secondary: { main: '#06b6d4' },
        background: { default: '#083344', paper: '#0e7490' },
        text: { primary: '#ecfeff', secondary: '#a5f3fc' }
      }
    },
    gaugeStyle: 'modern',
    animations: true
  },
  
  // SCULPTURE COLLECTION - NEW!
  {
    id: 'gallery-dominance',
    name: 'Gallery of Dominance',
    category: 'luxury',
    description: 'Minimalist sculpture meets CRM - where data becomes art in an exclusive gallery after hours',
    preview: {
      primary: '#D4AF37',
      secondary: '#C0C0C0',
      background: '#0D0D0D',
      surface: '#1F1F1F'
    },
    config: {
      palette: {
        mode: 'dark',
        primary: { main: '#D4AF37' },
        secondary: { main: '#C0C0C0' },
        background: { default: '#0D0D0D', paper: '#1F1F1F' },
        text: { primary: '#ECECEC', secondary: '#C0C0C0' }
      }
    },
    gaugeStyle: 'luxury',
    animations: true,
    premium: true
  }
];

// Helper functions
export const getThemesByCategory = (category: string) => 
  themeLibrary.filter(theme => theme.category === category);

export const getPremiumThemes = () => 
  themeLibrary.filter(theme => theme.premium);

export const getThemeById = (id: string) => 
  themeLibrary.find(theme => theme.id === id);

export const getAllCategories = () => 
  Object.keys(themeCategories);

// Legacy theme mapping for backward compatibility
export const legacyThemeMap = {
  'space': 'space-exploration',
  'corporate': 'corporate-blue', 
  'luxury': 'cartier-gold'
};
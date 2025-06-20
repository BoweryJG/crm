import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import spaceTheme from './spaceTheme';
import corporateTheme from './corporateTheme';
import luxuryTheme from './luxuryTheme';
import sculptureTheme from './sculptureTheme';
import { 
  allThemes, 
  getThemeById, 
  legacyThemeMap,
  ExtendedTheme 
} from './themeLibrary';

// Define theme types - now supports any theme ID from the library
export type ThemeMode = string;

// User preferences interface
interface UserPreferences {
  favoriteThemes: string[];
  recentThemes: string[];
  customThemes: ExtendedTheme[];
}

// Define context interface
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  favoriteThemes: string[];
  recentThemes: string[];
  customThemes: ExtendedTheme[];
  toggleFavoriteTheme: (themeId: string) => void;
  addCustomTheme: (theme: ExtendedTheme) => void;
  removeCustomTheme: (themeId: string) => void;
  getAllAvailableThemes: () => ExtendedTheme[];
  getCurrentTheme: () => ExtendedTheme | null;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'space'
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('crm-theme-mode') as ThemeMode;
      // Check if it's a legacy theme and map it
      if (savedTheme && legacyThemeMap[savedTheme as keyof typeof legacyThemeMap]) {
        return legacyThemeMap[savedTheme as keyof typeof legacyThemeMap];
      }
      // Check if theme exists in library
      if (savedTheme && getThemeById(savedTheme)) {
        return savedTheme;
      }
    }
    return 'cartier-gold'; // Default to luxury theme
  });

  // Initialize user preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crm-theme-preferences');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse theme preferences:', e);
        }
      }
    }
    return {
      favoriteThemes: ['cartier-gold', 'boeing-cockpit', 'chanel-noir'],
      recentThemes: [],
      customThemes: []
    };
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-theme-mode', themeMode);
      console.log('🎨 Theme changed to:', themeMode);
      
      // Add to recent themes (max 10)
      setUserPreferences(prev => {
        const newRecent = [themeMode, ...prev.recentThemes.filter(t => t !== themeMode)].slice(0, 10);
        const updated = { ...prev, recentThemes: newRecent };
        localStorage.setItem('crm-theme-preferences', JSON.stringify(updated));
        return updated;
      });
    }
  }, [themeMode]);

  // Save preferences whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-theme-preferences', JSON.stringify(userPreferences));
    }
  }, [userPreferences]);

  // Toggle between favorite themes or library themes
  const toggleTheme = () => {
    const favoriteIds = userPreferences.favoriteThemes;
    const allThemes = favoriteIds.length > 0 ? favoriteIds : ['cartier-gold', 'boeing-cockpit', 'cyber-neon'];
    
    const currentIndex = allThemes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % allThemes.length;
    const nextTheme = allThemes[nextIndex];
    
    console.log('🔄 Theme toggled from', themeMode, 'to', nextTheme);
    setThemeMode(nextTheme);
  };

  // Theme management functions
  const toggleFavoriteTheme = (themeId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      favoriteThemes: prev.favoriteThemes.includes(themeId)
        ? prev.favoriteThemes.filter(id => id !== themeId)
        : [...prev.favoriteThemes, themeId]
    }));
  };

  const addCustomTheme = (theme: ExtendedTheme) => {
    setUserPreferences(prev => ({
      ...prev,
      customThemes: [...prev.customThemes.filter(t => t.id !== theme.id), theme]
    }));
  };

  const removeCustomTheme = (themeId: string) => {
    setUserPreferences(prev => ({
      ...prev,
      customThemes: prev.customThemes.filter(t => t.id !== themeId)
    }));
  };

  const getAllAvailableThemes = () => {
    return [...allThemes, ...userPreferences.customThemes];
  };

  const getCurrentTheme = () => {
    return getAllAvailableThemes().find(theme => theme.id === themeMode) || null;
  };

  // Memoize the current theme to prevent unnecessary re-renders
  const currentTheme = useMemo(() => {
    // First check if it's a legacy theme
    if (['space', 'corporate', 'luxury'].includes(themeMode)) {
      switch (themeMode) {
        case 'space': return spaceTheme;
        case 'corporate': return corporateTheme;
        case 'luxury': return luxuryTheme;
        default: return luxuryTheme;
      }
    }

    // Check if it's from the theme library
    const themeDefinition = getCurrentTheme();
    if (themeDefinition) {
      // Special handling for gallery-dominance to use full sculptureTheme
      if (themeDefinition.id === 'gallery-dominance') {
        console.log('🎨 Using sculpture theme:', themeMode);
        return sculptureTheme;
      }
      const muiTheme = createTheme(themeDefinition.config);
      console.log('🎯 Theme created from library:', themeMode, themeDefinition.name);
      return muiTheme;
    }

    // Fallback to luxury theme
    console.warn('Theme not found, falling back to luxury:', themeMode);
    return luxuryTheme;
  }, [themeMode, userPreferences.customThemes]);

  // Create the context value
  const contextValue = useMemo(
    () => ({
      themeMode,
      toggleTheme,
      setThemeMode,
      favoriteThemes: userPreferences.favoriteThemes,
      recentThemes: userPreferences.recentThemes,
      customThemes: userPreferences.customThemes,
      toggleFavoriteTheme,
      addCustomTheme,
      removeCustomTheme,
      getAllAvailableThemes,
      getCurrentTheme,
    }),
    [themeMode, userPreferences]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

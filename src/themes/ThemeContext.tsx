import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import spaceTheme from './spaceTheme';
import corporateTheme from './corporateTheme';
import luxuryTheme from './luxuryTheme';

// Define theme types
export type ThemeMode = 'space' | 'corporate' | 'luxury';

// Define context interface
interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
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
      return (savedTheme && ['space', 'corporate', 'luxury'].includes(savedTheme)) ? savedTheme : 'space';
    }
    return 'space';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-theme-mode', themeMode);
      console.log('🎨 Theme changed to:', themeMode); // Debug log
    }
  }, [themeMode]);

  // Toggle between themes
  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      const nextTheme = (() => {
        switch (prevMode) {
          case 'space': return 'corporate';
          case 'corporate': return 'luxury';
          case 'luxury': return 'space';
          default: return 'space';
        }
      })();
      console.log('🔄 Theme toggled from', prevMode, 'to', nextTheme); // Debug log
      return nextTheme;
    });
  };

  // Memoize the current theme to prevent unnecessary re-renders
  const currentTheme = useMemo(() => {
    const theme = (() => {
      switch (themeMode) {
        case 'space': return spaceTheme;
        case 'corporate': return corporateTheme;
        case 'luxury': return luxuryTheme;
        default: return spaceTheme;
      }
    })();
    console.log('🎯 Current theme object created for mode:', themeMode); // Debug log
    return theme;
  }, [themeMode]);

  // Create the context value
  const contextValue = useMemo(
    () => ({
      themeMode,
      toggleTheme,
      setThemeMode,
    }),
    [themeMode]
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

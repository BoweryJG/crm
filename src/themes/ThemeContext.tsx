import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import spaceTheme from './spaceTheme';
import corporateTheme from './corporateTheme';

// Define theme types
export type ThemeMode = 'space' | 'corporate';

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
  // Default theme mode is 'space'
  const [themeMode, setThemeMode] = useState<ThemeMode>('space');

  // Toggle between themes
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'space' ? 'corporate' : 'space'));
  };

  // Memoize the current theme to prevent unnecessary re-renders
  const currentTheme = useMemo(() => {
    return themeMode === 'space' ? spaceTheme : corporateTheme;
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

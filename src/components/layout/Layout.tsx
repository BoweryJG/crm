import React, { useState, useRef, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import SculpturalSidebar from './SculpturalSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';
import { useNavigationSound } from '../../hooks/useSound';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const drawerWidth = 280;
  const { themeMode } = useThemeContext();
  const { forward } = useNavigationSound();
  const previousPath = useRef(location.pathname);
  
  // Always use SculpturalSidebar for the premium experience
  const usesSculpturalSidebar = true;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Reset scroll position and play navigation sound when navigating to a new route
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      // Play navigation sound
      forward();
      previousPath.current = location.pathname;
    }
    
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, forward]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header - pass mobile open state for sculptural menu */}
      <Header 
        onSidebarToggle={handleDrawerToggle} 
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen}
      />
      
      {/* Sidebar - Use Sculptural version for gallery theme */}
      {usesSculpturalSidebar ? (
        <SculpturalSidebar open={mobileOpen} onClose={handleDrawerToggle} drawerWidth={drawerWidth} />
      ) : (
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} drawerWidth={drawerWidth} />
      )}
      
      {/* Main content */}
      <Box
        component="main"
        ref={mainRef}
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` }, // Proper offset for desktop
          overflow: 'auto',
          position: 'relative',
          minHeight: '100vh',
          // Responsive padding that works with both sidebar types
          pt: { xs: 1, sm: 2 },
          px: { 
            xs: 2, // Mobile padding
            sm: 3, // Tablet padding
            md: 4, // Desktop padding
            lg: 5  // Large desktop padding
          },
          pb: { xs: 3, sm: 4, md: 5 },
          // Ensure content doesn't get too wide on large screens
          maxWidth: { xl: 'calc(100% - 80px)' },
          mx: { xl: 'auto' },
          transition: 'all 0.3s ease', // Smooth transitions when switching themes
        }}
      >
        <Toolbar /> {/* This creates space for the fixed header */}
        <Box
          sx={{
            // Additional container for better content control
            width: '100%',
            maxWidth: { xs: '100%', xl: '1600px' },
            mx: 'auto',
          }}
        >
          <Outlet /> {/* This renders the current route's element */}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

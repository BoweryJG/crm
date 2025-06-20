import React, { useState, useRef, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import SculpturalSidebar from './SculpturalSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const drawerWidth = 280;
  const { themeMode } = useThemeContext();
  
  // Use SculpturalSidebar for gallery-dominance theme or command room
  const usesSculpturalSidebar = themeMode === 'gallery-dominance' || location.pathname.startsWith('/command-room');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Reset scroll position when navigating to a new route
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onSidebarToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          overflow: 'auto',
          pt: 2,
          px: 3,
          pb: 4
        }}
      >
        <Toolbar /> {/* This creates space for the fixed header */}
        <Outlet /> {/* This renders the current route's element */}
      </Box>
    </Box>
  );
};

export default Layout;

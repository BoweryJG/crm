import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onSidebarToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      
      {/* Sidebar */}
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} drawerWidth={drawerWidth} />
      
      {/* Main content */}
      <Box
        component="main"
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

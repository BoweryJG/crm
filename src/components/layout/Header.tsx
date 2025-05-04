import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  Tooltip,
  Badge,
  Divider,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';

interface HeaderProps {
  onSidebarToggle: () => void;
  drawerWidth: number;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, drawerWidth }) => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  
  // User profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backdropFilter: 'blur(8px)',
        backgroundColor: themeMode === 'space' 
          ? 'rgba(22, 27, 44, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderBottom: `1px solid ${
          themeMode === 'space' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.06)'
        }`
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onSidebarToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Search bar - placeholder for now */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: themeMode === 'space' 
              ? 'rgba(10, 14, 23, 0.5)' 
              : 'rgba(245, 247, 250, 0.5)',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            mr: 2,
            flex: { xs: 1, md: 0.4 },
            maxWidth: { md: 400 }
          }}
        >
          <SearchIcon 
            sx={{ 
              color: theme.palette.text.secondary,
              mr: 1
            }} 
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Search...
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Theme toggle button */}
        <Tooltip title={`Switch to ${themeMode === 'space' ? 'Corporate' : 'Space'} Theme`}>
          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              mx: 1,
              color: theme.palette.text.primary,
              backgroundColor: themeMode === 'space' 
                ? 'rgba(138, 96, 208, 0.1)' 
                : 'rgba(61, 82, 213, 0.05)',
              '&:hover': {
                backgroundColor: themeMode === 'space' 
                  ? 'rgba(138, 96, 208, 0.2)' 
                  : 'rgba(61, 82, 213, 0.1)'
              }
            }}
          >
            {themeMode === 'space' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            sx={{ 
              mx: 1,
              color: theme.palette.text.primary
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0,
              border: `2px solid ${
                themeMode === 'space' 
                  ? 'rgba(138, 96, 208, 0.5)' 
                  : 'rgba(61, 82, 213, 0.3)'
              }`
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: themeMode === 'space' ? '#8860D0' : '#3D52D5',
                width: 32,
                height: 32
              }}
            >
              JS
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="profile-menu"
            open={open}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                minWidth: 200,
                boxShadow: themeMode === 'space' 
                  ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: themeMode === 'space' 
                  ? '1px solid rgba(255, 255, 255, 0.08)' 
                  : '1px solid rgba(0, 0, 0, 0.04)',
                backgroundImage: 'none',
                backgroundColor: theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                John Smith
              </Typography>
              <Typography variant="body2" color="text.secondary">
                john.smith@repspheres.com
              </Typography>
            </Box>
            <Divider 
              sx={{ 
                borderColor: themeMode === 'space' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.06)' 
              }} 
            />
            <MenuItem 
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: themeMode === 'space' 
                    ? 'rgba(138, 96, 208, 0.1)' 
                    : 'rgba(61, 82, 213, 0.05)'
                }
              }}
            >
              <PersonIcon sx={{ mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem 
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: themeMode === 'space' 
                    ? 'rgba(138, 96, 208, 0.1)' 
                    : 'rgba(61, 82, 213, 0.05)'
                }
              }}
            >
              <SettingsIcon sx={{ mr: 2 }} /> Settings
            </MenuItem>
            <Divider 
              sx={{ 
                borderColor: themeMode === 'space' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.06)' 
              }} 
            />
            <MenuItem 
              sx={{ 
                py: 1.5,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: themeMode === 'space' 
                    ? 'rgba(255, 82, 82, 0.1)' 
                    : 'rgba(214, 64, 69, 0.05)'
                }
              }}
            >
              <LogoutIcon sx={{ mr: 2 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

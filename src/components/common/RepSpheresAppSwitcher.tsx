import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip
} from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import ContactsIcon from '@mui/icons-material/Contacts';
import BarChartIcon from '@mui/icons-material/BarChart';
import BrushIcon from '@mui/icons-material/Brush';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../../auth';

interface AppItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
  requiresAuth?: boolean;
  isActive?: boolean;
}

export const RepSpheresAppSwitcher: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const open = Boolean(anchorEl);

  const currentHost = window.location.hostname;

  const apps: AppItem[] = [
    {
      name: 'CRM',
      url: 'https://crm.repspheres.com',
      icon: <ContactsIcon />,
      description: 'Customer Relationship Management',
      isActive: currentHost === 'crm.repspheres.com' || currentHost === 'localhost'
    },
    {
      name: 'Market Data',
      url: 'https://marketdata.repspheres.com',
      icon: <BarChartIcon />,
      description: 'Real-time market analytics',
      isActive: currentHost === 'marketdata.repspheres.com'
    },
    {
      name: 'Canvas',
      url: 'https://canvas.repspheres.com',
      icon: <BrushIcon />,
      description: 'Creative design tools',
      isActive: currentHost === 'canvas.repspheres.com'
    },
    {
      name: 'Podcast',
      url: 'https://podcast.repspheres.com',
      icon: <PodcastsIcon />,
      description: 'Audio content platform',
      isActive: currentHost === 'podcast.repspheres.com'
    }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (url: string) => {
    handleClose();
    // Use window.location for cross-domain navigation
    window.location.href = url;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'app-switcher-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        title="Switch between RepSpheres apps"
      >
        <AppsIcon />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="app-switcher-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 320,
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            REPSPHERES APPS
          </Typography>
        </Box>
        
        <Divider />
        
        {apps.map((app) => (
          <MenuItem
            key={app.name}
            onClick={() => handleNavigate(app.url)}
            sx={{
              py: 1.5,
              px: 2,
              bgcolor: app.isActive ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemIcon
              sx={{
                color: app.isActive ? 'primary.main' : 'text.secondary',
              }}
            >
              {app.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {app.name}
                  {app.isActive && (
                    <Chip
                      label="ACTIVE"
                      size="small"
                      color="primary"
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                  )}
                </Box>
              }
              secondary={app.description}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: app.isActive ? 600 : 400,
              }}
              secondaryTypographyProps={{
                variant: 'caption',
              }}
            />
          </MenuItem>
        ))}
        
        <Divider />
        
        <MenuItem
          onClick={() => handleNavigate('https://repspheres.com')}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="RepSpheres Home"
            secondary={user ? `Signed in as ${user.email}` : 'Not signed in'}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};
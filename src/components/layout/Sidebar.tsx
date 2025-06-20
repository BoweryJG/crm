import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  Campaign as CampaignIcon,
  Phone as PhoneIcon,
  AutoGraph as AutoGraphIcon,
  MedicalInformation as MedicalIcon,
  BiotechOutlined as BiotechIcon,
  Science as ScienceIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  Lightbulb as LightbulbIcon,
  People as PeopleIcon,
  Create as CreateIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Route as RouteIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const Sidebar: React.FC<{ open: boolean; onClose: () => void; drawerWidth: number }> = ({
  open,
  onClose,
  drawerWidth
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationSections: NavigationSection[] = [
    {
      title: 'Command Center',
      items: [
        { title: 'Dashboard', path: '/', icon: <DashboardIcon /> }
      ]
    },
    {
      title: 'Relationships',
      items: [
        { title: 'Smart CRM', path: '/relationships', icon: <PeopleIcon /> }
      ]
    },
    {
      title: 'Sales Intelligence',
      items: [
        { title: 'Content Studio', path: '/intelligence/content', icon: <CreateIcon /> },
        { title: 'Research Lab', path: '/intelligence/research', icon: <SearchIcon /> },
        { title: 'Call Coach', path: '/intelligence/calls', icon: <PhoneIcon /> },
        { title: 'Growth Tracker', path: '/intelligence/growth', icon: <TrendingUpIcon /> }
      ]
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(3, 2),
          backgroundColor: themeMode === 'space' ? 'rgba(10, 14, 23, 0.5)' : 'transparent',
          borderBottom: `1px solid ${themeMode === 'space' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`
        }}
      >
        <Box
          onClick={() => window.open('https://repspheres.com', '_blank')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              background: themeMode === 'space'
                ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)'
                : 'linear-gradient(45deg, #3D52D5 0%, #44CFCB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginRight: 1
            }}
          >
            Sphere
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            oS
          </Typography>
        </Box>
      </Box>

      {navigationSections.map((section, sectionIndex) => (
        <React.Fragment key={`section-${sectionIndex}`}>
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              padding: theme.spacing(2, 2, 1),
              color: theme.palette.text.secondary,
              fontWeight: 500
            }}
          >
            {section.title}
          </Typography>
          <List sx={{ padding: 0 }}>
            {section.items.map((item, itemIndex) => (
              <ListItem key={`item-${sectionIndex}-${itemIndex}`} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={isActiveRoute(item.path)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: themeMode === 'space' 
                        ? 'rgba(138, 96, 208, 0.2)' 
                        : 'rgba(61, 82, 213, 0.1)',
                      borderRight: themeMode === 'space'
                        ? '3px solid #8860D0'
                        : '3px solid #3D52D5',
                      '&:hover': {
                        backgroundColor: themeMode === 'space'
                          ? 'rgba(138, 96, 208, 0.3)'
                          : 'rgba(61, 82, 213, 0.2)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: themeMode === 'space'
                        ? 'rgba(138, 96, 208, 0.1)'
                        : 'rgba(61, 82, 213, 0.05)'
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActiveRoute(item.path)
                        ? themeMode === 'space'
                          ? '#8860D0'
                          : '#3D52D5'
                        : theme.palette.text.secondary
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title} 
                    primaryTypographyProps={{
                      fontWeight: isActiveRoute(item.path) ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {sectionIndex < navigationSections.length - 1 && (
            <Divider 
              sx={{ 
                my: 1.5,
                borderColor: themeMode === 'space' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.08)'
              }} 
            />
          )}
        </React.Fragment>
      ))}

      <Divider 
        sx={{ 
          my: 1.5,
          borderColor: themeMode === 'space' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.08)'
        }} 
      />
      
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          padding: theme.spacing(2, 2, 1),
          color: theme.palette.text.secondary,
          fontWeight: 500
        }}
      >
        Settings
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigation('/settings')}
            selected={isActiveRoute('/settings')}
            sx={{
              px: 2,
              py: 1.5,
              '&.Mui-selected': {
                backgroundColor: themeMode === 'space' 
                  ? 'rgba(138, 96, 208, 0.2)' 
                  : 'rgba(61, 82, 213, 0.1)',
                borderRight: themeMode === 'space'
                  ? '3px solid #8860D0'
                  : '3px solid #3D52D5',
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActiveRoute('/settings')
                  ? themeMode === 'space'
                    ? '#8860D0'
                    : '#3D52D5'
                  : theme.palette.text.secondary
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Account & Subscription" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: themeMode === 'space' 
              ? '1px solid rgba(255, 255, 255, 0.08)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: themeMode === 'space' 
              ? '1px solid rgba(255, 255, 255, 0.08)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

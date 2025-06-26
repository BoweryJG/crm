// SculpturalSidebar - Navigation as Art
// Each tab is a monument to functionality
// Where clicking becomes a curatorial experience

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Architecture as ArchitectureIcon,
  Psychology as PsychologyIcon,
  AutoMode as AutomationIcon,
  Analytics as AnalyticsIcon,
  Create as ContentIcon,
  Storage as VaultIcon,
  Speed as PerformanceIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../../themes/ThemeContext';
import glassEffects from '../../themes/glassEffects';
import animations from '../../themes/animations';
import { useSound } from '../../hooks/useSound';

// Monolithic Tab Component
const MonolithTab: React.FC<{
  title: string;
  path: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  delay?: number;
  soundVariant?: number;
}> = ({ title, path, icon, isActive, onClick, delay = 0, soundVariant = 0 }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Use metal click sound for all sidebar interactions
  const clickSound = useSound('ui-click-metal');
  
  return (
    <Box
      onClick={() => {
        // Instant click feedback
        clickSound.play();
        onClick();
      }}
      onMouseEnter={React.useCallback(() => setIsHovered(true), [])}
      onMouseLeave={React.useCallback(() => setIsHovered(false), [])}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        willChange: 'transform',
        // Ultra-fast transitions for instant feedback
        transition: 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms ease-out',
        transformOrigin: 'left center',
        
        // Simplified transform for performance
        transform: isActive ? 'translateX(5px)' : 'translateX(0)',
        
        // Simplified background
        backgroundColor: isActive 
          ? alpha(theme.palette.primary.main, 0.12)
          : isHovered 
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.background.paper, 0.03),
        
        // Simple border
        borderLeft: isActive 
          ? `4px solid ${theme.palette.primary.main}`
          : `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        
        // Reduced shadows for performance
        boxShadow: isActive
          ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
          : 'none',
        
        // Padding and spacing
        px: 3,
        py: 1,
        mb: 0.5,
        mx: 2,
        
        // Instant hover feedback
        '&:hover': {
          transform: isActive 
            ? 'translateX(5px)' 
            : 'translateX(3px)',
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          borderLeftColor: theme.palette.primary.main,
        },
        
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Simplified icon */}
        <Box
          sx={{
            mr: 2,
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: 'color 150ms ease-out',
          }}
        >
          {icon}
        </Box>
        
        {/* Simplified text */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 600 : 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
            transition: 'all 150ms ease-out',
          }}
        >
          {title}
        </Typography>
        
      </Box>
    </Box>
  );
};

// Section Divider Component
const SculpturalDivider: React.FC<{ pattern?: 'dots' | 'zigzag' | 'gradient' }> = ({ pattern = 'gradient' }) => {
  const theme = useTheme();
  const opacity = theme.palette.mode === 'dark' ? 0.2 : 0.15;
  
  if (pattern === 'zigzag') {
    return (
      <Box sx={{ position: 'relative', height: 12, my: 0.5, overflow: 'hidden' }}>
        <svg width="100%" height="12" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path
            d="M0,6 L10,3 L20,9 L30,3 L40,9 L50,3 L60,9 L70,3 L80,9 L90,3 L100,9 L110,3 L120,9 L130,3 L140,9 L150,3 L160,9 L170,3 L180,9 L190,3 L200,6"
            stroke={alpha(theme.palette.primary.main, opacity)}
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </Box>
    );
  }
  
  if (pattern === 'dots') {
    return (
      <Box
        sx={{
          height: 16,
          my: 0.5,
          backgroundImage: `radial-gradient(circle, ${alpha(theme.palette.primary.main, opacity)} 1px, transparent 1px)`,
          backgroundSize: '10px 10px',
          backgroundPosition: 'center',
        }}
      />
    );
  }
  
  // Default gradient
  return (
    <Box
      sx={{
        height: 1,
        my: 0.75, // Further reduced to minimize space
        mx: 2,
        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.3 : 0.2)}, transparent)`,
      }}
    />
  );
};

// Section Component
const NavigationSection: React.FC<{
  title: string;
  items: Array<{ title: string; path: string; icon: React.ReactNode }>;
  onNavigate: (path: string) => void;
  currentPath: string;
  delayOffset?: number;
}> = ({ title, items, onNavigate, currentPath, delayOffset = 0 }) => {
  const theme = useTheme();
  
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          px: 3,
          pt: 1,
          pb: 0.5,
          letterSpacing: '0.2em',
          fontWeight: 300,
          fontSize: '0.6rem',
          color: alpha(theme.palette.text.secondary, 0.5),
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ pb: 0 }}>
        {items.map((item, index) => (
          <MonolithTab
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
            isActive={currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))}
            onClick={() => onNavigate(item.path)}
            delay={delayOffset + (index * 50)}
            soundVariant={index}
          />
        ))}
      </Box>
    </Box>
  );
};

// Main Sculptural Sidebar Component
const SculpturalSidebar: React.FC<{
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}> = ({ open, onClose, drawerWidth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { themeMode, setThemeMode } = useThemeContext();
  
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (path === '/command-room') {
      setThemeMode('gallery-dominance');
    }
    if (onClose) {
      onClose();
    }
  };
  
  // Simplified navigation - theme-aware labels
  const getThemeAwareLabel = (key: string) => {
    const labels: Record<string, Record<string, string>> = {
      dashboard: {
        default: 'Dashboard',
        'boeing-cockpit': 'Flight Deck',
        'cartier-gold': 'Executive Suite',
        'gallery-dominance': 'Command Center',
      },
      relationships: {
        default: 'Relationships',
        'boeing-cockpit': 'Fleet Registry',
        'cartier-gold': 'Clientele',
        'gallery-dominance': 'Network',
      },
      analytics: {
        default: 'Analytics',
        'boeing-cockpit': 'Instruments',
        'cartier-gold': 'Performance',
        'gallery-dominance': 'Metrics',
      },
      intelligence: {
        default: 'Intelligence',
        'boeing-cockpit': 'AI Copilot',
        'cartier-gold': 'Concierge AI',
        'gallery-dominance': 'Neural Core',
      },
    };
    
    return labels[key]?.[themeMode] || labels[key]?.default || key;
  };

  const navigationStructure = [
    {
      title: 'Execute',
      items: [
        { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
        { title: getThemeAwareLabel('relationships'), path: '/relationships', icon: <PeopleIcon /> },
        { title: 'Call Center', path: '/call-center', icon: <PhoneIcon /> },
        { title: 'Automations', path: '/automations', icon: <AutomationIcon /> },
      ],
      delayOffset: 0,
    },
    {
      title: 'Analyze',
      items: [
        { title: 'Performance', path: '/metrics', icon: <PerformanceIcon /> },
        { title: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
        { title: 'Call Analytics', path: '/call-analytics', icon: <PhoneIcon /> },
        { title: getThemeAwareLabel('intelligence'), path: '/intelligence', icon: <PsychologyIcon /> },
      ],
      delayOffset: 200,
    },
    {
      title: 'Amplify',
      items: [
        { title: 'Command Center', path: '/command-center', icon: <ArchitectureIcon /> },
        { title: 'Content Studio', path: '/content', icon: <ContentIcon /> },
        { title: 'Call Vault', path: '/operations/call-vault', icon: <VaultIcon /> },
      ],
      delayOffset: 400,
    },
  ];
  
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        
        // Subtle background pattern - theme aware
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              45deg, 
              transparent, 
              transparent 35px, 
              ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.02 : 0.01)} 35px, 
              ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.02 : 0.01)} 70px
            )
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)}`,
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.05 : 0.02)}, transparent)`,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.6s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.03 : 0.01),
          },
        }}
        onClick={() => window.open('https://repspheres.com', '_blank')}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 100,
            letterSpacing: '0.3em',
            textAlign: 'center',
            textTransform: 'uppercase',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${
              theme.palette.mode === 'dark' ? theme.palette.primary.light || theme.palette.primary.main : theme.palette.primary.dark || theme.palette.primary.main
            })`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 30px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.3 : 0.2)}`,
          }}
        >
          Repspheres
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            letterSpacing: '0.2em',
            color: theme.palette.text.secondary,
            mt: 0.5,
            fontSize: '0.625rem',
          }}
        >
          {themeMode === 'gallery-dominance' ? 'GALLERY OF DOMINANCE' :
           themeMode === 'boeing-cockpit' ? 'FLIGHT COMMAND' :
           themeMode === 'cyber-neon' ? 'NEON INTERFACE' :
           themeMode === 'chanel-noir' ? 'HAUTE NAVIGATION' :
           themeMode === 'ocean-depths' ? 'AQUATIC CONTROL' :
           themeMode === 'cartier-gold' ? 'LUXURY COMMAND' :
           'ELITE NAVIGATION'}
        </Typography>
      </Box>
      
      {/* Navigation */}
      <Box sx={{ 
        overflowY: 'auto', 
        overflowX: 'hidden', 
        flex: 1, 
        py: 0.5,
        // Custom scrollbar styling
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.primary.main, 0.05),
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.primary.main, 0.2),
          borderRadius: '4px',
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.3),
          },
        },
      }}>
        {navigationStructure.map((section, index) => (
          <NavigationSection
            key={section.title}
            title={section.title}
            items={section.items}
            onNavigate={handleNavigation}
            currentPath={location.pathname}
            delayOffset={section.delayOffset}
          />
        ))}
        
        {/* Simplified Settings */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <MonolithTab
            title="Settings"
            path="/settings"
            icon={<SettingsIcon />}
            isActive={location.pathname === '/settings'}
            onClick={() => handleNavigation('/settings')}
          />
        </Box>
      </Box>
      
      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)}`,
          background: `linear-gradient(0deg, ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.05 : 0.02)}, transparent)`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: theme.palette.text.secondary,
            letterSpacing: '0.1em',
            fontSize: '0.625rem',
            opacity: 0.5,
          }}
        >
          {themeMode === 'gallery-dominance' ? 'ELITE ACCESS ONLY' :
           themeMode === 'boeing-cockpit' ? 'AUTHORIZED PILOTS' :
           themeMode === 'cyber-neon' ? 'SYSTEM ACCESS' :
           themeMode === 'chanel-noir' ? 'EXCLUSIVE MEMBERS' :
           themeMode === 'ocean-depths' ? 'DEEP EXPLORERS' :
           themeMode === 'cartier-gold' ? 'PREMIUM ACCESS' :
           'AUTHORIZED USERS'}
        </Typography>
      </Box>
    </Box>
  );
  
  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            backgroundImage: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            backgroundImage: 'none',
            border: 'none',
            zIndex: theme.zIndex.drawer + 1, // Ensure sidebar stays above content
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SculpturalSidebar;
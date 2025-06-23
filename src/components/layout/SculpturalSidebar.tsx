// SculpturalSidebar - Navigation as Art
// Each tab is a monument to functionality
// Where clicking becomes a curatorial experience

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Museum as MuseumIcon,
  People as PeopleIcon,
  Create as CreateIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronIcon,
  AutoAwesome as SparkleIcon,
  Hexagon as HexIcon,
  Architecture as ArchitectureIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
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
  
  // Different sounds for variety (removed hover sounds)
  const clickSound = useSound(
    isActive ? 'ui-toggle' : 
    soundVariant % 3 === 0 ? 'ui-click-primary' : 
    soundVariant % 3 === 1 ? 'ui-click-secondary' : 
    'navigation-forward'
  );
  
  return (
    <Box
      onClick={(e) => {
        // Add mechanical click effect
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.transform = 'skewX(-5deg) translateX(3px) scale(0.98)';
        
        // Play sound and navigate
        clickSound.play();
        onClick();
        
        // Spring back animation
        setTimeout(() => {
          e.currentTarget.style.transform = isActive ? 'skewX(-5deg) translateX(5px)' : 'skewX(-3deg)';
        }, 100);
      }}
      onMouseEnter={React.useCallback(() => setIsHovered(true), [])}
      onMouseLeave={React.useCallback(() => setIsHovered(false), [])}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        willChange: 'transform, background-color, box-shadow, border-left',
        // Single, smooth mechanical transition
        transition: `all ${animations.durations.instant}ms ${animations.easings.metal}`,
        transitionDelay: '0ms',
        // Add transform-origin for weighted feel
        transformOrigin: 'left center',
        
        // Base shape with skew
        transform: isActive ? 'skewX(-5deg) translateX(5px)' : 'skewX(-3deg)',
        
        // Glass effect base
        backgroundColor: isActive 
          ? alpha(theme.palette.primary.main, 0.15)
          : alpha(theme.palette.background.paper, 0.03),
        backdropFilter: 'blur(10px)',
        
        // Borders and shadows for depth
        borderLeft: isActive 
          ? `6px solid ${theme.palette.primary.main}`
          : `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: isActive
          ? `0 10px 40px ${alpha(theme.palette.primary.main, 0.3)}, inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`
          : theme.palette.mode === 'dark'
          ? `0 4px 20px ${alpha('#000', 0.4)}`
          : `0 4px 20px ${alpha('#000', 0.1)}`,
        
        // Padding and spacing
        px: 3,
        py: 0.75, // Even more reduced
        mb: 0, // No margin between tabs
        mx: 2,
        
        // Hover effects - mechanical precision
        '&:hover': {
          transform: isActive 
            ? 'skewX(-5deg) translateX(5px) scale(1.02)' 
            : 'skewX(-4deg) translateX(12px) scale(1.05)',
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          borderLeftWidth: '5px',
          borderLeftColor: theme.palette.primary.main,
          boxShadow: `
            0 20px 60px ${alpha(theme.palette.primary.main, 0.3)}, 
            inset 0 0 30px ${alpha(theme.palette.primary.main, 0.15)},
            inset -2px 0 10px ${alpha(theme.palette.primary.main, 0.2)}
          `,
        },
        
        // Gold accent line
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
          opacity: isActive ? 1 : 0,
          transition: `opacity ${animations.durations.instant}ms ease`,
        },
        
        // Hover glow effect
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          transform: 'translateY(-50%)',
          opacity: isHovered ? 1 : 0,
          transition: `opacity ${animations.durations.instant}ms ease`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', transform: 'skewX(3deg)' }}>
        {/* Icon with geometric enhancement */}
        <Box
          sx={{
            position: 'relative',
            mr: 2,
            color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: `all ${animations.durations.instant}ms ${animations.easings.metal}`,
            transform: isActive ? 'scale(1.2)' : 'scale(1)',
            filter: isActive ? `drop-shadow(0 0 8px ${theme.palette.primary.main})` : 'none',
            
            // Icon container shape
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              border: `1px solid ${alpha(theme.palette.primary.main, isActive ? 0.3 : 0.1)}`,
              transform: 'rotate(45deg)',
              transition: `all ${animations.durations.instant}ms ${animations.easings.metal}`,
            },
          }}
        >
          {icon}
        </Box>
        
        {/* Text with artistic treatment */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 800 : 100,
            letterSpacing: isActive ? '0.2em' : '0.1em',
            textTransform: 'uppercase',
            color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
            transition: `all ${animations.durations.instant}ms ${animations.easings.metal}`,
            textShadow: isActive ? `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}` : 'none',
          }}
        >
          {title}
        </Typography>
        
        {/* Active indicator */}
        {isActive && (
          <Box
            sx={{
              ml: 'auto',
              width: 8,
              height: 8,
              backgroundColor: theme.palette.primary.main,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
              animation: `pulse 2s ease-in-out infinite`,
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.8,
                  transform: 'scale(1.2)',
                },
              },
            }}
          />
        )}
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
  collapsible?: boolean;
  defaultOpen?: boolean;
  delayOffset?: number;
}> = ({ title, items, onNavigate, currentPath, collapsible = false, defaultOpen = true, delayOffset = 0 }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 0, // No vertical padding
          cursor: collapsible ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': collapsible ? {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          } : {},
        }}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <Typography
          variant="overline"
          sx={{
            flex: 1,
            letterSpacing: '0.3em',
            fontWeight: 300,
            fontSize: '0.625rem',
            color: alpha(theme.palette.text.secondary, 0.7),
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
        {collapsible && (
          <IconButton
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            <ChevronIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Collapse in={isOpen} timeout={animations.durations.deliberate}>
        <Box sx={{ pb: 0 }}> {/* Removed padding */}
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
      </Collapse>
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
  
  // Preload mechanical sounds for instant feedback
  React.useEffect(() => {
    const sounds = ['ui-click-primary', 'ui-click-secondary', 'ui-toggle', 'navigation-forward'];
    sounds.forEach(soundId => {
      const audio = new Audio(`/sounds/${soundId}.mp3`);
      audio.load();
    });
  }, []);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (path === '/command-room') {
      setThemeMode('gallery-dominance');
    }
    if (onClose) {
      onClose();
    }
  };
  
  const navigationStructure = [
    {
      title: 'Command Center',
      items: [
        { title: 'Dashboard', path: '/', icon: <DashboardIcon /> },
        { title: 'Mission Control', path: '/command-room', icon: <ArchitectureIcon /> },
      ],
      delayOffset: 0,
    },
    {
      title: 'Sales Operations',
      items: [
        { title: 'Smart CRM', path: '/relationships', icon: <PeopleIcon /> },
        { title: 'Performance', path: '/operations/performance', icon: <TrendingUpIcon /> },
        { title: 'Analytics', path: '/operations/analytics', icon: <PsychologyIcon /> },
        { title: 'Call Vault', path: '/operations/call-vault', icon: <PhoneIcon /> },
      ],
      collapsible: true,
      defaultOpen: true,
      delayOffset: 100,
    },
    {
      title: 'Intelligence Hub',
      items: [
        { title: 'Strategy', path: '/intelligence/canvas', icon: <SparkleIcon /> },
        { title: 'Forge', path: '/intelligence/content', icon: <CreateIcon /> },
        { title: 'Lab', path: '/intelligence/research', icon: <SearchIcon /> },
        { title: 'Growth', path: '/intelligence/growth', icon: <HexIcon /> },
        { title: 'Academy', path: '/intelligence/academy', icon: <SchoolIcon /> },
      ],
      collapsible: true,
      defaultOpen: true,
      delayOffset: 200,
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
            collapsible={section.collapsible}
            defaultOpen={section.defaultOpen}
            delayOffset={section.delayOffset}
          />
        ))}
        
        {/* Settings */}
        <NavigationSection
          title="Configuration"
          items={[
            { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
          ]}
          onNavigate={handleNavigation}
          currentPath={location.pathname}
          delayOffset={400}
        />
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
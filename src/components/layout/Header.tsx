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
  Button,
  InputBase,
  alpha,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  LocalFireDepartment as CriticalIcon,
  FlashOn as UrgentIcon,
  TrendingUp as OpportunityIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppModeToggle } from '../common/AppModeToggle';
import GlobalAuthModal from '../common/GlobalAuthModal';
import { RepSpheresAppSwitcher } from '../common/RepSpheresAppSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import { getUserDisplayName, getUserInitials } from '../../utils/userHelpers';
import SculpturalMenuToggle from './SculpturalMenuToggle';
import { useSound } from '../../hooks/useSound';
import EmailSyncButton from '../email/EmailSyncButton';

// Theme-aware color mapping (matching LiveActionTicker)
const getThemeColors = (themeMode: string) => {
  const colorMap: Record<string, any> = {
    'gallery-dominance': {
      primary: '#FFD700',
      primaryDark: '#B8860B',
      surface: 'rgba(20, 20, 20, 0.95)',
      glassMorph: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(255, 215, 0, 0.2)',
      searchBg: 'rgba(255, 215, 0, 0.03)',
      searchBorder: 'rgba(255, 215, 0, 0.1)',
      buttonBg: 'linear-gradient(135deg, #B8860B, #FFD700)',
      buttonHover: 'linear-gradient(135deg, #FFD700, #FFF8DC)'
    },
    'boeing-cockpit': {
      primary: '#00FF00',
      primaryDark: '#228B22',
      surface: 'rgba(10, 15, 20, 0.98)',
      glassMorph: 'rgba(0, 255, 0, 0.02)',
      border: 'rgba(0, 255, 0, 0.2)',
      searchBg: 'rgba(0, 255, 0, 0.03)',
      searchBorder: 'rgba(0, 255, 0, 0.1)',
      buttonBg: 'linear-gradient(135deg, #228B22, #00FF00)',
      buttonHover: 'linear-gradient(135deg, #00FF00, #7FFF00)'
    },
    'cyber-neon': {
      primary: '#FF00FF',
      primaryDark: '#8B008B',
      surface: 'rgba(10, 0, 20, 0.95)',
      glassMorph: 'rgba(255, 0, 255, 0.02)',
      border: 'rgba(255, 0, 255, 0.2)',
      searchBg: 'rgba(255, 0, 255, 0.03)',
      searchBorder: 'rgba(255, 0, 255, 0.1)',
      buttonBg: 'linear-gradient(135deg, #8B008B, #FF00FF)',
      buttonHover: 'linear-gradient(135deg, #FF00FF, #FF69B4)'
    },
    'chanel-noir': {
      primary: '#FFFFFF',
      primaryDark: '#C0C0C0',
      surface: 'rgba(0, 0, 0, 0.98)',
      glassMorph: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(255, 255, 255, 0.1)',
      searchBg: 'rgba(255, 255, 255, 0.02)',
      searchBorder: 'rgba(255, 255, 255, 0.05)',
      buttonBg: 'linear-gradient(135deg, #1C1C1C, #2C2C2C)',
      buttonHover: 'linear-gradient(135deg, #2C2C2C, #3C3C3C)'
    },
    'ocean-depths': {
      primary: '#00CED1',
      primaryDark: '#008B8B',
      surface: 'rgba(0, 20, 40, 0.95)',
      glassMorph: 'rgba(0, 206, 209, 0.02)',
      border: 'rgba(0, 206, 209, 0.2)',
      searchBg: 'rgba(0, 206, 209, 0.03)',
      searchBorder: 'rgba(0, 206, 209, 0.1)',
      buttonBg: 'linear-gradient(135deg, #008B8B, #00CED1)',
      buttonHover: 'linear-gradient(135deg, #00CED1, #40E0D0)'
    },
    'cartier-gold': {
      primary: '#FFD700',
      primaryDark: '#DAA520',
      surface: 'rgba(10, 10, 10, 0.98)',
      glassMorph: 'rgba(255, 215, 0, 0.02)',
      border: 'rgba(255, 215, 0, 0.2)',
      searchBg: 'rgba(255, 215, 0, 0.03)',
      searchBorder: 'rgba(255, 215, 0, 0.1)',
      buttonBg: 'linear-gradient(135deg, #DAA520, #FFD700)',
      buttonHover: 'linear-gradient(135deg, #FFD700, #FFED4B)'
    },
    default: {
      primary: '#1976d2',
      primaryDark: '#115293',
      surface: 'rgba(255, 255, 255, 0.8)',
      glassMorph: 'rgba(0, 0, 0, 0.02)',
      border: 'rgba(0, 0, 0, 0.06)',
      searchBg: 'rgba(0, 0, 0, 0.04)',
      searchBorder: 'rgba(0, 0, 0, 0.08)',
      buttonBg: 'linear-gradient(135deg, #1976d2, #115293)',
      buttonHover: 'linear-gradient(135deg, #115293, #0d3c6e)'
    }
  };
  
  return colorMap[themeMode] || colorMap.default;
};

// Animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

// Styled components
const LuxuryAppBar = styled(AppBar)<{ themeColors: any }>(({ theme, themeColors }) => ({
  backdropFilter: 'blur(20px)',
  backgroundColor: themeColors.surface,
  borderBottom: `1px solid ${themeColors.border}`,
  boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.1)}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(themeColors.primary, 0.5)}, transparent)`,
    animation: `${shimmer} 3s infinite`
  }
}));

const SearchBar = styled(Box)<{ themeColors: any }>(({ theme, themeColors }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: themeColors.searchBg,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${themeColors.searchBorder}`,
  borderRadius: 20,
  padding: theme.spacing(0.5, 1.5),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minWidth: 220,
  height: 36,
  '&:hover': {
    borderColor: alpha(themeColors.primary, 0.3),
    backgroundColor: alpha(themeColors.searchBg, 2),
    boxShadow: `0 0 20px ${alpha(themeColors.primary, 0.1)}`
  },
  '&:focus-within': {
    borderColor: themeColors.primary,
    boxShadow: `0 0 30px ${alpha(themeColors.primary, 0.2)}`
  }
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: '0.875rem',
  '& input': {
    padding: 0,
    '&::placeholder': {
      opacity: 0.6,
      letterSpacing: '0.5px'
    }
  }
}));

const LoginButton = styled(Button)<{ themeColors: any }>(({ theme, themeColors }) => ({
  background: 'transparent',
  border: `1px solid ${alpha(themeColors.primary, 0.3)}`,
  color: themeColors.primary,
  backdropFilter: 'blur(10px)',
  borderRadius: 18,
  padding: '3px 16px',
  height: '32px',
  fontSize: '0.825rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: alpha(themeColors.primary, 0.1),
    borderColor: themeColors.primary,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 16px ${alpha(themeColors.primary, 0.2)}`
  }
}));

const SignUpButton = styled(Button)<{ themeColors: any }>(({ theme, themeColors }) => ({
  background: typeof themeColors.buttonBg === 'string' ? themeColors.buttonBg : themeColors.primary,
  color: theme.palette.getContrastText(themeColors.primary),
  backdropFilter: 'blur(10px)',
  borderRadius: 18,
  padding: '3px 18px',
  height: '32px',
  fontSize: '0.825rem',
  fontWeight: 700,
  letterSpacing: '0.5px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha(themeColors.primary, 0.2)}`,
  flexShrink: 0, // Prevent button from shrinking
  minWidth: 'fit-content', // Ensure button fits its content
  whiteSpace: 'nowrap', // Prevent text wrapping
  [theme.breakpoints.down('sm')]: {
    padding: '3px 12px', // Slightly less padding on mobile
    fontSize: '0.75rem', // Slightly smaller font on mobile
  },
  '&:hover': {
    background: typeof themeColors.buttonHover === 'string' ? themeColors.buttonHover : themeColors.primaryDark,
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 16px ${alpha(themeColors.primary, 0.3)}`
  }
}));

const NotificationCenter = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(20px)',
    borderRadius: 16,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    minWidth: 380,
    maxHeight: 480,
    overflow: 'hidden'
  }
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  }
}));

const NotificationBadge = styled(Box)<{ count: number; themeColors: any }>(({ theme, count, themeColors }) => ({
  position: 'absolute',
  top: -6,
  right: -6,
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: `linear-gradient(135deg, #FF4444 0%, #FF6666 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.65rem',
  fontWeight: 700,
  color: '#fff',
  border: `2px solid ${themeColors.surface}`,
  boxShadow: `
    0 2px 8px rgba(255, 68, 68, 0.4),
    0 0 0 1px rgba(255, 68, 68, 0.2)
  `,
  animation: count > 0 ? `${pulse} 2s ease-in-out infinite` : 'none',
  transform: 'scale(0.9)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1)'
  }
}));

interface HeaderProps {
  onSidebarToggle: () => void;
  drawerWidth: number;
  mobileOpen?: boolean;
}

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'critical',
    icon: <CriticalIcon />,
    title: 'Hot Lead Alert',
    message: 'Dr. Martinez ready to purchase - 92% probability',
    time: '2m ago',
    unread: true
  },
  {
    id: '2',
    type: 'urgent',
    icon: <UrgentIcon />,
    title: 'Contract Expiring',
    message: 'Valley Dental contract renewal needed',
    time: '15m ago',
    unread: true
  },
  {
    id: '3',
    type: 'opportunity',
    icon: <OpportunityIcon />,
    title: 'New Opportunity',
    message: 'MedSpa chain interested in bulk order',
    time: '1h ago',
    unread: false
  },
  {
    id: '4',
    type: 'success',
    icon: <SuccessIcon />,
    title: 'Deal Closed',
    message: 'Successfully closed $85K implant deal',
    time: '3h ago',
    unread: false
  }
];

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, drawerWidth, mobileOpen = false }) => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const themeColors = getThemeColors(themeMode);
  
  // Sound effects
  const clickSound = useSound('ui-click-primary');
  const notificationSound = useSound('notification-success');

  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => n.unread).length);
  
  const open = Boolean(anchorEl);
  const usesSculpturalDesign = themeMode === 'gallery-dominance' || location.pathname.startsWith('/command-room');
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    clickSound.play();
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
    setUnreadCount(0);
    clickSound.play();
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleProfileMenuClose();
    clickSound.play();
  };
  
  const handleLogout = async () => {
    console.log('Logging out to demo mode');
    await signOut();
    window.location.reload();
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      critical: '#FF4444',
      urgent: '#FF9800',
      opportunity: '#4CAF50',
      success: '#2196F3'
    };
    return colors[type as keyof typeof colors] || colors.success;
  };

  return (
    <>
    <LuxuryAppBar
      position="fixed"
      elevation={0}
      themeColors={themeColors}
      sx={{
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ 
        gap: 2, 
        minHeight: { xs: 56, sm: 60 },
        padding: theme.spacing(0, 2)
      }}>
        {/* Mobile Menu Toggle */}
        {usesSculpturalDesign ? (
          <Box sx={{ mr: 1, display: { md: 'none' } }}>
            <SculpturalMenuToggle 
              open={mobileOpen} 
              onClick={onSidebarToggle}
              size="small"
            />
          </Box>
        ) : (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onSidebarToggle}
            sx={{ 
              mr: 1, 
              display: { md: 'none' },
              padding: 0.5
            }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Enhanced Search Bar */}
        <SearchBar 
          themeColors={themeColors}
          sx={{ 
            flex: { xs: '1 1 auto', md: 'unset' },
            maxWidth: { xs: 'calc(100% - 120px)', md: 400 }, // Leave space for sign up button on mobile
            minWidth: { xs: 0, sm: 200 } // Allow shrinking on mobile
          }}
        >
          <SearchIcon 
            sx={{ 
              color: searchFocused ? themeColors.primary : theme.palette.text.secondary,
              transition: 'color 0.3s ease',
              fontSize: 20
            }} 
          />
          <SearchInput
            placeholder="Search contacts, deals, insights..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{
              color: theme.palette.text.primary,
              '& input': {
                '&::placeholder': {
                  color: theme.palette.text.secondary
                }
              }
            }}
          />
        </SearchBar>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Email Sync Button */}
        {user && (
          <Box sx={{ mr: 1 }}>
            <EmailSyncButton variant="icon" />
          </Box>
        )}

        {/* Theme Toggle */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <ThemeToggle />
        </Box>

        {/* App Mode Toggle */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <AppModeToggle />
        </Box>

        {/* RepSpheres App Switcher */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <RepSpheresAppSwitcher />
        </Box>
        
        {/* Auth Buttons - Only show when not logged in */}
        {!user && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <LoginButton
              themeColors={themeColors}
              onClick={() => {
                setLoginOpen(true);
                clickSound.play();
              }}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Login
            </LoginButton>
            <SignUpButton
              themeColors={themeColors}
              onClick={() => {
                setSignupOpen(true);
                clickSound.play();
              }}
            >
              Sign Up
            </SignUpButton>
          </Box>
        )}

        {/* Enhanced Notifications - Always far right */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotificationOpen}
            sx={{ 
              color: theme.palette.text.primary,
              position: 'relative',
              padding: 1,
              '&:hover': {
                backgroundColor: alpha(themeColors.primary, 0.1)
              }
            }}
          >
            <NotificationsIcon sx={{ fontSize: 22 }} />
            {unreadCount > 0 && (
              <NotificationBadge count={unreadCount} themeColors={themeColors}>
                {unreadCount}
              </NotificationBadge>
            )}
          </IconButton>
        </Tooltip>

        {/* User Menu - Only show when logged in */}
        {user && (
          <Box>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0,
                border: `2px solid ${alpha(themeColors.primary, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: themeColors.primary,
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: themeColors.primary,
                  color: theme.palette.getContrastText(themeColors.primary),
                  width: 32,
                  height: 32,
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {getUserInitials(user)}
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
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {getUserDisplayName(user)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'No email'}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: alpha(themeColors.primary, 0.1) }} />
            <MenuItem 
              onClick={() => handleMenuItemClick('/profile')}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: alpha(themeColors.primary, 0.1)
                }
              }}
            >
              <PersonIcon sx={{ mr: 2 }} /> Profile
            </MenuItem>
            <MenuItem 
              onClick={() => handleMenuItemClick('/settings')}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  backgroundColor: alpha(themeColors.primary, 0.1)
                }
              }}
            >
              <SettingsIcon sx={{ mr: 2 }} /> Settings
            </MenuItem>
            <Divider sx={{ borderColor: alpha(themeColors.primary, 0.1) }} />
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.5,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                }
              }}
            >
              <LogoutIcon sx={{ mr: 2 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
        )}
      </Toolbar>
    </LuxuryAppBar>

    {/* Notification Center Popover */}
    <NotificationCenter
      open={Boolean(notificationAnchor)}
      anchorEl={notificationAnchor}
      onClose={handleNotificationClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: 400 }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          <IconButton size="small" onClick={handleNotificationClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
          {mockNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              alignItems="flex-start"
              onClick={() => {
                notificationSound.play();
                handleNotificationClose();
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: alpha(getNotificationColor(notification.type), 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: getNotificationColor(notification.type)
                  }}
                >
                  {notification.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                      {notification.time}
                    </Typography>
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </NotificationItem>
          ))}
        </List>
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          textAlign: 'center'
        }}>
          <Button 
            size="small" 
            sx={{ 
              textTransform: 'none',
              color: themeColors.primary,
              '&:hover': {
                backgroundColor: alpha(themeColors.primary, 0.1)
              }
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Box>
    </NotificationCenter>

    {/* Auth Modals */}
    <GlobalAuthModal 
      open={loginOpen} 
      onClose={() => setLoginOpen(false)}
      onSuccess={() => {
        setLoginOpen(false);
        window.location.reload();
      }}
    />
    <GlobalAuthModal open={signupOpen} onClose={() => setSignupOpen(false)} onSuccess={() => {
        setSignupOpen(false);
        window.location.reload();
      }} />
    </>
  );
};

export default Header;
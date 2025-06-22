import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip, 
  Button,
  Tooltip,
  Collapse,
  FormControlLabel,
  Switch,
  Slider,
  Menu,
  MenuItem,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  LocalFireDepartment as CriticalIcon,
  FlashOn as UrgentIcon,
  TrendingUp as OpportunityIcon,
  CheckCircle as SuccessIcon,
  Phone as CallIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Speed as SpeedIcon,
  Notifications as NotificationsIcon,
  Analytics as AnalyticsIcon,
  Timer as TimerIcon,
  NavigateNext as ActionIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  MoreVert as MoreVertIcon,
  FiberManualRecord as LiveIcon,
  Diamond as DiamondIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import { useSUISOptional } from '../../hooks/useSUIS';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound } from '../../hooks/useSound';

// Interfaces
interface ActionItem {
  id: string;
  priority: 'critical' | 'urgent' | 'opportunity' | 'success';
  icon: React.ReactNode;
  title: string;
  message: string;
  value?: string;
  time: string;
  timestamp: Date;
  action: {
    type: 'call' | 'email' | 'meeting' | 'followup';
    label: string;
    handler: () => void;
  };
  metrics?: {
    probability?: number;
    impact?: string;
    deadline?: string;
  };
  category: 'dental' | 'aesthetic' | 'both';
  aiScore?: number;
}

interface LayerConfig {
  critical: boolean;
  urgent: boolean;
  opportunity: boolean;
  success: boolean;
}

// Dynamic theme-aware color mapping that works with any theme
const getThemeColors = (theme: any) => {
  // Extract colors dynamically from the current theme
  const isDark = theme.palette.mode === 'dark';
  
  return {
    critical: { 
      bg: alpha(theme.palette.error.main, 0.08),
      border: alpha(theme.palette.error.main, 0.3),
      text: theme.palette.error.main,
      glow: alpha(theme.palette.error.main, 0.3),
      gradient: theme.palette.error.main
    },
    urgent: { 
      bg: alpha(theme.palette.warning.main, 0.08),
      border: alpha(theme.palette.warning.main, 0.3),
      text: theme.palette.warning.main,
      glow: alpha(theme.palette.warning.main, 0.3),
      gradient: theme.palette.warning.main
    },
    opportunity: { 
      bg: alpha(theme.palette.success.main, 0.08),
      border: alpha(theme.palette.success.main, 0.3),
      text: theme.palette.success.main,
      glow: alpha(theme.palette.success.main, 0.3),
      gradient: theme.palette.success.main
    },
    success: { 
      bg: alpha(theme.palette.primary.main, 0.08),
      border: alpha(theme.palette.primary.main, 0.3),
      text: theme.palette.primary.main,
      glow: alpha(theme.palette.primary.main, 0.3),
      gradient: theme.palette.primary.main
    },
    background: isDark 
      ? `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`
      : theme.palette.background.default,
    surface: alpha(theme.palette.background.paper, isDark ? 0.95 : 0.98),
    glassMorph: alpha(theme.palette.common.white, isDark ? 0.02 : 0.05)
  };
};

// Enhanced mock data for dental and aesthetic sales
const generateEnhancedMockData = (): ActionItem[] => {
  const dentalScenarios = [
    {
      id: 'd1',
      priority: 'critical' as const,
      icon: <CriticalIcon />,
      title: '🦷 IMPLANT SYSTEM INQUIRY',
      message: 'Dr. Martinez comparing 3i vs Nobel Biocare - 92% close probability',
      value: '$85K',
      time: '2 min',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      action: {
        type: 'call' as const,
        label: 'Call Now',
        handler: () => console.log('Calling Dr. Martinez')
      },
      metrics: {
        probability: 92,
        impact: 'High',
        deadline: '2 hours'
      },
      category: 'dental' as const,
      aiScore: 92
    },
    {
      id: 'd2',
      priority: 'urgent' as const,
      icon: <UrgentIcon />,
      title: '⚡ SURGICAL CENTER RUSH',
      message: 'Valley Surgical needs 50 implant kits by Thursday - $125K order',
      value: '$125K',
      time: '15 min',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: {
        type: 'email' as const,
        label: 'Send Quote',
        handler: () => console.log('Sending quote')
      },
      metrics: {
        probability: 85,
        impact: 'Very High',
        deadline: 'Thursday'
      },
      category: 'dental' as const,
      aiScore: 85
    },
    {
      id: 'd3',
      priority: 'critical' as const,
      icon: <WarningIcon />,
      title: '⚠️ COMPETITOR ALERT',
      message: 'Straumann rep spotted at Downtown Dental - Your #1 account',
      value: '$45K/mo',
      time: '30 min',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: {
        type: 'call' as const,
        label: 'Secure Account',
        handler: () => console.log('Calling account')
      },
      metrics: {
        probability: 78,
        impact: 'Critical',
        deadline: 'Today'
      },
      category: 'dental' as const,
      aiScore: 88
    }
  ];

  const aestheticScenarios = [
    {
      id: 'a1',
      priority: 'opportunity' as const,
      icon: <MoneyIcon />,
      title: '💉 BOTOX BULK ORDER',
      message: 'MedSpa chain ready to standardize on Allergan - $200K initial',
      value: '$200K',
      time: '5 min',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      action: {
        type: 'meeting' as const,
        label: 'Schedule Demo',
        handler: () => console.log('Scheduling demo')
      },
      metrics: {
        probability: 88,
        impact: 'Very High',
        deadline: 'This week'
      },
      category: 'aesthetic' as const,
      aiScore: 88
    },
    {
      id: 'a2',
      priority: 'urgent' as const,
      icon: <TimerIcon />,
      title: '🚨 FILLER INVENTORY LOW',
      message: 'Dr. Kim\'s Juvederm stock critical - Usually orders $45K monthly',
      value: '$45K',
      time: '1 hour',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      action: {
        type: 'call' as const,
        label: 'Reorder Call',
        handler: () => console.log('Calling for reorder')
      },
      metrics: {
        probability: 95,
        impact: 'High',
        deadline: 'Tomorrow'
      },
      category: 'aesthetic' as const,
      aiScore: 95
    },
    {
      id: 'a3',
      priority: 'success' as const,
      icon: <SparkleIcon />,
      title: '🎉 FDA APPROVAL NEWS',
      message: 'New dermal filler approved - Be first to offer RHA Collection',
      value: 'Market Lead',
      time: '45 min',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      action: {
        type: 'email' as const,
        label: 'Blast Email',
        handler: () => console.log('Sending announcement')
      },
      metrics: {
        probability: 100,
        impact: 'Strategic',
        deadline: 'This week'
      },
      category: 'aesthetic' as const,
      aiScore: 75
    }
  ];

  return [...dentalScenarios, ...aestheticScenarios].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
};

// Animation keyframes - Elegant and refined pulsation effects
const luxuryPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
`;

const luxuryGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px currentColor;
    opacity: 0.8;
  }
  50% {
    box-shadow: 0 0 25px currentColor, 0 0 35px currentColor;
    opacity: 1;
  }
`;

const subtleWave = keyframes`
  0%, 100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
`;

const smoothScroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const snakeBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled components
const TickerRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const ControlBar = styled(Box)<{ themeColors: any; reducedMotion?: boolean }>(({ theme, themeColors, reducedMotion = false }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  background: themeColors.surface,
  backdropFilter: reducedMotion ? 'none' : 'blur(20px)',
  borderRadius: '12px 12px 0 0',
  borderBottom: `1px solid ${alpha(themeColors.glassMorph, 0.2)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.5)}, transparent)`,
    animation: reducedMotion ? 'none' : `${shimmer} 3s infinite`
  }
}));

const LiveIndicator = styled(Box)<{ active: boolean; reducedMotion?: boolean }>(({ active, theme, reducedMotion = false }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  background: active ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
  border: `1px solid ${active ? alpha(theme.palette.error.main, 0.3) : alpha(theme.palette.grey[500], 0.3)}`,
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: active ? theme.palette.error.main : theme.palette.grey[500],
    animation: active && !reducedMotion ? `${luxuryPulse} 2s ease-in-out infinite` : 'none',
    boxShadow: active && !reducedMotion ? `0 0 10px ${theme.palette.error.main}` : 'none'
  }
}));

const LayerControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginLeft: 'auto'
}));

const LayerToggle: React.FC<{
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  active: boolean;
  priority: string;
  themeColors: any;
  onClick: () => void;
}> = ({ label, variant = 'outlined', size = 'small', active, priority, themeColors, onClick }) => {
  const color = themeColors[priority] || themeColors.success;
  
  // Use solid colors for alpha operations
  const borderColor = typeof color.border === 'string' && !color.border.includes('gradient') 
    ? color.border 
    : 'rgba(255, 255, 255, 0.2)';
  const textColor = typeof color.text === 'string' && !color.text.includes('gradient')
    ? color.text
    : '#ffffff';
  
  return (
    <Chip
      label={label}
      variant={variant}
      size={size}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: active ? color.bg : 'transparent',
        borderColor: active ? borderColor : alpha(borderColor, 0.3),
        color: active ? textColor : alpha(textColor, 0.6),
        fontSize: '0.75rem',
        height: 28,
        fontWeight: active ? 600 : 400,
        backdropFilter: 'blur(10px)',
        '&:hover': {
          background: color.bg,
          borderColor: borderColor,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${color.glow}`
        },
        '& .MuiChip-label': {
          paddingLeft: '12px',
          paddingRight: '12px'
        }
      }}
    />
  );
};

const MainTicker = styled(Box)<{ themeColors: any }>(({ themeColors }) => ({
  position: 'relative',
  height: 56,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: themeColors.background,
  borderRadius: '0 0 12px 12px',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    zIndex: 2,
    pointerEvents: 'none'
  },
  '&::before': {
    left: 0,
    background: `linear-gradient(90deg, ${themeColors.background} 0%, transparent 100%)`
  },
  '&::after': {
    right: 0,
    background: `linear-gradient(90deg, transparent 0%, ${themeColors.background} 100%)`
  }
}));

const TickerContent = styled(Box)<{ paused: boolean; speed: number; reducedMotion?: boolean }>(({ paused, speed = 1, reducedMotion = false }) => ({
  display: 'flex',
  alignItems: 'center',
  animation: paused || reducedMotion ? 'none' : `${smoothScroll} ${80 / speed}s linear infinite`,
  whiteSpace: 'nowrap',
  gap: 32,
  paddingLeft: 32,
  paddingRight: 32,
  // Use transform for mobile scrolling (better performance)
  ...(reducedMotion && !paused ? {
    transform: 'translateX(-10%)',
    transition: 'transform 10s linear'
  } : {})
}));

const ActionCard = styled(Box)<{ priority: string; active?: boolean; themeColors: any; reducedMotion?: boolean }>(({ priority, active = false, themeColors, reducedMotion = false }) => {
  const color = themeColors[priority] || themeColors.success;
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 20px',
    background: color.bg,
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    minWidth: reducedMotion ? 320 : 380, // Smaller on mobile
    height: 48,
    flexShrink: 0,
    overflow: 'hidden',
    backdropFilter: reducedMotion ? 'none' : 'blur(10px)', // Disable blur on mobile
    border: `1px solid ${color.border}`,
    animation: reducedMotion ? 'none' : 
               priority === 'critical' ? `${luxuryPulse} 4s ease-in-out infinite` : 
               priority === 'urgent' ? `${subtleWave} 3s ease-in-out infinite` : 'none',
    boxShadow: reducedMotion ? 'none' : `0 2px 12px ${alpha(color.glow, 0.2)}`,
    '&:hover': {
      transform: reducedMotion ? 'none' : 'translateY(-2px)',
      boxShadow: reducedMotion ? 'none' : `0 4px 20px ${alpha(color.glow, 0.3)}`,
      borderColor: color.text,
      background: color.bg,
      '& .action-button': {
        transform: 'translateX(0)',
        opacity: 1
      }
    },
    '&::before': priority === 'critical' || active ? {
      content: '""',
      position: 'absolute',
      top: -1,
      left: -1,
      right: -1,
      bottom: -1,
      borderRadius: 'inherit',
      padding: '1px',
      background: color.gradient,
      backgroundSize: '200% 100%',
      animation: reducedMotion ? 'none' : `${snakeBorder} 3s linear infinite`,
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      opacity: reducedMotion ? 0 : 0.8, // Hide complex effects on mobile
    } : {}
  };
});

const PriorityIcon = styled(Box)<{ priority: string; themeColors: any; reducedMotion?: boolean }>(({ priority, themeColors, reducedMotion = false }) => {
  const color = themeColors[priority] || themeColors.success;
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: alpha(color.text, 0.1),
    border: `1px solid ${alpha(color.text, 0.2)}`,
    animation: reducedMotion ? 'none' : priority === 'critical' ? `${subtleWave} 3s ease-in-out infinite` : 'none',
    '& svg': {
      fontSize: 18,
      color: color.text
    }
  };
});

const MetricBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 12px',
  borderRadius: 16,
  background: alpha(theme.palette.common.white, 0.05),
  backdropFilter: 'blur(10px)',
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.5px'
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

const LiveActionTicker: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const themeColors = getThemeColors(theme);
  
  // Performance optimizations for mobile
  // - Disables complex animations (pulse, glow, shimmer, border animations)
  // - Reduces update frequency (60s vs 30s)
  // - Disables backdrop filters and box shadows
  // - Limits number of items displayed
  // - Disables sound by default
  // - Respects user's reduced motion preference
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldReduceAnimations = isMobile || prefersReducedMotion;
  
  // State
  const [items, setItems] = useState<ActionItem[]>(generateEnhancedMockData());
  const [playing, setPlaying] = useState(!shouldReduceAnimations); // Pause on mobile by default
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(shouldReduceAnimations ? 0.25 : 0.5); // Slower on mobile
  const [soundEnabled, setSoundEnabled] = useState(!isMobile); // Disable sound on mobile by default
  const [layers, setLayers] = useState<LayerConfig>({
    critical: true,
    urgent: true,
    opportunity: shouldReduceAnimations ? false : true, // Show fewer layers on mobile
    success: shouldReduceAnimations ? false : true
  });
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(3);

  // Sound hooks
  const criticalSound = useSound('notification-urgent');
  const successSound = useSound('notification-success');
  const clickSound = useSound('ui-click-primary');

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    // Reduce update frequency on mobile to save battery/CPU
    const updateInterval = shouldReduceAnimations ? 60000 : 30000; // 60s on mobile, 30s on desktop
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const mockData = generateEnhancedMockData();
        const newItem = mockData[Math.floor(Math.random() * mockData.length)];
        
        setItems(prev => {
          const updated = [{ ...newItem, id: Date.now().toString(), time: 'Just now' }, ...prev];
          return updated.slice(0, shouldReduceAnimations ? 10 : 20); // Fewer items on mobile
        });
        
        setUnreadCount(prev => prev + 1);
        
        // Play sound for critical items (if enabled and not on mobile)
        if (soundEnabled && !shouldReduceAnimations && newItem.priority === 'critical') {
          criticalSound.play();
        }
        
        // Browser notification for critical items (desktop only)
        if (!isMobile && 
            'Notification' in window && 
            Notification.permission === 'granted' && 
            newItem.priority === 'critical') {
          new Notification('Critical Sales Alert', {
            body: newItem.message,
            icon: '/favicon.ico',
            tag: newItem.id
          });
        }
      }
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [soundEnabled, criticalSound, shouldReduceAnimations, isMobile]);

  const handleLayerToggle = (layer: keyof LayerConfig) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    clickSound.play();
  };

  const handleActionClick = (item: ActionItem) => {
    item.action.handler();
    successSound.play();
  };

  // Filter items based on active layers
  const visibleItems = items.filter(item => layers[item.priority]);
  
  // Group items by priority
  const groupedItems = {
    critical: items.filter(i => i.priority === 'critical'),
    urgent: items.filter(i => i.priority === 'urgent'),
    opportunity: items.filter(i => i.priority === 'opportunity'),
    success: items.filter(i => i.priority === 'success')
  };

  return (
    <TickerRoot>
      {/* Control Bar */}
      <ControlBar themeColors={themeColors} reducedMotion={shouldReduceAnimations}>
        <LiveIndicator active={playing} reducedMotion={shouldReduceAnimations}>
          <Box className="dot" />
          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            {playing ? 'LIVE' : 'PAUSED'}
          </Typography>
        </LiveIndicator>

        <IconButton 
          size="small" 
          onClick={() => {
            setPlaying(!playing);
            clickSound.play();
          }}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SpeedIcon sx={{ fontSize: 16, color: alpha(theme.palette.text.primary, 0.5) }} />
          <Slider
            value={speed}
            onChange={(e, val) => setSpeed(val as number)}
            min={0.5}
            max={2}
            step={0.5}
            sx={{ 
              width: 80, 
              '& .MuiSlider-thumb': { 
                width: 14, 
                height: 14,
                '&:hover': {
                  boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`
                }
              },
              '& .MuiSlider-track': {
                background: theme.palette.primary.main
              }
            }}
            size="small"
          />
          <Typography variant="caption" sx={{ minWidth: 30, fontSize: '0.7rem', fontWeight: 600 }}>
            {speed}x
          </Typography>
        </Box>

        <IconButton 
          size="small" 
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            clickSound.play();
          }}
          sx={{ 
            color: soundEnabled ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.3),
            '&:hover': {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>

        <IconButton 
          size="small" 
          onClick={(e) => {
            setNotificationAnchor(e.currentTarget);
            setUnreadCount(0);
            clickSound.play();
          }}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton 
          size="small" 
          onClick={(e) => {
            setSettingsAnchor(e.currentTarget);
            clickSound.play();
          }}
          sx={{ 
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <SettingsIcon />
        </IconButton>

        <LayerControls>
          <LayerToggle
            label={`Critical (${groupedItems.critical.length})`}
            variant="outlined"
            size="small"
            active={layers.critical}
            priority="critical"
            themeColors={themeColors}
            onClick={() => handleLayerToggle('critical')}
          />
          <LayerToggle
            label={`Urgent (${groupedItems.urgent.length})`}
            variant="outlined"
            size="small"
            active={layers.urgent}
            priority="urgent"
            themeColors={themeColors}
            onClick={() => handleLayerToggle('urgent')}
          />
          <LayerToggle
            label={`Opportunities (${groupedItems.opportunity.length})`}
            variant="outlined"
            size="small"
            active={layers.opportunity}
            priority="opportunity"
            themeColors={themeColors}
            onClick={() => handleLayerToggle('opportunity')}
          />
          <LayerToggle
            label={`Success (${groupedItems.success.length})`}
            variant="outlined"
            size="small"
            active={layers.success}
            priority="success"
            themeColors={themeColors}
            onClick={() => handleLayerToggle('success')}
          />
        </LayerControls>
      </ControlBar>

      {/* Main Ticker */}
      <MainTicker themeColors={themeColors}>
        <TickerContent paused={!playing} speed={speed} reducedMotion={shouldReduceAnimations}>
          {[...visibleItems, ...visibleItems].map((item, index) => (
            <ActionCard 
              key={`${item.id}-${index}`}
              priority={item.priority}
              themeColors={themeColors}
              reducedMotion={shouldReduceAnimations}
              onClick={() => handleActionClick(item)}
            >
              <PriorityIcon priority={item.priority} themeColors={themeColors} reducedMotion={shouldReduceAnimations}>
                {item.icon}
              </PriorityIcon>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: themeColors[item.priority]?.text,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.5px'
                  }}
                >
                  {item.message}
                </Typography>
              </Box>
              
              {item.metrics?.probability && (
                <MetricBadge>
                  <DiamondIcon sx={{ fontSize: 12 }} />
                  {item.metrics.probability}% AI
                </MetricBadge>
              )}
              
              {item.value && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: themeColors[item.priority]?.text,
                    letterSpacing: '0.5px'
                  }}
                >
                  {item.value}
                </Typography>
              )}
              
              <Button
                size="small"
                className="action-button"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  py: 0.5,
                  px: 1.5,
                  minWidth: 'auto',
                  background: alpha(themeColors[item.priority]?.text || '#fff', 0.1),
                  color: themeColors[item.priority]?.text,
                  border: `1px solid ${alpha(themeColors[item.priority]?.text || '#fff', 0.2)}`,
                  transform: 'translateX(10px)',
                  opacity: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(themeColors[item.priority]?.text || '#fff', 0.2),
                    borderColor: themeColors[item.priority]?.text
                  }
                }}
              >
                {item.action.label}
              </Button>
            </ActionCard>
          ))}
        </TickerContent>
      </MainTicker>

      {/* Notification Center */}
      <NotificationCenter
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Notifications
          </Typography>
          <List sx={{ width: '100%' }}>
            {items.slice(0, 5).map((item) => (
              <React.Fragment key={item.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: 0,
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PriorityIcon priority={item.priority} themeColors={themeColors}>
                      {item.icon}
                    </PriorityIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.message}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {item.value}
                        </Typography>
                        {" — "}{item.time} ago
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </NotificationCenter>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{
          sx: {
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 2
          }
        }}
      >
        <MenuItem>
          <FormControlLabel
            control={<Switch size="small" checked={true} />}
            label="Auto-refresh data"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch size="small" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />}
            label="Sound notifications"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch size="small" />}
            label="Desktop notifications"
          />
        </MenuItem>
      </Menu>
    </TickerRoot>
  );
};

export default LiveActionTicker;
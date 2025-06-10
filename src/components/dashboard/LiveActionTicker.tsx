import React, { useState, useEffect, useCallback } from 'react';
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
  Badge
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
  Notifications as AlertIcon,
  Analytics as AnalyticsIcon,
  Timer as TimerIcon,
  NavigateNext as ActionIcon
} from '@mui/icons-material';

// Animation keyframes
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
`;

const scroll = keyframes`
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

// Types
interface ActionItem {
  id: string;
  priority: 'critical' | 'urgent' | 'opportunity' | 'success';
  icon: React.ReactNode;
  title: string;
  message: string;
  value?: string;
  time: string;
  action: {
    type: 'call' | 'email' | 'schedule' | 'view';
    label: string;
    handler: () => void;
  };
  metrics?: {
    probability?: number;
    impact?: string;
    deadline?: string;
  };
}

interface LayerConfig {
  critical: boolean;
  urgent: boolean;
  opportunity: boolean;
  success: boolean;
}

// Styled Components
const TickerRoot = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  height: 'auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
    animation: `${shimmer} 3s infinite`
  }
}));

const ControlBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '6px 16px',
  background: 'rgba(0, 0, 0, 0.5)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  gap: 8,
  minHeight: 36
}));

const LiveIndicator = styled(Box)<{ active: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '2px 8px',
  borderRadius: 12,
  background: active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
  '& .dot': {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: active ? '#EF4444' : '#666',
    animation: active ? `${pulse} 1.5s ease-in-out infinite` : 'none'
  }
}));

const LayerControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 8,
  marginLeft: 'auto'
}));

const LayerToggle = styled(Chip)<{ active: boolean; priority: string }>(({ active, priority }) => {
  const colors = {
    critical: { bg: '#DC2626', light: 'rgba(220, 38, 38, 0.1)' },
    urgent: { bg: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)' },
    opportunity: { bg: '#10B981', light: 'rgba(16, 185, 129, 0.1)' },
    success: { bg: '#3B82F6', light: 'rgba(59, 130, 246, 0.1)' }
  };
  
  const color = colors[priority as keyof typeof colors];
  
  return {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: active ? color.light : 'transparent',
    borderColor: active ? color.bg : 'rgba(255, 255, 255, 0.2)',
    color: active ? color.bg : 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.7rem',
    height: 24,
    '&:hover': {
      background: color.light,
      borderColor: color.bg,
      transform: 'translateY(-1px)'
    }
  };
});

const MainTicker = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 48,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: 'rgba(0, 0, 0, 0.3)'
}));

const TickerContent = styled(Box)<{ paused: boolean }>(({ paused }) => ({
  display: 'flex',
  alignItems: 'center',
  animation: paused ? 'none' : `${scroll} 60s linear infinite`,
  whiteSpace: 'nowrap',
  gap: 24
}));

const ActionCard = styled(Box)<{ priority: string }>(({ priority }) => {
  const colors = {
    critical: { 
      bg: 'rgba(220, 38, 38, 0.08)', 
      border: 'rgba(220, 38, 38, 0.3)',
      text: '#EF4444',
      glow: 'rgba(220, 38, 38, 0.3)'
    },
    urgent: { 
      bg: 'rgba(245, 158, 11, 0.08)', 
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.3)'
    },
    opportunity: { 
      bg: 'rgba(16, 185, 129, 0.08)', 
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#10B981',
      glow: 'rgba(16, 185, 129, 0.3)'
    },
    success: { 
      bg: 'rgba(59, 130, 246, 0.08)', 
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#3B82F6',
      glow: 'rgba(59, 130, 246, 0.3)'
    }
  };
  
  const color = colors[priority as keyof typeof colors];
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 16px',
    background: color.bg,
    border: `1px solid ${color.border}`,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    minWidth: 320,
    height: 36,
    flexShrink: 0,
    '&:hover': {
      transform: 'translateY(-1px)',
      borderColor: color.text,
      background: priority === 'critical' ? 'rgba(220, 38, 38, 0.12)' : color.bg
    }
  };
});

const PriorityIcon = styled(Box)<{ priority: string }>(({ priority }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: priority === 'critical' ? 'rgba(220, 38, 38, 0.15)' : 
              priority === 'urgent' ? 'rgba(245, 158, 11, 0.15)' :
              priority === 'opportunity' ? 'rgba(16, 185, 129, 0.15)' :
              'rgba(59, 130, 246, 0.15)',
  animation: priority === 'critical' ? `${pulse} 2s ease-in-out infinite` : 'none',
  '& svg': {
    fontSize: 16
  }
}));

const MetricBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 8px',
  borderRadius: 12,
  background: 'rgba(255, 255, 255, 0.05)',
  fontSize: '0.75rem',
  fontWeight: 600
}));

const ExpandedView = styled(Collapse)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.3)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
}));

const CategorySection = styled(Box)(({ theme }) => ({
  padding: '20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  '&:last-child': {
    borderBottom: 'none'
  }
}));

// Sample data
const generateActionItems = (): ActionItem[] => [
  {
    id: '1',
    priority: 'critical',
    icon: <CriticalIcon />,
    title: 'CLOSING ALERT',
    message: 'Dr. Martinez ready to sign $285K implant system - needs call in next 30 min',
    value: '$285K',
    time: '2 min',
    action: {
      type: 'call',
      label: 'Call Now',
      handler: () => console.log('Calling Dr. Martinez...')
    },
    metrics: {
      probability: 95,
      impact: '$285K',
      deadline: '30 min'
    }
  },
  {
    id: '2',
    priority: 'critical',
    icon: <AlertIcon />,
    title: 'COMPETITOR ALERT',
    message: 'Straumann rep at Premier Dental - our $180K renewal at risk',
    value: 'URGENT',
    time: '5 min',
    action: {
      type: 'call',
      label: 'Intervene',
      handler: () => console.log('Calling Premier Dental...')
    },
    metrics: {
      probability: 85,
      impact: '$180K',
      deadline: 'NOW'
    }
  },
  {
    id: '3',
    priority: 'urgent',
    icon: <UrgentIcon />,
    title: 'HOT LEAD',
    message: '3 practices showing 90%+ purchase intent - schedule visits today',
    value: '$450K',
    time: '15 min',
    action: {
      type: 'schedule',
      label: 'Schedule',
      handler: () => console.log('Opening calendar...')
    },
    metrics: {
      probability: 90,
      impact: '$450K',
      deadline: 'Today'
    }
  },
  {
    id: '4',
    priority: 'urgent',
    icon: <TimerIcon />,
    title: 'QUOTE DUE',
    message: 'Dr. Chen expecting laser system proposal by 3 PM',
    value: '$125K',
    time: '1 hr',
    action: {
      type: 'email',
      label: 'Send Quote',
      handler: () => console.log('Opening email...')
    },
    metrics: {
      probability: 75,
      impact: '$125K',
      deadline: '3 PM'
    }
  },
  {
    id: '5',
    priority: 'opportunity',
    icon: <OpportunityIcon />,
    title: 'EXPANSION OPP',
    message: 'Valley Ortho interested in adding 2nd location - huge growth potential',
    value: '$520K',
    time: '2 hrs',
    action: {
      type: 'view',
      label: 'View Details',
      handler: () => console.log('Opening opportunity...')
    },
    metrics: {
      probability: 70,
      impact: '$520K',
      deadline: 'This week'
    }
  },
  {
    id: '6',
    priority: 'success',
    icon: <SuccessIcon />,
    title: 'WIN CLOSED',
    message: 'Riverside Dental purchase approved - process order immediately',
    value: '$195K',
    time: '30 min',
    action: {
      type: 'view',
      label: 'Process',
      handler: () => console.log('Processing order...')
    },
    metrics: {
      probability: 100,
      impact: '$195K',
      deadline: 'Complete'
    }
  }
];

const LiveActionTicker: React.FC = () => {
  const [items, setItems] = useState<ActionItem[]>(generateActionItems());
  const [playing, setPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [layers, setLayers] = useState<LayerConfig>({
    critical: true,
    urgent: true,
    opportunity: true,
    success: true
  });
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);

  // Filter items based on active layers
  const visibleItems = items.filter(item => layers[item.priority]);
  
  // Group items by priority
  const groupedItems = {
    critical: items.filter(i => i.priority === 'critical'),
    urgent: items.filter(i => i.priority === 'urgent'),
    opportunity: items.filter(i => i.priority === 'opportunity'),
    success: items.filter(i => i.priority === 'success')
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random new critical item occasionally
      if (Math.random() > 0.95) {
        const newItem: ActionItem = {
          id: Date.now().toString(),
          priority: 'critical',
          icon: <CriticalIcon />,
          title: 'NEW URGENT',
          message: 'New critical action required',
          value: '$' + Math.floor(Math.random() * 500) + 'K',
          time: 'Just now',
          action: {
            type: 'call',
            label: 'Action',
            handler: () => console.log('New action')
          },
          metrics: {
            probability: 90,
            impact: 'High',
            deadline: 'ASAP'
          }
        };
        setItems(prev => [newItem, ...prev].slice(0, 20));
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLayerToggle = (layer: keyof LayerConfig) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleActionClick = (item: ActionItem) => {
    // Execute the action
    item.action.handler();
    
    // Could also update the item status, send analytics, etc.
    console.log('Action clicked:', item);
  };


  return (
    <TickerRoot>
      {/* Control Bar */}
      <ControlBar>
        <LiveIndicator active={playing}>
          <Box className="dot" />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
            {playing ? 'LIVE' : 'PAUSED'}
          </Typography>
        </LiveIndicator>

        <IconButton 
          size="small" 
          onClick={() => setPlaying(!playing)}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SpeedIcon sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }} />
          <Slider
            value={speed}
            onChange={(e, val) => setSpeed(val as number)}
            min={0.5}
            max={2}
            step={0.5}
            sx={{ width: 60, '& .MuiSlider-thumb': { width: 12, height: 12 } }}
            size="small"
          />
          <Typography variant="caption" sx={{ minWidth: 25, fontSize: '0.65rem' }}>
            {speed}x
          </Typography>
        </Box>

        <IconButton 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {expanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>

        <IconButton 
          size="small" 
          onClick={(e) => setSettingsAnchor(e.currentTarget)}
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
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
            onClick={() => handleLayerToggle('critical')}
          />
          <LayerToggle
            label={`Urgent (${groupedItems.urgent.length})`}
            variant="outlined"
            size="small"
            active={layers.urgent}
            priority="urgent"
            onClick={() => handleLayerToggle('urgent')}
          />
          <LayerToggle
            label={`Opportunities (${groupedItems.opportunity.length})`}
            variant="outlined"
            size="small"
            active={layers.opportunity}
            priority="opportunity"
            onClick={() => handleLayerToggle('opportunity')}
          />
          <LayerToggle
            label={`Success (${groupedItems.success.length})`}
            variant="outlined"
            size="small"
            active={layers.success}
            priority="success"
            onClick={() => handleLayerToggle('success')}
          />
        </LayerControls>
      </ControlBar>

      {/* Main Ticker */}
      <MainTicker>
        <TickerContent paused={!playing}>
          {[...visibleItems, ...visibleItems].map((item, index) => (
            <ActionCard 
              key={`${item.id}-${index}`}
              priority={item.priority}
              onClick={() => handleActionClick(item)}
            >
              <PriorityIcon priority={item.priority}>
                {React.cloneElement(item.icon as React.ReactElement, { 
                  sx: { color: item.priority === 'critical' ? '#DC2626' : 
                        item.priority === 'urgent' ? '#F59E0B' :
                        item.priority === 'opportunity' ? '#10B981' : '#3B82F6' }
                })}
              </PriorityIcon>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: item.priority === 'critical' ? '#EF4444' : 
                           item.priority === 'urgent' ? '#F59E0B' :
                           item.priority === 'opportunity' ? '#10B981' : '#3B82F6',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.message}
                </Typography>
              </Box>
              
              {item.value && (
                <Chip 
                  label={item.value} 
                  size="small"
                  sx={{ 
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                />
              )}
            </ActionCard>
          ))}
        </TickerContent>
      </MainTicker>

      {/* Expanded View */}
      <ExpandedView in={expanded}>
        {layers.critical && groupedItems.critical.length > 0 && (
          <CategorySection>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                mb: 2,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FF6B6B',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CriticalIcon /> Critical Actions ({groupedItems.critical.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {groupedItems.critical.map(item => (
                <ActionCard 
                  key={item.id}
                  priority={item.priority}
                  onClick={() => handleActionClick(item)}
                  sx={{ width: '100%', minWidth: 'auto' }}
                >
                  <PriorityIcon priority={item.priority}>
                    {item.icon}
                  </PriorityIcon>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.message}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {item.time} ago
                      </Typography>
                      {item.metrics && (
                        <>
                          <Typography variant="caption">
                            Impact: {item.metrics.impact}
                          </Typography>
                          <Typography variant="caption">
                            Deadline: {item.metrics.deadline}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  <Button
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.7rem',
                      py: 0.5,
                      px: 1.5,
                      minWidth: 'auto'
                    }}
                  >
                    {item.action.label}
                  </Button>
                </ActionCard>
              ))}
            </Box>
          </CategorySection>
        )}
      </ExpandedView>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{
          sx: {
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <MenuItem>
          <FormControlLabel
            control={<Switch size="small" defaultChecked />}
            label="Auto-refresh data"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<Switch size="small" defaultChecked />}
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
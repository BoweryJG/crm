import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  NavigateNext as ActionIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSUIS } from '../../hooks/useSUIS';

// Import NowCards data
const nowCardsData = [
  { 
    id: '1', 
    title: '🔥 HOT LEAD: Dr. Sarah Chen - Implant System', 
    description: 'Dr. Chen from Advanced Dental Care has shown 7 strong purchase signals for the new implant system.', 
    priority: 'high', 
    type: 're_engagement', 
    contactName: 'Dr. Sarah Chen', 
    companyName: 'Advanced Dental Care',
    aiInsight: 'AI detected 94% purchase probability. Practice mentioned patient backlog for implant procedures and insurance reimbursement improvements.',
    confidenceScore: 94,
    timeframe: 'Next 24-48 hours',
    actionRequired: 'Schedule in-office demo with clinical specialist'
  },
  { 
    id: '2', 
    title: '⚡ COMPETITOR THREAT: Dr. Rodriguez - Botox', 
    description: 'Dr. Rodriguez comparing Botox suppliers - Allergan mentioned multiple times.', 
    priority: 'high', 
    type: 'competitor_threat', 
    contactName: 'Dr. Mike Rodriguez', 
    companyName: 'Aesthetic Medicine Associates',
    aiInsight: 'Practice evaluating alternative suppliers. 72% close rate when providing clinical efficacy comparisons within 6 hours.',
    confidenceScore: 87,
    timeframe: 'Next 6 hours critical',
    actionRequired: 'Send competitive analysis immediately'
  },
  { 
    id: '3', 
    title: '💰 CONTRACT RENEWAL: Valley Ortho - Sutures', 
    description: 'Annual suture contract renewal worth $240K approaching deadline.', 
    priority: 'high', 
    type: 'renewal_risk', 
    contactName: 'Procurement Dept', 
    companyName: 'Valley Orthopedics Group',
    aiInsight: 'Contract expires in 10 days. Competitor (Ethicon) has been visiting frequently. 85% retention rate with proactive renewal.',
    confidenceScore: 78,
    timeframe: 'Next 10 days',
    actionRequired: 'Submit renewal with 5% loyalty discount'
  },
  { 
    id: '4', 
    title: '🎯 PURCHASE INTENT: Dr. Thompson - Digital Scanner', 
    description: 'Comparing digital impression scanners - high engagement with iTero content.', 
    priority: 'medium', 
    type: 'purchase_intent', 
    contactName: 'Dr. James Thompson', 
    companyName: 'Thompson Family Dentistry',
    aiInsight: 'Downloaded ROI calculator, attended webinar, requested peer references. 68% close rate at this engagement level.',
    confidenceScore: 68,
    timeframe: 'Next 2 weeks',
    actionRequired: 'Arrange peer reference calls'
  },
  { 
    id: '5', 
    title: '⏰ URGENT REQUEST: Dr. Kim - Surgical Tools', 
    description: 'Needs specific bone graft instruments for scheduled surgery.', 
    priority: 'medium', 
    type: 'urgent_need', 
    contactName: 'Dr. Jennifer Kim', 
    companyName: 'Kim Oral Surgery',
    aiInsight: 'Practice has scheduled complex cases requiring specific instrumentation. 73% close rate with expedited delivery.',
    confidenceScore: 73,
    timeframe: 'Next 5 days',
    actionRequired: 'Offer express delivery + loaner kit'
  }
];

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

const snakeBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
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

const ActionCard = styled(Box)<{ priority: string; active?: boolean }>(({ priority, active = false }) => {
  const colors = {
    critical: { 
      bg: 'rgba(220, 38, 38, 0.08)', 
      border: 'rgba(220, 38, 38, 0.3)',
      text: '#EF4444',
      glow: 'rgba(220, 38, 38, 0.3)',
      gradient: '#DC2626'
    },
    urgent: { 
      bg: 'rgba(245, 158, 11, 0.08)', 
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.3)',
      gradient: '#F59E0B'
    },
    opportunity: { 
      bg: 'rgba(16, 185, 129, 0.08)', 
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#10B981',
      glow: 'rgba(16, 185, 129, 0.3)',
      gradient: '#10B981'
    },
    success: { 
      bg: 'rgba(59, 130, 246, 0.08)', 
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#3B82F6',
      glow: 'rgba(59, 130, 246, 0.3)',
      gradient: '#3B82F6'
    }
  };
  
  const color = colors[priority as keyof typeof colors] || colors.success;
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    background: `linear-gradient(135deg, ${color.bg} 0%, rgba(0,0,0,0.05) 100%)`,
    borderRadius: 10,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    minWidth: 350,
    height: 42,
    flexShrink: 0,
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-1px) scale(1.02)',
      background: `linear-gradient(135deg, ${color.bg} 0%, rgba(0,0,0,0.08) 100%)`,
    },
    // Snake border animation
    '&::before': priority === 'critical' || active ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: '2px',
      background: `linear-gradient(90deg, ${color.gradient}, ${color.text}, ${color.gradient})`,
      backgroundSize: '200% 100%',
      animation: `${snakeBorder} 3s linear infinite`,
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      opacity: 0.8,
    } : {}
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

// Convert NowCards data to ticker format
const generateActionItems = (): ActionItem[] => {
  return nowCardsData.map((card, index) => {
    // Map priority
    const getPriority = (priority: string) => {
      if (priority === 'high') return 'critical';
      if (priority === 'medium') return 'urgent';
      return 'opportunity';
    };

    // Determine action type based on card type
    const getAction = (type: string) => {
      switch (type) {
        case 'competitor_threat':
        case 'renewal_risk':
          return { type: 'call' as const, label: 'Call Now', handler: () => console.log('Calling...') };
        case 're_engagement':
        case 'purchase_intent':
          return { type: 'email' as const, label: 'Send Info', handler: () => console.log('Sending...') };
        case 'urgent_need':
          return { type: 'schedule' as const, label: 'Schedule', handler: () => console.log('Scheduling...') };
        default:
          return { type: 'view' as const, label: 'View', handler: () => console.log('Viewing...') };
      }
    };

    // Extract value from title if present
    const extractValue = (title: string) => {
      const match = title.match(/\$(\d+)K/);
      return match ? match[0] : '';
    };

    return {
      id: card.id,
      priority: getPriority(card.priority),
      icon: card.priority === 'high' ? <CriticalIcon /> : 
            card.priority === 'medium' ? <UrgentIcon /> : 
            <OpportunityIcon />,
      title: card.title.split(':')[0].replace(/[🔥⚡💰🎯⏰🔄📊]/g, '').trim(),
      message: card.description,
      value: extractValue(card.title) || `${card.confidenceScore}% AI`,
      time: '2 min',
      action: getAction(card.type),
      metrics: {
        probability: card.confidenceScore,
        impact: extractValue(card.title),
        deadline: card.timeframe
      }
    };
  });
};

const LiveActionTicker: React.FC = () => {
  // Use SUIS data for real intelligence
  let suisContext;
  try {
    suisContext = useSUIS();
  } catch (error) {
    // SUIS not available, will use fallback data
    suisContext = null;
  }
  
  const { state } = suisContext || { state: null };
  const { marketIntelligence, notifications } = state || { marketIntelligence: [], notifications: [] };
  
  // Transform SUIS data into ticker format
  const tickerData = useMemo(() => {
    const items: ActionItem[] = [];
    
    // Convert market intelligence to ticker items
    if (marketIntelligence && marketIntelligence.length > 0) {
      marketIntelligence.forEach((intel: any) => {
        items.push({
          id: intel.id,
          priority: intel.data?.impact === 'high' ? 'critical' : 'urgent',
          icon: intel.intelligenceType === 'competitor_move' ? <UrgentIcon /> : <OpportunityIcon />,
          title: intel.intelligenceType.toUpperCase(),
          message: intel.data?.trend || intel.data?.action || 'Market Intelligence Update',
          value: intel.confidenceScore ? `${Math.round(intel.confidenceScore * 100)}% AI` : '',
          time: '2 min',
          action: {
            type: 'view' as const,
            label: 'View Details',
            handler: () => console.log('View intelligence:', intel.id)
          },
          metrics: {
            probability: Math.round((intel.confidenceScore || 0.5) * 100),
            impact: intel.data?.impact || 'medium',
            deadline: intel.expiresAt ? new Date(intel.expiresAt).toLocaleDateString() : 'N/A'
          }
        });
      });
    }
    
    // Convert notifications to ticker items
    if (notifications && notifications.length > 0) {
      notifications.slice(0, 5).forEach((notif: any) => {
        if (!notif.readAt) {
          items.push({
            id: notif.id,
            priority: notif.priority === 'high' ? 'critical' : 'urgent',
            icon: notif.type === 'alert' ? <AlertIcon /> : <AnalyticsIcon />,
            title: notif.type.toUpperCase(),
            message: notif.message || 'New notification',
            time: 'Just now',
            action: {
              type: 'view' as const,
              label: 'Mark Read',
              handler: () => console.log('Mark read:', notif.id)
            }
          });
        }
      });
    }
    
    return items;
  }, [marketIntelligence, notifications]);
  
  const loading = false;
  const error = null;
  
  const [items, setItems] = useState<ActionItem[]>([]);
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

  // Update items when SUIS data changes
  useEffect(() => {
    if (tickerData && tickerData.length > 0) {
      setItems(tickerData);
    } else {
      // Fallback to generated data if no SUIS data available
      setItems(generateActionItems());
    }
  }, [tickerData]);

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
              
              {item.metrics?.probability && (
                <Box
                  sx={{
                    background: `linear-gradient(45deg, ${
                      item.priority === 'critical' ? '#DC2626' :
                      item.priority === 'urgent' ? '#F59E0B' :
                      '#10B981'
                    }, ${
                      item.priority === 'critical' ? '#DC262688' :
                      item.priority === 'urgent' ? '#F59E0B88' :
                      '#10B98188'
                    })`,
                    color: 'white',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1.5,
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    boxShadow: 1,
                  }}
                >
                  {item.metrics.probability}% AI
                </Box>
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
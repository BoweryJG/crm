import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  LocalFireDepartment as FireIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Circle as DotIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

interface AlertItem {
  id: string;
  level: 'critical' | 'warning' | 'success';
  message: string;
  time: string;
  value?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
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

const criticalGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 59, 48, 0.8);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 59, 48, 1);
  }
`;

const MainContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #000000 0%, #0a0a0a 100%)`,
  position: 'relative',
  overflow: 'hidden',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    animation: `${shimmer} 3s infinite`
  }
}));

const TickerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 24px',
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  zIndex: 10,
  transition: 'all 0.3s ease'
}));

const CategoryDot = styled(Box)<{ level: string }>(({ level }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: level === 'critical' ? '#FF3B30' : 
                  level === 'warning' ? '#007AFF' : 
                  '#34C759',
  boxShadow: level === 'critical' ? '0 0 12px rgba(255, 59, 48, 0.8)' :
             level === 'warning' ? '0 0 12px rgba(0, 122, 255, 0.8)' :
             '0 0 12px rgba(52, 199, 89, 0.8)',
  animation: level === 'critical' ? `${pulse} 1s ease-in-out infinite` : 'none'
}));

const CategoryLabel = styled(Typography)<{ level: string }>(({ level }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginLeft: 8,
  color: level === 'critical' ? '#FF3B30' : 
         level === 'warning' ? '#007AFF' : 
         '#34C759',
  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
}));

const CategorySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: 24,
  padding: '6px 16px',
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: 20,
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    transform: 'translateY(-1px)'
  }
}));

const CountBadge = styled(Box)<{ level: string }>(({ level }) => ({
  marginLeft: 12,
  padding: '2px 8px',
  borderRadius: 12,
  backgroundColor: level === 'critical' ? 'rgba(255, 59, 48, 0.2)' : 
                  level === 'warning' ? 'rgba(0, 122, 255, 0.2)' : 
                  'rgba(52, 199, 89, 0.2)',
  border: `1px solid ${
    level === 'critical' ? 'rgba(255, 59, 48, 0.3)' : 
    level === 'warning' ? 'rgba(0, 122, 255, 0.3)' : 
    'rgba(52, 199, 89, 0.3)'
  }`,
  fontSize: '0.7rem',
  fontWeight: 600,
  color: level === 'critical' ? '#FF3B30' : 
         level === 'warning' ? '#007AFF' : 
         '#34C759',
  minWidth: 20,
  textAlign: 'center'
}));

const ScrollingText = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
  height: 24,
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    background: 'linear-gradient(90deg, #000 0%, transparent 100%)',
    zIndex: 2
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    background: 'linear-gradient(90deg, transparent 0%, #000 100%)',
    zIndex: 2
  }
}));

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const MessageScroller = styled(Box)<{ isPaused: boolean }>(({ theme, isPaused }) => ({
  display: 'flex',
  animation: isPaused ? 'none' : `${scroll} 45s linear infinite`,
  paddingLeft: '100%',
  animationPlayState: isPaused ? 'paused' : 'running',
  transition: 'transform 0.3s ease',
  '&:hover': {
    animationPlayState: 'paused'
  }
}));

const AlertMessage = styled(Typography)<{ level: string }>(({ level }) => ({
  whiteSpace: 'nowrap',
  marginRight: 80,
  fontSize: '0.875rem',
  fontWeight: 500,
  color: level === 'critical' ? '#FF6B6B' : 
         level === 'warning' ? '#74C0FC' : 
         '#8CE99A',
  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: 8
}));

const ExpandedSection = styled(Collapse)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.3)',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
}));

const AlertCategory = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const CategoryHeader = styled(Box)<{ level: string }>(({ level }) => ({
  padding: '16px 24px',
  background: level === 'critical' ? 'rgba(255, 59, 48, 0.05)' :
              level === 'warning' ? 'rgba(0, 122, 255, 0.05)' :
              'rgba(52, 199, 89, 0.05)',
  borderLeft: `3px solid ${
    level === 'critical' ? '#FF3B30' :
    level === 'warning' ? '#007AFF' :
    '#34C759'
  }`,
  display: 'flex',
  alignItems: 'center',
  gap: 12
}));

const AlertRow = styled(Box)<{ level: string }>(({ level }) => ({
  padding: '12px 24px 12px 48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  borderLeft: '3px solid transparent',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.02)',
    borderLeftColor: level === 'critical' ? '#FF3B30' :
                     level === 'warning' ? '#007AFF' :
                     '#34C759',
    transform: 'translateX(4px)'
  }
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: 'rgba(255, 255, 255, 0.4)',
  fontWeight: 500,
  letterSpacing: '0.02em'
}));

const ValueBadge = styled(Box)<{ level: string }>(({ level }) => ({
  padding: '4px 12px',
  borderRadius: 16,
  background: level === 'critical' ? 'rgba(255, 59, 48, 0.1)' :
              level === 'warning' ? 'rgba(0, 122, 255, 0.1)' :
              'rgba(52, 199, 89, 0.1)',
  border: `1px solid ${
    level === 'critical' ? 'rgba(255, 59, 48, 0.2)' :
    level === 'warning' ? 'rgba(0, 122, 255, 0.2)' :
    'rgba(52, 199, 89, 0.2)'
  }`,
  fontSize: '0.8rem',
  fontWeight: 600,
  color: level === 'critical' ? '#FF3B30' :
         level === 'warning' ? '#007AFF' :
         '#34C759',
  marginLeft: 16
}));

const alerts: AlertItem[] = [
  // Critical
  { id: '1', level: 'critical', message: 'Dr. Martinez ready to close $285K implant system deal - IMMEDIATE ACTION', time: '2 min', value: '$285K' },
  { id: '2', level: 'critical', message: 'COMPETITOR ALERT: Straumann rep spotted at Premier Dental', time: '8 min', value: 'URGENT' },
  { id: '3', level: 'critical', message: 'Contract expires TODAY: Valley Orthodontics renewal pending', time: '1 hr', value: '$180K' },
  
  // Warning
  { id: '4', level: 'warning', message: 'High-value opportunity: 3 practices showing 90%+ purchase intent', time: '15 min', value: '$450K' },
  { id: '5', level: 'warning', message: 'Follow-up required: Dr. Chen awaiting laser system proposal', time: '30 min', value: '$125K' },
  { id: '6', level: 'warning', message: 'Q1 budget finalizations: 6 practices deciding this week', time: '2 hrs', value: '$720K' },
  
  // Success
  { id: '7', level: 'success', message: 'CLOSED: Riverside Dental complete system purchase', time: '1 hr', value: '$195K' },
  { id: '8', level: 'success', message: 'Market insight: 22% increase in minimally invasive procedures', time: '3 hrs', value: '+22%' }
];

const IconicUrgentTicker: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [criticalAlerts] = useState(alerts.filter(a => a.level === 'critical'));
  const [warningAlerts] = useState(alerts.filter(a => a.level === 'warning'));
  const [successAlerts] = useState(alerts.filter(a => a.level === 'success'));

  return (
    <MainContainer>
      <TickerHeader>
        {/* Categories */}
        <CategorySection>
          <CategoryDot level="critical" />
          <CategoryLabel level="critical">Critical</CategoryLabel>
          <CountBadge level="critical">{criticalAlerts.length}</CountBadge>
        </CategorySection>
        
        <CategorySection>
          <CategoryDot level="warning" />
          <CategoryLabel level="warning">Important</CategoryLabel>
          <CountBadge level="warning">{warningAlerts.length}</CountBadge>
        </CategorySection>
        
        <CategorySection>
          <CategoryDot level="success" />
          <CategoryLabel level="success">Success</CategoryLabel>
          <CountBadge level="success">{successAlerts.length}</CountBadge>
        </CategorySection>

        {/* Scrolling Messages */}
        <ScrollingText>
          <MessageScroller isPaused={isPaused}>
            {[...alerts, ...alerts].map((alert, index) => (
              <AlertMessage key={`${alert.id}-${index}`} level={alert.level}>
                {alert.level === 'critical' && <FireIcon sx={{ fontSize: 16 }} />}
                {alert.level === 'warning' && <WarningIcon sx={{ fontSize: 16 }} />}
                {alert.level === 'success' && <CheckIcon sx={{ fontSize: 16 }} />}
                {alert.message}
              </AlertMessage>
            ))}
          </MessageScroller>
        </ScrollingText>

        {/* Play/Pause Control */}
        <IconButton 
          onClick={() => setIsPaused(!isPaused)}
          sx={{ 
            ml: 1,
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)',
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </IconButton>

        {/* Expand/Collapse */}
        <IconButton 
          onClick={() => setExpanded(!expanded)}
          sx={{ 
            ml: 1,
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)',
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </TickerHeader>

      <ExpandedSection in={expanded}>
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <AlertCategory>
            <CategoryHeader level="critical">
              <FireIcon sx={{ color: '#FF3B30' }} />
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FF3B30'
              }}>
                Immediate Action Required
              </Typography>
            </CategoryHeader>
            {criticalAlerts.map(alert => (
              <AlertRow key={alert.id} level={alert.level}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>
                    {alert.message}
                  </Typography>
                  <TimeStamp>{alert.time} ago</TimeStamp>
                </Box>
                {alert.value && <ValueBadge level={alert.level}>{alert.value}</ValueBadge>}
              </AlertRow>
            ))}
          </AlertCategory>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <AlertCategory>
            <CategoryHeader level="warning">
              <WarningIcon sx={{ color: '#007AFF' }} />
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#007AFF'
              }}>
                Action Needed
              </Typography>
            </CategoryHeader>
            {warningAlerts.map(alert => (
              <AlertRow key={alert.id} level={alert.level}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>
                    {alert.message}
                  </Typography>
                  <TimeStamp>{alert.time} ago</TimeStamp>
                </Box>
                {alert.value && <ValueBadge level={alert.level}>{alert.value}</ValueBadge>}
              </AlertRow>
            ))}
          </AlertCategory>
        )}

        {/* Success Alerts */}
        {successAlerts.length > 0 && (
          <AlertCategory>
            <CategoryHeader level="success">
              <CheckIcon sx={{ color: '#34C759' }} />
              <Typography sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#34C759'
              }}>
                Recent Wins
              </Typography>
            </CategoryHeader>
            {successAlerts.map(alert => (
              <AlertRow key={alert.id} level={alert.level}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>
                    {alert.message}
                  </Typography>
                  <TimeStamp>{alert.time} ago</TimeStamp>
                </Box>
                {alert.value && <ValueBadge level={alert.level}>{alert.value}</ValueBadge>}
              </AlertRow>
            ))}
          </AlertCategory>
        )}
      </ExpandedSection>
    </MainContainer>
  );
};

export default IconicUrgentTicker;
import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, IconButton, Collapse } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';

interface UrgentDataItem {
  id: string;
  level: 'critical' | 'warning' | 'info'; // red, blue, green
  icon: React.ReactNode;
  message: string;
  time: string;
  action?: string;
}

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

const TickerContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease'
}));

const LevelBar = styled(Box)<{ level: 'critical' | 'warning' | 'info' }>(({ level }) => ({
  height: 4,
  width: '100%',
  background: level === 'critical' 
    ? 'linear-gradient(90deg, #FF0000 0%, #CC0000 100%)' 
    : level === 'warning'
    ? 'linear-gradient(90deg, #0066FF 0%, #0044CC 100%)'
    : 'linear-gradient(90deg, #00CC00 0%, #009900 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
    animation: `${scroll} 2s linear infinite`
  }
}));

const DataRow = styled(Box)<{ level: 'critical' | 'warning' | 'info' }>(({ level }) => ({
  padding: '8px 16px',
  borderLeft: `4px solid ${
    level === 'critical' ? '#FF0000' : 
    level === 'warning' ? '#0066FF' : 
    '#00CC00'
  }`,
  background: level === 'critical' 
    ? 'rgba(255, 0, 0, 0.05)' 
    : level === 'warning'
    ? 'rgba(0, 102, 255, 0.05)'
    : 'rgba(0, 204, 0, 0.05)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    background: level === 'critical' 
      ? 'rgba(255, 0, 0, 0.1)' 
      : level === 'warning'
      ? 'rgba(0, 102, 255, 0.1)'
      : 'rgba(0, 204, 0, 0.1)',
  }
}));

const ScrollingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  animation: `${scroll} 60s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused'
  }
}));

const urgentData: UrgentDataItem[] = [
  // Critical (Red) - Immediate action required
  {
    id: '1',
    level: 'critical',
    icon: <FireIcon />,
    message: "🔴 URGENT: Dr. Martinez ready to sign $250K implant deal - CALL NOW",
    time: "2 min ago",
    action: "Call immediately"
  },
  {
    id: '2',
    level: 'critical',
    icon: <WarningIcon />,
    message: "🔴 ALERT: Competitor spotted at Premier Dental - They mentioned Straumann",
    time: "5 min ago",
    action: "Intervene now"
  },
  {
    id: '3',
    level: 'critical',
    icon: <MoneyIcon />,
    message: "🔴 CONTRACT EXPIRING: Valley Orthodontics $180K renewal - Decision TODAY",
    time: "10 min ago",
    action: "Send proposal"
  },
  
  // Warning (Blue) - Important but not immediate
  {
    id: '4',
    level: 'warning',
    icon: <TrendingUpIcon />,
    message: "🔵 OPPORTUNITY: 3 practices in network showing 90%+ purchase signals",
    time: "15 min ago",
    action: "Schedule visits"
  },
  {
    id: '5',
    level: 'warning',
    icon: <PhoneIcon />,
    message: "🔵 FOLLOW-UP DUE: Dr. Chen expecting laser system quote by EOD",
    time: "30 min ago",
    action: "Send quote"
  },
  {
    id: '6',
    level: 'warning',
    icon: <TimerIcon />,
    message: "🔵 BUDGET CYCLE: 6 practices finalizing Q1 budgets this week",
    time: "1 hour ago",
    action: "Prepare proposals"
  },
  
  // Info (Green) - Positive updates
  {
    id: '7',
    level: 'info',
    icon: <CheckCircleIcon />,
    message: "🟢 SUCCESS: Riverside Dental approved $125K equipment purchase",
    time: "2 hours ago",
    action: "Process order"
  },
  {
    id: '8',
    level: 'info',
    icon: <TrendingUpIcon />,
    message: "🟢 MARKET INTEL: 18% increase in minimally invasive procedure demand",
    time: "3 hours ago",
    action: "Share insights"
  }
];

const UrgentDataTicker: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [dataItems, setDataItems] = useState(urgentData);
  const [criticalCount, setCriticalCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [infoCount, setInfoCount] = useState(0);

  useEffect(() => {
    setCriticalCount(dataItems.filter(item => item.level === 'critical').length);
    setWarningCount(dataItems.filter(item => item.level === 'warning').length);
    setInfoCount(dataItems.filter(item => item.level === 'info').length);
  }, [dataItems]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const getMostUrgentLevel = (): 'critical' | 'warning' | 'info' => {
    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'info';
  };

  const mostUrgentLevel = getMostUrgentLevel();
  const mostUrgentItem = dataItems.find(item => item.level === mostUrgentLevel);

  return (
    <TickerContainer>
      {/* Level indicator bar */}
      <LevelBar level={mostUrgentLevel} />
      
      {/* Collapsed view - scrolling most urgent item */}
      <Collapse in={!expanded}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          py: 1, 
          px: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
            <Typography sx={{ 
              fontWeight: 700, 
              fontSize: '0.8rem',
              color: '#FFD700',
              letterSpacing: '0.1em'
            }}>
              URGENT ALERTS
            </Typography>
            
            {criticalCount > 0 && (
              <Chip 
                label={`${criticalCount}`} 
                size="small" 
                sx={{ 
                  bgcolor: '#FF0000', 
                  color: '#fff',
                  fontWeight: 700,
                  animation: `${pulse} 1s ease-in-out infinite`
                }} 
              />
            )}
            {warningCount > 0 && (
              <Chip 
                label={`${warningCount}`} 
                size="small" 
                sx={{ bgcolor: '#0066FF', color: '#fff', fontWeight: 700 }} 
              />
            )}
            {infoCount > 0 && (
              <Chip 
                label={`${infoCount}`} 
                size="small" 
                sx={{ bgcolor: '#00CC00', color: '#fff', fontWeight: 700 }} 
              />
            )}
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <ScrollingContainer>
              {[...dataItems, ...dataItems].map((item, index) => (
                <Typography 
                  key={`${item.id}-${index}`}
                  sx={{ 
                    whiteSpace: 'nowrap',
                    pr: 8,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: item.level === 'critical' ? '#FF6B6B' : 
                           item.level === 'warning' ? '#4DABF7' : 
                           '#51CF66'
                  }}
                >
                  {item.message}
                </Typography>
              ))}
            </ScrollingContainer>
          </Box>
          
          <IconButton 
            size="small" 
            onClick={handleToggle}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Collapse>
      
      {/* Expanded view - all items grouped by level */}
      <Collapse in={expanded}>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          {/* Critical items */}
          {criticalCount > 0 && (
            <Box>
              <Typography sx={{ 
                px: 2, 
                py: 1, 
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: '#FF6B6B'
              }}>
                CRITICAL - IMMEDIATE ACTION REQUIRED ({criticalCount})
              </Typography>
              {dataItems.filter(item => item.level === 'critical').map(item => (
                <DataRow key={item.id} level={item.level}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: '#FF6B6B' }}>{item.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {item.time} • {item.action}
                      </Typography>
                    </Box>
                  </Box>
                </DataRow>
              ))}
            </Box>
          )}
          
          {/* Warning items */}
          {warningCount > 0 && (
            <Box>
              <Typography sx={{ 
                px: 2, 
                py: 1, 
                bgcolor: 'rgba(0, 102, 255, 0.1)',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: '#4DABF7'
              }}>
                IMPORTANT - ACTION NEEDED ({warningCount})
              </Typography>
              {dataItems.filter(item => item.level === 'warning').map(item => (
                <DataRow key={item.id} level={item.level}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: '#4DABF7' }}>{item.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {item.time} • {item.action}
                      </Typography>
                    </Box>
                  </Box>
                </DataRow>
              ))}
            </Box>
          )}
          
          {/* Info items */}
          {infoCount > 0 && (
            <Box>
              <Typography sx={{ 
                px: 2, 
                py: 1, 
                bgcolor: 'rgba(0, 204, 0, 0.1)',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                color: '#51CF66'
              }}>
                POSITIVE UPDATES ({infoCount})
              </Typography>
              {dataItems.filter(item => item.level === 'info').map(item => (
                <DataRow key={item.id} level={item.level}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ color: '#51CF66' }}>{item.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {item.time} • {item.action}
                      </Typography>
                    </Box>
                  </Box>
                </DataRow>
              ))}
            </Box>
          )}
          
          <Box sx={{ 
            p: 1, 
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <IconButton 
              size="small" 
              onClick={handleToggle}
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <ExpandLessIcon />
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </TickerContainer>
  );
};

export default UrgentDataTicker;
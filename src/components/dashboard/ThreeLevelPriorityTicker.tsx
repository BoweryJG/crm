import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

interface PriorityItem {
  id: string;
  level: 'high' | 'medium' | 'low';
  message: string;
  value?: string;
}

const slide = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
`;

// Main container
const TickerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)',
  padding: 0,
  overflow: 'hidden',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

// Individual level bar
const LevelBar = styled(Box)<{ level: 'high' | 'medium' | 'low'; active: boolean }>(({ level, active }) => {
  const colors = {
    high: {
      bg: 'rgba(255, 107, 107, 0.15)',  // Light red background
      border: '#FF6B6B',                 // Light red border
      text: '#FF8787',                   // Light red text
      glow: 'rgba(255, 107, 107, 0.3)'
    },
    medium: {
      bg: 'rgba(77, 171, 247, 0.15)',   // Light blue background
      border: '#4DABF7',                 // Light blue border
      text: '#74C0FC',                   // Light blue text
      glow: 'rgba(77, 171, 247, 0.3)'
    },
    low: {
      bg: 'rgba(81, 207, 102, 0.15)',   // Light green background
      border: '#51CF66',                 // Light green border
      text: '#8CE99A',                   // Light green text
      glow: 'rgba(81, 207, 102, 0.3)'
    }
  };

  const color = colors[level];

  return {
    position: 'relative',
    height: 32,
    borderLeft: `3px solid ${color.border}`,
    background: active 
      ? `linear-gradient(90deg, ${color.bg} 0%, ${color.glow} 10%, ${color.bg} 100%)`
      : color.bg,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    opacity: active ? 1 : 0.7,
    '&:hover': {
      opacity: 1,
      background: `linear-gradient(90deg, ${color.glow} 0%, ${color.bg} 100%)`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: active ? '100%' : '0%',
      background: `linear-gradient(90deg, transparent 0%, ${color.glow} 50%, transparent 100%)`,
      animation: active ? `${glow} 2s ease-in-out infinite` : 'none',
      transition: 'width 0.3s ease',
    }
  };
});

const LevelLabel = styled(Typography)<{ level: 'high' | 'medium' | 'low' }>(({ level }) => {
  const colors = {
    high: '#FF8787',
    medium: '#74C0FC',
    low: '#8CE99A'
  };

  return {
    position: 'absolute',
    left: 16,
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: colors[level],
    zIndex: 2,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    minWidth: 80,
  };
});

const MessageContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 110,
  right: 100,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
}));

const ScrollingMessage = styled(Box)<{ shouldScroll: boolean }>(({ shouldScroll }) => ({
  display: 'flex',
  whiteSpace: 'nowrap',
  animation: shouldScroll ? `${slide} 20s linear infinite` : 'none',
  paddingRight: shouldScroll ? '100%' : 0,
}));

const MessageText = styled(Typography)<{ level: 'high' | 'medium' | 'low' }>(({ level }) => {
  const colors = {
    high: '#FF8787',
    medium: '#74C0FC',
    low: '#8CE99A'
  };

  return {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: colors[level],
    marginRight: 100,
  };
});

const ValueBadge = styled(Box)<{ level: 'high' | 'medium' | 'low' }>(({ level }) => {
  const colors = {
    high: {
      bg: 'rgba(255, 107, 107, 0.2)',
      border: 'rgba(255, 107, 107, 0.4)',
      text: '#FF8787'
    },
    medium: {
      bg: 'rgba(77, 171, 247, 0.2)',
      border: 'rgba(77, 171, 247, 0.4)',
      text: '#74C0FC'
    },
    low: {
      bg: 'rgba(81, 207, 102, 0.2)',
      border: 'rgba(81, 207, 102, 0.4)',
      text: '#8CE99A'
    }
  };

  const color = colors[level];

  return {
    position: 'absolute',
    right: 16,
    padding: '4px 12px',
    borderRadius: 14,
    background: color.bg,
    border: `1px solid ${color.border}`,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: color.text,
    zIndex: 2,
  };
});

// Sample data
const priorityData: Record<'high' | 'medium' | 'low', PriorityItem[]> = {
  high: [
    { id: '1', level: 'high', message: 'Dr. Martinez closing $285K deal TODAY - Call immediately', value: '$285K' },
    { id: '2', level: 'high', message: 'URGENT: Competitor at Premier Dental discussing Straumann', value: 'CRITICAL' },
    { id: '3', level: 'high', message: 'Contract expiring: Valley Orthodontics needs renewal NOW', value: '$180K' },
  ],
  medium: [
    { id: '4', level: 'medium', message: '3 hot practices ready for proposals - 90% close probability', value: '$450K' },
    { id: '5', level: 'medium', message: 'Follow-up due: Dr. Chen waiting for laser system quote', value: '$125K' },
    { id: '6', level: 'medium', message: 'Budget meetings: 6 practices finalizing Q1 purchases', value: '$720K' },
  ],
  low: [
    { id: '7', level: 'low', message: 'Success: Riverside Dental purchase approved and processed', value: '$195K' },
    { id: '8', level: 'low', message: 'Market update: 22% growth in minimally invasive procedures', value: '+22%' },
    { id: '9', level: 'low', message: 'Referral received: Dr. Park recommended us to 2 colleagues', value: 'NEW' },
  ]
};

const ThreeLevelPriorityTicker: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<'high' | 'medium' | 'low'>('high');
  const [currentMessageIndex, setCurrentMessageIndex] = useState<Record<string, number>>({
    high: 0,
    medium: 0,
    low: 0
  });

  // Rotate messages within each level
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => ({
        high: (prev.high + 1) % priorityData.high.length,
        medium: (prev.medium + 1) % priorityData.medium.length,
        low: (prev.low + 1) % priorityData.low.length,
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate through levels
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLevel(prev => {
        if (prev === 'high') return 'medium';
        if (prev === 'medium') return 'low';
        return 'high';
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const renderLevelBar = (level: 'high' | 'medium' | 'low', label: string) => {
    const messages = priorityData[level];
    const currentMessage = messages[currentMessageIndex[level]];
    const isActive = activeLevel === level;

    return (
      <LevelBar 
        level={level} 
        active={isActive}
        onClick={() => setActiveLevel(level)}
      >
        <LevelLabel level={level}>{label}</LevelLabel>
        
        <MessageContainer>
          <ScrollingMessage shouldScroll={isActive}>
            {isActive ? (
              // Show all messages when active
              messages.map((msg, idx) => (
                <MessageText key={msg.id} level={level}>
                  {msg.message}
                </MessageText>
              ))
            ) : (
              // Show current message when inactive
              <MessageText level={level}>
                {currentMessage.message}
              </MessageText>
            )}
          </ScrollingMessage>
        </MessageContainer>

        {currentMessage.value && (
          <ValueBadge level={level}>
            {currentMessage.value}
          </ValueBadge>
        )}
      </LevelBar>
    );
  };

  return (
    <TickerContainer>
      {renderLevelBar('high', 'CRITICAL')}
      {renderLevelBar('medium', 'IMPORTANT')}
      {renderLevelBar('low', 'UPDATES')}
    </TickerContainer>
  );
};

export default ThreeLevelPriorityTicker;
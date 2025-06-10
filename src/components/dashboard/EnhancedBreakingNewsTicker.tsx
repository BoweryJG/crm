import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { 
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TickerContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
  borderTop: '2px solid #C9B037',
  borderBottom: '2px solid #C9B037',
  padding: '8px 0',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '"BREAKING"',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#C9B037',
    color: '#000',
    padding: '4px 16px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    zIndex: 10,
    fontFamily: '"Orbitron", monospace',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '120px',
    background: 'linear-gradient(90deg, #0a0a0a 70%, transparent)',
    zIndex: 5,
  }
}));

const TickerContent = styled(Box)({
  display: 'flex',
  animation: `${scroll} 60s linear infinite`,
  paddingLeft: '140px',
  whiteSpace: 'nowrap',
});

const NewsItem = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: theme.spacing(8),
  color: '#E8E8E8',
  fontFamily: '"Orbitron", monospace',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
}));

const newsItems = [
  { icon: <TrendingUpIcon />, text: "Dr. Chen's practice showing 94% purchase probability for implant systems", type: 'success' },
  { icon: <WarningIcon />, text: "URGENT: Competitor activity detected at Rodriguez Aesthetics - Allergan mentioned 3x", type: 'warning' },
  { icon: <CheckCircleIcon />, text: "Budget approved: Walsh Dermatology secured financing for laser system", type: 'success' },
  { icon: <TimerIcon />, text: "Time-sensitive: Kim Oral Surgery needs surgical kits by next week", type: 'info' },
  { icon: <TrendingUpIcon />, text: "Market insight: 18% increase in demand for minimally invasive procedures", type: 'info' },
  { icon: <WarningIcon />, text: "Action required: 6 hot leads require follow-up within 24 hours", type: 'warning' },
];

const EnhancedBreakingNewsTicker: React.FC = () => {
  const [items, setItems] = useState(newsItems);

  return (
    <TickerContainer>
      <TickerContent>
        {[...items, ...items].map((item, index) => (
          <NewsItem key={index}>
            <Box sx={{ 
              color: item.type === 'success' ? '#06D6A0' : 
                     item.type === 'warning' ? '#FFB000' : '#00B4D8',
              mr: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
              {item.icon}
            </Box>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              {item.text}
            </Typography>
          </NewsItem>
        ))}
      </TickerContent>
    </TickerContainer>
  );
};

export default EnhancedBreakingNewsTicker;
import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Aviation-style animations
const sweep = keyframes`
  from {
    transform: rotate(-135deg);
  }
  to {
    transform: rotate(135deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(201, 176, 55, 0.3), 0 0 10px rgba(201, 176, 55, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(201, 176, 55, 0.6), 0 0 30px rgba(201, 176, 55, 0.4);
  }
`;

// Styled components for aviation aesthetics
const GaugeContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: 200,
  height: 200,
  borderRadius: '50%',
  background: `
    radial-gradient(circle at 30% 30%, 
      rgba(201, 176, 55, 0.1) 0%, 
      rgba(26, 26, 26, 0.9) 40%, 
      rgba(15, 15, 15, 1) 100%
    )
  `,
  border: '3px solid #C9B037',
  boxShadow: `
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    inset 0 0 40px rgba(201, 176, 55, 0.1),
    0 0 20px rgba(201, 176, 55, 0.3)
  `,
  animation: `${glow} 3s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '90%',
    height: '90%',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid rgba(201, 176, 55, 0.3)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '70%',
    height: '70%',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid rgba(201, 176, 55, 0.2)',
  }
}));

const GaugeNeedle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'rotation'
})<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '60%',
  height: '2px',
  background: 'linear-gradient(90deg, #C9B037 0%, #E8E8E8 100%)',
  transformOrigin: '15% center',
  transform: `translate(-15%, -50%) rotate(${rotation}deg)`,
  transition: 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: '2px',
  boxShadow: '0 0 10px rgba(201, 176, 55, 0.8)',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '10%',
    top: '50%',
    width: '12px',
    height: '12px',
    background: '#C9B037',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 8px rgba(201, 176, 55, 0.6)',
  }
}));

const GaugeMarkings = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    background: '#C9B037',
  }
}));

const DigitalDisplay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '25%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(15, 15, 15, 0.9)',
  border: '1px solid #C9B037',
  borderRadius: '4px',
  padding: '4px 12px',
  fontFamily: '"Orbitron", monospace',
  fontSize: '14px',
  color: '#C9B037',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  textShadow: '0 0 5px rgba(201, 176, 55, 0.8)',
  animation: `${pulse} 2s ease-in-out infinite`,
}));

interface AviationGaugeProps {
  value: number;
  max: number;
  min: number;
  title: string;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
}

const AviationGauge: React.FC<AviationGaugeProps> = ({
  value,
  max,
  min,
  title,
  unit = '',
  color = 'primary',
  size = 'medium'
}) => {
  const theme = useTheme();
  
  const sizeMap = {
    small: 140,
    medium: 200,
    large: 260
  };
  
  const gaugeSize = sizeMap[size];
  
  // Calculate needle rotation (-135deg to +135deg, total 270deg)
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const rotation = -135 + (percentage / 100) * 270;
  
  const getColorByValue = () => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    if (percentage >= 40) return theme.palette.info.main;
    return theme.palette.error.main;
  };

  const generateMarkings = () => {
    const markings = [];
    for (let i = 0; i <= 10; i++) {
      const angle = -135 + (i / 10) * 270;
      const isMainMark = i % 2 === 0;
      markings.push(
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: isMainMark ? '3px' : '1px',
            height: isMainMark ? '15px' : '8px',
            background: '#C9B037',
            transformOrigin: '50% 0',
            transform: `translate(-50%, -100%) rotate(${angle}deg) translateY(-85px)`,
          }}
        />
      );
    }
    return markings;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontFamily: '"Orbitron", monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#C9B037',
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      
      <GaugeContainer
        sx={{
          width: gaugeSize,
          height: gaugeSize
        }}
      >
        {/* Gauge markings */}
        {generateMarkings()}
        
        {/* Value ranges (color zones) */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            background: `conic-gradient(
              from -135deg,
              ${theme.palette.error.main} 0deg,
              ${theme.palette.error.main} 67.5deg,
              ${theme.palette.warning.main} 67.5deg,
              ${theme.palette.warning.main} 135deg,
              ${theme.palette.success.main} 135deg,
              ${theme.palette.success.main} 270deg,
              transparent 270deg
            )`,
            opacity: 0.2,
            maskImage: `
              radial-gradient(circle, 
                transparent 60%, 
                black 60%, 
                black 100%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(circle, 
                transparent 60%, 
                black 60%, 
                black 100%
              )
            `
          }}
        />
        
        {/* Gauge needle */}
        <GaugeNeedle rotation={rotation} />
        
        {/* Center circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #C9B037 0%, #B8A024 100%)',
            border: '2px solid #1A1A1A',
            boxShadow: '0 0 15px rgba(201, 176, 55, 0.8)',
            zIndex: 10
          }}
        />
        
        {/* Digital display */}
        <DigitalDisplay>
          {value.toFixed(1)}{unit}
        </DigitalDisplay>
      </GaugeContainer>
    </Box>
  );
};

// Specialized gauge components
export const WinProbabilityGauge: React.FC<{ value: number }> = ({ value }) => (
  <AviationGauge
    value={value}
    min={0}
    max={100}
    title="Win Probability"
    unit="%"
    color="success"
  />
);

export const PersuasionGauge: React.FC<{ value: number }> = ({ value }) => (
  <AviationGauge
    value={value}
    min={0}
    max={100}
    title="Persuasion Score"
    unit="%"
    color="info"
  />
);

export const TalkTimeGauge: React.FC<{ value: number }> = ({ value }) => (
  <AviationGauge
    value={value}
    min={0}
    max={100}
    title="Talk Time Ratio"
    unit="%"
    color="warning"
  />
);

export const ConfidenceGauge: React.FC<{ value: number }> = ({ value }) => (
  <AviationGauge
    value={value}
    min={0}
    max={100}
    title="Confidence"
    unit="%"
    color="primary"
  />
);

export const MarketSentimentGauge: React.FC<{ value: number }> = ({ value }) => (
  <AviationGauge
    value={value}
    min={-100}
    max={100}
    title="Market Sentiment"
    unit=""
    color="info"
  />
);

// Multi-gauge dashboard component
interface AviationDashboardProps {
  metrics: {
    winProbability?: number;
    persuasionScore?: number;
    talkTimeRatio?: number;
    confidence?: number;
    marketSentiment?: number;
  };
  size?: 'small' | 'medium' | 'large';
}

export const AviationDashboard: React.FC<AviationDashboardProps> = ({
  metrics,
  size = 'medium'
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 3,
        p: 2,
        background: `
          radial-gradient(circle at 20% 80%, rgba(201, 176, 55, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(232, 232, 232, 0.03) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)
        `,
        borderRadius: 4,
        border: '1px solid rgba(201, 176, 55, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {metrics.winProbability !== undefined && (
        <WinProbabilityGauge value={metrics.winProbability} />
      )}
      {metrics.persuasionScore !== undefined && (
        <PersuasionGauge value={metrics.persuasionScore} />
      )}
      {metrics.talkTimeRatio !== undefined && (
        <TalkTimeGauge value={metrics.talkTimeRatio} />
      )}
      {metrics.confidence !== undefined && (
        <ConfidenceGauge value={metrics.confidence} />
      )}
      {metrics.marketSentiment !== undefined && (
        <MarketSentimentGauge value={metrics.marketSentiment} />
      )}
    </Box>
  );
};

export default AviationGauge;
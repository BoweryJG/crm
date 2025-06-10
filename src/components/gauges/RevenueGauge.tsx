import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

interface RevenueGaugeProps {
  value: number; // Current value (0-180 scale)
  label?: string; // Default: "REVENUE"
  odometer?: string; // Bottom display value (e.g., "142908")
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const needleSweep = keyframes`
  0% {
    transform: rotate(-135deg);
  }
  100% {
    transform: rotate(calc(var(--rotation) * 1deg));
  }
`;

const GaugeWrapper = styled(Paper)<{ size: string }>(({ theme, size }) => {
  const dimensions = {
    small: 180,
    medium: 240,
    large: 300
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: 16,
    padding: 16,
    background: '#1a1a1a',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  };
});

const LeatherBackground = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 148,
    medium: 208,
    large: 268
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: '50%',
    background: `
      radial-gradient(circle at 30% 30%, #2a2a2a 0%, #0a0a0a 100%)
    `,
    padding: 8,
    boxShadow: `
      inset 0 0 40px rgba(0,0,0,0.8),
      inset 0 0 20px rgba(0,0,0,0.6)
    `,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -8,
      left: -8,
      right: -8,
      bottom: -8,
      borderRadius: '50%',
      border: '1px dashed #C9B037',
      opacity: 0.3
    }
  };
});

const ChromeBezel = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 132,
    medium: 192,
    large: 252
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: '50%',
    background: `
      linear-gradient(145deg, #e0e0e0 0%, #b0b0b0 50%, #909090 100%)
    `,
    boxShadow: `
      0 4px 8px rgba(0,0,0,0.3),
      inset 0 -2px 4px rgba(0,0,0,0.2),
      inset 0 2px 4px rgba(255,255,255,0.5)
    `,
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
});

const GaugeFace = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 124,
    medium: 184,
    large: 244
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: '50%',
    background: `
      radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '80%',
      height: '80%',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.02) 0%, transparent 70%)'
    }
  };
});

const TickMark = styled(Box)<{ rotation: number; major: boolean }>(({ rotation, major }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: major ? 3 : 1,
  height: major ? '15%' : '10%',
  backgroundColor: '#ffffff',
  transformOrigin: 'center 100%',
  transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
  opacity: major ? 0.9 : 0.5
}));

const NumberLabel = styled(Typography)<{ rotation: number; angle: number }>(({ rotation, angle }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#ffffff',
  fontFamily: '"Arial", sans-serif',
  transform: `
    translate(-50%, -50%) 
    rotate(${rotation}deg) 
    translateY(-60px) 
    rotate(${-rotation}deg)
  `,
  userSelect: 'none'
}));

const Needle = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '55%',
  height: 3,
  background: 'linear-gradient(90deg, #ff0000 0%, #cc0000 50%, #ff0000 100%)',
  transformOrigin: '10% center',
  transform: `translate(-10%, -50%) rotate(${rotation}deg)`,
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
  transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
  '--rotation': rotation,
  animation: `${needleSweep} 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
  '&::before': {
    content: '""',
    position: 'absolute',
    right: -8,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '16px solid #ff0000',
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent'
  }
}));

const CenterCap = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 24,
  height: 24,
  borderRadius: '50%',
  transform: 'translate(-50%, -50%)',
  background: `
    radial-gradient(circle at 30% 30%, #d0d0d0 0%, #808080 50%, #606060 100%)
  `,
  boxShadow: `
    0 2px 4px rgba(0,0,0,0.4),
    inset 0 -1px 2px rgba(0,0,0,0.3),
    inset 0 1px 2px rgba(255,255,255,0.5)
  `,
  zIndex: 10
}));

const GaugeLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: '65%',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.9rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#ffffff',
  fontFamily: '"Arial", sans-serif',
  userSelect: 'none'
}));

const OdometerDisplay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '18%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#000000',
  border: '2px solid #303030',
  borderRadius: 4,
  padding: '4px 12px',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  gap: 2
}));

const OdometerDigit = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#ffffff',
  fontFamily: '"Courier New", monospace',
  letterSpacing: '0.05em',
  minWidth: '0.6em',
  textAlign: 'center'
}));

const RevenueGauge: React.FC<RevenueGaugeProps> = ({
  value = 0,
  label = "REVENUE",
  odometer = "000000",
  size = "medium",
  onClick
}) => {
  // Ensure value is within bounds (0-180)
  const clampedValue = Math.max(0, Math.min(180, value));
  
  // Convert value to rotation angle
  // 0 = -135deg, 180 = +45deg (total 180 degree sweep)
  const rotation = -135 + (clampedValue / 180) * 180;
  
  // Generate tick marks
  const tickMarks = [];
  for (let i = 0; i <= 180; i += 10) {
    const angle = -135 + (i / 180) * 180;
    tickMarks.push(
      <TickMark 
        key={i} 
        rotation={angle} 
        major={i % 20 === 0}
      />
    );
  }
  
  // Generate number labels
  const numberLabels = [];
  for (let i = 0; i <= 180; i += 20) {
    const angle = -135 + (i / 180) * 180;
    numberLabels.push(
      <NumberLabel 
        key={i} 
        rotation={angle}
        angle={angle}
      >
        {i}
      </NumberLabel>
    );
  }
  
  return (
    <GaugeWrapper size={size} elevation={0} onClick={onClick}>
      <LeatherBackground size={size}>
        <ChromeBezel size={size}>
          <GaugeFace size={size}>
            {/* Tick marks */}
            {tickMarks}
            
            {/* Number labels */}
            {numberLabels}
            
            {/* Gauge label */}
            <GaugeLabel>{label}</GaugeLabel>
            
            {/* Odometer display */}
            <OdometerDisplay>
              {odometer.split('').map((digit, index) => (
                <OdometerDigit key={index}>{digit}</OdometerDigit>
              ))}
            </OdometerDisplay>
            
            {/* Needle */}
            <Needle rotation={rotation} />
            
            {/* Center cap */}
            <CenterCap />
          </GaugeFace>
        </ChromeBezel>
      </LeatherBackground>
    </GaugeWrapper>
  );
};

export default RevenueGauge;
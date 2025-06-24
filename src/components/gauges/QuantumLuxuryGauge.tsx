import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface QuantumLuxuryGaugeProps {
  value: number; // 0-100
  label?: string;
  onValueChange?: (value: number) => void;
  size?: number;
  animationDelay?: number;
}

const GaugeWrapper = styled(Box)(({ theme }) => ({
  background: `radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(100, 100, 100, 0.02) 3px,
      rgba(100, 100, 100, 0.02) 6px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 3px,
      rgba(100, 100, 100, 0.02) 3px,
      rgba(100, 100, 100, 0.02) 6px
    ),
    repeating-radial-gradient(
      circle at 50% 50%,
      transparent 0px,
      transparent 5px,
      rgba(0, 0, 0, 0.03) 5px,
      rgba(0, 0, 0, 0.03) 10px
    )`,
  padding: '30px',
  borderRadius: '25px',
  boxShadow: `
    inset 0 2px 4px rgba(255,255,255,0.08),
    inset 0 -2px 6px rgba(0,0,0,0.6),
    inset 0 0 30px rgba(0,0,0,0.4),
    0 10px 40px rgba(0,0,0,0.8),
    0 20px 60px rgba(0,0,0,0.6),
    0 0 80px rgba(100,100,100,0.1)
  `,
  position: 'relative',
  display: 'inline-block',
  border: '1px solid rgba(100, 100, 100, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10px',
    left: '10px',
    right: '10px',
    bottom: '10px',
    borderRadius: '20px',
    border: '1px solid rgba(100, 100, 100, 0.05)',
    pointerEvents: 'none'
  }
}));

const Gauge = styled(Box)<{ size: number }>(({ size }) => ({
  position: 'relative',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: `radial-gradient(circle at 30% 30%, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%),
    repeating-radial-gradient(
      circle at center,
      transparent 0px,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    )`,
  boxShadow: `
    0 0 60px rgba(0,0,0,0.9),
    inset 0 0 30px rgba(255,255,255,0.03),
    inset 0 -5px 15px rgba(0,0,0,0.6),
    inset 0 2px 5px rgba(255,255,255,0.05)
  `,
  border: '2px solid #333',
  borderImage: 'linear-gradient(135deg, #444 0%, #222 50%, #444 100%) 1',
  overflow: 'visible',
}));

const QuantumGrid = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundImage: `
    radial-gradient(circle at center, transparent 30%, rgba(100,100,100,0.03) 100%),
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px),
    repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)
  `,
  zIndex: 1,
});

const PrecisionNode = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'nodePosition',
})<{ nodePosition: string }>(({ nodePosition }) => {
  const positions: Record<string, any> = {
    '12': { top: '10px', left: '50%', transform: 'translateX(-50%)' },
    '3': { top: '50%', right: '10px', transform: 'translateY(-50%)' },
    '6': { bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
    '9': { top: '50%', left: '10px', transform: 'translateY(-50%)' },
  };

  return {
    position: 'absolute',
    width: '12px',
    height: '12px',
    background: 'linear-gradient(135deg, #e8e8e8 0%, #a8a8a8 100%)',
    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
    boxShadow: `
      0 2px 4px rgba(0,0,0,0.4),
      inset 0 1px 2px rgba(255,255,255,0.3)
    `,
    zIndex: 10,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ...positions[nodePosition],
    '&:hover': {
      transform: `${positions[nodePosition].transform} scale(1.1) rotate(30deg)`,
      background: 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 100%)',
      boxShadow: `
        0 0 10px rgba(255,255,255,0.5),
        0 4px 8px rgba(0,0,0,0.6)
      `,
    },
    '&::after': {
      content: 'attr(data-value)',
      position: 'absolute',
      top: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '9px',
      color: '#888',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
    },
    '&:hover::after': {
      opacity: 1,
    },
  };
});

const Dial = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  zIndex: 2,
});

const TickMajor = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  width: '2px',
  height: '15px',
  background: 'linear-gradient(to bottom, #ccc, #888)',
  top: '5px',
  left: '50%',
  transformOrigin: 'center 135px',
  boxShadow: '0 0 2px rgba(255,255,255,0.3)',
  transform: `translateX(-50%) rotate(${rotation}deg)`,
}));

const TickMinor = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  width: '1px',
  height: '8px',
  background: '#666',
  top: '5px',
  left: '50%',
  transformOrigin: 'center 135px',
  transform: `translateX(-50%) rotate(${rotation}deg)`,
}));

const DigitalCabochon = styled(Box)({
  position: 'absolute',
  width: '24px',
  height: '24px',
  background: 'radial-gradient(circle at 30% 30%, #4fc3f7 0%, #1976d2 50%, #0d47a1 100%)',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 20,
  boxShadow: `
    0 0 20px rgba(33, 150, 243, 0.8),
    inset 0 -2px 4px rgba(13, 71, 161, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(33, 150, 243, 0.3)
  `,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  // Disabled infinite animation for performance
  // animation: 'pulse 3s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': { 
      boxShadow: `
        0 0 20px rgba(33, 150, 243, 0.8),
        inset 0 -2px 4px rgba(13, 71, 161, 0.8),
        inset 0 2px 4px rgba(255, 255, 255, 0.3),
        0 0 40px rgba(33, 150, 243, 0.3)
      `,
    },
    '50%': { 
      boxShadow: `
        0 0 30px rgba(33, 150, 243, 1),
        inset 0 -2px 4px rgba(13, 71, 161, 0.8),
        inset 0 2px 4px rgba(255, 255, 255, 0.5),
        0 0 60px rgba(33, 150, 243, 0.5)
      `,
    },
  },
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
});

const Needle = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  width: '4px',
  height: '110px',
  top: '30px',
  left: '50%',
  transformOrigin: 'bottom center',
  transform: `translateX(-50%) rotate(${rotation}deg)`,
  transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 15,
  background: 'linear-gradient(to top, #ff6b6b 0%, #ff5252 50%, #ff1744 100%)',
  clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
  boxShadow: `
    0 0 10px rgba(255, 23, 68, 0.6),
    0 0 20px rgba(255, 23, 68, 0.3)
  `,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '6px',
    height: '6px',
    background: 'radial-gradient(circle, #ff5252 0%, #ff1744 100%)',
    bottom: '-3px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    boxShadow: `
      0 0 6px rgba(255, 23, 68, 0.8),
      inset 0 -1px 2px rgba(0, 0, 0, 0.3)
    `,
  },
}));

const DigitalDisplay = styled(Box)({
  position: 'absolute',
  bottom: '60px',
  width: '100%',
  textAlign: 'center',
  zIndex: 6,
});

const DisplayValue = styled('div')({
  fontSize: '32px',
  fontWeight: 200,
  letterSpacing: '2px',
  color: '#e0e0e0',
  textShadow: `
    0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(33, 150, 243, 0.3)
  `,
  fontVariantNumeric: 'tabular-nums',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const DisplayLabel = styled('div')({
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  color: '#666',
  marginTop: '5px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
});

const BezelOuter = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: '1px solid #444',
  boxShadow: `
    inset 0 0 1px rgba(255,255,255,0.2),
    0 0 1px rgba(0,0,0,0.8)
  `,
});

const BezelInner = styled(Box)({
  position: 'absolute',
  width: '260px',
  height: '260px',
  top: '10px',
  left: '10px',
  borderRadius: '50%',
  border: '1px solid #222',
  boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5)',
});

const QuantumDot = styled(Box)<{ delay: number }>(({ delay }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
  borderRadius: '50%',
  opacity: 0,
  // Disabled infinite animation for performance
  // animation: `quantumFade 4s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  '@keyframes quantumFade': {
    '0%, 100%': { opacity: 0 },
    '50%': { opacity: 0.6 },
  },
}));

const QuantumLuxuryGauge: React.FC<QuantumLuxuryGaugeProps> = ({
  value = 0,
  label = 'PRECISION',
  onValueChange,
  size = 280,
  animationDelay = 0,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [needleRotation, setNeedleRotation] = useState(-90);

  useEffect(() => {
    // Initial animation
    setTimeout(() => {
      setCurrentValue(value);
      const angle = (value / 100) * 180 - 90;
      setNeedleRotation(angle);
    }, animationDelay);
  }, [value, animationDelay]);

  const handleNodeClick = (nodeValue: number) => {
    setCurrentValue(nodeValue);
    const angle = (nodeValue / 100) * 180 - 90;
    setNeedleRotation(angle);
    onValueChange?.(nodeValue);
  };

  const handleCabochonClick = () => {
    const newValue = (currentValue + 10) % 101;
    setCurrentValue(newValue);
    const angle = (newValue / 100) * 180 - 90;
    setNeedleRotation(angle);
    onValueChange?.(newValue);
  };

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < 36; i++) {
    if (i % 9 === 0) {
      ticks.push(<TickMajor key={`major-${i}`} rotation={i * 10} />);
    } else {
      ticks.push(<TickMinor key={`minor-${i}`} rotation={i * 10} />);
    }
  }

  return (
    <GaugeWrapper>
      <Gauge size={size}>
        <QuantumGrid />
        <BezelOuter />
        <BezelInner />
        
        {/* Tick marks */}
        <Dial>{ticks}</Dial>
        
        {/* Precision nodes at cardinal points */}
        <PrecisionNode 
          nodePosition="12" 
          data-value="MAX" 
          onClick={() => handleNodeClick(100)}
        />
        <PrecisionNode 
          nodePosition="3" 
          data-value="75" 
          onClick={() => handleNodeClick(75)}
        />
        <PrecisionNode 
          nodePosition="6" 
          data-value="MID" 
          onClick={() => handleNodeClick(50)}
        />
        <PrecisionNode 
          nodePosition="9" 
          data-value="25" 
          onClick={() => handleNodeClick(25)}
        />
        
        {/* Quantum dots */}
        <QuantumDot style={{ top: '20%', left: '30%' }} delay={0} />
        <QuantumDot style={{ top: '70%', right: '25%' }} delay={1} />
        <QuantumDot style={{ bottom: '30%', left: '20%' }} delay={2} />
        <QuantumDot style={{ top: '40%', right: '35%' }} delay={3} />
        
        {/* Needle */}
        <Needle rotation={needleRotation} />
        
        {/* Digital Cabochon */}
        <DigitalCabochon onClick={handleCabochonClick} />
        
        {/* Digital Display */}
        <DigitalDisplay>
          <DisplayValue>{currentValue.toString().padStart(2, '0')}</DisplayValue>
          <DisplayLabel>{label}</DisplayLabel>
        </DigitalDisplay>
      </Gauge>
    </GaugeWrapper>
  );
};

export default QuantumLuxuryGauge;
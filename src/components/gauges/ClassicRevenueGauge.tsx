import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ClassicRevenueGaugeProps {
  value: number; // 0-180
  label?: string;
  odometer?: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

// Main container with leather texture
const GaugeContainer = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 200,
    medium: 260,
    large: 320
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: 16,
    padding: 20,
    background: `
      radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)
    `,
    boxShadow: `
      0 10px 40px rgba(0, 0, 0, 0.8),
      inset 0 0 80px rgba(0, 0, 0, 0.6)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    },
    // Leather texture overlay
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 16,
      opacity: 0.3,
      backgroundImage: `
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.1) 2px,
          rgba(0, 0, 0, 0.1) 4px
        )
      `,
      pointerEvents: 'none'
    }
  };
});

// Golden stitching around the edge
const StitchingBorder = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 180,
    medium: 240,
    large: 300
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    position: 'absolute',
    width: dim,
    height: dim,
    borderRadius: '50%',
    border: '2px dashed #C9B037',
    opacity: 0.4,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: '50%',
      border: '1px solid rgba(201, 176, 55, 0.2)'
    }
  };
});

// Chrome bezel
const ChromeBezel = styled(Box)<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 160,
    medium: 220,
    large: 280
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    width: dim,
    height: dim,
    position: 'relative',
    borderRadius: '50%',
    background: `
      linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b0b0b0 50%, #d0d0d0 75%, #f0f0f0 100%)
    `,
    boxShadow: `
      0 8px 16px rgba(0, 0, 0, 0.4),
      inset 0 -4px 8px rgba(0, 0, 0, 0.3),
      inset 0 4px 8px rgba(255, 255, 255, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.2)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Reflective highlight
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '5%',
      left: '15%',
      width: '30%',
      height: '20%',
      borderRadius: '50%',
      background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
      filter: 'blur(2px)'
    }
  };
});

// Inner black gauge face
const GaugeFace = styled(Box)<{ size: string }>(({ size }) => {
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
      radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0d0d0d 50%, #000000 100%)
    `,
    boxShadow: `
      inset 0 0 30px rgba(0, 0, 0, 0.8),
      inset 0 0 10px rgba(0, 0, 0, 0.9)
    `,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };
});

// SVG for tick marks and numbers
const GaugeSVG = styled('svg')<{ size: string }>(({ size }) => {
  const dimensions = {
    small: 148,
    medium: 208,
    large: 268
  };
  const dim = dimensions[size as keyof typeof dimensions] || dimensions.medium;
  
  return {
    position: 'absolute',
    width: dim,
    height: dim,
    top: 0,
    left: 0
  };
});

// Needle with realistic shadow
const Needle = styled(Box)<{ rotation: number }>(({ rotation }) => ({
  position: 'absolute',
  width: '48%',
  height: 3,
  background: `linear-gradient(90deg, 
    #8B0000 0%, 
    #DC143C 20%, 
    #FF0000 50%, 
    #DC143C 80%, 
    #8B0000 100%
  )`,
  left: '50%',
  top: '50%',
  transformOrigin: '15% center',
  transform: `translate(-15%, -50%) rotate(${rotation}deg)`,
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))',
  transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 10,
  // Needle tip
  '&::after': {
    content: '""',
    position: 'absolute',
    right: -1,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '20px solid #FF0000',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent'
  }
}));

// Center cap
const CenterCap = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 24,
  height: 24,
  borderRadius: '50%',
  background: `
    radial-gradient(circle at 30% 30%, #e0e0e0 0%, #909090 50%, #606060 100%)
  `,
  boxShadow: `
    0 3px 6px rgba(0, 0, 0, 0.5),
    inset 0 -2px 4px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.6)
  `,
  zIndex: 15,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '30%',
    height: '30%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%)'
  }
}));

// Label text
const GaugeLabel = styled('text')({
  fill: '#ffffff',
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  textAnchor: 'middle'
});

// Odometer display
const OdometerContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '25%',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#000000',
  border: '2px solid #333333',
  borderRadius: 4,
  padding: '4px 10px',
  boxShadow: `
    inset 0 2px 6px rgba(0, 0, 0, 0.8),
    0 1px 2px rgba(255, 255, 255, 0.1)
  `
}));

const OdometerText = styled('text')({
  fill: '#ffffff',
  fontSize: '14px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  letterSpacing: '0.1em'
});

const ClassicRevenueGauge: React.FC<ClassicRevenueGaugeProps> = ({
  value = 0,
  label = "REVENUE",
  odometer = "142908",
  size = "medium",
  onClick
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const clampedValue = Math.max(0, Math.min(180, value));
  
  // Animate needle on mount and value change
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(clampedValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedValue]);
  
  // Convert value to rotation (-135° to +45°)
  const rotation = -135 + (displayValue / 180) * 180;
  
  // Calculate dimensions based on size
  const svgSize = size === 'small' ? 148 : size === 'large' ? 268 : 208;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const radius = svgSize * 0.4;
  
  // Generate tick marks and numbers
  const tickMarks = [];
  const numbers = [];
  
  for (let i = 0; i <= 180; i += 10) {
    const angle = (-135 + (i / 180) * 180) * (Math.PI / 180);
    const tickLength = i % 20 === 0 ? radius * 0.15 : radius * 0.1;
    const innerRadius = radius - tickLength;
    
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * innerRadius;
    const y2 = centerY + Math.sin(angle) * innerRadius;
    
    tickMarks.push(
      <line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#ffffff"
        strokeWidth={i % 20 === 0 ? 2.5 : 1}
        opacity={i % 20 === 0 ? 0.9 : 0.6}
      />
    );
    
    // Add numbers for major ticks
    if (i % 20 === 0) {
      const numberRadius = radius - tickLength - 12;
      const nx = centerX + Math.cos(angle) * numberRadius;
      const ny = centerY + Math.sin(angle) * numberRadius;
      
      numbers.push(
        <text
          key={`num-${i}`}
          x={nx}
          y={ny}
          fill="#ffffff"
          fontSize="14px"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {i}
        </text>
      );
    }
  }
  
  return (
    <GaugeContainer size={size} onClick={onClick}>
      <StitchingBorder size={size} />
      <ChromeBezel size={size}>
        <GaugeFace size={size}>
          <GaugeSVG size={size} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            {/* Tick marks */}
            {tickMarks}
            
            {/* Numbers */}
            {numbers}
            
            {/* Label */}
            <GaugeLabel
              x={centerX}
              y={centerY + radius * 0.3}
            >
              {label}
            </GaugeLabel>
            
            {/* Odometer */}
            <foreignObject
              x={centerX - 40}
              y={centerY + radius * 0.5}
              width="80"
              height="30"
            >
              <OdometerContainer>
                <svg width="80" height="20">
                  <OdometerText x="40" y="15" textAnchor="middle">
                    {odometer}
                  </OdometerText>
                </svg>
              </OdometerContainer>
            </foreignObject>
          </GaugeSVG>
          
          {/* Needle */}
          <Needle rotation={rotation} />
          
          {/* Center cap */}
          <CenterCap />
        </GaugeFace>
      </ChromeBezel>
    </GaugeContainer>
  );
};

export default ClassicRevenueGauge;
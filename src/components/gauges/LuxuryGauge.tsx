import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

type GaugeProps = {
  label: string;
  value: number;
  displayValue?: number | string;
  unit?: string;
  max: number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  animationDelay?: number;
  colorMode?: 'auto' | 'primary' | 'gold' | 'silver';
};

const GaugeContainer = styled(Box)<{ size: string }>(({ theme, size }) => ({
  width: '100%',
  height: '100%',
  maxWidth: size === 'small' ? 200 : size === 'large' ? 320 : 260,
  maxHeight: size === 'small' ? 200 : size === 'large' ? 320 : 260,
  aspectRatio: '1 / 1',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
  borderRadius: '50%',
  boxShadow: '0 0 35px rgba(255,255,255,0.2)',
  border: '2px solid #333',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 0 45px rgba(255,255,255,0.3)',
  }
}));

function LuxuryGauge({ 
  label, 
  value, 
  displayValue,
  unit = '', 
  max, 
  size = 'medium',
  onClick,
  animationDelay = 0,
  colorMode = 'auto'
}: GaugeProps) {
  const theme = useTheme();
  const [angle, setAngle] = useState(-90);
  const percent = Math.min(value / max, 1);
  const finalAngle = percent * 180 - 90;

  useEffect(() => {
    // Delay the animation start
    const startTimeout = setTimeout(() => {
      setAngle(270); // full spin
      const finalTimeout = setTimeout(() => {
        setAngle(finalAngle);
      }, 800);
      return () => clearTimeout(finalTimeout);
    }, animationDelay);
    
    return () => clearTimeout(startTimeout);
  }, [finalAngle, animationDelay]);

  const getColor = () => {
    if (colorMode === 'primary') return theme.palette.primary.main;
    if (colorMode === 'gold') return '#FFD700';
    if (colorMode === 'silver') return '#C0C0C0';
    
    // Auto color based on percentage
    if (percent < 0.4) return '#10b981'; // green
    if (percent < 0.7) return '#f59e0b'; // yellow/amber
    return '#ef4444'; // red
  };

  const needleColor = getColor();
  const scaleFactor = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;

  return (
    <GaugeContainer size={size} onClick={onClick}>
      <svg 
        viewBox="0 0 200 200" 
        style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%' 
        }}
      >
        {/* Outer rim with gradient */}
        <defs>
          <radialGradient id={`rimGrad-${label}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#aaa" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main gauge circle */}
        <circle 
          cx="100" 
          cy="100" 
          r="90" 
          stroke={`url(#rimGrad-${label})`} 
          strokeWidth="6" 
          fill="none" 
        />
        
        {/* Scale marks */}
        {[...Array(11)].map((_, i) => {
          const a = (i * 180) / 10 - 90;
          const rad = (a * Math.PI) / 180;
          const isMain = i % 2 === 0;
          const x1 = 100 + (isMain ? 70 : 75) * Math.cos(rad);
          const y1 = 100 + (isMain ? 70 : 75) * Math.sin(rad);
          const x2 = 100 + 80 * Math.cos(rad);
          const y2 = 100 + 80 * Math.sin(rad);
          
          return (
            <line 
              key={i} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#666"
              strokeWidth={isMain ? "2" : "1"} 
            />
          );
        })}
        
        {/* Active arc showing current value */}
        <path
          d={`M 20 100 A 80 80 0 ${percent > 0.5 ? 1 : 0} 1 ${
            100 + 80 * Math.cos((finalAngle * Math.PI) / 180)
          } ${100 + 80 * Math.sin((finalAngle * Math.PI) / 180)}`}
          stroke={needleColor}
          strokeWidth="3"
          fill="none"
          opacity="0.5"
          filter={`url(#glow-${label})`}
        />
      </svg>
      
      {/* Needle */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transformOrigin: 'bottom',
          transition: 'transform 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate(-50%, -100%) rotate(${angle}deg)`,
        }}
      >
        <Box
          sx={{
            width: '6px',
            height: `${96 * scaleFactor}px`,
            background: `linear-gradient(to bottom, ${needleColor} 0%, ${needleColor}dd 70%, ${needleColor}aa 100%)`,
            borderRadius: '3px',
            boxShadow: `0 0 10px ${needleColor}`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: needleColor,
              boxShadow: `0 0 15px ${needleColor}`,
            }
          }}
        />
      </Box>
      
      {/* Center cap */}
      <Box
        sx={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #666, #222)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.2)',
          border: '1px solid #444',
        }}
      />
      
      {/* Digital display */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontWeight: 700,
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            color: needleColor,
            textShadow: `0 0 10px ${needleColor}`,
            letterSpacing: '0.05em',
          }}
        >
          {displayValue ?? value}{unit}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
            fontWeight: 500,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {label}
        </Typography>
      </Box>
      
      {/* Status indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          display: 'flex',
          gap: 0.5,
        }}
      >
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: '20px',
              height: '4px',
              background: i < Math.ceil(percent * 4) ? needleColor : '#333',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              boxShadow: i < Math.ceil(percent * 4) ? `0 0 5px ${needleColor}` : 'none',
            }}
          />
        ))}
      </Box>
    </GaugeContainer>
  );
}

export default LuxuryGauge;
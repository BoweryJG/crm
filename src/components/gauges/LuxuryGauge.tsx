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
  variant?: 'default' | 'revenue-gold' | 'pipeline-plasma' | 'quota-crimson' | 'conversion-neon';
};

const getVariantStyles = (variant: string, colorMode: string) => {
  // All variants share consistent rim depth and structure
  const baseRim = {
    borderWidth: '3px',
    borderStyle: 'solid',
  };

  switch (variant) {
    case 'revenue-gold': // Gold with carbon face
      return {
        ...baseRim,
        background: `
          radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%),
          url("/carbon-texture.svg")
        `,
        backgroundSize: '100% 100%, 4px 4px',
        backgroundBlendMode: 'normal, overlay',
        borderColor: '#B8860B',
        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.9)',
      };
    case 'pipeline-plasma': // Violet plasma halo
      return {
        ...baseRim,
        background: 'radial-gradient(circle at 50% 50%, #0a0616 0%, #000 100%)',
        borderColor: '#8B7BE8',
        boxShadow: '0 0 60px rgba(139, 123, 232, 0.5), inset 0 0 40px rgba(139, 123, 232, 0.2)',
      };
    case 'quota-crimson': // Crimson with fighter jet gauge lines
      return {
        ...baseRim,
        background: 'radial-gradient(circle at 50% 50%, #1a0a0a 0%, #000 100%)',
        borderColor: '#DC143C',
        boxShadow: '0 0 50px rgba(220, 20, 60, 0.4), inset 0 0 30px rgba(0, 0, 0, 0.9)',
      };
    case 'conversion-neon': // Neon orange with Tron-style
      return {
        ...baseRim,
        background: 'radial-gradient(circle at 50% 50%, #0a0a0a 0%, #000 100%)',
        borderColor: '#FF4500',
        boxShadow: '0 0 50px rgba(255, 69, 0, 0.6), inset 0 0 20px rgba(255, 69, 0, 0.1)',
      };
    default:
      return {
        ...baseRim,
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)',
        borderColor: '#333',
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.8)',
      };
  }
};

const GaugeContainer = styled(Box)<{ size: string; variant: string; colorMode: string }>(({ theme, size, variant, colorMode }) => ({
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
  borderRadius: '50%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  ...getVariantStyles(variant, colorMode),
  '&:hover': {
    transform: 'scale(1.02)',
    ...(() => {
      const styles = getVariantStyles(variant, colorMode);
      return {
        ...styles,
        boxShadow: styles.boxShadow?.replace('0 0', '0 0').replace('30px', '45px').replace('40px', '55px').replace('50px', '65px').replace('60px', '75px') || styles.boxShadow,
      };
    })(),
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
  colorMode = 'auto',
  variant = 'default'
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
    // Match needle color to variant theme
    switch (variant) {
      case 'revenue-gold':
        return '#FFD700'; // Gold
      case 'pipeline-plasma':
        return '#8B7BE8'; // Violet
      case 'quota-crimson':
        return '#DC143C'; // Crimson
      case 'conversion-neon':
        return '#FF4500'; // Orange red
      default:
        // Auto color based on percentage for default variant
        if (percent < 0.4) return '#10b981'; // green
        if (percent < 0.7) return '#f59e0b'; // yellow/amber
        return '#ef4444'; // red
    }
  };

  const needleColor = getColor();
  const scaleFactor = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;

  return (
    <GaugeContainer size={size} variant={variant} colorMode={colorMode} onClick={onClick}>
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
        
        {/* Scale marks - consistent across all variants */}
        {[...Array(21)].map((_, i) => {
          const a = (i * 180) / 20 - 90;
          const rad = (a * Math.PI) / 180;
          const isMain = i % 4 === 0;
          const isMid = i % 2 === 0;
          const x1 = 100 + (isMain ? 65 : isMid ? 70 : 73) * Math.cos(rad);
          const y1 = 100 + (isMain ? 65 : isMid ? 70 : 73) * Math.sin(rad);
          const x2 = 100 + 78 * Math.cos(rad);
          const y2 = 100 + 78 * Math.sin(rad);
          
          return (
            <line 
              key={i} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#888"
              strokeWidth={isMain ? "2.5" : isMid ? "1.5" : "1"} 
              opacity={isMain ? 1 : isMid ? 0.7 : 0.5}
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
      
      {/* Needle - consistent 3px width across all variants */}
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
            width: '3px',
            height: `${90 * scaleFactor}px`,
            background: `linear-gradient(to bottom, ${needleColor} 0%, ${needleColor} 85%, rgba(0,0,0,0.8) 100%)`,
            borderRadius: '1.5px',
            boxShadow: `0 2px 8px rgba(0,0,0,0.6), 0 0 20px ${needleColor}66`,
            position: 'relative',
          }}
        />
      </Box>
      
      {/* Center cap - consistent chrome finish */}
      <Box
        sx={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #c0c0c0 0%, #808080 50%, #404040 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.6)',
          border: '2px solid #303030',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }
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
            fontSize: '1.875rem',
            fontWeight: 700,
            fontFamily: '"Orbitron", "Roboto Mono", monospace',
            color: needleColor,
            textShadow: `0 0 12px ${needleColor}66`,
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          {displayValue ?? value}{unit}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: '4px',
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
// SculpturalMenuToggle - The Hamburger as Art
// Three lines that transform into a sculptural monument
// Where UI becomes gallery-worthy interaction

import React, { useState } from 'react';
import { Box, IconButton, useTheme, alpha } from '@mui/material';
import animations from '../../themes/animations';

interface SculpturalMenuToggleProps {
  open: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}

const SculpturalMenuToggle: React.FC<SculpturalMenuToggleProps> = ({ 
  open, 
  onClick, 
  size = 'medium' 
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  // Size configurations
  const sizes = {
    small: { width: 20, height: 16, barHeight: 2 },
    medium: { width: 28, height: 22, barHeight: 3 },
    large: { width: 36, height: 28, barHeight: 4 },
  };
  
  const { width, height, barHeight } = sizes[size];
  const spacing = (height - barHeight * 3) / 2;
  
  return (
    <IconButton
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        width: width + 24,
        height: height + 24,
        p: 0,
        overflow: 'visible',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        // Glow effect on hover
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 60%)`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: barHeight,
            backgroundColor: theme.palette.primary.main,
            borderRadius: barHeight / 2,
            transform: open 
              ? `rotate(45deg) translateY(${height / 2 - barHeight / 2}px)`
              : isHovered 
              ? 'translateY(-2px) scaleX(0.8)'
              : 'none',
            transformOrigin: 'center',
            transition: animations.utils.createTransition(
              open ? animations.durations.normal : animations.durations.instant,
              animations.easings.monolith
            ).transition,
            boxShadow: `0 0 ${isHovered ? 8 : 4}px ${alpha(theme.palette.primary.main, 0.6)}`,
            // Gradient overlay for depth
            background: `linear-gradient(90deg, 
              ${theme.palette.primary.main}, 
              ${alpha(theme.palette.primary.light || theme.palette.primary.main, 0.8)}
            )`,
          }}
        />
        
        {/* Middle Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            height: barHeight,
            backgroundColor: theme.palette.primary.main,
            borderRadius: barHeight / 2,
            opacity: open ? 0 : 1,
            scaleX: open ? 0 : isHovered ? 1.1 : 1,
            transition: animations.utils.createTransition(
              open ? animations.durations.instant : animations.durations.normal,
              animations.easings.monolith
            ).transition,
            boxShadow: `0 0 ${isHovered ? 8 : 4}px ${alpha(theme.palette.primary.main, 0.6)}`,
            // Gradient overlay
            background: `linear-gradient(90deg, 
              ${alpha(theme.palette.primary.light || theme.palette.primary.main, 0.8)}, 
              ${theme.palette.primary.main},
              ${alpha(theme.palette.primary.light || theme.palette.primary.main, 0.8)}
            )`,
          }}
        />
        
        {/* Bottom Bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: barHeight,
            backgroundColor: theme.palette.primary.main,
            borderRadius: barHeight / 2,
            transform: open 
              ? `rotate(-45deg) translateY(-${height / 2 - barHeight / 2}px)`
              : isHovered 
              ? 'translateY(2px) scaleX(0.8)'
              : 'none',
            transformOrigin: 'center',
            transition: animations.utils.createTransition(
              open ? animations.durations.normal : animations.durations.instant,
              animations.easings.monolith
            ).transition,
            boxShadow: `0 0 ${isHovered ? 8 : 4}px ${alpha(theme.palette.primary.main, 0.6)}`,
            // Gradient overlay
            background: `linear-gradient(90deg, 
              ${alpha(theme.palette.primary.light || theme.palette.primary.main, 0.8)},
              ${theme.palette.primary.main}
            )`,
          }}
        />
        
        {/* Corner accent pieces when open */}
        {open && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: barHeight,
                height: barHeight,
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.6,
                boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                animation: `${animations.loading.goldPulse}`,
              }}
            />
          </>
        )}
      </Box>
    </IconButton>
  );
};

export default SculpturalMenuToggle;
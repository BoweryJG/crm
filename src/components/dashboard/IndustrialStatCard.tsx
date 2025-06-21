import React from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const pulseGlow = keyframes`
  0%, 100% {
    opacity: 0.6;
    box-shadow: 0 0 10px currentColor;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  }
`;

const ledFlicker = keyframes`
  0%, 100% {
    opacity: 1;
  }
  95% {
    opacity: 0.8;
  }
`;

interface IndustrialStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  accentColor: string;
  index: number;
}

const IndustrialStatCard: React.FC<IndustrialStatCardProps> = ({
  title,
  value,
  icon,
  change,
  accentColor,
  index
}) => {
  const theme = useTheme();
  
  const getTrendColor = () => {
    if (change.trend === 'up') return '#00ff41'; // Matrix green
    if (change.trend === 'down') return '#ff0040'; // Warning red
    return '#ffaa00'; // Amber neutral
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px ${accentColor}20`,
          '& .industrial-glow': {
            opacity: 1,
          },
          '& .value-display': {
            textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          animation: `${pulseGlow} 3s ease-in-out infinite`,
          animationDelay: `${index * 0.2}s`,
        }
      }}
    >
      {/* Corner screws */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 }
      ].map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            ...pos,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #666 0%, #333 100%)',
            border: '1px solid #222',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
          }}
        />
      ))}

      {/* Industrial glow effect */}
      <Box
        className="industrial-glow"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, ${accentColor}20 0%, transparent 70%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <Box sx={{ position: 'relative', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontSize: '0.7rem',
              fontFamily: 'monospace',
            }}
          >
            {title}
          </Typography>
          
          {/* Icon with industrial frame */}
          <Box
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
              '& > svg': {
                fontSize: 20,
                color: accentColor,
                filter: `drop-shadow(0 0 4px ${accentColor})`,
              }
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Value display with LED effect */}
        <Typography
          className="value-display"
          variant="h4"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1,
            mb: 'auto',
            animation: `${ledFlicker} 10s ease-in-out infinite`,
            animationDelay: `${index * 0.5}s`,
            transition: 'all 0.3s ease',
          }}
        >
          {value}
        </Typography>

        {/* Trend indicator with warning light */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* LED indicator */}
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: getTrendColor(),
              boxShadow: `0 0 10px ${getTrendColor()}, inset 0 0 3px rgba(0,0,0,0.5)`,
              animation: change.trend !== 'neutral' ? `${pulseGlow} 2s ease-in-out infinite` : 'none',
            }}
          />
          
          {/* Trend value */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {change.trend === 'up' && <TrendingUp sx={{ fontSize: 14, color: getTrendColor() }} />}
            {change.trend === 'down' && <TrendingDown sx={{ fontSize: 14, color: getTrendColor() }} />}
            <Typography
              variant="caption"
              sx={{
                color: getTrendColor(),
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {change.value}%
            </Typography>
          </Box>
          
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              fontSize: '0.7rem',
              ml: 'auto',
              fontFamily: 'monospace',
            }}
          >
            vs last period
          </Typography>
        </Box>
      </Box>

      {/* Industrial texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.05) 10px,
            rgba(255,255,255,0.05) 20px
          )`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default IndustrialStatCard;
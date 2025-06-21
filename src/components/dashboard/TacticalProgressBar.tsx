import React from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';

const scanLine = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const warningPulse = keyframes`
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
`;

const segmentFlash = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

interface TacticalProgressBarProps {
  current: number;
  goal: number;
  progress: number;
  formatValue: (value: number) => string;
}

const TacticalProgressBar: React.FC<TacticalProgressBarProps> = ({
  current,
  goal,
  progress,
  formatValue
}) => {
  const theme = useTheme();
  const segments = 20; // Number of LED segments
  const filledSegments = Math.floor((progress / 100) * segments);
  
  const getSegmentColor = (index: number) => {
    const filled = index < filledSegments;
    if (!filled) return 'rgba(255, 255, 255, 0.05)';
    
    const percentage = (index / segments) * 100;
    if (percentage < 60) return '#00ff41'; // Green
    if (percentage < 80) return '#ffaa00'; // Amber
    return '#ff0040'; // Red
  };

  return (
    <Box
      sx={{
        position: 'relative',
        p: 3,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Industrial frame corners */}
      {[
        { top: 12, left: 12 },
        { top: 12, right: 12 },
        { bottom: 12, left: 12 },
        { bottom: 12, right: 12 }
      ].map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            ...pos,
            width: 8,
            height: 8,
            background: 'linear-gradient(135deg, #666 0%, #333 100%)',
            transform: 'rotate(45deg)',
            border: '1px solid #222',
          }}
        />
      ))}

      {/* Header with tactical styling */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Mission Progress
          </Typography>
          {/* Status indicator */}
          <Box
            sx={{
              px: 2,
              py: 0.5,
              background: progress >= 100 ? '#00ff4120' : '#ffaa0020',
              border: `1px solid ${progress >= 100 ? '#00ff41' : '#ffaa00'}`,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: progress >= 100 ? '#00ff41' : '#ffaa00',
                fontWeight: 600,
                animation: `${warningPulse} 2s ease-in-out infinite`,
              }}
            >
              {progress >= 100 ? 'TARGET ACHIEVED' : 'IN PROGRESS'}
            </Typography>
          </Box>
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Orbitron", monospace',
            fontWeight: 900,
            color: progress >= 80 ? '#ff0040' : progress >= 60 ? '#ffaa00' : '#00ff41',
            textShadow: `0 0 20px currentColor`,
          }}
        >
          {progress}%
        </Typography>
      </Box>

      {/* LED segment bar */}
      <Box sx={{ position: 'relative', mb: 3 }}>
        {/* Background track */}
        <Box
          sx={{
            height: 24,
            background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
            borderRadius: 1,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* LED segments */}
          <Box sx={{ display: 'flex', gap: '2px', p: '2px', height: '100%' }}>
            {Array.from({ length: segments }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  background: getSegmentColor(index),
                  borderRadius: 0.5,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  animation: index === filledSegments - 1 ? `${segmentFlash} 1s ease-in-out infinite` : 'none',
                  boxShadow: index < filledSegments ? `0 0 10px ${getSegmentColor(index)}` : 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                    borderRadius: 0.5,
                  }
                }}
              />
            ))}
          </Box>

          {/* Scanning line effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, transparent, #00ff41, transparent)',
              animation: `${scanLine} 4s linear infinite`,
              opacity: 0.8,
            }}
          />
        </Box>
      </Box>

      {/* Data readout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Box
          sx={{
            p: 2,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              display: 'block',
              mb: 0.5,
            }}
          >
            Current Status
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: '#00ff41',
              textShadow: '0 0 10px currentColor',
            }}
          >
            {formatValue(current)}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              display: 'block',
              mb: 0.5,
            }}
          >
            Target Objective
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: '#ffaa00',
              textShadow: '0 0 10px currentColor',
            }}
          >
            {formatValue(goal)}
          </Typography>
        </Box>
      </Box>

      {/* Grid overlay effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)
          `,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default TacticalProgressBar;
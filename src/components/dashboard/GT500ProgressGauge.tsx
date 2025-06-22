import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, keyframes, alpha } from '@mui/material';

const needleSweep = keyframes`
  0% {
    transform: rotate(-135deg);
  }
  100% {
    transform: rotate(-135deg);
  }
`;

const startupSweep = keyframes`
  0% {
    transform: rotate(-135deg);
  }
  50% {
    transform: rotate(135deg);
  }
  100% {
    transform: rotate(-135deg);
  }
`;

const phosphorescentGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 3px #00ff41) drop-shadow(0 0 6px #00ff41);
    opacity: 0.9;
  }
  50% {
    filter: drop-shadow(0 0 6px #00ff41) drop-shadow(0 0 12px #00ff41);
    opacity: 1;
  }
`;

const gearShift = keyframes`
  0%, 90% {
    transform: scale(1);
    opacity: 1;
  }
  95% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const redlineWarning = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
`;

interface GT500ProgressGaugeProps {
  current: number;
  goal: number;
  progress: number;
  formatValue: (value: number) => string;
}

const GT500ProgressGauge: React.FC<GT500ProgressGaugeProps> = ({
  current,
  goal,
  progress,
  formatValue
}) => {
  const theme = useTheme();
  const [isStartup, setIsStartup] = useState(true);
  const [currentGear, setCurrentGear] = useState(1);
  const [velocity, setVelocity] = useState(0);
  const previousProgressRef = useRef(progress);
  
  // Calculate rotation angle for the needle (-135° to 135°, 270° total sweep)
  const needleRotation = -135 + (progress / 100) * 270;
  
  // Calculate current gear based on progress
  useEffect(() => {
    const gear = Math.min(6, Math.max(1, Math.ceil(progress / 16.67))); // 6 gears, ~16.67% each
    setCurrentGear(gear);
  }, [progress]);
  
  // Calculate velocity (rate of change)
  useEffect(() => {
    const delta = progress - previousProgressRef.current;
    setVelocity(Math.abs(delta));
    previousProgressRef.current = progress;
  }, [progress]);
  
  // Startup animation
  useEffect(() => {
    const timer = setTimeout(() => setIsStartup(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const isRedline = progress >= 85;
  const isDanger = progress >= 95;
  
  // Generate tick marks for the gauge
  const generateTicks = () => {
    const ticks = [];
    const majorTickInterval = 10; // Major tick every 10%
    const minorTickInterval = 2;  // Minor tick every 2%
    
    for (let i = 0; i <= 100; i += minorTickInterval) {
      const angle = -135 + (i / 100) * 270;
      const isMajor = i % majorTickInterval === 0;
      const isRedlineTick = i >= 85;
      
      ticks.push(
        <line
          key={`tick-${i}`}
          x1="0"
          y1={isMajor ? "-95" : "-98"}
          x2="0"
          y2="-85"
          stroke={isRedlineTick ? "#dc143c" : "#666"}
          strokeWidth={isMajor ? "2" : "1"}
          opacity={isMajor ? 1 : 0.5}
          transform={`rotate(${angle})`}
        />
      );
      
      // Add value labels for major ticks
      if (isMajor) {
        const value = (goal / 100) * i;
        const labelRadius = 75;
        const labelAngle = (angle - 90) * (Math.PI / 180);
        const x = Math.cos(labelAngle) * labelRadius;
        const y = Math.sin(labelAngle) * labelRadius;
        
        ticks.push(
          <text
            key={`label-${i}`}
            x={x}
            y={y + 4}
            fill={isRedlineTick ? "#dc143c" : "#888"}
            fontSize="10"
            fontFamily="'Orbitron', monospace"
            fontWeight="600"
            textAnchor="middle"
          >
            {i === 0 ? '0' : i === 100 ? '1.3M' : `${(value / 1000000).toFixed(1)}M`}
          </text>
        );
      }
    }
    
    return ticks;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        p: 4,
        background: `
          radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.01) 2px,
            rgba(255,255,255,0.01) 4px
          )
        `,
        borderRadius: 3,
        border: '2px solid #222',
        boxShadow: `
          inset 0 0 30px rgba(0,0,0,0.8),
          0 0 20px rgba(0,0,0,0.6),
          0 0 40px rgba(30,144,255,0.1)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Carbon fiber texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.1) 2px,
              rgba(255,255,255,0.1) 4px
            )
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Main gauge container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: 3,
              textShadow: '0 0 10px rgba(30,144,255,0.5)',
              mb: 1,
            }}
          >
            Mission Progress
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Orbitron', monospace",
              color: '#1e90ff',
              textTransform: 'uppercase',
              letterSpacing: 2,
              display: 'block',
            }}
          >
            GT500 Performance Metrics
          </Typography>
        </Box>

        {/* Primary gauge */}
        <Box
          sx={{
            position: 'relative',
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Bezel */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `
                conic-gradient(
                  from 0deg,
                  #c0c0c0 0deg,
                  #e0e0e0 45deg,
                  #c0c0c0 90deg,
                  #a0a0a0 135deg,
                  #c0c0c0 180deg,
                  #e0e0e0 225deg,
                  #c0c0c0 270deg,
                  #a0a0a0 315deg,
                  #c0c0c0 360deg
                )
              `,
              boxShadow: `
                inset 0 0 20px rgba(0,0,0,0.5),
                0 5px 15px rgba(0,0,0,0.8),
                0 0 30px rgba(30,144,255,0.2)
              `,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '5px',
                left: '5px',
                right: '5px',
                bottom: '5px',
                borderRadius: '50%',
                background: '#0a0a0a',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
              },
            }}
          />

          {/* Gauge face */}
          <svg
            width="280"
            height="280"
            viewBox="-140 -140 280 280"
            style={{ position: 'absolute', zIndex: 2 }}
          >
            {/* Redline zone */}
            <path
              d={`
                M ${85 * Math.cos((-135 + 0.85 * 270 - 90) * Math.PI / 180)} 
                  ${85 * Math.sin((-135 + 0.85 * 270 - 90) * Math.PI / 180)}
                A 85 85 0 0 1 
                  ${85 * Math.cos((135 - 90) * Math.PI / 180)} 
                  ${85 * Math.sin((135 - 90) * Math.PI / 180)}
                L ${100 * Math.cos((135 - 90) * Math.PI / 180)} 
                  ${100 * Math.sin((135 - 90) * Math.PI / 180)}
                A 100 100 0 0 0 
                  ${100 * Math.cos((-135 + 0.85 * 270 - 90) * Math.PI / 180)} 
                  ${100 * Math.sin((-135 + 0.85 * 270 - 90) * Math.PI / 180)}
                Z
              `}
              fill="#dc143c"
              opacity={0.2}
              style={{
                animation: isRedline ? `${redlineWarning} 1s ease-in-out infinite` : 'none'
              }}
            />

            {/* Tick marks */}
            <g>{generateTicks()}</g>

            {/* Center hub */}
            <circle cx="0" cy="0" r="15" fill="#222" stroke="#666" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#111" />

            {/* Needle */}
            <g
              transform={`rotate(${isStartup ? 0 : needleRotation})`}
              style={{
                transition: isStartup ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: isStartup ? `${startupSweep} 2s ease-out` : 'none',
              }}
            >
              {/* Needle shadow */}
              <polygon
                points="0,-8 3,0 0,85 -3,0"
                fill="rgba(0,0,0,0.5)"
                transform="translate(2, 2)"
              />
              
              {/* Main needle */}
              <polygon
                points="0,-8 3,0 0,85 -3,0"
                fill="#dc143c"
                stroke="#ff0040"
                strokeWidth="0.5"
              />
              
              {/* Needle tip (phosphorescent) */}
              <circle
                cx="0"
                cy="85"
                r="5"
                fill="#00ff41"
                style={{
                  animation: `${phosphorescentGlow} 2s ease-in-out infinite`,
                }}
              />
              
              {/* Counter-balance */}
              <circle cx="0" cy="-20" r="8" fill="#666" stroke="#444" strokeWidth="1" />
            </g>

            {/* Glass effect overlay */}
            <ellipse
              cx="0"
              cy="-60"
              rx="100"
              ry="60"
              fill="url(#glassGradient)"
              opacity="0.15"
            />
            
            <defs>
              <radialGradient id="glassGradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Digital readout in center */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 60,
              textAlign: 'center',
              zIndex: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Orbitron', monospace",
                fontWeight: 900,
                color: isRedline ? '#ff0040' : '#00ff41',
                textShadow: `0 0 20px ${isRedline ? '#ff0040' : '#00ff41'}`,
                letterSpacing: 1,
              }}
            >
              {progress}%
            </Typography>
          </Box>
        </Box>

        {/* Gear indicator */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            p: 2,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: 2,
            border: '1px solid #333',
            position: 'relative',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: -8,
              left: 16,
              background: '#0a0a0a',
              px: 1,
              color: '#666',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
            }}
          >
            Gear Position
          </Typography>
          
          {[1, 2, 3, 4, 5, 6].map((gear) => (
            <Box
              key={gear}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: gear === currentGear 
                  ? 'linear-gradient(135deg, #1e90ff 0%, #0066cc 100%)'
                  : 'rgba(255,255,255,0.05)',
                borderRadius: 1,
                border: gear === currentGear ? '2px solid #1e90ff' : '1px solid #333',
                boxShadow: gear === currentGear ? '0 0 20px #1e90ff' : 'none',
                animation: gear === currentGear ? `${gearShift} 0.3s ease-out` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 700,
                  color: gear === currentGear ? '#fff' : '#444',
                  textShadow: gear === currentGear ? '0 0 10px #fff' : 'none',
                }}
              >
                {gear}
              </Typography>
            </Box>
          ))}
          
          {/* Shift indicator */}
          {velocity > 2 && currentGear < 6 && (
            <Box
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#00ff41',
                animation: `${phosphorescentGlow} 0.5s ease-in-out infinite`,
              }}
            >
              ▲
            </Box>
          )}
        </Box>

        {/* Performance metrics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: '100%' }}>
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid #333',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Brushed metal effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 1px,
                    rgba(255,255,255,0.03) 1px,
                    rgba(255,255,255,0.03) 2px
                  )
                `,
                pointerEvents: 'none',
              }}
            />
            
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
              Current Output
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Orbitron', monospace",
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
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid #333',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Brushed metal effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 1px,
                    rgba(255,255,255,0.03) 1px,
                    rgba(255,255,255,0.03) 2px
                  )
                `,
                pointerEvents: 'none',
              }}
            />
            
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
              Target Redline
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Orbitron', monospace",
                fontWeight: 700,
                color: '#dc143c',
                textShadow: '0 0 10px currentColor',
              }}
            >
              {formatValue(goal)}
            </Typography>
          </Box>
        </Box>

        {/* Velocity indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 3,
            py: 1,
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 20,
            border: '1px solid #333',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
            }}
          >
            Velocity
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: 12,
                  background: i < Math.ceil(velocity) ? '#00ff41' : '#222',
                  boxShadow: i < Math.ceil(velocity) ? '0 0 5px #00ff41' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GT500ProgressGauge;
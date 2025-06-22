import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';

// Tourbillon rotation animation
const tourbillonRotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Moonphase animation
const moonphaseRotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

// Subtle balance wheel oscillation
const balanceWheelOscillation = keyframes`
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
`;

// Guilloché pattern shimmer
const guillochéShimmer = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

// Hand sweep with realistic pause
const handSweep = keyframes`
  0% { transform: rotate(-90deg); }
  98% { transform: rotate(-90deg); }
  100% { transform: rotate(-89deg); }
`;

interface HauteHorlogerieProgressGaugeProps {
  current: number;
  goal: number;
  progress: number;
  formatValue: (value: number) => string;
}

const HauteHorlogerieProgressGauge: React.FC<HauteHorlogerieProgressGaugeProps> = ({
  current,
  goal,
  progress,
  formatValue
}) => {
  const theme = useTheme();
  const [time, setTime] = useState(new Date());
  const progressRadians = (progress / 100) * Math.PI * 2 - Math.PI / 2;
  
  // Update time for realistic watch hands
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours + minutes / 60) * 30 - 90;
  const minuteAngle = (minutes + seconds / 60) * 6 - 90;
  const secondAngle = seconds * 6 - 90;

  return (
    <Box
      sx={{
        position: 'relative',
        p: 5,
        background: `
          radial-gradient(ellipse at top left, #1a1a1a 0%, #0a0a0a 40%),
          radial-gradient(ellipse at bottom right, #141414 0%, #000000 60%)
        `,
        borderRadius: 3,
        border: '1px solid #2a2a2a',
        boxShadow: `
          inset 0 2px 4px rgba(0,0,0,0.9),
          inset 0 -2px 4px rgba(255,255,255,0.05),
          0 10px 40px rgba(0,0,0,0.8),
          0 0 120px rgba(212,175,55,0.05)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Guilloché pattern background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              #d4af37 0deg 1deg,
              transparent 1deg 2deg
            ),
            repeating-radial-gradient(
              circle at 50% 50%,
              transparent 0px,
              #d4af37 1px,
              transparent 2px,
              transparent 20px
            )
          `,
          animation: `${guillochéShimmer} 30s linear infinite`,
          pointerEvents: 'none',
        }}
      />

      {/* Main container */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {/* Header with maison signature */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              fontFamily: "'Didot', 'Bodoni MT', serif",
              fontSize: '0.7rem',
              letterSpacing: 4,
              color: '#d4af37',
              display: 'block',
              mb: 1,
            }}
          >
            MAISON RÉPŠPHÈRES
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Didot', 'Bodoni MT', serif",
              fontWeight: 300,
              color: '#fff',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Mission Progress
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Didot', 'Bodoni MT', serif",
              color: '#888',
              letterSpacing: 3,
              display: 'block',
              mt: 0.5,
            }}
          >
            GRANDE COMPLICATION
          </Typography>
        </Box>

        {/* Main watch dial */}
        <Box
          sx={{
            position: 'relative',
            width: 340,
            height: 340,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer case in rose gold */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `
                conic-gradient(
                  from 0deg,
                  #d4af37 0deg,
                  #f4e5c2 60deg,
                  #d4af37 120deg,
                  #b8941f 180deg,
                  #d4af37 240deg,
                  #f4e5c2 300deg,
                  #d4af37 360deg
                )
              `,
              boxShadow: `
                inset 0 0 20px rgba(0,0,0,0.4),
                0 5px 20px rgba(0,0,0,0.6),
                0 0 60px rgba(212,175,55,0.2)
              `,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '3px',
                left: '3px',
                right: '3px',
                bottom: '3px',
                borderRadius: '50%',
                background: '#0a0a0a',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9)',
              },
            }}
          />

          {/* Inner dial with sunburst pattern */}
          <svg
            width="320"
            height="320"
            viewBox="-160 -160 320 320"
            style={{ position: 'absolute', zIndex: 2 }}
          >
            <defs>
              {/* Sunburst pattern */}
              <radialGradient id="sunburstDial">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
              
              {/* Rose gold gradient */}
              <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f4e5c2" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#b8941f" />
              </linearGradient>

              {/* Moonphase gradient */}
              <radialGradient id="moonGradient">
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="100%" stopColor="#c0c0c0" />
              </radialGradient>
            </defs>

            {/* Main dial */}
            <circle cx="0" cy="0" r="150" fill="url(#sunburstDial)" />
            
            {/* Sunburst lines */}
            {[...Array(60)].map((_, i) => (
              <line
                key={`ray-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="-150"
                stroke="#1f1f1f"
                strokeWidth="0.5"
                opacity="0.3"
                transform={`rotate(${i * 6})`}
              />
            ))}

            {/* Progress track - outer ring */}
            <circle
              cx="0"
              cy="0"
              r="140"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="20"
              opacity="0.5"
            />
            
            {/* Progress fill */}
            <circle
              cx="0"
              cy="0"
              r="140"
              fill="none"
              stroke="url(#roseGold)"
              strokeWidth="20"
              strokeDasharray={`${(progress / 100) * Math.PI * 280} ${Math.PI * 280}`}
              strokeDashoffset={Math.PI * 280 * 0.25}
              transform="rotate(-90)"
              opacity="0.8"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.5))',
                transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* Hour markers */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30;
              const isQuarter = i % 3 === 0;
              const x1 = Math.cos((angle - 90) * Math.PI / 180) * 120;
              const y1 = Math.sin((angle - 90) * Math.PI / 180) * 120;
              const x2 = Math.cos((angle - 90) * Math.PI / 180) * (isQuarter ? 105 : 110);
              const y2 = Math.sin((angle - 90) * Math.PI / 180) * (isQuarter ? 105 : 110);
              
              return (
                <g key={`marker-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#d4af37"
                    strokeWidth={isQuarter ? "2" : "1"}
                    opacity="0.8"
                  />
                  {isQuarter && (
                    <text
                      x={Math.cos((angle - 90) * Math.PI / 180) * 90}
                      y={Math.sin((angle - 90) * Math.PI / 180) * 90 + 5}
                      fill="#d4af37"
                      fontSize="14"
                      fontFamily="'Didot', serif"
                      fontWeight="300"
                      textAnchor="middle"
                    >
                      {i === 0 ? '12' : i === 3 ? '3' : i === 6 ? '6' : '9'}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Tourbillon complication at 6 o'clock */}
            <g transform="translate(0, 70)">
              <circle cx="0" cy="0" r="30" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
              <g style={{ animation: `${tourbillonRotation} 60s linear infinite` }}>
                {/* Tourbillon cage */}
                <circle cx="0" cy="0" r="25" fill="none" stroke="#666" strokeWidth="0.5" />
                <line x1="-25" y1="0" x2="25" y2="0" stroke="#666" strokeWidth="0.5" />
                <line x1="0" y1="-25" x2="0" y2="25" stroke="#666" strokeWidth="0.5" />
                
                {/* Balance wheel */}
                <g style={{ animation: `${balanceWheelOscillation} 0.5s ease-in-out infinite` }}>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#d4af37" strokeWidth="1" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#d4af37" strokeWidth="0.5" />
                </g>
              </g>
            </g>

            {/* Moonphase complication at 12 o'clock */}
            <g transform="translate(0, -70)">
              <clipPath id="moonphaseClip">
                <circle cx="0" cy="0" r="25" />
              </clipPath>
              <circle cx="0" cy="0" r="25" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
              <g clipPath="url(#moonphaseClip)">
                {/* Night sky */}
                <rect x="-25" y="-25" width="50" height="50" fill="#000033" />
                {/* Stars */}
                {[...Array(5)].map((_, i) => (
                  <circle
                    key={`star-${i}`}
                    cx={-15 + i * 7}
                    cy={-10 + (i % 2) * 8}
                    r="0.5"
                    fill="#fff"
                    opacity="0.8"
                  />
                ))}
                {/* Moon */}
                <g style={{ animation: `${moonphaseRotation} 120s linear infinite` }}>
                  <circle cx="-15" cy="0" r="12" fill="url(#moonGradient)" />
                  <circle cx="-18" cy="-2" r="2" fill="#999" opacity="0.3" />
                  <circle cx="-12" cy="3" r="1.5" fill="#999" opacity="0.3" />
                </g>
              </g>
            </g>

            {/* Small seconds subdial at 9 o'clock */}
            <g transform="translate(-70, 0)">
              <circle cx="0" cy="0" r="25" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
              {/* Subdial markers */}
              {[0, 15, 30, 45].map((sec) => {
                const angle = sec * 6 - 90;
                const x1 = Math.cos(angle * Math.PI / 180) * 20;
                const y1 = Math.sin(angle * Math.PI / 180) * 20;
                const x2 = Math.cos(angle * Math.PI / 180) * 15;
                const y2 = Math.sin(angle * Math.PI / 180) * 15;
                return (
                  <line
                    key={`sec-${sec}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#666"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Seconds hand */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-18"
                stroke="#d4af37"
                strokeWidth="0.5"
                transform={`rotate(${secondAngle})`}
                style={{ transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <circle cx="0" cy="0" r="2" fill="#d4af37" />
            </g>

            {/* Power reserve indicator at 3 o'clock */}
            <g transform="translate(70, 0)">
              <circle cx="0" cy="0" r="25" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
              <path
                d={`M -20 10 A 20 20 0 0 1 20 10`}
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
              <path
                d={`M -20 10 A 20 20 0 0 1 ${-20 + 40 * (progress / 100)} 10`}
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
                style={{ transition: 'all 1s ease' }}
              />
              <text
                x="0"
                y="5"
                fill="#666"
                fontSize="8"
                fontFamily="'Didot', serif"
                textAnchor="middle"
              >
                RESERVE
              </text>
            </g>

            {/* Main hands */}
            {/* Hour hand */}
            <g transform={`rotate(${hourAngle})`}>
              <polygon
                points="-3,10 -1,10 -1,-50 1,-50 1,10 3,10 0,15"
                fill="#d4af37"
                stroke="#b8941f"
                strokeWidth="0.5"
              />
            </g>
            
            {/* Minute hand */}
            <g transform={`rotate(${minuteAngle})`}>
              <polygon
                points="-2,10 -0.8,10 -0.8,-80 0.8,-80 0.8,10 2,10 0,15"
                fill="#d4af37"
                stroke="#b8941f"
                strokeWidth="0.5"
              />
            </g>

            {/* Center cap */}
            <circle cx="0" cy="0" r="4" fill="#d4af37" />
            <circle cx="0" cy="0" r="2" fill="#0a0a0a" />

            {/* Brand text */}
            <text
              x="0"
              y="-40"
              fill="#d4af37"
              fontSize="10"
              fontFamily="'Didot', serif"
              fontWeight="300"
              textAnchor="middle"
              letterSpacing="2"
            >
              RÉPŠPHÈRES
            </text>
            
            {/* Collection name */}
            <text
              x="0"
              y="40"
              fill="#666"
              fontSize="8"
              fontFamily="'Didot', serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              QUANTIÈME PERPÉTUEL
            </text>
          </svg>

          {/* Glass effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              background: `
                radial-gradient(
                  ellipse at 30% 30%,
                  rgba(255,255,255,0.1) 0%,
                  transparent 50%
                )
              `,
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Complication displays */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 3, 
          width: '100%',
          mt: 2,
        }}>
          {/* Current value display */}
          <Box
            sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
              border: '1px solid #333',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                opacity: 0.3,
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#666',
                fontSize: '0.65rem',
                letterSpacing: 2,
                fontFamily: "'Didot', serif",
                display: 'block',
                mb: 0.5,
              }}
            >
              POSITION ACTUELLE
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Didot', serif",
                fontWeight: 300,
                color: '#d4af37',
                letterSpacing: 1,
                textShadow: '0 0 20px rgba(212,175,55,0.3)',
              }}
            >
              {formatValue(current)}
            </Typography>
          </Box>

          {/* Goal display */}
          <Box
            sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
              border: '1px solid #333',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                opacity: 0.3,
              },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: '#666',
                fontSize: '0.65rem',
                letterSpacing: 2,
                fontFamily: "'Didot', serif",
                display: 'block',
                mb: 0.5,
              }}
            >
              GRANDE COMPLICATION
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Didot', serif",
                fontWeight: 300,
                color: '#fff',
                letterSpacing: 1,
              }}
            >
              {formatValue(goal)}
            </Typography>
          </Box>
        </Box>

        {/* Swiss made signature */}
        <Typography
          variant="caption"
          sx={{
            color: '#444',
            fontSize: '0.6rem',
            letterSpacing: 2,
            fontFamily: "'Didot', serif",
            mt: 2,
          }}
        >
          GENÈVE · SWISS MADE
        </Typography>
      </Box>
    </Box>
  );
};

export default HauteHorlogerieProgressGauge;
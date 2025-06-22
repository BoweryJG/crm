import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';

// Gear rotation animations
const gearRotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const gearRotationReverse = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

// Steam vent animation
const steamVent = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  50% {
    opacity: 0.6;
  }
  100% { 
    opacity: 0;
    transform: translateY(-40px) scale(1.5);
  }
`;

// Panther prowl animation
const pantherProwl = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
`;

// Pressure gauge needle vibration
const needleVibration = keyframes`
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1deg); }
`;

// Tube bubble animation
const tubeBubble = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

// Control board glow
const boardGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(184,115,51,0.3); }
  50% { box-shadow: 0 0 50px rgba(184,115,51,0.5); }
`;

interface PanthereMeridianControlBoardProps {
  current: number;
  goal: number;
  progress: number;
  formatValue: (value: number) => string;
}

const PanthereMeridianControlBoard: React.FC<PanthereMeridianControlBoardProps> = ({
  current,
  goal,
  progress,
  formatValue
}) => {
  const theme = useTheme();
  const [steamTrigger, setSteamTrigger] = useState(0);
  const [isBoostMode, setIsBoostMode] = useState(false);
  const previousProgressRef = useRef(progress);
  
  // Steam vent effect on milestone
  useEffect(() => {
    const currentMilestone = Math.floor(progress / 10);
    const previousMilestone = Math.floor(previousProgressRef.current / 10);
    if (currentMilestone > previousMilestone) {
      setSteamTrigger(prev => prev + 1);
    }
    previousProgressRef.current = progress;
  }, [progress]);
  
  // Boost mode activation
  useEffect(() => {
    setIsBoostMode(progress >= 85);
  }, [progress]);
  
  // Calculate needle angle (-120 to 120 degrees)
  const needleAngle = -120 + (progress / 100) * 240;
  
  // Calculate gear speeds based on progress
  const gearSpeed = Math.max(20 - (progress / 5), 2);
  
  // Calculate tube fill levels
  const tubeSegments = 10;
  const filledTubes = Math.floor((progress / 100) * tubeSegments);

  return (
    <Box
      sx={{
        position: 'relative',
        p: 4,
        background: `
          linear-gradient(180deg, #1C1C1C 0%, #0a0a0a 50%, #1C1C1C 100%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(113,121,126,0.1) 2px,
            rgba(113,121,126,0.1) 4px
          )
        `,
        borderRadius: 2,
        border: '3px solid #71797E',
        boxShadow: `
          inset 0 0 20px rgba(0,0,0,0.8),
          0 0 40px rgba(0,0,0,0.6),
          ${isBoostMode ? '0 0 80px rgba(255,69,0,0.3)' : '0 0 60px rgba(184,115,51,0.2)'}
        `,
        overflow: 'hidden',
        animation: isBoostMode ? `${boardGlow} 2s ease-in-out infinite` : 'none',
        transition: 'all 0.5s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: isBoostMode 
            ? 'linear-gradient(90deg, #FF4500, #FFD700, #FF4500)'
            : 'linear-gradient(90deg, #B87333, #FFD700, #B87333)',
          animation: isBoostMode ? 'none' : `${pantherProwl} 3s ease-in-out infinite`,
        },
      }}
    >
      {/* Rivets in corners */}
      {[
        { top: 15, left: 15 },
        { top: 15, right: 15 },
        { bottom: 15, left: 15 },
        { bottom: 15, right: 15 },
      ].map((pos, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            ...pos,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #B87333 0%, #71797E 100%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,215,0,0.3)',
          }}
        />
      ))}

      {/* Header Plaque */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          px: 4,
          py: 1,
          background: 'linear-gradient(180deg, #8B0000 0%, #5C0000 100%)',
          border: '2px solid #B87333',
          borderRadius: 1,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Bodoni MT', 'Didot', serif",
            fontSize: '0.7rem',
            color: '#FFD700',
            letterSpacing: 3,
            textAlign: 'center',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          PANTHÈRE MERIDIAN™
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Futura', sans-serif",
            fontSize: '0.5rem',
            color: '#B87333',
            letterSpacing: 2,
            textAlign: 'center',
          }}
        >
          CARTIER RACING ATELIERS · DETROIT/PARIS
        </Typography>
      </Box>

      {/* Main control panel layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr 1fr',
        gap: 3,
        mt: 8,
        height: 320,
      }}>
        {/* Left Zone: Main Pressure Gauge */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Octagonal bezel */}
          <Box
            sx={{
              position: 'absolute',
              width: 240,
              height: 240,
              background: `
                conic-gradient(
                  from 45deg,
                  #B87333 0deg,
                  #FFD700 45deg,
                  #B87333 90deg,
                  #71797E 135deg,
                  #B87333 180deg,
                  #FFD700 225deg,
                  #B87333 270deg,
                  #71797E 315deg,
                  #B87333 360deg
                )
              `,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
              boxShadow: '0 0 30px rgba(184,115,51,0.5)',
            }}
          />
          
          {/* Inner gauge face */}
          <svg width="220" height="220" viewBox="-110 -110 220 220" style={{ position: 'absolute', zIndex: 2 }}>
            {/* Gauge background */}
            <circle cx="0" cy="0" r="100" fill="#1C1C1C" stroke="#71797E" strokeWidth="2" />
            
            {/* Decorative gear visible through sapphire */}
            <g opacity="0.3">
              <g style={{ 
                animation: `${gearRotation} ${gearSpeed}s linear infinite`,
                transformOrigin: 'center',
              }}>
                {[...Array(12)].map((_, i) => (
                  <rect
                    key={i}
                    x="-3"
                    y="-80"
                    width="6"
                    height="20"
                    fill="#B87333"
                    transform={`rotate(${i * 30})`}
                  />
                ))}
                <circle cx="0" cy="0" r="60" fill="none" stroke="#B87333" strokeWidth="1" />
                <circle cx="0" cy="0" r="40" fill="none" stroke="#B87333" strokeWidth="1" />
              </g>
            </g>
            
            {/* Gauge scale */}
            <path
              d="M -86.6 50 A 100 100 0 0 1 86.6 50"
              fill="none"
              stroke="#71797E"
              strokeWidth="15"
              opacity="0.3"
            />
            
            {/* Progress arc */}
            <path
              d={`M -86.6 50 A 100 100 0 ${progress > 50 ? 1 : 0} 1 ${
                Math.cos((-120 + (progress / 100) * 240 - 90) * Math.PI / 180) * 100
              } ${
                Math.sin((-120 + (progress / 100) * 240 - 90) * Math.PI / 180) * 100
              }`}
              fill="none"
              stroke={isBoostMode ? '#FF4500' : '#FFD700'}
              strokeWidth="15"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 10px ${isBoostMode ? '#FF4500' : '#FFD700'})`,
                transition: 'all 0.5s ease',
              }}
            />
            
            {/* Scale markings */}
            {[...Array(13)].map((_, i) => {
              const angle = -120 + i * 20;
              const x1 = Math.cos((angle - 90) * Math.PI / 180) * 85;
              const y1 = Math.sin((angle - 90) * Math.PI / 180) * 85;
              const x2 = Math.cos((angle - 90) * Math.PI / 180) * 75;
              const y2 = Math.sin((angle - 90) * Math.PI / 180) * 75;
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i >= 10 ? '#FF4500' : '#B87333'}
                  strokeWidth="2"
                />
              );
            })}
            
            {/* PSI Labels */}
            <text x="-60" y="60" fill="#B87333" fontSize="10" fontFamily="'Futura', sans-serif">0</text>
            <text x="0" y="-70" fill="#B87333" fontSize="10" fontFamily="'Futura', sans-serif" textAnchor="middle">60</text>
            <text x="60" y="60" fill="#FF4500" fontSize="10" fontFamily="'Futura', sans-serif">120</text>
            
            {/* Needle - Panther-shaped */}
            <g 
              transform={`rotate(${needleAngle})`}
              style={{ 
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: isBoostMode ? `${needleVibration} 0.1s ease-in-out infinite` : 'none',
              }}
            >
              <polygon
                points="0,-5 4,0 2,60 0,65 -2,60 -4,0"
                fill="#FFD700"
                stroke="#B87333"
                strokeWidth="1"
              />
              {/* Panther eye (sapphire) */}
              <circle cx="0" cy="55" r="3" fill="#0F52BA" style={{ filter: 'drop-shadow(0 0 5px #0F52BA)' }} />
            </g>
            
            {/* Center cap with Cartier logo */}
            <circle cx="0" cy="0" r="15" fill="#8B0000" stroke="#B87333" strokeWidth="2" />
            <text x="0" y="5" fill="#FFD700" fontSize="12" fontFamily="'Bodoni MT', serif" textAnchor="middle">C</text>
            
            {/* PRESSURE label */}
            <text x="0" y="40" fill="#71797E" fontSize="8" fontFamily="'Futura', sans-serif" textAnchor="middle" letterSpacing="2">
              PRESSURE PSI
            </text>
          </svg>
          
          {/* Steam vents */}
          {[...Array(3)].map((_, i) => (
            <Box
              key={`steam-${i}`}
              sx={{
                position: 'absolute',
                bottom: -10,
                left: 60 + i * 40,
                width: 20,
                height: 20,
                opacity: steamTrigger > 0 ? 1 : 0,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: steamTrigger > 0 ? `${steamVent} 2s ease-out` : 'none',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Center Zone: Brass Tubes */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 1 }}>
          {[...Array(tubeSegments)].map((_, i) => (
            <Box
              key={`tube-${i}`}
              sx={{
                position: 'relative',
                width: 25,
                height: 200,
                background: `linear-gradient(180deg, #B87333 0%, #71797E 100%)`,
                borderRadius: '12px 12px 4px 4px',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                overflow: 'hidden',
              }}
            >
              {/* Glass tube */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  right: 2,
                  bottom: 2,
                  background: 'rgba(0,0,0,0.8)',
                  borderRadius: '10px 10px 2px 2px',
                  overflow: 'hidden',
                }}
              >
                {/* Liquid fill */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: i < filledTubes ? '100%' : '0%',
                    background: isBoostMode && i >= 8 
                      ? 'linear-gradient(180deg, #FF4500 0%, #FFD700 100%)'
                      : 'linear-gradient(180deg, #FFD700 0%, #B87333 100%)',
                    transition: 'height 1s ease, background 0.5s ease',
                    boxShadow: i < filledTubes ? `inset 0 0 20px ${isBoostMode && i >= 8 ? '#FF4500' : '#FFD700'}` : 'none',
                  }}
                >
                  {/* Bubbles */}
                  {i < filledTubes && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '50%',
                        animation: `${tubeBubble} 3s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              {/* Tube cap */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 30,
                  height: 15,
                  background: 'radial-gradient(ellipse, #B87333 0%, #71797E 100%)',
                  borderRadius: '50%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.8)',
                }}
              />
              
              {/* Tube number */}
              <Typography
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.6rem',
                  color: '#71797E',
                  fontFamily: "'Futura', sans-serif",
                }}
              >
                {(i + 1) * 10}
              </Typography>
            </Box>
          ))}
          
          {/* FUEL LEVELS label */}
          <Typography
            sx={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.7rem',
              color: '#B87333',
              fontFamily: "'Futura', sans-serif",
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Velocity Reserve
          </Typography>
        </Box>

        {/* Right Zone: Complex Mechanisms */}
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Velocity Calculator */}
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              background: '#1C1C1C',
              border: '2px solid #71797E',
              borderRadius: 2,
              p: 2,
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: '#B87333',
                fontFamily: "'Futura', sans-serif",
                letterSpacing: 1,
                mb: 1,
              }}
            >
              VELOCITY CALCULATOR
            </Typography>
            
            {/* Spinning governors */}
            <Box sx={{ position: 'relative', height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="120" height="80" viewBox="-60 -40 120 80">
                {/* Governor mechanism */}
                <g style={{ animation: `${gearRotation} ${gearSpeed / 2}s linear infinite` }}>
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#B87333" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="#FFD700" />
                  {[0, 120, 240].map((angle) => (
                    <g key={angle} transform={`rotate(${angle})`}>
                      <line x1="0" y1="0" x2="0" y2="-25" stroke="#B87333" strokeWidth="2" />
                      <circle cx="0" cy="-25" r="5" fill="#71797E" />
                    </g>
                  ))}
                </g>
                
                {/* Speed indicator */}
                <text x="0" y="35" fill="#FFD700" fontSize="14" fontFamily="'Futura', sans-serif" textAnchor="middle">
                  {(progress * 2.5).toFixed(0)} MPH
                </text>
              </svg>
            </Box>
          </Box>

          {/* GT500 Tachometer */}
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              background: '#1C1C1C',
              border: '2px solid #71797E',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: '#B87333',
                fontFamily: "'Futura', sans-serif",
                letterSpacing: 1,
                mb: 1,
              }}
            >
              ENGINE RPM × 1000
            </Typography>
            
            {/* Mini tachometer */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 50,
                  position: 'relative',
                  background: '#0a0a0a',
                  borderRadius: '50px 50px 0 0',
                  border: '2px solid #71797E',
                  overflow: 'hidden',
                }}
              >
                {/* RPM scale */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    height: 40,
                    background: '#FF4500',
                    transformOrigin: 'bottom',
                    transform: `translateX(-50%) rotate(${-90 + (progress / 100) * 180}deg)`,
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 0 10px #FF4500',
                  }}
                />
                
                {/* RPM numbers */}
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.8rem',
                    color: isBoostMode ? '#FF4500' : '#FFD700',
                    fontFamily: "'Futura', sans-serif",
                    fontWeight: 'bold',
                  }}
                >
                  {(progress / 100 * 8).toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* BOOST lever */}
          {isBoostMode && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                right: 20,
                width: 60,
                height: 100,
                perspective: '200px',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(-20deg)',
                  transition: 'transform 0.5s ease',
                }}
              >
                {/* Lever handle */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20,
                    height: 60,
                    background: 'linear-gradient(180deg, #8B0000 0%, #5C0000 100%)',
                    borderRadius: '10px 10px 5px 5px',
                    boxShadow: '0 0 20px rgba(255,69,0,0.5)',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 30,
                      height: 30,
                      background: 'radial-gradient(circle, #FFD700 0%, #B87333 100%)',
                      borderRadius: '50%',
                      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                    }}
                  />
                </Box>
                
                {/* BOOST label */}
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.6rem',
                    color: '#FF4500',
                    fontFamily: "'Futura', sans-serif",
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    textShadow: '0 0 10px #FF4500',
                  }}
                >
                  BOOST
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Bottom display panel */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          mt: 4,
        }}
      >
        {/* Current value */}
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #1C1C1C 0%, #0a0a0a 100%)',
            border: '2px solid #71797E',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, #B87333, transparent)',
              animation: `${pantherProwl} 3s ease-in-out infinite`,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#71797E',
              fontFamily: "'Futura', sans-serif",
              letterSpacing: 2,
              mb: 0.5,
            }}
          >
            CURRENT VELOCITY
          </Typography>
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: '#FFD700',
              fontFamily: "'Futura', sans-serif",
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255,215,0,0.5)',
            }}
          >
            {formatValue(current)}
          </Typography>
        </Box>

        {/* Target value */}
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #1C1C1C 0%, #0a0a0a 100%)',
            border: '2px solid #71797E',
            borderRadius: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 2,
              background: isBoostMode
                ? 'linear-gradient(90deg, transparent, #FF4500, transparent)'
                : 'linear-gradient(90deg, transparent, #8B0000, transparent)',
              animation: `${pantherProwl} 3s ease-in-out infinite`,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#71797E',
              fontFamily: "'Futura', sans-serif",
              letterSpacing: 2,
              mb: 0.5,
            }}
          >
            MAXIMUM THRUST
          </Typography>
          <Typography
            sx={{
              fontSize: '1.5rem',
              color: isBoostMode ? '#FF4500' : '#B87333',
              fontFamily: "'Futura', sans-serif",
              fontWeight: 'bold',
              textShadow: `0 0 20px ${isBoostMode ? 'rgba(255,69,0,0.5)' : 'rgba(184,115,51,0.5)'}`,
            }}
          >
            {formatValue(goal)}
          </Typography>
        </Box>
      </Box>

      {/* Racing stripes (subtle) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 120,
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              transparent 45%, 
              #fff 45%, 
              #fff 48%, 
              transparent 48%, 
              transparent 52%, 
              #fff 52%, 
              #fff 55%, 
              transparent 55%, 
              transparent 100%
            )
          `,
        }}
      />
    </Box>
  );
};

export default PanthereMeridianControlBoard;
import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';

interface SphereLoadingScreenProps {
  message?: string;
  loadingText?: string;
  showPreview?: boolean;
}

// Dynamic animations
const spherePulse = keyframes`
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: scale(1.1) rotate(90deg);
    filter: hue-rotate(90deg);
  }
  50% { 
    transform: scale(0.95) rotate(180deg);
    filter: hue-rotate(180deg);
  }
  75% { 
    transform: scale(1.05) rotate(270deg);
    filter: hue-rotate(270deg);
  }
`;

const waveFlow = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`;

const dataStream = keyframes`
  0% { 
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    transform: translateY(-100vh) scale(1.5);
    opacity: 0;
  }
`;

const glitch = keyframes`
  0%, 100% { 
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% { 
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  40% { 
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  60% { 
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  80% { 
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  50% { opacity: 0; }
`;

const SphereLoadingScreen: React.FC<SphereLoadingScreenProps> = ({ 
  message = 'Initializing neural pathways...', 
  loadingText = 'SPHERE oS',
  showPreview = true 
}) => {
  const theme = useTheme();
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showElements, setShowElements] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [dataPoints, setDataPoints] = useState<Array<{id: number, x: number, delay: number}>>([]);

  useEffect(() => {
    // Create random data streams
    const points = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setDataPoints(points);

    // Loading phases
    const timers = [
      setTimeout(() => setLoadingPhase(1), 500),
      setTimeout(() => setLoadingPhase(2), 1000),
      setTimeout(() => setLoadingPhase(3), 1500),
      setTimeout(() => setLoadingPhase(4), 2000),
      setTimeout(() => setShowElements(true), 800),
    ];

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(glitchInterval);
    };
  }, []);

  const systemMessages = [
    { text: 'QUANTUM CORE: ONLINE', color: '#00ff00', delay: 0.2 },
    { text: 'NEURAL NET: SYNCHRONIZED', color: '#00ffff', delay: 0.4 },
    { text: 'DATA MATRIX: INITIALIZED', color: '#ff00ff', delay: 0.6 },
    { text: 'AI ENGINE: ACTIVATED', color: '#ffff00', delay: 0.8 },
    { text: 'REALITY MESH: LOADED', color: '#ff00ff', delay: 1.0 },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at center, #0a0e27 0%, #000000 100%)',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Data Streams Background */}
      {dataPoints.map((point) => (
        <Box
          key={point.id}
          sx={{
            position: 'absolute',
            left: `${point.x}%`,
            width: '2px',
            height: '50px',
            background: 'linear-gradient(to bottom, transparent, #00ffff, transparent)',
            animation: `${dataStream} ${3 + point.delay}s linear infinite`,
            animationDelay: `${point.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Animated Grid */}
      <Box
        sx={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(rgba(138, 96, 208, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 96, 208, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
          animation: 'move 10s linear infinite',
          '@keyframes move': {
            '0%': { transform: 'perspective(500px) rotateX(60deg) translateY(-50%)' },
            '100%': { transform: 'perspective(500px) rotateX(60deg) translateY(0%)' },
          },
        }}
      />

      {/* Central Sphere */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          animation: `${glitchActive ? glitch : spherePulse} ${glitchActive ? '0.1s' : '4s'} ${glitchActive ? 'steps(5)' : 'ease-in-out'} infinite`,
        }}
      >
        {/* Outer Ring */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            border: '2px solid',
            borderColor: 'rgba(138, 96, 208, 0.3)',
            borderRadius: '50%',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#8860D0',
              borderRightColor: '#5CE1E6',
              animation: 'spin 3s linear infinite',
              '@keyframes spin': {
                '100%': { transform: 'rotate(360deg)' }
              }
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderBottomColor: '#44CFCB',
              borderLeftColor: '#ff00ff',
              animation: 'spin 4s linear infinite reverse',
            }
          }}
        />

        {/* Core Logo */}
        <Box
          sx={{
            width: '250px',
            height: '250px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle, rgba(138, 96, 208, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: '4rem',
              background: 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 25%, #44CFCB 50%, #ff00ff 75%, #8860D0 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient 3s ease infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              textShadow: '0 0 30px rgba(138, 96, 208, 0.8)',
              letterSpacing: '0.1em',
            }}
          >
            {loadingText}
          </Typography>
        </Box>
      </Box>

      {/* Wave Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 40%, rgba(138, 96, 208, 0.1) 50%, transparent 60%)',
            animation: `${waveFlow} 3s linear infinite`,
          },
        }}
      />

      {/* System Messages */}
      {showElements && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minWidth: '400px',
          }}
        >
          {systemMessages.slice(0, loadingPhase).map((msg, index) => (
            <Box
              key={msg.text}
              sx={{
                display: 'flex',
                alignItems: 'center',
                opacity: 0,
                animation: `fadeIn 0.5s ease-out ${msg.delay}s forwards`,
                '@keyframes fadeIn': {
                  '100%': { opacity: 1 }
                },
              }}
            >
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: msg.color,
                  marginRight: 2,
                  boxShadow: `0 0 10px ${msg.color}`,
                  animation: `pulse 1s ease-in-out infinite`,
                  '@keyframes pulse': {
                    '50%': { transform: 'scale(1.5)', opacity: 0.7 }
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  color: msg.color,
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  textShadow: `0 0 5px ${msg.color}`,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  animation: `${typewriter} 0.5s steps(30) ${msg.delay + 0.2}s forwards`,
                  width: 0,
                  '&::after': {
                    content: '"_"',
                    animation: `${blink} 1s infinite`,
                  },
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Loading Message */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          textAlign: 'center',
          opacity: loadingPhase >= 3 ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#fff',
            fontSize: '1.2rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            animation: `${glitch} 5s ease-in-out infinite`,
            '&::before': {
              content: `"${message}"`,
              position: 'absolute',
              left: 2,
              textShadow: '-2px 0 #ff00ff',
              animation: `${glitch} 2s ease-in-out infinite reverse`,
              opacity: 0.7,
            },
            '&::after': {
              content: `"${message}"`,
              position: 'absolute',
              left: -2,
              textShadow: '2px 0 #00ffff',
              animation: `${glitch} 3s ease-in-out infinite`,
              opacity: 0.7,
            },
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default SphereLoadingScreen;
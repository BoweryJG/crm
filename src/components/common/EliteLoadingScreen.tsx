import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';
import AnimatedOrbHeroBG from '../dashboard/AnimatedOrbHeroBG';

// Hook that safely gets theme context or falls back to defaults
const useSafeThemeContext = () => {
  try {
    const { useThemeContext } = require('../../themes/ThemeContext');
    const { themeMode } = useThemeContext();
    return { themeMode };
  } catch {
    // Fallback when ThemeProvider isn't available
    return { themeMode: 'space' };
  }
};

interface EliteLoadingScreenProps {
  message?: string;
  loadingText?: string;
  showPreview?: boolean;
}

// Advanced CSS animations
const pulseGlow = keyframes`
  0% { 
    box-shadow: 0 0 20px rgba(138, 96, 208, 0.3), 0 0 40px rgba(138, 96, 208, 0.2), 0 0 80px rgba(138, 96, 208, 0.1);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(138, 96, 208, 0.6), 0 0 60px rgba(138, 96, 208, 0.4), 0 0 120px rgba(138, 96, 208, 0.2);
    transform: scale(1.02);
  }
  100% { 
    box-shadow: 0 0 20px rgba(138, 96, 208, 0.3), 0 0 40px rgba(138, 96, 208, 0.2), 0 0 80px rgba(138, 96, 208, 0.1);
    transform: scale(1);
  }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-20px) rotate(0deg); }
  75% { transform: translateY(-10px) rotate(-1deg); }
`;

const slideInFromLeft = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(-100px) scale(0.8); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;

const slideInFromRight = keyframes`
  0% { 
    opacity: 0; 
    transform: translateX(100px) scale(0.8); 
  }
  100% { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;

const slideInFromBottom = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(50px) scale(0.9); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const EliteLoadingScreen: React.FC<EliteLoadingScreenProps> = ({ 
  message = 'Preparing elite analytics...', 
  loadingText = 'Loading Regional Intelligence',
  showPreview = true 
}) => {
  const theme = useTheme();
  const { themeMode } = useSafeThemeContext();
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Simulate loading phases for dramatic effect
    const timers = [
      setTimeout(() => setLoadingPhase(1), 800),
      setTimeout(() => setLoadingPhase(2), 1600),
      setTimeout(() => setLoadingPhase(3), 2400),
      setTimeout(() => setShowElements(true), 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const previewElements = [
    { title: "Market Intelligence", value: "$2.4M", delay: "0.2s" },
    { title: "Territory Coverage", value: "87%", delay: "0.4s" },
    { title: "Active Accounts", value: "124", delay: "0.6s" },
    { title: "Competitor Analysis", value: "Real-time", delay: "0.8s" },
    { title: "Social Insights", value: "Live Feed", delay: "1.0s" },
    { title: "Demographics", value: "AI-Powered", delay: "1.2s" }
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
        background: themeMode === 'space' 
          ? 'linear-gradient(135deg, #0a0e17 0%, #161b2c 50%, #1a1f35 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Animated Background Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.3,
          zIndex: 1,
        }}
      >
        <AnimatedOrbHeroBG visible={true} childIndex={0} />
        <Box sx={{ position: 'absolute', top: '20%', right: '10%', width: '200px', height: '200px' }}>
          <AnimatedOrbHeroBG visible={true} childIndex={1} />
        </Box>
        <Box sx={{ position: 'absolute', bottom: '15%', left: '15%', width: '150px', height: '150px' }}>
          <AnimatedOrbHeroBG visible={true} childIndex={2} />
        </Box>
      </Box>

      {/* Main Loading Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          background: themeMode === 'space'
            ? 'rgba(22, 27, 44, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          borderRadius: 4,
          p: 6,
          border: `1px solid ${
            themeMode === 'space' 
              ? 'rgba(138, 96, 208, 0.3)' 
              : 'rgba(61, 82, 213, 0.3)'
          }`,
          animation: `${pulseGlow} 3s ease-in-out infinite`,
          minWidth: '400px',
          textAlign: 'center',
        }}
      >
        {/* Elite Logo with 3D Effect */}
        <Box
          sx={{
            position: 'relative',
            mb: 4,
            animation: `${floatAnimation} 4s ease-in-out infinite`,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: themeMode === 'space'
                ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 50%, #44CFCB 100%)'
                : 'linear-gradient(45deg, #3D52D5 0%, #44CFCB 50%, #8860D0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(138, 96, 208, 0.4)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                animation: `${shimmer} 2s ease-in-out infinite`,
                zIndex: 1,
              }
            }}
          >
            RepSpheres
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              mt: 1,
            }}
          >
            Elite Medical Device CRM
          </Typography>
        </Box>

        {/* Dynamic Loading Progress */}
        <Box
          sx={{
            width: '300px',
            height: '6px',
            backgroundColor: themeMode === 'space' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
            mb: 3,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              height: '100%',
              background: `linear-gradient(90deg, 
                ${themeMode === 'space' ? '#8860D0' : '#3D52D5'} 0%, 
                ${themeMode === 'space' ? '#5CE1E6' : '#44CFCB'} 50%, 
                ${themeMode === 'space' ? '#44CFCB' : '#8860D0'} 100%)`,
              borderRadius: '3px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              width: `${Math.min((loadingPhase + 1) * 25, 100)}%`,
              boxShadow: `0 0 20px ${themeMode === 'space' ? 'rgba(138, 96, 208, 0.6)' : 'rgba(61, 82, 213, 0.6)'}`,
            }}
          />
        </Box>

        {/* Loading Messages */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: 1,
            opacity: loadingPhase >= 0 ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {loadingText}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            opacity: loadingPhase >= 1 ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {message}
        </Typography>

        {/* Phase Indicators */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 3,
            opacity: loadingPhase >= 2 ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {['Initializing', 'Loading Data', 'Processing', 'Ready'].map((phase, index) => (
            <Box
              key={phase}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: index <= loadingPhase 
                  ? (themeMode === 'space' ? 'rgba(138, 96, 208, 0.3)' : 'rgba(61, 82, 213, 0.3)')
                  : 'rgba(128, 128, 128, 0.2)',
                color: index <= loadingPhase 
                  ? (themeMode === 'space' ? '#8860D0' : '#3D52D5')
                  : theme.palette.text.secondary,
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {phase}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Preview Elements */}
      {showPreview && showElements && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            flexWrap: 'wrap',
            px: 4,
            zIndex: 2,
          }}
        >
          {previewElements.map((element, index) => (
            <Box
              key={element.title}
              sx={{
                backdropFilter: 'blur(10px)',
                background: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.6)'
                  : 'rgba(255, 255, 255, 0.6)',
                borderRadius: 2,
                p: 2,
                border: `1px solid ${
                  themeMode === 'space' 
                    ? 'rgba(138, 96, 208, 0.2)' 
                    : 'rgba(61, 82, 213, 0.2)'
                }`,
                minWidth: '120px',
                textAlign: 'center',
                opacity: 0,
                animation: index % 3 === 0 
                  ? `${slideInFromLeft} 0.8s ease-out ${element.delay} forwards`
                  : index % 3 === 1
                  ? `${slideInFromBottom} 0.8s ease-out ${element.delay} forwards`
                  : `${slideInFromRight} 0.8s ease-out ${element.delay} forwards`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: themeMode === 'space' ? '#8860D0' : '#3D52D5',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {element.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                }}
              >
                {element.title}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Ambient Particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '4px',
            height: '4px',
            background: themeMode === 'space' ? '#8860D0' : '#3D52D5',
            borderRadius: '50%',
            boxShadow: `
              0 0 6px ${themeMode === 'space' ? '#8860D0' : '#3D52D5'},
              100px 200px 0 ${themeMode === 'space' ? '#5CE1E6' : '#44CFCB'},
              200px 100px 0 ${themeMode === 'space' ? '#44CFCB' : '#8860D0'},
              300px 300px 0 ${themeMode === 'space' ? '#8860D0' : '#3D52D5'},
              400px 50px 0 ${themeMode === 'space' ? '#5CE1E6' : '#44CFCB'}
            `,
            animation: `${floatAnimation} 8s ease-in-out infinite`,
          },
        }}
      />
    </Box>
  );
};

export default EliteLoadingScreen;
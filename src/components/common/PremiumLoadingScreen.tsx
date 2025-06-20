// Premium Loading Screen - A Cinematic Experience
// Where waiting becomes meditation and loading becomes art

import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, keyframes, alpha } from '@mui/material';

interface PremiumLoadingScreenProps {
  message?: string;
  loadingText?: string;
  minimumDuration?: number; // Minimum time to show the loading screen
}

// Sophisticated animations
const breathe = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.05);
    opacity: 1;
  }
`;

const orbit = keyframes`
  0% { 
    transform: rotate(0deg) translateX(120px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    transform: rotate(360deg) translateX(120px) rotate(-360deg);
    opacity: 0;
  }
`;

const shimmer = keyframes`
  0% { 
    background-position: -200% center;
  }
  100% { 
    background-position: 200% center;
  }
`;

const fadeIn = keyframes`
  0% { 
    opacity: 0;
    transform: translateY(10px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const reveal = keyframes`
  0% { 
    clip-path: circle(0% at 50% 50%);
  }
  100% { 
    clip-path: circle(150% at 50% 50%);
  }
`;

const PremiumLoadingScreen: React.FC<PremiumLoadingScreenProps> = ({ 
  message = 'Preparing your experience', 
  loadingText = 'REPSPHERES',
  minimumDuration = 3000 
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [orbitalElements, setOrbitalElements] = useState<Array<{id: number, delay: number, size: number}>>([]);

  useEffect(() => {
    // Create orbital elements with staggered timing
    const elements = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.8,
      size: 6 - i * 2
    }));
    setOrbitalElements(elements);

    // Smooth progress animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minimumDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 16); // 60fps smooth animation

    // Show content after initial delay
    const contentTimer = setTimeout(() => setShowContent(true), 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(contentTimer);
    };
  }, [minimumDuration]);

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
        background: theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)'
          : 'radial-gradient(circle at center, #ffffff 0%, #f5f5f5 100%)',
        overflow: 'hidden',
        zIndex: 9999,
        animation: showContent ? `${reveal} 0.8s ease-out forwards` : 'none',
      }}
    >
      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, 
            ${alpha(theme.palette.primary.main, 0.05)} 0%, 
            transparent 50%,
            ${alpha(theme.palette.primary.main, 0.02)} 100%
          )`,
          animation: `${breathe} 6s ease-in-out infinite`,
        }}
      />

      {/* Premium geometric pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(${theme.palette.primary.main} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.palette.primary.main} 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: 'perspective(500px) rotateX(30deg)',
          transformOrigin: 'center center',
        }}
      />

      {/* Central logo container */}
      <Box
        sx={{
          position: 'relative',
          width: '300px',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: showContent ? 1 : 0,
          animation: showContent ? `${fadeIn} 1s ease-out` : 'none',
        }}
      >
        {/* Elegant orbital rings */}
        {orbitalElements.map((element) => (
          <Box
            key={element.id}
            sx={{
              position: 'absolute',
              inset: -element.id * 30,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: '50%',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: `${element.size}px`,
                height: `${element.size}px`,
                backgroundColor: theme.palette.primary.main,
                borderRadius: '50%',
                top: '50%',
                left: 0,
                transformOrigin: 'center',
                animation: `${orbit} ${6 + element.id * 2}s ease-in-out infinite`,
                animationDelay: `${element.delay}s`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.6)}`,
              }
            }}
          />
        ))}

        {/* Central sphere with glass effect */}
        <Box
          sx={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 0.1)} 0%, 
              ${alpha(theme.palette.primary.main, 0.05)} 50%,
              transparent 100%
            )`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: `${breathe} 4s ease-in-out infinite`,
            boxShadow: `
              inset 0 0 50px ${alpha(theme.palette.primary.main, 0.1)},
              0 0 100px ${alpha(theme.palette.primary.main, 0.1)}
            `,
          }}
        >
          {/* Logo text with shimmer effect */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 100,
              letterSpacing: '0.3em',
              background: `linear-gradient(
                90deg,
                ${theme.palette.text.primary} 40%,
                ${theme.palette.primary.main} 50%,
                ${theme.palette.text.primary} 60%
              )`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${shimmer} 3s linear infinite`,
              textTransform: 'uppercase',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {loadingText}
          </Typography>
        </Box>
      </Box>

      {/* Progress indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          width: '300px',
          opacity: showContent ? 1 : 0,
          animation: showContent ? `${fadeIn} 1s ease-out 0.5s both` : 'none',
        }}
      >
        {/* Progress bar background */}
        <Box
          sx={{
            width: '100%',
            height: '2px',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          {/* Progress bar fill */}
          <Box
            sx={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px',
              transition: 'width 0.3s ease-out',
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '20px',
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light || theme.palette.primary.main})`,
                animation: `${shimmer} 1s linear infinite`,
              }
            }}
          />
        </Box>

        {/* Progress text */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              opacity: 0.8,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>

      {/* Loading message */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          textAlign: 'center',
          opacity: showContent ? 1 : 0,
          animation: showContent ? `${fadeIn} 1s ease-out 0.8s both` : 'none',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            letterSpacing: '0.15em',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Premium detail dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          display: 'flex',
          gap: 1,
          opacity: showContent ? 1 : 0,
          animation: showContent ? `${fadeIn} 1s ease-out 1s both` : 'none',
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              opacity: 0.5,
              animation: `${breathe} 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PremiumLoadingScreen;
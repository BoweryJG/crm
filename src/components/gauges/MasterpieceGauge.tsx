import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, styled } from '@mui/material';
import { keyframes } from '@emotion/react';
import { isLowPerformanceDevice } from '../../utils/performance';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.05); }
  50% { box-shadow: 0 0 30px rgba(0,255,255,0.15); }
`;

const pulseGlowNight = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.2); }
  50% { box-shadow: 0 0 60px rgba(0,255,255,0.5); }
`;

const sweep = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const rotateGear = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseStatus = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
`;

const GaugeWrapper = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'relative',
  background: nightMode 
    ? `radial-gradient(ellipse at center, #001a33 0%, #000511 50%, #000 100%),
       repeating-linear-gradient(
         0deg,
         transparent,
         transparent 2px,
         rgba(0, 233, 255, 0.01) 2px,
         rgba(0, 233, 255, 0.01) 4px
       ),
       repeating-linear-gradient(
         90deg,
         transparent,
         transparent 2px,
         rgba(0, 233, 255, 0.01) 2px,
         rgba(0, 233, 255, 0.01) 4px
       )` 
    : `radial-gradient(ellipse at center, #3d2f1f 0%, #2a1f16 30%, #1a1410 60%, #0c0c0c 100%),
       repeating-linear-gradient(
         0deg,
         transparent,
         transparent 2px,
         rgba(139, 69, 19, 0.03) 2px,
         rgba(139, 69, 19, 0.03) 4px
       ),
       repeating-linear-gradient(
         90deg,
         transparent,
         transparent 2px,
         rgba(139, 69, 19, 0.02) 2px,
         rgba(139, 69, 19, 0.02) 4px
       ),
       repeating-radial-gradient(
         circle at 30% 40%,
         transparent 0px,
         transparent 3px,
         rgba(0, 0, 0, 0.02) 3px,
         rgba(0, 0, 0, 0.02) 6px
       )`,
  padding: '25px',
  borderRadius: '24px',
  boxShadow: nightMode
    ? `inset 0 2px 4px rgba(0, 233, 255, 0.1),
       inset 0 -2px 4px rgba(0, 0, 0, 0.8),
       inset 0 0 40px rgba(0, 0, 0, 0.6),
       0 0 60px rgba(0, 233, 255, 0.3),
       0 0 100px rgba(0, 233, 255, 0.2),
       0 10px 30px rgba(0, 0, 0, 0.8)`
    : `inset 0 2px 4px rgba(255, 255, 255, 0.1),
       inset 0 -2px 8px rgba(0, 0, 0, 0.6),
       inset 0 0 40px rgba(0, 0, 0, 0.4),
       0 0 30px rgba(139, 69, 19, 0.2),
       0 0 60px rgba(139, 69, 19, 0.1),
       0 10px 30px rgba(0, 0, 0, 0.7),
       0 20px 60px rgba(0, 0, 0, 0.5)`,
  display: 'inline-block',
  border: nightMode
    ? '1px solid rgba(0, 233, 255, 0.1)'
    : '1px solid rgba(139, 69, 19, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '8px',
    left: '8px',
    right: '8px',
    bottom: '8px',
    borderRadius: '16px',
    border: nightMode
      ? '1px solid rgba(0, 233, 255, 0.05)'
      : '1px solid rgba(139, 69, 19, 0.1)',
    pointerEvents: 'none'
  }
}));

const Gauge = styled(Box)({
  position: 'relative',
  width: '260px',
  height: '260px',
  '@media (max-width: 600px)': {
    width: '90vw',
    height: '90vw',
    maxWidth: '260px',
    maxHeight: '260px',
  },
});

const Bezel = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: nightMode
    ? `linear-gradient(145deg, #222 0%, #111 50%, #222 100%),
       repeating-linear-gradient(0deg, rgba(0,233,255,0.02) 0px, transparent 2px)`
    : `linear-gradient(145deg, #c0c0c0 0%, #555 50%, #aaa 100%),
       repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, transparent 2px),
       repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0px, transparent 1px)`,
  boxShadow: nightMode
    ? `0 5px 15px rgba(0,0,0,0.9),
       inset 0 -2px 5px rgba(0,0,0,0.7),
       inset 0 2px 3px rgba(0,233,255,0.1),
       inset 0 0 8px rgba(0,0,0,0.5),
       0 0 30px rgba(0,233,255,0.2)`
    : `0 5px 15px rgba(0,0,0,0.8),
       inset 0 -2px 5px rgba(0,0,0,0.5),
       inset 0 2px 3px rgba(255,255,255,0.2),
       inset 0 0 8px rgba(0,0,0,0.3)`,
  zIndex: 1,
}));

const Screw = styled(Box)<{ nightMode?: boolean; isCrown?: boolean }>(({ nightMode, isCrown }) => ({
  position: 'absolute',
  width: '8px',
  height: '8px',
  background: nightMode
    ? 'radial-gradient(circle, #444 0%, #222 40%, #111 100%)'
    : 'radial-gradient(circle, #aaa 0%, #777 40%, #555 100%)',
  borderRadius: '50%',
  boxShadow: nightMode
    ? `inset 0 1px 2px rgba(0,233,255,0.1),
       inset 0 -1px 2px rgba(0,0,0,0.8),
       0 1px 2px rgba(0,0,0,0.6),
       0 0 5px rgba(0,233,255,0.1)`
    : `inset 0 1px 2px rgba(255,255,255,0.3),
       inset 0 -1px 2px rgba(0,0,0,0.6),
       0 1px 2px rgba(0,0,0,0.4),
       0 2px 6px rgba(0,0,0,0.3)`,
  zIndex: 3,
  transform: 'translate(-50%, -50%)',
  cursor: isCrown ? 'pointer' : 'default',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '"R"',
    position: 'absolute',
    width: '6px',
    height: '6px',
    top: '1px',
    left: '1px',
    fontSize: '4px',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '6px',
    color: nightMode ? '#00e5ff' : '#333',
    background: nightMode
      ? 'radial-gradient(circle, #001122 0%, #002233 100%)'
      : 'radial-gradient(circle, #222 0%, #444 100%)',
    borderRadius: '50%',
    textShadow: nightMode
      ? '0 0 3px #00e5ff'
      : 'inset 0 1px 1px rgba(0,0,0,0.5)',
  },
  ...(isCrown && {
    '&:hover::after': {
      content: '"♛"',
      fontSize: '5px',
      color: '#664400',
      background: 'radial-gradient(circle at 30% 30%, #ffdd44 0%, #cc9900 50%, #664400 100%)',
    },
    '&:hover': {
      boxShadow: `inset 0 1px 2px rgba(255,255,255,0.5),
                  inset 0 -1px 2px rgba(0,0,0,0.6),
                  0 1px 2px rgba(0,0,0,0.4),
                  0 2px 6px rgba(0,0,0,0.3),
                  0 0 10px rgba(255,221,68,0.3)`,
    },
  }),
}));

const InnerGauge = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 40px)',
  top: '20px',
  left: '20px',
  borderRadius: '50%',
  background: nightMode
    ? `radial-gradient(circle at 50% 50%, #1a1a1a 0%, #111 20%, #0a0a0a 40%, #050505 60%, #000 80%, #000 100%),
       repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 2px, rgba(0,233,255,0.05) 2px, rgba(0,233,255,0.05) 3px)`
    : `radial-gradient(circle at 50% 50%, #e8e8e8 0%, #d5d5d5 20%, #bbb 40%, #999 60%, #777 80%, #555 100%),
       repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)`,
  boxShadow: nightMode
    ? `inset 0 0 30px rgba(0,0,0,0.8), 
       inset 0 5px 15px rgba(0,0,0,0.9),
       inset 0 -2px 5px rgba(0,233,255,0.1),
       0 0 40px rgba(0,233,255,0.15)`
    : `inset 0 0 30px rgba(0,0,0,0.4), 
       inset 0 5px 15px rgba(0,0,0,0.6),
       inset 0 -2px 5px rgba(255,255,255,0.1)`,
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `repeating-conic-gradient(from 0deg at 50% 50%, 
                 transparent 0deg, 
                 transparent 0.5deg, 
                 rgba(0,0,0,0.03) 0.5deg, 
                 rgba(0,0,0,0.03) 1deg)`,
    opacity: 0.6,
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    boxShadow: nightMode ? '0 0 40px rgba(0, 255, 255, 0.3)' : '0 0 20px rgba(0, 255, 255, 0.08)',
    // Removed infinite animation for performance
    pointerEvents: 'none',
  },
}));

const BrandEmboss = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none !important',
  },
  position: 'absolute',
  top: '50px',
  left: '50%',
  transform: 'translateX(-50%) translateZ(0)', // Hardware acceleration
  fontFamily: '"Cinzel", serif',
  textTransform: 'uppercase',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '3px',
  background: nightMode
    ? `linear-gradient(90deg, 
       #006699 0%, 
       #0099cc 20%, 
       #00ccff 35%, 
       #00ffff 50%, 
       #00ccff 65%, 
       #0099cc 80%, 
       #006699 100%)`
    : 'linear-gradient(90deg, #444, #888, #ccc, #fff, #ccc, #888, #444)',
  backgroundSize: '200%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: nightMode
    ? '0 0 10px #00e5ff, 0 1px 1px rgba(0,233,255,0.5), 0 -1px 1px rgba(0,0,0,0.8)'
    : '0 1px 1px rgba(255,255,255,0.15), 0 -1px 1px rgba(0,0,0,0.5)',
  WebkitTextStroke: nightMode ? '0.5px rgba(0,233,255,0.3)' : '0.4px rgba(0,0,0,0.4)',
  opacity: nightMode ? 0.8 : 0.65,
  animation: `${sweep} 12s linear infinite`, // Slowed down for performance
  willChange: 'auto', // Reduced GPU usage
  zIndex: 2,
  pointerEvents: 'none',
}));

const BrandSubline = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  top: '65px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontFamily: '"Cinzel", serif',
  textTransform: 'uppercase',
  fontSize: '6px',
  fontWeight: 400,
  letterSpacing: '1.5px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  background: nightMode
    ? 'linear-gradient(90deg, #00aacc, #0088aa, #00aacc, #0088aa, #00aacc)'
    : 'linear-gradient(90deg, #666, #888, #666)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: nightMode
    ? '0 0 8px #00e5ff, 0 1px 0 rgba(0,233,255,0.4), 0 -1px 0 rgba(0,0,0,0.6)'
    : '0 1px 1px rgba(255,255,255,0.1), 0 -1px 1px rgba(0,0,0,0.4)',
  WebkitTextStroke: nightMode ? '0.3px rgba(0,233,255,0.2)' : '0.2px rgba(0,0,0,0.3)',
  opacity: nightMode ? 0.6 : 0.5,
  zIndex: 2,
  pointerEvents: 'none',
}));

const Tick = styled(Box)<{ major?: boolean; nightMode?: boolean; rotation: number }>(({ major, nightMode, rotation }) => ({
  position: 'absolute',
  background: nightMode ? '#00e5ff' : '#ccc',
  left: '50%',
  top: '10px',
  transformOrigin: '50% 120px',
  transform: `rotate(${rotation}deg)`,
  boxShadow: nightMode ? '0 0 5px #00e5ff' : '0 0 2px rgba(255,255,255,0.5)',
  width: major ? '3px' : '1px',
  height: major ? '15px' : '10px',
  marginLeft: major ? '-1.5px' : '-0.5px',
  opacity: major ? 1 : 0.7,
}));

const NeedleContainer = styled(Box)({
  position: 'absolute',
  width: '120px',
  height: '120px',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%) rotate(-90deg)',
  transformOrigin: 'center center',
  transition: 'transform 2.6s cubic-bezier(0.2, 1.8, 0.3, 1)',
  zIndex: 4,
});

const NeedleBody = styled(Box)<{ moving?: boolean; nightMode?: boolean }>(({ moving, nightMode }) => ({
  position: 'absolute',
  width: 0,
  height: 0,
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-100%)',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderBottom: nightMode ? '120px solid #ff0044' : '120px solid #cc2b2b',
  filter: moving 
    ? (nightMode ? 'drop-shadow(0 0 20px rgba(255, 0, 68, 0.9))' : 'drop-shadow(0 0 10px rgba(255,0,0,0.4))')
    : (nightMode ? 'drop-shadow(0 0 8px rgba(255, 0, 68, 0.6))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'),
  clipPath: 'polygon(35% 100%, 65% 100%, 52% 10%, 50% 0%, 48% 10%)',
}));

const CenterCap = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  width: '20px',
  height: '20px',
  background: nightMode
    ? 'radial-gradient(circle at 45% 45%, #ff0044, #880022, #440011)'
    : 'radial-gradient(circle at 45% 45%, #990000, #440000, #220000)',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 5,
  boxShadow: nightMode
    ? `0 2px 4px rgba(0,0,0,0.9),
       inset 1px 1px 3px rgba(255,100,100,0.3),
       inset -1px -1px 3px rgba(0,0,0,0.7),
       0 0 15px rgba(255,0,68,0.4)`
    : `0 2px 4px rgba(0,0,0,0.8),
       inset 1px 1px 3px rgba(255,255,255,0.2),
       inset -1px -1px 3px rgba(0,0,0,0.5)`,
}));

const CenterJewel = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  width: '18px',
  height: '18px',
  background: nightMode
    ? 'radial-gradient(circle at 40% 40%, #00ffff, #00aacc 50%, #005566)'
    : 'radial-gradient(circle at 40% 40%, #ffdd44, #cc9900 50%, #664400)',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 6,
  boxShadow: nightMode
    ? `0 2px 4px rgba(0,0,0,0.6),
       0 0 20px #00ffffaa, 
       inset 0 -1px 2px #003344,
       inset 1px 1px 2px rgba(255,255,255,0.6)`
    : `0 2px 4px rgba(0,0,0,0.4),
       0 0 8px #ffcc00aa, 
       inset 0 -1px 2px #552200,
       inset 1px 1px 2px rgba(255,255,255,0.5)`,
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '8px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: nightMode
      ? 'radial-gradient(circle at 35% 35%, #00ff88, #00ff44 40%, #00cc22 70%, #006611)'
      : 'radial-gradient(circle at 35% 35%, #00ff44, #00cc22 40%, #008811 70%, #004400)',
    borderRadius: '50%',
    boxShadow: nightMode
      ? `inset 0 -1px 2px rgba(0,0,0,0.6),
         inset 1px 1px 2px rgba(255,255,255,0.5),
         0 0 8px rgba(0,255,136,0.6)`
      : `inset 0 -1px 2px rgba(0,0,0,0.5),
         inset 1px 1px 2px rgba(255,255,255,0.4),
         0 0 4px rgba(0,255,68,0.3)`,
  },
}));

const CrystalGlint = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  pointerEvents: 'none',
  zIndex: 7,
  background: 'radial-gradient(ellipse at 35% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)',
  boxShadow: 'inset 0 0 1px rgba(255,255,255,0.15), inset 0 -2px 3px rgba(0,0,0,0.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.08), transparent 80%)',
  },
});

const StatusRing = styled(Box)<{ status: 'green' | 'orange' | 'red' }>(({ status }) => ({
  position: 'absolute',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 4,
  pointerEvents: 'none',
  opacity: 0.3,
  background: status === 'green'
    ? 'radial-gradient(circle, transparent 45%, rgba(0,255,0,0.3) 50%, transparent 55%)'
    : status === 'orange'
    ? 'radial-gradient(circle, transparent 45%, rgba(255,165,0,0.3) 50%, transparent 55%)'
    : 'radial-gradient(circle, transparent 45%, rgba(255,0,0,0.3) 50%, transparent 55%)',
  // Removed infinite animation for performance
}));

const GoalLabel = styled(Box)<{ devMode?: boolean; nightMode?: boolean }>(({ devMode, nightMode }) => ({
  position: 'absolute',
  bottom: '80px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '10px',
  fontFamily: 'Arial, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: devMode || nightMode ? '#00e5ff' : '#888',
  textShadow: devMode || nightMode ? '0 0 8px #00e5ff' : '0 1px 2px rgba(0,0,0,0.5)',
  zIndex: 3,
  cursor: 'default',
  userSelect: 'none',
}));

const DigitalWindow = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  bottom: '35px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '70px',
  height: '40px',
  background: nightMode
    ? `repeating-linear-gradient(
       45deg,
       #002233,
       #002233 2px,
       #001122 2px,
       #001122 4px
     ),
     #000`
    : `repeating-linear-gradient(
       45deg,
       #444,
       #444 2px,
       #333 2px,
       #333 4px
     ),
     #1a1a1a`,
  borderRadius: '4px',
  boxShadow: nightMode
    ? `inset 0 2px 8px rgba(0,0,0,0.9),
       inset 0 -1px 3px rgba(0,0,0,0.8),
       0 1px 2px rgba(0,233,255,0.2),
       0 0 20px rgba(0,233,255,0.1)`
    : `inset 0 2px 8px rgba(0,0,0,0.8),
       inset 0 -1px 3px rgba(0,0,0,0.6),
       0 1px 2px rgba(255,255,255,0.1)`,
  overflow: 'hidden',
  zIndex: 3,
}));

const AnalogDigits = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '24px',
  fontFamily: '"Bebas Neue", sans-serif',
  letterSpacing: '2px',
  color: nightMode ? '#00ffff' : '#00e5ff',
  textShadow: nightMode
    ? '0 0 15px #00ffffcc, 0 0 8px #00ffff, 0 0 3px #00ffff'
    : '0 0 8px #00ffffcc, 0 0 3px #00ffff',
  zIndex: 3,
}));

const Gear = styled(Box)<{ size: number; duration: number; reverse?: boolean }>(({ size, duration, reverse }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  background: `radial-gradient(circle at center, transparent ${size/6}px, #333 ${size/6 + 1}px, #333 ${size/6 + 3}px, transparent ${size/6 + 4}px),
                conic-gradient(from 0deg, #444 0deg, #333 20deg, #444 40deg, #333 60deg, #444 80deg, #333 100deg, #444 120deg, #333 140deg, #444 160deg, #333 180deg, #444 200deg, #333 220deg, #444 240deg, #333 260deg, #444 280deg, #333 300deg, #444 320deg, #333 340deg, #444 360deg)`,
  borderRadius: '50%',
  opacity: 0.3,
  animation: isLowPerformanceDevice() ? 'none' : `${rotateGear} ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
  transition: 'animation-duration 1s ease',
}));

const Signature = styled(Box)<{ nightMode?: boolean }>(({ nightMode }) => ({
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  fontFamily: '"Allura", cursive',
  fontSize: '24px',
  fontWeight: 400,
  color: 'transparent',
  background: nightMode
    ? `linear-gradient(
       135deg,
       #00e5ff 0%,
       #00ffff 15%,
       #0099cc 30%,
       #006699 45%,
       #0099cc 60%,
       #00ffff 75%,
       #00e5ff 100%
     )`
    : `linear-gradient(
       135deg,
       #e8e8e8 0%,
       #ffffff 15%,
       #d0d0d0 30%,
       #888888 45%,
       #d0d0d0 60%,
       #ffffff 75%,
       #e8e8e8 100%
     )`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  textShadow: '0 1px 1px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.5)',
  transform: 'skewX(-10deg) rotate(-5deg)',
  letterSpacing: '2px',
  opacity: 0.7,
  filter: nightMode
    ? 'drop-shadow(0 0 5px rgba(0,233,255,0.5))'
    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
}));

interface MasterpieceGaugeProps {
  value: number;
  label?: string;
  dataSource?: string;
  size?: 'small' | 'medium' | 'large';
  onCalibrate?: () => void;
  nightMode?: boolean;
  soundEnabled?: boolean;
  showControls?: boolean;
}

export const MasterpieceGauge: React.FC<MasterpieceGaugeProps> = ({
  value = 0,
  label = '% to goal',
  dataSource = 'Live Data',
  size = 'medium',
  onCalibrate,
  nightMode: propNightMode,
  soundEnabled: propSoundEnabled = true,
  showControls = false,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [displayValue, setDisplayValue] = useState(0);
  const [nightMode, setNightMode] = useState(propNightMode ?? false);
  const [soundEnabled, setSoundEnabled] = useState(propSoundEnabled);
  const [repMode, setRepMode] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [needleMoving, setNeedleMoving] = useState(false);
  const [gearSpeed, setGearSpeed] = useState(1);
  const [statusRing, setStatusRing] = useState<'green' | 'orange' | 'red'>('green');
  
  const audioContext = useRef<AudioContext | null>(null);
  const devModeTimer = useRef<NodeJS.Timeout | null>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Initialize audio context only after user interaction
  const initAudio = useCallback(() => {
    if (!audioContext.current && soundEnabled) {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Resume if suspended
        if (audioContext.current.state === 'suspended') {
          audioContext.current.resume();
        }
        setAudioInitialized(true);
      } catch (e) {
        console.error('Failed to init audio:', e);
      }
    }
  }, [soundEnabled]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      audioContext.current?.close();
    };
  }, []);

  const playTickSound = useCallback(() => {
    if (!soundEnabled || !audioContext.current || audioContext.current.state === 'suspended') return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = 4000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.05);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.05);
  }, [soundEnabled]);

  const playMechanicalSound = useCallback((freq = 2000, vol = 0.02, duration = 0.03) => {
    if (!soundEnabled || !audioContext.current || audioContext.current.state === 'suspended') return;
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    const filter = audioContext.current.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    filter.type = 'bandpass';
    filter.frequency.value = Math.min(freq, 20000); // Clamp to valid range
    filter.Q.value = 10;
    
    oscillator.frequency.value = Math.min(freq, 20000); // Clamp to valid range
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(vol, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  }, [soundEnabled]);

  const updateGauge = useCallback((newValue: number) => {
    setNeedleMoving(true);
    setDisplayValue(Math.round(newValue));
    
    // Update gear speed based on value
    const speedMultiplier = 1 + (newValue / 100) * 4;
    setGearSpeed(speedMultiplier);
    
    // Update status ring
    if (newValue < 60) {
      setStatusRing('green');
    } else if (newValue < 80) {
      setStatusRing('orange');
    } else {
      setStatusRing('red');
    }
    
    // Play sounds - FIXED: Clamp frequency to valid range
    const baseFreq = Math.min(1000 + (newValue * 20), 20000); // Max 20kHz
    playMechanicalSound(baseFreq, 0.03, 0.1);
    playTickSound();
    
    // Extra sounds for high values
    if (newValue > 75) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playMechanicalSound(3000 + (i * 200), 0.01, 0.02), i * 100);
      }
    }
    
    setCurrentValue(newValue);
    
    setTimeout(() => {
      setNeedleMoving(false);
    }, 2600);
  }, [playMechanicalSound, playTickSound]);

  useEffect(() => {
    if (repMode) {
      updateGauge(100);
    } else {
      updateGauge(value);
    }
  }, [value, repMode, updateGauge]);
  
  // Performance mode check - AFTER all hooks
  const isLowPerf = isLowPerformanceDevice();
  
  if (isLowPerf) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2
      }}>
        <Box sx={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}%</Box>
        <Box sx={{ fontSize: '0.875rem', opacity: 0.7 }}>{label}</Box>
      </Box>
    );
  }

  const handleCalibrate = () => {
    setDisplayValue(0);
    if (needleRef.current) {
      needleRef.current.style.transition = 'transform 0.8s ease-out';
      needleRef.current.style.transform = 'translate(-50%, -50%) rotate(270deg)';
      
      for (let i = 0; i < 6; i++) {
        setTimeout(() => playMechanicalSound(1500 + (i * 100), 0.02, 0.05), i * 150);
      }
      
      setTimeout(() => {
        needleRef.current!.style.transition = 'transform 1.4s cubic-bezier(0.15, 0, 0.25, 1)';
        updateGauge(0);
        onCalibrate?.();
      }, 800);
    }
  };

  const handleRepModeToggle = () => {
    setRepMode(!repMode);
    if (!repMode) {
      updateGauge(100);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          playMechanicalSound(2000 + (i * 500), 0.05, 0.1);
        }, i * 200);
      }
    }
  };

  const handleDevModeStart = () => {
    devModeTimer.current = setTimeout(() => {
      setDevMode(true);
    }, 2000);
  };

  const handleDevModeEnd = () => {
    if (devModeTimer.current) {
      clearTimeout(devModeTimer.current);
    }
  };

  const gaugeSize = size === 'small' ? 200 : size === 'large' ? 320 : 260;
  const angle = (currentValue / 100) * 180 - 90;

  return (
    <GaugeWrapper nightMode={nightMode} onClick={initAudio}>
      <Signature nightMode={nightMode}>JG</Signature>
      <Gauge sx={{ width: gaugeSize, height: gaugeSize }}>
        <Bezel nightMode={nightMode}>
          {/* Screws */}
          <Screw nightMode={nightMode} sx={{ top: '10px', left: '50%' }} />
          <Screw 
            nightMode={nightMode} 
            isCrown 
            sx={{ top: '25.36%', left: '91.34%' }}
            onClick={handleRepModeToggle}
            title="Rep Mode"
          />
          <Screw nightMode={nightMode} sx={{ top: '74.64%', left: '91.34%' }} />
          <Screw nightMode={nightMode} sx={{ bottom: '10px', left: '50%', transform: 'translate(-50%, 50%)' }} />
          <Screw nightMode={nightMode} sx={{ top: '74.64%', left: '8.66%' }} />
          <Screw nightMode={nightMode} sx={{ top: '25.36%', left: '8.66%' }} />
        </Bezel>
        
        <InnerGauge nightMode={nightMode}>
          <BrandEmboss nightMode={nightMode}>REPSPHERES</BrandEmboss>
          <BrandSubline nightMode={nightMode}>HAND-CALIBRATED</BrandSubline>
          <BrandSubline nightMode={nightMode} sx={{ top: '75px' }}>NYC ENGINEERED</BrandSubline>
          
          {/* Tick marks */}
          <Tick major nightMode={nightMode} rotation={-90} />
          <Tick nightMode={nightMode} rotation={-72} />
          <Tick nightMode={nightMode} rotation={-54} />
          <Tick major nightMode={nightMode} rotation={-45} />
          <Tick nightMode={nightMode} rotation={-36} />
          <Tick nightMode={nightMode} rotation={-18} />
          <Tick major nightMode={nightMode} rotation={0} />
          <Tick nightMode={nightMode} rotation={18} />
          <Tick nightMode={nightMode} rotation={36} />
          <Tick major nightMode={nightMode} rotation={45} />
          <Tick nightMode={nightMode} rotation={54} />
          <Tick nightMode={nightMode} rotation={72} />
          <Tick major nightMode={nightMode} rotation={90} />
          
          <NeedleContainer ref={needleRef} sx={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}>
            <NeedleBody moving={needleMoving} nightMode={nightMode} />
          </NeedleContainer>
          
          <StatusRing status={statusRing} />
          <CenterCap nightMode={nightMode} />
          <CenterJewel nightMode={nightMode} />
          <CrystalGlint />
          
          <GoalLabel 
            devMode={devMode} 
            nightMode={nightMode}
            onMouseDown={handleDevModeStart}
            onMouseUp={handleDevModeEnd}
            onMouseLeave={handleDevModeEnd}
          >
            {label}
          </GoalLabel>
          
          <DigitalWindow nightMode={nightMode}>
            <Gear 
              size={50} 
              duration={60 / gearSpeed} 
              sx={{ left: '-15px', top: '-5px' }}
            />
            <Gear 
              size={35} 
              duration={45 / gearSpeed} 
              reverse
              sx={{ right: '-10px', bottom: '-10px' }}
            />
            <Box sx={{
              position: 'absolute',
              inset: 0,
              border: '1px solid #444',
              borderRadius: '4px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
              pointerEvents: 'none',
              zIndex: 2,
            }} />
            <AnalogDigits nightMode={nightMode}>
              {displayValue.toString().padStart(2, '0')}
            </AnalogDigits>
          </DigitalWindow>
        </InnerGauge>
      </Gauge>
      
      {dataSource && (
        <Box sx={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: nightMode ? '#444' : '#666',
          fontSize: '12px',
          textAlign: 'center',
        }}>
          Data: <Box component="span" sx={{ color: nightMode ? '#00ffff' : '#00e5ff', textShadow: nightMode ? '0 0 5px #00ffff' : 'none' }}>
            {dataSource}
          </Box>
        </Box>
      )}
      
      {showControls && (
        <Box sx={{
          position: 'absolute',
          bottom: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button onClick={handleCalibrate}>Calibrate</button>
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? '🔊' : '🔇'} Sound
          </button>
          <button onClick={() => setNightMode(!nightMode)}>
            {nightMode ? '☀️' : '🌙'} {nightMode ? 'Day' : 'Night'}
          </button>
        </Box>
      )}
    </GaugeWrapper>
  );
};

export default MasterpieceGauge;
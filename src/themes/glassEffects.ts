// Glass Morphism Effects for REPSPHERES "Gallery of Dominance" UI
// Inspired by luxury sculpture materials and gallery glass installations

import { alpha } from '@mui/material/styles';

// Core glass effect configurations
export const glassEffects = {
  // Obsidian glass - deep black with subtle reflections
  obsidian: {
    backgroundColor: alpha('#0D0D0D', 0.85),
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${alpha('#D4AF37', 0.08)}`,
    boxShadow: `
      inset 0 1px 0 0 ${alpha('#ECECEC', 0.05)},
      0 8px 32px 0 ${alpha('#0D0D0D', 0.9)}
    `,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: `linear-gradient(90deg, transparent, ${alpha('#D4AF37', 0.2)}, transparent)`,
      opacity: 0.5,
    },
  },

  // Carbon fiber glass - textured depth
  carbon: {
    backgroundColor: alpha('#1F1F1F', 0.9),
    backdropFilter: 'blur(16px) saturate(150%)',
    border: `1px solid ${alpha('#C0C0C0', 0.1)}`,
    boxShadow: `
      inset 0 1px 0 0 ${alpha('#C0C0C0', 0.08)},
      0 12px 48px 0 ${alpha('#0D0D0D', 0.8)}
    `,
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        ${alpha('#2C2C2C', 0.1)} 10px,
        ${alpha('#2C2C2C', 0.1)} 20px
      )
    `,
  },

  // Museum glass - ultra clear with minimal tint
  museum: {
    backgroundColor: alpha('#1F1F1F', 0.6),
    backdropFilter: 'blur(24px) saturate(200%) brightness(1.1)',
    border: `1px solid ${alpha('#ECECEC', 0.05)}`,
    boxShadow: `
      0 0 0 1px ${alpha('#D4AF37', 0.05)},
      0 20px 80px 0 ${alpha('#0D0D0D', 0.5)}
    `,
  },

  // Gold-infused glass - premium accent
  goldInfused: {
    backgroundColor: alpha('#1F1F1F', 0.85),
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `2px solid ${alpha('#D4AF37', 0.2)}`,
    boxShadow: `
      inset 0 0 20px 0 ${alpha('#D4AF37', 0.05)},
      0 0 40px 0 ${alpha('#D4AF37', 0.1)},
      0 10px 40px 0 ${alpha('#0D0D0D', 0.8)}
    `,
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle, ${alpha('#D4AF37', 0.05)} 0%, transparent 70%)`,
      pointerEvents: 'none',
    },
  },

  // Frosted steel - industrial elegance
  frostedSteel: {
    backgroundColor: alpha('#2C2C2C', 0.8),
    backdropFilter: 'blur(12px) saturate(120%)',
    border: `1px solid ${alpha('#C0C0C0', 0.15)}`,
    boxShadow: `
      inset 0 2px 4px 0 ${alpha('#ECECEC', 0.05)},
      0 4px 24px 0 ${alpha('#0D0D0D', 0.7)}
    `,
    backgroundImage: `
      linear-gradient(180deg, 
        ${alpha('#C0C0C0', 0.02)} 0%, 
        transparent 100%
      )
    `,
  },
};

// Dynamic glass effect creator
export const createGlassEffect = (
  baseColor: string = '#1F1F1F',
  opacity: number = 0.8,
  blur: number = 20,
  borderColor: string = '#D4AF37',
  borderOpacity: number = 0.1
) => ({
  backgroundColor: alpha(baseColor, opacity),
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  border: `1px solid ${alpha(borderColor, borderOpacity)}`,
  boxShadow: `
    inset 0 1px 0 0 ${alpha('#ECECEC', 0.05)},
    0 8px 32px 0 ${alpha('#0D0D0D', 0.8)}
  `,
});

// Hover state transformations
export const glassHoverEffects = {
  subtle: {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backdropFilter: 'blur(24px) saturate(200%)',
      borderColor: alpha('#D4AF37', 0.2),
      transform: 'translateY(-2px)',
      boxShadow: `
        inset 0 1px 0 0 ${alpha('#ECECEC', 0.1)},
        0 12px 48px 0 ${alpha('#D4AF37', 0.15)}
      `,
    },
  },

  dramatic: {
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backdropFilter: 'blur(28px) saturate(250%) brightness(1.05)',
      borderColor: alpha('#D4AF37', 0.4),
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `
        inset 0 0 30px 0 ${alpha('#D4AF37', 0.1)},
        0 20px 80px 0 ${alpha('#D4AF37', 0.2)}
      `,
    },
  },

  glow: {
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '0',
      height: '0',
      borderRadius: '50%',
      background: alpha('#D4AF37', 0.3),
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&:hover::before': {
      width: '300px',
      height: '300px',
    },
    '&:hover': {
      borderColor: alpha('#D4AF37', 0.3),
      boxShadow: `
        0 0 60px 0 ${alpha('#D4AF37', 0.2)},
        0 20px 60px 0 ${alpha('#0D0D0D', 0.8)}
      `,
    },
  },
};

// Performance-optimized glass variants
export const performanceGlass = {
  light: {
    backgroundColor: alpha('#1F1F1F', 0.8),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#D4AF37', 0.1)}`,
  },
  
  medium: {
    backgroundColor: alpha('#1F1F1F', 0.85),
    backdropFilter: 'blur(12px) saturate(150%)',
    border: `1px solid ${alpha('#D4AF37', 0.12)}`,
  },
  
  heavy: {
    backgroundColor: alpha('#1F1F1F', 0.9),
    backdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid ${alpha('#D4AF37', 0.15)}`,
  },
};

// Depth layers for stacking glass elements
export const glassDepthLayers = {
  surface: {
    ...glassEffects.museum,
    zIndex: 1,
  },
  
  elevated: {
    ...glassEffects.carbon,
    zIndex: 10,
    boxShadow: `
      ${glassEffects.carbon.boxShadow},
      0 0 0 1px ${alpha('#D4AF37', 0.05)}
    `,
  },
  
  floating: {
    ...glassEffects.obsidian,
    zIndex: 100,
    boxShadow: `
      ${glassEffects.obsidian.boxShadow},
      0 24px 96px 0 ${alpha('#0D0D0D', 0.9)}
    `,
  },
  
  modal: {
    ...glassEffects.goldInfused,
    zIndex: 1000,
    boxShadow: `
      ${glassEffects.goldInfused.boxShadow},
      0 0 0 100vmax ${alpha('#0D0D0D', 0.8)}
    `,
  },
};

// Animation keyframes for glass effects
export const glassAnimations = {
  shimmer: `
    @keyframes glass-shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
  
  pulse: `
    @keyframes glass-pulse {
      0%, 100% {
        opacity: 0.8;
        backdropFilter: blur(20px) saturate(180%);
      }
      50% {
        opacity: 0.9;
        backdropFilter: blur(24px) saturate(200%);
      }
    }
  `,
  
  breathe: `
    @keyframes glass-breathe {
      0%, 100% {
        transform: scale(1);
        filter: brightness(1);
      }
      50% {
        transform: scale(1.02);
        filter: brightness(1.05);
      }
    }
  `,
};

// Utility function to apply glass to MUI components
export const applyGlass = (effect: keyof typeof glassEffects = 'obsidian') => ({
  ...glassEffects[effect],
  ...glassHoverEffects.subtle,
});

// Export all effects as a single object for easy importing
export default {
  effects: glassEffects,
  hover: glassHoverEffects,
  performance: performanceGlass,
  depth: glassDepthLayers,
  animations: glassAnimations,
  apply: applyGlass,
  create: createGlassEffect,
};
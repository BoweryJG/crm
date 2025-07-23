// Glass Morphism Effects for REPSPHERES "Gallery of Dominance" UI
// Inspired by luxury sculpture materials and gallery glass installations

import { alpha } from '@mui/material/styles';

// Core glass effect configurations
export const glassEffects = {
  // Obsidian glass - deep black with subtle reflections
  obsidian: {
    backgroundColor: alpha('#0D0D0D', 0.65),
    backdropFilter: 'blur(5px) saturate(150%)',
    border: `1px solid ${alpha('#D4AF37', 0.08)}`,
    boxShadow: `
      inset 0 1px 0 0 ${alpha('#ECECEC', 0.05)},
      0 8px 32px 0 ${alpha('#0D0D0D', 0.7)}
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
    backgroundColor: alpha('#1F1F1F', 0.7),
    backdropFilter: 'blur(4px) saturate(130%)',
    border: `1px solid ${alpha('#C0C0C0', 0.1)}`,
    boxShadow: `
      inset 0 1px 0 0 ${alpha('#C0C0C0', 0.08)},
      0 12px 48px 0 ${alpha('#0D0D0D', 0.6)}
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
    backgroundColor: alpha('#1F1F1F', 0.4),
    backdropFilter: 'blur(3px) saturate(120%) brightness(1.05)',
    border: `1px solid ${alpha('#ECECEC', 0.05)}`,
    boxShadow: `
      0 0 0 1px ${alpha('#D4AF37', 0.05)},
      0 20px 80px 0 ${alpha('#0D0D0D', 0.3)}
    `,
  },

  // Gold-infused glass - premium accent
  goldInfused: {
    backgroundColor: alpha('#1F1F1F', 0.6),
    backdropFilter: 'blur(5px) saturate(140%)',
    border: `2px solid ${alpha('#D4AF37', 0.2)}`,
    boxShadow: `
      inset 0 0 20px 0 ${alpha('#D4AF37', 0.05)},
      0 0 40px 0 ${alpha('#D4AF37', 0.1)},
      0 10px 40px 0 ${alpha('#0D0D0D', 0.5)}
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
    backgroundColor: alpha('#2C2C2C', 0.6),
    backdropFilter: 'blur(3px) saturate(110%)',
    border: `1px solid ${alpha('#C0C0C0', 0.15)}`,
    boxShadow: `
      inset 0 2px 4px 0 ${alpha('#ECECEC', 0.05)},
      0 4px 24px 0 ${alpha('#0D0D0D', 0.5)}
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
  opacity: number = 0.5,
  blur: number = 10,
  borderColor: string = '#D4AF37',
  borderOpacity: number = 0.1
) => ({
  backgroundColor: alpha(baseColor, opacity),
  backdropFilter: `blur(${blur}px) saturate(130%)`,
  border: `1px solid ${alpha(borderColor, borderOpacity)}`,
  boxShadow: `
    inset 0 1px 0 0 ${alpha('#ECECEC', 0.05)},
    0 8px 32px 0 ${alpha('#0D0D0D', 0.5)}
  `,
});

// Hover state transformations
export const glassHoverEffects = {
  subtle: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backdropFilter: 'blur(16px) saturate(160%)',
      borderColor: alpha('#D4AF37', 0.15),
      transform: 'translateY(-1px)',
      boxShadow: `
        inset 0 1px 0 0 ${alpha('#ECECEC', 0.08)},
        0 8px 32px 0 ${alpha('#D4AF37', 0.1)}
      `,
    },
  },

  dramatic: {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backdropFilter: 'blur(18px) saturate(180%) brightness(1.03)',
      borderColor: alpha('#D4AF37', 0.25),
      transform: 'translateY(-2px) scale(1.01)',
      boxShadow: `
        inset 0 0 20px 0 ${alpha('#D4AF37', 0.08)},
        0 12px 48px 0 ${alpha('#D4AF37', 0.15)}
      `,
    },
  },

  glow: {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
      background: alpha('#D4AF37', 0.15),
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '&:hover::before': {
      width: '200px',
      height: '200px',
    },
    '&:hover': {
      borderColor: alpha('#D4AF37', 0.2),
      boxShadow: `
        0 0 32px 0 ${alpha('#D4AF37', 0.12)},
        0 12px 40px 0 ${alpha('#0D0D0D', 0.6)}
      `,
    },
  },
};

// Performance-optimized glass variants
export const performanceGlass = {
  light: {
    backgroundColor: alpha('#1F1F1F', 0.4),
    backdropFilter: 'blur(6px)',
    border: `1px solid ${alpha('#D4AF37', 0.08)}`,
    transition: 'all 0.2s ease',
  },
  
  medium: {
    backgroundColor: alpha('#1F1F1F', 0.5),
    backdropFilter: 'blur(8px) saturate(120%)',
    border: `1px solid ${alpha('#D4AF37', 0.1)}`,
    transition: 'all 0.3s ease',
  },
  
  heavy: {
    backgroundColor: alpha('#1F1F1F', 0.6),
    backdropFilter: 'blur(5px) saturate(140%)',
    border: `1px solid ${alpha('#D4AF37', 0.12)}`,
    transition: 'all 0.3s ease',
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
const glassEffectsExports = {
  effects: glassEffects,
  hover: glassHoverEffects,
  performance: performanceGlass,
  depth: glassDepthLayers,
  animations: glassAnimations,
  apply: applyGlass,
  create: createGlassEffect,
};

export default glassEffectsExports;
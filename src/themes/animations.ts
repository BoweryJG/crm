// Animation System for REPSPHERES "Gallery of Dominance" UI
// Sculpture-inspired physics and gallery transitions

// Easing curves - inspired by physical materials
export const easings = {
  // Like pushing against cold metal
  metal: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Like a heavy sculpture settling into place
  monolith: 'cubic-bezier(0.6, 0, 0.1, 1)',
  // Like light reflecting off polished surfaces
  glint: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  // Like walking through a gallery
  gallery: 'cubic-bezier(0.33, 1, 0.68, 1)',
  // Sudden stop - like hitting marble
  marble: 'cubic-bezier(0.77, 0, 0.175, 1)',
};

// Duration scales
export const durations = {
  instant: 150,
  quick: 300,
  normal: 600,
  deliberate: 900,
  cinematic: 1200,
};

// Component entrance animations
export const entranceAnimations = {
  // Cards materialize like sculptures being unveiled
  monolithReveal: {
    initial: {
      opacity: 0,
      transform: 'translateY(40px) scale(0.95)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
    },
    transition: {
      duration: durations.deliberate,
      ease: easings.monolith,
    },
  },

  // Fade in like gallery lights turning on
  galleryIlluminate: {
    initial: {
      opacity: 0,
      filter: 'brightness(0.3)',
    },
    animate: {
      opacity: 1,
      filter: 'brightness(1)',
    },
    transition: {
      duration: durations.cinematic,
      ease: easings.gallery,
    },
  },

  // Slide in from side like gallery doors opening
  sculptureSlide: {
    initial: {
      opacity: 0,
      transform: 'translateX(-100px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateX(0)',
    },
    transition: {
      duration: durations.normal,
      ease: easings.metal,
    },
  },

  // Scale up like focusing on an art piece
  focusZoom: {
    initial: {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    animate: {
      opacity: 1,
      transform: 'scale(1)',
    },
    transition: {
      duration: durations.quick,
      ease: easings.glint,
    },
  },
};

// Hover animations
export const hoverAnimations = {
  // Lift like a sculpture on a pedestal
  levitate: {
    transform: 'translateY(-4px)',
    boxShadow: '0px 20px 100px 0px rgba(212, 175, 55, 0.2)',
    transition: `all ${durations.quick}ms ${easings.metal}`,
  },

  // Glow like museum spotlighting
  spotlight: {
    boxShadow: '0px 0px 60px 0px rgba(212, 175, 55, 0.3)',
    filter: 'brightness(1.05)',
    transition: `all ${durations.normal}ms ${easings.glint}`,
  },

  // Expand like stepping closer to examine
  examine: {
    transform: 'scale(1.02)',
    transition: `transform ${durations.quick}ms ${easings.gallery}`,
  },
};

// Loading states
export const loadingAnimations = {
  // Pulsing gold accent
  goldPulse: `
    @keyframes gold-pulse {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
    }
    animation: gold-pulse ${durations.deliberate}ms ${easings.glint} infinite;
  `,

  // Rotating like a display pedestal
  pedestalRotate: `
    @keyframes pedestal-rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    animation: pedestal-rotate ${durations.cinematic * 2}ms linear infinite;
  `,

  // Shimmer effect for loading bars
  shimmerSlide: `
    @keyframes shimmer-slide {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    background: linear-gradient(
      90deg,
      transparent,
      rgba(212, 175, 55, 0.3),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer-slide ${durations.deliberate}ms ${easings.metal} infinite;
  `,
};

// Page transitions
export const pageTransitions = {
  // Gallery room change
  galleryTransition: {
    exit: {
      opacity: 0,
      filter: 'brightness(0)',
      transition: {
        duration: durations.normal,
        ease: easings.marble,
      },
    },
    enter: {
      opacity: 1,
      filter: 'brightness(1)',
      transition: {
        duration: durations.deliberate,
        ease: easings.gallery,
      },
    },
  },

  // Sculpture reveal sequence
  sculptureSequence: {
    container: {
      transition: {
        staggerChildren: 100,
        delayChildren: 200,
      },
    },
    item: {
      initial: {
        opacity: 0,
        y: 40,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      transition: {
        duration: durations.normal,
        ease: easings.monolith,
      },
    },
  },
};

// Micro-interactions
export const microInteractions = {
  // Button press - like pressing into cold metal
  buttonPress: {
    scale: 0.97,
    transition: {
      duration: durations.instant,
      ease: easings.metal,
    },
  },

  // Toggle switch - mechanical precision
  toggleSwitch: {
    transform: 'translateX(22px)',
    transition: {
      duration: durations.quick,
      ease: easings.marble,
    },
  },

  // Tab indicator slide
  tabSlide: {
    transition: {
      duration: durations.quick,
      ease: easings.glint,
    },
  },
};

// Scroll-triggered animations
export const scrollAnimations = {
  parallax: {
    slow: {
      transform: 'translateY(calc(var(--scroll-y) * 0.2))',
    },
    medium: {
      transform: 'translateY(calc(var(--scroll-y) * 0.5))',
    },
    fast: {
      transform: 'translateY(calc(var(--scroll-y) * 0.8))',
    },
  },

  fadeInUp: {
    initial: {
      opacity: 0,
      transform: 'translateY(60px)',
    },
    whileInView: {
      opacity: 1,
      transform: 'translateY(0)',
    },
    viewport: {
      once: true,
      margin: '-100px',
    },
    transition: {
      duration: durations.deliberate,
      ease: easings.gallery,
    },
  },
};

// Stagger configurations for lists
export const staggerConfigs = {
  // Cards appearing one by one
  galleryReveal: {
    container: {
      transition: {
        staggerChildren: 150,
        delayChildren: 300,
      },
    },
    item: entranceAnimations.monolithReveal,
  },

  // Quick list population
  dataList: {
    container: {
      transition: {
        staggerChildren: 50,
      },
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: {
        duration: durations.quick,
        ease: easings.metal,
      },
    },
  },
};

// Utility functions
export const createTransition = (
  duration: number = durations.normal,
  ease: string = easings.metal
) => ({
  transition: `all ${duration}ms ${ease}`,
});

export const createStagger = (
  staggerDelay: number = 100,
  childDelay: number = 0
) => ({
  transition: {
    staggerChildren: staggerDelay,
    delayChildren: childDelay,
  },
});

// Export all animations as a single object
export default {
  easings,
  durations,
  entrance: entranceAnimations,
  hover: hoverAnimations,
  loading: loadingAnimations,
  page: pageTransitions,
  micro: microInteractions,
  scroll: scrollAnimations,
  stagger: staggerConfigs,
  utils: {
    createTransition,
    createStagger,
  },
};
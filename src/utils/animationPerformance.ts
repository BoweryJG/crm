// Performance-aware animation utilities
import React from 'react';

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if device is mobile (basic check)
export const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    ('ontouchstart' in window) ||
    (window.innerWidth <= 768);
};

// Check if device is low performance
export const isLowPerformanceDevice = (): boolean => {
  // Check for reduced motion preference
  if (prefersReducedMotion()) return true;
  
  // Check for mobile
  if (isMobileDevice()) return true;
  
  // Check for low memory (if available)
  if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
    return true;
  }
  
  // Check for hardware concurrency (CPU cores)
  if ('hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  return false;
};

// Global animation settings
let animationsEnabled = !isLowPerformanceDevice();

export const setAnimationsEnabled = (enabled: boolean) => {
  animationsEnabled = enabled;
  // Store preference
  localStorage.setItem('crm-animations-enabled', enabled.toString());
};

export const getAnimationsEnabled = (): boolean => {
  // Check localStorage first
  const stored = localStorage.getItem('crm-animations-enabled');
  if (stored !== null) {
    return stored === 'true';
  }
  return animationsEnabled;
};

// CSS helper for conditional animations
export const animationCSS = (animation: string): string => {
  return getAnimationsEnabled() ? animation : 'none';
};

// Hook for React components
export const useAnimationPerformance = () => {
  const [enabled, setEnabled] = React.useState(getAnimationsEnabled());
  
  React.useEffect(() => {
    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      const shouldEnable = !isLowPerformanceDevice();
      setEnabled(shouldEnable);
      setAnimationsEnabled(shouldEnable);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return {
    animationsEnabled: enabled,
    setAnimationsEnabled: (value: boolean) => {
      setEnabled(value);
      setAnimationsEnabled(value);
    },
    isLowPerformance: isLowPerformanceDevice(),
    isMobile: isMobileDevice(),
    prefersReducedMotion: prefersReducedMotion()
  };
};

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();

export const measureFPS = (): number => {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime >= lastTime + 1000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;
    
    // Auto-disable animations if FPS drops below 30
    if (fps < 30 && getAnimationsEnabled()) {
      console.warn(`Low FPS detected: ${fps}. Disabling animations.`);
      setAnimationsEnabled(false);
    }
    
    return fps;
  }
  
  return -1; // No measurement ready
};

// Start FPS monitoring if enabled
if (!isLowPerformanceDevice()) {
  const animate = () => {
    measureFPS();
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}
// Performance utilities to fix lag issues

// Detect if we're on a low-performance device
export const isLowPerformanceDevice = () => {
  // Check for mobile or low-end devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  const isSlowConnection = (navigator as any).connection && 
    ((navigator as any).connection.effectiveType === 'slow-2g' || 
     (navigator as any).connection.effectiveType === '2g');
  
  return isMobile || isLowMemory || isSlowConnection;
};

// Disable heavy animations on low-performance devices
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowPerformanceDevice();
};

// Throttle function with performance awareness
export const performanceThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean }
): T => {
  let timeout: NodeJS.Timeout | null = null;
  let lastCall = 0;
  
  // Increase delay on low performance devices
  const actualDelay = isLowPerformanceDevice() ? delay * 2 : delay;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (!timeout && (!lastCall || now - lastCall >= actualDelay)) {
      lastCall = now;
      if (options?.leading !== false) {
        func(...args);
      }
    }
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      timeout = null;
      if (options?.trailing !== false && (!lastCall || now - lastCall >= actualDelay)) {
        func(...args);
      }
    }, actualDelay);
  }) as T;
};

// Performance-aware animation frame
export const performanceRAF = (callback: FrameRequestCallback) => {
  if (shouldReduceMotion()) {
    // Skip animations on low-performance devices
    return -1;
  }
  return requestAnimationFrame(callback);
};

// Clean up all animations and intervals
export const cleanupPerformance = () => {
  // Clear all CSS animations on low performance
  if (isLowPerformanceDevice()) {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }
};
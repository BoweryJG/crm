import { useState, useEffect, useCallback, useRef } from 'react';

interface MobileOptimizationOptions {
  enableTouchOptimizations?: boolean;
  enableReducedMotion?: boolean;
  enableBatteryOptimization?: boolean;
  enableNetworkOptimization?: boolean;
}

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  hasTouch: boolean;
  connectionType: 'slow' | 'fast' | 'unknown';
  batteryLevel: number;
  isCharging: boolean;
  prefersReducedMotion: boolean;
  deviceMemory: number;
  hardwareConcurrency: number;
}

export const useMobileOptimization = (options: MobileOptimizationOptions = {}) => {
  const {
    enableTouchOptimizations = true,
    enableReducedMotion = true,
    enableBatteryOptimization = true,
    enableNetworkOptimization = true
  } = options;

  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isLowEnd: false,
    hasTouch: false,
    connectionType: 'unknown',
    batteryLevel: 100,
    isCharging: true,
    prefersReducedMotion: false,
    deviceMemory: 4,
    hardwareConcurrency: 4
  });

  const [optimizationLevel, setOptimizationLevel] = useState<'low' | 'medium' | 'high'>('low');
  const lastUpdateRef = useRef<number>(0);

  // Detect device capabilities
  useEffect(() => {
    const updateDeviceCapabilities = () => {
      const now = Date.now();
      // Throttle updates to every 30 seconds
      if (now - lastUpdateRef.current < 30000) return;
      lastUpdateRef.current = now;

      const userAgent = navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTablet = /iPad|Android.*(?!Mobile)/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Get device memory if available
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;

      // Determine if device is low-end
      const isLowEnd = deviceMemory <= 2 || hardwareConcurrency <= 2;

      // Get connection information
      const connection = (navigator as any).connection;
      let connectionType: 'slow' | 'fast' | 'unknown' = 'unknown';
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        connectionType = ['slow-2g', '2g', '3g'].includes(effectiveType) ? 'slow' : 'fast';
      }

      // Get battery information
      let batteryLevel = 100;
      let isCharging = true;
      
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          batteryLevel = Math.round(battery.level * 100);
          isCharging = battery.charging;
          
          setDeviceCapabilities(prev => ({
            ...prev,
            batteryLevel,
            isCharging
          }));
        }).catch(() => {
          // Battery API not supported
        });
      }

      setDeviceCapabilities({
        isMobile,
        isTablet,
        isLowEnd,
        hasTouch,
        connectionType,
        batteryLevel,
        isCharging,
        prefersReducedMotion,
        deviceMemory,
        hardwareConcurrency
      });
    };

    updateDeviceCapabilities();

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateDeviceCapabilities);
      
      return () => {
        connection.removeEventListener('change', updateDeviceCapabilities);
      };
    }
  }, []);

  // Determine optimization level based on device capabilities
  useEffect(() => {
    const {
      isLowEnd,
      connectionType,
      batteryLevel,
      isCharging,
      prefersReducedMotion
    } = deviceCapabilities;

    let level: 'low' | 'medium' | 'high' = 'low';

    // High optimization (most aggressive)
    if (
      isLowEnd ||
      connectionType === 'slow' ||
      (batteryLevel < 20 && !isCharging) ||
      prefersReducedMotion
    ) {
      level = 'high';
    }
    // Medium optimization
    else if (
      connectionType === 'unknown' ||
      batteryLevel < 50 ||
      deviceCapabilities.deviceMemory <= 4
    ) {
      level = 'medium';
    }

    setOptimizationLevel(level);
  }, [deviceCapabilities]);

  // Get optimized animation duration
  const getAnimationDuration = useCallback((defaultDuration: number): number => {
    if (!enableReducedMotion) return defaultDuration;

    switch (optimizationLevel) {
      case 'high':
        return deviceCapabilities.prefersReducedMotion ? 0 : defaultDuration * 0.5;
      case 'medium':
        return defaultDuration * 0.75;
      default:
        return defaultDuration;
    }
  }, [optimizationLevel, deviceCapabilities.prefersReducedMotion, enableReducedMotion]);

  // Get optimized image quality
  const getImageQuality = useCallback((): number => {
    if (!enableNetworkOptimization) return 85;

    switch (optimizationLevel) {
      case 'high':
        return deviceCapabilities.connectionType === 'slow' ? 60 : 70;
      case 'medium':
        return 75;
      default:
        return 85;
    }
  }, [optimizationLevel, deviceCapabilities.connectionType, enableNetworkOptimization]);

  // Get optimized chunk size for virtual scrolling
  const getVirtualScrollOverscan = useCallback((): number => {
    switch (optimizationLevel) {
      case 'high':
        return 1; // Minimal overscan for low-end devices
      case 'medium':
        return 2;
      default:
        return 5;
    }
  }, [optimizationLevel]);

  // Should defer non-critical operations
  const shouldDefer = useCallback((): boolean => {
    if (!enableBatteryOptimization) return false;
    
    return optimizationLevel === 'high' && 
           deviceCapabilities.batteryLevel < 30 && 
           !deviceCapabilities.isCharging;
  }, [optimizationLevel, deviceCapabilities, enableBatteryOptimization]);

  // Get touch-friendly button size
  const getTouchFriendlySize = useCallback((baseSize: number): number => {
    if (!enableTouchOptimizations || !deviceCapabilities.hasTouch) return baseSize;

    // Ensure minimum 44px touch target on mobile
    return Math.max(baseSize, 44);
  }, [deviceCapabilities.hasTouch, enableTouchOptimizations]);

  // Get optimized debounce delay
  const getDebounceDelay = useCallback((defaultDelay: number): number => {
    switch (optimizationLevel) {
      case 'high':
        return Math.max(defaultDelay * 2, 500); // Increase debounce for low-end devices
      case 'medium':
        return defaultDelay * 1.5;
      default:
        return defaultDelay;
    }
  }, [optimizationLevel]);

  // Check if feature should be enabled based on device capabilities
  const shouldEnableFeature = useCallback((featureCost: 'low' | 'medium' | 'high'): boolean => {
    const costLevel = { low: 1, medium: 2, high: 3 }[featureCost];
    const optimLevel = { low: 3, medium: 2, high: 1 }[optimizationLevel];
    
    return costLevel <= optimLevel;
  }, [optimizationLevel]);

  // Get CSS styles for mobile optimization
  const getMobileStyles = useCallback(() => {
    const baseStyles: React.CSSProperties = {};

    if (deviceCapabilities.hasTouch) {
      baseStyles.touchAction = 'manipulation'; // Disable double-tap zoom
    }

    if (deviceCapabilities.prefersReducedMotion) {
      baseStyles.transition = 'none';
      baseStyles.animation = 'none';
    }

    return baseStyles;
  }, [deviceCapabilities]);

  return {
    deviceCapabilities,
    optimizationLevel,
    getAnimationDuration,
    getImageQuality,
    getVirtualScrollOverscan,
    shouldDefer,
    getTouchFriendlySize,
    getDebounceDelay,
    shouldEnableFeature,
    getMobileStyles
  };
};

export default useMobileOptimization;
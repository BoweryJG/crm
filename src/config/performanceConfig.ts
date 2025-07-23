/**
 * Performance Configuration for MedFlow Automation Engine
 * Mobile-first optimization settings for sub-100ms interaction times
 */

export const PERFORMANCE_CONFIG = {
  // Mobile Performance Targets
  MOBILE_TARGETS: {
    INTERACTION_TIME: 100, // Target < 100ms for mobile interactions
    RENDER_TIME: 16.67, // 60fps = 16.67ms per frame
    BUNDLE_SIZE_LIMIT: 2048, // 2MB initial bundle limit for mobile
    IMAGE_QUALITY_MOBILE: 75, // Mobile image quality
    LAZY_LOAD_THRESHOLD: 50, // Load 50px before viewport
    VIRTUAL_SCROLL_OVERSCAN: 3, // Mobile virtual scroll overscan
  },

  // Lazy Loading Configuration
  LAZY_LOADING: {
    INTERSECTION_OBSERVER_OPTIONS: {
      rootMargin: '50px 0px',
      threshold: 0.1
    },
    IMAGE_LOADING_DELAY: 50, // ms delay for better perceived performance
    COMPONENT_LOADING_DELAY: 100, // ms delay for component loading
  },

  // Animation Optimization
  ANIMATIONS: {
    REDUCED_MOTION_DURATION: 0.2, // Reduced animation duration
    STANDARD_DURATION: 0.3,
    EASING_FUNCTION: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
    MOBILE_TRANSFORM_DISTANCE: 2, // Reduced transform distance on mobile
    DESKTOP_TRANSFORM_DISTANCE: 4,
  },

  // Bundle Optimization
  BUNDLE_OPTIMIZATION: {
    CHUNK_SIZE_LIMIT: 512, // 512KB per chunk
    VENDOR_CHUNK_LIMIT: 1024, // 1MB vendor chunk limit
    PRELOAD_CHUNKS: ['charts', 'templates'], // Critical chunks to preload
  },

  // Performance Monitoring
  MONITORING: {
    PERFORMANCE_MARK_PREFIX: 'medflow_',
    LOG_SLOW_OPERATIONS: true,
    SLOW_OPERATION_THRESHOLD: 100, // ms
    ENABLE_WEB_VITALS: true,
    SAMPLE_RATE: 0.1, // 10% sampling for production
  },

  // Memory Management
  MEMORY: {
    VIRTUAL_LIST_ITEM_HEIGHT: 200, // Standard item height for virtual lists
    MAX_CACHED_TEMPLATES: 50, // Maximum templates to cache
    MAX_CHART_DATA_POINTS: 100, // Maximum data points per chart
    CLEANUP_INTERVAL: 300000, // 5 minutes
  },

  // Network Optimization
  NETWORK: {
    API_TIMEOUT: 10000, // 10 second API timeout
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second initial retry delay
    PREFETCH_TEMPLATES: 10, // Number of templates to prefetch
  },

  // Device-Specific Settings
  DEVICE_SETTINGS: {
    LOW_END_DEVICE_THRESHOLD: {
      deviceMemory: 2, // GB
      hardwareConcurrency: 2, // CPU cores
    },
    MOBILE_BREAKPOINT: 768, // px
    TABLET_BREAKPOINT: 1024, // px
  },

  // Feature Flags Based on Performance
  FEATURE_FLAGS: {
    ENABLE_COMPLEX_ANIMATIONS: 'high_performance_only',
    ENABLE_REAL_TIME_UPDATES: 'medium_performance_or_better',
    ENABLE_ADVANCED_CHARTS: 'medium_performance_or_better',
    ENABLE_VIDEO_BACKGROUNDS: 'high_performance_only',
  }
} as const;

// Performance utility functions
export const getOptimizedConfig = (deviceCapabilities: any) => {
  const isLowEnd = deviceCapabilities.deviceMemory <= PERFORMANCE_CONFIG.DEVICE_SETTINGS.LOW_END_DEVICE_THRESHOLD.deviceMemory ||
                   deviceCapabilities.hardwareConcurrency <= PERFORMANCE_CONFIG.DEVICE_SETTINGS.LOW_END_DEVICE_THRESHOLD.hardwareConcurrency;
  
  const isMobile = deviceCapabilities.isMobile;
  const connectionSpeed = deviceCapabilities.connectionType;

  return {
    chunkSize: isLowEnd ? PERFORMANCE_CONFIG.BUNDLE_OPTIMIZATION.CHUNK_SIZE_LIMIT / 2 : PERFORMANCE_CONFIG.BUNDLE_OPTIMIZATION.CHUNK_SIZE_LIMIT,
    imageQuality: isMobile ? PERFORMANCE_CONFIG.MOBILE_TARGETS.IMAGE_QUALITY_MOBILE : 85,
    animationDuration: isLowEnd ? PERFORMANCE_CONFIG.ANIMATIONS.REDUCED_MOTION_DURATION : PERFORMANCE_CONFIG.ANIMATIONS.STANDARD_DURATION,
    lazyLoadThreshold: isMobile ? PERFORMANCE_CONFIG.MOBILE_TARGETS.LAZY_LOAD_THRESHOLD : 100,
    virtualScrollOverscan: isLowEnd ? 1 : PERFORMANCE_CONFIG.MOBILE_TARGETS.VIRTUAL_SCROLL_OVERSCAN,
    enableAdvancedFeatures: !isLowEnd && connectionSpeed !== 'slow'
  };
};

export default PERFORMANCE_CONFIG;
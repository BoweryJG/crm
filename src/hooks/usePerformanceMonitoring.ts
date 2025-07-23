import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface PerformanceMonitoringOptions {
  enableLCP?: boolean; // Largest Contentful Paint
  enableFID?: boolean; // First Input Delay
  enableCLS?: boolean; // Cumulative Layout Shift
  enableTTFB?: boolean; // Time to First Byte
  enableCustomMetrics?: boolean;
  onMetric?: (metric: PerformanceMetric) => void;
}

export const usePerformanceMonitoring = (options: PerformanceMonitoringOptions = {}) => {
  const {
    enableLCP = true,
    enableFID = true,
    enableCLS = true,
    enableTTFB = true,
    enableCustomMetrics = true,
    onMetric
  } = options;

  const metricsRef = useRef<PerformanceMetric[]>([]);

  const reportMetric = useCallback((metric: PerformanceMetric) => {
    metricsRef.current.push(metric);
    if (onMetric) {
      onMetric(metric);
    }
    
    // Send to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Performance Metric: ${metric.name} = ${metric.value}ms`);
    }
  }, [onMetric]);

  // Measure component render time
  const measureRender = useCallback((componentName: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      reportMetric({
        name: `render_${componentName}`,
        value: duration,
        timestamp: Date.now()
      });
    };
  }, [reportMetric]);

  // Measure interaction time
  const measureInteraction = useCallback((interactionName: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      reportMetric({
        name: `interaction_${interactionName}`,
        value: duration,
        timestamp: Date.now()
      });
    };
  }, [reportMetric]);

  // Measure API call time
  const measureAPI = useCallback((apiName: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      reportMetric({
        name: `api_${apiName}`,
        value: duration,
        timestamp: Date.now()
      });
    };
  }, [reportMetric]);

  useEffect(() => {
    // Initialize performance observer for web vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      
      // Largest Contentful Paint
      if (enableLCP) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            if (lastEntry) {
              reportMetric({
                name: 'LCP',
                value: lastEntry.renderTime || lastEntry.loadTime,
                timestamp: Date.now()
              });
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported:', e);
        }
      }

      // First Input Delay
      if (enableFID) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              reportMetric({
                name: 'FID',
                value: entry.processingStart - entry.startTime,
                timestamp: Date.now()
              });
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer not supported:', e);
        }
      }

      // Cumulative Layout Shift
      if (enableCLS) {
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            
            reportMetric({
              name: 'CLS',
              value: clsValue,
              timestamp: Date.now()
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer not supported:', e);
        }
      }

      // Navigation timing for TTFB
      if (enableTTFB) {
        try {
          const navigationObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const ttfb = entry.responseStart - entry.requestStart;
              reportMetric({
                name: 'TTFB',
                value: ttfb,
                timestamp: Date.now()
              });
            });
          });
          navigationObserver.observe({ entryTypes: ['navigation'] });
        } catch (e) {
          console.warn('Navigation observer not supported:', e);
        }
      }
    }

    // Memory usage tracking (if available)
    if (enableCustomMetrics && 'memory' in performance) {
      const trackMemory = () => {
        const memoryInfo = (performance as any).memory;
        reportMetric({
          name: 'memory_used',
          value: memoryInfo.usedJSHeapSize / 1024 / 1024, // MB
          timestamp: Date.now()
        });
      };

      trackMemory();
      const memoryInterval = setInterval(trackMemory, 30000); // Every 30 seconds

      return () => {
        clearInterval(memoryInterval);
      };
    }
  }, [enableLCP, enableFID, enableCLS, enableTTFB, enableCustomMetrics, reportMetric]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const metrics = metricsRef.current;
    const summary: { [key: string]: { avg: number; min: number; max: number; count: number } } = {};

    metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { avg: 0, min: Infinity, max: -Infinity, count: 0 };
      }
      
      const s = summary[metric.name];
      s.min = Math.min(s.min, metric.value);
      s.max = Math.max(s.max, metric.value);
      s.count += 1;
    });

    // Calculate averages
    Object.keys(summary).forEach(key => {
      const values = metrics.filter(m => m.name === key).map(m => m.value);
      summary[key].avg = values.reduce((a, b) => a + b, 0) / values.length;
    });

    return summary;
  }, []);

  // Check if performance is good for mobile
  const getMobilePerformanceScore = useCallback(() => {
    const summary = getPerformanceSummary();
    let score = 100;

    // Deduct points based on thresholds
    if (summary.LCP?.avg > 2500) score -= 20; // LCP should be < 2.5s
    if (summary.FID?.avg > 100) score -= 20;  // FID should be < 100ms
    if (summary.CLS?.avg > 0.1) score -= 15;  // CLS should be < 0.1
    if (summary.TTFB?.avg > 600) score -= 15; // TTFB should be < 600ms
    
    // Check render times
    const renderMetrics = Object.keys(summary).filter(key => key.startsWith('render_'));
    renderMetrics.forEach(key => {
      if (summary[key].avg > 16) score -= 5; // 60fps = 16.67ms per frame
    });

    // Check interaction times
    const interactionMetrics = Object.keys(summary).filter(key => key.startsWith('interaction_'));
    interactionMetrics.forEach(key => {
      if (summary[key].avg > 100) score -= 5; // Interactions should be < 100ms
    });

    return Math.max(0, Math.min(100, score));
  }, [getPerformanceSummary]);

  return {
    measureRender,
    measureInteraction,
    measureAPI,
    getPerformanceSummary,
    getMobilePerformanceScore,
    reportMetric
  };
};

export default usePerformanceMonitoring;
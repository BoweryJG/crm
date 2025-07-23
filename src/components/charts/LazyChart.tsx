import React, { memo, lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy load chart components to reduce initial bundle size
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));
const RadarChart = lazy(() => import('recharts').then(module => ({ default: module.RadarChart })));

const ChartLoadingFallback = memo(() => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
      width: '100%'
    }}
  >
    <CircularProgress size={40} />
  </Box>
));

ChartLoadingFallback.displayName = 'ChartLoadingFallback';

interface LazyChartProps {
  type: 'bar' | 'line' | 'pie' | 'radar';
  children: React.ReactNode;
  height?: number;
}

const LazyChart = memo<LazyChartProps>(({ type, children, height = 300 }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <BarChart>{children}</BarChart>
          </Suspense>
        );
      case 'line':
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <LineChart>{children}</LineChart>
          </Suspense>
        );
      case 'pie':
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <PieChart>{children}</PieChart>
          </Suspense>
        );
      case 'radar':
        return (
          <Suspense fallback={<ChartLoadingFallback />}>
            <RadarChart>{children}</RadarChart>
          </Suspense>
        );
      default:
        return <ChartLoadingFallback />;
    }
  };

  return (
    <Box sx={{ height, width: '100%' }}>
      {renderChart()}
    </Box>
  );
});

LazyChart.displayName = 'LazyChart';

export default LazyChart;
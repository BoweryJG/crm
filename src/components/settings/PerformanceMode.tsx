import React, { useEffect, useState } from 'react';
import { Box, Switch, Typography, Alert } from '@mui/material';
import { cleanupPerformance, isLowPerformanceDevice } from '../../utils/performance';

export const PerformanceMode: React.FC = () => {
  const [performanceMode, setPerformanceMode] = useState(() => {
    const saved = localStorage.getItem('performanceMode');
    return saved === 'true' || isLowPerformanceDevice();
  });

  useEffect(() => {
    localStorage.setItem('performanceMode', String(performanceMode));
    
    if (performanceMode) {
      cleanupPerformance();
      // Disable sounds
      localStorage.setItem('soundEnabled', 'false');
      // Reduce animation speed
      document.documentElement.style.setProperty('--animation-speed', '0');
    } else {
      // Reload to restore animations
      window.location.reload();
    }
  }, [performanceMode]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Performance Settings
      </Typography>
      
      {isLowPerformanceDevice() && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Low performance device detected. Performance mode enabled automatically.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Switch
          checked={performanceMode}
          onChange={(e) => setPerformanceMode(e.target.checked)}
        />
        <Box>
          <Typography>Performance Mode</Typography>
          <Typography variant="caption" color="text.secondary">
            Disables animations and sounds for better performance
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
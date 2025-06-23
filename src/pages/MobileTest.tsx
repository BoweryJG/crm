import React from 'react';
import { Box, Typography, useMediaQuery, useTheme, Paper, Divider } from '@mui/material';
import MissionControlHub from '../components/dashboard/MissionControlHub';
import OperationsCenter from '../components/dashboard/OperationsCenter';
import AudioDebugger from '../components/debug/AudioDebugger';

const MobileTest: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const screenWidth = window.innerWidth;
  
  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Mobile Detection Test</Typography>
        <Typography>Screen Width: {screenWidth}px</Typography>
        <Typography>Is Mobile (&lt; 600px): {isMobile ? 'YES ✅' : 'NO ❌'}</Typography>
        <Typography>Theme Breakpoint sm: {theme.breakpoints.values.sm}px</Typography>
      </Paper>
      
      <Typography variant="h5" sx={{ mb: 2 }}>Mobile Components Test</Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Mission Control Hub:</Typography>
        <MissionControlHub />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Operations Center:</Typography>
        <OperationsCenter />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Audio System Debug</Typography>
        <AudioDebugger />
      </Box>
    </Box>
  );
};

export default MobileTest;
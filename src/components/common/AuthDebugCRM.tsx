import React, { useEffect } from 'react';
import { simpleAuth } from '../../utils/simpleAuth';
import { Box, Button, Paper, Typography } from '@mui/material';

export const AuthDebugCRM: React.FC = () => {
  useEffect(() => {
    // Debug on mount
    simpleAuth.debug();
  }, []);

  const handleReset = () => {
    if (window.confirm('Reset all auth data?')) {
      simpleAuth.reset();
      window.location.reload();
    }
  };

  const handleDebug = async () => {
    const result = await simpleAuth.debug();
    console.log('Auth Debug Result:', result);
    alert(`Auth Status: ${result.loggedIn ? 'Logged In' : 'Not Logged In'}\nUser: ${result.user?.email || 'None'}`);
  };

  const handleTestMainSite = () => {
    window.location.href = 'https://repspheres.com';
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      p: 2,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      zIndex: 9999
    }}>
      <Typography variant="h6" gutterBottom>CRM Auth Debug</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button size="small" variant="outlined" onClick={handleDebug}>
          Check Auth
        </Button>
        <Button size="small" variant="outlined" onClick={handleReset} color="error">
          Reset Auth
        </Button>
        <Button size="small" variant="outlined" onClick={handleTestMainSite}>
          Go to Main Site
        </Button>
      </Box>
    </Paper>
  );
};
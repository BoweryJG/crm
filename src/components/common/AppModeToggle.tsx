import React from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAuth } from '../../auth/AuthContext';
import { 
  Switch, 
  FormControlLabel, 
  Typography, 
  Box, 
  Tooltip, 
  Button,
  Badge
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';

export const AppModeToggle: React.FC = () => {
  const { user } = useAuth();
  const { 
    mode, 
    setMode, 
    isLive, 
    canAccessLiveMode, 
    subscriptionStatus 
  } = useAppMode();
  
  // Hide toggle for non-authenticated users (public mode)
  if (!user) {
    return null;
  }
  
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await setMode(event.target.checked ? 'live' : 'demo');
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Typography 
        variant="body2" 
        color={mode === 'demo' ? "primary.main" : "text.secondary"} 
        sx={{ mr: 1, fontWeight: mode === 'demo' ? 'bold' : 'normal' }}
      >
        Demo
      </Typography>
      
      {subscriptionStatus === 'loading' ? (
        <Switch disabled />
      ) : canAccessLiveMode ? (
        <FormControlLabel
          control={
            <Switch
              checked={isLive}
              onChange={handleChange}
              color="primary"
            />
          }
          label=""
        />
      ) : (
        <Tooltip title="Subscribe to access live mode">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={false}
              disabled
              color="primary"
            />
            <Badge color="error" variant="dot" sx={{ ml: 1 }}>
              <LockIcon fontSize="small" color="action" />
            </Badge>
          </Box>
        </Tooltip>
      )}
      
      <Typography 
        variant="body2" 
        color={mode === 'live' ? "primary.main" : canAccessLiveMode ? "text.secondary" : "text.disabled"}
        sx={{ ml: 1, fontWeight: mode === 'live' ? 'bold' : 'normal' }}
      >
        Live
      </Typography>
      
      {!canAccessLiveMode && (
        <Button
          component={Link}
          to="/subscribe"
          size="small"
          variant="outlined"
          color="primary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          Upgrade
        </Button>
      )}
    </Box>
  );
};

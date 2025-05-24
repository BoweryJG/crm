import React from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
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
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

export const FeatureTierToggle: React.FC = () => {
  const { 
    featureTier, 
    setFeatureTier, 
    isPremium, 
    canAccessPremiumFeatures, 
    subscriptionStatus 
  } = useAppMode();
  
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await setFeatureTier(event.target.checked ? 'premium' : 'basic');
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Typography 
        variant="body2" 
        color={featureTier === 'basic' ? "primary.main" : "text.secondary"} 
        sx={{ mr: 1, fontWeight: featureTier === 'basic' ? 'bold' : 'normal' }}
      >
        Basic
      </Typography>
      
      {subscriptionStatus === 'loading' ? (
        <Switch disabled />
      ) : canAccessPremiumFeatures ? (
        <FormControlLabel
          control={
            <Switch
              checked={isPremium}
              onChange={handleChange}
              color="primary"
            />
          }
          label=""
        />
      ) : (
        <Tooltip title="Subscribe to access premium features">
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
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="body2" 
          color={featureTier === 'premium' ? "primary.main" : canAccessPremiumFeatures ? "text.secondary" : "text.disabled"}
          sx={{ ml: 1, fontWeight: featureTier === 'premium' ? 'bold' : 'normal' }}
        >
          Premium
        </Typography>
        {featureTier === 'premium' && canAccessPremiumFeatures && (
          <StarIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
        )}
      </Box>
      
      {!canAccessPremiumFeatures && (
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

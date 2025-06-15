import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';
import { isAdminUser } from '../../config/adminUsers';
import LockIcon from '@mui/icons-material/Lock';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  customMessage?: string;
}

const PREMIUM_FEATURES = [
  'advanced-analytics',
  'ai-insights',
  'bulk-operations',
  'export-data',
  'custom-reports',
  'team-management',
  'api-access',
  'white-label'
];

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  feature, 
  children, 
  customMessage 
}) => {
  const { user } = useAuth();
  const { isPremium, showFeatureUpgradeModal } = useAppMode();
  
  // Admins have access to everything
  if (user && isAdminUser(user.email)) {
    return <>{children}</>;
  }
  
  // Check if feature requires premium
  if (!isPremium && PREMIUM_FEATURES.includes(feature)) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <LockIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Premium Feature
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {customMessage || `The ${feature} feature requires a premium subscription.`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => showFeatureUpgradeModal()}
        >
          Upgrade to Premium
        </Button>
      </Box>
    );
  }
  
  return <>{children}</>;
};

// Hook for checking feature access
export const useFeatureAccess = (feature: string): boolean => {
  const { user } = useAuth();
  const { isPremium } = useAppMode();
  
  // Admins always have access
  if (user && isAdminUser(user.email)) {
    return true;
  }
  
  // Check premium features
  if (PREMIUM_FEATURES.includes(feature)) {
    return isPremium;
  }
  
  // Default to allowing access
  return true;
};
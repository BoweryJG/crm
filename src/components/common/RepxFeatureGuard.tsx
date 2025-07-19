import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Chip,
  Alert,
  AlertTitle
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSubscription } from '../../hooks/useSubscription';
import { Link } from 'react-router-dom';

interface RepxFeatureGuardProps {
  feature: 'calls' | 'emails' | 'canvas_scans';
  requiredTier?: 'repx1' | 'repx2' | 'repx3' | 'repx4' | 'repx5';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  customMessage?: string;
}

export const RepxFeatureGuard: React.FC<RepxFeatureGuardProps> = ({
  feature,
  requiredTier,
  children,
  fallback,
  showUpgradePrompt = true,
  customMessage
}) => {
  const { repxTier, hasRepxAccess, getRepxFeatureLimits } = useAppMode();
  const { usage, validateAccess } = useSubscription();
  const [hasUsageAccess, setHasUsageAccess] = React.useState<boolean | null>(null);

  // Check if user has access to this feature
  const hasFeatureAccess = hasRepxAccess(feature);
  
  // Check usage limits
  React.useEffect(() => {
    const checkUsage = async () => {
      if (hasFeatureAccess) {
        const access = await validateAccess(feature);
        setHasUsageAccess(access);
      }
    };
    
    checkUsage();
  }, [hasFeatureAccess, feature, validateAccess, usage]);

  // If required tier is specified, check if user meets it
  const meetsRequiredTier = React.useMemo(() => {
    if (!requiredTier || !repxTier) return false;
    
    const tierLevels = {
      repx1: 1,
      repx2: 2,
      repx3: 3,
      repx4: 4,
      repx5: 5
    };
    
    return tierLevels[repxTier] >= tierLevels[requiredTier];
  }, [repxTier, requiredTier]);

  // Determine if access is granted
  const hasAccess = hasFeatureAccess && 
    (requiredTier ? meetsRequiredTier : true) && 
    (hasUsageAccess !== null ? hasUsageAccess : true);

  // If access is granted, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  if (!showUpgradePrompt) {
    return null;
  }

  const limits = getRepxFeatureLimits();
  const currentUsage = usage ? usage[feature] : 0;
  
  const getFeatureName = (feature: string) => {
    switch (feature) {
      case 'calls': return 'Calling';
      case 'emails': return 'Email Integration';
      case 'canvas_scans': return 'Canvas Practice Scans';
      default: return feature;
    }
  };

  const getRequiredTierName = () => {
    if (!requiredTier) return null;
    const tierNames = {
      repx1: 'Rep^x1 Professional',
      repx2: 'Rep^x2 Market Intelligence',
      repx3: 'Rep^x3 Territory Command',
      repx4: 'Rep^x4 Executive Operations',
      repx5: 'Rep^x5 Elite Global'
    };
    return tierNames[requiredTier];
  };

  const getMessage = () => {
    if (customMessage) return customMessage;
    
    if (!hasFeatureAccess) {
      const requiredTierName = getRequiredTierName();
      return requiredTierName 
        ? `${getFeatureName(feature)} requires ${requiredTierName} or higher.`
        : `${getFeatureName(feature)} is not available in your current plan.`;
    }
    
    if (hasUsageAccess === false && limits) {
      const limit = limits[feature];
      if (limit === 'unlimited') return 'Unexpected usage limit reached.';
      return `You've reached your ${limit} ${feature} limit for this period. Current usage: ${currentUsage}/${limit}`;
    }
    
    return `${getFeatureName(feature)} is not available.`;
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: 'grey.50',
        border: '1px dashed',
        borderColor: 'grey.300'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <LockIcon color="disabled" sx={{ fontSize: 48 }} />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Feature Locked
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {getMessage()}
      </Typography>

      {repxTier && (
        <Chip 
          label={`Current: ${repxTier.toUpperCase()}`} 
          size="small" 
          variant="outlined"
          sx={{ mb: 2 }}
        />
      )}

      {hasUsageAccess === false && limits && limits[feature] !== 'unlimited' && (
        <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
          <AlertTitle>Usage Limit Reached</AlertTitle>
          <Typography variant="body2">
            Current usage: {currentUsage} / {limits[feature]} {feature}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Limits reset monthly. Upgrade for higher limits.
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          component={Link}
          to="/subscribe"
          variant="contained"
          startIcon={<UpgradeIcon />}
          size="small"
        >
          {repxTier ? 'Upgrade Plan' : 'Get Rep^x'}
        </Button>
        
        <Button
          component={Link}
          to="/subscribe"
          variant="outlined"
          size="small"
        >
          View Plans
        </Button>
      </Box>
    </Paper>
  );
};

export default RepxFeatureGuard;
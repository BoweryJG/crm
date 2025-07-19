import React from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  Typography, 
  LinearProgress,
  Chip,
  Grid,
  Button,
  Alert
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ScannerIcon from '@mui/icons-material/Scanner';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSubscription } from '../../hooks/useSubscription';
import { Link } from 'react-router-dom';

interface UsageCardProps {
  feature: 'calls' | 'emails' | 'canvas_scans';
  icon: React.ReactNode;
  title: string;
  current: number;
  limit: number | 'unlimited';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const UsageCard: React.FC<UsageCardProps> = ({ feature, icon, title, current, limit, color }) => {
  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" color={isAtLimit ? 'error' : color}>
            {current}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isUnlimited ? 'of unlimited' : `of ${limit}`}
          </Typography>
        </Box>

        {!isUnlimited && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(percentage, 100)}
              color={isAtLimit ? 'error' : isNearLimit ? 'warning' : color}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {isAtLimit && (
          <Chip 
            label="Limit Reached" 
            color="error" 
            size="small"
            variant="outlined"
          />
        )}
        
        {isNearLimit && !isAtLimit && (
          <Chip 
            label="Near Limit" 
            color="warning" 
            size="small"
            variant="outlined"
          />
        )}
      </CardContent>
    </Card>
  );
};

export const RepxUsageDisplay: React.FC = () => {
  const { repxTier, hasRepxAccess, getRepxFeatureLimits } = useAppMode();
  const { usage, loading, currentPlan, canUpgrade, nextTier } = useSubscription();

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading usage information...</Typography>
      </Box>
    );
  }

  if (!repxTier) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        <Typography variant="h6" gutterBottom>
          No Rep^x Subscription
        </Typography>
        <Typography variant="body2" paragraph>
          Subscribe to Rep^x to access professional calling, market intelligence, and more.
        </Typography>
        <Button 
          component={Link}
          to="/subscribe"
          variant="contained"
          startIcon={<UpgradeIcon />}
        >
          Get Rep^x
        </Button>
      </Alert>
    );
  }

  const limits = getRepxFeatureLimits();
  if (!limits || !usage) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Unable to load usage information.</Typography>
      </Box>
    );
  }

  const usageData = [
    {
      feature: 'calls' as const,
      icon: <PhoneIcon color="primary" />,
      title: 'Calls',
      current: usage.calls,
      limit: limits.calls,
      color: 'primary' as const,
      hasAccess: hasRepxAccess('calls')
    },
    {
      feature: 'emails' as const,
      icon: <EmailIcon color="secondary" />,
      title: 'Emails',
      current: usage.emails,
      limit: limits.emails,
      color: 'secondary' as const,
      hasAccess: hasRepxAccess('emails')
    },
    {
      feature: 'canvas_scans' as const,
      icon: <ScannerIcon color="success" />,
      title: 'Canvas Scans',
      current: usage.canvas_scans,
      limit: limits.canvas_scans,
      color: 'success' as const,
      hasAccess: hasRepxAccess('canvas_scans')
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Rep^x Usage Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`Current Plan: ${repxTier.toUpperCase()}`} 
              color="primary"
              variant="outlined"
            />
            {currentPlan && (
              <Chip 
                label={currentPlan.name} 
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        {canUpgrade && nextTier && (
          <Button
            component={Link}
            to="/subscribe"
            variant="contained"
            startIcon={<UpgradeIcon />}
            color="primary"
          >
            Upgrade to {nextTier.toUpperCase()}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {usageData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.feature}>
            {item.hasAccess ? (
              <UsageCard {...item} />
            ) : (
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ opacity: 0.5, mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Not available in {repxTier.toUpperCase()}
                  </Typography>
                  <Button
                    component={Link}
                    to="/subscribe"
                    size="small"
                    variant="outlined"
                  >
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Usage resets monthly. Need higher limits? 
          <Button 
            component={Link}
            to="/subscribe"
            size="small"
            sx={{ ml: 1 }}
          >
            View upgrade options
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default RepxUsageDisplay;
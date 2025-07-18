import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Alert,
  Stack,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  LinkedIn as LinkedInIcon,
  AutoAwesome as AIIcon,
  Link as MagicLinkIcon,
  People as ContactsIcon,
  Settings as SettingsIcon,
  Upgrade as UpgradeIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth';
import automationLimitsService, { 
  SubscriptionTier, 
  AutomationLimits, 
  UsageStats 
} from '../../services/automation/automationLimitsService';

const MasterControlPanel: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  
  const [userTier, setUserTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [limits, setLimits] = useState<AutomationLimits | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadControlPanelData();
    }
  }, [user]);

  const loadControlPanelData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const tier = await automationLimitsService.getUserTier(user.id);
      const tierLimits = automationLimitsService.getLimitsForTier(tier);
      const currentUsage = await automationLimitsService.getCurrentUsage(user.id);
      
      setUserTier(tier);
      setLimits(tierLimits);
      setUsage(currentUsage);
    } catch (error) {
      console.error('Error loading control panel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE: return theme.palette.grey[500];
      case SubscriptionTier.BASIC: return theme.palette.info.main;
      case SubscriptionTier.PRO: return theme.palette.warning.main;
      case SubscriptionTier.ENTERPRISE: return theme.palette.error.main;
    }
  };

  const getTierDisplayName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FREE: return 'Free';
      case SubscriptionTier.BASIC: return 'Basic';
      case SubscriptionTier.PRO: return 'Professional';
      case SubscriptionTier.ENTERPRISE: return 'Enterprise';
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return 'success';
    if (percentage < 90) return 'warning';
    return 'error';
  };

  const renderUsageCard = (
    icon: React.ReactNode,
    title: string,
    current: number,
    limit: number,
    color: string
  ) => {
    const percentage = automationLimitsService.getUsagePercentage(current, limit);
    const isUnlimited = limit === 99999;
    
    return (
      <Card 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.05)})`,
          border: `1px solid ${alpha(color, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: alpha(color, 0.4),
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color, fontSize: 24 }}>
                {icon}
              </Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {title}
              </Typography>
            </Box>
            {!isUnlimited && percentage > 80 && (
              <Tooltip title="Consider upgrading">
                <IconButton size="small" color="warning">
                  <UpgradeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="h4" sx={{ color, fontWeight: 700 }}>
              {current.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isUnlimited ? 'Unlimited' : `of ${limit.toLocaleString()} this month`}
            </Typography>
          </Box>

          {!isUnlimited && (
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={getUsageColor(percentage)}
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: alpha(color, 0.1)
              }}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading || !limits || !usage) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading automation controls...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SecurityIcon sx={{ fontSize: 32, color: getTierColor(userTier) }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Master Control Panel
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip 
                label={getTierDisplayName(userTier)}
                sx={{ 
                  backgroundColor: alpha(getTierColor(userTier), 0.1),
                  color: getTierColor(userTier),
                  fontWeight: 600
                }}
              />
              <Typography variant="body2" color="text.secondary">
                • Automation usage limits and controls
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<UpgradeIcon />}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        >
          Upgrade Plan
        </Button>
      </Box>

      {/* Usage Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <EmailIcon />,
            'Emails',
            usage.emails_sent_this_month,
            limits.emails_per_month,
            theme.palette.primary.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <SmsIcon />,
            'SMS Messages', 
            usage.sms_sent_this_month,
            limits.sms_per_month,
            theme.palette.secondary.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <LinkedInIcon />,
            'LinkedIn Messages',
            usage.linkedin_messages_sent_this_month,
            limits.linkedin_messages_per_month,
            '#0077B5'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <AIIcon />,
            'AI Generations',
            usage.ai_generations_this_month,
            limits.ai_generations_per_month,
            theme.palette.warning.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <MagicLinkIcon />,
            'Magic Links',
            usage.magic_links_created_this_month,
            limits.magic_links_per_month,
            theme.palette.info.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderUsageCard(
            <ContactsIcon />,
            'Total Contacts',
            usage.total_contacts,
            limits.contacts_max,
            theme.palette.success.main
          )}
        </Grid>
      </Grid>

      {/* Alerts for limits */}
      <Stack spacing={2}>
        {usage.emails_sent_this_month / limits.emails_per_month > 0.8 && limits.emails_per_month < 99999 && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <strong>Email limit warning:</strong> You've used {Math.round((usage.emails_sent_this_month / limits.emails_per_month) * 100)}% of your monthly email quota.
          </Alert>
        )}
        
        {usage.active_automations === limits.automations_max && limits.automations_max < 999 && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <strong>Automation limit reached:</strong> You have {limits.automations_max} active automations (maximum for your plan).
          </Alert>
        )}

        {userTier === SubscriptionTier.FREE && (
          <Alert 
            severity="info" 
            sx={{ borderRadius: 2 }}
            action={
              <Button color="inherit" size="small">
                Upgrade Now
              </Button>
            }
          >
            <strong>Free Plan:</strong> You're on the free plan with limited automation features. Upgrade for unlimited power!
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default MasterControlPanel;
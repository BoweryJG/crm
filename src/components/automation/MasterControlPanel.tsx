import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  LinkedIn as LinkedInIcon,
  AutoAwesome as AIIcon,
  Link as MagicLinkIcon,
  People as ContactsIcon,
  Upgrade as UpgradeIcon,
  Security as SecurityIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Timeline as AnalyticsIcon,
  AccountTree as WorkflowIcon,
  Speed as PerformanceIcon,
  TrendingUp as TrendingIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth/AuthContext';
import automationLimitsService, { 
  SubscriptionTier, 
  AutomationLimits, 
  UsageStats 
} from '../../services/automation/automationLimitsService';
import { emailAutomationEngine, EmailAutomation, AutomationExecution } from '../../services/email/EmailAutomationEngine';
import { automationEmailBridge } from '../../services/email/AutomationEmailBridge';
import { triggerManager } from '../../services/email/TriggerManager';

const MasterControlPanel: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [userTier, setUserTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [limits, setLimits] = useState<AutomationLimits | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Email Automation System State
  const [activeExecutions, setActiveExecutions] = useState<AutomationExecution[]>([]);
  const [queueStatus, setQueueStatus] = useState<any>({});
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  const loadControlPanelData = useCallback(async () => {
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
      setSystemStatus('error');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadAutomationData = useCallback(async () => {
    try {
      // Load active executions
      const executions = emailAutomationEngine.getActiveExecutions();
      setActiveExecutions(executions);
      
      // Get queue status
      const status = automationEmailBridge.getQueueStatus();
      setQueueStatus(status);
      
      // Update system status based on metrics
      if (status.pending > 100) {
        setSystemStatus('warning');
      } else if (executions.some(e => e.status === 'failed')) {
        setSystemStatus('error');
      } else {
        setSystemStatus('healthy');
      }
    } catch (error) {
      console.error('Error loading automation data:', error);
      setSystemStatus('error');
    }
  }, []);

  const setupAutomationListeners = useCallback(() => {
    // Listen for automation events
    emailAutomationEngine.on('automation_started', (data) => {
      setActiveExecutions(prev => [...prev, data.execution]);
    });

    emailAutomationEngine.on('automation_completed', (execution) => {
      setActiveExecutions(prev => prev.filter(e => e.id !== execution.id));
    });

    emailAutomationEngine.on('automation_error', (data) => {
      setSystemStatus('error');
      setActiveExecutions(prev => prev.filter(e => e.id !== data.execution.id));
    });

    automationEmailBridge.on('email_sent', (data) => {
      // Update metrics when emails are sent
      loadAutomationData();
    });

    triggerManager.on('trigger_activated', (data) => {
      // Refresh data when triggers activate
      loadAutomationData();
    });
  }, [loadAutomationData]);

  useEffect(() => {
    if (user?.id) {
      loadControlPanelData();
      loadAutomationData();
      setupAutomationListeners();
    }
    
    return () => {
      // Cleanup listeners
      emailAutomationEngine.removeAllListeners();
      automationEmailBridge.removeAllListeners();
      triggerManager.removeAllListeners();
    };
  }, [user, loadControlPanelData, loadAutomationData, setupAutomationListeners]);


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

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
    }
  };

  const getSystemStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy': return <SuccessIcon />;
      case 'warning': return <ErrorIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.info.main;
      case 'completed': return theme.palette.success.main;
      case 'paused': return theme.palette.warning.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
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

      {/* Email Automation System Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkflowIcon sx={{ color: theme.palette.primary.main }} />
          Email Automation System
          <Chip
            icon={getSystemStatusIcon()}
            label={systemStatus.toUpperCase()}
            sx={{
              backgroundColor: alpha(getSystemStatusColor(), 0.1),
              color: getSystemStatusColor(),
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </Typography>

        {/* Automation System Metrics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <AnalyticsIcon sx={{ color: theme.palette.info.main }} />
                  <Typography variant="h4" sx={{ color: theme.palette.info.main, fontWeight: 700 }}>
                    {activeExecutions.length}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Active Executions</Typography>
                <Typography variant="caption" color="text.secondary">
                  Running automation workflows
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <ScheduleIcon sx={{ color: theme.palette.warning.main }} />
                  <Typography variant="h4" sx={{ color: theme.palette.warning.main, fontWeight: 700 }}>
                    {queueStatus.pending || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Queued Emails</Typography>
                <Typography variant="caption" color="text.secondary">
                  Pending email sends
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <TrendingIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                    {usage?.emails_sent_this_month || 0}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Emails Sent Today</Typography>
                <Typography variant="caption" color="text.secondary">
                  Automated email deliveries
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <PerformanceIcon sx={{ color: theme.palette.success.main }} />
                  <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                    {queueStatus.processing ? '🟢' : '🔴'}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>System Status</Typography>
                <Typography variant="caption" color="text.secondary">
                  {queueStatus.processing ? 'Processing' : 'Idle'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Executions Table */}
        {activeExecutions.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayIcon sx={{ color: theme.palette.info.main }} />
                Active Automation Executions
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Automation</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Current Step</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Started</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            Automation {execution.automation_id.slice(-8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Contact {execution.contact_id.slice(-8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Step {execution.current_step_id.slice(-8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={execution.status}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getExecutionStatusColor(execution.status), 0.1),
                              color: getExecutionStatusColor(execution.status),
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDuration(Date.now() - new Date(execution.started_at).getTime())} ago
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <PauseIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

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

        {/* Automation System Alerts */}
        {systemStatus === 'error' && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <strong>System Error:</strong> The email automation system is experiencing issues. Check system logs for details.
          </Alert>
        )}

        {systemStatus === 'warning' && queueStatus.pending > 50 && (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <strong>High Queue Volume:</strong> {queueStatus.pending} emails are pending. System may be under heavy load.
          </Alert>
        )}

        {activeExecutions.length > 10 && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <strong>High Activity:</strong> {activeExecutions.length} automations are currently running. Monitor system performance.
          </Alert>
        )}

        {activeExecutions.some(e => e.status === 'failed') && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            <strong>Failed Executions:</strong> Some automation executions have failed. Review the execution logs for troubleshooting.
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default MasterControlPanel;
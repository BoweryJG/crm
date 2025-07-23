import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Stack,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  AutoAwesome as AutomationIcon,
  TrendingUp as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  ContactMail as ContactIcon,
  Campaign as CampaignIcon,
  Psychology as AIThinkingIcon,
  Sync as SyncIcon,
  Notifications as NotificationIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { emailAutomationEngine } from '../../services/email/EmailAutomationEngine';
import TemplateGallery from './TemplateGallery';

interface AutomationDashboardProps {
  onClose?: () => void;
  mode?: 'modal' | 'embedded';
}

interface AutomationMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface ActiveAutomation {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'scheduled' | 'error';
  progress: number;
  contactsProcessed: number;
  totalContacts: number;
  successRate: number;
  nextRun?: string;
  lastRun?: string;
  isRunning: boolean;
}

interface RecentActivity {
  id: string;
  type: 'email_sent' | 'automation_triggered' | 'contact_added' | 'template_activated';
  description: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  details?: string;
}

const AutomationDashboard: React.FC<AutomationDashboardProps> = ({
  onClose,
  mode = 'modal'
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [activeAutomations, setActiveAutomations] = useState<ActiveAutomation[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showNewAutomation, setShowNewAutomation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const themeColor = theme.palette.primary.main;

  // Mock data - in real app this would come from API
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      setActiveAutomations([
        {
          id: 'auto-1',
          name: 'Socratic Discovery Sequence',
          type: 'socratic_discovery',
          status: 'active',
          progress: 75,
          contactsProcessed: 148,
          totalContacts: 200,
          successRate: 89,
          nextRun: '2 hours',
          lastRun: '1 hour ago',
          isRunning: true,
        },
        {
          id: 'auto-2',
          name: 'Challenger Follow-up Campaign',
          type: 'challenger_insight',
          status: 'active',
          progress: 45,
          contactsProcessed: 89,
          totalContacts: 150,
          successRate: 92,
          nextRun: '4 hours',
          lastRun: '3 hours ago',
          isRunning: false,
        },
        {
          id: 'auto-3',
          name: 'New Patient Onboarding',
          type: 'teaching_sequence',
          status: 'scheduled',
          progress: 0,
          contactsProcessed: 0,
          totalContacts: 75,
          successRate: 0,
          nextRun: 'Tomorrow 9:00 AM',
          isRunning: false,
        },
      ]);

      setRecentActivity([
        {
          id: 'act-1',
          type: 'email_sent',
          description: 'Socratic discovery email sent to Dr. Smith',
          timestamp: '5 minutes ago',
          status: 'success',
          details: 'Response received within 2 hours',
        },
        {
          id: 'act-2',
          type: 'automation_triggered',
          description: 'Challenger insight sequence activated',
          timestamp: '15 minutes ago',
          status: 'success',
        },
        {
          id: 'act-3',
          type: 'template_activated',
          description: 'Case Study Challenge template enabled',
          timestamp: '1 hour ago',
          status: 'success',
        },
        {
          id: 'act-4',
          type: 'contact_added',
          description: '3 new contacts added to automation queue',
          timestamp: '2 hours ago',
          status: 'pending',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const metrics: AutomationMetric[] = [
    {
      label: 'Active Automations',
      value: activeAutomations.filter(a => a.status === 'active').length,
      change: 12,
      icon: <AutomationIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Emails Sent Today',
      value: 247,
      change: 18,
      icon: <EmailIcon />,
      color: theme.palette.success.main,
    },
    {
      label: 'Average Success Rate',
      value: '91%',
      change: 5,
      icon: <AnalyticsIcon />,
      color: theme.palette.info.main,
    },
    {
      label: 'Time Saved',
      value: '28h',
      change: 22,
      icon: <SpeedIcon />,
      color: theme.palette.warning.main,
    },
  ];

  const handleAutomationToggle = (automationId: string) => {
    setActiveAutomations(prev =>
      prev.map(automation =>
        automation.id === automationId
          ? {
              ...automation,
              status: automation.status === 'active' ? 'paused' : 'active',
              isRunning: automation.status !== 'active',
            }
          : automation
      )
    );
  };

  const getStatusColor = (status: ActiveAutomation['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'paused':
        return theme.palette.warning.main;
      case 'scheduled':
        return theme.palette.info.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: ActiveAutomation['status'], isRunning: boolean) => {
    if (isRunning) return <SyncIcon sx={{ animation: 'spin 2s linear infinite' }} />;
    
    switch (status) {
      case 'active':
        return <SuccessIcon />;
      case 'paused':
        return <PauseIcon />;
      case 'scheduled':
        return <PendingIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <PendingIcon />;
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'email_sent':
        return <EmailIcon />;
      case 'automation_triggered':
        return <AutomationIcon />;
      case 'contact_added':
        return <ContactIcon />;
      case 'template_activated':
        return <CampaignIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  const NewAutomationDialog = () => (
    <Dialog
      open={showNewAutomation}
      onClose={() => setShowNewAutomation(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create New Automation</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Automation Name"
            placeholder="e.g., New Patient Welcome Series"
            fullWidth
          />
          <TextField
            label="Description"
            placeholder="Describe what this automation will do..."
            multiline
            rows={3}
            fullWidth
          />
          <Button
            variant="outlined"
            startIcon={<CampaignIcon />}
            onClick={() => {
              setShowNewAutomation(false);
              setShowTemplateGallery(true);
            }}
            fullWidth
          >
            Choose from Template Gallery
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowNewAutomation(false)}>Cancel</Button>
        <Button variant="contained">Create Automation</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: mode === 'modal' ? 3 : 2, maxHeight: mode === 'modal' ? '85vh' : 'none', overflowY: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha(themeColor, 0.1) }}>
              <AutomationIcon sx={{ color: themeColor }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Automation Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor and manage your email automation workflows
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<CampaignIcon />}
              onClick={() => setShowTemplateGallery(true)}
            >
              Template Gallery
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowNewAutomation(true)}
              sx={{
                background: `linear-gradient(135deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
              }}
            >
              New Automation
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: alpha(metric.color, 0.05),
                border: `1px solid ${alpha(metric.color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: alpha(metric.color, 0.4),
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Avatar sx={{ bgcolor: alpha(metric.color, 0.1) }}>
                    {React.cloneElement(metric.icon as React.ReactElement, { sx: { color: metric.color } })}
                  </Avatar>
                  <Chip
                    label={`+${metric.change}%`}
                    size="small"
                    color="success"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>
                <Typography variant="h4" sx={{ color: metric.color, fontWeight: 600, mb: 0.5 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Active Automations */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Active Automations
                </Typography>
                <IconButton size="small">
                  <SettingsIcon />
                </IconButton>
              </Box>

              <List sx={{ p: 0 }}>
                {activeAutomations.map((automation) => (
                  <ListItem
                    key={automation.id}
                    sx={{
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                      background: alpha(theme.palette.background.paper, 0.5),
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getStatusColor(automation.status), 0.1),
                          color: getStatusColor(automation.status),
                        }}
                      >
                        {getStatusIcon(automation.status, automation.isRunning)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {automation.name}
                          </Typography>
                          <Chip
                            label={automation.status}
                            size="small"
                            sx={{
                              backgroundColor: alpha(getStatusColor(automation.status), 0.1),
                              color: getStatusColor(automation.status),
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Stack spacing={1}>
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={automation.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: alpha(theme.palette.divider, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getStatusColor(automation.status),
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {automation.contactsProcessed}/{automation.totalContacts} contacts • {automation.successRate}% success
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {automation.nextRun && `Next: ${automation.nextRun}`}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={automation.status === 'active' ? 'Pause' : 'Start'}>
                          <IconButton
                            size="small"
                            onClick={() => handleAutomationToggle(automation.id)}
                          >
                            {automation.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              height: 'fit-content',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TimelineIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Badge badgeContent={recentActivity.length} color="primary" sx={{ ml: 'auto' }} />
              </Box>

              <List sx={{ p: 0 }}>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: alpha(themeColor, 0.1),
                          color: themeColor,
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.description}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <ClockIcon sx={{ fontSize: 12 }} />
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                          <Chip
                            label={activity.status}
                            size="small"
                            color={activity.status === 'success' ? 'success' : activity.status === 'error' ? 'error' : 'default'}
                            sx={{ ml: 'auto', fontSize: '0.7rem', height: 16 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card
            sx={{
              mt: 3,
              background: `linear-gradient(135deg, ${alpha(themeColor, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px solid ${alpha(themeColor, 0.2)}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<AIThinkingIcon />}
                  fullWidth
                  onClick={() => {
                    emailAutomationEngine.triggerAutomation('socratic-quick', 'dashboard', {
                      source: 'quick-action',
                      type: 'socratic_discovery'
                    });
                  }}
                >
                  Send Socratic Email
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CampaignIcon />}
                  fullWidth
                  onClick={() => setShowTemplateGallery(true)}
                >
                  Browse Templates
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AnalyticsIcon />}
                  fullWidth
                >
                  View Analytics
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Template Gallery Dialog */}
      <Dialog
        open={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          },
        }}
      >
        <TemplateGallery
          mode="modal"
          onClose={() => setShowTemplateGallery(false)}
          onTemplateSelect={(template) => {
            console.log('Selected template:', template);
            setShowTemplateGallery(false);
          }}
        />
      </Dialog>

      <NewAutomationDialog />

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default AutomationDashboard;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Button,
  Grid,
  Card,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  AutoMode as AutomationIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Assessment as ReportIcon,
  Campaign as CampaignIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Settings as ConfigIcon,
  Add as AddIcon,
  TrendingUp as AnalyticsIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import glassEffects from '../../themes/glassEffects';
import { getThemeAccents, getThemeGlass } from '../dashboard/ThemeAwareComponents';

type AutomationMode = 'overview' | 'workflows' | 'scheduled' | 'history';

interface WorkflowItem {
  id: string;
  name: string;
  type: 'email' | 'report' | 'outreach' | 'content';
  status: 'active' | 'paused' | 'scheduled';
  lastRun: string;
  nextRun?: string;
  successRate: number;
  description: string;
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: '1',
    name: 'Weekly Performance Reports',
    type: 'report',
    status: 'active',
    lastRun: '2 hours ago',
    nextRun: 'Tomorrow at 9:00 AM',
    successRate: 98,
    description: 'Automated weekly sales performance reports sent to team',
  },
  {
    id: '2',
    name: 'Follow-up Email Sequence',
    type: 'email',
    status: 'active',
    lastRun: '30 minutes ago',
    successRate: 94,
    description: '3-step follow-up sequence for new contacts',
  },
  {
    id: '3',
    name: 'Content Generation Pipeline',
    type: 'content',
    status: 'paused',
    lastRun: 'Yesterday',
    successRate: 87,
    description: 'AI-powered content creation for social media and blog',
  },
  {
    id: '4',
    name: 'Quarterly Outreach Campaign',
    type: 'outreach',
    status: 'scheduled',
    lastRun: '3 months ago',
    nextRun: 'Jan 1, 2025',
    successRate: 91,
    description: 'Automated outreach to inactive contacts',
  },
];

const AutomationHub: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState<AutomationMode>('overview');
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'email': return <EmailIcon />;
      case 'report': return <ReportIcon />;
      case 'outreach': return <CampaignIcon />;
      case 'content': return <AutomationIcon />;
      default: return <AutomationIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'paused': return theme.palette.warning.main;
      case 'scheduled': return theme.palette.info.main;
      default: return theme.palette.text.secondary;
    }
  };

  const stats = {
    activeWorkflows: 2,
    scheduledTasks: 47,
    successRate: 92,
    timeSaved: '14.5 hrs/week',
  };

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Active Workflows', value: stats.activeWorkflows, color: themeAccents.primary },
          { label: 'Scheduled Tasks', value: stats.scheduledTasks, color: themeAccents.secondary },
          { label: 'Success Rate', value: `${stats.successRate}%`, color: themeAccents.glow },
          { label: 'Time Saved', value: stats.timeSaved, color: themeAccents.primary },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              sx={{
                ...themeGlass,
                p: 2,
                textAlign: 'center',
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: alpha(stat.color, 0.4),
                },
              }}
            >
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 600 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Control Panel */}
      <Box
        sx={{
          ...themeGlass,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AutomationIcon sx={{ color: themeAccents.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Automation Control Center
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            sx={{
              borderRadius: 1,
              background: `linear-gradient(135deg, ${themeAccents.primary}, ${themeAccents.glow})`,
            }}
          >
            New Workflow
          </Button>
        </Box>

        {/* View Selector */}
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Stack direction="row" spacing={1}>
            {[
              { value: 'overview', label: 'Overview' },
              { value: 'workflows', label: 'Workflows' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'history', label: 'History' },
            ].map((mode) => (
              <Chip
                key={mode.value}
                label={mode.label}
                onClick={() => setViewMode(mode.value as AutomationMode)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: viewMode === mode.value 
                    ? alpha(themeAccents.primary, 0.2)
                    : 'transparent',
                  borderColor: viewMode === mode.value 
                    ? themeAccents.primary
                    : alpha(theme.palette.divider, 0.2),
                  border: '1px solid',
                  '&:hover': {
                    backgroundColor: alpha(themeAccents.primary, 0.1),
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Workflows List */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {mockWorkflows.map((workflow) => (
              <Fade in key={workflow.id}>
                <Card
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.background.paper, 0.3),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      borderColor: alpha(themeAccents.primary, 0.3),
                    },
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: alpha(getStatusColor(workflow.status), 0.1),
                            color: getStatusColor(workflow.status),
                          }}
                        >
                          {getWorkflowIcon(workflow.type)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {workflow.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {workflow.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Chip
                        label={workflow.status}
                        size="small"
                        icon={workflow.status === 'active' ? <ActiveIcon /> : 
                              workflow.status === 'paused' ? <PauseIcon /> : <ScheduleIcon />}
                        sx={{
                          backgroundColor: alpha(getStatusColor(workflow.status), 0.1),
                          color: getStatusColor(workflow.status),
                          borderColor: getStatusColor(workflow.status),
                          border: '1px solid',
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ color: themeAccents.glow }}>
                        {workflow.successRate}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Success Rate
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={1} justifyContent={isMobile ? 'center' : 'flex-end'}>
                        <IconButton size="small">
                          {workflow.status === 'active' ? <PauseIcon /> : <StartIcon />}
                        </IconButton>
                        <IconButton size="small">
                          <ConfigIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                  {workflow.nextRun && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Next run: {workflow.nextRun}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Fade>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...themeGlass,
              p: 3,
              textAlign: 'center',
              border: `1px solid ${alpha(themeAccents.primary, 0.2)}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: alpha(themeAccents.primary, 0.4),
              },
            }}
          >
            <EmailIcon sx={{ fontSize: 48, color: themeAccents.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Email Automation
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Set up automated email sequences and follow-ups
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...themeGlass,
              p: 3,
              textAlign: 'center',
              border: `1px solid ${alpha(themeAccents.secondary, 0.2)}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: alpha(themeAccents.secondary, 0.4),
              },
            }}
          >
            <ReportIcon sx={{ fontSize: 48, color: themeAccents.secondary, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Report Generation
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Schedule automated reports and analytics
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              ...themeGlass,
              p: 3,
              textAlign: 'center',
              border: `1px solid ${alpha(themeAccents.glow, 0.2)}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: alpha(themeAccents.glow, 0.4),
              },
            }}
          >
            <CampaignIcon sx={{ fontSize: 48, color: themeAccents.glow, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Outreach Campaigns
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Create automated outreach and nurture campaigns
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutomationHub;
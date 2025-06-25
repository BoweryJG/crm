import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Link as MuiLink,
  CircularProgress,
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
  Link as LinkIcon,
  Mic as RecordingIcon,
  Article as PRIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import glassEffects from '../../themes/glassEffects';
import { getThemeAccents, getThemeGlass } from '../dashboard/ThemeAwareComponents';
import automationService, { 
  WorkflowType, 
  WorkflowStatus, 
  AutomationWorkflow,
  AutomationStats,
  MagicLinkAutomation
} from '../../services/automation/comprehensiveAutomationService';

type AutomationMode = 'overview' | 'workflows' | 'scheduled' | 'magiclinks';

const AutomationHub: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState<AutomationMode>('overview');
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [magicLinks, setMagicLinks] = useState<MagicLinkAutomation[]>([]);
  const [loading, setLoading] = useState(true);
  const [magicLinkDialog, setMagicLinkDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [workflowsResult, statsResult, magicLinksResult] = await Promise.all([
        automationService.getWorkflows(),
        automationService.getStats(),
        automationService.getMagicLinks({ used: false, expired: false }),
      ]);

      if (workflowsResult.data) setWorkflows(workflowsResult.data);
      if (statsResult.data) setStats(statsResult.data);
      if (magicLinksResult.data) setMagicLinks(magicLinksResult.data);
    } catch (error) {
      console.error('Error loading automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWorkflowIcon = (type: WorkflowType) => {
    switch (type) {
      case WorkflowType.EMAIL_SEQUENCE: return <EmailIcon />;
      case WorkflowType.REPORT_GENERATION: return <ReportIcon />;
      case WorkflowType.OUTREACH_CAMPAIGN: return <CampaignIcon />;
      case WorkflowType.CONTENT_GENERATION: return <AutomationIcon />;
      case WorkflowType.PLAUD_RECORDING: return <RecordingIcon />;
      case WorkflowType.PR_DISTRIBUTION: return <PRIcon />;
      case WorkflowType.MAGIC_LINK: return <LinkIcon />;
      default: return <AutomationIcon />;
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case WorkflowStatus.ACTIVE: return theme.palette.success.main;
      case WorkflowStatus.PAUSED: return theme.palette.warning.main;
      case WorkflowStatus.SCHEDULED: return theme.palette.info.main;
      case WorkflowStatus.ERROR: return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const handleStatusToggle = async (workflow: AutomationWorkflow) => {
    const newStatus = workflow.status === WorkflowStatus.ACTIVE 
      ? WorkflowStatus.PAUSED 
      : WorkflowStatus.ACTIVE;

    const result = await automationService.updateWorkflowStatus(workflow.id, newStatus);
    if (result.data) {
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? result.data! : w));
    }
  };

  const handleGenerateMagicLink = async () => {
    const result = await automationService.generateMagicLink({
      workflowType: WorkflowType.EMAIL_SEQUENCE,
      expiresInHours: 48,
    });

    if (result.data) {
      const baseUrl = window.location.origin;
      setGeneratedLink(`${baseUrl}/magic/${result.data.token}`);
      setMagicLinkDialog(true);
      loadData(); // Reload to show new magic link
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading automation data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats && [
          { label: 'Active Workflows', value: stats.activeWorkflows, color: themeAccents.primary },
          { label: 'Scheduled Tasks', value: stats.scheduledTasks, color: themeAccents.secondary },
          { label: 'Success Rate', value: `${stats.successRate}%`, color: themeAccents.glow },
          { label: 'Time Saved', value: stats.timeSaved, color: themeAccents.primary },
          { label: 'Magic Links', value: stats.magicLinksGenerated, color: themeAccents.secondary },
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
          borderRadius: '16px',
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              size="small"
              onClick={handleGenerateMagicLink}
              sx={{
                borderRadius: '12px',
              }}
            >
              Magic Link
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              sx={{
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${themeAccents.primary}, ${themeAccents.glow})`,
              }}
            >
              New Workflow
            </Button>
          </Stack>
        </Box>

        {/* View Selector */}
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Stack direction="row" spacing={1}>
            {[
              { value: 'overview', label: 'Overview' },
              { value: 'workflows', label: 'Workflows' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'magiclinks', label: 'Magic Links' },
            ].map((mode) => (
              <Chip
                key={mode.value}
                label={mode.label}
                onClick={() => setViewMode(mode.value as AutomationMode)}
                sx={{
                  borderRadius: '12px',
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

        {/* Content based on view mode */}
        <Box sx={{ p: 2 }}>
          {viewMode === 'magiclinks' ? (
            // Magic Links View
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Active Magic Links
              </Typography>
              {magicLinks.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', backgroundColor: alpha(theme.palette.background.paper, 0.3) }}>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    No active magic links. Generate one to enable one-click automation.
                  </Typography>
                </Card>
              ) : (
                magicLinks.map((link) => (
                  <Card
                    key={link.id}
                    sx={{
                      p: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.3),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {link.workflow_type.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          Created: {new Date(link.created_at).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                          {`${window.location.origin}/magic/${link.token.substring(0, 20)}...`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                ))
              )}
            </Stack>
          ) : (
            // Workflows View
            <Stack spacing={2}>
              {workflows.map((workflow) => (
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
                            borderRadius: '10px',
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
                        icon={workflow.status === WorkflowStatus.ACTIVE ? <ActiveIcon /> : 
                              workflow.status === WorkflowStatus.PAUSED ? <PauseIcon /> : <ScheduleIcon />}
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
                        {workflow.successRate || 0}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Success Rate
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
                      <Stack direction="row" spacing={1} justifyContent={isMobile ? 'center' : 'flex-end'}>
                        <IconButton 
                          size="small"
                          onClick={() => handleStatusToggle(workflow)}
                        >
                          {workflow.status === WorkflowStatus.ACTIVE ? <PauseIcon /> : <StartIcon />}
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
          )}
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

      {/* Magic Link Dialog */}
      <Dialog
        open={magicLinkDialog}
        onClose={() => setMagicLinkDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Magic Link Generated</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share this link to enable one-click automation. The link expires in 48 hours.
          </Typography>
          <TextField
            fullWidth
            value={generatedLink}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => navigator.clipboard.writeText(generatedLink)}>
                  <CopyIcon />
                </IconButton>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            Anyone with this link can trigger the automation workflow.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMagicLinkDialog(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(generatedLink);
              setMagicLinkDialog(false);
            }}
          >
            Copy & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutomationHub;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
  AlertTitle,
  Paper,
  Divider,
  Stack,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  AutoMode as AutomationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Campaign as CampaignIcon,
  Psychology as AIIcon,
  Timeline as TimelineIcon,
  Rule as RuleIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Notifications as NotificationIcon,
  SmartToy as BotIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Loop as LoopIcon,
  FilterList as FilterIcon,
  BoltIcon as TriggerIcon,
  AccountTree as WorkflowIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../themes/ThemeContext';
import glassEffects from '../themes/glassEffects';

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'call' | 'email' | 'task' | 'campaign' | 'workflow';
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  actions: string[];
  stats: {
    executions: number;
    successRate: number;
    lastRun?: string;
    nextRun?: string;
  };
  icon?: React.ReactNode;
}

const Automations: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'call' | 'email' | 'task' | 'campaign' | 'workflow'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample automations
  const [automations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Follow-Up Call Sequence',
      description: 'Automatically schedule follow-up calls after initial contact',
      type: 'call',
      status: 'active',
      trigger: 'After initial call with outcome "Interested"',
      actions: ['Wait 2 days', 'Create call task', 'Send reminder email', 'Update contact status'],
      stats: {
        executions: 342,
        successRate: 78,
        lastRun: '2 hours ago',
        nextRun: 'In 30 minutes'
      },
      icon: <PhoneIcon />
    },
    {
      id: '2',
      name: 'New Lead Welcome Campaign',
      description: 'Send personalized welcome emails to new contacts',
      type: 'email',
      status: 'active',
      trigger: 'When contact is added with tag "New Lead"',
      actions: ['Send welcome email', 'Wait 1 day', 'Send product info', 'Create follow-up task'],
      stats: {
        executions: 156,
        successRate: 92,
        lastRun: '1 hour ago'
      },
      icon: <EmailIcon />
    },
    {
      id: '3',
      name: 'High-Value Account Monitoring',
      description: 'Track and alert on high-value account activities',
      type: 'workflow',
      status: 'active',
      trigger: 'Daily at 9:00 AM',
      actions: ['Check account activity', 'Score engagement', 'Alert if score drops', 'Create intervention task'],
      stats: {
        executions: 45,
        successRate: 100,
        lastRun: 'This morning',
        nextRun: 'Tomorrow 9:00 AM'
      },
      icon: <MoneyIcon />
    },
    {
      id: '4',
      name: 'Birthday Outreach Campaign',
      description: 'Send personalized birthday messages to contacts',
      type: 'campaign',
      status: 'active',
      trigger: 'On contact birthday',
      actions: ['Send birthday email', 'Create call task', 'Add gift note to CRM'],
      stats: {
        executions: 23,
        successRate: 100,
        lastRun: 'Yesterday'
      },
      icon: <CampaignIcon />
    },
    {
      id: '5',
      name: 'Inactive Account Re-engagement',
      description: 'Automatically re-engage accounts with no activity for 60 days',
      type: 'workflow',
      status: 'paused',
      trigger: 'When account inactive for 60 days',
      actions: ['Send re-engagement email', 'Create high-priority call task', 'Assign to account manager'],
      stats: {
        executions: 67,
        successRate: 65,
        lastRun: '1 week ago'
      },
      icon: <LoopIcon />
    },
    {
      id: '6',
      name: 'AI Lead Scoring Update',
      description: 'Update lead scores based on engagement and behavior',
      type: 'workflow',
      status: 'active',
      trigger: 'After any contact interaction',
      actions: ['Analyze interaction', 'Update lead score', 'Move to appropriate segment', 'Notify if hot lead'],
      stats: {
        executions: 1247,
        successRate: 98,
        lastRun: '5 minutes ago'
      },
      icon: <AIIcon />
    }
  ]);

  const getStatusColor = (status: Automation['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'default';
    }
  };

  const getTypeColor = (type: Automation['type']) => {
    switch (type) {
      case 'call': return theme.palette.primary.main;
      case 'email': return theme.palette.secondary.main;
      case 'task': return theme.palette.warning.main;
      case 'campaign': return theme.palette.info.main;
      case 'workflow': return theme.palette.error.main;
    }
  };

  const filteredAutomations = automations.filter(automation => {
    const matchesCategory = selectedCategory === 'all' || automation.type === selectedCategory;
    const matchesSearch = automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         automation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderAutomationCard = (automation: Automation) => (
    <Card
      key={automation.id}
      elevation={0}
      sx={{
        ...glassEffects.effects.obsidian,
        borderRadius: 3,
        border: `1px solid ${alpha(getTypeColor(automation.type), 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(getTypeColor(automation.type), 0.15)}`,
          borderColor: alpha(getTypeColor(automation.type), 0.4),
        },
      }}
    >
      <CardHeader
        avatar={
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(getTypeColor(automation.type), 0.1),
              color: getTypeColor(automation.type),
            }}
          >
            {automation.icon}
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{automation.name}</Typography>
            <Chip
              label={automation.status}
              color={getStatusColor(automation.status)}
              size="small"
            />
          </Box>
        }
        subheader={automation.description}
        action={
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
            <Switch
              checked={automation.status === 'active'}
              color="primary"
              size="small"
            />
          </Stack>
        }
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Trigger
          </Typography>
          <Chip
            icon={<TriggerIcon />}
            label={automation.trigger}
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="secondary" gutterBottom>
            Actions ({automation.actions.length})
          </Typography>
          <Stack spacing={0.5}>
            {automation.actions.slice(0, 3).map((action, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="caption">{action}</Typography>
              </Box>
            ))}
            {automation.actions.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{automation.actions.length - 3} more actions
              </Typography>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Executions
              </Typography>
              <Typography variant="h6">{automation.stats.executions}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Success Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="h6">{automation.stats.successRate}%</Typography>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={automation.stats.successRate}
                    sx={{ height: 4, borderRadius: 2 }}
                    color={automation.stats.successRate > 80 ? 'success' : 'warning'}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Last Run
            </Typography>
            <Typography variant="body2">{automation.stats.lastRun || 'Never'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">
              Next Run
            </Typography>
            <Typography variant="body2">{automation.stats.nextRun || 'On trigger'}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderQuickStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <AutomationIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">{automations.length}</Typography>
          <Typography variant="body2" color="text.secondary">Total Automations</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <PlayIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">{automations.filter(a => a.status === 'active').length}</Typography>
          <Typography variant="body2" color="text.secondary">Active</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <SpeedIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">2,456</Typography>
          <Typography variant="body2" color="text.secondary">Executions Today</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <TrendingUpIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">89%</Typography>
          <Typography variant="body2" color="text.secondary">Avg Success Rate</Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const categories = [
    { value: 'all', label: 'All Automations', icon: <AutomationIcon /> },
    { value: 'call', label: 'Call', icon: <PhoneIcon /> },
    { value: 'email', label: 'Email', icon: <EmailIcon /> },
    { value: 'task', label: 'Task', icon: <TaskIcon /> },
    { value: 'campaign', label: 'Campaign', icon: <CampaignIcon /> },
    { value: 'workflow', label: 'Workflow', icon: <WorkflowIcon /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Automations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Powerful workflows that run your business on autopilot
        </Typography>
      </Box>

      {/* Alert for new feature */}
      <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" startIcon={<AIIcon />}>
            Try AI Builder
          </Button>
        }
      >
        <AlertTitle>New: AI Automation Builder</AlertTitle>
        Describe what you want to automate in plain English and let AI create the workflow for you.
      </Alert>

      {/* Quick Stats */}
      {renderQuickStats()}

      {/* Filters and Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search automations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            label="Category"
          >
            {categories.map(cat => (
              <MenuItem key={cat.value} value={cat.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {cat.icon}
                  {cat.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/automations/create')}
        >
          Create Automation
        </Button>
      </Box>

      {/* Automations Grid */}
      <Grid container spacing={3}>
        {filteredAutomations.map(automation => (
          <Grid item xs={12} md={6} lg={4} key={automation.id}>
            <Zoom in timeout={300}>
              <Box>{renderAutomationCard(automation)}</Box>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {filteredAutomations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AutomationIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No automations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? 'Try adjusting your search' : 'Create your first automation to get started'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/automations/create')}
          >
            Create First Automation
          </Button>
        </Box>
      )}

      {/* Popular Templates */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Popular Templates
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <PhoneIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="subtitle2">Follow-Up Call Cadence</Typography>
              <Typography variant="caption" color="text.secondary">
                Automate your follow-up calls with smart timing
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <EmailIcon color="secondary" sx={{ mb: 1 }} />
              <Typography variant="subtitle2">Drip Email Campaign</Typography>
              <Typography variant="caption" color="text.secondary">
                Nurture leads with automated email sequences
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <AIIcon color="warning" sx={{ mb: 1 }} />
              <Typography variant="subtitle2">AI Lead Scoring</Typography>
              <Typography variant="caption" color="text.secondary">
                Automatically score and prioritize leads
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <NotificationIcon color="info" sx={{ mb: 1 }} />
              <Typography variant="subtitle2">Smart Alerts</Typography>
              <Typography variant="caption" color="text.secondary">
                Get notified when important events happen
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Automations;
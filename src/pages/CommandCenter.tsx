import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Collapse,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as ActivityIcon,
  Assignment as TaskIcon,
  AutoAwesome as InsightIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as RevenueIcon,
  Timeline as PipelineIcon,
  CheckCircle as ConversionIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../themes/ThemeContext';
import { useDashboardData } from '../contexts/DashboardDataContext';
import { useAuth } from '../auth';
import { getUserDisplayName } from '../utils/userHelpers';
import glassEffects from '../themes/glassEffects';
import MobileStatsRibbon from '../components/dashboard/MobileStatsRibbon';
import CompactActivityFeed from '../components/dashboard/CompactActivityFeed';
import PriorityTaskList from '../components/dashboard/PriorityTaskList';
import InsightCards from '../components/dashboard/InsightCards';
import { getThemeAccents, getThemeGlass } from '../components/dashboard/ThemeAwareComponents';

type ViewMode = 'overview' | 'activities' | 'tasks' | 'insights';

const CommandCenter: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { dashboardData, loading, mockActivities, mockTasks } = useDashboardData();
  
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [expanded, setExpanded] = useState(true);
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);
  
  // Get view icon
  const getViewIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'overview': return <DashboardIcon />;
      case 'activities': return <ActivityIcon />;
      case 'tasks': return <TaskIcon />;
      case 'insights': return <InsightIcon />;
    }
  };
  
  // Get view color
  const getViewColor = (mode: ViewMode) => {
    switch (mode) {
      case 'overview': return themeAccents.primary;
      case 'activities': return themeAccents.glow;
      case 'tasks': return themeAccents.secondary;
      case 'insights': return themeAccents.primary;
    }
  };

  // Format currency for display
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };
  
  // Loading state
  if (loading && !dashboardData) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    change, 
    color 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    change?: { value: number; trend: 'up' | 'down' };
    color: string;
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        ...themeGlass,
        borderRadius: 2,
        border: `1px solid ${alpha(color, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.4),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1,
              borderRadius: 1,
              backgroundColor: alpha(color, 0.1),
              color: color,
              mb: 1.5,
            }}
          >
            {icon}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            {value}
          </Typography>
        </Box>
        {change && (
          <Chip
            icon={change.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${change.value}%`}
            size="small"
            sx={{
              backgroundColor: alpha(change.trend === 'up' ? theme.palette.success.main : theme.palette.error.main, 0.1),
              color: change.trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
              '& .MuiChip-icon': {
                fontSize: '1rem',
              },
            }}
          />
        )}
      </Box>
    </Paper>
  );
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Welcome Section */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
            Welcome back, {getUserDisplayName(user)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your sales performance and activity
          </Typography>
        </Box>

        {/* Mission Control Panel */}
        <Box
          sx={{
            position: 'relative',
            ...themeGlass,
            borderRadius: 2,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header with Dropdown */}
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                letterSpacing: '0.1em',
                fontWeight: 600,
                color: themeAccents.primary,
                textTransform: 'uppercase',
              }}
            >
              Mission Control
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small">
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewMode)}
                  startAdornment={getViewIcon(viewMode)}
                  sx={{
                    minWidth: 150,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    '& .MuiSelect-icon': {
                      color: getViewColor(viewMode),
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(getViewColor(viewMode), 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: getViewColor(viewMode),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: getViewColor(viewMode),
                    },
                  }}
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                  <MenuItem value="tasks">Tasks</MenuItem>
                  <MenuItem value="insights">Insights</MenuItem>
                </Select>
              </FormControl>
              
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: themeAccents.primary,
                  backgroundColor: alpha(themeAccents.primary, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(themeAccents.primary, 0.2),
                  },
                }}
              >
                {expanded ? <CollapseIcon /> : <ExpandIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Collapse in={expanded}>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Overview Mode */}
              {viewMode === 'overview' && (
                <Fade in={viewMode === 'overview'} timeout={300}>
                  <Box>
                    {/* Stats Grid */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                          icon={<PersonIcon />}
                          title="CONTACTS"
                          value={dashboardData?.total_contacts.toLocaleString() || '1,317'}
                          change={{ value: 11.3, trend: 'up' }}
                          color={themeAccents.primary}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                          icon={<BusinessIcon />}
                          title="PRACTICES"
                          value={dashboardData?.active_practices.toLocaleString() || '340'}
                          change={{ value: 8.5, trend: 'up' }}
                          color={themeAccents.secondary}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                          icon={<RevenueIcon />}
                          title="REVENUE"
                          value={formatCurrency((dashboardData?.revenue_generated || 8840000) / 100)}
                          change={{ value: 9.6, trend: 'up' }}
                          color={themeAccents.glow}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                          icon={<PipelineIcon />}
                          title="PIPELINE"
                          value="$1.3M"
                          change={{ value: 0, trend: 'down' }}
                          color={themeAccents.error || theme.palette.error.main}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                          icon={<ConversionIcon />}
                          title="CONVERSION"
                          value="45%"
                          change={{ value: 0, trend: 'down' }}
                          color={themeAccents.success || theme.palette.success.main}
                        />
                      </Grid>
                    </Grid>

                    {/* Priority and Activity Section */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            ...themeGlass,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            backgroundColor: alpha(theme.palette.error.main, 0.02),
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.error.main,
                              mb: 2,
                              fontWeight: 600,
                              letterSpacing: '0.05em',
                            }}
                          >
                            HIGH PRIORITY
                          </Typography>
                          <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                            {mockTasks?.filter(t => t.priority === 'high').length || 2}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tasks requiring immediate attention
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            ...themeGlass,
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            backgroundColor: alpha(theme.palette.warning.main, 0.02),
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.warning.main,
                              mb: 2,
                              fontWeight: 600,
                              letterSpacing: '0.05em',
                            }}
                          >
                            RECENT ACTIVITY
                          </Typography>
                          {mockActivities?.slice(0, 3).map((activity, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                • {activity}
                              </Typography>
                            </Box>
                          )) || (
                            <>
                              <Typography variant="body2">• with Dr. Maria Anderson</Typography>
                              <Typography variant="body2">• Dr. Maria Anderson to contacts</Typography>
                              <Typography variant="body2">• to Dr. Priya Miller</Typography>
                            </>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* AI Insights */}
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 3,
                        p: 3,
                        ...themeGlass,
                        borderRadius: 2,
                        border: `1px solid ${alpha(themeAccents.primary, 0.2)}`,
                        backgroundColor: alpha(themeAccents.primary, 0.02),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: themeAccents.primary,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                          }}
                        >
                          AI INSIGHTS
                        </Typography>
                        <Chip
                          label="View All"
                          size="small"
                          clickable
                          sx={{
                            backgroundColor: alpha(themeAccents.primary, 0.1),
                            color: themeAccents.primary,
                            '&:hover': {
                              backgroundColor: alpha(themeAccents.primary, 0.2),
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        3 High-Confidence Opportunities
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        $2.4M potential pipeline identified
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              )}

              {/* Activities Mode */}
              {viewMode === 'activities' && (
                <Fade in={viewMode === 'activities'} timeout={300}>
                  <Box>
                    <CompactActivityFeed 
                      activities={mockActivities?.map((activity, index) => ({
                        id: `activity-${index}`,
                        type: 'general',
                        description: activity,
                        timeAgo: `${Math.floor(Math.random() * 60)}m ago`,
                        status: 'info' as const
                      })) || []}
                      themeAccents={themeAccents}
                    />
                  </Box>
                </Fade>
              )}

              {/* Tasks Mode */}
              {viewMode === 'tasks' && (
                <Fade in={viewMode === 'tasks'} timeout={300}>
                  <Box>
                    <PriorityTaskList 
                      tasks={mockTasks || []}
                      themeAccents={themeAccents}
                    />
                  </Box>
                </Fade>
              )}

              {/* Insights Mode */}
              {viewMode === 'insights' && (
                <Fade in={viewMode === 'insights'} timeout={300}>
                  <Box>
                    <InsightCards themeAccents={themeAccents} />
                  </Box>
                </Fade>
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default CommandCenter;
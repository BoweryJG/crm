// Ripple Analytics Component - Track and visualize content performance
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as ViewsIcon,
  TouchApp as EngagementIcon,
  Timer as TimeIcon,
  Share as ShareIcon,
  CheckCircle as ConversionIcon,
  LocalFireDepartment as HotLeadIcon,
  WaterDrop as RippleIcon,
  Analytics as AnalyticsIcon,
  Speed as VelocityIcon,
  Psychology as InsightIcon,
  Groups as AudienceIcon,
  LocationOn as LocationIcon,
  Devices as DeviceIcon,
  AccessTime as RecentIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
  Refresh as RefreshIcon,
  Download as ExportIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { rippleContentService } from '../../services/rippleContentService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface RippleAnalyticsProps {
  userId?: string;
}

interface AnalyticsData {
  total_ripples: number;
  total_views: number;
  unique_viewers: number;
  blazing_leads: number;
  hot_leads: number;
  conversions: number;
  avg_engagement_score: number;
  top_performing_ripples: any[];
  engagement_heatmap: any;
  conversion_funnel: any;
  interest_insights: any[];
  ripple_performance: {
    open_rate: number;
    engagement_rate: number;
    conversion_rate: number;
    avg_time_spent: number;
    viral_coefficient: number;
  };
}

const RippleAnalytics: React.FC<RippleAnalyticsProps> = ({ userId = 'demo-user' }) => {
  const theme = useTheme();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [currentTab, setCurrentTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await rippleContentService.getRippleAnalytics(userId, timeframe);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading ripple analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const getPerformanceChange = (current: number, previous: number): { value: number; trend: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) return { value: 0, trend: 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  if (loading && !analyticsData) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  // Chart configurations
  const engagementChartData = {
    labels: ['Sent', 'Viewed', 'Engaged', 'Converted'],
    datasets: [{
      label: 'Conversion Funnel',
      data: [
        analyticsData.conversion_funnel.sent,
        analyticsData.conversion_funnel.viewed,
        analyticsData.conversion_funnel.engaged,
        analyticsData.conversion_funnel.converted
      ],
      backgroundColor: [
        alpha(theme.palette.primary.main, 0.2),
        alpha(theme.palette.info.main, 0.2),
        alpha(theme.palette.warning.main, 0.2),
        alpha(theme.palette.success.main, 0.2)
      ],
      borderColor: [
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.success.main
      ],
      borderWidth: 2
    }]
  };

  const performanceChartData = {
    labels: ['Open Rate', 'Engagement Rate', 'Conversion Rate'],
    datasets: [{
      data: [
        analyticsData.ripple_performance.open_rate,
        analyticsData.ripple_performance.engagement_rate,
        analyticsData.ripple_performance.conversion_rate
      ],
      backgroundColor: [
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.success.main
      ]
    }]
  };

  const leadTemperatureData = {
    labels: ['Blazing', 'Hot', 'Warm', 'Cold'],
    datasets: [{
      data: [
        analyticsData.blazing_leads,
        analyticsData.hot_leads,
        analyticsData.total_ripples - analyticsData.blazing_leads - analyticsData.hot_leads - analyticsData.conversions,
        analyticsData.total_ripples - analyticsData.total_views
      ],
      backgroundColor: [
        '#ff1744',
        '#ff6b6b',
        '#ffd93d',
        '#6c757d'
      ]
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ripple Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track the impact of your content ripples across prospects
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={(e, value) => value && setTimeframe(value)}
            size="small"
          >
            <ToggleButton value="day">24h</ToggleButton>
            <ToggleButton value="week">7d</ToggleButton>
            <ToggleButton value="month">30d</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Ripples
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analyticsData.total_ripples}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <UpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      12% vs last {timeframe}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <RippleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Views
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analyticsData.total_views}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {analyticsData.unique_viewers} unique
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <ViewsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Hot Leads
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analyticsData.blazing_leads + analyticsData.hot_leads}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${analyticsData.blazing_leads} blazing`} 
                      size="small" 
                      sx={{ bgcolor: '#ff1744', color: 'white' }}
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <HotLeadIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Conversions
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analyticsData.conversions}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {analyticsData.ripple_performance.conversion_rate.toFixed(1)}% rate
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <ConversionIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Performance Overview" />
            <Tab label="Top Ripples" />
            <Tab label="Engagement Insights" />
            <Tab label="Lead Analysis" />
          </Tabs>
        </Box>

        {/* Performance Overview Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Conversion Funnel */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Conversion Funnel
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={engagementChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Funnel efficiency: {analyticsData.conversion_funnel.funnel_efficiency.toFixed(1)}%
                  </Typography>
                </Card>
              </Grid>

              {/* Performance Metrics */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut 
                      data={performanceChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Key Performance Indicators */}
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Performance Indicators
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <EngagementIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {analyticsData.avg_engagement_score.toFixed(0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Engagement Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <TimeIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {formatTime(analyticsData.ripple_performance.avg_time_spent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Time Spent
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <ShareIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {analyticsData.ripple_performance.viral_coefficient.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Viral Coefficient
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <VelocityIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {analyticsData.ripple_performance.open_rate.toFixed(0)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Open Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Top Ripples Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Content</TableCell>
                    <TableCell align="center">Engagement Score</TableCell>
                    <TableCell align="center">Lead Temperature</TableCell>
                    <TableCell align="center">Conversions</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyticsData.top_performing_ripples.map((ripple, index) => (
                    <TableRow key={ripple.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {ripple.subject}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {ripple.id.substring(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CircularProgress 
                            variant="determinate" 
                            value={ripple.engagement_score} 
                            size={40}
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {ripple.engagement_score}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={ripple.lead_temperature}
                          size="small"
                          color={
                            ripple.lead_temperature === 'blazing' ? 'error' :
                            ripple.lead_temperature === 'hot' ? 'warning' :
                            'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {ripple.conversions}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Engagement Insights Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Interest Signals */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Interest Signals
                  </Typography>
                  <List>
                    {analyticsData.interest_insights.slice(0, 5).map((insight, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <InsightIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={insight.signal.replace(/_/g, ' ').charAt(0).toUpperCase() + insight.signal.slice(1)}
                          secondary={`Detected ${insight.count} times`}
                        />
                        <ListItemSecondaryAction>
                          <Chip label={`${((insight.count / analyticsData.total_ripples) * 100).toFixed(0)}%`} size="small" />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Lead Temperature Distribution */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Lead Temperature Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut 
                      data={leadTemperatureData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Engagement Patterns */}
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Engagement Patterns
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    When and how prospects engage with your ripples
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Peak Engagement Time
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            2:00 PM - 4:00 PM
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Most Active Day
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            Tuesday
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Preferred Device
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <DeviceIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            Desktop (68%)
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Lead Analysis Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Advanced lead analysis and predictive scoring coming soon
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Lead Scoring Matrix
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered lead scoring based on engagement patterns and buying signals
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default RippleAnalytics;
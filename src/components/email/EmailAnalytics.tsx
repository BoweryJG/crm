import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Paper,
  Stack,
  Badge,
  Fade,
  Grow,
  Slide,
  Zoom,
  Collapse
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Email as EmailIcon,
  OpenInNew as OpenIcon,
  TouchApp as MouseIcon,
  TrendingUp as BounceIcon,
  Assessment as ReportIcon,
  Unsubscribe as UnsubscribeIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Insights as InsightsIcon,
  Psychology as PsychologyIcon,
  AutoGraph as AutoGraphIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
  Devices as DevicesIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth';
import { emailAnalyticsService } from '../../services/email/EmailAnalyticsService';
import type { 
  RealTimeMetrics, 
  CampaignAnalytics, 
  ContactEngagement,
  EmailIntelligence,
  A_BTestResult
} from '../../services/email/EmailAnalyticsService';

// Advanced animations
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
`;

const dataFlow = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const countUp = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, 
      transparent, 
      ${alpha(theme.palette.primary.main, 0.6)}, 
      transparent
    )`,
  }
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.background.paper, 0.9)} 0%,
    ${alpha(theme.palette.background.paper, 0.6)} 100%
  )`,
  backdropFilter: 'blur(15px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'scale(1.02)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  
  '&.trending-up': {
    borderLeftColor: theme.palette.success.main,
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },
  
  '&.trending-down': {
    borderLeftColor: theme.palette.error.main,
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },
  
  '&.trending-stable': {
    borderLeftColor: theme.palette.warning.main,
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  }
}));

const AnimatedNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.5rem',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${countUp} 0.6s ease-out`,
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '1px',
    transform: 'scaleX(0)',
    animation: 'scaleX 0.8s ease-out 0.3s forwards',
  }
}));

const LoadingShimmer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(90deg, 
    ${alpha(theme.palette.grey[300], 0.2)} 25%, 
    ${alpha(theme.palette.grey[300], 0.4)} 50%, 
    ${alpha(theme.palette.grey[300], 0.2)} 75%
  )`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: '8px',
  height: '20px',
  width: '100%'
}));

const StatusIndicator = styled(Box)<{ status: 'healthy' | 'degraded' | 'critical' }>(({ theme, status }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 
    status === 'healthy' ? theme.palette.success.main :
    status === 'degraded' ? theme.palette.warning.main :
    theme.palette.error.main,
  animation: status !== 'healthy' ? `${pulseGlow} 2s infinite` : 'none',
  boxShadow: `0 0 10px ${
    status === 'healthy' ? theme.palette.success.main :
    status === 'degraded' ? theme.palette.warning.main :
    theme.palette.error.main
  }`,
}));

interface EmailAnalyticsProps {
  open?: boolean;
  onClose?: () => void;
  campaignId?: string;
  contactId?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d';
  refreshInterval?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ flexGrow: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column', p: 3 }}
  >
    {value === index && children}
  </Box>
);

const EmailAnalytics: React.FC<EmailAnalyticsProps> = ({
  open = true,
  onClose,
  campaignId,
  contactId,
  timeRange = '24h',
  refreshInterval = 30000
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics | null>(null);
  const [contactEngagement, setContactEngagement] = useState<ContactEngagement | null>(null);
  const [emailIntelligence, setEmailIntelligence] = useState<EmailIntelligence | null>(null);
  const [abTestResults, setAbTestResults] = useState<A_BTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);

  // Refs
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Theme detection
  const currentThemeData = getCurrentTheme();
  const isLuxuryTheme = currentThemeData?.category === 'luxury' || 
                       currentThemeData?.category === 'beauty' || 
                       themeMode === 'luxury';

  // Color scheme for charts
  const chartColors = useMemo(() => ({
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    gradient: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
  }), [theme]);

  // Load all analytics data
  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = [
        emailAnalyticsService.getRealTimeMetrics(),
        campaignId ? emailAnalyticsService.getCampaignAnalytics(campaignId) : Promise.resolve(null),
        contactId ? emailAnalyticsService.getContactEngagement(contactId) : Promise.resolve(null),
        emailAnalyticsService.getEmailIntelligence(user?.id)
      ];

      const [realTime, campaign, contact, intelligence] = await Promise.all(promises);

      setRealTimeMetrics(realTime as RealTimeMetrics | null);
      setCampaignAnalytics(campaign as CampaignAnalytics | null);
      setContactEngagement(contact as ContactEngagement | null);
      setEmailIntelligence(intelligence as EmailIntelligence | null);

    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time updates
  useEffect(() => {
    if (!open) return;

    // Initial load
    loadAnalyticsData();

    // Setup auto-refresh
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(loadAnalyticsData, refreshInterval);
    }

    // Setup WebSocket for real-time updates
    if (process.env.REACT_APP_WS_URL) {
      wsRef.current = new WebSocket(process.env.REACT_APP_WS_URL);
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'email_analytics_update') {
            loadAnalyticsData();
          }
        } catch (err) {
          console.warn('Invalid WebSocket message:', err);
        }
      };
    }

    // Listen for custom events
    const handleAnalyticsUpdate = () => {
      loadAnalyticsData();
    };

    window.addEventListener('emailAnalyticsUpdate', handleAnalyticsUpdate);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      window.removeEventListener('emailAnalyticsUpdate', handleAnalyticsUpdate);
    };
  }, [open, autoRefresh, refreshInterval, campaignId, contactId, user?.id]);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format percentage
  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  // Get trend direction
  const getTrendDirection = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    const diff = ((current - previous) / previous) * 100;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  };

  // Generate mock historical data for charts
  const generateChartData = (days: number) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        sent: Math.floor(Math.random() * 1000) + 500,
        delivered: Math.floor(Math.random() * 900) + 450,
        opened: Math.floor(Math.random() * 400) + 200,
        clicked: Math.floor(Math.random() * 100) + 50,
        bounced: Math.floor(Math.random() * 50) + 10
      };
    });
  };

  const chartData = useMemo(() => generateChartData(
    selectedTimeRange === '1h' ? 24 :
    selectedTimeRange === '24h' ? 24 :
    selectedTimeRange === '7d' ? 7 :
    selectedTimeRange === '30d' ? 30 : 90
  ), [selectedTimeRange]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        backgroundColor: isFullscreen ? theme.palette.background.default : 'transparent',
        overflow: 'auto'
      }}
    >
      <GlassCard
        sx={{
          width: '100%',
          height: isFullscreen ? '100%' : 'auto',
          minHeight: isMobile ? '60vh' : '70vh',
          display: 'flex',
          flexDirection: 'column',
          m: isFullscreen ? 0 : 2,
          borderRadius: isFullscreen ? 0 : '16px'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, 
              ${alpha(theme.palette.background.paper, 0.9)} 0%,
              ${alpha(theme.palette.background.paper, 0.7)} 100%
            )`,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 48,
                height: 48
              }}
            >
              <InsightsIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Email Analytics Dashboard
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Real-time email performance tracking
                </Typography>
                {realTimeMetrics && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StatusIndicator status={realTimeMetrics.system_health} />
                    <Typography variant="caption" color="text.secondary">
                      {realTimeMetrics.system_health}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Time Range Selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Range</InputLabel>
              <Select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                label="Range"
              >
                <MenuItem value="1h">1 Hour</MenuItem>
                <MenuItem value="24h">24 Hours</MenuItem>
                <MenuItem value="7d">7 Days</MenuItem>
                <MenuItem value="30d">30 Days</MenuItem>
                <MenuItem value="90d">90 Days</MenuItem>
              </Select>
            </FormControl>

            {/* Auto-refresh toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  size="small"
                />
              }
              label="Auto"
              sx={{ mr: 1 }}
            />

            {/* Refresh button */}
            <IconButton
              onClick={loadAnalyticsData}
              disabled={loading}
              sx={{ borderRadius: '8px' }}
            >
              <RefreshIcon />
            </IconButton>

            {/* Fullscreen toggle */}
            <IconButton
              onClick={() => setIsFullscreen(!isFullscreen)}
              sx={{ borderRadius: '8px' }}
            >
              <FullscreenIcon />
            </IconButton>

            {/* Close button */}
            {onClose && (
              <IconButton
                onClick={onClose}
                sx={{ borderRadius: '8px' }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ m: 2, borderRadius: '12px' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* System Alerts */}
        {realTimeMetrics?.alerts && realTimeMetrics.alerts.length > 0 && showAlerts && (
          <Collapse in={showAlerts}>
            <Box sx={{ p: 2, pt: 0 }}>
              {realTimeMetrics.alerts.map((alert, index) => (
                <Alert
                  key={index}
                  severity={alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                  sx={{ mb: 1, borderRadius: '8px' }}
                  onClose={() => {
                    const newAlerts = realTimeMetrics.alerts.filter((_, i) => i !== index);
                    setRealTimeMetrics({
                      ...realTimeMetrics,
                      alerts: newAlerts
                    });
                    if (newAlerts.length === 0) setShowAlerts(false);
                  }}
                >
                  {alert.message}
                </Alert>
              ))}
            </Box>
          </Collapse>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <MetricCard>
                    <LoadingShimmer sx={{ mb: 1 }} />
                    <LoadingShimmer sx={{ width: '60%', mb: 1 }} />
                    <LoadingShimmer sx={{ width: '40%' }} />
                  </MetricCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
              sx={{
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                px: 2
              }}
            >
              <Tab
                icon={<SpeedIcon />}
                label="Real-time"
                sx={{ minHeight: 60 }}
              />
              <Tab
                icon={<AutoGraphIcon />}
                label="Campaign"
                sx={{ minHeight: 60 }}
                disabled={!campaignId}
              />
              <Tab
                icon={<PsychologyIcon />}
                label="Intelligence"
                sx={{ minHeight: 60 }}
              />
              <Tab
                icon={<TimelineIcon />}
                label="A/B Tests"
                sx={{ minHeight: 60 }}
              />
            </Tabs>

            {/* Tab Panels */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {/* Real-time Metrics Tab */}
              <TabPanel value={tabValue} index={0}>
                {realTimeMetrics && (
                  <Fade in timeout={600}>
                    <Box>
                      {/* Key Metrics Grid */}
                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <MetricCard className="trending-up">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" color="text.secondary">
                                Emails Sent
                              </Typography>
                              <EmailIcon color="primary" />
                            </Box>
                            <AnimatedNumber>
                              {formatNumber(realTimeMetrics.emails_sent_last_24h)}
                            </AnimatedNumber>
                            <Typography variant="body2" color="text.secondary">
                              {realTimeMetrics.emails_sent_last_hour} in last hour
                            </Typography>
                          </MetricCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <MetricCard className="trending-up">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" color="text.secondary">
                                Delivery Rate
                              </Typography>
                              <CheckCircleIcon color="success" />
                            </Box>
                            <AnimatedNumber>
                              {formatPercentage(realTimeMetrics.delivery_rate_last_hour)}
                            </AnimatedNumber>
                            <Typography variant="body2" color="text.secondary">
                              Last hour performance
                            </Typography>
                          </MetricCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <MetricCard className="trending-stable">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" color="text.secondary">
                                Open Rate
                              </Typography>
                              <OpenIcon color="info" />
                            </Box>
                            <AnimatedNumber>
                              {formatPercentage(realTimeMetrics.open_rate_last_hour)}
                            </AnimatedNumber>
                            <Typography variant="body2" color="text.secondary">
                              {realTimeMetrics.open_rate_last_hour > 20 ? 'Above average' : 'Below average'}
                            </Typography>
                          </MetricCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <MetricCard className="trending-up">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6" color="text.secondary">
                                Click Rate
                              </Typography>
                              <MouseIcon color="secondary" />
                            </Box>
                            <AnimatedNumber>
                              {formatPercentage(realTimeMetrics.click_rate_last_hour)}
                            </AnimatedNumber>
                            <Typography variant="body2" color="text.secondary">
                              Engagement metric
                            </Typography>
                          </MetricCard>
                        </Grid>
                      </Grid>

                      {/* Charts */}
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Email Performance Timeline
                              </Typography>
                              <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                                  <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                                  <YAxis stroke={theme.palette.text.secondary} />
                                  <ChartTooltip 
                                    contentStyle={{
                                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                      borderRadius: '8px',
                                      backdropFilter: 'blur(10px)'
                                    }}
                                  />
                                  <Legend />
                                  <Area
                                    type="monotone"
                                    dataKey="sent"
                                    stackId="1"
                                    stroke={chartColors.primary}
                                    fill={alpha(chartColors.primary, 0.3)}
                                    name="Sent"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="delivered"
                                    stackId="1"
                                    stroke={chartColors.success}
                                    fill={alpha(chartColors.success, 0.3)}
                                    name="Delivered"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="opened"
                                    stackId="1"
                                    stroke={chartColors.info}
                                    fill={alpha(chartColors.info, 0.3)}
                                    name="Opened"
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="clicked"
                                    stackId="1"
                                    stroke={chartColors.secondary}
                                    fill={alpha(chartColors.secondary, 0.3)}
                                    name="Clicked"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </GlassCard>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                System Status
                              </Typography>
                              <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Send Rate</Typography>
                                  <Chip
                                    label={`${realTimeMetrics.current_send_rate.toFixed(1)}/min`}
                                    size="small"
                                    color="primary"
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Active Campaigns</Typography>
                                  <Chip
                                    label={realTimeMetrics.active_campaigns}
                                    size="small"
                                    color="secondary"
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">Queue Size</Typography>
                                  <Chip
                                    label={realTimeMetrics.queue_size}
                                    size="small"
                                    color={realTimeMetrics.queue_size > 100 ? 'warning' : 'default'}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">System Health</Typography>
                                  <Chip
                                    label={realTimeMetrics.system_health}
                                    size="small"
                                    color={
                                      realTimeMetrics.system_health === 'healthy' ? 'success' :
                                      realTimeMetrics.system_health === 'degraded' ? 'warning' : 'error'
                                    }
                                    icon={
                                      realTimeMetrics.system_health === 'healthy' ? <CheckCircleIcon /> :
                                      realTimeMetrics.system_health === 'degraded' ? <WarningIcon /> : <ErrorIcon />
                                    }
                                  />
                                </Box>
                              </Stack>
                            </CardContent>
                          </GlassCard>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}
              </TabPanel>

              {/* Campaign Analytics Tab */}
              <TabPanel value={tabValue} index={1}>
                {campaignAnalytics && (
                  <Fade in timeout={600}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Campaign: {campaignAnalytics.campaign_name}
                      </Typography>
                      
                      {/* Campaign metrics would go here */}
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Performance Overview
                              </Typography>
                              <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Delivered', value: campaignAnalytics.delivered_count, color: chartColors.success },
                                      { name: 'Opened', value: campaignAnalytics.opened_count, color: chartColors.info },
                                      { name: 'Clicked', value: campaignAnalytics.clicked_count, color: chartColors.secondary },
                                      { name: 'Bounced', value: campaignAnalytics.bounced_count, color: chartColors.error }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {[chartColors.success, chartColors.info, chartColors.secondary, chartColors.error].map((color, index) => (
                                      <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                  </Pie>
                                  <ChartTooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </GlassCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Engagement Score
                              </Typography>
                              <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography
                                  variant="h2"
                                  sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 700
                                  }}
                                >
                                  {campaignAnalytics.engagement_score}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                  out of 100
                                </Typography>
                              </Box>
                            </CardContent>
                          </GlassCard>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}
              </TabPanel>

              {/* Intelligence Tab */}
              <TabPanel value={tabValue} index={2}>
                {emailIntelligence && (
                  <Fade in timeout={600}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Email Intelligence & Insights
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Deliverability Health
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                  Reputation Score
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={emailIntelligence.deliverability_insights.reputation_score}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {emailIntelligence.deliverability_insights.reputation_score}/100
                                </Typography>
                              </Box>

                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                  Spam Score
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.max(0, 100 - emailIntelligence.deliverability_insights.spam_score * 10)}
                                  color={emailIntelligence.deliverability_insights.spam_score < 3 ? 'success' : 'warning'}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {emailIntelligence.deliverability_insights.spam_score}/10
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="body2" gutterBottom>
                                  Authentication Status
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                  <Chip
                                    label="SPF"
                                    size="small"
                                    color={emailIntelligence.deliverability_insights.authentication_status.spf ? 'success' : 'error'}
                                    icon={emailIntelligence.deliverability_insights.authentication_status.spf ? <CheckCircleIcon /> : <ErrorIcon />}
                                  />
                                  <Chip
                                    label="DKIM"
                                    size="small"
                                    color={emailIntelligence.deliverability_insights.authentication_status.dkim ? 'success' : 'error'}
                                    icon={emailIntelligence.deliverability_insights.authentication_status.dkim ? <CheckCircleIcon /> : <ErrorIcon />}
                                  />
                                  <Chip
                                    label="DMARC"
                                    size="small"
                                    color={emailIntelligence.deliverability_insights.authentication_status.dmarc ? 'success' : 'error'}
                                    icon={emailIntelligence.deliverability_insights.authentication_status.dmarc ? <CheckCircleIcon /> : <ErrorIcon />}
                                  />
                                </Stack>
                              </Box>
                            </CardContent>
                          </GlassCard>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Recommendations
                              </Typography>
                              <List>
                                {emailIntelligence.deliverability_insights.recommendations.map((rec, index) => (
                                  <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                                        <InfoIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={rec}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </GlassCard>
                        </Grid>

                        <Grid item xs={12}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Send Time Optimization
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="primary">
                                      {emailIntelligence.send_time_optimization.best_hour}:00
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Best Hour
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="secondary">
                                      {emailIntelligence.send_time_optimization.best_day}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Best Day
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="success">
                                      {emailIntelligence.content_analysis.content_length_analysis.optimal_length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Optimal Length (words)
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </GlassCard>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}
              </TabPanel>

              {/* A/B Tests Tab */}
              <TabPanel value={tabValue} index={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    A/B Test Results
                  </Typography>
                  
                  {abTestResults.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        No A/B tests found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create your first A/B test to see results here
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {abTestResults.map((test, index) => (
                        <Grid item xs={12} key={index}>
                          <GlassCard>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {test.test_name}
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Variant A: {test.variant_a.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    Open Rate: {formatPercentage(test.variant_a.open_rate)}
                                  </Typography>
                                  <Typography variant="body2">
                                    Click Rate: {formatPercentage(test.variant_a.click_rate)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Variant B: {test.variant_b.name}
                                  </Typography>
                                  <Typography variant="body2">
                                    Open Rate: {formatPercentage(test.variant_b.open_rate)}
                                  </Typography>
                                  <Typography variant="body2">
                                    Click Rate: {formatPercentage(test.variant_b.click_rate)}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 2 }}>
                                <Chip
                                  label={test.winner === 'inconclusive' ? 'Inconclusive' : `Winner: Variant ${test.winner?.toUpperCase()}`}
                                  color={test.winner === 'inconclusive' ? 'default' : 'success'}
                                />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {test.recommendation}
                                </Typography>
                              </Box>
                            </CardContent>
                          </GlassCard>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </TabPanel>
            </Box>
          </>
        )}
      </GlassCard>
    </Box>
  );
};

export default EmailAnalytics;
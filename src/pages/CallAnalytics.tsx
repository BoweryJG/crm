import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Paper,
  Stack,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  CheckCircle as SuccessIcon,
  Cancel as FailedIcon,
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Speed as SpeedIcon,
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  PhoneCallback as CallbackIcon,
  PhoneMissed as MissedIcon,
  VoicemailOutlined as VoicemailIcon,
  Schedule as ScheduleIcon,
  LocalHospital as HospitalIcon,
  Face as FaceIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../themes/ThemeContext';
import glassEffects from '../themes/glassEffects';
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
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface CallMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface CallPattern {
  hour: string;
  calls: number;
  conversions: number;
  avgDuration: number;
}

interface RepPerformance {
  name: string;
  calls: number;
  conversions: number;
  avgDuration: number;
  revenue: number;
  score: number;
}

interface ContactTypePerformance {
  type: string;
  calls: number;
  conversions: number;
  value: number;
  color: string;
}

const CallAnalytics: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  
  const [timeRange, setTimeRange] = useState('week');
  const [selectedRep, setSelectedRep] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('conversions');

  // Key metrics
  const metrics: CallMetric[] = [
    {
      id: 'total-calls',
      title: 'Total Calls',
      value: '1,247',
      change: 12.5,
      icon: <PhoneIcon />,
      color: theme.palette.primary.main
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: '67%',
      change: 3.2,
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main
    },
    {
      id: 'avg-duration',
      title: 'Avg Duration',
      value: '4.5m',
      change: -5.8,
      icon: <TimerIcon />,
      color: theme.palette.warning.main
    },
    {
      id: 'total-revenue',
      title: 'Revenue Impact',
      value: '$124.5K',
      change: 18.9,
      icon: <MoneyIcon />,
      color: theme.palette.secondary.main
    }
  ];

  // Call patterns by hour
  const callPatterns: CallPattern[] = [
    { hour: '8AM', calls: 45, conversions: 28, avgDuration: 5.2 },
    { hour: '9AM', calls: 78, conversions: 52, avgDuration: 4.8 },
    { hour: '10AM', calls: 92, conversions: 65, avgDuration: 4.5 },
    { hour: '11AM', calls: 88, conversions: 58, avgDuration: 4.7 },
    { hour: '12PM', calls: 65, conversions: 41, avgDuration: 3.9 },
    { hour: '1PM', calls: 72, conversions: 48, avgDuration: 4.2 },
    { hour: '2PM', calls: 85, conversions: 59, avgDuration: 4.6 },
    { hour: '3PM', calls: 91, conversions: 64, avgDuration: 4.9 },
    { hour: '4PM', calls: 83, conversions: 56, avgDuration: 4.4 },
    { hour: '5PM', calls: 68, conversions: 42, avgDuration: 4.1 }
  ];

  // Rep performance data
  const repPerformance: RepPerformance[] = [
    { name: 'Sarah Chen', calls: 342, conversions: 231, avgDuration: 4.8, revenue: 45200, score: 95 },
    { name: 'Michael Rodriguez', calls: 298, conversions: 189, avgDuration: 4.2, revenue: 38900, score: 88 },
    { name: 'Jennifer Walsh', calls: 276, conversions: 165, avgDuration: 4.5, revenue: 32100, score: 82 },
    { name: 'David Kim', calls: 312, conversions: 187, avgDuration: 4.1, revenue: 36800, score: 85 },
    { name: 'Emily Johnson', calls: 289, conversions: 178, avgDuration: 4.6, revenue: 34500, score: 83 }
  ];

  // Contact type performance
  const contactTypeData: ContactTypePerformance[] = [
    { type: 'Oral Surgery', calls: 342, conversions: 231, value: 67.5, color: theme.palette.primary.main },
    { type: 'Dermatology', calls: 298, conversions: 189, value: 63.4, color: theme.palette.secondary.main },
    { type: 'Cosmetic Dentistry', calls: 276, conversions: 165, value: 59.8, color: theme.palette.warning.main },
    { type: 'General Dentistry', calls: 218, conversions: 112, value: 51.4, color: theme.palette.info.main },
    { type: 'Orthodontics', calls: 194, conversions: 98, value: 50.5, color: theme.palette.success.main }
  ];

  // Call outcome distribution
  const callOutcomes = [
    { name: 'Converted', value: 67, color: theme.palette.success.main },
    { name: 'Follow-up Scheduled', value: 18, color: theme.palette.warning.main },
    { name: 'Not Interested', value: 10, color: theme.palette.error.main },
    { name: 'No Answer', value: 5, color: theme.palette.grey[500] }
  ];

  // Radar chart data for call quality
  const callQualityData = [
    { metric: 'Opening', score: 85 },
    { metric: 'Discovery', score: 78 },
    { metric: 'Presentation', score: 82 },
    { metric: 'Objection Handling', score: 71 },
    { metric: 'Closing', score: 76 },
    { metric: 'Follow-up', score: 88 }
  ];

  const renderMetricCard = (metric: CallMetric) => (
    <Card
      elevation={0}
      sx={{
        ...glassEffects.effects.frostedSteel,
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(metric.color, 0.15)}`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {metric.title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {metric.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {metric.change > 0 ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: theme.palette.success.main, mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: theme.palette.error.main, mr: 0.5 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: metric.change > 0 ? theme.palette.success.main : theme.palette.error.main,
                  fontWeight: 500,
                }}
              >
                {Math.abs(metric.change)}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                vs last {timeRange}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(metric.color, 0.1),
              color: metric.color,
            }}
          >
            {metric.icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCallPatterns = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.obsidian, borderRadius: 3 }}>
      <CardHeader
        title="Call Patterns & Performance"
        subheader="Hourly breakdown of call activity and conversion rates"
        action={
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Metric</InputLabel>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              label="Metric"
            >
              <MenuItem value="conversions">Conversions</MenuItem>
              <MenuItem value="calls">Total Calls</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={callPatterns}>
            <defs>
              <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
            <XAxis dataKey="hour" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="calls"
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#colorCalls)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stroke={theme.palette.success.main}
              fillOpacity={1}
              fill="url(#colorConversions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderRepPerformance = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.museum, borderRadius: 3 }}>
      <CardHeader
        title="Rep Performance Breakdown"
        subheader="Individual performance metrics and rankings"
        action={
          <Button
            size="small"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/rep-analytics')}
          >
            Detailed View
          </Button>
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={repPerformance} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
            <XAxis type="number" stroke={theme.palette.text.secondary} />
            <YAxis dataKey="name" type="category" width={100} stroke={theme.palette.text.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
              }}
            />
            <Bar dataKey="conversions" fill={theme.palette.success.main} radius={[0, 8, 8, 0]} />
            <Bar dataKey="calls" fill={theme.palette.primary.main} radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderCallOutcomes = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.carbon, borderRadius: 3 }}>
      <CardHeader
        title="Call Outcome Distribution"
        subheader="Breakdown of call results"
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={callOutcomes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {callOutcomes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <Stack spacing={1} sx={{ mt: 2 }}>
          {callOutcomes.map((outcome) => (
            <Box
              key={outcome.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: outcome.color,
                  }}
                />
                <Typography variant="body2">{outcome.name}</Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {outcome.value}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderCallQuality = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.glacier, borderRadius: 3 }}>
      <CardHeader
        title="Call Quality Analysis"
        subheader="AI-powered call scoring breakdown"
        action={
          <Chip
            icon={<AIIcon />}
            label="AI Powered"
            color="primary"
            size="small"
          />
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={callQualityData}>
            <PolarGrid stroke={alpha(theme.palette.divider, 0.2)} />
            <PolarAngleAxis dataKey="metric" stroke={theme.palette.text.secondary} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={theme.palette.text.secondary} />
            <Radar
              name="Score"
              dataKey="score"
              stroke={theme.palette.primary.main}
              fill={theme.palette.primary.main}
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderContactTypePerformance = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.aurora, borderRadius: 3 }}>
      <CardHeader
        title="Performance by Contact Type"
        subheader="Conversion rates across different specialties"
      />
      <CardContent>
        <Stack spacing={2}>
          {contactTypeData.map((type) => (
            <Box key={type.type}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {type.type === 'Oral Surgery' && <HospitalIcon sx={{ color: type.color }} />}
                  {type.type === 'Dermatology' && <FaceIcon sx={{ color: type.color }} />}
                  {type.type.includes('Dentistry') && <BusinessIcon sx={{ color: type.color }} />}
                  <Typography variant="body2">{type.type}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {type.calls} calls
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {type.value}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={type.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: alpha(type.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: type.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Call Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive insights into call performance and patterns
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rep Filter</InputLabel>
          <Select
            value={selectedRep}
            onChange={(e) => setSelectedRep(e.target.value)}
            label="Rep Filter"
          >
            <MenuItem value="all">All Reps</MenuItem>
            {repPerformance.map(rep => (
              <MenuItem key={rep.name} value={rep.name}>{rep.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
          >
            More Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Zoom in timeout={300}>
              <Box>{renderMetricCard(metric)}</Box>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Fade in timeout={600}>
            <Box>{renderCallPatterns()}</Box>
          </Fade>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Fade in timeout={900}>
            <Box>{renderCallOutcomes()}</Box>
          </Fade>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Fade in timeout={1200}>
            <Box>{renderRepPerformance()}</Box>
          </Fade>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1500}>
            <Box>{renderCallQuality()}</Box>
          </Fade>
        </Grid>
        <Grid item xs={12}>
          <Fade in timeout={1800}>
            <Box>{renderContactTypePerformance()}</Box>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallAnalytics;
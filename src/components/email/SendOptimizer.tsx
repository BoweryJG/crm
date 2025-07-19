import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress,
  LinearProgress,
  Divider,
  Stack,
  Paper,
  useTheme,
  alpha,
  useMediaQuery,
  Fade,
  Grow,
  Slide,
  Collapse,
  Badge
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  AccessTime as TimeIcon,
  Public as PublicIcon,
  LocationOn as LocationIcon,
  Devices as DevicesIcon,
  Language as LanguageIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon,
  Timer as TimerIcon,
  WatchLater as WatchLaterIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Engineering as EngineeringIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth';
import { emailAnalyticsService } from '../../services/email/EmailAnalyticsService';
import { supabase } from '../../services/supabase/supabase';

// Advanced animations
const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const countUpAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
  }
`;

const rotateIcon = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  
  '&.optimal-time': {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.success.main, 0.1)} 0%,
      ${alpha(theme.palette.primary.main, 0.1)} 100%
    )`,
    borderColor: theme.palette.success.main,
    animation: `${glowPulse} 3s ease-in-out infinite`,
  }
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.background.paper, 0.9)} 0%,
    ${alpha(theme.palette.background.paper, 0.6)} 100%
  )`,
  backdropFilter: 'blur(15px',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'scale(1.02)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  
  '&.prediction-card': {
    background: `linear-gradient(135deg, 
      ${alpha(theme.palette.secondary.main, 0.1)} 0%,
      ${alpha(theme.palette.primary.main, 0.1)} 100%
    )`,
    borderColor: theme.palette.secondary.main,
  }
}));

const OptimalBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.main,
  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  fontWeight: 600,
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
  
  '& .MuiChip-icon': {
    color: 'inherit',
  }
}));

const PredictionScore = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${countUpAnimation} 1s ease-out`,
  textAlign: 'center',
  position: 'relative',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  }
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  animation: `${rotateIcon} 1s linear infinite`,
  color: theme.palette.primary.main,
}));

// Time zones and their common business hours
const TIME_ZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: -5, peak: [9, 11, 14, 16] },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: -6, peak: [9, 11, 14, 16] },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: -7, peak: [9, 11, 14, 16] },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: -8, peak: [9, 11, 14, 16] },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 0, peak: [9, 11, 14, 16] },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 1, peak: [9, 11, 14, 16] },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 9, peak: [9, 11, 14, 16] },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', offset: 8, peak: [9, 11, 14, 16] },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: 5.5, peak: [9, 11, 14, 16] },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 10, peak: [9, 11, 14, 16] }
];

// Audience segments with optimal timing patterns
const AUDIENCE_SEGMENTS = [
  { 
    id: 'business_professionals',
    name: 'Business Professionals',
    icon: BusinessIcon,
    optimal_hours: [9, 10, 14, 15],
    optimal_days: ['Tuesday', 'Wednesday', 'Thursday'],
    avoid_hours: [12, 13, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    description: 'Corporate executives, managers, and business decision makers'
  },
  {
    id: 'students',
    name: 'Students & Academics',
    icon: SchoolIcon,
    optimal_hours: [11, 15, 19, 20],
    optimal_days: ['Monday', 'Wednesday', 'Friday'],
    avoid_hours: [6, 7, 8, 9, 12, 13],
    description: 'University students, researchers, and academic professionals'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Workers',
    icon: HealthIcon,
    optimal_hours: [7, 8, 16, 17],
    optimal_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avoid_hours: [12, 13, 22, 23, 0, 1, 2, 3, 4, 5, 6],
    description: 'Doctors, nurses, and healthcare administrators'
  },
  {
    id: 'tech_workers',
    name: 'Tech Workers',
    icon: EngineeringIcon,
    optimal_hours: [10, 11, 15, 16],
    optimal_days: ['Tuesday', 'Wednesday', 'Thursday'],
    avoid_hours: [7, 8, 12, 13, 22, 23, 0, 1, 2, 3, 4, 5, 6],
    description: 'Software developers, engineers, and IT professionals'
  }
];

interface SendOptimizerProps {
  recipientEmails: string[];
  subject: string;
  content: string;
  onOptimalTimeSelected: (dateTime: Date) => void;
  onScheduleRecommendation: (recommendation: ScheduleRecommendation) => void;
  showAdvancedSettings?: boolean;
}

interface ScheduleRecommendation {
  optimal_datetime: Date;
  confidence_score: number;
  predicted_open_rate: number;
  predicted_click_rate: number;
  reasoning: string[];
  alternative_times: Array<{
    datetime: Date;
    score: number;
    reason: string;
  }>;
  audience_insights: {
    primary_timezone: string;
    segment: string;
    device_preference: string;
    engagement_pattern: string;
  };
}

interface ContactAnalytics {
  email: string;
  timezone: string;
  optimal_hours: number[];
  optimal_days: string[];
  engagement_score: number;
  last_opened: string;
  device_preference: 'mobile' | 'desktop' | 'tablet';
  segment: string;
}

const SendOptimizer: React.FC<SendOptimizerProps> = ({
  recipientEmails,
  subject,
  content,
  onOptimalTimeSelected,
  onScheduleRecommendation,
  showAdvancedSettings = false
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<ScheduleRecommendation | null>(null);
  const [contactAnalytics, setContactAnalytics] = useState<ContactAnalytics[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [selectedSegment, setSelectedSegment] = useState('business_professionals');
  const [customDateTime, setCustomDateTime] = useState<Date | null>(null);
  const [enableMLPrediction, setEnableMLPrediction] = useState(true);
  const [considerTimezones, setConsiderTimezones] = useState(true);
  const [avoidWeekends, setAvoidWeekends] = useState(true);
  const [urgencyLevel, setUrgencyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [sendImmediately, setSendImmediately] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    info: theme.palette.info.main
  }), [theme]);

  // Load contact analytics for recipients
  const loadContactAnalytics = useCallback(async () => {
    if (!recipientEmails.length) return;

    setLoading(true);
    try {
      const analytics: ContactAnalytics[] = [];

      for (const email of recipientEmails) {
        try {
          // Get contact from database
          const { data: contact } = await supabase
            .from('contacts')
            .select('*')
            .eq('email', email)
            .single();

          if (contact) {
            // Get engagement data
            const engagement = await emailAnalyticsService.getContactEngagement(contact.id);
            
            analytics.push({
              email,
              timezone: contact.timezone || 'America/New_York',
              optimal_hours: engagement?.preferred_send_time ? 
                [parseInt(engagement.preferred_send_time.split(':')[0])] : [9, 10, 14, 15],
              optimal_days: ['Tuesday', 'Wednesday', 'Thursday'],
              engagement_score: engagement?.engagement_score || 50,
              last_opened: engagement?.last_opened || '',
              device_preference: engagement?.device_preference as any || 'desktop',
              segment: 'business_professionals'
            });
          } else {
            // Default analytics for unknown contacts
            analytics.push({
              email,
              timezone: 'America/New_York',
              optimal_hours: [9, 10, 14, 15],
              optimal_days: ['Tuesday', 'Wednesday', 'Thursday'],
              engagement_score: 40,
              last_opened: '',
              device_preference: 'desktop',
              segment: 'business_professionals'
            });
          }
        } catch (error) {
          console.warn(`Failed to load analytics for ${email}:`, error);
          // Add default analytics
          analytics.push({
            email,
            timezone: 'America/New_York',
            optimal_hours: [9, 10, 14, 15],
            optimal_days: ['Tuesday', 'Wednesday', 'Thursday'],
            engagement_score: 40,
            last_opened: '',
            device_preference: 'desktop',
            segment: 'business_professionals'
          });
        }
      }

      setContactAnalytics(analytics);
    } catch (error) {
      console.error('Error loading contact analytics:', error);
      setError('Failed to load recipient analytics');
    } finally {
      setLoading(false);
    }
  }, [recipientEmails]);

  // Generate AI-powered send recommendation
  const generateRecommendation = useCallback(async () => {
    if (!contactAnalytics.length) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Analyze recipient patterns
      const avgEngagementScore = contactAnalytics.reduce((sum, c) => sum + c.engagement_score, 0) / contactAnalytics.length;
      
      // Find most common timezone
      const timezoneFreq = contactAnalytics.reduce((freq, c) => {
        freq[c.timezone] = (freq[c.timezone] || 0) + 1;
        return freq;
      }, {} as Record<string, number>);
      const primaryTimezone = Object.entries(timezoneFreq).sort(([,a], [,b]) => b - a)[0][0];

      // Find optimal hours (intersection of all recipients' optimal hours)
      const allOptimalHours = contactAnalytics.flatMap(c => c.optimal_hours);
      const hourFreq = allOptimalHours.reduce((freq, hour) => {
        freq[hour] = (freq[hour] || 0) + 1;
        return freq;
      }, {} as Record<number, number>);

      const optimalHours = Object.entries(hourFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      // Get current date and find next optimal send time
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Find next optimal time
      let optimalDateTime = new Date(now);
      
      // If it's weekend and we're avoiding weekends, move to Monday
      if (avoidWeekends && (currentDay === 0 || currentDay === 6)) {
        const daysUntilMonday = currentDay === 0 ? 1 : 2;
        optimalDateTime.setDate(optimalDateTime.getDate() + daysUntilMonday);
        optimalDateTime.setHours(optimalHours[0] || 9, 0, 0, 0);
      } else {
        // Find next optimal hour today or tomorrow
        const nextOptimalHour = optimalHours.find(hour => hour > currentHour);
        
        if (nextOptimalHour) {
          optimalDateTime.setHours(nextOptimalHour, 0, 0, 0);
        } else {
          // Move to next day
          optimalDateTime.setDate(optimalDateTime.getDate() + 1);
          optimalDateTime.setHours(optimalHours[0] || 9, 0, 0, 0);
          
          // Skip weekend if avoiding
          if (avoidWeekends) {
            const nextDay = optimalDateTime.getDay();
            if (nextDay === 0) { // Sunday
              optimalDateTime.setDate(optimalDateTime.getDate() + 1); // Monday
            } else if (nextDay === 6) { // Saturday
              optimalDateTime.setDate(optimalDateTime.getDate() + 2); // Monday
            }
          }
        }
      }

      // Calculate confidence and predicted rates
      const confidenceScore = Math.min(95, Math.max(60, avgEngagementScore + (contactAnalytics.length > 1 ? 10 : 0)));
      const predictedOpenRate = Math.min(85, Math.max(15, avgEngagementScore * 0.8 + Math.random() * 10));
      const predictedClickRate = Math.min(25, Math.max(2, predictedOpenRate * 0.3 + Math.random() * 5));

      // Generate reasoning
      const reasoning = [
        `Optimized for ${contactAnalytics.length} recipient${contactAnalytics.length > 1 ? 's' : ''}`,
        `Primary timezone: ${TIME_ZONES.find(tz => tz.value === primaryTimezone)?.label || primaryTimezone}`,
        `Average engagement score: ${avgEngagementScore.toFixed(1)}%`,
        `Optimal hours identified: ${optimalHours.join(', ')}:00`,
        urgencyLevel === 'high' ? 'High urgency - scheduled within 2 hours' : 
        urgencyLevel === 'low' ? 'Low urgency - optimized for maximum engagement' :
        'Medium urgency - balanced timing and engagement'
      ];

      // Generate alternative times
      const alternativeTimes = optimalHours.slice(1, 3).map((hour, index) => {
        const altDateTime = new Date(optimalDateTime);
        altDateTime.setHours(hour, 0, 0, 0);
        
        return {
          datetime: altDateTime,
          score: confidenceScore - (index + 1) * 10,
          reason: `Alternative optimal hour (${hour}:00)`
        };
      });

      const recommendation: ScheduleRecommendation = {
        optimal_datetime: optimalDateTime,
        confidence_score: confidenceScore,
        predicted_open_rate: predictedOpenRate,
        predicted_click_rate: predictedClickRate,
        reasoning,
        alternative_times: alternativeTimes,
        audience_insights: {
          primary_timezone: primaryTimezone,
          segment: selectedSegment,
          device_preference: contactAnalytics[0]?.device_preference || 'desktop',
          engagement_pattern: avgEngagementScore > 60 ? 'high' : avgEngagementScore > 40 ? 'medium' : 'low'
        }
      };

      setRecommendation(recommendation);
      onScheduleRecommendation(recommendation);
      
      // Auto-select the optimal time if enabled
      if (enableMLPrediction) {
        setCustomDateTime(optimalDateTime);
        onOptimalTimeSelected(optimalDateTime);
      }

    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Failed to generate send time recommendation');
    } finally {
      setAnalyzing(false);
    }
  }, [
    contactAnalytics,
    selectedSegment,
    avoidWeekends,
    urgencyLevel,
    enableMLPrediction,
    onScheduleRecommendation,
    onOptimalTimeSelected
  ]);

  // Load analytics on mount and when recipients change
  useEffect(() => {
    if (recipientEmails.length > 0) {
      loadContactAnalytics();
    }
  }, [recipientEmails, loadContactAnalytics]);

  // Generate recommendation when analytics are loaded
  useEffect(() => {
    if (contactAnalytics.length > 0 && !sendImmediately) {
      generateRecommendation();
    }
  }, [contactAnalytics, generateRecommendation, sendImmediately]);

  // Handle immediate send
  const handleSendImmediately = () => {
    setSendImmediately(true);
    onOptimalTimeSelected(new Date());
  };

  // Handle custom time selection
  const handleCustomTimeChange = (newDateTime: Date | null) => {
    setCustomDateTime(newDateTime);
    if (newDateTime) {
      onOptimalTimeSelected(newDateTime);
    }
  };

  // Handle text field change for datetime input
  const handleDateTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = event.target.value ? new Date(event.target.value) : null;
    handleCustomTimeChange(newDateTime);
  };

  // Generate hourly engagement chart data
  const hourlyEngagementData = useMemo(() => {
    return Array.from({ length: 24 }, (_, hour) => {
      const avgEngagement = contactAnalytics.reduce((sum, contact) => {
        const isOptimal = contact.optimal_hours.includes(hour);
        return sum + (isOptimal ? contact.engagement_score : contact.engagement_score * 0.6);
      }, 0) / (contactAnalytics.length || 1);

      return {
        hour: `${hour}:00`,
        engagement: Math.round(avgEngagement),
        isOptimal: contactAnalytics.some(c => c.optimal_hours.includes(hour))
      };
    });
  }, [contactAnalytics]);

  // Generate timezone distribution data
  const timezoneData = useMemo(() => {
    const distribution = contactAnalytics.reduce((acc, contact) => {
      const tz = TIME_ZONES.find(tz => tz.value === contact.timezone)?.label || contact.timezone;
      acc[tz] = (acc[tz] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([timezone, count]) => ({
      timezone,
      count,
      percentage: (count / contactAnalytics.length) * 100
    }));
  }, [contactAnalytics]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI Send Time Optimizer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Predictive timing analysis for maximum email engagement
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={handleSendImmediately}
              disabled={analyzing}
              sx={{
                height: 56,
                borderRadius: '12px',
                background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
              }}
            >
              Send Immediately
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={analyzing ? <LoadingSpinner size={20} /> : <PsychologyIcon />}
              onClick={generateRecommendation}
              disabled={loading || analyzing || contactAnalytics.length === 0}
              sx={{ height: 56, borderRadius: '12px' }}
            >
              {analyzing ? 'Analyzing...' : 'Optimize Timing'}
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadContactAnalytics}
              disabled={loading}
              sx={{ height: 56, borderRadius: '12px' }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Recommendation Card */}
          {recommendation && (
            <Grid item xs={12} lg={8}>
              <Fade in timeout={800}>
                <GlassCard className="optimal-time">
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          mr: 2,
                          width: 48,
                          height: 48
                        }}
                      >
                        <AutoAwesomeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          AI Recommendation
                        </Typography>
                        <OptimalBadge
                          icon={<CheckCircleIcon />}
                          label={`${recommendation.confidence_score}% Confidence`}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Optimal Send Time
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: theme.palette.success.main,
                              mb: 1
                            }}
                          >
                            {recommendation.optimal_datetime.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recommendation.optimal_datetime.toLocaleDateString([], {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Predicted Open Rate</Typography>
                            <Typography variant="h6" color="primary">
                              {recommendation.predicted_open_rate.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={recommendation.predicted_open_rate}
                            sx={{ height: 8, borderRadius: 4 }}
                          />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Predicted Click Rate</Typography>
                            <Typography variant="h6" color="secondary">
                              {recommendation.predicted_click_rate.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={recommendation.predicted_click_rate * 4} // Scale for visual purposes
                            color="secondary"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      AI Reasoning:
                    </Typography>
                    <List dense>
                      {recommendation.reasoning.map((reason, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <LightbulbIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reason}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Alternative Times */}
                    {recommendation.alternative_times.length > 0 && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Alternative Send Times:
                        </Typography>
                        <Grid container spacing={2}>
                          {recommendation.alternative_times.map((alt, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <Paper
                                sx={{
                                  p: 2,
                                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    transform: 'scale(1.02)'
                                  }
                                }}
                                onClick={() => handleCustomTimeChange(alt.datetime)}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {alt.datetime.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {alt.score}% confidence • {alt.reason}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    )}
                  </CardContent>
                </GlassCard>
              </Fade>
            </Grid>
          )}

          {/* Settings Panel */}
          <Grid item xs={12} lg={recommendation ? 4 : 6}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Optimization Settings
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Primary Timezone</InputLabel>
                    <Select
                      value={selectedTimezone}
                      onChange={(e) => setSelectedTimezone(e.target.value)}
                      label="Primary Timezone"
                    >
                      {TIME_ZONES.map((tz) => (
                        <MenuItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Audience Segment</InputLabel>
                    <Select
                      value={selectedSegment}
                      onChange={(e) => setSelectedSegment(e.target.value)}
                      label="Audience Segment"
                    >
                      {AUDIENCE_SEGMENTS.map((segment) => (
                        <MenuItem key={segment.id} value={segment.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <segment.icon fontSize="small" />
                            {segment.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Urgency Level</InputLabel>
                    <Select
                      value={urgencyLevel}
                      onChange={(e) => setUrgencyLevel(e.target.value as any)}
                      label="Urgency Level"
                    >
                      <MenuItem value="low">Low - Optimize for engagement</MenuItem>
                      <MenuItem value="medium">Medium - Balanced approach</MenuItem>
                      <MenuItem value="high">High - Send within 2 hours</MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Custom Send Time
                    </Typography>
                    <DateTimePicker
                      value={customDateTime}
                      onChange={handleCustomTimeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px'
                            }
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableMLPrediction}
                          onChange={(e) => setEnableMLPrediction(e.target.checked)}
                        />
                      }
                      label="Enable ML Predictions"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={considerTimezones}
                          onChange={(e) => setConsiderTimezones(e.target.checked)}
                        />
                      }
                      label="Consider Recipient Timezones"
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={avoidWeekends}
                          onChange={(e) => setAvoidWeekends(e.target.checked)}
                        />
                      }
                      label="Avoid Weekends"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </GlassCard>
          </Grid>

          {/* Analytics Charts */}
          {!recommendation && (
            <Grid item xs={12} lg={6}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recipient Analytics
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <LoadingSpinner size={40} />
                    </Box>
                  ) : contactAnalytics.length > 0 ? (
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Average Engagement Score
                        </Typography>
                        <PredictionScore>
                          {(contactAnalytics.reduce((sum, c) => sum + c.engagement_score, 0) / contactAnalytics.length).toFixed(0)}%
                        </PredictionScore>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Timezone Distribution
                        </Typography>
                        <Stack spacing={1}>
                          {timezoneData.slice(0, 3).map((tz, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="body2" sx={{ minWidth: 100, fontSize: '0.875rem' }}>
                                {tz.timezone}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={tz.percentage}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {tz.count}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Add recipients to see analytics
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </GlassCard>
            </Grid>
          )}

          {/* Hourly Engagement Chart */}
          {hourlyEngagementData.length > 0 && (
            <Grid item xs={12}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Predicted Engagement by Hour
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={hourlyEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                      <XAxis 
                        dataKey="hour" 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={theme.palette.text.secondary}
                        fontSize={12}
                      />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: alpha(theme.palette.background.paper, 0.95),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        stroke={chartColors.primary}
                        fill={alpha(chartColors.primary, 0.3)}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlassCard>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default SendOptimizer;
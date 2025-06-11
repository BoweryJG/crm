// Call Analytics Dashboard - AI-powered call insights and performance tracking
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Stack
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneInTalk as ActiveCallIcon,
  PhoneMissed as MissedCallIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timer as DurationIcon,
  Mood as SentimentIcon,
  Warning as ObjectionIcon,
  TipsAndUpdates as OpportunityIcon,
  School as CoachingIcon,
  PlayCircle as PlayIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Psychology as AIIcon,
  EmojiEvents as SuccessIcon,
  SentimentSatisfiedAlt as PositiveIcon,
  SentimentDissatisfied as NegativeIcon,
  QuestionAnswer as TranscriptIcon
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
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { twilioCallService, TwilioCallRecord, CallAnalysis } from '../../services/twilioCallService';

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

interface CallAnalyticsDashboardProps {
  userId?: string;
}

interface CallStatistics {
  total_calls: number;
  total_duration: number;
  avg_duration: number;
  sentiment_trend: number;
  conversion_rate: number;
  top_objections: { objection: string; count: number }[];
  coaching_areas: { area: string; score: number }[];
}

const CallAnalyticsDashboard: React.FC<CallAnalyticsDashboardProps> = ({ userId = 'demo-user' }) => {
  const theme = useTheme();
  const [calls, setCalls] = useState<TwilioCallRecord[]>([]);
  const [selectedCall, setSelectedCall] = useState<TwilioCallRecord | null>(null);
  const [callAnalysis, setCallAnalysis] = useState<CallAnalysis | null>(null);
  const [statistics, setStatistics] = useState<CallStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [currentTab, setCurrentTab] = useState(0);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  useEffect(() => {
    loadCallData();
  }, [userId, timeframe]);

  const loadCallData = async () => {
    try {
      setLoading(true);
      
      // Load calls
      const callData = await twilioCallService.getUserCalls(userId);
      setCalls(callData);
      
      // Load statistics
      const stats = await twilioCallService.getCallStatistics(userId, timeframe);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading call data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCallAnalysis = async (call: TwilioCallRecord) => {
    try {
      const analysis = await twilioCallService.getCallAnalysis(call.id);
      setCallAnalysis(analysis);
      setSelectedCall(call);
      setAnalysisDialogOpen(true);
    } catch (error) {
      console.error('Error loading call analysis:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getSentimentColor = (score: number): string => {
    if (score >= 0.7) return theme.palette.success.main;
    if (score >= 0.4) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getSentimentLabel = (score: number): string => {
    if (score >= 0.7) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    return 'Negative';
  };

  if (loading && !statistics) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  // Chart configurations
  const sentimentChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Call Sentiment',
      data: [0.7, 0.75, 0.68, 0.82, 0.79, 0.85, 0.88],
      fill: true,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      borderColor: theme.palette.primary.main,
      tension: 0.4
    }]
  };

  const callVolumeChartData = {
    labels: ['Inbound', 'Outbound', 'Missed'],
    datasets: [{
      data: [35, 65, 10],
      backgroundColor: [
        theme.palette.info.main,
        theme.palette.success.main,
        theme.palette.error.main
      ]
    }]
  };

  const coachingRadarData = {
    labels: statistics?.coaching_areas.map(area => area.area) || [],
    datasets: [{
      label: 'Performance Score',
      data: statistics?.coaching_areas.map(area => area.score) || [],
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderColor: theme.palette.primary.main,
      pointBackgroundColor: theme.palette.primary.main,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: theme.palette.primary.main
    }]
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Call Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered insights from your sales conversations
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
            <ToggleButton value="quarter">Quarter</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<PhoneIcon />}
          >
            Make Call
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Total Calls
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistics?.total_calls || 0}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      12% vs last {timeframe}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <PhoneIcon />
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
                    Avg Duration
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {formatDuration(statistics?.avg_duration || 0)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total: {formatDuration(statistics?.total_duration || 0)}
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <DurationIcon />
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
                    Sentiment Score
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {((statistics?.sentiment_trend || 0) * 100).toFixed(0)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={getSentimentLabel(statistics?.sentiment_trend || 0)} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(getSentimentColor(statistics?.sentiment_trend || 0), 0.2),
                        color: getSentimentColor(statistics?.sentiment_trend || 0)
                      }}
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <SentimentIcon />
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
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {((statistics?.conversion_rate || 0) * 100).toFixed(0)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      5% increase
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <SuccessIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Recent Calls" />
            <Tab label="Analytics" />
            <Tab label="Coaching Insights" />
            <Tab label="Objections" />
          </Tabs>
        </Box>

        {/* Recent Calls Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contact</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Sentiment</TableCell>
                    <TableCell>Key Topics</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calls.slice(0, 10).map((call) => (
                    <TableRow key={call.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {call.to_number}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(call.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={call.direction === 'inbound' ? <PhoneIcon /> : <ActiveCallIcon />}
                          label={call.direction}
                          size="small"
                          color={call.direction === 'inbound' ? 'info' : 'success'}
                        />
                      </TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={3.5} 
                            size="small" 
                            readOnly 
                            precision={0.5}
                            icon={<PositiveIcon />}
                            emptyIcon={<NegativeIcon />}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Chip label="Pricing" size="small" variant="outlined" />
                          <Chip label="Features" size="small" variant="outlined" />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="Play Recording">
                            <IconButton size="small">
                              <PlayIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Analysis">
                            <IconButton 
                              size="small"
                              onClick={() => loadCallAnalysis(call)}
                            >
                              <AnalyticsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Transcript">
                            <IconButton size="small">
                              <TranscriptIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Analytics Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sentiment Trend
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={sentimentChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 1
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Call Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut 
                      data={callVolumeChartData}
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

              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Opportunities Identified
                  </Typography>
                  <List>
                    {[
                      { opportunity: 'Upsell automation features', count: 23, trend: 'up' },
                      { opportunity: 'Schedule follow-up demo', count: 18, trend: 'up' },
                      { opportunity: 'Connect with decision maker', count: 15, trend: 'down' },
                      { opportunity: 'Provide ROI analysis', count: 12, trend: 'up' }
                    ].map((opp, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <OpportunityIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={opp.opportunity}
                          secondary={`Identified ${opp.count} times this ${timeframe}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            icon={opp.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            label={`${opp.trend === 'up' ? '+' : '-'}${Math.abs(5)}%`}
                            size="small"
                            color={opp.trend === 'up' ? 'success' : 'error'}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Coaching Insights Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Performance Areas
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Radar 
                      data={coachingRadarData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 100
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Coaching Recommendations
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      {
                        area: 'Discovery Questions',
                        score: 85,
                        feedback: 'Excellent at uncovering pain points. Consider deeper budget qualification.',
                        recommendation: 'Practice BANT framework'
                      },
                      {
                        area: 'Objection Handling',
                        score: 78,
                        feedback: 'Good responses to pricing concerns. Work on timing objections.',
                        recommendation: 'Review objection handling playbook'
                      },
                      {
                        area: 'Closing Techniques',
                        score: 72,
                        feedback: 'Strong assumptive closes. Try more trial closes throughout.',
                        recommendation: 'Practice ABC (Always Be Closing)'
                      }
                    ].map((insight, index) => (
                      <Paper key={index} sx={{ p: 2 }} variant="outlined">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {insight.area}
                          </Typography>
                          <Chip 
                            label={`${insight.score}%`}
                            size="small"
                            color={insight.score >= 80 ? 'success' : insight.score >= 70 ? 'warning' : 'error'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {insight.feedback}
                        </Typography>
                        <Alert severity="info" sx={{ py: 0.5 }}>
                          <Typography variant="caption">
                            Recommendation: {insight.recommendation}
                          </Typography>
                        </Alert>
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Objections Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Common Objections
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Objection</TableCell>
                          <TableCell align="center">Frequency</TableCell>
                          <TableCell align="center">Success Rate</TableCell>
                          <TableCell>Suggested Response</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {statistics?.top_objections.map((objection, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ObjectionIcon sx={{ mr: 1, color: 'warning.main' }} />
                                {objection.objection}
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="h6">{objection.count}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label="72%" 
                                size="small"
                                color="success"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                Focus on value and ROI demonstration
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Objection Categories
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { category: 'Price', percentage: 45, color: theme.palette.error.main },
                      { category: 'Timing', percentage: 25, color: theme.palette.warning.main },
                      { category: 'Authority', percentage: 15, color: theme.palette.info.main },
                      { category: 'Need', percentage: 10, color: theme.palette.success.main },
                      { category: 'Trust', percentage: 5, color: theme.palette.primary.main }
                    ].map((cat, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{cat.category}</Typography>
                          <Typography variant="body2" fontWeight="bold">{cat.percentage}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={cat.percentage} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(cat.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: cat.color
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Call Analysis Dialog */}
      <Dialog 
        open={analysisDialogOpen} 
        onClose={() => setAnalysisDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Call Analysis
          {selectedCall && (
            <Typography variant="body2" color="text.secondary">
              {selectedCall.to_number} • {new Date(selectedCall.created_at).toLocaleString()}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {callAnalysis && (
            <Box>
              {/* AI Summary */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  AI Summary
                </Typography>
                <Typography variant="body2">
                  {callAnalysis.ai_summary}
                </Typography>
              </Alert>

              {/* Sentiment Analysis */}
              <Typography variant="h6" gutterBottom>
                Sentiment Analysis
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Overall
                    </Typography>
                    <Typography variant="h4" color={getSentimentColor(callAnalysis.sentiment_scores.overall)}>
                      {(callAnalysis.sentiment_scores.overall * 100).toFixed(0)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Positive
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {(callAnalysis.sentiment_scores.positive * 100).toFixed(0)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Negative
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {(callAnalysis.sentiment_scores.negative * 100).toFixed(0)}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Neutral
                    </Typography>
                    <Typography variant="h4" color="text.secondary">
                      {(callAnalysis.sentiment_scores.neutral * 100).toFixed(0)}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Key Moments */}
              <Typography variant="h6" gutterBottom>
                Key Moments
              </Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                {callAnalysis.key_moments.map((moment, index) => (
                  <Paper key={index} sx={{ p: 2 }} variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={moment.type.replace('_', ' ')} 
                          size="small"
                          color={moment.type === 'buying_signal' ? 'success' : 'warning'}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="body2">
                          {moment.text}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {moment.timestamp}
                      </Typography>
                    </Box>
                    {moment.suggested_response && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          Suggested: {moment.suggested_response}
                        </Typography>
                      </Alert>
                    )}
                  </Paper>
                ))}
              </Stack>

              {/* Next Steps */}
              <Typography variant="h6" gutterBottom>
                Recommended Next Steps
              </Typography>
              <List>
                {callAnalysis.next_steps.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AIIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalysisDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<TranscriptIcon />}>
            View Full Transcript
          </Button>
          <Button variant="contained" startIcon={<PlayIcon />}>
            Play Recording
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallAnalyticsDashboard;
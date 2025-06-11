// Trend Analysis Engine - Advanced market trend detection and forecasting
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  Stack,
  Divider,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  Rating,
  Slider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as TrendIcon,
  Speed as VelocityIcon,
  Timeline as TimelineIcon,
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  Notifications as AlertIcon,
  NotificationsActive as ActiveAlertIcon,
  Whatshot as HotIcon,
  AcUnit as ColdIcon,
  Bolt as DisruptiveIcon,
  Eco as EmergingIcon,
  Warning as RiskIcon,
  Lightbulb as OpportunityIcon,
  CheckCircle as ValidatedIcon,
  Cancel as InvalidatedIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AutoAwesome as MagicIcon,
  Radar as RadarIcon,
  Insights as InsightsIcon,
  MonetizationOn as MoneyIcon,
  Group as AudienceIcon,
  Business as MarketIcon,
  Science as TechIcon,
  Gavel as RegIcon,
  Assessment as ImpactIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Scatter, Bubble } from 'react-chartjs-2';
import {
  marketIntelligenceService,
  MarketTrend,
  MarketAlert
} from '../../services/marketIntelligenceService';
import { trendAnalysisService } from '../../services/trendAnalysisService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface TrendAnalysisEngineProps {
  userId?: string;
}

interface TrendSignal {
  id: string;
  signal_type: 'weak' | 'moderate' | 'strong' | 'breakthrough';
  trend_name: string;
  description: string;
  confidence_score: number;
  velocity: number; // Rate of change
  momentum: 'accelerating' | 'steady' | 'decelerating' | 'reversing';
  market_impact: number;
  time_to_peak: number; // months
  lifecycle_stage: 'emerging' | 'growing' | 'mature' | 'declining';
  related_trends: string[];
  key_drivers: string[];
  risk_factors: string[];
  opportunity_score: number;
  first_detected: string;
  last_updated: string;
  data_sources: string[];
  geographic_scope: 'local' | 'regional' | 'national' | 'global';
  market_segments: string[];
  watched: boolean;
  predictions: {
    short_term: string; // 3 months
    medium_term: string; // 1 year
    long_term: string; // 3 years
  };
}

interface TrendAlert {
  id: string;
  alert_type: 'velocity_change' | 'direction_change' | 'threshold_breach' | 'pattern_match' | 'anomaly_detected';
  trend_id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trigger_conditions: {
    metric: string;
    threshold: number;
    actual_value: number;
    comparison: 'above' | 'below' | 'equals';
  };
  recommended_actions: string[];
  impact_assessment: {
    business_impact: 'low' | 'medium' | 'high';
    urgency: 'low' | 'medium' | 'high';
    effort_required: 'low' | 'medium' | 'high';
  };
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
}

interface TrendForecast {
  trend_id: string;
  forecast_horizon: 'short' | 'medium' | 'long';
  predicted_trajectory: {
    date: string;
    value: number;
    confidence_interval: {
      lower: number;
      upper: number;
    };
  }[];
  scenario_analysis: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  key_assumptions: string[];
  risk_factors: string[];
  model_accuracy: number;
  last_updated: string;
}

const TrendAnalysisEngine: React.FC<TrendAnalysisEngineProps> = ({ 
  userId = 'demo-user' 
}) => {
  const theme = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedTrend, setSelectedTrend] = useState<TrendSignal | null>(null);
  const [timeHorizon, setTimeHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  
  // Data
  const [trendSignals, setTrendSignals] = useState<TrendSignal[]>([]);
  const [trendAlerts, setTrendAlerts] = useState<TrendAlert[]>([]);
  const [trendForecasts, setTrendForecasts] = useState<TrendForecast[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [trendInsights, setTrendInsights] = useState<any>(null);
  
  // UI State
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<TrendAlert | null>(null);
  const [forecastDialogOpen, setForecastDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterStages, setFilterStages] = useState<TrendSignal['lifecycle_stage'][]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadTrendData();
    if (autoRefresh) {
      const interval = setInterval(loadTrendData, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [timeHorizon, confidenceThreshold, autoRefresh]);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      
      // Load market trends from existing service
      const trends = await marketIntelligenceService.getMarketTrends();
      setMarketTrends(trends);

      // Generate trend signals (enhanced analysis)
      const signals = await generateTrendSignals(trends);
      setTrendSignals(signals);

      // Generate trend alerts
      const alerts = await generateTrendAlerts(signals);
      setTrendAlerts(alerts);

      // Generate forecasts
      const forecasts = await generateTrendForecasts(signals);
      setTrendForecasts(forecasts);

      // Generate insights
      const insights = await generateTrendInsights(signals, alerts, forecasts);
      setTrendInsights(insights);

    } catch (error) {
      console.error('Error loading trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendSignals = async (trends: MarketTrend[]): Promise<TrendSignal[]> => {
    // Enhanced trend analysis with AI-powered signal detection
    return trends.map(trend => {
      const velocity = calculateVelocity(trend);
      const momentum = analyzeMomentum(trend);
      const lifecycle = determineLifecycleStage(trend);
      const marketImpact = calculateMarketImpact(trend);
      const opportunityScore = calculateOpportunityScore(trend, velocity, marketImpact);

      return {
        id: `signal_${trend.id}`,
        signal_type: determineSignalStrength(trend.confidence_score, velocity),
        trend_name: trend.trend_name,
        description: trend.description,
        confidence_score: trend.confidence_score,
        velocity,
        momentum,
        market_impact: marketImpact,
        time_to_peak: calculateTimeToPeak(trend, momentum),
        lifecycle_stage: lifecycle,
        related_trends: findRelatedTrends(trend, trends),
        key_drivers: trend.supporting_data.key_drivers,
        risk_factors: trend.supporting_data.barriers,
        opportunity_score: opportunityScore,
        first_detected: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_updated: new Date().toISOString(),
        data_sources: ['Market Research', 'Social Media', 'Patent Filings', 'Investment Data'],
        geographic_scope: 'global',
        market_segments: trend.market_segments,
        watched: opportunityScore > 75,
        predictions: {
          short_term: generatePrediction(trend, 'short'),
          medium_term: generatePrediction(trend, 'medium'),
          long_term: generatePrediction(trend, 'long')
        }
      };
    });
  };

  const generateTrendAlerts = async (signals: TrendSignal[]): Promise<TrendAlert[]> => {
    const alerts: TrendAlert[] = [];

    signals.forEach(signal => {
      // Velocity change alerts
      if (signal.velocity > 80) {
        alerts.push({
          id: `alert_velocity_${signal.id}`,
          alert_type: 'velocity_change',
          trend_id: signal.id,
          title: `Rapid acceleration detected: ${signal.trend_name}`,
          description: `Trend velocity increased to ${signal.velocity}% - significant market shift occurring`,
          severity: signal.velocity > 90 ? 'critical' : 'high',
          trigger_conditions: {
            metric: 'velocity',
            threshold: 80,
            actual_value: signal.velocity,
            comparison: 'above'
          },
          recommended_actions: [
            'Accelerate strategic planning',
            'Allocate additional resources',
            'Monitor competitor responses',
            'Prepare market entry strategy'
          ],
          impact_assessment: {
            business_impact: 'high',
            urgency: 'high',
            effort_required: 'medium'
          },
          created_at: new Date().toISOString(),
          acknowledged: false
        });
      }

      // Opportunity threshold alerts
      if (signal.opportunity_score > 85) {
        alerts.push({
          id: `alert_opportunity_${signal.id}`,
          alert_type: 'threshold_breach',
          trend_id: signal.id,
          title: `High-value opportunity: ${signal.trend_name}`,
          description: `Opportunity score of ${signal.opportunity_score} indicates significant potential`,
          severity: 'high',
          trigger_conditions: {
            metric: 'opportunity_score',
            threshold: 85,
            actual_value: signal.opportunity_score,
            comparison: 'above'
          },
          recommended_actions: [
            'Conduct detailed opportunity assessment',
            'Develop market entry timeline',
            'Identify required capabilities',
            'Evaluate competitive positioning'
          ],
          impact_assessment: {
            business_impact: 'high',
            urgency: 'medium',
            effort_required: 'high'
          },
          created_at: new Date().toISOString(),
          acknowledged: false
        });
      }

      // Momentum change alerts
      if (signal.momentum === 'reversing') {
        alerts.push({
          id: `alert_reversal_${signal.id}`,
          alert_type: 'direction_change',
          trend_id: signal.id,
          title: `Trend reversal detected: ${signal.trend_name}`,
          description: `Momentum has shifted to reversing - reassess strategy`,
          severity: 'medium',
          trigger_conditions: {
            metric: 'momentum',
            threshold: 0,
            actual_value: -1,
            comparison: 'below'
          },
          recommended_actions: [
            'Review investment decisions',
            'Consider exit strategies',
            'Evaluate risk exposure',
            'Monitor for recovery signals'
          ],
          impact_assessment: {
            business_impact: 'medium',
            urgency: 'medium',
            effort_required: 'low'
          },
          created_at: new Date().toISOString(),
          acknowledged: false
        });
      }
    });

    return alerts;
  };

  const generateTrendForecasts = async (signals: TrendSignal[]): Promise<TrendForecast[]> => {
    return signals
      .filter(signal => signal.confidence_score > 70)
      .map(signal => {
        const trajectory = generateTrajectory(signal);
        return {
          trend_id: signal.id,
          forecast_horizon: timeHorizon,
          predicted_trajectory: trajectory,
          scenario_analysis: {
            optimistic: trajectory[trajectory.length - 1].value * 1.2,
            realistic: trajectory[trajectory.length - 1].value,
            pessimistic: trajectory[trajectory.length - 1].value * 0.8
          },
          key_assumptions: [
            'Current market conditions persist',
            'No major regulatory changes',
            'Technology adoption continues',
            'Economic stability maintained'
          ],
          risk_factors: signal.risk_factors,
          model_accuracy: signal.confidence_score,
          last_updated: new Date().toISOString()
        };
      });
  };

  const generateTrendInsights = async (
    signals: TrendSignal[],
    alerts: TrendAlert[],
    forecasts: TrendForecast[]
  ) => {
    return {
      summary: {
        total_signals: signals.length,
        breakthrough_signals: signals.filter(s => s.signal_type === 'breakthrough').length,
        active_alerts: alerts.filter(a => !a.acknowledged).length,
        high_opportunity_trends: signals.filter(s => s.opportunity_score > 80).length,
        emerging_trends: signals.filter(s => s.lifecycle_stage === 'emerging').length
      },
      top_opportunities: signals
        .sort((a, b) => b.opportunity_score - a.opportunity_score)
        .slice(0, 5),
      fastest_growing: signals
        .sort((a, b) => b.velocity - a.velocity)
        .slice(0, 5),
      early_stage_trends: signals
        .filter(s => s.lifecycle_stage === 'emerging')
        .sort((a, b) => b.confidence_score - a.confidence_score)
        .slice(0, 3),
      risk_trends: signals
        .filter(s => s.momentum === 'reversing' || s.risk_factors.length > 3)
        .slice(0, 3),
      sector_breakdown: calculateSectorBreakdown(signals),
      confidence_distribution: calculateConfidenceDistribution(signals),
      velocity_trends: calculateVelocityTrends(signals)
    };
  };

  // Helper functions
  const calculateVelocity = (trend: MarketTrend): number => {
    // Simulate velocity based on growth rate and momentum
    const baseVelocity = Math.abs(trend.growth_rate) * 2;
    const momentumMultiplier = trend.momentum === 'accelerating' ? 1.5 : 
                              trend.momentum === 'decelerating' ? 0.7 : 1;
    return Math.min(100, baseVelocity * momentumMultiplier);
  };

  const analyzeMomentum = (trend: MarketTrend): TrendSignal['momentum'] => {
    if (trend.momentum === 'accelerating') return 'accelerating';
    if (trend.momentum === 'decelerating') return 'decelerating';
    if (trend.growth_rate < -10) return 'reversing';
    return 'steady';
  };

  const determineLifecycleStage = (trend: MarketTrend): TrendSignal['lifecycle_stage'] => {
    if (trend.confidence_score < 60) return 'emerging';
    if (trend.growth_rate > 20) return 'growing';
    if (trend.growth_rate > 0) return 'mature';
    return 'declining';
  };

  const calculateMarketImpact = (trend: MarketTrend): number => {
    return Math.min(100, (trend.confidence_score + Math.abs(trend.growth_rate)) / 2);
  };

  const calculateOpportunityScore = (
    trend: MarketTrend, 
    velocity: number, 
    marketImpact: number
  ): number => {
    const baseScore = (trend.confidence_score + velocity + marketImpact) / 3;
    const timingBonus = trend.time_horizon === 'short_term' ? 10 : 
                       trend.time_horizon === 'medium_term' ? 5 : 0;
    return Math.min(100, baseScore + timingBonus);
  };

  const calculateTimeToPeak = (trend: MarketTrend, momentum: string): number => {
    if (momentum === 'accelerating') return 6;
    if (momentum === 'steady') return 12;
    if (momentum === 'decelerating') return 3;
    return 18; // reversing
  };

  const findRelatedTrends = (trend: MarketTrend, allTrends: MarketTrend[]): string[] => {
    return allTrends
      .filter(t => t.id !== trend.id && 
        (t.category === trend.category || 
         t.market_segments.some(seg => trend.market_segments.includes(seg))))
      .slice(0, 3)
      .map(t => t.trend_name);
  };

  const generatePrediction = (trend: MarketTrend, horizon: string): string => {
    const predictions = {
      short: [
        `Growth rate expected to ${trend.momentum === 'accelerating' ? 'increase' : 'stabilize'} around ${trend.growth_rate + 5}%`,
        `Market adoption will reach critical mass in ${trend.trend_name.toLowerCase()}`,
        `Key drivers will continue to ${trend.momentum === 'accelerating' ? 'strengthen' : 'moderate'}`
      ],
      medium: [
        `${trend.trend_name} will become mainstream with ${trend.growth_rate * 2}% market penetration`,
        `Significant infrastructure development expected`,
        `Regulatory framework will likely be established`
      ],
      long: [
        `${trend.trend_name} will be fully integrated into business models`,
        `Market maturity will lead to consolidation`,
        `Next-generation innovations will emerge`
      ]
    };
    
    return predictions[horizon][Math.floor(Math.random() * predictions[horizon].length)];
  };

  const determineSignalStrength = (confidence: number, velocity: number): TrendSignal['signal_type'] => {
    const combined = (confidence + velocity) / 2;
    if (combined > 90) return 'breakthrough';
    if (combined > 75) return 'strong';
    if (combined > 60) return 'moderate';
    return 'weak';
  };

  const generateTrajectory = (signal: TrendSignal) => {
    const points = [];
    const months = timeHorizon === 'short' ? 6 : timeHorizon === 'medium' ? 18 : 36;
    
    for (let i = 0; i <= months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      // Simulate trajectory based on velocity and momentum
      let value = 50 + (signal.velocity / 100) * i * 10;
      if (signal.momentum === 'accelerating') value *= 1.1;
      if (signal.momentum === 'decelerating') value *= 0.9;
      
      const uncertainty = signal.confidence_score / 100;
      points.push({
        date: date.toISOString(),
        value: Math.max(0, Math.min(100, value)),
        confidence_interval: {
          lower: Math.max(0, value * (1 - uncertainty * 0.3)),
          upper: Math.min(100, value * (1 + uncertainty * 0.3))
        }
      });
    }
    
    return points;
  };

  const calculateSectorBreakdown = (signals: TrendSignal[]) => {
    const sectors: Record<string, number> = {};
    signals.forEach(signal => {
      signal.market_segments.forEach(segment => {
        sectors[segment] = (sectors[segment] || 0) + 1;
      });
    });
    return sectors;
  };

  const calculateConfidenceDistribution = (signals: TrendSignal[]) => {
    const distribution = { high: 0, medium: 0, low: 0 };
    signals.forEach(signal => {
      if (signal.confidence_score > 80) distribution.high++;
      else if (signal.confidence_score > 60) distribution.medium++;
      else distribution.low++;
    });
    return distribution;
  };

  const calculateVelocityTrends = (signals: TrendSignal[]) => {
    return {
      accelerating: signals.filter(s => s.momentum === 'accelerating').length,
      steady: signals.filter(s => s.momentum === 'steady').length,
      decelerating: signals.filter(s => s.momentum === 'decelerating').length,
      reversing: signals.filter(s => s.momentum === 'reversing').length
    };
  };

  const handleToggleWatch = (signalId: string) => {
    setTrendSignals(prev =>
      prev.map(signal =>
        signal.id === signalId ? { ...signal, watched: !signal.watched } : signal
      )
    );
  };

  const handleAcknowledgeAlert = async (alert: TrendAlert) => {
    setTrendAlerts(prev =>
      prev.map(a =>
        a.id === alert.id 
          ? { 
              ...a, 
              acknowledged: true, 
              acknowledged_by: userId,
              acknowledged_at: new Date().toISOString()
            }
          : a
      )
    );
    setAlertDialogOpen(false);
  };

  const toggleExpanded = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSignalIcon = (type: TrendSignal['signal_type']) => {
    const icons = {
      breakthrough: <DisruptiveIcon />,
      strong: <HotIcon />,
      moderate: <TrendIcon />,
      weak: <EmergingIcon />
    };
    return icons[type];
  };

  const getSignalColor = (type: TrendSignal['signal_type']) => {
    const colors = {
      breakthrough: theme.palette.error.main,
      strong: theme.palette.warning.main,
      moderate: theme.palette.info.main,
      weak: theme.palette.success.main
    };
    return colors[type];
  };

  const getMomentumIcon = (momentum: TrendSignal['momentum']) => {
    const icons = {
      accelerating: <TrendingUpIcon color="success" />,
      steady: <TrendIcon color="info" />,
      decelerating: <TrendingDownIcon color="warning" />,
      reversing: <TrendingDownIcon color="error" />
    };
    return icons[momentum];
  };

  // Chart configurations
  const trendVelocityChart = {
    labels: trendSignals.map(s => s.trend_name.substring(0, 10) + '...'),
    datasets: [{
      label: 'Velocity',
      data: trendSignals.map(s => s.velocity),
      backgroundColor: trendSignals.map(s => alpha(getSignalColor(s.signal_type), 0.7)),
      borderColor: trendSignals.map(s => getSignalColor(s.signal_type)),
      borderWidth: 2
    }]
  };

  const opportunityMatrixChart = {
    datasets: [{
      label: 'Trends',
      data: trendSignals.map(s => ({
        x: s.confidence_score,
        y: s.opportunity_score,
        r: s.velocity / 5
      })),
      backgroundColor: trendSignals.map(s => alpha(getSignalColor(s.signal_type), 0.6)),
      borderColor: trendSignals.map(s => getSignalColor(s.signal_type))
    }]
  };

  const forecastChart = selectedTrend && trendForecasts.find(f => f.trend_id === selectedTrend.id) ? {
    labels: trendForecasts
      .find(f => f.trend_id === selectedTrend.id)!
      .predicted_trajectory
      .map(p => new Date(p.date).toLocaleDateString()),
    datasets: [{
      label: 'Predicted Value',
      data: trendForecasts
        .find(f => f.trend_id === selectedTrend.id)!
        .predicted_trajectory
        .map(p => p.value),
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      tension: 0.4,
      fill: true
    }, {
      label: 'Confidence Interval',
      data: trendForecasts
        .find(f => f.trend_id === selectedTrend.id)!
        .predicted_trajectory
        .map(p => p.confidence_interval.upper),
      borderColor: alpha(theme.palette.primary.main, 0.3),
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4
    }]
  } : null;

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Trend Analysis Engine
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered trend detection and market forecasting
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto Refresh"
          />
          <ToggleButtonGroup
            value={timeHorizon}
            exclusive
            onChange={(e, value) => value && setTimeHorizon(value)}
            size="small"
          >
            <ToggleButton value="short">3M</ToggleButton>
            <ToggleButton value="medium">1Y</ToggleButton>
            <ToggleButton value="long">3Y</ToggleButton>
          </ToggleButtonGroup>
          <Badge badgeContent={trendAlerts.filter(a => !a.acknowledged).length} color="error">
            <Button
              variant="outlined"
              startIcon={<AlertIcon />}
              onClick={() => setCurrentTab(1)}
            >
              Alerts
            </Button>
          </Badge>
        </Box>
      </Box>

      {/* Executive Summary */}
      {trendInsights && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Executive Summary</AlertTitle>
          <Typography variant="body2">
            Tracking {trendInsights.summary.total_signals} market signals with {trendInsights.summary.breakthrough_signals} breakthrough trends detected. 
            {trendInsights.summary.high_opportunity_trends} high-opportunity trends identified with {trendInsights.summary.active_alerts} active alerts requiring attention.
          </Typography>
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Trend Signals
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {trendSignals.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${trendSignals.filter(s => s.signal_type === 'breakthrough').length} breakthrough`}
                      size="small"
                      color="error"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <RadarIcon />
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
                    High Opportunities
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {trendSignals.filter(s => s.opportunity_score > 80).length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={4.5}
                      size="small"
                      readOnly
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <OpportunityIcon />
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
                    Emerging Trends
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {trendSignals.filter(s => s.lifecycle_stage === 'emerging').length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="warning.main">
                      Early indicators
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <EmergingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Active Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {trendAlerts.filter(a => !a.acknowledged).length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${trendAlerts.filter(a => a.severity === 'critical').length} critical`}
                      size="small"
                      color="error"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <ActiveAlertIcon />
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
            <Tab label="Trend Signals" />
            <Tab label="Trend Alerts" />
            <Tab label="Forecasting" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Trend Signals Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Filters */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 1 }}>
                    Confidence Threshold:
                  </Typography>
                  <Slider
                    value={confidenceThreshold}
                    onChange={(e, value) => setConfidenceThreshold(value as number)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ width: 200 }}
                  />
                </Box>
              </Grid>

              {/* Trend Velocity Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Trend Velocity Analysis
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={trendVelocityChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Velocity Score'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Opportunity Matrix */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Opportunity Matrix
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bubble 
                      data={opportunityMatrixChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Confidence Score'
                            },
                            min: 0,
                            max: 100
                          },
                          y: {
                            title: {
                              display: true,
                              text: 'Opportunity Score'
                            },
                            min: 0,
                            max: 100
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const signal = trendSignals[context.dataIndex];
                                return `${signal.trend_name}: Conf ${signal.confidence_score}%, Opp ${signal.opportunity_score}%`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Trend Signals List */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Market Trend Signals
                </Typography>
                <Stack spacing={2}>
                  {trendSignals
                    .filter(signal => signal.confidence_score >= confidenceThreshold)
                    .map((signal) => (
                      <Card 
                        key={signal.id}
                        elevation={1}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          border: selectedTrend?.id === signal.id ? 2 : 1,
                          borderColor: selectedTrend?.id === signal.id ? 'primary.main' : 'divider'
                        }}
                        onClick={() => setSelectedTrend(signal)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Avatar sx={{ 
                                  bgcolor: alpha(getSignalColor(signal.signal_type), 0.1),
                                  color: getSignalColor(signal.signal_type),
                                  width: 32,
                                  height: 32
                                }}>
                                  {getSignalIcon(signal.signal_type)}
                                </Avatar>
                                <Typography variant="h6">
                                  {signal.trend_name}
                                </Typography>
                                <Chip 
                                  label={signal.signal_type}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getSignalColor(signal.signal_type), 0.1),
                                    color: getSignalColor(signal.signal_type)
                                  }}
                                />
                                <Chip 
                                  label={signal.lifecycle_stage}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {signal.description}
                              </Typography>
                              
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Confidence
                                    </Typography>
                                    <LinearProgress 
                                      variant="determinate"
                                      value={signal.confidence_score}
                                      sx={{ height: 6, borderRadius: 3 }}
                                    />
                                    <Typography variant="caption">
                                      {signal.confidence_score}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Velocity
                                    </Typography>
                                    <LinearProgress 
                                      variant="determinate"
                                      value={signal.velocity}
                                      sx={{ 
                                        height: 6, 
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: 'warning.main'
                                        }
                                      }}
                                    />
                                    <Typography variant="caption">
                                      {signal.velocity}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Opportunity
                                    </Typography>
                                    <LinearProgress 
                                      variant="determinate"
                                      value={signal.opportunity_score}
                                      sx={{ 
                                        height: 6, 
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: 'success.main'
                                        }
                                      }}
                                    />
                                    <Typography variant="caption">
                                      {signal.opportunity_score}%
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {getMomentumIcon(signal.momentum)}
                                    <Typography variant="caption">
                                      {signal.momentum}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {signal.market_segments.slice(0, 3).map((segment, idx) => (
                                  <Chip key={idx} label={segment} size="small" />
                                ))}
                                {signal.market_segments.length > 3 && (
                                  <Chip label={`+${signal.market_segments.length - 3} more`} size="small" variant="outlined" />
                                )}
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleWatch(signal.id);
                                }}
                              >
                                {signal.watched ? <StarIcon color="primary" /> : <StarBorderIcon />}
                              </IconButton>
                              <Typography variant="caption" color="text.secondary">
                                Peak in {signal.time_to_peak}mo
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<InsightsIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setForecastDialogOpen(true);
                                }}
                              >
                                Forecast
                              </Button>
                            </Box>
                          </Box>
                          
                          <Collapse in={expandedSections.has(signal.id)}>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Key Drivers
                                </Typography>
                                <List dense>
                                  {signal.key_drivers.map((driver, idx) => (
                                    <ListItem key={idx}>
                                      <ListItemText primary={driver} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Risk Factors
                                </Typography>
                                <List dense>
                                  {signal.risk_factors.map((risk, idx) => (
                                    <ListItem key={idx}>
                                      <ListItemText primary={risk} />
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Predictions
                                </Typography>
                                <Stack spacing={1}>
                                  <Alert severity="info" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      <strong>Short-term:</strong> {signal.predictions.short_term}
                                    </Typography>
                                  </Alert>
                                  <Alert severity="success" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      <strong>Medium-term:</strong> {signal.predictions.medium_term}
                                    </Typography>
                                  </Alert>
                                  <Alert severity="warning" sx={{ py: 0.5 }}>
                                    <Typography variant="caption">
                                      <strong>Long-term:</strong> {signal.predictions.long_term}
                                    </Typography>
                                  </Alert>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Collapse>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(signal.id);
                              }}
                            >
                              <ExpandIcon 
                                sx={{ 
                                  transform: expandedSections.has(signal.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s'
                                }}
                              />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Trend Alerts Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            {trendAlerts.filter(a => !a.acknowledged).length === 0 ? (
              <Alert severity="success">
                All trend alerts have been acknowledged. Monitoring continues for new developments.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mb: 3 }}>
                {trendAlerts.filter(a => !a.acknowledged).length} trend alerts require your attention
              </Alert>
            )}

            <Stack spacing={2}>
              {trendAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  elevation={1}
                  sx={{ 
                    opacity: alert.acknowledged ? 0.6 : 1,
                    borderLeft: 4,
                    borderColor: 
                      alert.severity === 'critical' ? 'error.main' :
                      alert.severity === 'high' ? 'warning.main' :
                      alert.severity === 'medium' ? 'info.main' : 'success.main'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AlertIcon 
                            color={
                              alert.severity === 'critical' ? 'error' :
                              alert.severity === 'high' ? 'warning' :
                              alert.severity === 'medium' ? 'info' : 'success'
                            }
                          />
                          <Typography variant="h6">
                            {alert.title}
                          </Typography>
                          <Chip 
                            label={alert.alert_type.replace('_', ' ')}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            label={alert.severity}
                            size="small"
                            color={
                              alert.severity === 'critical' ? 'error' :
                              alert.severity === 'high' ? 'warning' :
                              alert.severity === 'medium' ? 'info' : 'success'
                            }
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {alert.description}
                        </Typography>
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Recommended Actions:
                        </Typography>
                        <List dense>
                          {alert.recommended_actions.map((action, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={action} />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Chip 
                            label={`Impact: ${alert.impact_assessment.business_impact}`}
                            size="small"
                            color={alert.impact_assessment.business_impact === 'high' ? 'error' : 'default'}
                          />
                          <Chip 
                            label={`Urgency: ${alert.impact_assessment.urgency}`}
                            size="small"
                            color={alert.impact_assessment.urgency === 'high' ? 'warning' : 'default'}
                          />
                          <Chip 
                            label={`Effort: ${alert.impact_assessment.effort_required}`}
                            size="small"
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.created_at).toLocaleString()}
                        </Typography>
                        {!alert.acknowledged ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ValidatedIcon />}
                            onClick={() => {
                              setSelectedAlert(alert);
                              setAlertDialogOpen(true);
                            }}
                          >
                            Acknowledge
                          </Button>
                        ) : (
                          <Chip 
                            label="Acknowledged"
                            size="small"
                            color="success"
                            icon={<ValidatedIcon />}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {/* Forecasting Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Forecast Chart */}
              {selectedTrend && forecastChart && (
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Forecast: {selectedTrend.trend_name}
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <Line 
                        data={forecastChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            title: {
                              display: true,
                              text: `${timeHorizon.charAt(0).toUpperCase() + timeHorizon.slice(1)}-term Forecast`
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: 'Trend Strength'
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </Card>
                </Grid>
              )}

              {/* Forecast Summary Table */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Trend Forecasts Summary
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Trend</TableCell>
                        <TableCell>Current Score</TableCell>
                        <TableCell>Optimistic</TableCell>
                        <TableCell>Realistic</TableCell>
                        <TableCell>Pessimistic</TableCell>
                        <TableCell>Model Accuracy</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trendForecasts.map((forecast) => {
                        const signal = trendSignals.find(s => s.id === forecast.trend_id);
                        return (
                          <TableRow key={forecast.trend_id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {signal?.trend_name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <LinearProgress 
                                variant="determinate"
                                value={signal?.opportunity_score || 0}
                                sx={{ width: 100, height: 6, borderRadius: 3 }}
                              />
                              {signal?.opportunity_score}%
                            </TableCell>
                            <TableCell>
                              <Typography color="success.main">
                                {forecast.scenario_analysis.optimistic.toFixed(1)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="info.main">
                                {forecast.scenario_analysis.realistic.toFixed(1)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography color="error.main">
                                {forecast.scenario_analysis.pessimistic.toFixed(1)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`${forecast.model_accuracy}%`}
                                size="small"
                                color={forecast.model_accuracy > 80 ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedTrend(signal || null);
                                  setForecastDialogOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            {trendInsights && (
              <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Signal Distribution
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2">Breakthrough</Typography>
                        <LinearProgress 
                          variant="determinate"
                          value={(trendInsights.summary.breakthrough_signals / trendInsights.summary.total_signals) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption">
                          {trendInsights.summary.breakthrough_signals} signals
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">High Opportunity</Typography>
                        <LinearProgress 
                          variant="determinate"
                          value={(trendInsights.summary.high_opportunity_trends / trendInsights.summary.total_signals) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'success.main'
                            }
                          }}
                        />
                        <Typography variant="caption">
                          {trendInsights.summary.high_opportunity_trends} trends
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">Emerging</Typography>
                        <LinearProgress 
                          variant="determinate"
                          value={(trendInsights.summary.emerging_trends / trendInsights.summary.total_signals) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'warning.main'
                            }
                          }}
                        />
                        <Typography variant="caption">
                          {trendInsights.summary.emerging_trends} emerging
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>

                {/* Top Opportunities */}
                <Grid item xs={12} md={8}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Top Opportunities
                    </Typography>
                    <List>
                      {trendInsights.top_opportunities.slice(0, 5).map((signal: TrendSignal, idx: number) => (
                        <ListItem key={signal.id}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                              <OpportunityIcon color="success" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={signal.trend_name}
                            secondary={`Score: ${signal.opportunity_score} | Confidence: ${signal.confidence_score}%`}
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={`#${idx + 1}`}
                              size="small"
                              color="success"
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {/* Sector Breakdown */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Sector Distribution
                    </Typography>
                    <Stack spacing={1}>
                      {Object.entries(trendInsights.sector_breakdown).map(([sector, count]) => (
                        <Box key={sector}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">{sector}</Typography>
                            <Typography variant="body2">{count}</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate"
                            value={(count / trendInsights.summary.total_signals) * 100}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                {/* Velocity Trends */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Momentum Analysis
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="success.main">
                            {trendInsights.velocity_trends.accelerating}
                          </Typography>
                          <Typography variant="body2">Accelerating</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="info.main">
                            {trendInsights.velocity_trends.steady}
                          </Typography>
                          <Typography variant="body2">Steady</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="warning.main">
                            {trendInsights.velocity_trends.decelerating}
                          </Typography>
                          <Typography variant="body2">Decelerating</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="error.main">
                            {trendInsights.velocity_trends.reversing}
                          </Typography>
                          <Typography variant="body2">Reversing</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Card>

      {/* Alert Acknowledgment Dialog */}
      <Dialog 
        open={alertDialogOpen} 
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Acknowledge Trend Alert
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Alert 
                severity={
                  selectedAlert.severity === 'critical' ? 'error' :
                  selectedAlert.severity === 'high' ? 'warning' :
                  selectedAlert.severity === 'medium' ? 'info' : 'success'
                }
                sx={{ mb: 2 }}
              >
                <AlertTitle>{selectedAlert.title}</AlertTitle>
                {selectedAlert.description}
              </Alert>
              
              <Typography variant="body2" paragraph>
                By acknowledging this alert, you confirm that you have reviewed the trend analysis
                and will monitor for further developments.
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (optional)"
                placeholder="Add any notes about actions taken..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<ValidatedIcon />}
            onClick={() => selectedAlert && handleAcknowledgeAlert(selectedAlert)}
          >
            Acknowledge & Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forecast Details Dialog */}
      <Dialog 
        open={forecastDialogOpen} 
        onClose={() => setForecastDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Detailed Forecast Analysis
        </DialogTitle>
        <DialogContent>
          {selectedTrend && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTrend.trend_name}
              </Typography>
              
              {forecastChart && (
                <Box sx={{ height: 300, mb: 3 }}>
                  <Line data={forecastChart} options={{ responsive: true, maintainAspectRatio: false }} />
                </Box>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Assumptions
                  </Typography>
                  <List dense>
                    {['Current market conditions persist', 'No major regulatory changes', 'Technology adoption continues'].map((assumption, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={assumption} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Risk Factors
                  </Typography>
                  <List dense>
                    {selectedTrend.risk_factors.map((risk, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={risk} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForecastDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share Analysis
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrendAnalysisEngine;
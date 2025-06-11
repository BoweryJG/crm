// Market Opportunity Dashboard - Advanced opportunity visualization and strategic decision support
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
  Switch,
  FormControlLabel,
  Badge,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Business as OpportunityIcon,
  TrendingUp as GrowthIcon,
  TrendingDown as DeclineIcon,
  Assessment as ScoreIcon,
  StarRate as PriorityIcon,
  Schedule as TimelineIcon,
  Lightbulb as InsightIcon,
  Speed as VelocityIcon,
  Security as RiskIcon,
  MonetizationOn as FinancialIcon,
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ExpandMore as ExpandIcon,
  Launch as LaunchIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  AutoAwesome as AutoIcon,
  Radar as RadarIcon,
  AccountTree as MatrixIcon,
  Timeline as ForecastIcon,
  Compare as CompareIcon,
  Flag as MilestoneIcon,
  GpsFixed as TargetIcon,
  Insights as PredictiveIcon,
  TrendingFlat as StableIcon
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
import { Line, Bar, Scatter, Bubble, Radar } from 'react-chartjs-2';
import { 
  marketIntelligenceService,
  MarketOpportunity
} from '../../services/marketIntelligenceService';
import { 
  opportunityScoringService,
  OpportunityScore,
  OpportunityMatrix,
  OpportunityTrend
} from '../../services/opportunityScoringService';
import { 
  trendAnalysisService,
  TrendSignal
} from '../../services/trendAnalysisService';

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

interface MarketOpportunityDashboardProps {
  userId?: string;
}

interface OpportunityInsights {
  total_opportunities: number;
  high_priority_count: number;
  emerging_opportunities: number;
  ready_to_pursue: number;
  average_score: number;
  portfolio_value: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
  };
  stage_distribution: {
    discovery: number;
    evaluation: number;
    development: number;
    execution: number;
  };
  trend_correlations: OpportunityTrend[];
  recommendations: string[];
}

const MarketOpportunityDashboard: React.FC<MarketOpportunityDashboardProps> = ({ 
  userId = 'demo-user' 
}) => {
  const theme = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketOpportunity | null>(null);
  const [selectedScore, setSelectedScore] = useState<OpportunityScore | null>(null);
  const [matrixType, setMatrixType] = useState<OpportunityMatrix['matrix_type']>('attractiveness_feasibility');
  const [scoreThreshold, setScoreThreshold] = useState(60);
  
  // Data
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [opportunityScores, setOpportunityScores] = useState<OpportunityScore[]>([]);
  const [opportunityMatrix, setOpportunityMatrix] = useState<OpportunityMatrix | null>(null);
  const [trendSignals, setTrendSignals] = useState<TrendSignal[]>([]);
  const [opportunityTrends, setOpportunityTrends] = useState<OpportunityTrend[]>([]);
  const [insights, setInsights] = useState<OpportunityInsights | null>(null);
  
  // UI State
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [matrixDialogOpen, setMatrixDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'score' | 'impact' | 'timeline' | 'risk'>('score');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Load data on mount
  useEffect(() => {
    loadOpportunityData();
  }, [scoreThreshold, matrixType]);

  const loadOpportunityData = async () => {
    try {
      setLoading(true);
      
      // Load market opportunities
      const marketOpportunities = await marketIntelligenceService.getMarketOpportunities();
      setOpportunities(marketOpportunities);

      // Score all opportunities
      const scores = await Promise.all(
        marketOpportunities.map(opportunity => 
          opportunityScoringService.scoreOpportunity(opportunity, {
            company_strengths: ['Technology leadership', 'Customer support', 'Market presence'],
            strategic_priorities: ['Growth', 'Innovation', 'Customer success'],
            resource_constraints: ['Limited R&D budget', 'Small sales team']
          })
        )
      );
      setOpportunityScores(scores);

      // Generate opportunity matrix
      const matrix = await opportunityScoringService.generateOpportunityMatrix(
        marketOpportunities,
        matrixType
      );
      setOpportunityMatrix(matrix);

      // Load trend signals for correlation analysis
      const signals = await trendAnalysisService.detectTrendSignals();
      setTrendSignals(signals);

      // Analyze opportunity-trend correlations
      const correlations: OpportunityTrend[] = [];
      for (const opportunity of marketOpportunities) {
        const trends = await opportunityScoringService.analyzeOpportunityTrends(opportunity, signals);
        correlations.push(...trends);
      }
      setOpportunityTrends(correlations);

      // Generate insights
      const opportunityInsights = generateInsights(marketOpportunities, scores, correlations);
      setInsights(opportunityInsights);

    } catch (error) {
      console.error('Error loading opportunity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (
    opportunities: MarketOpportunity[],
    scores: OpportunityScore[],
    trends: OpportunityTrend[]
  ): OpportunityInsights => {
    const highPriorityCount = scores.filter(s => s.overall_score >= 80).length;
    const emergingCount = opportunities.filter(o => o.opportunity_type === 'new_market').length;
    const readyToPursue = scores.filter(s => 
      s.recommendation.action === 'pursue_immediately'
    ).length;
    
    const avgScore = scores.reduce((sum, s) => sum + s.overall_score, 0) / scores.length;
    
    const portfolioValue = opportunities.reduce((sum, o) => sum + o.market_size, 0);
    
    const riskDistribution = {
      low: scores.filter(s => s.component_scores.risk_assessment >= 70).length,
      medium: scores.filter(s => s.component_scores.risk_assessment >= 40 && s.component_scores.risk_assessment < 70).length,
      high: scores.filter(s => s.component_scores.risk_assessment < 40).length
    };

    const stageDistribution = {
      discovery: opportunities.filter(o => o.time_to_capture > 12).length,
      evaluation: opportunities.filter(o => o.time_to_capture > 6 && o.time_to_capture <= 12).length,
      development: opportunities.filter(o => o.time_to_capture > 3 && o.time_to_capture <= 6).length,
      execution: opportunities.filter(o => o.time_to_capture <= 3).length
    };

    const recommendations = [
      `Focus on ${highPriorityCount} high-priority opportunities for immediate action`,
      `${emergingCount} emerging market opportunities require early investment`,
      `Portfolio diversification across ${Object.keys(stageDistribution).length} development stages`,
      `Monitor ${trends.length} trend correlations for strategic timing`
    ];

    return {
      total_opportunities: opportunities.length,
      high_priority_count: highPriorityCount,
      emerging_opportunities: emergingCount,
      ready_to_pursue: readyToPursue,
      average_score: avgScore,
      portfolio_value: portfolioValue,
      risk_distribution: riskDistribution,
      stage_distribution: stageDistribution,
      trend_correlations: trends,
      recommendations
    };
  };

  const handleScoreOpportunity = async (opportunity: MarketOpportunity) => {
    const score = opportunityScores.find(s => s.opportunity_id === opportunity.id);
    if (score) {
      setSelectedOpportunity(opportunity);
      setSelectedScore(score);
      setScoreDialogOpen(true);
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getPriorityIcon = (priority: OpportunityScore['recommendation']['priority']) => {
    const icons = {
      critical: <PriorityIcon sx={{ color: 'error.main' }} />,
      high: <PriorityIcon sx={{ color: 'warning.main' }} />,
      medium: <PriorityIcon sx={{ color: 'info.main' }} />,
      low: <PriorityIcon sx={{ color: 'success.main' }} />
    };
    return icons[priority];
  };

  const getActionIcon = (action: OpportunityScore['recommendation']['action']) => {
    const icons = {
      pursue_immediately: <LaunchIcon sx={{ color: 'success.main' }} />,
      investigate_further: <AnalyticsIcon sx={{ color: 'warning.main' }} />,
      monitor: <ViewIcon sx={{ color: 'info.main' }} />,
      pass: <RejectIcon sx={{ color: 'error.main' }} />
    };
    return icons[action];
  };

  // Filter and sort opportunities
  const filteredAndSortedOpportunities = opportunities
    .filter(opp => {
      const score = opportunityScores.find(s => s.opportunity_id === opp.id);
      if (!score || score.overall_score < scoreThreshold) return false;
      
      if (filterType !== 'all' && opp.opportunity_type !== filterType) return false;
      
      if (filterStage !== 'all') {
        const stage = opp.time_to_capture <= 3 ? 'execution' :
                     opp.time_to_capture <= 6 ? 'development' :
                     opp.time_to_capture <= 12 ? 'evaluation' : 'discovery';
        if (stage !== filterStage) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const scoreA = opportunityScores.find(s => s.opportunity_id === a.id);
      const scoreB = opportunityScores.find(s => s.opportunity_id === b.id);
      
      if (!scoreA || !scoreB) return 0;
      
      switch (sortBy) {
        case 'score':
          return scoreB.overall_score - scoreA.overall_score;
        case 'impact':
          return b.market_size - a.market_size;
        case 'timeline':
          return a.time_to_capture - b.time_to_capture;
        case 'risk':
          return scoreB.component_scores.risk_assessment - scoreA.component_scores.risk_assessment;
        default:
          return 0;
      }
    });

  // Chart configurations
  const scoreDistributionChart = {
    labels: ['90-100', '80-89', '70-79', '60-69', '50-59', '<50'],
    datasets: [{
      label: 'Opportunities',
      data: [
        opportunityScores.filter(s => s.overall_score >= 90).length,
        opportunityScores.filter(s => s.overall_score >= 80 && s.overall_score < 90).length,
        opportunityScores.filter(s => s.overall_score >= 70 && s.overall_score < 80).length,
        opportunityScores.filter(s => s.overall_score >= 60 && s.overall_score < 70).length,
        opportunityScores.filter(s => s.overall_score >= 50 && s.overall_score < 60).length,
        opportunityScores.filter(s => s.overall_score < 50).length
      ],
      backgroundColor: [
        theme.palette.success.main,
        alpha(theme.palette.success.main, 0.7),
        theme.palette.warning.main,
        alpha(theme.palette.warning.main, 0.7),
        theme.palette.error.main,
        alpha(theme.palette.error.main, 0.7)
      ]
    }]
  };

  const opportunityValueChart = {
    labels: filteredAndSortedOpportunities.slice(0, 10).map(o => o.title.substring(0, 15) + '...'),
    datasets: [{
      label: 'Market Size ($M)',
      data: filteredAndSortedOpportunities.slice(0, 10).map(o => o.market_size / 1000000),
      backgroundColor: filteredAndSortedOpportunities.slice(0, 10).map(o => {
        const score = opportunityScores.find(s => s.opportunity_id === o.id);
        return score ? alpha(getScoreColor(score.overall_score), 0.7) : theme.palette.grey[400];
      }),
      borderColor: filteredAndSortedOpportunities.slice(0, 10).map(o => {
        const score = opportunityScores.find(s => s.opportunity_id === o.id);
        return score ? getScoreColor(score.overall_score) : theme.palette.grey[600];
      }),
      borderWidth: 2
    }]
  };

  const timelineChart = {
    labels: ['0-3 months', '3-6 months', '6-12 months', '12+ months'],
    datasets: [{
      label: 'Opportunities',
      data: [
        opportunities.filter(o => o.time_to_capture <= 3).length,
        opportunities.filter(o => o.time_to_capture > 3 && o.time_to_capture <= 6).length,
        opportunities.filter(o => o.time_to_capture > 6 && o.time_to_capture <= 12).length,
        opportunities.filter(o => o.time_to_capture > 12).length
      ],
      backgroundColor: [
        theme.palette.success.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.error.main
      ]
    }]
  };

  const matrixBubbleChart = opportunityMatrix ? {
    datasets: [{
      label: 'Opportunities',
      data: opportunityMatrix.opportunities.map(opp => ({
        x: opp.x_axis_value,
        y: opp.y_axis_value,
        r: opp.bubble_size
      })),
      backgroundColor: opportunityMatrix.opportunities.map(opp => 
        alpha(
          opp.quadrant === 'high_high' ? theme.palette.success.main :
          opp.quadrant === 'high_low' ? theme.palette.warning.main :
          opp.quadrant === 'low_high' ? theme.palette.info.main :
          theme.palette.error.main,
          0.6
        )
      ),
      borderColor: opportunityMatrix.opportunities.map(opp => 
        opp.quadrant === 'high_high' ? theme.palette.success.main :
        opp.quadrant === 'high_low' ? theme.palette.warning.main :
        opp.quadrant === 'low_high' ? theme.palette.info.main :
        theme.palette.error.main
      )
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
            Market Opportunity Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered opportunity scoring and strategic decision support
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={scoreThreshold <= 60}
                onChange={(e) => setScoreThreshold(e.target.checked ? 50 : 70)}
              />
            }
            label="Show All Opportunities"
          />
          <Button
            variant="outlined"
            startIcon={<MatrixIcon />}
            onClick={() => setMatrixDialogOpen(true)}
          >
            Portfolio Matrix
          </Button>
          <Button
            variant="contained"
            startIcon={<AIIcon />}
          >
            Generate Insights
          </Button>
        </Box>
      </Box>

      {/* Executive Summary */}
      {insights && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Portfolio Summary</AlertTitle>
          <Typography variant="body2">
            Tracking {insights.total_opportunities} opportunities with ${(insights.portfolio_value / 1000000).toFixed(0)}M total addressable market. 
            {insights.high_priority_count} high-priority opportunities ready for immediate action with average portfolio score of {insights.average_score.toFixed(1)}.
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
                    Total Opportunities
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {opportunities.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${opportunityScores.filter(s => s.overall_score >= 80).length} high-value`}
                      size="small"
                      color="success"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <OpportunityIcon />
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
                    Average Score
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {insights?.average_score.toFixed(1)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={insights ? insights.average_score / 20 : 0}
                      size="small"
                      readOnly
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <ScoreIcon />
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
                    Ready to Pursue
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {insights?.ready_to_pursue}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="warning.main">
                      Immediate action items
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <LaunchIcon />
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
                    Portfolio Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ${insights ? (insights.portfolio_value / 1000000).toFixed(0) : 0}M
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="info.main">
                      Total addressable market
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <FinancialIcon />
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
            <Tab label="Opportunity Portfolio" />
            <Tab label="Scoring Analysis" />
            <Tab label="Trend Correlations" />
            <Tab label="Strategic Insights" />
          </Tabs>
        </Box>

        {/* Opportunity Portfolio Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters and Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ mr: 1 }}>
                Score Threshold:
              </Typography>
              <Slider
                value={scoreThreshold}
                onChange={(e, value) => setScoreThreshold(value as number)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
                sx={{ width: 150 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <MenuItem value="score">Score</MenuItem>
                  <MenuItem value="impact">Market Size</MenuItem>
                  <MenuItem value="timeline">Timeline</MenuItem>
                  <MenuItem value="risk">Risk Level</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="new_market">New Market</MenuItem>
                  <MenuItem value="expansion">Expansion</MenuItem>
                  <MenuItem value="product_gap">Product Gap</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="acquisition">Acquisition</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={filterStage}
                  label="Stage"
                  onChange={(e) => setFilterStage(e.target.value)}
                >
                  <MenuItem value="all">All Stages</MenuItem>
                  <MenuItem value="discovery">Discovery</MenuItem>
                  <MenuItem value="evaluation">Evaluation</MenuItem>
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="execution">Execution</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              {/* Charts */}
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Score Distribution
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Bar 
                      data={scoreDistributionChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Market Value
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Bar 
                      data={opportunityValueChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Market Size ($M)'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Timeline Distribution
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Bar 
                      data={timelineChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Opportunity List */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Opportunity Portfolio ({filteredAndSortedOpportunities.length})
                </Typography>
                <Stack spacing={2}>
                  {filteredAndSortedOpportunities.map((opportunity) => {
                    const score = opportunityScores.find(s => s.opportunity_id === opportunity.id);
                    if (!score) return null;

                    return (
                      <Card 
                        key={opportunity.id}
                        elevation={1}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          border: selectedOpportunity?.id === opportunity.id ? 2 : 1,
                          borderColor: selectedOpportunity?.id === opportunity.id ? 'primary.main' : 'divider'
                        }}
                        onClick={() => handleScoreOpportunity(opportunity)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h6">
                                  {opportunity.title}
                                </Typography>
                                <Chip 
                                  label={opportunity.opportunity_type.replace('_', ' ')}
                                  size="small"
                                  variant="outlined"
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {getPriorityIcon(score.recommendation.priority)}
                                  <Typography variant="caption">
                                    {score.recommendation.priority}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {opportunity.description}
                              </Typography>
                              
                              <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Overall Score
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <LinearProgress 
                                        variant="determinate"
                                        value={score.overall_score}
                                        sx={{ 
                                          flex: 1,
                                          height: 8, 
                                          borderRadius: 4,
                                          bgcolor: alpha(getScoreColor(score.overall_score), 0.1),
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: getScoreColor(score.overall_score)
                                          }
                                        }}
                                      />
                                      <Typography variant="body2" fontWeight="bold">
                                        {score.overall_score}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Market Size
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      ${(opportunity.market_size / 1000000).toFixed(1)}M
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Timeline
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {opportunity.time_to_capture} months
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Investment
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      ${(opportunity.investment_required.max / 1000).toFixed(0)}k
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip 
                                  label={score.recommendation.action.replace('_', ' ')}
                                  size="small"
                                  icon={getActionIcon(score.recommendation.action)}
                                  color={
                                    score.recommendation.action === 'pursue_immediately' ? 'success' :
                                    score.recommendation.action === 'investigate_further' ? 'warning' :
                                    score.recommendation.action === 'monitor' ? 'info' : 'error'
                                  }
                                />
                                <Chip 
                                  label={`${score.recommendation.success_probability}% success`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ViewIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScoreOpportunity(opportunity);
                                }}
                              >
                                View Score
                              </Button>
                              <Typography variant="caption" color="text.secondary">
                                Updated {new Date(score.updated_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Scoring Analysis Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Component Score Analysis
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Opportunity</TableCell>
                    <TableCell>Overall</TableCell>
                    <TableCell>Market Attractiveness</TableCell>
                    <TableCell>Competitive Advantage</TableCell>
                    <TableCell>Strategic Fit</TableCell>
                    <TableCell>Execution Feasibility</TableCell>
                    <TableCell>Financial Potential</TableCell>
                    <TableCell>Risk Assessment</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunityScores
                    .filter(score => score.overall_score >= scoreThreshold)
                    .sort((a, b) => b.overall_score - a.overall_score)
                    .map((score) => {
                      const opportunity = opportunities.find(o => o.id === score.opportunity_id);
                      return (
                        <TableRow key={score.opportunity_id}>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {opportunity?.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress 
                                variant="determinate" 
                                value={score.overall_score} 
                                size={32}
                                sx={{ color: getScoreColor(score.overall_score) }}
                              />
                              <Typography variant="body2" fontWeight="bold">
                                {score.overall_score}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{score.component_scores.market_attractiveness.toFixed(0)}</TableCell>
                          <TableCell>{score.component_scores.competitive_advantage.toFixed(0)}</TableCell>
                          <TableCell>{score.component_scores.strategic_fit.toFixed(0)}</TableCell>
                          <TableCell>{score.component_scores.execution_feasibility.toFixed(0)}</TableCell>
                          <TableCell>{score.component_scores.financial_potential.toFixed(0)}</TableCell>
                          <TableCell>{score.component_scores.risk_assessment.toFixed(0)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={score.recommendation.action.replace('_', ' ')}
                              size="small"
                              color={
                                score.recommendation.action === 'pursue_immediately' ? 'success' :
                                score.recommendation.action === 'investigate_further' ? 'warning' :
                                score.recommendation.action === 'monitor' ? 'info' : 'error'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Trend Correlations Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Opportunity-Trend Correlations
            </Typography>
            
            <Grid container spacing={3}>
              {opportunityTrends.slice(0, 6).map((trend, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Trend Correlation #{index + 1}
                      </Typography>
                      <Chip 
                        label={trend.influence_type}
                        size="small"
                        color={
                          trend.influence_type === 'catalyst' ? 'success' :
                          trend.influence_type === 'driver' ? 'info' :
                          trend.influence_type === 'enabler' ? 'warning' : 'error'
                        }
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Correlation Strength
                      </Typography>
                      <LinearProgress 
                        variant="determinate"
                        value={Math.abs(trend.opportunity_correlation) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(
                            trend.opportunity_correlation > 0 ? theme.palette.success.main : theme.palette.error.main,
                            0.1
                          ),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: trend.opportunity_correlation > 0 ? 'success.main' : 'error.main'
                          }
                        }}
                      />
                      <Typography variant="caption">
                        {(trend.opportunity_correlation * 100).toFixed(1)}% correlation
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Impact Timing
                        </Typography>
                        <Typography variant="body2">
                          {trend.impact_timing.replace('_', ' ')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Confidence
                        </Typography>
                        <Typography variant="body2">
                          {trend.confidence_level}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Accordion sx={{ mt: 2 }}>
                      <AccordionSummary expandIcon={<ExpandIcon />}>
                        <Typography variant="subtitle2">
                          Predictive Impact
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          <Alert severity="success">
                            <Typography variant="caption">
                              <strong>If trend accelerates:</strong> {trend.predictive_impact.if_trend_accelerates.score_change > 0 ? '+' : ''}{trend.predictive_impact.if_trend_accelerates.score_change} score change
                            </Typography>
                          </Alert>
                          <Alert severity="warning">
                            <Typography variant="caption">
                              <strong>If trend decelerates:</strong> {trend.predictive_impact.if_trend_decelerates.score_change > 0 ? '+' : ''}{trend.predictive_impact.if_trend_decelerates.score_change} score change
                            </Typography>
                          </Alert>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Strategic Insights Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Portfolio Recommendations */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Strategic Recommendations
                  </Typography>
                  <List>
                    {insights?.recommendations.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <InsightIcon color="primary" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>

              {/* Risk Distribution */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Risk Profile
                  </Typography>
                  {insights && (
                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Low Risk</Typography>
                          <Typography variant="body2">{insights.risk_distribution.low}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate"
                          value={(insights.risk_distribution.low / insights.total_opportunities) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: 'success.main' }
                          }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Medium Risk</Typography>
                          <Typography variant="body2">{insights.risk_distribution.medium}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate"
                          value={(insights.risk_distribution.medium / insights.total_opportunities) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' }
                          }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">High Risk</Typography>
                          <Typography variant="body2">{insights.risk_distribution.high}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate"
                          value={(insights.risk_distribution.high / insights.total_opportunities) * 100}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '& .MuiLinearProgress-bar': { bgcolor: 'error.main' }
                          }}
                        />
                      </Box>
                    </Stack>
                  )}
                </Card>
              </Grid>

              {/* Development Stage Pipeline */}
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Development Pipeline
                  </Typography>
                  {insights && (
                    <Grid container spacing={3}>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="info.main">
                            {insights.stage_distribution.discovery}
                          </Typography>
                          <Typography variant="body2">Discovery</Typography>
                          <Typography variant="caption" color="text.secondary">
                            12+ months
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="warning.main">
                            {insights.stage_distribution.evaluation}
                          </Typography>
                          <Typography variant="body2">Evaluation</Typography>
                          <Typography variant="caption" color="text.secondary">
                            6-12 months
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="primary.main">
                            {insights.stage_distribution.development}
                          </Typography>
                          <Typography variant="body2">Development</Typography>
                          <Typography variant="caption" color="text.secondary">
                            3-6 months
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="success.main">
                            {insights.stage_distribution.execution}
                          </Typography>
                          <Typography variant="body2">Execution</Typography>
                          <Typography variant="caption" color="text.secondary">
                            0-3 months
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Opportunity Score Details Dialog */}
      <Dialog 
        open={scoreDialogOpen} 
        onClose={() => setScoreDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Opportunity Scoring Analysis
        </DialogTitle>
        <DialogContent>
          {selectedOpportunity && selectedScore && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedOpportunity.title}
              </Typography>
              
              {/* Overall Score */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={selectedScore.overall_score} 
                  size={80}
                  sx={{ color: getScoreColor(selectedScore.overall_score) }}
                />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {selectedScore.overall_score}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Score
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Chip 
                    label={selectedScore.recommendation.action.replace('_', ' ')}
                    color={
                      selectedScore.recommendation.action === 'pursue_immediately' ? 'success' :
                      selectedScore.recommendation.action === 'investigate_further' ? 'warning' :
                      selectedScore.recommendation.action === 'monitor' ? 'info' : 'error'
                    }
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                    {selectedScore.recommendation.success_probability}% success probability
                  </Typography>
                </Box>
              </Box>

              {/* Component Scores */}
              <Typography variant="h6" gutterBottom>
                Component Analysis
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(selectedScore.component_scores).map(([component, score]) => (
                  <Grid item xs={6} md={4} key={component}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        {component.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <LinearProgress 
                        variant="determinate"
                        value={score}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: alpha(getScoreColor(score), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getScoreColor(score)
                          }
                        }}
                      />
                      <Typography variant="caption">
                        {score.toFixed(0)}%
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Recommendation Details */}
              <Typography variant="h6" gutterBottom>
                Strategic Recommendation
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Timeline"
                        secondary={selectedScore.recommendation.timeline}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Priority"
                        secondary={selectedScore.recommendation.priority}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Next Steps
                  </Typography>
                  <List dense>
                    {selectedScore.recommendation.next_steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScoreDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share Analysis
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Portfolio Matrix Dialog */}
      <Dialog 
        open={matrixDialogOpen} 
        onClose={() => setMatrixDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Opportunity Portfolio Matrix
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Matrix Type</InputLabel>
                <Select
                  value={matrixType}
                  label="Matrix Type"
                  onChange={(e) => setMatrixType(e.target.value as OpportunityMatrix['matrix_type'])}
                >
                  <MenuItem value="attractiveness_feasibility">Attractiveness vs Feasibility</MenuItem>
                  <MenuItem value="growth_share">Growth vs Share</MenuItem>
                  <MenuItem value="risk_return">Risk vs Return</MenuItem>
                  <MenuItem value="strategic_priority">Strategic Priority</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {opportunityMatrix && matrixBubbleChart && (
              <Box sx={{ height: 400 }}>
                <Bubble 
                  data={matrixBubbleChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: opportunityMatrix.axis_labels.x_axis
                        },
                        min: 0,
                        max: 100
                      },
                      y: {
                        title: {
                          display: true,
                          text: opportunityMatrix.axis_labels.y_axis
                        },
                        min: 0,
                        max: 100
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const opportunity = opportunities[context.dataIndex];
                            return `${opportunity.title}: ${context.parsed.x}, ${context.parsed.y}`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}

            {opportunityMatrix && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Strategic Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Top Quadrant Opportunities
                    </Typography>
                    <Typography variant="body2">
                      {opportunityMatrix.insights.top_quadrant_count} opportunities in the high-priority quadrant
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Emerging Opportunities
                    </Typography>
                    <Typography variant="body2">
                      {opportunityMatrix.insights.emerging_opportunities.length} emerging opportunities identified
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Recommendations
                </Typography>
                <List dense>
                  {opportunityMatrix.insights.strategic_recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMatrixDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share Matrix
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketOpportunityDashboard;
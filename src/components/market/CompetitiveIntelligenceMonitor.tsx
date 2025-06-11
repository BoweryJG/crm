// Competitive Intelligence Monitor - Deep competitor analysis and strategic response system
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Business as CompetitorIcon,
  TrendingUp as GrowthIcon,
  TrendingDown as DeclineIcon,
  Launch as LaunchIcon,
  Handshake as PartnershipIcon,
  AttachMoney as PricingIcon,
  LocationOn as ExpansionIcon,
  Person as LeadershipIcon,
  Assessment as AnalyticsIcon,
  Warning as ThreatIcon,
  Shield as DefenseIcon,
  Lightbulb as StrategyIcon,
  Speed as SpeedIcon,
  Visibility as WatchIcon,
  VisibilityOff as UnwatchIcon,
  ExpandMore as ExpandIcon,
  Psychology as AIIcon,
  Campaign as CampaignIcon,
  Compare as CompareIcon,
  AutoAwesome as AutomateIcon,
  Flag as MilestoneIcon,
  EmojiEvents as WinIcon,
  Error as LossIcon,
  Timeline as TimelineIcon,
  Radar as RadarIcon,
  BatteryChargingFull as StrengthIcon,
  Battery20 as WeaknessIcon
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
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  marketIntelligenceService,
  CompetitorActivity
} from '../../services/marketIntelligenceService';
import { competitiveResponseService } from '../../services/competitiveResponseService';

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

interface CompetitiveIntelligenceMonitorProps {
  userId?: string;
}

interface CompetitorProfile {
  id: string;
  name: string;
  logo?: string;
  market_share: number;
  market_share_trend: 'growing' | 'stable' | 'declining';
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  strengths: string[];
  weaknesses: string[];
  recent_wins: number;
  recent_losses: number;
  key_differentiators: string[];
  estimated_revenue: number;
  employee_count: number;
  customer_count: number;
  product_portfolio: {
    name: string;
    category: string;
    competitive_position: 'ahead' | 'parity' | 'behind';
  }[];
  watched: boolean;
  last_updated: string;
}

interface StrategicResponse {
  id: string;
  competitor_activity_id: string;
  response_type: 'counter' | 'defend' | 'exploit' | 'monitor';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort_required: 'low' | 'medium' | 'high';
  expected_impact: 'low' | 'medium' | 'high';
  timeline: string;
  tactics: string[];
  resources_needed: string[];
  success_metrics: string[];
  risk_factors: string[];
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  owner?: string;
  deadline?: string;
}

interface BattleCard {
  id: string;
  competitor_id: string;
  category: string;
  our_position: string;
  their_position: string;
  talking_points: string[];
  objection_handlers: string[];
  proof_points: string[];
  win_stories: string[];
  updated_at: string;
}

const CompetitiveIntelligenceMonitor: React.FC<CompetitiveIntelligenceMonitorProps> = ({ 
  userId = 'demo-user' 
}) => {
  const theme = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorProfile | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Data
  const [competitorProfiles, setCompetitorProfiles] = useState<CompetitorProfile[]>([]);
  const [competitorActivities, setCompetitorActivities] = useState<CompetitorActivity[]>([]);
  const [strategicResponses, setStrategicResponses] = useState<StrategicResponse[]>([]);
  const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
  const [winLossAnalysis, setWinLossAnalysis] = useState<any>(null);
  
  // UI State
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<CompetitorActivity | null>(null);
  const [battleCardDialogOpen, setBattleCardDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [filterCompetitors, setFilterCompetitors] = useState<string[]>([]);
  const [filterActivityTypes, setFilterActivityTypes] = useState<CompetitorActivity['activity_type'][]>([]);

  // Load data on mount
  useEffect(() => {
    loadCompetitiveData();
  }, [timeframe]);

  const loadCompetitiveData = async () => {
    try {
      setLoading(true);
      
      // Load competitor profiles (mock data for now)
      const profiles: CompetitorProfile[] = [
        {
          id: 'comp_1',
          name: 'CompetitorX',
          market_share: 28.5,
          market_share_trend: 'growing',
          threat_level: 'high',
          strengths: ['Strong brand', 'Enterprise features', 'Global presence'],
          weaknesses: ['High pricing', 'Complex UI', 'Poor mobile experience'],
          recent_wins: 45,
          recent_losses: 12,
          key_differentiators: ['AI-powered analytics', '24/7 support', 'Industry partnerships'],
          estimated_revenue: 250000000,
          employee_count: 1200,
          customer_count: 5000,
          product_portfolio: [
            { name: 'CRM Pro', category: 'Sales', competitive_position: 'ahead' },
            { name: 'Marketing Hub', category: 'Marketing', competitive_position: 'parity' },
            { name: 'Service Desk', category: 'Support', competitive_position: 'behind' }
          ],
          watched: true,
          last_updated: new Date().toISOString()
        },
        {
          id: 'comp_2',
          name: 'StartupY',
          market_share: 8.2,
          market_share_trend: 'growing',
          threat_level: 'medium',
          strengths: ['Innovative features', 'Competitive pricing', 'Modern UI'],
          weaknesses: ['Limited integrations', 'Small team', 'No enterprise features'],
          recent_wins: 28,
          recent_losses: 8,
          key_differentiators: ['No-code workflows', 'Free tier', 'Quick setup'],
          estimated_revenue: 15000000,
          employee_count: 85,
          customer_count: 2000,
          product_portfolio: [
            { name: 'QuickCRM', category: 'Sales', competitive_position: 'behind' },
            { name: 'FlowBuilder', category: 'Automation', competitive_position: 'ahead' }
          ],
          watched: true,
          last_updated: new Date().toISOString()
        },
        {
          id: 'comp_3',
          name: 'LegacyCorp',
          market_share: 15.7,
          market_share_trend: 'declining',
          threat_level: 'low',
          strengths: ['Established customer base', 'Industry expertise', 'Stable platform'],
          weaknesses: ['Outdated technology', 'Slow innovation', 'Poor user experience'],
          recent_wins: 10,
          recent_losses: 35,
          key_differentiators: ['Industry-specific features', 'On-premise option', 'Customization'],
          estimated_revenue: 180000000,
          employee_count: 800,
          customer_count: 3500,
          product_portfolio: [
            { name: 'Legacy Suite', category: 'All-in-one', competitive_position: 'behind' }
          ],
          watched: false,
          last_updated: new Date().toISOString()
        }
      ];
      setCompetitorProfiles(profiles);

      // Load competitor activities
      const activities = await marketIntelligenceService.getCompetitorActivities({
        start_date: getStartDate(timeframe)
      });
      setCompetitorActivities(activities);

      // Generate strategic responses
      const responses = await generateStrategicResponses(activities);
      setStrategicResponses(responses);

      // Load battle cards (mock data)
      const cards: BattleCard[] = [
        {
          id: 'bc_1',
          competitor_id: 'comp_1',
          category: 'Pricing',
          our_position: 'Value-based pricing with transparent tiers',
          their_position: 'Premium pricing with complex packages',
          talking_points: [
            'Our pricing scales with your business',
            'No hidden fees or surprise charges',
            'ROI typically achieved within 3 months'
          ],
          objection_handlers: [
            'While they may offer more features, 80% go unused',
            'Our focused approach delivers faster time-to-value',
            'Include implementation and training at no extra cost'
          ],
          proof_points: [
            '92% customer satisfaction on pricing',
            'Average 40% cost savings vs CompetitorX',
            '30-day money-back guarantee'
          ],
          win_stories: [
            'TechCorp saved $50k/year by switching',
            'StartupZ achieved ROI in 6 weeks'
          ],
          updated_at: new Date().toISOString()
        }
      ];
      setBattleCards(cards);

      // Generate win/loss analysis
      const analysis = {
        total_opportunities: 180,
        wins: 112,
        losses: 68,
        win_rate: 62.2,
        win_rate_trend: 'improving',
        top_win_reasons: [
          { reason: 'Better pricing', count: 35, percentage: 31.3 },
          { reason: 'Ease of use', count: 28, percentage: 25.0 },
          { reason: 'Customer support', count: 24, percentage: 21.4 },
          { reason: 'Implementation speed', count: 15, percentage: 13.4 },
          { reason: 'Feature fit', count: 10, percentage: 8.9 }
        ],
        top_loss_reasons: [
          { reason: 'Missing features', count: 22, percentage: 32.4 },
          { reason: 'Enterprise requirements', count: 18, percentage: 26.5 },
          { reason: 'Integration limitations', count: 12, percentage: 17.6 },
          { reason: 'Brand preference', count: 10, percentage: 14.7 },
          { reason: 'Pricing', count: 6, percentage: 8.8 }
        ],
        competitive_win_rates: {
          'CompetitorX': 45.5,
          'StartupY': 72.3,
          'LegacyCorp': 88.9
        }
      };
      setWinLossAnalysis(analysis);

    } catch (error) {
      console.error('Error loading competitive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (timeframe: 'week' | 'month' | 'quarter'): string => {
    const date = new Date();
    switch (timeframe) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
    }
    return date.toISOString();
  };

  const generateStrategicResponses = async (activities: CompetitorActivity[]): Promise<StrategicResponse[]> => {
    // In production, this would use AI to generate responses
    return activities
      .filter(a => a.impact_score > 6)
      .map(activity => ({
        id: `response_${activity.id}`,
        competitor_activity_id: activity.id,
        response_type: activity.activity_type === 'pricing_change' ? 'defend' : 
                       activity.activity_type === 'product_launch' ? 'counter' : 'monitor',
        title: `Response to ${activity.competitor_name} ${activity.activity_type}`,
        description: activity.competitive_response?.suggested_actions[0] || 'Monitor and assess impact',
        priority: activity.impact_score > 8 ? 'critical' : 'high',
        effort_required: 'medium',
        expected_impact: 'high',
        timeline: '2 weeks',
        tactics: activity.competitive_response?.suggested_actions || [],
        resources_needed: ['Product team', 'Marketing team', 'Sales enablement'],
        success_metrics: ['Win rate improvement', 'Customer retention', 'Market share defense'],
        risk_factors: ['Resource allocation', 'Market timing', 'Customer perception'],
        status: 'proposed',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }));
  };

  const handleToggleWatch = (competitorId: string) => {
    setCompetitorProfiles(prev =>
      prev.map(comp =>
        comp.id === competitorId ? { ...comp, watched: !comp.watched } : comp
      )
    );
  };

  const handleCreateResponse = async (activity: CompetitorActivity) => {
    setSelectedActivity(activity);
    setResponseDialogOpen(true);
  };

  const handleApproveResponse = async (responseId: string) => {
    setStrategicResponses(prev =>
      prev.map(resp =>
        resp.id === responseId ? { ...resp, status: 'approved' } : resp
      )
    );
    // In production, this would trigger workflow
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

  const getThreatLevelColor = (level: CompetitorProfile['threat_level']) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      critical: theme.palette.error.dark
    };
    return colors[level];
  };

  const getActivityIcon = (type: CompetitorActivity['activity_type']) => {
    const icons = {
      product_launch: <LaunchIcon />,
      pricing_change: <PricingIcon />,
      partnership: <PartnershipIcon />,
      acquisition: <CompetitorIcon />,
      expansion: <ExpansionIcon />,
      leadership_change: <LeadershipIcon />
    };
    return icons[type] || <GrowthIcon />;
  };

  // Chart configurations
  const competitorStrengthRadar = selectedCompetitor ? {
    labels: ['Product', 'Pricing', 'Market Share', 'Innovation', 'Support', 'Brand'],
    datasets: [
      {
        label: 'Sphere OS',
        data: [85, 90, 75, 95, 92, 80],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
      {
        label: selectedCompetitor.name,
        data: [
          selectedCompetitor.product_portfolio.some(p => p.competitive_position === 'ahead') ? 90 : 70,
          selectedCompetitor.threat_level === 'high' ? 85 : 65,
          selectedCompetitor.market_share,
          selectedCompetitor.market_share_trend === 'growing' ? 80 : 60,
          75,
          selectedCompetitor.threat_level === 'high' ? 85 : 70
        ],
        borderColor: theme.palette.error.main,
        backgroundColor: alpha(theme.palette.error.main, 0.2),
      }
    ]
  } : null;

  const marketShareChart = {
    labels: ['Sphere OS', ...competitorProfiles.map(c => c.name), 'Others'],
    datasets: [{
      data: [22.5, ...competitorProfiles.map(c => c.market_share), 25.1],
      backgroundColor: [
        theme.palette.primary.main,
        ...competitorProfiles.map(c => getThreatLevelColor(c.threat_level)),
        theme.palette.grey[400]
      ]
    }]
  };

  const winLossChart = winLossAnalysis ? {
    labels: Object.keys(winLossAnalysis.competitive_win_rates),
    datasets: [{
      label: 'Win Rate %',
      data: Object.values(winLossAnalysis.competitive_win_rates),
      backgroundColor: Object.values(winLossAnalysis.competitive_win_rates).map((rate: any) =>
        rate > 70 ? theme.palette.success.main :
        rate > 50 ? theme.palette.warning.main :
        theme.palette.error.main
      )
    }]
  } : null;

  const activityTimelineChart = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: competitorProfiles
      .filter(c => c.watched)
      .map((competitor, index) => ({
        label: competitor.name,
        data: [
          competitorActivities.filter(a => 
            a.competitor_name === competitor.name && 
            new Date(a.detected_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          competitorActivities.filter(a => 
            a.competitor_name === competitor.name && 
            new Date(a.detected_date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
            new Date(a.detected_date) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          competitorActivities.filter(a => 
            a.competitor_name === competitor.name && 
            new Date(a.detected_date) > new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) &&
            new Date(a.detected_date) <= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          ).length,
          competitorActivities.filter(a => 
            a.competitor_name === competitor.name && 
            new Date(a.detected_date) > new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) &&
            new Date(a.detected_date) <= new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
          ).length
        ],
        borderColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.warning.main
        ][index],
        backgroundColor: alpha([
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.warning.main
        ][index], 0.1),
        tension: 0.4
      }))
  };

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
            Competitive Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor competitors and generate strategic responses
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={(e, value) => value && setTimeframe(value)}
            size="small"
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="quarter">Quarter</ToggleButton>
          </ToggleButtonGroup>
          <Badge badgeContent={strategicResponses.filter(r => r.status === 'proposed').length} color="error">
            <Button
              variant="outlined"
              startIcon={<StrategyIcon />}
              onClick={() => setCurrentTab(2)}
            >
              Pending Responses
            </Button>
          </Badge>
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
                    Market Position
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    #2
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <GrowthIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      Up from #3
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <WinIcon />
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
                    Win Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {winLossAnalysis?.win_rate.toFixed(1)}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {winLossAnalysis?.wins}W / {winLossAnalysis?.losses}L
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <AnalyticsIcon />
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
                    Competitor Moves
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {competitorActivities.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${competitorActivities.filter(a => a.impact_score > 7).length} high impact`}
                      size="small"
                      color="warning"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <RadarIcon />
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
                    Critical Threats
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {competitorProfiles.filter(c => c.threat_level === 'critical' || c.threat_level === 'high').length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="error.main">
                      Immediate action required
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <ThreatIcon />
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
            <Tab label="Competitor Profiles" />
            <Tab label="Activity Timeline" />
            <Tab label="Strategic Responses" />
            <Tab label="Battle Cards" />
            <Tab label="Win/Loss Analysis" />
          </Tabs>
        </Box>

        {/* Competitor Profiles Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Competitor List */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Tracked Competitors
                </Typography>
                <List>
                  {competitorProfiles.map((competitor) => (
                    <ListItem
                      key={competitor.id}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: 1,
                        borderColor: selectedCompetitor?.id === competitor.id ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => setSelectedCompetitor(competitor)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: alpha(getThreatLevelColor(competitor.threat_level), 0.1) }}>
                          <CompetitorIcon sx={{ color: getThreatLevelColor(competitor.threat_level) }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {competitor.name}
                            </Typography>
                            <Chip 
                              label={competitor.threat_level}
                              size="small"
                              sx={{
                                bgcolor: alpha(getThreatLevelColor(competitor.threat_level), 0.1),
                                color: getThreatLevelColor(competitor.threat_level)
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Market Share: {competitor.market_share}%
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {competitor.market_share_trend === 'growing' ? (
                                <GrowthIcon sx={{ fontSize: 16, color: 'error.main' }} />
                              ) : competitor.market_share_trend === 'declining' ? (
                                <DeclineIcon sx={{ fontSize: 16, color: 'success.main' }} />
                              ) : null}
                              <Typography variant="caption" color="text.secondary">
                                {competitor.market_share_trend}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWatch(competitor.id);
                          }}
                        >
                          {competitor.watched ? <WatchIcon color="primary" /> : <UnwatchIcon />}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Competitor Details */}
              <Grid item xs={12} md={8}>
                {selectedCompetitor ? (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {selectedCompetitor.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Revenue: ${(selectedCompetitor.estimated_revenue / 1000000).toFixed(0)}M
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Employees: {selectedCompetitor.employee_count.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Customers: {selectedCompetitor.customer_count.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CompareIcon />}
                          onClick={() => setBattleCardDialogOpen(true)}
                        >
                          Battle Cards
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AIIcon />}
                        >
                          Generate Response
                        </Button>
                      </Box>
                    </Box>

                    {/* Competitive Analysis Radar */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card elevation={1} sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Competitive Analysis
                          </Typography>
                          <Box sx={{ height: 300 }}>
                            {competitorStrengthRadar && (
                              <Radar 
                                data={competitorStrengthRadar}
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
                            )}
                          </Box>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          {/* Strengths */}
                          <Card elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <StrengthIcon color="error" />
                              Key Strengths
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {selectedCompetitor.strengths.map((strength, idx) => (
                                <Chip key={idx} label={strength} size="small" />
                              ))}
                            </Stack>
                          </Card>

                          {/* Weaknesses */}
                          <Card elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <WeaknessIcon color="success" />
                              Exploitable Weaknesses
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {selectedCompetitor.weaknesses.map((weakness, idx) => (
                                <Chip key={idx} label={weakness} size="small" color="success" variant="outlined" />
                              ))}
                            </Stack>
                          </Card>

                          {/* Win/Loss Record */}
                          <Card elevation={1} sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Head-to-Head Record
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                              <Box>
                                <Typography variant="h4" color="success.main">
                                  {selectedCompetitor.recent_wins}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Wins
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="h4" color="error.main">
                                  {selectedCompetitor.recent_losses}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Losses
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <LinearProgress 
                                  variant="determinate"
                                  value={(selectedCompetitor.recent_wins / (selectedCompetitor.recent_wins + selectedCompetitor.recent_losses)) * 100}
                                  sx={{ 
                                    flex: 1, 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: 'error.light',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: 'success.main'
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </Card>
                        </Stack>
                      </Grid>

                      {/* Product Portfolio */}
                      <Grid item xs={12}>
                        <Card elevation={1} sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Product Portfolio Comparison
                          </Typography>
                          <List>
                            {selectedCompetitor.product_portfolio.map((product, idx) => (
                              <ListItem key={idx}>
                                <ListItemText
                                  primary={product.name}
                                  secondary={product.category}
                                />
                                <Chip 
                                  label={product.competitive_position}
                                  size="small"
                                  color={
                                    product.competitive_position === 'ahead' ? 'success' :
                                    product.competitive_position === 'behind' ? 'error' : 'default'
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <CompetitorIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Select a competitor to view detailed analysis
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Activity Timeline Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Activity Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Activity Frequency
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line 
                      data={activityTimelineChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Market Share Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Market Share Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Doughnut 
                      data={marketShareChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right'
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Activity Timeline */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Recent Competitor Activities
                </Typography>
                <List>
                  {competitorActivities.slice(0, 8).map((activity, index) => (
                    <ListItem key={activity.id} sx={{ alignItems: 'flex-start', p: 0, mb: 2 }}>
                      <Card elevation={2} sx={{ p: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ 
                              bgcolor: activity.impact_score > 7 ? 'error.main' : 'primary.main',
                              width: 40,
                              height: 40
                            }}>
                              {getActivityIcon(activity.activity_type)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {activity.competitor_name}
                              </Typography>
                              <Typography variant="body2">
                                {activity.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(activity.detected_date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={`Impact: ${activity.impact_score}/10`}
                              size="small"
                              color={activity.impact_score > 7 ? 'error' : 'default'}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {activity.description}
                        </Typography>
                        {activity.competitive_response && (
                          <Button
                            size="small"
                            startIcon={<StrategyIcon />}
                            onClick={() => handleCreateResponse(activity)}
                          >
                            View Response Strategy
                          </Button>
                        )}
                      </Card>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Strategic Responses Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Response Strategies
              </Typography>
              <Button
                variant="contained"
                startIcon={<AutomateIcon />}
              >
                Generate AI Responses
              </Button>
            </Box>

            <Stack spacing={2}>
              {strategicResponses.map((response) => (
                <Accordion
                  key={response.id}
                  expanded={expandedSections.has(response.id)}
                  onChange={() => toggleExpanded(response.id)}
                >
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ 
                        bgcolor: alpha(
                          response.priority === 'critical' ? theme.palette.error.main :
                          response.priority === 'high' ? theme.palette.warning.main :
                          theme.palette.info.main, 
                          0.1
                        ) 
                      }}>
                        {response.response_type === 'counter' ? <DefenseIcon /> :
                         response.response_type === 'defend' ? <DefenseIcon /> :
                         response.response_type === 'exploit' ? <StrategyIcon /> :
                         <WatchIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {response.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {response.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip 
                          label={response.status}
                          size="small"
                          color={
                            response.status === 'completed' ? 'success' :
                            response.status === 'in_progress' ? 'primary' :
                            response.status === 'approved' ? 'info' :
                            'default'
                          }
                        />
                        <Chip 
                          label={response.priority}
                          size="small"
                          color={
                            response.priority === 'critical' ? 'error' :
                            response.priority === 'high' ? 'warning' :
                            'default'
                          }
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Tactics
                        </Typography>
                        <List dense>
                          {response.tactics.map((tactic, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={tactic} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Timeline
                            </Typography>
                            <Typography variant="body2">
                              {response.timeline}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Resources Needed
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {response.resources_needed.map((resource, idx) => (
                                <Chip key={idx} label={resource} size="small" />
                              ))}
                            </Stack>
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Success Metrics
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              {response.success_metrics.map((metric, idx) => (
                                <Chip key={idx} label={metric} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {response.status === 'proposed' && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CampaignIcon />}
                                onClick={() => handleApproveResponse(response.id)}
                              >
                                Approve & Execute
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {response.status === 'approved' && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<LaunchIcon />}
                            >
                              Start Execution
                            </Button>
                          )}
                          {response.status === 'in_progress' && (
                            <LinearProgress 
                              variant="determinate" 
                              value={65} 
                              sx={{ flex: 1, height: 8, borderRadius: 4 }}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        )}

        {/* Battle Cards Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Competitive Battle Cards
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AIIcon />}
              >
                Update All Cards
              </Button>
            </Box>

            <Grid container spacing={3}>
              {battleCards.map((card) => (
                <Grid item xs={12} md={6} key={card.id}>
                  <Card elevation={1}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6">
                            {card.category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            vs {competitorProfiles.find(c => c.id === card.competitor_id)?.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Updated {new Date(card.updated_at).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Alert severity="success" sx={{ mb: 2 }}>
                            <AlertTitle>Our Position</AlertTitle>
                            {card.our_position}
                          </Alert>
                        </Grid>
                        <Grid item xs={6}>
                          <Alert severity="error" sx={{ mb: 2 }}>
                            <AlertTitle>Their Position</AlertTitle>
                            {card.their_position}
                          </Alert>
                        </Grid>
                      </Grid>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandIcon />}>
                          <Typography variant="subtitle2">
                            Talking Points ({card.talking_points.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {card.talking_points.map((point, idx) => (
                              <ListItem key={idx}>
                                <ListItemText primary={point} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandIcon />}>
                          <Typography variant="subtitle2">
                            Objection Handlers ({card.objection_handlers.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {card.objection_handlers.map((handler, idx) => (
                              <ListItem key={idx}>
                                <ListItemText primary={handler} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined">
                          View Win Stories
                        </Button>
                        <Button size="small" variant="outlined">
                          Download PDF
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Win/Loss Analysis Tab */}
        {currentTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Overall Stats */}
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight="bold" color="primary">
                          {winLossAnalysis?.win_rate.toFixed(1)}%
                        </Typography>
                        <Typography variant="subtitle1">
                          Overall Win Rate
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold">
                          {winLossAnalysis?.total_opportunities}
                        </Typography>
                        <Typography variant="subtitle1">
                          Total Opportunities
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {winLossAnalysis?.wins}
                        </Typography>
                        <Typography variant="subtitle1">
                          Wins
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" color="error.main">
                          {winLossAnalysis?.losses}
                        </Typography>
                        <Typography variant="subtitle1">
                          Losses
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Win Rate by Competitor */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Win Rate by Competitor
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {winLossChart && (
                      <Bar 
                        data={winLossChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              ticks: {
                                callback: (value) => `${value}%`
                              }
                            }
                          },
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Win/Loss Reasons */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {/* Top Win Reasons */}
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WinIcon color="success" />
                      Top Win Reasons
                    </Typography>
                    <List dense>
                      {winLossAnalysis?.top_win_reasons.map((reason: any, idx: number) => (
                        <ListItem key={idx}>
                          <ListItemText 
                            primary={reason.reason}
                            secondary={`${reason.count} deals (${reason.percentage}%)`}
                          />
                          <LinearProgress 
                            variant="determinate"
                            value={reason.percentage}
                            sx={{ 
                              width: 100, 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'success.main'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Card>

                  {/* Top Loss Reasons */}
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LossIcon color="error" />
                      Top Loss Reasons
                    </Typography>
                    <List dense>
                      {winLossAnalysis?.top_loss_reasons.map((reason: any, idx: number) => (
                        <ListItem key={idx}>
                          <ListItemText 
                            primary={reason.reason}
                            secondary={`${reason.count} deals (${reason.percentage}%)`}
                          />
                          <LinearProgress 
                            variant="determinate"
                            value={reason.percentage}
                            sx={{ 
                              width: 100, 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'error.main'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Response Strategy Dialog */}
      <Dialog 
        open={responseDialogOpen} 
        onClose={() => setResponseDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Competitive Response Strategy
        </DialogTitle>
        <DialogContent>
          {selectedActivity && selectedActivity.competitive_response && (
            <Box sx={{ pt: 2 }}>
              <Alert severity={
                selectedActivity.competitive_response.urgency === 'immediate' ? 'error' :
                selectedActivity.competitive_response.urgency === 'high' ? 'warning' : 'info'
              } sx={{ mb: 2 }}>
                <AlertTitle>
                  Urgency: {selectedActivity.competitive_response.urgency}
                </AlertTitle>
                Response required within {
                  selectedActivity.competitive_response.urgency === 'immediate' ? '24 hours' :
                  selectedActivity.competitive_response.urgency === 'high' ? '1 week' : '1 month'
                }
              </Alert>

              <Typography variant="h6" gutterBottom>
                Suggested Actions
              </Typography>
              <List>
                {selectedActivity.competitive_response.suggested_actions.map((action, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Talking Points
              </Typography>
              <List>
                {selectedActivity.competitive_response.talking_points.map((point, idx) => (
                  <ListItem key={idx}>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Counter Strategies
              </Typography>
              <Stack spacing={1}>
                {selectedActivity.competitive_response.counter_strategies.map((strategy, idx) => (
                  <Alert key={idx} severity="success">
                    {strategy}
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<CampaignIcon />}>
            Create Action Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Battle Card Dialog */}
      <Dialog 
        open={battleCardDialogOpen} 
        onClose={() => setBattleCardDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Battle Cards vs {selectedCompetitor?.name}
        </DialogTitle>
        <DialogContent>
          {/* Battle card content would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBattleCardDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<AIIcon />}>
            Update with AI
          </Button>
          <Button variant="contained">
            Download All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompetitiveIntelligenceMonitor;
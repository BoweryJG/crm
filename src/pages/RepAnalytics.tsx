import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Button,
  IconButton,
  Paper,
  useTheme,
  CircularProgress,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  CompareArrows as CompareIcon,
  Insights as InsightsIcon,
  AccountTree as NetworkIcon,
  PsychologyAlt as AIIcon,
  QueryStats as ForecastIcon,
  Psychology as PsychologyIcon,
  EmojiEvents as TrophyIcon,
  Radar as RadarIcon,
  BarChart as ChartIcon,
  AutoGraph as PipelineIcon
} from '@mui/icons-material';
import { useThemeContext } from '../themes/ThemeContext';
import UrgentInsightsOverlay from '../components/insights/UrgentInsightsOverlay';
import { useNavigate } from 'react-router-dom';

// Enhanced interface for elite rep analytics
interface TerritoryMetrics {
  totalAccounts: number;
  penetrationRate: number;
  revenuePerAccount: number;
  accountGrowthRate: number;
  competitiveWins: number;
  competitiveLosses: number;
  marketShare: number;
  territoryRank: number;
}

interface AccountIntelligence {
  accountId: string;
  accountName: string;
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  nextBestAction: string;
  decisionMakers: Array<{
    name: string;
    title: string;
    influence: number;
    lastContact: string;
  }>;
  competitorPresence: string[];
  revenueGrowth: number;
  lastPurchase: string;
  upcomingOpportunities: number;
}

interface CompetitiveIntel {
  competitor: string;
  marketShare: number;
  winRate: number;
  averageDealSize: number;
  primaryAdvantages: string[];
  weaknesses: string[];
  recentMoves: string[];
  threatsToWatch: number;
}

interface PipelineVelocity {
  stage: string;
  averageDuration: number;
  conversionRate: number;
  bottlenecks: string[];
  accelerators: string[];
  currentDeals: number;
  projectedRevenue: number;
}

interface ActivityEfficiency {
  activityType: string;
  volume: number;
  conversionRate: number;
  revenueGenerated: number;
  timeInvested: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
}

const RepAnalytics: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data for elite rep analytics
  const [territoryMetrics] = useState<TerritoryMetrics>({
    totalAccounts: 247,
    penetrationRate: 73.2,
    revenuePerAccount: 94500,
    accountGrowthRate: 12.8,
    competitiveWins: 34,
    competitiveLosses: 8,
    marketShare: 42.3,
    territoryRank: 3
  });

  const [accountIntelligence] = useState<AccountIntelligence[]>([
    {
      accountId: '1',
      accountName: 'Manhattan Oral Surgery Group',
      healthScore: 94,
      riskLevel: 'low',
      nextBestAction: 'Schedule Q4 expansion meeting',
      decisionMakers: [
        { name: 'Dr. Michael Chen', title: 'Managing Partner', influence: 95, lastContact: '3 days ago' },
        { name: 'Sarah Williams', title: 'Practice Administrator', influence: 78, lastContact: '1 week ago' }
      ],
      competitorPresence: ['Nobel Biocare', 'Zimmer'],
      revenueGrowth: 23.4,
      lastPurchase: '2 months ago',
      upcomingOpportunities: 3
    },
    {
      accountId: '2',
      accountName: 'Elite Aesthetic Center',
      healthScore: 67,
      riskLevel: 'medium',
      nextBestAction: 'Address Botox pricing concerns',
      decisionMakers: [
        { name: 'Dr. Jennifer Walsh', title: 'Medical Director', influence: 100, lastContact: '1 week ago' }
      ],
      competitorPresence: ['Allergan', 'Merz'],
      revenueGrowth: -5.2,
      lastPurchase: '4 months ago',
      upcomingOpportunities: 1
    }
  ]);

  const [competitiveIntel] = useState<CompetitiveIntel[]>([
    {
      competitor: 'Nobel Biocare',
      marketShare: 28.5,
      winRate: 34,
      averageDealSize: 87000,
      primaryAdvantages: ['Brand recognition', 'Clinical studies', 'Training programs'],
      weaknesses: ['Higher pricing', 'Complex ordering', 'Limited customization'],
      recentMoves: ['Launched new tapered implant', 'Price increase announced'],
      threatsToWatch: 7
    },
    {
      competitor: 'Allergan Aesthetics',
      marketShare: 31.2,
      winRate: 41,
      averageDealSize: 52000,
      primaryAdvantages: ['Product portfolio', 'Patient financing', 'Marketing support'],
      weaknesses: ['Supply chain issues', 'Rep turnover', 'Limited innovation'],
      recentMoves: ['New loyalty program', 'Partnership with training institute'],
      threatsToWatch: 12
    }
  ]);

  const [pipelineVelocity] = useState<PipelineVelocity[]>([
    {
      stage: 'Prospecting',
      averageDuration: 8,
      conversionRate: 67,
      bottlenecks: ['Contact identification', 'Initial response rate'],
      accelerators: ['Referral network', 'Social selling'],
      currentDeals: 23,
      projectedRevenue: 430000
    },
    {
      stage: 'Qualification',
      averageDuration: 12,
      conversionRate: 78,
      bottlenecks: ['Budget confirmation', 'Decision maker access'],
      accelerators: ['Clinical evidence', 'ROI calculators'],
      currentDeals: 18,
      projectedRevenue: 1250000
    },
    {
      stage: 'Proposal',
      averageDuration: 15,
      conversionRate: 83,
      bottlenecks: ['Legal review', 'Competitive pressure'],
      accelerators: ['Customization', 'Training inclusion'],
      currentDeals: 12,
      projectedRevenue: 890000
    },
    {
      stage: 'Closing',
      averageDuration: 9,
      conversionRate: 92,
      bottlenecks: ['Contract negotiations', 'Implementation timing'],
      accelerators: ['Incentives', 'Urgency creation'],
      currentDeals: 8,
      projectedRevenue: 650000
    }
  ]);

  const [activityEfficiency] = useState<ActivityEfficiency[]>([
    {
      activityType: 'Clinical Demos',
      volume: 47,
      conversionRate: 68,
      revenueGenerated: 1240000,
      timeInvested: 94,
      roi: 324,
      trend: 'up'
    },
    {
      activityType: 'In-Office Visits',
      volume: 89,
      conversionRate: 42,
      revenueGenerated: 980000,
      timeInvested: 178,
      roi: 152,
      trend: 'stable'
    },
    {
      activityType: 'Virtual Consultations',
      volume: 156,
      conversionRate: 28,
      revenueGenerated: 520000,
      timeInvested: 234,
      roi: 87,
      trend: 'down'
    },
    {
      activityType: 'Conference Meetings',
      volume: 23,
      conversionRate: 73,
      revenueGenerated: 780000,
      timeInvested: 46,
      roi: 412,
      trend: 'up'
    }
  ]);

  useEffect(() => {
    // Simulate loading elite analytics data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'high': return theme.palette.error.main;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'down': return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      case 'stable': return <TrendingUpIcon sx={{ color: theme.palette.warning.main, transform: 'rotate(90deg)' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Loading elite performance analytics...
        </Typography>
      </Box>
    );
  }

  const tabContent = [
    // Territory Performance Tab
    <Box key="territory">
      <Grid container spacing={3}>
        {/* Territory Overview */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Territory Performance Dashboard
                  </Typography>
                  <Chip label={`Rank #${territoryMetrics.territoryRank}`} color="primary" size="small" />
                </Box>
              }
              subheader="Elite territory metrics for top 1% performers"
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {territoryMetrics.totalAccounts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Accounts
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      {territoryMetrics.penetrationRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Market Penetration
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="secondary" fontWeight="bold">
                      {formatCurrency(territoryMetrics.revenuePerAccount)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenue/Account
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      {territoryMetrics.marketShare}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Market Share
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Competitive Win/Loss */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon color="warning" />
                  <Typography variant="h6" fontWeight="bold">
                    Competitive Performance
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Wins vs Losses</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {territoryMetrics.competitiveWins}W / {territoryMetrics.competitiveLosses}L
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(territoryMetrics.competitiveWins / (territoryMetrics.competitiveWins + territoryMetrics.competitiveLosses)) * 100}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold" sx={{ textAlign: 'center' }}>
                {Math.round((territoryMetrics.competitiveWins / (territoryMetrics.competitiveWins + territoryMetrics.competitiveLosses)) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Win Rate vs Competition
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Growth */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChartIcon color="info" />
                  <Typography variant="h6" fontWeight="bold">
                    Account Growth
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Typography variant="h4" color="primary" fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
                +{territoryMetrics.accountGrowthRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                YoY Account Growth Rate
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: 40 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                Top 5% in region
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>,

    // Account Intelligence Tab
    <Box key="accounts">
      <Grid container spacing={3}>
        {accountIntelligence.map((account) => (
          <Grid item xs={12} md={6} key={account.accountId}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NetworkIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {account.accountName}
                    </Typography>
                  </Box>
                }
                action={
                  <Chip 
                    label={`${account.healthScore}% Health`}
                    sx={{ 
                      backgroundColor: getHealthScoreColor(account.healthScore),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                }
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Account Health</Typography>
                    <Chip 
                      label={account.riskLevel.toUpperCase()}
                      size="small"
                      sx={{ 
                        backgroundColor: getRiskColor(account.riskLevel),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={account.healthScore}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getHealthScoreColor(account.healthScore)
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Next Best Action:
                  </Typography>
                  <Typography variant="body2" color="primary" fontWeight="500">
                    🎯 {account.nextBestAction}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Key Decision Makers:
                  </Typography>
                  {account.decisionMakers.map((dm, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography variant="body2" fontWeight="500">{dm.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{dm.title}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="primary">{dm.influence}% influence</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {dm.lastContact}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Revenue Growth</Typography>
                    <Typography variant="h6" color={account.revenueGrowth > 0 ? 'success.main' : 'error.main'} fontWeight="bold">
                      {account.revenueGrowth > 0 ? '+' : ''}{account.revenueGrowth}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Opportunities</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {account.upcomingOpportunities}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Competitors Present:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {account.competitorPresence.map((comp, index) => (
                      <Chip key={index} label={comp} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>,

    // Competitive Intelligence Tab
    <Box key="competitive">
      <Grid container spacing={3}>
        {competitiveIntel.map((competitor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RadarIcon color="warning" />
                    <Typography variant="h6" fontWeight="bold">
                      {competitor.competitor}
                    </Typography>
                  </Box>
                }
                action={
                  <Badge badgeContent={competitor.threatsToWatch} color="error">
                    <WarningIcon color="action" />
                  </Badge>
                }
              />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Market Share</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {competitor.marketShare}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Win Rate vs Us</Typography>
                    <Typography variant="h5" color="error.main" fontWeight="bold">
                      {competitor.winRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Avg Deal Size</Typography>
                    <Typography variant="h6" color="secondary" fontWeight="bold">
                      {formatCurrency(competitor.averageDealSize)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">
                    Their Advantages:
                  </Typography>
                  <List dense>
                    {competitor.primaryAdvantages.map((advantage, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={advantage} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">
                    Their Weaknesses:
                  </Typography>
                  <List dense>
                    {competitor.weaknesses.map((weakness, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <WarningIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={weakness} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.main">
                    Recent Moves:
                  </Typography>
                  {competitor.recentMoves.map((move, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      • {move}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>,

    // Pipeline Velocity Tab
    <Box key="pipeline">
      <Grid container spacing={3}>
        {pipelineVelocity.map((stage, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PipelineIcon color="secondary" />
                    <Typography variant="h6" fontWeight="bold">
                      {stage.stage}
                    </Typography>
                  </Box>
                }
                action={
                  <Chip 
                    label={`${stage.conversionRate}% conversion`}
                    color="primary"
                    size="small"
                  />
                }
              />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Avg Duration</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {stage.averageDuration}d
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Current Deals</Typography>
                    <Typography variant="h5" color="secondary" fontWeight="bold">
                      {stage.currentDeals}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Projected Revenue</Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {formatCurrency(stage.projectedRevenue)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">
                    Bottlenecks:
                  </Typography>
                  {stage.bottlenecks.map((bottleneck, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      🚫 {bottleneck}
                    </Typography>
                  ))}
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">
                    Accelerators:
                  </Typography>
                  {stage.accelerators.map((accelerator, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      🚀 {accelerator}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>,

    // Activity Efficiency Tab
    <Box key="efficiency">
      <Grid container spacing={3}>
        {activityEfficiency.map((activity, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon color="info" />
                    <Typography variant="h6" fontWeight="bold">
                      {activity.activityType}
                    </Typography>
                  </Box>
                }
                action={getTrendIcon(activity.trend)}
              />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Volume</Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {activity.volume}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Conversion</Typography>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      {activity.conversionRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">ROI</Typography>
                    <Typography variant="h5" color="warning.main" fontWeight="bold">
                      {activity.roi}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">Revenue Generated</Typography>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    {formatCurrency(activity.revenueGenerated)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Time Invested</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {activity.timeInvested} hours
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">$/Hour</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(activity.revenueGenerated / activity.timeInvested)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Urgent Insights Overlay */}
      <UrgentInsightsOverlay />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Elite Rep Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive performance intelligence for $200K+ medical device sales professionals
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AIIcon />}
          onClick={() => navigate('/call-analysis')}
        >
          AI Analysis
        </Button>
      </Box>

      {/* Performance Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              $2.8M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              YTD Revenue
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">+18% vs goal</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              87%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Win Rate
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <TrophyIcon sx={{ color: 'warning.main', mr: 0.5 }} />
              <Typography variant="caption" color="primary">Top 1%</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="secondary" fontWeight="bold">
              14d
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Sales Cycle
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <SpeedIcon sx={{ color: 'info.main', mr: 0.5 }} />
              <Typography variant="caption" color="info.main">42% faster</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              $127K
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Deal Size
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <MoneyIcon sx={{ color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">+23% vs avg</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Main Analytics Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  Territory Performance
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NetworkIcon />
                  Account Intelligence
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RadarIcon />
                  Competitive Intel
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PipelineIcon />
                  Pipeline Velocity
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon />
                  Activity Efficiency
                </Box>
              } 
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {tabContent[currentTab]}
        </Box>
      </Card>
    </Box>
  );
};

export default RepAnalytics;
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
  Badge,
  Stack,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Radar as RadarIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Psychology as AIIcon,
  QueryStats as ForecastIcon,
  Map as MapIcon,
  Groups as GroupsIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingFlat as FlatIcon,
  AutoGraph as AutoGraphIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  LocalHospital as HospitalIcon,
  Science as ScienceIcon,
  Engineering as EngineeringIcon,
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useThemeContext } from '../themes/ThemeContext';
import { useNavigate } from 'react-router-dom';
import glassEffects from '../themes/glassEffects';

// Enhanced interfaces for market analytics
interface MarketSegment {
  segment: string;
  size: number;
  growth: number;
  penetration: number;
  opportunity: number;
  competitors: string[];
  entryBarriers: 'low' | 'medium' | 'high';
  avgDealSize: number;
  trends: string[];
}

interface TerritoryInsight {
  territory: string;
  population: number;
  facilities: number;
  marketSize: number;
  currentRevenue: number;
  potential: number;
  competitorDensity: 'low' | 'medium' | 'high';
  topCompetitors: Array<{
    name: string;
    marketShare: number;
  }>;
  growthRate: number;
  opportunities: number;
}

interface CompetitorAnalysis {
  competitor: string;
  marketShare: number;
  revenue: number;
  growthRate: number;
  strengths: string[];
  weaknesses: string[];
  products: Array<{
    name: string;
    marketShare: number;
    price: number;
  }>;
  recentMoves: string[];
  threatLevel: 'low' | 'medium' | 'high';
}

interface MarketTrend {
  trend: string;
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  affectedSegments: string[];
  description: string;
  recommendations: string[];
  confidence: number;
}

const MarketAnalytics: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data for market analytics
  const [marketSegments] = useState<MarketSegment[]>([
    {
      segment: 'Oral Surgery',
      size: 4200000,
      growth: 12.5,
      penetration: 35,
      opportunity: 2730000,
      competitors: ['Nobel Biocare', 'Straumann', 'Dentsply'],
      entryBarriers: 'medium',
      avgDealSize: 125000,
      trends: ['Digital dentistry adoption', 'Same-day procedures', 'AI-guided surgery']
    },
    {
      segment: 'Aesthetics & Dermatology',
      size: 3800000,
      growth: 18.2,
      penetration: 28,
      opportunity: 2736000,
      competitors: ['Allergan', 'Merz', 'Galderma'],
      entryBarriers: 'low',
      avgDealSize: 65000,
      trends: ['Minimally invasive procedures', 'Combination therapies', 'Male demographics growth']
    },
    {
      segment: 'Orthopedics',
      size: 5500000,
      growth: 8.7,
      penetration: 42,
      opportunity: 3190000,
      competitors: ['Stryker', 'Zimmer Biomet', 'DePuy Synthes'],
      entryBarriers: 'high',
      avgDealSize: 180000,
      trends: ['Robotic surgery', '3D-printed implants', 'Outpatient procedures']
    }
  ]);

  const [territoryInsights] = useState<TerritoryInsight[]>([
    {
      territory: 'Manhattan Central',
      population: 850000,
      facilities: 127,
      marketSize: 12500000,
      currentRevenue: 2800000,
      potential: 9700000,
      competitorDensity: 'high',
      topCompetitors: [
        { name: 'MedTech Solutions', marketShare: 28 },
        { name: 'Global Medical', marketShare: 22 },
        { name: 'BioInnovate', marketShare: 18 }
      ],
      growthRate: 14.3,
      opportunities: 47
    },
    {
      territory: 'Brooklyn North',
      population: 620000,
      facilities: 89,
      marketSize: 8200000,
      currentRevenue: 1500000,
      potential: 6700000,
      competitorDensity: 'medium',
      topCompetitors: [
        { name: 'Regional Health Systems', marketShare: 35 },
        { name: 'MedTech Solutions', marketShare: 20 },
        { name: 'Local Distributors', marketShare: 15 }
      ],
      growthRate: 19.8,
      opportunities: 62
    }
  ]);

  const [competitorAnalysis] = useState<CompetitorAnalysis[]>([
    {
      competitor: 'MedTech Solutions',
      marketShare: 26.5,
      revenue: 45000000,
      growthRate: 11.2,
      strengths: ['Strong brand', 'Wide portfolio', 'Clinical support'],
      weaknesses: ['High pricing', 'Slow innovation', 'Limited customization'],
      products: [
        { name: 'ProImplant X', marketShare: 32, price: 2500 },
        { name: 'BioFiller Plus', marketShare: 18, price: 450 },
        { name: 'OrthoFlex System', marketShare: 24, price: 12000 }
      ],
      recentMoves: ['Acquired startup BioInnovate', 'Launched AI planning tool', 'Expanded training centers'],
      threatLevel: 'high'
    },
    {
      competitor: 'Global Medical',
      marketShare: 19.8,
      revenue: 32000000,
      growthRate: 7.5,
      strengths: ['Cost leadership', 'Fast delivery', 'Flexible terms'],
      weaknesses: ['Quality concerns', 'Limited support', 'Narrow portfolio'],
      products: [
        { name: 'ValueImplant', marketShare: 15, price: 1800 },
        { name: 'QuickFill', marketShare: 22, price: 280 },
        { name: 'BasicOrtho', marketShare: 12, price: 8500 }
      ],
      recentMoves: ['Price reduction campaign', 'New distribution center', 'Partnership with GPOs'],
      threatLevel: 'medium'
    }
  ]);

  const [marketTrends] = useState<MarketTrend[]>([
    {
      trend: 'AI-Powered Diagnostics Adoption',
      impact: 'positive',
      timeframe: '6-12 months',
      affectedSegments: ['Oral Surgery', 'Orthopedics'],
      description: 'Rapid adoption of AI for treatment planning and outcome prediction',
      recommendations: ['Develop AI integration capabilities', 'Partner with tech providers', 'Train sales on AI benefits'],
      confidence: 87
    },
    {
      trend: 'Supply Chain Disruptions',
      impact: 'negative',
      timeframe: '3-6 months',
      affectedSegments: ['All segments'],
      description: 'Global supply chain issues affecting product availability',
      recommendations: ['Build inventory buffers', 'Diversify suppliers', 'Communicate proactively with customers'],
      confidence: 92
    },
    {
      trend: 'Shift to Outpatient Procedures',
      impact: 'positive',
      timeframe: '12-18 months',
      affectedSegments: ['Aesthetics & Dermatology', 'Orthopedics'],
      description: 'Growing preference for outpatient and same-day procedures',
      recommendations: ['Focus on portable solutions', 'Develop quick-procedure products', 'Target ASCs'],
      confidence: 78
    }
  ]);

  useEffect(() => {
    // Simulate loading market data
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

  const getGrowthIcon = (growth: number) => {
    if (growth > 10) return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
    if (growth > 0) return <TrendingUpIcon sx={{ color: theme.palette.warning.main }} />;
    if (growth === 0) return <FlatIcon sx={{ color: theme.palette.text.secondary }} />;
    return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
  };

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      case 'neutral': return theme.palette.warning.main;
    }
  };

  const getThreatColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'high': return theme.palette.error.main;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Loading market intelligence data...
        </Typography>
      </Box>
    );
  }

  const tabContent = [
    // Market Segments Tab
    <Box key="segments">
      <Grid container spacing={3}>
        {marketSegments.map((segment, index) => (
          <Grid item xs={12} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, ...glassEffects.effects.museum }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      {segment.segment}
                    </Typography>
                    {getGrowthIcon(segment.growth)}
                  </Box>
                }
                action={
                  <Chip 
                    label={`${segment.entryBarriers.toUpperCase()} BARRIERS`}
                    size="small"
                    sx={{ 
                      backgroundColor: alpha(
                        segment.entryBarriers === 'low' ? theme.palette.success.main :
                        segment.entryBarriers === 'medium' ? theme.palette.warning.main :
                        theme.palette.error.main, 0.1
                      ),
                      color: segment.entryBarriers === 'low' ? theme.palette.success.main :
                             segment.entryBarriers === 'medium' ? theme.palette.warning.main :
                             theme.palette.error.main,
                    }}
                  />
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" color="text.secondary">Market Size</Typography>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {formatCurrency(segment.size)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="success.main">
                          +{segment.growth}% YoY
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Opportunity</Typography>
                      <Typography variant="h6" color="secondary" fontWeight="bold">
                        {formatCurrency(segment.opportunity)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={segment.penetration}
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {segment.penetration}% market penetration
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Key Competitors
                    </Typography>
                    <List dense>
                      {segment.competitors.map((comp, idx) => (
                        <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <BusinessIcon fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText primary={comp} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Avg Deal Size</Typography>
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        {formatCurrency(segment.avgDealSize)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Market Trends
                    </Typography>
                    {segment.trends.map((trend, idx) => (
                      <Chip 
                        key={idx}
                        label={trend}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>,

    // Territory Analysis Tab
    <Box key="territory">
      <Grid container spacing={3}>
        {territoryInsights.map((territory, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, height: '100%', ...glassEffects.effects.museum }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="secondary" />
                    <Typography variant="h6" fontWeight="bold">
                      {territory.territory}
                    </Typography>
                  </Box>
                }
                action={
                  <Badge badgeContent={territory.opportunities} color="primary">
                    <TrophyIcon color="warning" />
                  </Badge>
                }
              />
              <CardContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Market Size</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatCurrency(territory.marketSize)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Current Revenue</Typography>
                    <Typography variant="h6" color="secondary" fontWeight="bold">
                      {formatCurrency(territory.currentRevenue)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Potential</Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {formatCurrency(territory.potential)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Growth Rate</Typography>
                    <Typography variant="h6" color="warning.main" fontWeight="bold">
                      +{territory.growthRate}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Market Penetration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((territory.currentRevenue / territory.marketSize) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(territory.currentRevenue / territory.marketSize) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Competitor Landscape
                  </Typography>
                  <Chip 
                    label={`${territory.competitorDensity.toUpperCase()} DENSITY`}
                    size="small"
                    sx={{ 
                      mb: 1,
                      backgroundColor: alpha(
                        territory.competitorDensity === 'low' ? theme.palette.success.main :
                        territory.competitorDensity === 'medium' ? theme.palette.warning.main :
                        theme.palette.error.main, 0.1
                      ),
                      color: territory.competitorDensity === 'low' ? theme.palette.success.main :
                             territory.competitorDensity === 'medium' ? theme.palette.warning.main :
                             theme.palette.error.main,
                    }}
                  />
                  {territory.topCompetitors.map((comp, idx) => (
                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{comp.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{comp.marketShare}%</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Facilities</Typography>
                    <Typography variant="h6" fontWeight="bold">{territory.facilities}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Population</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {(territory.population / 1000).toFixed(0)}K
                    </Typography>
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
        {competitorAnalysis.map((competitor, index) => (
          <Grid item xs={12} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, ...glassEffects.effects.museum }}>
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
                  <Chip 
                    label={`${competitor.threatLevel.toUpperCase()} THREAT`}
                    sx={{ 
                      backgroundColor: alpha(getThreatColor(competitor.threatLevel), 0.1),
                      color: getThreatColor(competitor.threatLevel),
                      fontWeight: 'bold'
                    }}
                  />
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Market Share</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {competitor.marketShare}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Annual Revenue</Typography>
                      <Typography variant="h6" color="secondary" fontWeight="bold">
                        {formatCurrency(competitor.revenue)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        {getGrowthIcon(competitor.growthRate)}
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {competitor.growthRate > 0 ? '+' : ''}{competitor.growthRate}% growth
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="success.main">
                      Strengths
                    </Typography>
                    <List dense>
                      {competitor.strengths.map((strength, idx) => (
                        <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="error.main">
                      Weaknesses
                    </Typography>
                    <List dense>
                      {competitor.weaknesses.map((weakness, idx) => (
                        <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}>
                            <WarningIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText primary={weakness} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.main">
                      Recent Strategic Moves
                    </Typography>
                    {competitor.recentMoves.map((move, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                        • {move}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Product Portfolio
                  </Typography>
                  <Grid container spacing={2}>
                    {competitor.products.map((product, idx) => (
                      <Grid item xs={12} sm={4} key={idx}>
                        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: alpha(theme.palette.background.paper, 0.5) }}>
                          <Typography variant="body2" fontWeight="bold">{product.name}</Typography>
                          <Typography variant="h6" color="primary">{formatCurrency(product.price)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.marketShare}% market share
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>,

    // Market Trends Tab
    <Box key="trends">
      <Grid container spacing={3}>
        {marketTrends.map((trend, index) => (
          <Grid item xs={12} key={index}>
            <Card elevation={0} sx={{ borderRadius: 3, ...glassEffects.effects.museum }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoGraphIcon sx={{ color: getImpactColor(trend.impact) }} />
                    <Typography variant="h6" fontWeight="bold">
                      {trend.trend}
                    </Typography>
                  </Box>
                }
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={trend.timeframe}
                      size="small"
                      icon={<ScheduleIcon />}
                    />
                    <CircularProgress 
                      variant="determinate" 
                      value={trend.confidence} 
                      size={40}
                      sx={{ color: getImpactColor(trend.impact) }}
                    />
                    <Typography variant="caption" sx={{ position: 'absolute', ml: 1.2 }}>
                      {trend.confidence}%
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {trend.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Affected Segments
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {trend.affectedSegments.map((segment, idx) => (
                      <Chip 
                        key={idx}
                        label={segment}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: getImpactColor(trend.impact) }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Strategic Recommendations
                  </Typography>
                  <List dense>
                    {trend.recommendations.map((rec, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <ArrowForwardIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Market Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            External market intelligence and competitive landscape analysis
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AIIcon />}
          onClick={() => navigate('/analytics')}
          color="warning"
        >
          Neural Core
        </Button>
      </Box>

      {/* Market Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" fontWeight="bold">
              $21.7M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Market Size
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5 }} />
              <Typography variant="caption" color="success.main">+13.2% YoY</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="secondary" fontWeight="bold">
              35%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Market Penetration
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <MapIcon sx={{ color: 'warning.main', mr: 0.5 }} />
              <Typography variant="caption" color="warning.main">7 territories</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              18
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Key Competitors
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <RadarIcon sx={{ color: 'error.main', mr: 0.5 }} />
              <Typography variant="caption" color="error.main">5 high threat</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              $13.5M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Opportunity Pipeline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <TrophyIcon sx={{ color: 'primary.main', mr: 0.5 }} />
              <Typography variant="caption" color="primary.main">172 opportunities</Typography>
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
                  <PieChartIcon />
                  Market Segments
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapIcon />
                  Territory Analysis
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
                  <ShowChartIcon />
                  Market Trends
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

export default MarketAnalytics;
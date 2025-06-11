// Market Intelligence Dashboard - Real-time market insights and competitive intelligence
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
  Tabs,
  Tab,
  Badge,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  Rating,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Newspaper as NewsIcon,
  Business as CompetitorIcon,
  Gavel as RegulatoryIcon,
  Science as TechnologyIcon,
  AttachMoney as PricingIcon,
  Merge as MergerIcon,
  Warning as AlertIcon,
  Lightbulb as OpportunityIcon,
  Speed as UrgentIcon,
  Timer as TimeIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  AutoAwesome as AIIcon,
  Rocket as LaunchIcon,
  Shield as ThreatIcon,
  EmojiEvents as WinIcon
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
  MarketFeed,
  CompetitorActivity,
  MarketTrend,
  MarketAlert,
  MarketOpportunity
} from '../../services/marketIntelligenceService';

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

interface MarketIntelligenceDashboardProps {
  userId?: string;
}

const MarketIntelligenceDashboard: React.FC<MarketIntelligenceDashboardProps> = ({ 
  userId = 'demo-user' 
}) => {
  const theme = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [selectedFeedTypes, setSelectedFeedTypes] = useState<MarketFeed['feed_type'][]>(['all'] as any);
  
  // Data
  const [marketFeeds, setMarketFeeds] = useState<MarketFeed[]>([]);
  const [competitorActivities, setCompetitorActivities] = useState<CompetitorActivity[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([]);
  const [marketOpportunities, setMarketOpportunities] = useState<MarketOpportunity[]>([]);
  const [marketSummary, setMarketSummary] = useState<any>(null);
  
  // UI State
  const [selectedFeed, setSelectedFeed] = useState<MarketFeed | null>(null);
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MarketAlert | null>(null);
  const [bookmarkedFeeds, setBookmarkedFeeds] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Real-time subscriptions
  const [feedSubscription, setFeedSubscription] = useState<string | null>(null);
  const [alertSubscription, setAlertSubscription] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadMarketData();
    setupSubscriptions();
    
    return () => {
      // Cleanup subscriptions
      if (feedSubscription) {
        marketIntelligenceService.unsubscribeFromMarketFeeds(feedSubscription);
      }
      if (alertSubscription) {
        marketIntelligenceService.unsubscribeFromMarketFeeds(alertSubscription);
      }
    };
  }, []);

  // Reload data when timeframe changes
  useEffect(() => {
    loadMarketData();
  }, [timeframe]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      // Load all data in parallel
      const [feeds, competitors, trends, alerts, opportunities, summary] = await Promise.all([
        marketIntelligenceService.getMarketFeeds({
          start_date: startDate.toISOString(),
          feed_types: selectedFeedTypes.includes('all' as any) ? undefined : selectedFeedTypes
        }),
        marketIntelligenceService.getCompetitorActivities({
          start_date: startDate.toISOString()
        }),
        marketIntelligenceService.getMarketTrends(),
        marketIntelligenceService.getMarketAlerts({
          active_only: true
        }),
        marketIntelligenceService.getMarketOpportunities({
          min_score: 60
        }),
        marketIntelligenceService.generateMarketSummary(timeframe)
      ]);

      setMarketFeeds(feeds);
      setCompetitorActivities(competitors);
      setMarketTrends(trends);
      setMarketAlerts(alerts);
      setMarketOpportunities(opportunities);
      setMarketSummary(summary);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSubscriptions = () => {
    // Subscribe to real-time feeds
    const feedSub = marketIntelligenceService.subscribeToMarketFeeds(
      (feed) => {
        setMarketFeeds(prev => [feed, ...prev]);
        // Show notification for high-relevance feeds
        if (feed.relevance_score > 0.8) {
          console.log('High relevance feed:', feed.title);
        }
      },
      { min_relevance: 0.5 }
    );
    setFeedSubscription(feedSub);

    // Subscribe to alerts
    const alertSub = marketIntelligenceService.subscribeToMarketAlerts(
      (alert) => {
        setMarketAlerts(prev => [alert, ...prev]);
        // Show notification for critical alerts
        if (alert.severity === 'critical') {
          console.log('Critical alert:', alert.title);
        }
      },
      { min_severity: 'warning' }
    );
    setAlertSubscription(alertSub);
  };

  const handleAcknowledgeAlert = async (alert: MarketAlert) => {
    try {
      await marketIntelligenceService.acknowledgeAlert(alert.id, userId);
      setMarketAlerts(prev => 
        prev.map(a => 
          a.id === alert.id 
            ? { ...a, acknowledged_by: userId, acknowledged_at: new Date().toISOString() }
            : a
        )
      );
      setAlertDialogOpen(false);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const toggleBookmark = (feedId: string) => {
    setBookmarkedFeeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feedId)) {
        newSet.delete(feedId);
      } else {
        newSet.add(feedId);
      }
      return newSet;
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getFeedIcon = (feedType: MarketFeed['feed_type']) => {
    const icons = {
      news: <NewsIcon />,
      regulatory: <RegulatoryIcon />,
      competitor: <CompetitorIcon />,
      technology: <TechnologyIcon />,
      pricing: <PricingIcon />,
      merger: <MergerIcon />,
      industry: <CategoryIcon />
    };
    return icons[feedType] || <NewsIcon />;
  };

  const getSentimentColor = (sentiment: MarketFeed['sentiment']) => {
    const colors = {
      positive: theme.palette.success.main,
      negative: theme.palette.error.main,
      neutral: theme.palette.grey[500]
    };
    return colors[sentiment];
  };

  // Chart data
  const competitorActivityChart = {
    labels: ['Product Launch', 'Pricing', 'Partnership', 'Expansion', 'Leadership'],
    datasets: [{
      label: 'Competitor Activities',
      data: [
        competitorActivities.filter(a => a.activity_type === 'product_launch').length,
        competitorActivities.filter(a => a.activity_type === 'pricing_change').length,
        competitorActivities.filter(a => a.activity_type === 'partnership').length,
        competitorActivities.filter(a => a.activity_type === 'expansion').length,
        competitorActivities.filter(a => a.activity_type === 'leadership_change').length
      ],
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderColor: theme.palette.primary.main,
      pointBackgroundColor: theme.palette.primary.main
    }]
  };

  const trendMomentumChart = {
    labels: marketTrends.slice(0, 5).map(t => t.trend_name),
    datasets: [{
      label: 'Growth Rate (%)',
      data: marketTrends.slice(0, 5).map(t => t.growth_rate),
      backgroundColor: marketTrends.slice(0, 5).map(t => 
        t.momentum === 'accelerating' ? theme.palette.success.main :
        t.momentum === 'decelerating' ? theme.palette.error.main :
        theme.palette.warning.main
      )
    }]
  };

  const opportunityScoreChart = {
    labels: ['Attractiveness', 'Feasibility', 'Strategic Fit'],
    datasets: marketOpportunities.slice(0, 3).map((opp, index) => ({
      label: opp.title.substring(0, 20) + '...',
      data: [
        opp.scoring.attractiveness,
        opp.scoring.feasibility,
        opp.scoring.strategic_fit
      ],
      borderColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main
      ][index],
      backgroundColor: alpha([
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main
      ][index], 0.2)
    }))
  };

  if (loading && !marketSummary) {
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
            Market Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time market insights and competitive intelligence
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
          <Badge badgeContent={marketAlerts.filter(a => !a.acknowledged_at).length} color="error">
            <Button
              variant="outlined"
              startIcon={<NotificationsIcon />}
              onClick={() => setCurrentTab(3)}
            >
              Alerts
            </Button>
          </Badge>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadMarketData}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Executive Summary Alert */}
      {marketSummary && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => setCurrentTab(4)}>
              View Details
            </Button>
          }
        >
          <AlertTitle>Executive Summary</AlertTitle>
          {marketSummary.executive_summary}
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
                    Market Feeds
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {marketFeeds.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +{Math.round(marketFeeds.length * 0.15)} new
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <NewsIcon />
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
                  <CompetitorIcon />
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
                    Opportunities
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {marketOpportunities.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={marketOpportunities[0]?.scoring.overall_score / 20 || 0}
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
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Active Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {marketAlerts.filter(a => !a.acknowledged_at).length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {marketAlerts.filter(a => a.severity === 'critical').length > 0 && (
                      <Chip 
                        label={`${marketAlerts.filter(a => a.severity === 'critical').length} critical`}
                        size="small"
                        color="error"
                      />
                    )}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                  <AlertIcon />
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
            <Tab label="Market Feeds" />
            <Tab label="Competitor Intelligence" />
            <Tab label="Market Trends" />
            <Tab label="Alerts & Actions" />
            <Tab label="Opportunities" />
          </Tabs>
        </Box>

        {/* Market Feeds Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Feed Type Filter */}
            <Box sx={{ mb: 3 }}>
              <ToggleButtonGroup
                value={selectedFeedTypes}
                onChange={(e, value) => setSelectedFeedTypes(value.length ? value : ['all'])}
                size="small"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="news">News</ToggleButton>
                <ToggleButton value="regulatory">Regulatory</ToggleButton>
                <ToggleButton value="competitor">Competitor</ToggleButton>
                <ToggleButton value="technology">Technology</ToggleButton>
                <ToggleButton value="pricing">Pricing</ToggleButton>
                <ToggleButton value="merger">M&A</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Feeds List */}
            <List>
              {marketFeeds.map((feed) => (
                <React.Fragment key={feed.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedFeed(feed);
                      setFeedDialogOpen(true);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        {getFeedIcon(feed.feed_type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {feed.title}
                          </Typography>
                          <Chip 
                            label={feed.feed_type}
                            size="small"
                            variant="outlined"
                          />
                          {feed.relevance_score > 0.8 && (
                            <Chip 
                              label="High Relevance"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {feed.summary || feed.content.substring(0, 150) + '...'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(feed.published_date).toLocaleDateString()}
                            </Typography>
                            <Chip 
                              label={feed.sentiment}
                              size="small"
                              sx={{
                                bgcolor: alpha(getSentimentColor(feed.sentiment), 0.1),
                                color: getSentimentColor(feed.sentiment)
                              }}
                            />
                            {feed.entities.companies.length > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {feed.entities.companies.join(', ')}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(feed.id);
                        }}
                      >
                        {bookmarkedFeeds.has(feed.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Competitor Intelligence Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Activity Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Activity Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Radar 
                      data={competitorActivityChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Timeline */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activities
                  </Typography>
                  <Timeline position="alternate">
                    {competitorActivities.slice(0, 5).map((activity, index) => (
                      <TimelineItem key={activity.id}>
                        <TimelineOppositeContent>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(activity.detected_date).toLocaleDateString()}
                          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot 
                            color={activity.impact_score > 7 ? 'error' : 'primary'}
                          >
                            {activity.activity_type === 'product_launch' ? <LaunchIcon /> :
                             activity.activity_type === 'partnership' ? <BusinessIcon /> :
                             <TrendingUpIcon />}
                          </TimelineDot>
                          {index < competitorActivities.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {activity.competitor_name}
                            </Typography>
                            <Typography variant="body2">
                              {activity.title}
                            </Typography>
                            {activity.impact_score > 7 && (
                              <Chip 
                                label="High Impact"
                                size="small"
                                color="error"
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Card>
              </Grid>

              {/* Competitive Response Recommendations */}
              <Grid item xs={12}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Recommended Responses
                  </Typography>
                  <List>
                    {competitorActivities
                      .filter(a => a.competitive_response)
                      .slice(0, 3)
                      .map((activity) => (
                        <ListItem key={activity.id}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                              <ThreatIcon color="warning" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {activity.description}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                  {activity.competitive_response?.suggested_actions.map((action, idx) => (
                                    <Chip 
                                      key={idx}
                                      label={action}
                                      size="small"
                                      variant="outlined"
                                      onClick={() => console.log('Action:', action)}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={activity.competitive_response?.urgency || 'medium'}
                              color={
                                activity.competitive_response?.urgency === 'immediate' ? 'error' :
                                activity.competitive_response?.urgency === 'high' ? 'warning' : 'default'
                              }
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

        {/* Market Trends Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Trend Momentum Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Trends by Growth Rate
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar 
                      data={trendMomentumChart}
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
                              text: 'Growth Rate (%)'
                            }
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Trend Cards */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {marketTrends.slice(0, 3).map((trend) => (
                    <Card key={trend.id} elevation={1}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6">
                            {trend.trend_name}
                          </Typography>
                          <Chip 
                            label={trend.momentum}
                            size="small"
                            color={
                              trend.momentum === 'accelerating' ? 'success' :
                              trend.momentum === 'decelerating' ? 'error' : 'default'
                            }
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {trend.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={`${trend.growth_rate}% growth`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip 
                              label={trend.time_horizon}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={trend.confidence_score} 
                            sx={{ width: 100, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        
                        <IconButton
                          size="small"
                          onClick={() => toggleExpanded(trend.id)}
                          sx={{ mt: 1 }}
                        >
                          <ExpandIcon 
                            sx={{ 
                              transform: expandedItems.has(trend.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </IconButton>
                        
                        <Collapse in={expandedItems.has(trend.id)}>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Key Drivers:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                              {trend.supporting_data.key_drivers.map((driver, idx) => (
                                <Chip key={idx} label={driver} size="small" />
                              ))}
                            </Stack>
                            
                            {trend.opportunities.length > 0 && (
                              <>
                                <Typography variant="subtitle2" gutterBottom>
                                  Opportunities:
                                </Typography>
                                {trend.opportunities.map((opp, idx) => (
                                  <Alert key={idx} severity="success" sx={{ mb: 1 }}>
                                    <Typography variant="body2">
                                      {opp.description}
                                    </Typography>
                                    <Typography variant="caption">
                                      Potential: ${(opp.potential_value / 1000).toFixed(0)}k • 
                                      Time to market: {opp.time_to_market} months
                                    </Typography>
                                  </Alert>
                                ))}
                              </>
                            )}
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Alerts & Actions Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            {marketAlerts.filter(a => !a.acknowledged_at).length === 0 ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                All alerts have been acknowledged. Great job staying on top of market changes!
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mb: 3 }}>
                {marketAlerts.filter(a => !a.acknowledged_at).length} alerts require your attention
              </Alert>
            )}

            <Stack spacing={2}>
              {marketAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  elevation={1}
                  sx={{ 
                    opacity: alert.acknowledged_at ? 0.6 : 1,
                    borderLeft: 4,
                    borderColor: 
                      alert.severity === 'critical' ? 'error.main' :
                      alert.severity === 'warning' ? 'warning.main' : 'info.main'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AlertIcon 
                            color={
                              alert.severity === 'critical' ? 'error' :
                              alert.severity === 'warning' ? 'warning' : 'info'
                            }
                          />
                          <Typography variant="h6">
                            {alert.title}
                          </Typography>
                          <Chip 
                            label={alert.alert_type}
                            size="small"
                            variant="outlined"
                          />
                          {alert.acknowledgement_required && !alert.acknowledged_at && (
                            <Chip 
                              label="Action Required"
                              size="small"
                              color="error"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {alert.description}
                        </Typography>
                        
                        {alert.recommended_actions.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Recommended Actions:
                            </Typography>
                            <Stack spacing={1}>
                              {alert.recommended_actions.map((action, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip 
                                    label={action.priority}
                                    size="small"
                                    color={
                                      action.priority === 'immediate' ? 'error' :
                                      action.priority === 'high' ? 'warning' : 'default'
                                    }
                                  />
                                  <Typography variant="body2">
                                    {action.action}
                                  </Typography>
                                  {action.deadline && (
                                    <Typography variant="caption" color="text.secondary">
                                      Due: {new Date(action.deadline).toLocaleDateString()}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {alert.affected_segments.map((segment, idx) => (
                            <Chip key={idx} label={segment} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.detected_at).toLocaleString()}
                        </Typography>
                        {!alert.acknowledged_at ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckIcon />}
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
                            icon={<CheckIcon />}
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

        {/* Opportunities Tab */}
        {currentTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Opportunity Scoring Chart */}
              <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Opportunity Comparison
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Radar 
                      data={opportunityScoreChart}
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

              {/* Top Opportunities */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {marketOpportunities.slice(0, 3).map((opportunity) => (
                    <Card key={opportunity.id} elevation={1}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6">
                              {opportunity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {opportunity.description}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                              {opportunity.scoring.overall_score}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Score
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Market Size
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${(opportunity.market_size / 1000000).toFixed(1)}M
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Time to Capture
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {opportunity.time_to_capture} months
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Investment Required
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              ${(opportunity.investment_required.min / 1000).toFixed(0)}k - 
                              ${(opportunity.investment_required.max / 1000).toFixed(0)}k
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Competition
                            </Typography>
                            <Chip 
                              label={opportunity.competition_level}
                              size="small"
                              color={
                                opportunity.competition_level === 'low' ? 'success' :
                                opportunity.competition_level === 'high' ? 'error' : 'warning'
                              }
                            />
                          </Grid>
                        </Grid>
                        
                        <Button 
                          variant="outlined" 
                          fullWidth
                          endIcon={<AnalyticsIcon />}
                        >
                          View Detailed Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Card>

      {/* Feed Details Dialog */}
      <Dialog 
        open={feedDialogOpen} 
        onClose={() => setFeedDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedFeed?.title}
        </DialogTitle>
        <DialogContent>
          {selectedFeed && (
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={selectedFeed.feed_type} />
                <Chip 
                  label={selectedFeed.sentiment}
                  sx={{
                    bgcolor: alpha(getSentimentColor(selectedFeed.sentiment), 0.1),
                    color: getSentimentColor(selectedFeed.sentiment)
                  }}
                />
                <Chip 
                  label={`Relevance: ${(selectedFeed.relevance_score * 100).toFixed(0)}%`}
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedFeed.content}
              </Typography>
              
              {selectedFeed.impact_analysis && (
                <Alert 
                  severity={
                    selectedFeed.impact_analysis.impact_level === 'critical' ? 'error' :
                    selectedFeed.impact_analysis.impact_level === 'high' ? 'warning' : 'info'
                  }
                  sx={{ mb: 2 }}
                >
                  <AlertTitle>Impact Analysis</AlertTitle>
                  <Typography variant="body2">
                    Impact Level: {selectedFeed.impact_analysis.impact_level}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Opportunities:</Typography>
                    <ul>
                      {selectedFeed.impact_analysis.opportunities.map((opp, idx) => (
                        <li key={idx}>{opp}</li>
                      ))}
                    </ul>
                  </Box>
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedFeed.entities.companies.map((company, idx) => (
                  <Chip key={idx} label={company} size="small" />
                ))}
                {selectedFeed.tags.map((tag, idx) => (
                  <Chip key={idx} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedDialogOpen(false)}>Close</Button>
          <Button startIcon={<ShareIcon />}>Share</Button>
          <Button startIcon={<AIIcon />} variant="contained">
            Analyze Impact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Acknowledgement Dialog */}
      <Dialog 
        open={alertDialogOpen} 
        onClose={() => setAlertDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Acknowledge Alert
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box>
              <Alert 
                severity={
                  selectedAlert.severity === 'critical' ? 'error' :
                  selectedAlert.severity === 'warning' ? 'warning' : 'info'
                }
                sx={{ mb: 2 }}
              >
                <AlertTitle>{selectedAlert.title}</AlertTitle>
                {selectedAlert.description}
              </Alert>
              
              <Typography variant="body2" paragraph>
                By acknowledging this alert, you confirm that you have reviewed the information 
                and will take appropriate action as recommended.
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
            startIcon={<CheckIcon />}
            onClick={() => selectedAlert && handleAcknowledgeAlert(selectedAlert)}
          >
            Acknowledge & Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketIntelligenceDashboard;
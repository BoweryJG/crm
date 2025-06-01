import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  LocationOn,
  Star,
  Instagram,
  BusinessCenter,
  People,
  Refresh,
  Map as MapIcon
} from '@mui/icons-material';
import regionalAnalyticsService, { RegionalInsight, MarketTrend, LocalBusinessData } from '../../services/analytics/regionalAnalyticsService';
import { useThemeContext } from '../../themes/ThemeContext';
import EliteLoadingScreen from '../common/EliteLoadingScreen';

interface RegionalAnalyticsProps {
  defaultCity?: string;
  defaultState?: string;
}

const RegionalAnalytics: React.FC<RegionalAnalyticsProps> = ({
  defaultCity = 'New York',
  defaultState = 'NY'
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [insights, setInsights] = useState<RegionalInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedState, setSelectedState] = useState(defaultState);

  const majorCities = [
    { city: 'New York', state: 'NY' },
    { city: 'Los Angeles', state: 'CA' },
    { city: 'Chicago', state: 'IL' },
    { city: 'Houston', state: 'TX' },
    { city: 'Miami', state: 'FL' },
    { city: 'Boston', state: 'MA' },
    { city: 'Seattle', state: 'WA' },
    { city: 'San Francisco', state: 'CA' },
    { city: 'Atlanta', state: 'GA' },
    { city: 'Dallas', state: 'TX' }
  ];

  useEffect(() => {
    fetchRegionalData();
  }, [selectedCity, selectedState]);

  const fetchRegionalData = async () => {
    setLoading(true);
    try {
      const data = await regionalAnalyticsService.getRegionalAnalytics(selectedCity, selectedState);
      setInsights(data);
    } catch (error) {
      console.error('Error fetching regional analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: MarketTrend['trend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp sx={{ color: theme.palette.success.main }} />;
      case 'decreasing':
        return <TrendingDown sx={{ color: theme.palette.error.main }} />;
      default:
        return <TrendingFlat sx={{ color: theme.palette.warning.main }} />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getCategoryIcon = (category: LocalBusinessData['category']) => {
    return <BusinessCenter sx={{ color: theme.palette.primary.main }} />;
  };

  if (loading) {
    return (
      <EliteLoadingScreen 
        loadingText="Loading Regional Intelligence"
        message="Analyzing market data, competitors, and demographics..."
        showPreview={true}
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
          Regional Market Intelligence
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Market</InputLabel>
            <Select
              value={`${selectedCity}, ${selectedState}`}
              label="Select Market"
              onChange={(e) => {
                const [city, state] = e.target.value.split(', ');
                setSelectedCity(city);
                setSelectedState(state);
              }}
            >
              {majorCities.map(({ city, state }) => (
                <MenuItem key={`${city}-${state}`} value={`${city}, ${state}`}>
                  {city}, {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchRegionalData} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {insights && (
        <Grid container spacing={3}>
          {/* Market Overview */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${
                  themeMode === 'space'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight="bold">
                    {insights.region}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Market Sentiment
                  </Typography>
                  <Chip
                    label={insights.marketSentiment.toUpperCase()}
                    sx={{
                      backgroundColor: getSentimentColor(insights.marketSentiment),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Market Composition
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label={`${insights.competitorActivity.length} Competitors`} size="small" />
                  <Chip label={`${insights.socialInfluencers.length} Influencers`} size="small" />
                  <Chip label={`${insights.topTrends.length} Active Trends`} size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Market Trends */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${
                  themeMode === 'space'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Market Trends
                </Typography>
                <List>
                  {insights.topTrends.map((trend, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent' }}>
                          {getTrendIcon(trend.trend)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {trend.procedure}
                            </Typography>
                            <Chip
                              label={`${trend.changePercentage > 0 ? '+' : ''}${trend.changePercentage}%`}
                              size="small"
                              color={trend.trend === 'increasing' ? 'success' : trend.trend === 'decreasing' ? 'error' : 'warning'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {trend.timeframe} • Key factors: {trend.keyFactors.slice(0, 2).join(', ')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Competitors */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${
                  themeMode === 'space'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Rated Competitors
                </Typography>
                <List>
                  {insights.competitorActivity
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((competitor, index) => (
                    <ListItem key={competitor.id}>
                      <ListItemAvatar>
                        <Avatar>
                          {getCategoryIcon(competitor.category)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={competitor.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                            <Typography variant="body2">
                              {competitor.rating} ({competitor.reviewCount} reviews)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Influencers */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${
                  themeMode === 'space'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Key Influencers
                </Typography>
                <List>
                  {insights.socialInfluencers.map((influencer, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>
                          <Instagram sx={{ color: theme.palette.secondary.main }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`@${influencer.username}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {influencer.followers.toLocaleString()} followers • {influencer.engagement}% engagement
                            </Typography>
                            <Chip label={influencer.platform} size="small" sx={{ mt: 0.5 }} />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographics */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                backgroundColor: themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : theme.palette.background.paper,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${
                  themeMode === 'space'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)'
                }`
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Demographics Profile
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" gutterBottom>Age Distribution</Typography>
                    {Object.entries(insights.demographics.ageGroups).map(([age, percentage]) => (
                      <Box key={age} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{age}</Typography>
                          <Typography variant="body2">{percentage}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" gutterBottom>Education Level</Typography>
                    {Object.entries(insights.demographics.education).map(([level, percentage]) => (
                      <Box key={level} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{level}</Typography>
                          <Typography variant="body2">{percentage}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" gutterBottom>Market Characteristics</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip 
                        label={`Income Level: ${insights.demographics.incomeLevel.toUpperCase()}`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip 
                        label="Target Demographic: 35-54"
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip 
                        label="High Education Market"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RegionalAnalytics;
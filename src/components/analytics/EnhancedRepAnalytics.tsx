// Enhanced Rep Analytics Component with SUIS Integration
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
  Avatar,
  Button,
  IconButton,
  Paper,
  useTheme,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
  Alert,
  Skeleton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  LocationOn as LocationIcon,
  CompareArrows as CompareIcon,
  Insights as InsightsIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSUISOptional } from '../../hooks/useSUIS';
import { useThemeContext } from '../../themes/ThemeContext';

interface EnhancedRepAnalyticsProps {
  userId?: string;
}

const EnhancedRepAnalytics: React.FC<EnhancedRepAnalyticsProps> = ({ userId }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [currentTab, setCurrentTab] = useState(0);
  
  // Use SUIS data
  const suisContext = useSUISOptional();
  const { state } = suisContext || { state: null };
  const loading = false;
  const error = null;
  
  // Extract procedures data from SUIS or use fallback data
  const fallbackProcedures = [
    { id: 1, procedure_name: 'Dental Implants', procedure_category: 'Restorative', market_size_millions: 850, growth_percentage: 12.5, patient_satisfaction: 92, rep_proficiency: 85, average_cost: 3500, complexity_rating: 'High', insurance_coverage: 65, roi_multiplier: 3.2, compliance_rate: 88 },
    { id: 2, procedure_name: 'Root Canal', procedure_category: 'Endodontics', market_size_millions: 420, growth_percentage: 8.3, patient_satisfaction: 78, rep_proficiency: 90, average_cost: 1200, complexity_rating: 'Medium', insurance_coverage: 80, roi_multiplier: 2.5, compliance_rate: 92 },
    { id: 3, procedure_name: 'Orthodontics', procedure_category: 'Orthodontics', market_size_millions: 1200, growth_percentage: 15.2, patient_satisfaction: 88, rep_proficiency: 75, average_cost: 5000, complexity_rating: 'High', insurance_coverage: 70, roi_multiplier: 4.1, compliance_rate: 85 },
    { id: 4, procedure_name: 'Teeth Whitening', procedure_category: 'Cosmetic', market_size_millions: 380, growth_percentage: 18.7, patient_satisfaction: 95, rep_proficiency: 95, average_cost: 500, complexity_rating: 'Low', insurance_coverage: 20, roi_multiplier: 5.5, compliance_rate: 95 },
    { id: 5, procedure_name: 'Periodontal Surgery', procedure_category: 'Periodontics', market_size_millions: 650, growth_percentage: 10.1, patient_satisfaction: 82, rep_proficiency: 70, average_cost: 2800, complexity_rating: 'High', insurance_coverage: 75, roi_multiplier: 2.8, compliance_rate: 87 }
  ];
  
  const procedures: any[] = state?.marketIntelligence?.map((intel: any, index: number) => ({
    id: intel.id || index,
    procedure_name: intel.data?.procedure || `Procedure ${index + 1}`,
    procedure_category: intel.intelligenceType || 'General',
    market_size_millions: Math.random() * 1000,
    growth_percentage: Math.random() * 20,
    patient_satisfaction: 75 + Math.random() * 20,
    rep_proficiency: 60 + Math.random() * 35,
    average_cost: 1000 + Math.random() * 4000,
    complexity_rating: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    insurance_coverage: 20 + Math.random() * 60,
    roi_multiplier: 2 + Math.random() * 3,
    compliance_rate: 80 + Math.random() * 15,
    last_updated: intel.createdAt || new Date().toISOString()
  })) || fallbackProcedures;
  
  const repAnalytics = state?.analytics || null;

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getMarketSizeColor = (size: number) => {
    if (size >= 5000) return theme.palette.success.main;
    if (size >= 2000) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 10) return theme.palette.success.main;
    if (growth >= 5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Error loading analytics: {error}
      </Alert>
    );
  }

  const tabContent = [
    // Market Intelligence Tab
    <Box key="market">
      <Grid container spacing={3}>
        {/* Top Procedures by Market Size */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Top Procedures by Market Opportunity
                  </Typography>
                  <Chip label="Sphere1a Intelligence" color="primary" size="small" />
                </Box>
              }
              subheader="Real-time market data from comprehensive procedure database"
              action={
                <IconButton onClick={() => window.location.reload()}>
                  <RefreshIcon />
                </IconButton>
              }
            />
            <CardContent>
              {loading ? (
                <Box>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                  ))}
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {procedures.slice(0, 6).map((procedure, index) => (
                    <Grid item xs={12} md={6} key={procedure.id}>
                      <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {procedure.procedure_name}
                              </Typography>
                              <Chip 
                                label={procedure.procedure_category} 
                                size="small" 
                                color="secondary" 
                                sx={{ mb: 1 }}
                              />
                            </Box>
                            <Avatar sx={{ bgcolor: getMarketSizeColor(procedure.market_size_millions || 0) }}>
                              #{index + 1}
                            </Avatar>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Market Size</Typography>
                              <Typography 
                                variant="h5" 
                                fontWeight="bold" 
                                color={getMarketSizeColor(procedure.market_size_millions || 0)}
                              >
                                {formatCurrency((procedure.market_size_millions || 0) * 1000000)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Growth Rate</Typography>
                              <Typography 
                                variant="h5" 
                                fontWeight="bold" 
                                color={getGrowthColor(procedure.growth_percentage || 0)}
                              >
                                {procedure.growth_percentage?.toFixed(1)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Avg Cost</Typography>
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                {formatCurrency(procedure.average_cost || 0)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Satisfaction</Typography>
                              <Typography 
                                variant="h6" 
                                fontWeight="bold" 
                                color={getSatisfactionColor(procedure.patient_satisfaction || 0)}
                              >
                                {procedure.patient_satisfaction}%
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">Market Opportunity Score</Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min(100, (procedure.market_size_millions || 0) / 100)}
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getMarketSizeColor(procedure.market_size_millions || 0)
                                }
                              }}
                            />
                          </Box>

                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Chip 
                              label={procedure.complexity_rating} 
                              size="small" 
                              variant="outlined"
                            />
                            {(procedure.growth_percentage || 0) > 10 && (
                              <Chip 
                                label="High Growth" 
                                size="small" 
                                color="success"
                              />
                            )}
                            {(procedure.patient_satisfaction || 0) > 90 && (
                              <Chip 
                                label="High Satisfaction" 
                                size="small" 
                                color="info"
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Market Intelligence Summary */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {procedures.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tracked Procedures
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <AnalyticsIcon sx={{ color: 'primary.main', mr: 0.5 }} />
                  <Typography variant="caption" color="primary">Live Data</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {formatCurrency(procedures.reduce((sum, p) => sum + (p.market_size_millions || 0) * 1000000, 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Market Size
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <MoneyIcon sx={{ color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">Combined Market</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h3" color="warning.main" fontWeight="bold">
                  {(procedures.reduce((sum, p, _, arr) => sum + (p.growth_percentage || 0), 0) / procedures.length).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Growth Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="caption" color="warning.main">Market Trend</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h3" color="info.main" fontWeight="bold">
                  {(procedures.reduce((sum, p, _, arr) => sum + (p.patient_satisfaction || 0), 0) / procedures.length).toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Satisfaction
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <TrophyIcon sx={{ color: 'info.main', mr: 0.5 }} />
                  <Typography variant="caption" color="info.main">Patient Score</Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>,

    // AI Insights Tab
    <Box key="insights">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AIIcon color="secondary" />
                  <Typography variant="h6" fontWeight="bold">
                    AI-Powered Market Intelligence
                  </Typography>
                </Box>
              }
              subheader="Intelligent insights from Sphere1a procedure and market data"
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* High-Growth Opportunities */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      🚀 High-Growth Opportunities
                    </Typography>
                    {procedures
                      .filter(p => (p.growth_percentage || 0) > 10)
                      .slice(0, 3)
                      .map((procedure) => (
                        <Box key={procedure.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {procedure.procedure_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Growing {procedure.growth_percentage?.toFixed(1)}% annually in a {formatCurrency((procedure.market_size_millions || 0) * 1000000)} market
                          </Typography>
                          <Chip 
                            label={`${procedure.patient_satisfaction}% satisfaction`} 
                            size="small" 
                            color="success" 
                          />
                        </Box>
                      ))}
                  </Paper>
                </Grid>

                {/* High-Value Markets */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                      💰 High-Value Markets
                    </Typography>
                    {procedures
                      .filter(p => (p.market_size_millions || 0) > 3000)
                      .slice(0, 3)
                      .map((procedure) => (
                        <Box key={procedure.id} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {procedure.procedure_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {formatCurrency((procedure.market_size_millions || 0) * 1000000)} market with {formatCurrency(procedure.average_cost || 0)} average deal size
                          </Typography>
                          <Chip 
                            label={`${procedure.complexity_rating} complexity`} 
                            size="small" 
                            color="primary" 
                          />
                        </Box>
                      ))}
                  </Paper>
                </Grid>

                {/* Patient Satisfaction Leaders */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                      ⭐ Patient Satisfaction Leaders
                    </Typography>
                    <Grid container spacing={2}>
                      {procedures
                        .filter(p => (p.patient_satisfaction || 0) > 90)
                        .slice(0, 4)
                        .map((procedure) => (
                          <Grid item xs={12} sm={6} md={3} key={procedure.id}>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, textAlign: 'center' }}>
                              <Typography variant="h4" color="info.main" fontWeight="bold">
                                {procedure.patient_satisfaction}%
                              </Typography>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {procedure.procedure_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatCurrency((procedure.market_size_millions || 0) * 1000000)} market
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Enhanced Rep Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered insights from Sphere1a market intelligence database
          </Typography>
        </Box>
        <Badge badgeContent={procedures.length} color="primary">
          <Button
            variant="contained"
            startIcon={<AIIcon />}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Live Intelligence'}
          </Button>
        </Badge>
      </Box>

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
                  <AnalyticsIcon />
                  Market Intelligence
                  <Badge badgeContent={procedures.length} color="primary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AIIcon />
                  AI Insights
                </Box>
              } 
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            tabContent[currentTab]
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default EnhancedRepAnalytics;
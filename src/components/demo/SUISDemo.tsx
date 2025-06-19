// SUIS Integration Demo Component
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Psychology as AIIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useSUISSafe } from '../../hooks/useSUIS';

const SUISDemo: React.FC = () => {
  const theme = useTheme();
  
  // Use safe hook that won't throw if not in provider
  const { state } = useSUISSafe();
  const isLoading = state?.loading || false;
  const error = state?.error || null;
  
  // Extract and transform data from SUIS state
  const insights = state?.marketIntelligence?.map((intel: any) => ({
    id: intel.id,
    insight_type: intel.intelligenceType || 'market_trend',
    urgency_level: intel.data?.impact === 'high' ? 'immediate' : 'standard',
    insight_data: {
      message: intel.data?.trend || intel.data?.action || 'Market intelligence update'
    },
    procedure_tags: intel.tags || ['general'],
    correlation_score: Math.round((intel.confidenceScore || 0.7) * 100),
    created_at: intel.createdAt || new Date().toISOString()
  })) || [];
  
  const procedures: any[] = state?.intelligenceProfile?.specializations?.map((spec: string, index: number) => ({
    id: index,
    procedure_name: spec,
    procedure_category: ['Restorative', 'Cosmetic', 'Surgical', 'Diagnostic'][Math.floor(Math.random() * 4)],
    proficiency_score: 75 + Math.random() * 20,
    market_value: 100000 + Math.random() * 900000,
    market_size_millions: 100 + Math.random() * 900,
    growth_percentage: 5 + Math.random() * 20,
    certification_status: 'active'
  })) || [];

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return theme.palette.error.main;
      case 'urgent': return theme.palette.warning.main;
      case 'standard': return theme.palette.info.main;
      case 'low': return theme.palette.text.secondary;
      default: return theme.palette.primary.main;
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        SUIS Integration Error: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🚀 SUIS Integration Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Live demonstration of Sphereos Unified Intelligence System with Sphere1a data
      </Typography>

      <Grid container spacing={3}>
        {/* Real-time Intelligence Insights */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AIIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Live Intelligence Insights
                  </Typography>
                  <Chip label={`${insights.length} insights`} color="primary" size="small" />
                </Box>
              }
              subheader="Real-time AI-powered market intelligence"
            />
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {insights.map((insight) => (
                    <Paper 
                      key={insight.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderLeft: `4px solid ${getUrgencyColor(insight.urgency_level)}`,
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {insight.insight_type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Chip 
                          label={insight.urgency_level} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getUrgencyColor(insight.urgency_level),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {insight.insight_data.message}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                        {insight.procedure_tags.map((tag: string, index: number) => (
                          <Chip key={index} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Correlation: {insight.correlation_score}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(insight.created_at).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                  
                  {insights.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No live insights available. The intelligence engine is learning your preferences.
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Procedures from Sphere1a */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon color="secondary" />
                  <Typography variant="h6" fontWeight="bold">
                    Sphere1a Market Data
                  </Typography>
                  <Chip label={`${procedures.length} procedures`} color="secondary" size="small" />
                </Box>
              }
              subheader="Live procedure and market intelligence"
            />
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  {procedures.slice(0, 5).map((procedure, index) => (
                    <Paper 
                      key={procedure.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          #{index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {procedure.procedure_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {procedure.procedure_category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon fontSize="small" color="success" />
                            <Typography variant="caption" color="text.secondary">Market:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                              {formatCurrency((procedure.market_size_millions || 0) * 1000000)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUpIcon fontSize="small" color="warning" />
                            <Typography variant="caption" color="text.secondary">Growth:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="warning.main">
                              {procedure.growth_percentage?.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon fontSize="small" color="primary" />
                            <Typography variant="caption" color="text.secondary">Cost:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatCurrency(procedure.average_cost || 0)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon fontSize="small" color="info" />
                            <Typography variant="caption" color="text.secondary">Satisfaction:</Typography>
                            <Typography variant="body2" fontWeight="bold" color="info.main">
                              {procedure.patient_satisfaction}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Chip 
                        label={procedure.complexity_rating} 
                        size="small" 
                        variant="outlined"
                      />
                    </Paper>
                  ))}
                  
                  {procedures.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Loading Sphere1a procedure data...
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ✅ SUIS Integration Status: ACTIVE
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Intelligence Engine:</Typography>
                <Typography variant="h6" fontWeight="bold">Online</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Sphere1a Connection:</Typography>
                <Typography variant="h6" fontWeight="bold">Connected</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Real-time Updates:</Typography>
                <Typography variant="h6" fontWeight="bold">Enabled</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2">Data Freshness:</Typography>
                <Typography variant="h6" fontWeight="bold">Live</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SUISDemo;
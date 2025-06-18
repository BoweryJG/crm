// SUIS Intelligence Dashboard
// Main dashboard showing predictive insights and analytics

import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, LinearProgress, IconButton, Alert, Button } from '@mui/material';
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useSUISFeatures } from '../hooks/useSUISFeatures';
import { PredictiveInsight, PerformanceMetrics } from '../types';

const IntelligenceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    insights, 
    metrics, 
    notifications,
    notificationSummary,
    loading,
    refreshInsights,
    refreshMetrics
  } = useSUISFeatures();

  const [selectedInsight, setSelectedInsight] = useState<PredictiveInsight | null>(null);
  
  // If no user, show login prompt
  if (!user) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: 2 
      }}>
        <Typography variant="h5">Authentication Required</Typography>
        <Typography variant="body1" color="text.secondary">
          The SUIS Intelligence Dashboard requires authentication to access.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Box>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <CheckCircle className="text-green-500" />;
      case 'risk':
        return <AlertTriangle className="text-red-500" />;
      case 'trend':
        return <TrendingUp className="text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="text-yellow-500" />;
      default:
        return <Lightbulb className="text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading intelligence data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          Intelligence Dashboard
        </Typography>
        <Box>
          <IconButton onClick={refreshInsights} disabled={loading}>
            <RefreshCw />
          </IconButton>
        </Box>
      </Box>

      {/* Notification Summary */}
      {notificationSummary && notificationSummary.actionRequired > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have {notificationSummary.actionRequired} notifications requiring action
        </Alert>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Conversion Rate
                </Typography>
                <Typography variant="h4">
                  {metrics.conversionRate.toFixed(1)}%
                </Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  {metrics.conversionRate > 30 ? (
                    <TrendingUp className="text-green-500" size={16} />
                  ) : (
                    <TrendingDown className="text-red-500" size={16} />
                  )}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Target: 35%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg Deal Size
                </Typography>
                <Typography variant="h4">
                  ${(metrics.averageDealSize / 1000).toFixed(0)}K
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Sales cycle: {metrics.salesCycleLength} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="h4">
                  {metrics.winRate.toFixed(0)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.winRate} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Engagement Score
                </Typography>
                <Typography variant="h4">
                  {metrics.engagementScore}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Activity level: {metrics.activityLevel}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Predictive Insights */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Predictive Insights
      </Typography>
      <Grid container spacing={3}>
        {insights.map((insight, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
              onClick={() => setSelectedInsight(insight)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    {getInsightIcon(insight.type)}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {insight.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label={insight.impact} 
                    color={getImpactColor(insight.impact)} 
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="textSecondary" paragraph>
                  {insight.description}
                </Typography>
                
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="textSecondary">
                      Confidence:
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={insight.confidence} 
                      sx={{ width: 60, height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption">
                      {insight.confidence}%
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="primary">
                    {insight.timeframe}
                  </Typography>
                </Box>

                {insight.actionRequired && (
                  <Chip 
                    label="Action Required" 
                    color="warning" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No insights message */}
      {insights.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              No insights available. System is analyzing your data...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Selected Insight Detail */}
      {selectedInsight && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Actions
            </Typography>
            {selectedInsight.suggestedActions?.map((action, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <CheckCircle size={16} className="text-blue-500" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {action}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default IntelligenceDashboard;
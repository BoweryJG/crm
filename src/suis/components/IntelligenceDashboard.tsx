// SUIS Intelligence Dashboard
// Main dashboard showing predictive insights and analytics

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  LinearProgress, 
  IconButton, 
  Alert, 
  Button, 
  Avatar, 
  Tooltip, 
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
  Paper
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Activity, 
  Users, 
  FileText, 
  Brain, 
  TrendingUp as TrendIcon, 
  BookOpen,
  BarChart3,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { useAuth } from '../../auth';
import { useNavigate } from 'react-router-dom';
import { useSUISFeatures } from '../hooks/useSUISFeatures';
import { PredictiveInsight, PerformanceMetrics } from '../types';
import { useAppMode } from '../../contexts/AppModeContext';
import { generateAllSUISMockData, IntelligenceMetrics, IntelligenceInsight } from '../../services/mockData/suisIntelligenceMockData';

// Helper type to unify IntelligenceInsight and PredictiveInsight
type UnifiedInsight = {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  aiGenerated?: boolean;
  timestamp: string;
};

const IntelligenceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const { 
    insights, 
    metrics, 
    notifications,
    notificationSummary,
    loading,
    refreshInsights,
    refreshMetrics
  } = useSUISFeatures();

  const [selectedInsight, setSelectedInsight] = useState<UnifiedInsight | null>(null);
  const [mockData, setMockData] = useState<ReturnType<typeof generateAllSUISMockData> | null>(null);
  const [demoLoading, setDemoLoading] = useState(true);

  useEffect(() => {
    if (isDemo || !user) {
      // Simulate loading delay for realism
      setTimeout(() => {
        setMockData(generateAllSUISMockData());
        setDemoLoading(false);
      }, 1000);
    }
  }, [isDemo, user]);

  // Show loading state for demo mode
  if ((isDemo || !user) && demoLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Initializing SUIS Intelligence System...</Typography>
      </Box>
    );
  }

  // Use mock data in demo mode or when not authenticated
  const displayMetrics: IntelligenceMetrics | null = (isDemo || !user) && mockData ? mockData.metrics : null;
  
  // Convert insights to unified format
  const displayInsights: UnifiedInsight[] = (isDemo || !user) && mockData 
    ? mockData.insights.map(i => ({
        id: i.id,
        type: i.type,
        title: i.title,
        description: i.description,
        priority: i.priority,
        impact: i.impact,
        aiGenerated: i.aiGenerated,
        timestamp: i.timestamp
      }))
    : insights.map((i, idx) => ({
        id: idx.toString(),
        type: i.type,
        title: i.title,
        description: i.description,
        priority: i.impact === 'high' ? 'high' : i.impact === 'medium' ? 'medium' : 'low',
        impact: i.impact === 'high' ? 8 : i.impact === 'medium' ? 5 : 3,
        aiGenerated: true,
        timestamp: new Date().toISOString()
      }));

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Users className="text-blue-500" size={20} />;
      case 'market':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'research':
        return <Brain className="text-purple-500" size={20} />;
      case 'learning':
        return <BookOpen className="text-orange-500" size={20} />;
      case 'content':
        return <FileText className="text-indigo-500" size={20} />;
      default:
        return <Lightbulb className="text-gray-500" size={20} />;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 8) return 'error';
    if (impact >= 5) return 'warning';
    return 'info';
  };

  const metricCards = [
    {
      title: 'Total Contacts',
      value: displayMetrics?.totalContacts || 0,
      icon: <Users />,
      color: '#3B82F6',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Engagements',
      value: displayMetrics?.activeEngagements || 0,
      icon: <Activity />,
      color: '#10B981',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'AI Interactions',
      value: displayMetrics?.aiInteractions || 0,
      icon: <Brain />,
      color: '#8B5CF6',
      change: '+45%',
      trend: 'up'
    },
    {
      title: 'Content Generated',
      value: displayMetrics?.contentGenerated || 0,
      icon: <FileText />,
      color: '#F59E0B',
      change: '+18%',
      trend: 'up'
    }
  ];

  if (loading && !isDemo && user) {
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
        <Box>
          <Typography variant="h4" fontWeight="bold">
            SUIS Intelligence Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            AI-Powered Insights & Predictive Analytics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {(isDemo || !user) && (
            <Chip 
              label="Demo Mode" 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
          )}
          <IconButton onClick={refreshInsights} disabled={loading || isDemo || !user}>
            <RefreshCw />
          </IconButton>
        </Box>
      </Box>

      {/* AI Summary Card */}
      <Card sx={{ 
        mb: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <Brain size={32} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                AI Intelligence Summary
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {displayInsights && displayInsights.length > 0 
                  ? `${displayInsights.filter(i => i.priority === 'high').length} high-priority insights require your attention. AI has analyzed ${displayMetrics?.dataPoints?.toLocaleString() || '0'} data points across your territory.`
                  : 'Analyzing territory data to generate insights...'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" fontWeight="bold">
                {displayMetrics?.learningProgress || 0}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                AI Optimization Score
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {metric.value.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {metric.trend === 'up' ? (
                        <TrendingUp size={16} style={{ color: '#10B981' }} />
                      ) : (
                        <TrendingDown size={16} style={{ color: '#EF4444' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 0.5, 
                          color: metric.trend === 'up' ? '#10B981' : '#EF4444' 
                        }}
                      >
                        {metric.change}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: metric.color, width: 48, height: 48 }}>
                    {React.cloneElement(metric.icon, { size: 24, color: 'white' })}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* AI Insights Feed */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Real-Time AI Insights
                </Typography>
                <Chip 
                  icon={<Zap size={16} />} 
                  label="Live" 
                  color="success" 
                  size="small" 
                  sx={{ animation: 'pulse 2s infinite' }}
                />
              </Box>
              
              <List sx={{ 
                maxHeight: 400, 
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.grey[300],
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: theme.palette.grey[400],
                },
              }}>
                {displayInsights && displayInsights.slice(0, 8).map((insight, index) => (
                  <React.Fragment key={insight.id}>
                    {index > 0 && <Divider />}
                    <ListItem 
                      button 
                      onClick={() => setSelectedInsight(insight)}
                      sx={{ 
                        py: 2,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'background.paper' }}>
                          {getInsightIcon(insight.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {insight.title}
                            </Typography>
                            {insight.aiGenerated && (
                              <Chip 
                                label="AI" 
                                size="small" 
                                sx={{ 
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: 'primary.main',
                                  color: 'white'
                                }} 
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {insight.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip 
                                label={insight.priority} 
                                size="small" 
                                color={getImpactColor(insight.impact)}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Impact Score: {insight.impact}/10
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                {new Date(insight.timestamp).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                AI-Powered Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => navigate('/intelligence/contacts')}
                  >
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <Users />
                    </Avatar>
                    <Typography variant="body2">Contact Universe</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => navigate('/intelligence/content')}
                  >
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <FileText />
                    </Avatar>
                    <Typography variant="body2">Content Generator</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => navigate('/intelligence/research')}
                  >
                    <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 1 }}>
                      <Brain />
                    </Avatar>
                    <Typography variant="body2">Research Assistant</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => navigate('/intelligence/market')}
                  >
                    <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}>
                      <BarChart3 />
                    </Avatar>
                    <Typography variant="body2">Market Intelligence</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* AI Achievements */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                AI Achievements
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                      <Award size={16} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Territory Leader"
                    secondary="Top 5% AI utilization"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'info.light', width: 32, height: 32 }}>
                      <Target size={16} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="Insight Hunter"
                    secondary="1,000+ insights actioned"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                      <Zap size={16} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary="AI Power User"
                    secondary="95% feature adoption"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IntelligenceDashboard;
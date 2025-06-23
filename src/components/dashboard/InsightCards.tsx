// Insight Cards - AI-powered insights display
// Swipeable cards with theme-aware styling and animations

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  IconButton,
  Button,
  useTheme,
  alpha,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  TrendingUp as OpportunityIcon,
  Warning as RiskIcon,
  Lightbulb as IdeaIcon,
  ArrowForward as ArrowIcon,
  Refresh as RefreshIcon,
  CheckCircle as ConfidenceIcon,
} from '@mui/icons-material';
import { ThemeAccents } from './ThemeAwareComponents';

interface Insight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  action?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface InsightCardsProps {
  themeAccents: ThemeAccents;
}

const InsightCards: React.FC<InsightCardsProps> = ({ themeAccents }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  
  // Mock insights data
  const insights: Insight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'High-Value Practice Expansion',
      description: 'Dr. Smith\'s practice shows 85% growth potential based on patient volume trends and market analysis.',
      impact: '$2.4M potential revenue',
      confidence: 92,
      action: 'Schedule strategic meeting',
      metrics: [
        { label: 'Patient Growth', value: '+45%' },
        { label: 'Market Share', value: '23%' },
        { label: 'Revenue Potential', value: '$2.4M' },
      ],
    },
    {
      id: '2',
      type: 'risk',
      title: 'Contract Renewal Alert',
      description: '3 major accounts require immediate attention for renewal within 30 days.',
      impact: '$850K at risk',
      confidence: 88,
      action: 'Review contracts',
      metrics: [
        { label: 'Accounts at Risk', value: '3' },
        { label: 'Revenue Impact', value: '$850K' },
        { label: 'Days to Renewal', value: '30' },
      ],
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Optimize Call Schedule',
      description: 'AI analysis suggests rebalancing territory visits could increase efficiency by 35%.',
      impact: '12 hours/week saved',
      confidence: 78,
      action: 'View optimization plan',
      metrics: [
        { label: 'Time Saved', value: '12 hrs' },
        { label: 'Efficiency Gain', value: '+35%' },
        { label: 'Coverage Increase', value: '+18%' },
      ],
    },
  ];
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <OpportunityIcon />;
      case 'risk':
        return <RiskIcon />;
      case 'recommendation':
        return <IdeaIcon />;
      default:
        return <AIIcon />;
    }
  };
  
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return themeAccents.success || '#00ff41';
      case 'risk':
        return themeAccents.error || '#ff0040';
      case 'recommendation':
        return themeAccents.primary;
      default:
        return themeAccents.secondary;
    }
  };
  
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon sx={{ color: themeAccents.primary, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
            AI-Powered Insights
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleRefresh} sx={{ color: themeAccents.primary }}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* Insight Cards */}
      {insights.map((insight, index) => {
        const insightColor = getInsightColor(insight.type);
        const isSelected = selectedInsight === insight.id;
        
        return (
          <Fade in key={insight.id} timeout={300 + index * 100}>
            <Card
              onClick={() => setSelectedInsight(isSelected ? null : insight.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(insightColor, 0.2)}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                '&:hover': {
                  borderColor: alpha(insightColor, 0.4),
                  background: alpha(theme.palette.background.paper, 0.8),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(insightColor, 0.2)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '4px',
                  background: insightColor,
                  opacity: 0.9,
                },
              }}
            >
              {/* Card Header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    background: alpha(insightColor, 0.1),
                    color: insightColor,
                  }}
                >
                  {getInsightIcon(insight.type)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    {insight.description}
                  </Typography>
                </Box>
              </Box>
              
              {/* Impact & Confidence */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={insight.impact}
                  size="small"
                  sx={{
                    backgroundColor: alpha(insightColor, 0.1),
                    color: insightColor,
                    fontWeight: 600,
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ConfidenceIcon sx={{ fontSize: 16, color: themeAccents.success }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {insight.confidence}% confidence
                  </Typography>
                </Box>
              </Box>
              
              {/* Metrics (shown when selected) */}
              {isSelected && insight.metrics && (
                <Fade in timeout={200}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 1,
                      mb: 2,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    {insight.metrics.map((metric, idx) => (
                      <Box key={idx} sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: insightColor,
                            fontSize: '1rem',
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.65rem',
                          }}
                        >
                          {metric.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Fade>
              )}
              
              {/* Action Button */}
              {insight.action && (
                <Button
                  endIcon={<ArrowIcon />}
                  size="small"
                  sx={{
                    color: insightColor,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    p: 0,
                    '&:hover': {
                      background: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {insight.action}
                </Button>
              )}
            </Card>
          </Fade>
        );
      })}
      
      {/* View All Link */}
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Button
          variant="text"
          sx={{
            color: themeAccents.primary,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              background: alpha(themeAccents.primary, 0.1),
            },
          }}
        >
          View all insights →
        </Button>
      </Box>
    </Box>
  );
};

export default InsightCards;
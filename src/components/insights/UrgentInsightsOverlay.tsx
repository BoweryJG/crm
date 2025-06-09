import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Button,
  Avatar,
  Fade,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as RevenueIcon,
  Warning as ThreatIcon,
  Schedule as UrgentIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Speed as VelocityIcon,
  Notifications as AlertIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface UrgentInsight {
  id: string;
  type: 'budget_approved' | 'competitor_threat' | 'decision_maker_change' | 'urgent_need' | 'contract_expiring' | 'champion_leaving';
  priority: 'critical' | 'high';
  practiceId: string;
  practiceName: string;
  revenue_impact: number;
  time_sensitivity: number; // hours until opportunity expires
  actionable_steps: string[];
  ai_confidence: number;
  data_sources: string[];
  timestamp: Date;
  contacted_decision_maker?: string;
  competitive_threat?: string;
  budget_size?: number;
}

const UrgentInsightsOverlay: React.FC = () => {
  const theme = useTheme();
  const [insights, setInsights] = useState<UrgentInsight[]>([]);
  const [currentInsight, setCurrentInsight] = useState<UrgentInsight | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate real-time urgent insights
    const generateMockInsights = (): UrgentInsight[] => {
      return [
        {
          id: '1',
          type: 'budget_approved',
          priority: 'critical',
          practiceId: 'practice-1',
          practiceName: 'Manhattan Oral Surgery',
          revenue_impact: 125000,
          time_sensitivity: 4, // 4 hours
          actionable_steps: [
            'Call Dr. Martinez immediately - budget approved for new CBCT',
            'Send detailed ROI proposal with same-day delivery options',
            'Schedule demo for tomorrow morning'
          ],
          ai_confidence: 94,
          data_sources: ['Practice Management System', 'Email Intelligence', 'Financial Signals'],
          timestamp: new Date(),
          budget_size: 150000
        },
        {
          id: '2',
          type: 'competitor_threat',
          priority: 'high',
          practiceId: 'practice-2',
          practiceName: 'Brooklyn Aesthetic Center',
          revenue_impact: 85000,
          time_sensitivity: 12,
          actionable_steps: [
            'Competitor presenting tomorrow - schedule urgent meeting today',
            'Prepare competitive battle card for Straumann vs Nobel',
            'Leverage existing relationship with Dr. Chen'
          ],
          ai_confidence: 87,
          data_sources: ['Competitive Intelligence', 'Social Media Monitoring', 'Industry Network'],
          timestamp: new Date(),
          competitive_threat: 'Nobel Biocare'
        },
        {
          id: '3',
          type: 'decision_maker_change',
          priority: 'critical',
          practiceId: 'practice-3',
          practiceName: 'Queens Dental Implant Center',
          revenue_impact: 95000,
          time_sensitivity: 24,
          actionable_steps: [
            'New practice manager hired - relationship reset required',
            'Send introduction package with success stories',
            'Schedule welcome meeting with gift basket'
          ],
          ai_confidence: 92,
          data_sources: ['LinkedIn Updates', 'Practice Website Changes', 'Network Intelligence'],
          timestamp: new Date(),
          contacted_decision_maker: 'Sarah Johnson, New Practice Manager'
        }
      ];
    };

    const mockInsights = generateMockInsights();
    setInsights(mockInsights);
    
    // Show first non-dismissed insight
    const nextInsight = mockInsights.find(insight => !dismissed.has(insight.id));
    if (nextInsight) {
      setCurrentInsight(nextInsight);
      setIsVisible(true);
    }
  }, [dismissed]);

  const handleDismiss = () => {
    if (currentInsight) {
      setDismissed(prev => new Set(Array.from(prev).concat(currentInsight.id)));
    }
    setIsVisible(false);
    
    // Show next insight after a delay
    setTimeout(() => {
      const nextInsight = insights.find(insight => 
        !dismissed.has(insight.id) && insight.id !== currentInsight?.id
      );
      if (nextInsight) {
        setCurrentInsight(nextInsight);
        setIsVisible(true);
      }
    }, 3000);
  };

  const handleTakeAction = () => {
    // Navigate to contact or deal details
    console.log('Taking action on:', currentInsight);
    handleDismiss();
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'budget_approved': return <MoneyIcon sx={{ color: '#4CAF50' }} />;
      case 'competitor_threat': return <ThreatIcon sx={{ color: '#F44336' }} />;
      case 'decision_maker_change': return <PersonIcon sx={{ color: '#FF9800' }} />;
      case 'urgent_need': return <UrgentIcon sx={{ color: '#2196F3' }} />;
      case 'contract_expiring': return <VelocityIcon sx={{ color: '#9C27B0' }} />;
      default: return <AlertIcon sx={{ color: theme.palette.primary.main }} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'budget_approved': return '#4CAF50';
      case 'competitor_threat': return '#F44336';
      case 'decision_maker_change': return '#FF9800';
      case 'urgent_need': return '#2196F3';
      case 'contract_expiring': return '#9C27B0';
      default: return theme.palette.primary.main;
    }
  };

  const getInsightTitle = (type: string) => {
    switch (type) {
      case 'budget_approved': return '💰 BUDGET APPROVED';
      case 'competitor_threat': return '⚠️ COMPETITOR THREAT';
      case 'decision_maker_change': return '👤 DECISION MAKER CHANGE';
      case 'urgent_need': return '🚨 URGENT NEED IDENTIFIED';
      case 'contract_expiring': return '⏰ CONTRACT EXPIRING';
      default: return '🔔 URGENT INSIGHT';
    }
  };

  if (!isVisible || !currentInsight) return null;

  return (
    <Fade in={isVisible}>
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          width: 400,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Paper
          elevation={24}
          sx={{
            background: `linear-gradient(135deg, ${getInsightColor(currentInsight.type)}15, rgba(255,255,255,0.95))`,
            border: `2px solid ${getInsightColor(currentInsight.type)}`,
            borderRadius: 3,
            overflow: 'hidden',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: `0 0 0 0 ${getInsightColor(currentInsight.type)}40` },
              '70%': { boxShadow: `0 0 0 10px ${getInsightColor(currentInsight.type)}00` },
              '100%': { boxShadow: `0 0 0 0 ${getInsightColor(currentInsight.type)}00` }
            }
          }}
        >
          {/* Breaking News Header */}
          <Box
            sx={{
              background: `linear-gradient(90deg, ${getInsightColor(currentInsight.type)}, ${getInsightColor(currentInsight.type)}CC)`,
              color: 'white',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getInsightIcon(currentInsight.type)}
              <Typography variant="h6" fontWeight="bold">
                BREAKING
              </Typography>
              <Chip
                label={currentInsight.priority.toUpperCase()}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            <IconButton size="small" onClick={handleDismiss} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Time Sensitivity Bar */}
          <Box sx={{ p: 0 }}>
            <LinearProgress
              variant="determinate"
              value={(24 - currentInsight.time_sensitivity) / 24 * 100}
              sx={{
                height: 6,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: currentInsight.time_sensitivity <= 4 ? '#F44336' : 
                          currentInsight.time_sensitivity <= 12 ? '#FF9800' : '#4CAF50'
                }
              }}
            />
            <Typography variant="caption" sx={{ p: 1, display: 'block', textAlign: 'center', fontWeight: 'bold' }}>
              ⏱️ {currentInsight.time_sensitivity} hours remaining
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color={getInsightColor(currentInsight.type)}>
              {getInsightTitle(currentInsight.type)}
            </Typography>
            
            <Alert 
              severity={currentInsight.priority === 'critical' ? 'error' : 'warning'}
              sx={{ mb: 2 }}
            >
              <strong>{currentInsight.practiceName}</strong> - Revenue Impact: ${currentInsight.revenue_impact.toLocaleString()}
            </Alert>

            {/* Key Details */}
            <Box sx={{ mb: 3 }}>
              {currentInsight.budget_size && (
                <Chip 
                  icon={<MoneyIcon />}
                  label={`Budget: $${currentInsight.budget_size.toLocaleString()}`}
                  sx={{ mr: 1, mb: 1 }}
                  color="success"
                />
              )}
              {currentInsight.competitive_threat && (
                <Chip 
                  icon={<ThreatIcon />}
                  label={`Threat: ${currentInsight.competitive_threat}`}
                  sx={{ mr: 1, mb: 1 }}
                  color="error"
                />
              )}
              {currentInsight.contacted_decision_maker && (
                <Chip 
                  icon={<PersonIcon />}
                  label={currentInsight.contacted_decision_maker}
                  sx={{ mr: 1, mb: 1 }}
                  color="primary"
                />
              )}
              <Chip 
                label={`${currentInsight.ai_confidence}% AI Confidence`}
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            </Box>

            {/* Action Steps */}
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🎯 Immediate Actions Required:
            </Typography>
            <Box sx={{ mb: 3 }}>
              {currentInsight.actionable_steps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      bgcolor: getInsightColor(currentInsight.type),
                      fontSize: '12px',
                      mr: 1,
                      mt: 0.5
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  <Typography variant="body2">
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Data Sources */}
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              📊 Intelligence Sources: {currentInsight.data_sources.join(', ')}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleTakeAction}
                sx={{
                  bgcolor: getInsightColor(currentInsight.type),
                  '&:hover': {
                    bgcolor: getInsightColor(currentInsight.type) + 'DD'
                  }
                }}
              >
                🚀 Take Action Now
              </Button>
              <Button
                variant="outlined"
                onClick={handleDismiss}
                sx={{
                  borderColor: getInsightColor(currentInsight.type),
                  color: getInsightColor(currentInsight.type)
                }}
              >
                Later
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default UrgentInsightsOverlay;
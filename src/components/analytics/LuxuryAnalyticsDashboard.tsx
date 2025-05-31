import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Paper,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { AviationDashboard, MarketSentimentGauge } from '../gauges/AviationGauges';
import { useThemeContext } from '../../themes/ThemeContext';

interface LuxuryAnalyticsDashboardProps {
  data: {
    regional: {
      marketSentiment: number;
      competitorActivity: number;
      demographicScore: number;
      socialMediaEngagement: number;
    };
    linguistics: {
      averageWinRate: number;
      averagePersuasionScore: number;
      averageTalkTimeRatio: number;
      averageConfidence: number;
    };
    performance: {
      totalCalls: number;
      conversionRate: number;
      revenueGrowth: number;
      customerSatisfaction: number;
    };
  };
}

const LuxuryAnalyticsDashboard: React.FC<LuxuryAnalyticsDashboardProps> = ({ data }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();

  if (themeMode !== 'luxury') {
    return null; // Only render in luxury theme
  }

  return (
    <Box
      sx={{
        p: 3,
        background: `
          radial-gradient(circle at 20% 80%, rgba(201, 176, 55, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(232, 232, 232, 0.03) 0%, transparent 50%),
          linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)
        `,
        borderRadius: 4,
        border: '1px solid rgba(201, 176, 55, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: '#C9B037',
          textAlign: 'center',
          mb: 4,
          textShadow: '0 0 10px rgba(201, 176, 55, 0.3)'
        }}
      >
        Executive Intelligence Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Regional Market Intelligence */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 176, 55, 0.3)',
              borderRadius: 3
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon sx={{ color: '#C9B037' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Orbitron", monospace',
                      color: '#C9B037',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em'
                    }}
                  >
                    REGIONAL INTELLIGENCE
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <AviationDashboard
                metrics={{
                  marketSentiment: data.regional.marketSentiment,
                  winProbability: data.regional.competitorActivity,
                  persuasionScore: data.regional.demographicScore,
                  confidence: data.regional.socialMediaEngagement
                }}
                size="small"
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="Market Analysis Active" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(201, 176, 55, 0.2)', color: '#C9B037' }}
                />
                <Chip 
                  label="Real-time Social Data" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(232, 232, 232, 0.1)', color: '#E8E8E8' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversational Intelligence */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 176, 55, 0.3)',
              borderRadius: 3
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PsychologyIcon sx={{ color: '#C9B037' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Orbitron", monospace',
                      color: '#C9B037',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em'
                    }}
                  >
                    LINGUISTICS AI
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <AviationDashboard
                metrics={{
                  winProbability: data.linguistics.averageWinRate,
                  persuasionScore: data.linguistics.averagePersuasionScore,
                  talkTimeRatio: data.linguistics.averageTalkTimeRatio,
                  confidence: data.linguistics.averageConfidence
                }}
                size="small"
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="Deep Learning Active" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(201, 176, 55, 0.2)', color: '#C9B037' }}
                />
                <Chip 
                  label="Psychological Profiling" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(232, 232, 232, 0.1)', color: '#E8E8E8' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 176, 55, 0.3)',
              borderRadius: 3
            }}
          >
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon sx={{ color: '#C9B037' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Orbitron", monospace',
                      color: '#C9B037',
                      fontWeight: 'bold',
                      letterSpacing: '0.1em'
                    }}
                  >
                    PERFORMANCE COMMAND CENTER
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(201, 176, 55, 0.1), rgba(232, 232, 232, 0.05))',
                      border: '1px solid rgba(201, 176, 55, 0.3)',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Orbitron", monospace',
                        color: '#C9B037',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(201, 176, 55, 0.5)'
                      }}
                    >
                      {data.performance.totalCalls.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#E8E8E8',
                        fontFamily: '"Orbitron", monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Total Calls
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.1), rgba(232, 232, 232, 0.05))',
                      border: '1px solid rgba(6, 214, 160, 0.3)',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Orbitron", monospace',
                        color: '#06D6A0',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(6, 214, 160, 0.5)'
                      }}
                    >
                      {data.performance.conversionRate.toFixed(1)}%
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#E8E8E8',
                        fontFamily: '"Orbitron", monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Conversion Rate
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.1), rgba(232, 232, 232, 0.05))',
                      border: '1px solid rgba(0, 180, 216, 0.3)',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Orbitron", monospace',
                        color: '#00B4D8',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(0, 180, 216, 0.5)'
                      }}
                    >
                      +{data.performance.revenueGrowth.toFixed(1)}%
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#E8E8E8',
                        fontFamily: '"Orbitron", monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Revenue Growth
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(255, 176, 0, 0.1), rgba(232, 232, 232, 0.05))',
                      border: '1px solid rgba(255, 176, 0, 0.3)',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Orbitron", monospace',
                        color: '#FFB000',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(255, 176, 0, 0.5)'
                      }}
                    >
                      {data.performance.customerSatisfaction.toFixed(1)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#E8E8E8',
                        fontFamily: '"Orbitron", monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}
                    >
                      CSAT Score
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LuxuryAnalyticsDashboard;
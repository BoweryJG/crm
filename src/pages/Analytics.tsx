import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom,
  Stack
} from '@mui/material';
import {
  AccountCircle as RepIcon,
  TrendingUp as MarketIcon,
  AutoAwesome as AIIcon,
  ArrowForward as ArrowIcon,
  Psychology as InsightIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Radar as RadarIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../themes/ThemeContext';
import glassEffects from '../themes/glassEffects';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredPath, setHoveredPath] = useState<'rep' | 'market' | null>(null);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.03)}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              ANALYTICS HUB
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 200, 
                letterSpacing: '0.05em', 
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Choose Your Analytics Path
            </Typography>
      
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: 600, mx: 'auto' }}>
              Deep dive into performance metrics and market intelligence to optimize your sales strategy
            </Typography>
          </Box>
        </Fade>

        {/* Fork in the Road - Two Path Options */}
        <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
          {/* Rep Analytics Path */}
          <Grid item xs={12} md={5}>
            <Zoom in timeout={800}>
              <Card
                elevation={0}
                onMouseEnter={() => setHoveredPath('rep')}
                onMouseLeave={() => setHoveredPath(null)}
                sx={{
                  height: '100%',
                  ...glassEffects.effects.museum,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.primary.main, hoveredPath === 'rep' ? 0.5 : 0.2)}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
                onClick={() => navigate('/analytics/rep')}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        mb: 2,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 300, mb: 1 }}>
                      Rep Analytics
                    </Typography>
                    <Chip 
                      label="SELF ANALYSIS" 
                      size="small" 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                      }} 
                    />
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
                    Analyze your personal performance, efficiency, and growth opportunities
                  </Typography>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SpeedIcon fontSize="small" color="primary" />
                      <Typography variant="body2">Performance Dashboards</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimelineIcon fontSize="small" color="primary" />
                      <Typography variant="body2">Activity Tracking</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RadarIcon fontSize="small" color="primary" />
                      <Typography variant="body2">Skill Analysis</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InsightIcon fontSize="small" color="primary" />
                      <Typography variant="body2">AI Coaching</Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowIcon />}
                      sx={{
                        py: 1.5,
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Analyze My Performance
                    </Button>
                  </Box>
                </CardContent>

                {/* Animated Border Effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    transform: hoveredPath === 'rep' ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.4s ease',
                  }}
                />
              </Card>
            </Zoom>
          </Grid>

          {/* Market Analytics Path */}
          <Grid item xs={12} md={5}>
            <Zoom in timeout={900}>
              <Card
                elevation={0}
                onMouseEnter={() => setHoveredPath('market')}
                onMouseLeave={() => setHoveredPath(null)}
                sx={{
                  height: '100%',
                  ...glassEffects.effects.museum,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.secondary.main, hoveredPath === 'market' ? 0.5 : 0.2)}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
                  },
                }}
                onClick={() => navigate('/analytics/market')}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        mb: 2,
                      }}
                    >
                      <MarketIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 300, mb: 1 }}>
                      Market Analytics
                    </Typography>
                    <Chip 
                      label="EXTERNAL ANALYSIS" 
                      size="small" 
                      sx={{ 
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                      }} 
                    />
                  </Box>

                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: theme.palette.text.secondary }}>
                    Analyze market trends, territories, and opportunities
                  </Typography>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">Territory Analysis</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RadarIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">Competitive Intelligence</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MarketIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">Market Trends</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InsightsIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">Opportunity Detection</Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowIcon />}
                      sx={{
                        py: 1.5,
                        backgroundColor: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      Explore Market Data
                    </Button>
                  </Box>
                </CardContent>

                {/* Animated Border Effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main}, transparent)`,
                    transform: hoveredPath === 'market' ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.4s ease',
                  }}
                />
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Neural Core AI Section */}
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              ...glassEffects.effects.goldInfused,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.02)}, ${alpha(theme.palette.background.paper, 0.8)})`,
              textAlign: 'center',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                mb: 2,
              }}
            >
              <AIIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
            </Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 300 }}>
              Neural Core AI Insights
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
              Advanced AI-powered insights available in both analytics paths
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Chip icon={<InsightIcon />} label="Predictive Analytics" variant="outlined" />
              <Chip icon={<AnalyticsIcon />} label="Pattern Recognition" variant="outlined" />
              <Chip icon={<AIIcon />} label="Smart Recommendations" variant="outlined" />
            </Stack>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Analytics;

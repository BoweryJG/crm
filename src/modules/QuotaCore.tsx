// QuotaCore - Kinetic Performance Metrics
// Progress bars that twist like Richard Serra's torqued steel
// Creating tension and momentum through motion

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  IconButton,
  LinearProgress,
  CircularProgress,
  Fade,
  Grow,
  Collapse,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  LocalFireDepartment as FireIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  NavigateBefore as BackIcon,
  Refresh as RefreshIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Monolith,
  MonolithStat,
  GalleryContainer,
  ExhibitionGrid,
  Gallery,
} from '../components/gallery';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';

// Kinetic Progress Bar Component
const KineticProgress: React.FC<{
  value: number;
  label: string;
  target?: number;
  height?: number;
  variant?: 'straight' | 'torqued' | 'twisted';
}> = ({ value, label, target = 100, height = 60, variant = 'torqued' }) => {
  const theme = useTheme();
  const percentage = Math.min((value / target) * 100, 100);
  
  // Create torqued effect with skew transform
  const torqueAngle = variant === 'torqued' ? 2 : variant === 'twisted' ? 5 : 0;
  const perspectiveDistance = variant === 'twisted' ? 800 : 1000;
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: theme.palette.text.secondary }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
          {value.toLocaleString()} / {target.toLocaleString()}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'relative',
          height,
          backgroundColor: alpha(theme.palette.background.paper, 0.3),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden',
          perspective: `${perspectiveDistance}px`,
          transform: `skewY(${torqueAngle}deg)`,
          transition: animations.utils.createTransition(
            animations.durations.cinematic,
            animations.easings.metal
          ).transition,
          '&:hover': {
            transform: `skewY(${torqueAngle * 1.5}deg)`,
          },
        }}
      >
        {/* Background grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent, transparent 20px, ${alpha(theme.palette.primary.main, 0.05)} 20px, ${alpha(theme.palette.primary.main, 0.05)} 21px)
            `,
            pointerEvents: 'none',
          }}
        />
        
        {/* Progress fill */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(135deg, 
              ${theme.palette.primary.main}, 
              ${alpha(theme.palette.primary.main, 0.7)},
              ${theme.palette.primary.main}
            )`,
            boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.3)}`,
            transition: animations.utils.createTransition(
              animations.durations.deliberate,
              animations.easings.monolith
            ).transition,
            transformStyle: 'preserve-3d',
            transform: variant === 'twisted' ? 'rotateY(-5deg)' : 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '2px',
              height: '100%',
              backgroundColor: theme.palette.common.white,
              boxShadow: `0 0 20px ${theme.palette.common.white}`,
              opacity: 0.8,
            },
          }}
        />
        
        {/* Percentage text */}
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 100,
              letterSpacing: '0.1em',
              color: percentage > 70 ? theme.palette.background.default : theme.palette.text.primary,
              textShadow: percentage > 70 ? `0 0 10px ${alpha(theme.palette.background.default, 0.5)}` : 'none',
            }}
          >
            {Math.round(percentage)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Velocity Gauge Component
const VelocityGauge: React.FC<{
  current: number;
  previous: number;
  label: string;
}> = ({ current, previous, label }) => {
  const theme = useTheme();
  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;
  
  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography variant="overline" sx={{ color: theme.palette.text.secondary, letterSpacing: '0.2em' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        <IconButton
          sx={{
            color: isPositive ? theme.palette.primary.main : theme.palette.error.main,
            transform: isPositive ? 'rotate(-45deg)' : 'rotate(45deg)',
            transition: animations.utils.createTransition().transition,
          }}
        >
          {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 100,
            letterSpacing: '0.1em',
            mx: 2,
            color: isPositive ? theme.palette.primary.main : theme.palette.error.main,
          }}
        >
          {Math.abs(change).toFixed(1)}%
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
        vs. last period
      </Typography>
    </Box>
  );
};

// Main QuotaCore Component
const QuotaCore: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simulate data refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };
  
  // Mock data - in real app, this would come from API
  const metrics = {
    revenue: { current: 847000, target: 1000000, previous: 720000 },
    calls: { current: 1247, target: 1500, previous: 1180 },
    meetings: { current: 89, target: 100, previous: 76 },
    deals: { current: 24, target: 30, previous: 21 },
    pipeline: { current: 2400000, target: 3000000, previous: 2100000 },
  };
  
  const periodButtons = [
    { value: 'daily', label: 'DAY' },
    { value: 'weekly', label: 'WEEK' },
    { value: 'monthly', label: 'MONTH' },
    { value: 'quarterly', label: 'QUARTER' },
  ];
  
  return (
    <GalleryContainer maxWidth="xl">
      <Fade in timeout={animations.durations.cinematic}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/command-room')}
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              COMMAND ROOM
            </Button>
            
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              PERFORMANCE METRICS
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 100,
                  letterSpacing: '0.2em',
                }}
              >
                QUOTACORE
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <IconButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:disabled': {
                      color: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <RefreshIcon sx={{ animation: isRefreshing ? `spin 1s linear infinite` : 'none' }} />
                </IconButton>
                
                {periodButtons.map((period) => (
                  <Button
                    key={period.value}
                    variant={selectedPeriod === period.value ? 'contained' : 'outlined'}
                    onClick={() => setSelectedPeriod(period.value as any)}
                    sx={{
                      borderRadius: 0,
                      px: 3,
                      borderWidth: 2,
                      minWidth: 80,
                    }}
                  >
                    {period.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>
          
          {/* Velocity Overview */}
          <ExhibitionGrid columns={{ xs: 1, sm: 2, md: 4 }} spacing={3}>
            <Monolith variant="goldInfused" hover="subtle" animationDelay={0}>
              <VelocityGauge
                current={metrics.revenue.current}
                previous={metrics.revenue.previous}
                label="REVENUE VELOCITY"
              />
            </Monolith>
            
            <Monolith variant="carbon" hover="subtle" animationDelay={100}>
              <VelocityGauge
                current={metrics.calls.current}
                previous={metrics.calls.previous}
                label="CALL VELOCITY"
              />
            </Monolith>
            
            <Monolith variant="obsidian" hover="subtle" animationDelay={200}>
              <VelocityGauge
                current={metrics.meetings.current}
                previous={metrics.meetings.previous}
                label="MEETING VELOCITY"
              />
            </Monolith>
            
            <Monolith variant="frostedSteel" hover="subtle" animationDelay={300}>
              <VelocityGauge
                current={metrics.deals.current}
                previous={metrics.deals.previous}
                label="DEAL VELOCITY"
              />
            </Monolith>
          </ExhibitionGrid>
          
          <Gallery.Space height={40} />
          
          {/* Kinetic Progress Bars */}
          <ExhibitionGrid columns={{ xs: 1, md: 2 }} spacing={4}>
            <Monolith
              title="REVENUE PROGRESS"
              subtitle="Torqued momentum towards target"
              variant="museum"
              animationDelay={400}
            >
              <KineticProgress
                value={metrics.revenue.current}
                target={metrics.revenue.target}
                label="CURRENT PERIOD REVENUE"
                variant="torqued"
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    DAILY AVERAGE
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, letterSpacing: '0.1em' }}>
                    ${Math.round(metrics.revenue.current / 30).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    PROJECTED END
                  </Typography>
                  <Typography variant="h6" sx={{ letterSpacing: '0.1em' }}>
                    ${Math.round(metrics.revenue.current * 1.2).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Monolith>
            
            <Monolith
              title="ACTIVITY METRICS"
              subtitle="Sculpted performance indicators"
              variant="carbon"
              animationDelay={500}
            >
              <Stack spacing={3}>
                <KineticProgress
                  value={metrics.calls.current}
                  target={metrics.calls.target}
                  label="CALLS COMPLETED"
                  height={40}
                  variant="straight"
                />
                
                <KineticProgress
                  value={metrics.meetings.current}
                  target={metrics.meetings.target}
                  label="MEETINGS BOOKED"
                  height={40}
                  variant="torqued"
                />
                
                <KineticProgress
                  value={metrics.deals.current}
                  target={metrics.deals.target}
                  label="DEALS CLOSED"
                  height={40}
                  variant="twisted"
                />
              </Stack>
            </Monolith>
          </ExhibitionGrid>
          
          <Gallery.Space height={40} />
          
          {/* Pipeline Sculpture */}
          <Monolith
            title="PIPELINE SCULPTURE"
            subtitle="Your sales funnel as kinetic art"
            variant="obsidian"
            animationDelay={600}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <KineticProgress
                  value={metrics.pipeline.current}
                  target={metrics.pipeline.target}
                  label="TOTAL PIPELINE VALUE"
                  height={80}
                  variant="twisted"
                />
                
                {/* Stage breakdown */}
                <Stack spacing={2} sx={{ mt: 4 }}>
                  {[
                    { stage: 'DISCOVERY', value: 680000, color: alpha(theme.palette.primary.main, 0.3) },
                    { stage: 'QUALIFICATION', value: 920000, color: alpha(theme.palette.primary.main, 0.5) },
                    { stage: 'PROPOSAL', value: 540000, color: alpha(theme.palette.primary.main, 0.7) },
                    { stage: 'NEGOTIATION', value: 260000, color: theme.palette.primary.main },
                  ].map((stage, index) => (
                    <Box key={stage.stage}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                          {stage.stage}
                        </Typography>
                        <Typography variant="body2" sx={{ color: stage.color }}>
                          ${stage.value.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 20,
                          backgroundColor: alpha(theme.palette.background.paper, 0.3),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          position: 'relative',
                          overflow: 'hidden',
                          transform: `skewX(${-15 + index * 5}deg)`,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: `${(stage.value / metrics.pipeline.target) * 100}%`,
                            backgroundColor: stage.color,
                            transition: animations.utils.createTransition(
                              animations.durations.deliberate,
                              animations.easings.monolith
                            ).transition,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...glassEffects.effects.carbon,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <FireIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="overline" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    HOT DEALS
                  </Typography>
                  <Typography variant="h2" sx={{ fontWeight: 100, color: theme.palette.primary.main }}>
                    12
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                    CLOSING THIS WEEK
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Monolith>
          
          {/* Performance Art */}
          <Gallery.Space height={80} pattern="grid" />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                mb: 2,
                color: theme.palette.text.secondary,
              }}
            >
              YOUR METRICS ARE YOUR MASTERPIECE
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                letterSpacing: '0.05em',
              }}
            >
              Every number tells a story. Every percentage is a brushstroke. 
              Your performance is a living sculpture, constantly evolving.
            </Typography>
          </Box>
        </Box>
      </Fade>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </GalleryContainer>
  );
};

export default QuotaCore;
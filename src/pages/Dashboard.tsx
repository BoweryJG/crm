import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CardHeader,
  CardContent,
  useTheme,
  Skeleton,
  Button
} from '@mui/material';
import DashboardStats from '../components/dashboard/DashboardStats';
import QuickCallWidget from '../components/dashboard/QuickCallWidget';
import NowCardsStack from '../components/dashboard/NowCardsStack'; // Added import
import ClassicRevenueGauge from '../components/gauges/ClassicRevenueGauge';
import QuantumLuxuryGauge from '../components/gauges/QuantumLuxuryGauge';
import MasterpieceGauge from '../components/gauges/MasterpieceGauge';
import LiveActionTicker from '../components/dashboard/LiveActionTicker';
import CommandCenterFeed from '../components/dashboard/CommandCenterFeed';
import MissionBriefingCard from '../components/dashboard/MissionBriefingCard';
import { useThemeContext } from '../themes/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../contexts/DashboardDataContext';
import { useAuth } from '../auth';
import { getUserDisplayName } from '../utils/userHelpers';
import { useSound } from '../hooks/useSound';
import { useSoundContext } from '../contexts/SoundContext';

// Helper function to generate random integers
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const { user, loading: authLoading } = useAuth();
  const { dashboardData, loading, mockActivities, mockTasks } = useDashboardData();
  const [gaugeStyle, setGaugeStyle] = React.useState<'quantum' | 'masterpiece'>('masterpiece');
  
  // Sound test
  const { soundEnabled } = useSoundContext();
  const testSound = useSound('ui-click-primary');
  
  // Debug auth state
  React.useEffect(() => {
    console.log('Dashboard - Auth state:', { 
      user: user?.email, 
      authLoading,
      fullName: user?.user_metadata?.full_name,
      displayName: getUserDisplayName(user)
    });
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Live Action Ticker - Award-Winning Real-Time Insights */}
      <Box sx={{ mb: 3, mx: -3, mt: -3 }}>
        <LiveActionTicker />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Welcome back, {getUserDisplayName(user)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your sales performance and activity
        </Typography>
      </Box>

      {/* Sound Debug Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => {
            console.log('Sound test - Enabled:', soundEnabled);
            testSound.play();
          }}
          sx={{ 
            borderColor: soundEnabled ? 'success.main' : 'error.main',
            color: soundEnabled ? 'success.main' : 'error.main'
          }}
        >
          Test Sound (Sound: {soundEnabled ? 'ON' : 'OFF'})
        </Button>
        
        {/* Gauge Style Selector */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
          onClick={() => setGaugeStyle('quantum')}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            fontSize: '0.875rem',
            backgroundColor: gaugeStyle === 'quantum' ? 'primary.main' : 'transparent',
            color: gaugeStyle === 'quantum' ? 'primary.contrastText' : 'text.secondary',
            border: '1px solid',
            borderColor: gaugeStyle === 'quantum' ? 'primary.main' : 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: gaugeStyle === 'quantum' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Quantum Style
        </Box>
        <Box
          onClick={() => setGaugeStyle('masterpiece')}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            fontSize: '0.875rem',
            backgroundColor: gaugeStyle === 'masterpiece' ? 'primary.main' : 'transparent',
            color: gaugeStyle === 'masterpiece' ? 'primary.contrastText' : 'text.secondary',
            border: '1px solid',
            borderColor: gaugeStyle === 'masterpiece' ? 'primary.main' : 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: gaugeStyle === 'masterpiece' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Masterpiece
        </Box>
        </Box>
      </Box>

      {/* Revenue Gauges Dashboard */}
      <Box sx={{ mb: 4, overflow: 'visible' }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: { xs: 3, sm: 4 },
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          '& > *': {
            maxWidth: '100%',
            overflow: 'visible'
          }
        }}>
          {loading || !dashboardData ? (
            // Show loading skeletons
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="circular" width={260} height={260} />
            ))
          ) : gaugeStyle === 'quantum' ? (
            // Quantum style gauges
            <>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <QuantumLuxuryGauge 
                  value={Math.round(dashboardData.revenue_generated / 1000)} // Normalize to 0-100
                  label="REVENUE"
                  animationDelay={0}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <QuantumLuxuryGauge 
                  value={Math.round((dashboardData.pipeline_value / 2000000) * 100)} // Normalize to 0-100
                  label="PIPELINE"
                  animationDelay={200}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <QuantumLuxuryGauge 
                  value={dashboardData.quota_percentage}
                  label="QUOTA"
                  animationDelay={400}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <QuantumLuxuryGauge 
                  value={dashboardData.conversion_rate}
                  label="CONVERSION"
                  animationDelay={600}
                />
              </Box>
            </>
          ) : (
            // Masterpiece style gauges
            <>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <MasterpieceGauge 
                  value={Math.round(dashboardData.revenue_generated / 10000)} // Normalize to 0-100
                  label="REVENUE"
                  dataSource="CRM Analytics"
                  size="medium"
                  nightMode={false}
                  soundEnabled={true}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <MasterpieceGauge 
                  value={Math.round((dashboardData.pipeline_value / 2000000) * 100)} // Normalize to 0-100
                  label="PIPELINE"
                  dataSource="Sales Data"
                  size="medium"
                  nightMode={false}
                  soundEnabled={true}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <MasterpieceGauge 
                  value={dashboardData.quota_percentage}
                  label="QUOTA"
                  dataSource="Performance"
                  size="medium"
                  nightMode={false}
                  soundEnabled={true}
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 300, sm: 300, md: 300 }, padding: 1 }}>
                <MasterpieceGauge 
                  value={dashboardData.conversion_rate}
                  label="CONVERSION"
                  dataSource="Metrics"
                  size="medium"
                  nightMode={false}
                  soundEnabled={true}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <DashboardStats />
      </Box>

      {/* Now Cards Stack - Added Section */}
      <Box sx={{ mb: 4 }}>
        <NowCardsStack />
      </Box>

      {/* Quick Actions and Communications */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
          <Box>
            <QuickCallWidget />
          </Box>
          <Box>
            {/* Additional widgets can go here */}
          </Box>
        </Box>
      </Box>

      {/* Recent Activities and Upcoming Tasks - Industrial Style */}
      <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, height: 400 }}>
        {!loading && dashboardData ? (
          <>
            <CommandCenterFeed 
              activities={mockActivities} 
              title="Activity Monitor" 
            />
            <MissionBriefingCard 
              tasks={mockTasks} 
              title="Mission Queue" 
            />
          </>
        ) : (
          <>
            <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
          </>
        )}
      </Box>

      {/* Market Intelligence Preview - Tactical Display */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Tactical header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{
                fontFamily: '"Orbitron", monospace',
                fontWeight: 700,
                color: '#00ff41',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Market Intelligence
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  background: 'rgba(0, 255, 65, 0.1)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    color: '#00ff41',
                    fontWeight: 600,
                  }}
                >
                  SIGNAL: STRONG
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                }}
              >
                [{new Date().toLocaleTimeString('en-US', { hour12: false })}]
              </Typography>
            </Box>
          </Box>

          {/* Data grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
            <Box
              sx={{
                p: 2,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 255, 65, 0.1)',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 1,
                }}
              >
                Dental Implant Sector
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 900,
                  color: '#00ff41',
                  textShadow: '0 0 20px #00ff41',
                }}
              >
                +{getRandomInt(12, 18)}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#999',
                }}
              >
                Minimally invasive demand surge
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 170, 0, 0.1)',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#666',
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 1,
                }}
              >
                Aesthetic Procedures
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 900,
                  color: '#ffaa00',
                  textShadow: '0 0 20px #ffaa00',
                }}
              >
                +{getRandomInt(20, 25)}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: '#999',
                }}
              >
                Injectable treatments growth
              </Typography>
            </Box>
          </Box>

          {/* Strategic alert */}
          <Box
            sx={{
              p: 2,
              background: 'rgba(255, 0, 64, 0.05)',
              border: '1px solid rgba(255, 0, 64, 0.2)',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#ff0040',
                textTransform: 'uppercase',
                fontWeight: 600,
                display: 'block',
                mb: 0.5,
              }}
            >
              Strategic Opportunity Detected:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: '#ccc',
                fontSize: '0.85rem',
              }}
            >
              Regional practices showing 73% interest in combined dental-aesthetic treatment packages. 
              Cross-selling opportunity index: HIGH. Recommend bundled solution positioning.
            </Typography>
          </Box>

          {/* Status line */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#666',
                fontSize: '0.7rem',
              }}
            >
              DATA SOURCE: MARKET ANALYTICS ENGINE v2.3
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: '#666',
                fontSize: '0.7rem',
              }}
            >
              LAST SYNC: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>

          {/* Grid overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,255,65,0.05) 20px, rgba(0,255,65,0.05) 21px),
                repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,255,65,0.05) 20px, rgba(0,255,65,0.05) 21px)
              `,
              pointerEvents: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

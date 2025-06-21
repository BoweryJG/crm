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
import LuxuryGauge from '../components/gauges/LuxuryGauge';
import QuantumLuxuryGauge from '../components/gauges/QuantumLuxuryGauge';
import MasterpieceGauge from '../components/gauges/MasterpieceGauge';
import LiveActionTicker from '../components/dashboard/LiveActionTicker';
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
  const [gaugeStyle, setGaugeStyle] = React.useState<'luxury' | 'quantum' | 'masterpiece'>('masterpiece');
  
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
            onClick={() => setGaugeStyle('luxury')}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            fontSize: '0.875rem',
            backgroundColor: gaugeStyle === 'luxury' ? 'primary.main' : 'transparent',
            color: gaugeStyle === 'luxury' ? 'primary.contrastText' : 'text.secondary',
            border: '1px solid',
            borderColor: gaugeStyle === 'luxury' ? 'primary.main' : 'divider',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: gaugeStyle === 'luxury' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Luxury Style
        </Box>
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
      <Box sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: { xs: 2, sm: 3 },
          justifyContent: 'center',
          justifyItems: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          '& > *': {
            maxWidth: '100%',
            overflow: 'hidden'
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
              <QuantumLuxuryGauge 
                value={Math.round(dashboardData.revenue_generated / 1000)} // Normalize to 0-100
                label="REVENUE"
                animationDelay={0}
              />
              <QuantumLuxuryGauge 
                value={Math.round((dashboardData.pipeline_value / 2000000) * 100)} // Normalize to 0-100
                label="PIPELINE"
                animationDelay={200}
              />
              <QuantumLuxuryGauge 
                value={dashboardData.quota_percentage}
                label="QUOTA"
                animationDelay={400}
              />
              <QuantumLuxuryGauge 
                value={dashboardData.conversion_rate}
                label="CONVERSION"
                animationDelay={600}
              />
            </>
          ) : gaugeStyle === 'masterpiece' ? (
            // Masterpiece style gauges
            <>
              <MasterpieceGauge 
                value={Math.round(dashboardData.revenue_generated / 10000)} // Normalize to 0-100
                label="REVENUE"
                dataSource="CRM Analytics"
                size="medium"
                nightMode={false}
                soundEnabled={true}
              />
              <MasterpieceGauge 
                value={Math.round((dashboardData.pipeline_value / 2000000) * 100)} // Normalize to 0-100
                label="PIPELINE"
                dataSource="Sales Data"
                size="medium"
                nightMode={false}
                soundEnabled={true}
              />
              <MasterpieceGauge 
                value={dashboardData.quota_percentage}
                label="QUOTA"
                dataSource="Performance"
                size="medium"
                nightMode={false}
                soundEnabled={true}
              />
              <MasterpieceGauge 
                value={dashboardData.conversion_rate}
                label="CONVERSION"
                dataSource="Metrics"
                size="medium"
                nightMode={false}
                soundEnabled={true}
              />
            </>
          ) : (
            // Luxury style gauges
            <>
              <Box sx={{ width: '100%', maxWidth: { xs: 200, sm: 220, md: 260 } }}>
                <LuxuryGauge 
                  value={Math.round(dashboardData.revenue_generated / 100000)} // Value in K
                  displayValue={Math.round(dashboardData.revenue_generated / 100000)} // Display in K
                  label="REVENUE"
                  unit="K"
                  max={1000} // Max 1M
                  size="medium"
                  onClick={() => navigate('/analytics')}
                  animationDelay={0}
                  colorMode="gold"
                  variant="revenue-gold"
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 200, sm: 220, md: 260 } }}>
                <LuxuryGauge 
                  value={Math.round(dashboardData.pipeline_value / 100000)} // Value in K
                  displayValue={Math.round(dashboardData.pipeline_value / 100000)} // Display in K
                  label="PIPELINE"
                  unit="K"
                  max={2000} // Max 2M
                  size="medium"
                  onClick={() => navigate('/analytics')}
                  animationDelay={200}
                  colorMode="primary"
                  variant="pipeline-plasma"
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 200, sm: 220, md: 260 } }}>
                <LuxuryGauge 
                  value={dashboardData.quota_percentage} // Already a percentage
                  displayValue={dashboardData.quota_percentage}
                  label="QUOTA"
                  unit="%"
                  max={100}
                  size="medium"
                  onClick={() => navigate('/analytics')}
                  animationDelay={400}
                  colorMode="auto"
                  variant="quota-crimson"
                />
              </Box>
              <Box sx={{ width: '100%', maxWidth: { xs: 200, sm: 220, md: 260 } }}>
                <LuxuryGauge 
                  value={dashboardData.conversion_rate} // Already a percentage
                  displayValue={dashboardData.conversion_rate}
                  label="CONVERSION"
                  unit="%"
                  max={100}
                  size="medium"
                  onClick={() => navigate('/analytics')}
                  animationDelay={600}
                  colorMode="auto"
                  variant="conversion-neon"
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

      {/* Recent Activities and Upcoming Tasks */}
      <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: 3,
            backgroundColor: themeMode === 'space'
              ? 'rgba(22, 27, 44, 0.7)'
              : theme.palette.background.paper,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${
              themeMode === 'space'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
            }`
          }}
        >
          <CardHeader
            title="Recent Activities"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {!loading && dashboardData ? (
                // Use activities from context
                mockActivities.map((activity: any) => (
                  <Box
                    key={activity.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: themeMode === 'space'
                        ? 'rgba(10, 14, 23, 0.5)'
                        : 'rgba(245, 247, 250, 0.5)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={500}>
                        {activity.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.timeAgo}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {activity.type.includes('added') ? 'Added ' : ''}{activity.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Loading activities...
                </Typography>
              )}
            </Box>
          </CardContent>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: 3,
            backgroundColor: themeMode === 'space'
              ? 'rgba(22, 27, 44, 0.7)'
              : theme.palette.background.paper,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${
              themeMode === 'space'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
            }`
          }}
        >
          <CardHeader
            title="Upcoming Tasks"
            titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              {!loading && dashboardData ? (
                // Use tasks from context
                mockTasks.map((task: any) => (
                  <Box
                    key={task.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: themeMode === 'space'
                        ? 'rgba(10, 14, 23, 0.5)'
                        : 'rgba(245, 247, 250, 0.5)',
                      borderLeft: task.priority === 'High' ? `4px solid ${theme.palette.error.main}` : 
                                 task.priority === 'Medium' ? `4px solid ${theme.palette.warning.main}` : 
                                 `4px solid ${theme.palette.success.main}`
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" fontWeight={500}>
                        {task.type}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={task.dueDate === 'Today' ? "error.main" : 
                               task.dueDate === 'Tomorrow' ? "warning.main" : 
                               "text.secondary"}
                      >
                        {task.dueDate}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {task.description}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  Loading tasks...
                </Typography>
              )}
            </Box>
          </CardContent>
        </Paper>
      </Box>

      {/* Market Intelligence Preview */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: themeMode === 'space'
              ? 'rgba(22, 27, 44, 0.7)'
              : theme.palette.background.paper,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${
              themeMode === 'space'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
            }`
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Market Intelligence
          </Typography>
          <Typography variant="body2" paragraph>
            Recent trends in the dental implant market show a {getRandomInt(12, 18)}% increase in demand for minimally invasive procedures. 
            Aesthetic procedures, particularly for injectables, have seen a {getRandomInt(20, 25)}% growth in the last quarter.
          </Typography>
          <Typography variant="body2" paragraph>
            Key opportunity: Practices in your region are increasingly interested in combined treatment packages that 
            integrate both dental and aesthetic procedures for comprehensive patient care.
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 2, color: 'text.secondary' }}>
            Market data refreshed {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CardHeader,
  CardContent,
  useTheme,
  Skeleton
} from '@mui/material';
import DashboardStats from '../components/dashboard/DashboardStats';
import QuickCallWidget from '../components/dashboard/QuickCallWidget';
import NowCardsStack from '../components/dashboard/NowCardsStack'; // Added import
import ClassicRevenueGauge from '../components/gauges/ClassicRevenueGauge';
import LiveActionTicker from '../components/dashboard/LiveActionTicker';
import { useThemeContext } from '../themes/ThemeContext';
import { getMockDashboardData } from '../services/mockData/mockDataService';
import { dashboardService, DashboardMetrics } from '../services/supabase/dashboardService';
import { useAuth } from '../auth';
import { useAppMode } from '../contexts/AppModeContext';
import { useNavigate } from 'react-router-dom';

// Helper function to generate random integers
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      if (isDemo || !user?.id) {
        // Use mock data in demo mode or when not authenticated
        const mockData = getMockDashboardData();
        setDashboardData({
          user_id: user?.id || 'demo',
          total_contacts: mockData.stats.totalContacts,
          contacts_change: mockData.stats.contactsChange,
          active_practices: mockData.stats.activePractices,
          practices_change: mockData.stats.practicesChange,
          revenue_generated: mockData.stats.revenueGenerated,
          revenue_change: mockData.stats.revenueChange,
          active_campaigns: mockData.stats.activeCampaigns,
          campaigns_change: mockData.stats.campaignsChange,
          sales_goal: mockData.stats.salesGoal,
          current_revenue: mockData.stats.currentRevenue,
          sales_goal_progress: mockData.stats.salesGoalProgress,
          quota_percentage: mockData.stats.salesGoalProgress, // Sync with sales goal progress
          pipeline_value: mockData.stats.revenueGenerated * 1.5, // Mock pipeline value
          conversion_rate: 45 // Mock conversion rate
        });
      } else {
        // Load real data from Supabase
        let metrics = await dashboardService.getMetrics(user.id);
        
        // If no metrics exist, initialize them
        if (!metrics) {
          await dashboardService.initializeMetrics(user.id);
          metrics = await dashboardService.getMetrics(user.id);
        }
        
        if (metrics) {
          // Sync percentages to ensure quota matches sales goal progress
          await dashboardService.syncPercentages(user.id);
          // Reload to get synced data
          metrics = await dashboardService.getMetrics(user.id);
          setDashboardData(metrics);
        } else {
          // Fallback to mock data if something goes wrong
          const mockData = getMockDashboardData();
          setDashboardData({
            user_id: user.id,
            total_contacts: mockData.stats.totalContacts,
            contacts_change: mockData.stats.contactsChange,
            active_practices: mockData.stats.activePractices,
            practices_change: mockData.stats.practicesChange,
            revenue_generated: mockData.stats.revenueGenerated,
            revenue_change: mockData.stats.revenueChange,
            active_campaigns: mockData.stats.activeCampaigns,
            campaigns_change: mockData.stats.campaignsChange,
            sales_goal: mockData.stats.salesGoal,
            current_revenue: mockData.stats.currentRevenue,
            sales_goal_progress: mockData.stats.salesGoalProgress,
            quota_percentage: mockData.stats.salesGoalProgress,
            pipeline_value: mockData.stats.revenueGenerated * 1.5,
            conversion_rate: 45
          });
        }
      }
      
      setLoading(false);
    };
    
    loadDashboardData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, isDemo]);

  return (
    <Box>
      {/* Live Action Ticker - Award-Winning Real-Time Insights */}
      <Box sx={{ mb: 3, mx: -3, mt: -3 }}>
        <LiveActionTicker />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Welcome back, {user?.email?.split('@')[0] || user?.user_metadata?.full_name || 'User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your sales performance and activity
        </Typography>
      </Box>

      {/* Revenue Gauges Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          justifyContent: 'center'
        }}>
          {loading || !dashboardData ? (
            // Show loading skeletons
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="circular" width={260} height={260} />
            ))
          ) : (
            <>
              <ClassicRevenueGauge 
                value={Math.min(180, (dashboardData.revenue_generated / 1000000) * 180)} // Convert to gauge scale
                displayValue={Math.round(dashboardData.revenue_generated / 1000)} // Show in K
                label="REVENUE"
                size="medium"
                onClick={() => navigate('/analytics')}
                animationDelay={0}
              />
              <ClassicRevenueGauge 
                value={Math.min(180, (dashboardData.pipeline_value / 1000000) * 180)} // Convert to gauge scale
                displayValue={Math.round(dashboardData.pipeline_value / 1000)} // Show in K
                label="PIPELINE"
                size="medium"
                onClick={() => navigate('/analytics')}
                animationDelay={200}
              />
              <ClassicRevenueGauge 
                value={Math.min(180, (dashboardData.quota_percentage / 100) * 180)} // Convert percentage to gauge scale
                displayValue={dashboardData.quota_percentage} // Show percentage
                label="QUOTA"
                size="medium"
                onClick={() => navigate('/analytics')}
                animationDelay={400}
              />
              <ClassicRevenueGauge 
                value={Math.min(180, (dashboardData.conversion_rate / 100) * 180)} // Convert percentage to gauge scale
                displayValue={dashboardData.conversion_rate} // Show percentage
                label="CONVERSION"
                size="medium"
                onClick={() => navigate('/analytics')}
                animationDelay={600}
              />
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
                // For now, use mock data for activities until we have real activity tracking
                getMockDashboardData().recentActivities.map((activity: any) => (
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
                // For now, use mock data for tasks until we have real task tracking
                getMockDashboardData().upcomingTasks.map((task: any) => (
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

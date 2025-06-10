import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress,
  useTheme,
  Skeleton
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MonetizationOn as RevenueIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { getMockDashboardData } from '../../services/mockData/mockDataService';
import { dashboardService, DashboardMetrics } from '../../services/supabase/dashboardService';
import { useAuth } from '../../auth';
import { useAppMode } from '../../contexts/AppModeContext';
import AnimatedOrbHeroBG from './AnimatedOrbHeroBG'; // Ensure this path is correct

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: string;
  orbIndex?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color, orbIndex }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  
  const getTrendColor = (trend: string) => {
    if (trend === 'up') return theme.palette.success.main;
    if (trend === 'down') return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUpIcon fontSize="small" />;
    if (trend === 'down') return <TrendingDownIcon fontSize="small" />;
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        backgroundColor: themeMode === 'space' 
          ? 'rgba(22, 27, 44, 0.7)' 
          : theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${
          themeMode === 'space' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.06)'
        }`,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: themeMode === 'space'
            ? '0 10px 30px rgba(0, 0, 0, 0.25)'
            : '0 10px 30px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Replace colored box with animated orb */}
          <AnimatedOrbHeroBG 
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} 
            childIndex={orbIndex !== undefined ? orbIndex : 0} 
          />
          {icon}
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 'auto',
          pt: 1,
          color: getTrendColor(change.trend)
        }}
      >
        {getTrendIcon(change.trend)}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {change.value}% {change.trend === 'up' ? 'increase' : change.trend === 'down' ? 'decrease' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
          from last month
        </Typography>
      </Box>
    </Paper>
  );
};

const DashboardStats: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const { isDemo } = useAppMode();
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  // Load data on component mount
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
          revenue_generated: mockData.stats.revenueGenerated * 100, // Convert to cents
          revenue_change: mockData.stats.revenueChange,
          active_campaigns: mockData.stats.activeCampaigns,
          campaigns_change: mockData.stats.campaignsChange,
          sales_goal: mockData.stats.salesGoal * 100, // Convert to cents
          current_revenue: mockData.stats.currentRevenue * 100, // Convert to cents
          sales_goal_progress: mockData.stats.salesGoalProgress,
          quota_percentage: mockData.stats.salesGoalProgress, // Sync with sales goal progress
          pipeline_value: mockData.stats.revenueGenerated * 1.5 * 100, // Mock pipeline value in cents
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
            revenue_generated: mockData.stats.revenueGenerated * 100, // Convert to cents
            revenue_change: mockData.stats.revenueChange,
            active_campaigns: mockData.stats.activeCampaigns,
            campaigns_change: mockData.stats.campaignsChange,
            sales_goal: mockData.stats.salesGoal * 100, // Convert to cents
            current_revenue: mockData.stats.currentRevenue * 100, // Convert to cents
            sales_goal_progress: mockData.stats.salesGoalProgress,
            quota_percentage: mockData.stats.salesGoalProgress,
            pipeline_value: mockData.stats.revenueGenerated * 1.5 * 100, // Convert to cents
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
  
  // If data is still loading, show a loading state
  if (loading || !dashboardData) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
        ))}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
        </Box>
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
      <Box>
        <StatCard
          title="Total Contacts"
          value={dashboardData.total_contacts.toLocaleString()}
          icon={<PersonIcon />}
          change={{ value: dashboardData.contacts_change, trend: dashboardData.contacts_change >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#8860D0' : '#3D52D5'} // Primary color
          orbIndex={0}
        />
      </Box>
      
      <Box>
        <StatCard
          title="Active Practices"
          value={dashboardData.active_practices.toLocaleString()}
          icon={<BusinessIcon />}
          change={{ value: dashboardData.practices_change, trend: dashboardData.practices_change >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#5CE1E6' : '#44CFCB'} // Secondary color
          orbIndex={1}
        />
      </Box>
      
      <Box>
        <StatCard
          title="Revenue Generated"
          value={formatCurrency(dashboardData.revenue_generated / 100)} // Convert from cents
          icon={<RevenueIcon />}
          change={{ value: dashboardData.revenue_change, trend: dashboardData.revenue_change >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#FFD700' : '#FFAB4C'} // Warning color
          orbIndex={2}
        />
      </Box>
      
      <Box>
        <StatCard
          title="Active Campaigns"
          value={dashboardData.active_campaigns.toString()}
          icon={<CampaignIcon />}
          change={{ value: dashboardData.campaigns_change, trend: dashboardData.campaigns_change >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#00E676' : '#4CAF50'} // Success color
          orbIndex={3}
        />
      </Box>
      
      <Box sx={{ gridColumn: '1 / -1' }}>
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
            }`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Sales Goal Progress
            </Typography>
            <Typography variant="h6" fontWeight={600} color="primary">
              {dashboardData.sales_goal_progress}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={dashboardData.sales_goal_progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: themeMode === 'space' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundImage: themeMode === 'space'
                  ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)'
                  : 'linear-gradient(45deg, #3D52D5 0%, #44CFCB 100%)',
              }
            }}
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 1.5 
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Current: {formatCurrency(dashboardData.current_revenue / 100)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: {formatCurrency(dashboardData.sales_goal / 100)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardStats;

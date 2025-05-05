import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  LinearProgress,
  useTheme,
  Stack
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
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
            backgroundColor: color || 
              (themeMode === 'space' 
                ? 'rgba(138, 96, 208, 0.15)' 
                : 'rgba(61, 82, 213, 0.08)'),
            color: color || 
              (themeMode === 'space' 
                ? '#8860D0' 
                : '#3D52D5'),
          }}
        >
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
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  // Load mock data on component mount
  useEffect(() => {
    const data = getMockDashboardData();
    setDashboardData(data);
    
    // Refresh data every 5 minutes to simulate real-time updates
    const intervalId = setInterval(() => {
      setDashboardData(getMockDashboardData());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // If data is still loading, show a loading state
  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }
  
  const { stats } = dashboardData;
  
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
      <Box>
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts.toLocaleString()}
          icon={<PersonIcon />}
          change={{ value: stats.contactsChange, trend: stats.contactsChange >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#8860D0' : '#3D52D5'} // Primary color
        />
      </Box>
      
      <Box>
        <StatCard
          title="Active Practices"
          value={stats.activePractices.toLocaleString()}
          icon={<BusinessIcon />}
          change={{ value: stats.practicesChange, trend: stats.practicesChange >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#5CE1E6' : '#44CFCB'} // Secondary color
        />
      </Box>
      
      <Box>
        <StatCard
          title="Revenue Generated"
          value={formatCurrency(stats.revenueGenerated)}
          icon={<RevenueIcon />}
          change={{ value: stats.revenueChange, trend: stats.revenueChange >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#FFD700' : '#FFAB4C'} // Warning color
        />
      </Box>
      
      <Box>
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns.toString()}
          icon={<CampaignIcon />}
          change={{ value: stats.campaignsChange, trend: stats.campaignsChange >= 0 ? 'up' : 'down' }}
          color={themeMode === 'space' ? '#00E676' : '#4CAF50'} // Success color
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
              {stats.salesGoalProgress}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={stats.salesGoalProgress}
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
              Current: {formatCurrency(stats.currentRevenue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Goal: {formatCurrency(stats.salesGoal)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardStats;

import React from 'react';
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
import { useDashboardData } from '../../contexts/DashboardDataContext';
import IndustrialStatCard from './IndustrialStatCard';
import PanthereMeridianControlBoard from './PanthereMeridianControlBoard';

// Theme-based accent colors for industrial look
const getAccentColor = (themeMode: string, index: number) => {
  const themeColors = {
    default: ['#1976d2', '#42a5f5', '#90caf9', '#bbdefb'],
    gallery: ['#ffd700', '#ffab00', '#ff6f00', '#ff3d00'],
    boeing: ['#00e676', '#00c853', '#64dd17', '#aeea00'],
    quantum: ['#e91e63', '#f06292', '#ce93d8', '#ab47bc'],
    space: ['#8860D0', '#5CE1E6', '#FFD700', '#00E676'],
    masterpiece: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  };
  
  const colors = themeColors[themeMode as keyof typeof themeColors] || themeColors.default;
  return colors[index % colors.length];
};

const DashboardStats: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { dashboardData, loading } = useDashboardData();
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  
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
      <IndustrialStatCard
        title="Total Contacts"
        value={dashboardData.total_contacts.toLocaleString()}
        icon={<PersonIcon />}
        change={{ 
          value: Math.abs(dashboardData.contacts_change), 
          trend: dashboardData.contacts_change >= 0 ? 'up' : 'down' 
        }}
        accentColor={getAccentColor(themeMode, 0)}
        index={0}
      />
      
      <IndustrialStatCard
        title="Active Practices"
        value={dashboardData.active_practices.toLocaleString()}
        icon={<BusinessIcon />}
        change={{ 
          value: Math.abs(dashboardData.practices_change), 
          trend: dashboardData.practices_change >= 0 ? 'up' : 'down' 
        }}
        accentColor={getAccentColor(themeMode, 1)}
        index={1}
      />
      
      <IndustrialStatCard
        title="Revenue Generated"
        value={formatCurrency(dashboardData.revenue_generated / 100)}
        icon={<RevenueIcon />}
        change={{ 
          value: Math.abs(dashboardData.revenue_change), 
          trend: dashboardData.revenue_change >= 0 ? 'up' : 'down' 
        }}
        accentColor={getAccentColor(themeMode, 2)}
        index={2}
      />
      
      <IndustrialStatCard
        title="Active Campaigns"
        value={dashboardData.active_campaigns.toString()}
        icon={<CampaignIcon />}
        change={{ 
          value: Math.abs(dashboardData.campaigns_change), 
          trend: dashboardData.campaigns_change >= 0 ? 'up' : 'down' 
        }}
        accentColor={getAccentColor(themeMode, 3)}
        index={3}
      />
      
      <Box sx={{ gridColumn: '1 / -1' }}>
        <PanthereMeridianControlBoard
          current={dashboardData.current_revenue / 100}
          goal={dashboardData.sales_goal / 100}
          progress={dashboardData.sales_goal_progress}
          formatValue={formatCurrency}
        />
      </Box>
    </Box>
  );
};

export default DashboardStats;

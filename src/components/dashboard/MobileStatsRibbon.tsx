// Mobile Stats Ribbon - Horizontal scrolling metrics display
// Compact, theme-aware stats for mobile dashboard

import React from 'react';
import {
  Box,
  Typography,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MonetizationOn as RevenueIcon,
  ShowChart as PipelineIcon,
  Speed as ConversionIcon,
} from '@mui/icons-material';
import { ThemeAccents, getStatColors } from './ThemeAwareComponents';
import { useThemeContext } from '../../themes/ThemeContext';

interface MobileStatsRibbonProps {
  data: any;
  themeAccents: ThemeAccents;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; trend: 'up' | 'down' };
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change, color, index }) => {
  const theme = useTheme();
  
  const getTrendColor = () => {
    if (!change) return theme.palette.text.secondary;
    return change.trend === 'up' ? '#00ff41' : '#ff0040';
  };
  
  return (
    <Box
      sx={{
        minWidth: 140,
        p: 1.5,
        borderRadius: 1,
        background: alpha(theme.palette.background.paper, 0.6),
        border: `1px solid ${alpha(color, 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: alpha(color, 0.4),
          boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animation: 'shimmer 3s ease-in-out infinite',
          animationDelay: `${index * 0.2}s`,
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ color: color, display: 'flex', alignItems: 'center' }}>
          {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 18 } })}
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.text.secondary,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </Typography>
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 700,
          fontSize: '1.1rem',
          mb: 0.25,
        }}
      >
        {value}
      </Typography>
      
      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {change.trend === 'up' ? (
            <TrendingUpIcon sx={{ fontSize: 14, color: getTrendColor() }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, color: getTrendColor() }} />
          )}
          <Typography 
            variant="caption" 
            sx={{ 
              color: getTrendColor(),
              fontSize: '0.65rem',
              fontWeight: 600,
            }}
          >
            {change.value}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const MobileStatsRibbon: React.FC<MobileStatsRibbonProps> = ({ data, themeAccents }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  
  if (!data) {
    return (
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" width={140} height={80} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    );
  }
  
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };
  
  const stats = [
    {
      icon: <PersonIcon />,
      label: 'Contacts',
      value: data.total_contacts.toLocaleString(),
      change: { value: Math.abs(data.contacts_change), trend: data.contacts_change >= 0 ? 'up' : 'down' },
    },
    {
      icon: <BusinessIcon />,
      label: 'Practices',
      value: data.active_practices.toLocaleString(),
      change: { value: Math.abs(data.practices_change), trend: data.practices_change >= 0 ? 'up' : 'down' },
    },
    {
      icon: <RevenueIcon />,
      label: 'Revenue',
      value: formatCurrency(data.revenue_generated / 100),
      change: { value: Math.abs(data.revenue_change), trend: data.revenue_change >= 0 ? 'up' : 'down' },
    },
    {
      icon: <PipelineIcon />,
      label: 'Pipeline',
      value: formatCurrency(data.pipeline_value / 100),
      change: { value: Math.abs(data.pipeline_change), trend: data.pipeline_change >= 0 ? 'up' : 'down' },
    },
    {
      icon: <ConversionIcon />,
      label: 'Conversion',
      value: `${data.conversion_rate}%`,
      change: { value: Math.abs(data.conversion_change), trend: data.conversion_change >= 0 ? 'up' : 'down' },
    },
  ];
  
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 1,
        // Hide scrollbar but keep functionality
        '&::-webkit-scrollbar': {
          height: 4,
        },
        '&::-webkit-scrollbar-track': {
          background: alpha(theme.palette.background.paper, 0.1),
          borderRadius: 2,
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(themeAccents.primary, 0.3),
          borderRadius: 2,
          '&:hover': {
            background: alpha(themeAccents.primary, 0.5),
          },
        },
        // For Firefox
        scrollbarWidth: 'thin',
        scrollbarColor: `${alpha(themeAccents.primary, 0.3)} ${alpha(theme.palette.background.paper, 0.1)}`,
      }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          {...stat}
          color={getStatColors(themeMode, index)}
          index={index}
        />
      ))}
    </Box>
  );
};

export default MobileStatsRibbon;
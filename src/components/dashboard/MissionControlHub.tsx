// Mission Control Hub - Consolidated mobile-first dashboard component
// Combines CommandCenterFeed, MissionBriefingCard, DashboardStats, and NowCardsStack

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Timeline as ActivityIcon,
  Assignment as TaskIcon,
  AutoAwesome as InsightIcon,
  Business as OperationsIcon,
  AutoMode as AutomationIcon,
  Create as ContentForgeIcon,
  Phone as CommunicationsIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useDashboardData } from '../../contexts/DashboardDataContext';
import glassEffects from '../../themes/glassEffects';
import MobileStatsRibbon from './MobileStatsRibbon';
import CompactActivityFeed from './CompactActivityFeed';
import PriorityTaskList from './PriorityTaskList';
import InsightCards from './InsightCards';
import OperationsCenter from './OperationsCenter';
import AutomationHub from '../automation/AutomationHub';
import ContentForgeHub from '../content/ContentForgeHub';
import CommunicationsHub from '../communications/CommunicationsHub';
import { getThemeAccents, getThemeGlass } from './ThemeAwareComponents';

type ViewMode = 'overview' | 'activities' | 'tasks' | 'insights' | 'operations' | 'automations' | 'content-forge' | 'communications';

const MissionControlHub: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { dashboardData, loading, mockActivities, mockTasks } = useDashboardData();
  
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [expanded, setExpanded] = useState(true);
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);
  
  // Get view icon
  const getViewIcon = (mode: ViewMode) => {
    switch (mode) {
      case 'overview': return <DashboardIcon />;
      case 'activities': return <ActivityIcon />;
      case 'tasks': return <TaskIcon />;
      case 'insights': return <InsightIcon />;
      case 'operations': return <OperationsIcon />;
      case 'automations': return <AutomationIcon />;
      case 'content-forge': return <ContentForgeIcon />;
      case 'communications': return <CommunicationsIcon />;
    }
  };
  
  // Get view color
  const getViewColor = (mode: ViewMode) => {
    switch (mode) {
      case 'overview': return themeAccents.primary;
      case 'activities': return themeAccents.glow;
      case 'tasks': return themeAccents.secondary;
      case 'insights': return themeAccents.primary;
      case 'operations': return themeAccents.glow;
      case 'automations': return themeAccents.secondary;
      case 'content-forge': return theme.palette.warning.main;
      case 'communications': return theme.palette.success.main;
    }
  };
  
  // Loading state
  if (loading && !dashboardData) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        position: 'relative',
        ...themeGlass,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header with Dropdown */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: themeAccents.primary,
              textTransform: 'uppercase',
              letterSpacing: isMobile ? 1 : 2,
              fontSize: isMobile ? '0.9rem' : '1.1rem',
            }}
          >
            Mission Control
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: isMobile ? 120 : 150 }}>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(themeAccents.primary, 0.3),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(themeAccents.primary, 0.5),
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: themeAccents.primary,
                },
              }}
            >
              {(['overview', 'activities', 'tasks', 'insights', 'operations', 'automations', 'content-forge', 'communications'] as ViewMode[]).map((mode) => (
                <MenuItem key={mode} value={mode}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {React.cloneElement(getViewIcon(mode), { 
                      sx: { fontSize: 16, color: getViewColor(mode) } 
                    })}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {mode === 'content-forge' ? 'Content Forge' : 
                       mode === 'communications' ? 'Communications' : mode}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ color: themeAccents.primary }}
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </Box>
      
      {/* Stats Ribbon - Always visible */}
      <Box sx={{ p: 2, pb: 0 }}>
        <MobileStatsRibbon 
          data={dashboardData}
          themeAccents={themeAccents}
        />
      </Box>
      
      {/* Main Content Area */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 1 }}>
          <Fade in timeout={300}>
            <Box>
              {viewMode === 'overview' && (
                <OverviewGrid 
                  activities={mockActivities}
                  tasks={mockTasks}
                  themeAccents={themeAccents}
                  isMobile={isMobile}
                />
              )}
              
              {viewMode === 'activities' && (
                <CompactActivityFeed
                  activities={mockActivities}
                  themeAccents={themeAccents}
                />
              )}
              
              {viewMode === 'tasks' && (
                <PriorityTaskList
                  tasks={mockTasks}
                  themeAccents={themeAccents}
                />
              )}
              
              {viewMode === 'insights' && (
                <InsightCards
                  themeAccents={themeAccents}
                />
              )}
              
              {viewMode === 'operations' && (
                <OperationsCenter />
              )}
              
              {viewMode === 'automations' && (
                <AutomationHub />
              )}
              
              {viewMode === 'content-forge' && (
                <ContentForgeHub />
              )}
              
              {viewMode === 'communications' && (
                <CommunicationsHub />
              )}
            </Box>
          </Fade>
        </Box>
      </Collapse>
    </Box>
  );
};

// Overview Grid Component
const OverviewGrid: React.FC<{
  activities: any[];
  tasks: any[];
  themeAccents: any;
  isMobile: boolean;
}> = ({ activities, tasks, themeAccents, isMobile }) => {
  const theme = useTheme();
  
  // Get priority counts
  const highPriorityTasks = tasks.filter(t => t.priority === 'High').length;
  const recentActivities = activities.slice(0, 3);
  
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: 2,
      }}
    >
      {/* High Priority Alert */}
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          background: alpha(theme.palette.error.main, 0.1),
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: theme.palette.error.main, mb: 1 }}>
          HIGH PRIORITY
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {highPriorityTasks}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          Tasks requiring immediate attention
        </Typography>
      </Box>
      
      {/* Recent Activity Summary */}
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          background: alpha(themeAccents.glow, 0.1),
          border: `1px solid ${alpha(themeAccents.glow, 0.3)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: themeAccents.glow, mb: 1 }}>
          RECENT ACTIVITY
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {recentActivities.map((activity, index) => (
            <Typography key={index} variant="caption" sx={{ 
              color: theme.palette.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              • {activity.description}
            </Typography>
          ))}
        </Box>
      </Box>
      
      {/* AI Insights Preview */}
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          background: alpha(themeAccents.primary, 0.1),
          border: `1px solid ${alpha(themeAccents.primary, 0.3)}`,
          gridColumn: isMobile ? 'span 1' : 'span 2',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: themeAccents.primary, mb: 1 }}>
          AI INSIGHTS
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              3 High-Confidence Opportunities
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              $2.4M potential pipeline identified
            </Typography>
          </Box>
          <Chip
            label="View All"
            size="small"
            onClick={() => {}}
            sx={{
              backgroundColor: alpha(themeAccents.primary, 0.2),
              color: themeAccents.primary,
              '&:hover': {
                backgroundColor: alpha(themeAccents.primary, 0.3),
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MissionControlHub;
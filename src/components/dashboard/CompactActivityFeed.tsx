// Compact Activity Feed - Mobile-optimized activity list
// Condensed view with icons and expandable details

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Phone as CallIcon,
  Email as EmailIcon,
  Event as MeetingIcon,
  Assignment as TaskIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Circle as DotIcon,
} from '@mui/icons-material';
import { ThemeAccents } from './ThemeAwareComponents';

interface Activity {
  id: string;
  type: string;
  description: string;
  timeAgo: string;
  details?: string;
  status?: 'success' | 'warning' | 'info';
}

interface CompactActivityFeedProps {
  activities: Activity[];
  themeAccents: ThemeAccents;
  maxItems?: number;
}

const CompactActivityFeed: React.FC<CompactActivityFeedProps> = ({ 
  activities, 
  themeAccents,
  maxItems = 10 
}) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };
  
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return <CallIcon sx={{ fontSize: 16 }} />;
      case 'email':
        return <EmailIcon sx={{ fontSize: 16 }} />;
      case 'meeting':
        return <MeetingIcon sx={{ fontSize: 16 }} />;
      case 'task':
        return <TaskIcon sx={{ fontSize: 16 }} />;
      default:
        return <DotIcon sx={{ fontSize: 8 }} />;
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <SuccessIcon sx={{ fontSize: 14, color: themeAccents.success || '#00ff41' }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 14, color: themeAccents.warning || '#ffaa00' }} />;
      case 'info':
        return <InfoIcon sx={{ fontSize: 14, color: themeAccents.primary }} />;
      default:
        return null;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'call':
        return themeAccents.primary;
      case 'email':
        return themeAccents.secondary;
      case 'meeting':
        return themeAccents.glow;
      case 'task':
        return themeAccents.warning || '#ffaa00';
      default:
        return theme.palette.text.secondary;
    }
  };
  
  const displayActivities = activities.slice(0, maxItems);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {displayActivities.map((activity, index) => {
        const isExpanded = expandedItems.has(activity.id);
        const activityColor = getActivityColor(activity.type);
        
        return (
          <Box
            key={activity.id}
            sx={{
              p: 1.5,
              borderRadius: 1,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                borderColor: alpha(activityColor, 0.3),
                background: alpha(theme.palette.background.paper, 0.7),
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '3px',
                background: activityColor,
                opacity: 0.8,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              {/* Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  background: alpha(activityColor, 0.1),
                  color: activityColor,
                  flexShrink: 0,
                }}
              >
                {getActivityIcon(activity.type)}
              </Box>
              
              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: isExpanded ? 'normal' : 'nowrap',
                      flex: 1,
                    }}
                  >
                    {activity.description}
                  </Typography>
                  {activity.status && getStatusIcon(activity.status)}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: '0.7rem',
                    }}
                  >
                    {activity.timeAgo}
                  </Typography>
                  
                  <Chip
                    label={activity.type}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      backgroundColor: alpha(activityColor, 0.1),
                      color: activityColor,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
                
                {activity.details && (
                  <Collapse in={isExpanded}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        mt: 1,
                        color: theme.palette.text.secondary,
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {activity.details}
                    </Typography>
                  </Collapse>
                )}
              </Box>
              
              {/* Expand Button */}
              {activity.details && (
                <IconButton
                  size="small"
                  onClick={() => toggleExpanded(activity.id)}
                  sx={{ 
                    color: theme.palette.text.secondary,
                    p: 0.5,
                  }}
                >
                  {isExpanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
                </IconButton>
              )}
            </Box>
          </Box>
        );
      })}
      
      {activities.length > maxItems && (
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center',
            color: theme.palette.text.secondary,
            mt: 1,
          }}
        >
          {activities.length - maxItems} more activities
        </Typography>
      )}
    </Box>
  );
};

export default CompactActivityFeed;
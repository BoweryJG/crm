import React from 'react';
import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material';
import { Group as GroupIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

interface ContactMetricsProps {
  totalContacts: number;
  viewingStart: number;
  viewingEnd: number;
  activeFilters?: string[];
}

const ContactMetrics: React.FC<ContactMetricsProps> = ({
  totalContacts,
  viewingStart,
  viewingEnd,
  activeFilters = []
}) => {
  const percentageLoaded = totalContacts > 0 
    ? Math.round((viewingEnd / totalContacts) * 100) 
    : 0;

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        mb: 3, 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <GroupIcon />
          <Typography variant="h6" fontWeight="bold">
            {totalContacts.toLocaleString()} Total Contacts
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1}>
          <VisibilityIcon fontSize="small" />
          <Typography variant="body1">
            Viewing: {viewingStart}-{viewingEnd}
          </Typography>
        </Box>
      </Box>

      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption">
            {percentageLoaded}% loaded
          </Typography>
          <Typography variant="caption">
            {(totalContacts - viewingEnd).toLocaleString()} more available
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={percentageLoaded} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'white',
              borderRadius: 4
            }
          }}
        />
      </Box>

      {activeFilters.length > 0 && (
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Active Filters:
          </Typography>
          <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
            {activeFilters.map((filter, index) => (
              <Chip
                key={index}
                label={filter}
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ContactMetrics;
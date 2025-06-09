import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  TextField,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { useThemeContext } from '../themes/ThemeContext';
import RegionalAnalytics from '../components/analytics/RegionalAnalytics';

const Analytics: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box sx={{ 
      height: '100vh', 
      overflow: 'auto',
      p: 3,
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.1)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.5)',
      },
    }}>
      <Typography variant="h4" gutterBottom>
        Regional Analytics Dashboard
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          borderRadius: 2,
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
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Regional Market Analysis
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
              }}
              sx={{ mr: 2 }}
            />
            <IconButton title="Refresh data">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <RegionalAnalytics />
        </Box>
      </Paper>

      {/* Additional Content for Better Scrolling */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3, 
          borderRadius: 2,
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
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Insights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Regional performance metrics and competitive analysis for medical device sales territories.
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="h4" color="primary">$2.4M</Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="h4" color="success.main">87%</Typography>
              <Typography variant="body2" color="text.secondary">Territory Coverage</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="h4" color="warning.main">124</Typography>
              <Typography variant="body2" color="text.secondary">Active Accounts</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="h4" color="secondary">92%</Typography>
              <Typography variant="body2" color="text.secondary">Customer Satisfaction</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Market Trends Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Latest market intelligence and competitive landscape analysis for your territory.
          </Typography>
          
          <Box sx={{ height: 200, bgcolor: 'action.hover', borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Interactive market trends visualization would be displayed here with real-time data feeds 
              from regional analytics services, competitor monitoring, and customer engagement metrics.
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Competitive Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Stay ahead of the competition with real-time competitor analysis and market positioning insights.
          </Typography>
          
          <Box sx={{ height: 300, bgcolor: 'action.hover', borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Competitive intelligence dashboard showing market share analysis, competitor pricing strategies, 
              product launches, and territory overlap analysis for medical device sales optimization.
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Forecasting & Projections
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            AI-powered sales forecasting and market projection tools for strategic planning.
          </Typography>
          
          <Box sx={{ height: 250, bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Advanced forecasting models incorporating market trends, seasonal patterns, competitive dynamics, 
              and territory-specific factors to provide accurate revenue and growth projections.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;

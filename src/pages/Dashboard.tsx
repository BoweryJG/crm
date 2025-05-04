import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CardHeader,
  CardContent,
  useTheme
} from '@mui/material';
import DashboardStats from '../components/dashboard/DashboardStats';
import { useThemeContext } from '../themes/ThemeContext';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Welcome back, John
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your sales performance and activity
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <DashboardStats />
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
              {/* Activity items would go here */}
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
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
                      New contact added
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Added Dr. Sarah Johnson to contacts
                  </Typography>
                </Box>
              ))}
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
              {/* Task items would go here */}
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
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
                      Follow up with client
                    </Typography>
                    <Typography variant="caption" color={item === 1 ? "error" : "text.secondary"}>
                      {item === 1 ? 'Today' : 'Tomorrow'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                    Call Dr. Smith about new product line
                  </Typography>
                </Box>
              ))}
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
            Recent trends in the dental implant market show a 15% increase in demand for minimally invasive procedures. 
            Aesthetic procedures, particularly for injectables, have seen a 23% growth in the last quarter.
          </Typography>
          <Typography variant="body2">
            Key opportunity: Practices in your region are increasingly interested in combined treatment packages that 
            integrate both dental and aesthetic procedures for comprehensive patient care.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;

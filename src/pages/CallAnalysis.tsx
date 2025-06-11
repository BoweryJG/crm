// Call Analysis Page - Integrated with Twilio Call Analytics
import React from 'react';
import { Box } from '@mui/material';
import CallAnalyticsDashboard from '../components/calls/CallAnalyticsDashboard';

const CallAnalysisPage: React.FC = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <CallAnalyticsDashboard userId="demo-user" />
    </Box>
  );
};

export default CallAnalysisPage;
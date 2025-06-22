import React from 'react';
import { Box } from '@mui/material';
import PanthereMeridianControlBoard from '../components/dashboard/PanthereMeridianControlBoard';

const TestGauge: React.FC = () => {
  return (
    <Box sx={{ p: 4, background: '#000', minHeight: '100vh' }}>
      <PanthereMeridianControlBoard
        current={884000}
        goal={1300000}
        progress={68}
        formatValue={(v) => `$${(v/1000).toFixed(0)}K`}
      />
    </Box>
  );
};

export default TestGauge;
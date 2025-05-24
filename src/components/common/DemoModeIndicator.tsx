import React from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
import { Chip, Box, Tooltip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

export const DemoModeIndicator: React.FC = () => {
  const { isDemo } = useAppMode();
  
  if (!isDemo) return null;
  
  return (
    <Tooltip title="You're viewing demo data. Subscribe to access live mode with your real data.">
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
        <Chip
          icon={<ScienceIcon />}
          label="DEMO MODE"
          color="warning"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
    </Tooltip>
  );
};

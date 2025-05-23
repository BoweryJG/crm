import React from 'react';
import { Box, Typography } from '@mui/material';

const SubscribeCancel: React.FC = () => (
  <Box sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h4" gutterBottom>
      Subscription Canceled
    </Typography>
    <Typography variant="body1">You have canceled the checkout process.</Typography>
  </Box>
);

export default SubscribeCancel;

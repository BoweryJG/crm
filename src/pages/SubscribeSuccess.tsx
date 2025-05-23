import React from 'react';
import { Box, Typography } from '@mui/material';

const SubscribeSuccess: React.FC = () => (
  <Box sx={{ textAlign: 'center', mt: 8 }}>
    <Typography variant="h4" gutterBottom>
      Thank you for subscribing!
    </Typography>
    <Typography variant="body1">Your payment was successful.</Typography>
  </Box>
);

export default SubscribeSuccess;

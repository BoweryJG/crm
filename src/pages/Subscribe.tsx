import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Subscribe: React.FC = () => {
  const handleSubscribe = async () => {
    const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.assign(data.url);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Upgrade Your Account
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Access premium features with a monthly membership.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSubscribe}>
        Subscribe Now
      </Button>
    </Box>
  );
};

export default Subscribe;

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubscribeCancel: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // You could add analytics tracking here
    console.log('User canceled subscription checkout');
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Subscription Canceled
        </Typography>
        <Typography variant="body1" paragraph>
          You have canceled the checkout process. No charges have been made.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you have any questions or encountered any issues during the checkout process, 
          please don't hesitate to contact our support team.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Return to Dashboard
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/subscribe')}
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubscribeCancel;

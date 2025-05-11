import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import ResearchWorkspace from '../components/research/ResearchWorkspace';

const Research: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2, height: 'calc(100vh - 140px)' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Research Module
      </Typography>
      
      <Box sx={{ height: 'calc(100% - 60px)' }}>
        <ResearchWorkspace />
      </Box>
    </Container>
  );
};

export default Research;

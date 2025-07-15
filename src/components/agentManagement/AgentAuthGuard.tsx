import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAgentAuth } from './AgentAuthProvider';

interface AgentAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AgentAuthGuard: React.FC<AgentAuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, user, showLoginDialog, logout } = useAgentAuth();

  useEffect(() => {
    // If authentication is required and user is not authenticated, show login dialog
    if (requireAuth && !isAuthenticated) {
      showLoginDialog();
    }
  }, [requireAuth, isAuthenticated, showLoginDialog]);

  if (requireAuth && !isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <CardContent>
            <SecurityIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Agent Command Center
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Authentication Required
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              You need to authenticate to access the Agent Management System.
              This system allows you to manage all 29 agents across different categories
              and deploy them to various clients.
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>What you can do with Agent Command Center:</strong>
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>View and manage all 29 agents across 5 categories</li>
                <li>Deploy agents to clients (Pedro, repconnect1, etc.)</li>
                <li>Monitor active deployments and performance</li>
                <li>Configure agent settings and parameters</li>
                <li>View analytics and deployment statistics</li>
              </ul>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LockIcon />}
                onClick={showLoginDialog}
              >
                Authenticate Now
              </Button>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              Connected to: agentbackend-2932.onrender.com
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Box>
        {/* Optional: Show authenticated user info */}
        <Box 
          sx={{ 
            bgcolor: 'success.light', 
            color: 'success.dark', 
            p: 1, 
            textAlign: 'center',
            borderBottom: 1,
            borderColor: 'success.main'
          }}
        >
          <Typography variant="caption">
            Authenticated as: {user.username} ({user.role}) |{' '}
            <Button 
              size="small" 
              color="inherit" 
              onClick={logout}
              sx={{ textDecoration: 'underline', p: 0, minWidth: 'auto' }}
            >
              Logout
            </Button>
          </Typography>
        </Box>
        {children}
      </Box>
    );
  }

  // If authentication is not required, just render children
  return <>{children}</>;
};
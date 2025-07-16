import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import gmailApiService from '../services/gmail/gmailApiService';
import { gmailSyncService } from '../services/email/gmailSyncService';
import { useNotification } from '../contexts/NotificationContext';

const GmailAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Authentication failed: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for tokens
        const success = await gmailApiService.exchangeCodeForTokens(code);
        
        if (!success) {
          throw new Error('Failed to exchange authorization code for tokens');
        }

        // Initialize Gmail sync service
        await gmailSyncService.initializeGmailApi();
        
        // Get user profile to confirm authentication
        const profile = await gmailApiService.getUserProfile();
        
        showNotification(`Successfully connected Gmail account: ${profile.emailAddress}`, 'success');
        
        // Start initial sync
        showNotification('Starting initial email sync...', 'info');
        gmailSyncService.syncAllAccounts().then(result => {
          if (result.success) {
            showNotification(`Synced ${result.syncedCount} emails`, 'success');
          }
        });
        
        // Redirect to settings or communications page
        navigate('/settings', { state: { activeTab: 'email' } });
      } catch (error) {
        console.error('Gmail auth callback error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, showNotification]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Alert severity="error" sx={{ mb: 2, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Gmail Authentication Failed
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary">
          You will be redirected to settings in 5 seconds...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h5" gutterBottom>
        Connecting Gmail Account
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Please wait while we complete the authentication process...
      </Typography>
    </Box>
  );
};

export default GmailAuthCallback;
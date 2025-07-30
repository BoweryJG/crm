import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Mail as MailIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useAuth } from '../../auth/hooks';
import { useUnifiedAuth } from '../../contexts/UnifiedAuthContext_20250730';
import { FeatureGate, TierBadge, UpgradePrompt, RepXTier } from '@repspheres/unified-auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';

interface GmailAccount {
  email: string;
  created_at: string;
  expires_at: string | null;
}

export const GmailSettings_20250730: React.FC = () => {
  const { user } = useAuth();
  const { tier, canUseGmail } = useUnifiedAuth();
  const [connectedAccounts, setConnectedAccounts] = useState<GmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (canUseGmail()) {
      fetchConnectedAccounts();
    }
    
    // Check if we're returning from OAuth flow
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('gmail_connected') === 'true') {
      const email = urlParams.get('email');
      setSuccess(`Successfully connected Gmail account${email ? `: ${email}` : ''}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('gmail_error') === 'true') {
      const errorMessage = urlParams.get('error_message');
      setError(errorMessage || 'Failed to connect Gmail account');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [canUseGmail]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/accounts`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch connected accounts');
      }

      const data = await response.json();
      setConnectedAccounts(data.accounts || []);
    } catch (err) {
      console.error('Failed to fetch Gmail accounts:', err);
      setError('Failed to load connected Gmail accounts');
    }
  };

  const connectGmail = async () => {
    if (!canUseGmail()) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/google/url?returnUrl=${encodeURIComponent(window.location.href)}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get OAuth URL');
      }

      const data = await response.json();
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (err) {
      console.error('Failed to initiate Gmail connection:', err);
      setError('Failed to connect Gmail account. Please try again.');
      setLoading(false);
    }
  };

  const disconnectGmail = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/disconnect`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect account');
      }

      setSuccess(`Disconnected Gmail account: ${email}`);
      fetchConnectedAccounts();
    } catch (err) {
      console.error('Failed to disconnect Gmail:', err);
      setError(`Failed to disconnect ${email}. Please try again.`);
    }
  };

  const isTokenExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              <MailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Gmail Integration</Typography>
            </Box>
            <TierBadge tier={tier} />
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Connect your Gmail account to sync emails, track conversations, and send emails directly from the CRM.
          </Typography>

          <FeatureGate 
            feature="gmailIntegration"
            fallback={
              <Alert severity="info" sx={{ mb: 2 }}>
                Gmail integration requires RepX⁴ Executive or higher.
                <Box mt={1}>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade to Access Gmail
                  </Button>
                </Box>
              </Alert>
            }
          >
            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {connectedAccounts.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  No Gmail accounts connected yet
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={connectGmail}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <MailIcon />}
                >
                  {loading ? 'Connecting...' : 'Connect Gmail Account'}
                </Button>
              </Box>
            ) : (
              <>
                <List>
                  {connectedAccounts.map((account) => (
                    <ListItem key={account.email}>
                      <ListItemText
                        primary={account.email}
                        secondary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="caption">
                              Connected on {new Date(account.created_at).toLocaleDateString()}
                            </Typography>
                            {isTokenExpired(account.expires_at) ? (
                              <Chip 
                                label="Token Expired" 
                                size="small" 
                                color="warning" 
                              />
                            ) : (
                              <Chip 
                                label="Active" 
                                size="small" 
                                color="success" 
                                icon={<CheckCircleIcon />}
                              />
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="disconnect"
                          onClick={() => disconnectGmail(account.email)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                <Box mt={2} display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={connectGmail}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <MailIcon />}
                  >
                    {loading ? 'Connecting...' : 'Connect Another Account'}
                  </Button>
                </Box>
              </>
            )}

            <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="caption" color="text.secondary">
                <strong>Privacy Note:</strong> We only access emails you explicitly choose to sync. 
                Your Gmail credentials are securely stored and you can disconnect at any time.
              </Typography>
            </Box>
          </FeatureGate>
        </CardContent>
      </Card>

      {showUpgradeModal && (
        <UpgradePrompt
          currentTier={tier}
          requiredTier={RepXTier.Rep4}
          feature="Gmail Integration"
          onUpgrade={() => {
            window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=gmail&from=' + tier;
          }}
          onCancel={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};
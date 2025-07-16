import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import gmailApiService from '../../services/gmail/gmailApiService';

interface GmailAuthComponentProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: any) => void;
  onAuthError: (error: string) => void;
}

interface AuthStep {
  label: string;
  description: string;
  completed: boolean;
}

const GmailAuthComponent: React.FC<GmailAuthComponentProps> = ({
  open,
  onClose,
  onAuthSuccess,
  onAuthError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const steps: AuthStep[] = [
    {
      label: 'Authorization',
      description: 'Click "Connect Gmail" to authorize access to your Gmail account',
      completed: false
    },
    {
      label: 'Authentication',
      description: 'Complete Google OAuth2 authentication flow',
      completed: false
    },
    {
      label: 'Profile Setup',
      description: 'Retrieve your Gmail profile information',
      completed: false
    }
  ];

  const [authSteps, setAuthSteps] = useState<AuthStep[]>(steps);

  useEffect(() => {
    if (open) {
      checkExistingAuth();
    }
  }, [open]);

  useEffect(() => {
    // Handle OAuth2 callback
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setError(`Authentication failed: ${error}`);
        onAuthError(`Authentication failed: ${error}`);
        return;
      }

      if (code) {
        await handleAuthCode(code);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleOAuthCallback();
  }, []);

  const checkExistingAuth = async () => {
    try {
      setLoading(true);
      const isInitialized = await gmailApiService.initialize();
      
      if (isInitialized) {
        const profile = await gmailApiService.getUserProfile();
        setUserProfile(profile);
        setIsAuthenticated(true);
        setActiveStep(3);
        setAuthSteps(prevSteps => prevSteps.map(step => ({ ...step, completed: true })));
        onAuthSuccess(profile);
      } else {
        setActiveStep(0);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
      setError('Failed to check existing authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCode = async (code: string) => {
    try {
      setLoading(true);
      updateStep(1, true);
      setActiveStep(1);

      const success = await gmailApiService.exchangeCodeForTokens(code);
      
      if (success) {
        updateStep(1, true);
        setActiveStep(2);
        
        // Get user profile
        const profile = await gmailApiService.getUserProfile();
        setUserProfile(profile);
        updateStep(2, true);
        setActiveStep(3);
        setIsAuthenticated(true);
        onAuthSuccess(profile);
      } else {
        throw new Error('Failed to exchange authorization code');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
      onAuthError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStep = (stepIndex: number, completed: boolean) => {
    setAuthSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === stepIndex ? { ...step, completed } : step
      )
    );
  };

  const handleGoogleAuth = () => {
    try {
      setLoading(true);
      setError(null);
      updateStep(0, true);
      setActiveStep(1);

      const authUrl = gmailApiService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      setError('Failed to initiate authentication');
      setLoading(false);
    }
  };

  const handleReauth = async () => {
    gmailApiService.logout();
    setIsAuthenticated(false);
    setUserProfile(null);
    setActiveStep(0);
    setAuthSteps(steps);
    setError(null);
  };

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await gmailApiService.getUserProfile();
      setUserProfile(profile);
      
      // Test fetching recent messages
      await gmailApiService.getRecentMessages();
      
      setError(null);
    } catch (error) {
      console.error('Connection test failed:', error);
      setError('Connection test failed. Please re-authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GoogleIcon color="primary" />
          <Typography variant="h6">Gmail Integration</Typography>
          {isAuthenticated && (
            <Chip 
              label="Connected" 
              color="success" 
              size="small" 
              icon={<CheckIcon />}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!isAuthenticated ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Connect your Gmail account to enable email synchronization and management.
            </Typography>
            
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
              {authSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: step.completed ? 'success.main' : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {step.completed ? (
                          <CheckIcon sx={{ color: 'white', fontSize: 16 }} />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            {index + 1}
                          </Typography>
                        )}
                      </Box>
                    )}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleAuth}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={20} /> : 'Connect Gmail'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" gutterBottom>
              Gmail account successfully connected!
            </Typography>
            
            {userProfile && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {userProfile.emailAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Messages:</strong> {userProfile.messagesTotal?.toLocaleString() || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Threads:</strong> {userProfile.threadsTotal?.toLocaleString() || 'N/A'}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleTestConnection}
                disabled={loading}
              >
                Test Connection
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleReauth}
                disabled={loading}
              >
                Re-authenticate
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {isAuthenticated ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GmailAuthComponent;
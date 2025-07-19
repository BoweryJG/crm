import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Mail as MailIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Visibility,
  VisibilityOff,
  Info as InfoIcon,
  Security as SecurityIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import DirectSMTPService, { SMTPCredentials } from '../../services/email/DirectSMTPService';
import { useAuth } from '../../auth/AuthContext';

interface WorkEmailSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WorkEmailSetupModal: React.FC<WorkEmailSetupModalProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customSMTP, setCustomSMTP] = useState({
    host: '',
    port: 587,
    secure: false
  });
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);

  // Auto-detect provider when email changes
  useEffect(() => {
    if (email) {
      const detectedProvider = DirectSMTPService.detectProvider(email);
      setProvider(detectedProvider);
      
      // Auto-fill display name
      if (!displayName) {
        const namePart = email.split('@')[0];
        const domain = email.split('@')[1];
        setDisplayName(`${namePart} - ${domain}`);
      }
    }
  }, [email, displayName]);

  // Get provider-specific settings
  const providerSettings = DirectSMTPService.getProviderSettings(provider);
  const setupInstructions = DirectSMTPService.getSetupInstructions(provider);

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      setTestResult(null);

      const credentials: SMTPCredentials = {
        email: email,
        password: password,
        host: provider === 'other' ? customSMTP.host : providerSettings.host!,
        port: provider === 'other' ? customSMTP.port : providerSettings.port!,
        secure: provider === 'other' ? customSMTP.secure : providerSettings.secure!,
        auth_type: 'plain'
      };

      const result = await DirectSMTPService.testConnection(credentials);
      setTestResult(result);

      if (result.success) {
        setActiveStep(2); // Move to final step
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({ success: false, error: 'Network error during test' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const accountData = {
        email_address: email,
        display_name: displayName,
        password: password,
        provider: provider,
        custom_smtp: provider === 'other' ? customSMTP : undefined
      };

      const result = await DirectSMTPService.addWorkEmailAccount(user?.id || '', accountData);

      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setActiveStep(0);
        setEmail('');
        setDisplayName('');
        setPassword('');
        setTestResult(null);
      } else {
        setError(result.error || 'Failed to save account');
      }
    } catch (error) {
      console.error('Save failed:', error);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getProviderIcon = (providerType: string) => {
    switch (providerType) {
      case 'gmail':
        return <GoogleIcon sx={{ color: '#EA4335' }} />;
      case 'outlook':
        return <MicrosoftIcon sx={{ color: '#0078D4' }} />;
      default:
        return <MailIcon />;
    }
  };

  const steps = [
    'Choose Provider',
    'Enter Credentials', 
    'Test & Save'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WorkIcon color="primary" />
          <Typography variant="h6">Add Work Email Account</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Send emails from your corporate email address - no IT approval required
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>🔒 Privacy Notice:</strong> Your email credentials are encrypted and stored securely. 
            This method bypasses OAuth to avoid IT approval requirements.
          </Typography>
        </Alert>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Choose Provider */}
          <Step>
            <StepLabel>Choose Email Provider</StepLabel>
            <StepContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Email Provider</InputLabel>
                <Select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  label="Email Provider"
                >
                  <MenuItem value="gmail">
                    <Box display="flex" alignItems="center" gap={1}>
                      <GoogleIcon sx={{ color: '#EA4335' }} />
                      Gmail / Google Workspace
                    </Box>
                  </MenuItem>
                  <MenuItem value="outlook">
                    <Box display="flex" alignItems="center" gap={1}>
                      <MicrosoftIcon sx={{ color: '#0078D4' }} />
                      Outlook / Office 365
                    </Box>
                  </MenuItem>
                  <MenuItem value="other">
                    <Box display="flex" alignItems="center" gap={1}>
                      <MailIcon />
                      Other Email Provider
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jen@allergan.com"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jen - Allergan"
                sx={{ mb: 2 }}
              />

              <Button 
                variant="contained" 
                onClick={() => setActiveStep(1)}
                disabled={!email || !displayName}
              >
                Next: Enter Credentials
              </Button>
            </StepContent>
          </Step>

          {/* Step 2: Enter Credentials */}
          <Step>
            <StepLabel>Enter Email Credentials</StepLabel>
            <StepContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Setup Instructions */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <InfoIcon color="primary" />
                    <Typography variant="subtitle2">
                      {setupInstructions.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {setupInstructions.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {index + 1}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                  
                  {setupInstructions.notes.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Important Notes:
                      </Typography>
                      {setupInstructions.notes.map((note, index) => (
                        <Chip 
                          key={index}
                          label={note} 
                          size="small" 
                          sx={{ mr: 1, mb: 1 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              <TextField
                fullWidth
                label={setupInstructions.app_password_required ? "App Password" : "Email Password"}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={setupInstructions.app_password_required ? "Your Gmail App Password" : "Your email password"}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={
                  setupInstructions.app_password_required
                    ? "Use App Password, not your regular password"
                    : "Your regular email password"
                }
              />

              {/* Custom SMTP Settings for "Other" provider */}
              {provider === 'other' && (
                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    SMTP Server Settings
                  </Typography>
                  <TextField
                    fullWidth
                    label="SMTP Host"
                    value={customSMTP.host}
                    onChange={(e) => setCustomSMTP(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="smtp.yourcompany.com"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="SMTP Port"
                    type="number"
                    value={customSMTP.port}
                    onChange={(e) => setCustomSMTP(prev => ({ ...prev, port: parseInt(e.target.value) || 587 }))}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}

              <Box display="flex" gap={1}>
                <Button onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleTestConnection}
                  disabled={!password || testing || (provider === 'other' && !customSMTP.host)}
                  startIcon={testing ? <CircularProgress size={16} /> : <SecurityIcon />}
                >
                  {testing ? 'Testing...' : 'Test Connection'}
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Test & Save */}
          <Step>
            <StepLabel>Test Results & Save</StepLabel>
            <StepContent>
              {testResult && (
                <Alert 
                  severity={testResult.success ? 'success' : 'error'} 
                  sx={{ mb: 2 }}
                  icon={testResult.success ? <CheckIcon /> : <ErrorIcon />}
                >
                  {testResult.success ? (
                    <Typography>
                      ✅ Connection successful! Your work email is ready to use.
                    </Typography>
                  ) : (
                    <Box>
                      <Typography gutterBottom>
                        ❌ Connection failed: {testResult.error}
                      </Typography>
                      <Typography variant="body2">
                        Check your credentials and try again. Make sure to use an App Password for Gmail.
                      </Typography>
                    </Box>
                  )}
                </Alert>
              )}

              {testResult?.success && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Account Summary:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getProviderIcon(provider)}
                    <Typography variant="body2">
                      <strong>{displayName}</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {email}
                  </Typography>
                  <Chip 
                    label={`${provider.toUpperCase()} SMTP`} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              <Box display="flex" gap={1}>
                <Button onClick={() => setActiveStep(1)}>
                  Back to Credentials
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!testResult?.success || saving}
                  startIcon={saving ? <CircularProgress size={16} /> : <CheckIcon />}
                >
                  {saving ? 'Saving...' : 'Save Work Email'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkEmailSetupModal;
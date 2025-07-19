import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Email as EmailIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Mail as MailIcon,
  Star as StarIcon
} from '@mui/icons-material';
import MultiEmailSendingService, { EmailAccount } from '../../services/email/MultiEmailSendingService';
import { useAuth } from '../../auth/AuthContext';

interface EmailSenderDropdownProps {
  selectedAccountId: string;
  onAccountChange: (accountId: string) => void;
  disabled?: boolean;
}

const EmailSenderDropdown: React.FC<EmailSenderDropdownProps> = ({
  selectedAccountId,
  onAccountChange,
  disabled = false
}) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    email_address: '',
    display_name: '',
    account_type: 'work' as 'personal' | 'work' | 'other',
    provider: 'gmail' as 'gmail' | 'outlook' | 'smtp'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadEmailAccounts();
    }
  }, [user?.id]);

  const loadEmailAccounts = async () => {
    try {
      setLoading(true);
      const repAccounts = await MultiEmailSendingService.getRepEmailAccounts(user?.id || '');
      setAccounts(repAccounts);
      
      // If no account selected but accounts exist, select primary
      if (!selectedAccountId && repAccounts.length > 0) {
        const primary = repAccounts.find(acc => acc.is_primary) || repAccounts[0];
        onAccountChange(primary.id);
      }
    } catch (error) {
      console.error('Failed to load email accounts:', error);
      setError('Failed to load email accounts');
    } finally {
      setLoading(false);
    }
  };

  const getAccountIcon = (account: EmailAccount) => {
    if (account.provider === 'gmail') {
      return <GoogleIcon sx={{ color: '#EA4335', fontSize: 16 }} />;
    } else if (account.provider === 'outlook') {
      return <MicrosoftIcon sx={{ color: '#0078D4', fontSize: 16 }} />;
    } else {
      return <MailIcon sx={{ color: '#666', fontSize: 16 }} />;
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'work':
        return <WorkIcon sx={{ fontSize: 14, color: '#1976d2' }} />;
      case 'personal':
        return <PersonIcon sx={{ fontSize: 14, color: '#2e7d32' }} />;
      default:
        return <EmailIcon sx={{ fontSize: 14, color: '#757575' }} />;
    }
  };

  const handleAddAccount = async () => {
    try {
      setError(null);
      
      if (!newAccountData.email_address || !newAccountData.display_name) {
        setError('Email and display name are required');
        return;
      }

      // For OAuth providers, start OAuth flow
      if (newAccountData.provider === 'gmail') {
        await handleGmailOAuth();
      } else if (newAccountData.provider === 'outlook') {
        await handleOutlookOAuth();
      } else {
        // For SMTP, we'd show additional fields for SMTP config
        setError('SMTP configuration not yet implemented in this demo');
      }
    } catch (error) {
      console.error('Failed to add account:', error);
      setError('Failed to add email account');
    }
  };

  const handleGmailOAuth = async () => {
    try {
      // Construct Gmail OAuth URL with additional scopes for sending
      const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email'
      ];

      const params = new URLSearchParams({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        redirect_uri: `${window.location.origin}/gmail-callback`,
        scope: scopes.join(' '),
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
        state: JSON.stringify({
          action: 'add_account',
          account_type: newAccountData.account_type,
          display_name: newAccountData.display_name
        })
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error('Gmail OAuth failed:', error);
      setError('Failed to start Gmail authentication');
    }
  };

  const handleOutlookOAuth = async () => {
    // Similar OAuth flow for Outlook/Microsoft Graph
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_MICROSOFT_CLIENT_ID || '',
      response_type: 'code',
      redirect_uri: `${window.location.origin}/outlook-callback`,
      scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read',
      state: JSON.stringify({
        action: 'add_account',
        account_type: newAccountData.account_type,
        display_name: newAccountData.display_name
      })
    });

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
    window.location.href = authUrl;
  };

  const handleSetPrimary = async (accountId: string) => {
    try {
      await MultiEmailSendingService.setPrimaryAccount(user?.id || '', accountId);
      await loadEmailAccounts();
    } catch (error) {
      console.error('Failed to set primary account:', error);
      setError('Failed to set primary account');
    }
  };

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel>Send From</InputLabel>
        <Select
          value={selectedAccountId}
          onChange={(e) => onAccountChange(e.target.value)}
          label="Send From"
          renderValue={(value) => {
            const account = accounts.find(acc => acc.id === value);
            if (!account) return '';
            
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {getAccountIcon(account)}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {account.display_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {account.email_address}
                  </Typography>
                </Box>
                {account.is_primary && (
                  <StarIcon sx={{ fontSize: 14, color: '#ffd700' }} />
                )}
              </Box>
            );
          }}
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              <Box display="flex" alignItems="center" gap={1} width="100%">
                {getAccountIcon(account)}
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {account.display_name}
                    </Typography>
                    {getAccountTypeIcon(account.account_type)}
                    {account.is_primary && (
                      <StarIcon sx={{ fontSize: 12, color: '#ffd700' }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {account.email_address}
                  </Typography>
                  <Box display="flex" gap={0.5} mt={0.5}>
                    <Chip 
                      label={account.account_type} 
                      size="small" 
                      color={account.account_type === 'work' ? 'primary' : 'default'}
                      sx={{ fontSize: 10, height: 16 }}
                    />
                    <Chip 
                      label={account.provider} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: 10, height: 16 }}
                    />
                  </Box>
                </Box>
                {!account.is_primary && (
                  <Tooltip title="Set as primary">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(account.id);
                      }}
                    >
                      <StarIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </MenuItem>
          ))}
          
          <MenuItem onClick={() => setShowAddDialog(true)}>
            <Box display="flex" alignItems="center" gap={1}>
              <AddIcon color="primary" />
              <Typography color="primary">Add Email Account</Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {/* Add Account Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Email Account</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={newAccountData.email_address}
            onChange={(e) => setNewAccountData(prev => ({ ...prev, email_address: e.target.value }))}
            margin="normal"
            placeholder="jen@allergan.com"
          />
          
          <TextField
            fullWidth
            label="Display Name"
            value={newAccountData.display_name}
            onChange={(e) => setNewAccountData(prev => ({ ...prev, display_name: e.target.value }))}
            margin="normal"
            placeholder="Jen - Allergan"
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Account Type</InputLabel>
            <Select
              value={newAccountData.account_type}
              onChange={(e) => setNewAccountData(prev => ({ ...prev, account_type: e.target.value as any }))}
              label="Account Type"
            >
              <MenuItem value="work">
                <Box display="flex" alignItems="center" gap={1}>
                  <WorkIcon sx={{ fontSize: 16 }} />
                  Work Email
                </Box>
              </MenuItem>
              <MenuItem value="personal">
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon sx={{ fontSize: 16 }} />
                  Personal Email
                </Box>
              </MenuItem>
              <MenuItem value="other">
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon sx={{ fontSize: 16 }} />
                  Other
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Email Provider</InputLabel>
            <Select
              value={newAccountData.provider}
              onChange={(e) => setNewAccountData(prev => ({ ...prev, provider: e.target.value as any }))}
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
              <MenuItem value="smtp" disabled>
                <Box display="flex" alignItems="center" gap={1}>
                  <MailIcon />
                  SMTP (Coming Soon)
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Work Email Instructions:</strong><br/>
              • Enter your corporate email (e.g., jen@allergan.com)<br/>
              • You'll be redirected to sign in with your work credentials<br/>
              • Your IT admin may need to approve the RepSpheres app<br/>
              • Once connected, you can send automated emails from your work address
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAccount} variant="contained">
            Connect Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmailSenderDropdown;
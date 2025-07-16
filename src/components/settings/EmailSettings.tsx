import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import GmailAuthComponent from '../gmail/GmailAuthComponent';
import gmailApiService from '../../services/gmail/gmailApiService';
import { gmailSyncService } from '../../services/email/gmailSyncService';
import { useNotification } from '../../contexts/NotificationContext';

interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'smtp';
  isConnected: boolean;
  lastSync?: Date;
  syncEnabled: boolean;
}

const EmailSettings: React.FC = () => {
  const { showNotification } = useNotification();
  const [gmailAuthOpen, setGmailAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [syncInterval, setSyncInterval] = useState(15); // minutes
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  useEffect(() => {
    checkEmailAccounts();
    loadSyncPreferences();
  }, []);

  const loadSyncPreferences = async () => {
    const prefs = await gmailSyncService.loadSyncPreferences();
    if (prefs) {
      setAutoSyncEnabled(prefs.auto_sync_enabled);
      setSyncInterval(prefs.sync_interval_minutes);
    }
  };

  const checkEmailAccounts = async () => {
    setLoading(true);
    try {
      // Check Gmail connection
      if (gmailApiService.isReady()) {
        const profile = await gmailApiService.getUserProfile();
        setEmailAccounts([{
          id: '1',
          email: profile.emailAddress,
          provider: 'gmail',
          isConnected: true,
          lastSync: gmailSyncService.getLastSyncTime() || undefined,
          syncEnabled: true
        }]);
        
        // Check if auto-sync is enabled
        const isAutoSyncActive = gmailSyncService.getLastSyncTime() !== null;
        setAutoSyncEnabled(isAutoSyncActive);
      } else {
        setEmailAccounts([]);
      }
    } catch (error) {
      console.error('Error checking email accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailAuthSuccess = async (profile: any) => {
    showNotification(`Successfully connected Gmail: ${profile.emailAddress}`, 'success');
    setGmailAuthOpen(false);
    await checkEmailAccounts();
    
    // Start initial sync
    handleSyncNow();
  };

  const handleGmailAuthError = (error: string) => {
    showNotification(error, 'error');
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const result = await gmailSyncService.syncAllAccounts();
      if (result.success) {
        showNotification(`Successfully synced ${result.syncedCount} emails`, 'success');
        await checkEmailAccounts();
      } else {
        showNotification(result.error || 'Sync failed', 'error');
      }
    } catch (error) {
      showNotification('Failed to sync emails', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoSyncToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        await gmailSyncService.startAutoSync(syncInterval);
        showNotification(`Auto-sync enabled (every ${syncInterval} minutes)`, 'success');
      } else {
        gmailSyncService.stopAutoSync();
        showNotification('Auto-sync disabled', 'info');
      }
      setAutoSyncEnabled(enabled);
    } catch (error) {
      showNotification('Failed to update auto-sync settings', 'error');
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      gmailApiService.logout();
      gmailSyncService.stopAutoSync();
      setEmailAccounts([]);
      setAutoSyncEnabled(false);
      showNotification('Gmail account disconnected', 'info');
    } catch (error) {
      showNotification('Failed to disconnect account', 'error');
    }
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Email Integration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Connect your email accounts to sync messages and enable email tracking
      </Typography>

      {/* Connected Accounts */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              Connected Accounts
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setGmailAuthOpen(true)}
              disabled={loading || emailAccounts.length > 0}
            >
              Add Gmail Account
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : emailAccounts.length === 0 ? (
            <Alert severity="info">
              No email accounts connected. Click "Add Gmail Account" to get started.
            </Alert>
          ) : (
            <List>
              {emailAccounts.map(account => (
                <ListItem key={account.id}>
                  <ListItemIcon>
                    <GoogleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={account.email}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          Last synced: {formatLastSync(account.lastSync)}
                        </Typography>
                        <Chip
                          size="small"
                          icon={<CheckCircleIcon />}
                          label="Connected"
                          color="success"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDisconnectAccount(account.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Sync Settings */}
      {emailAccounts.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sync Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSyncEnabled}
                    onChange={(e) => handleAutoSyncToggle(e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Auto-sync emails</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automatically sync new emails at regular intervals
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {autoSyncEnabled && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="Sync Interval"
                  value={syncInterval}
                  onChange={async (e) => {
                    const newInterval = Number(e.target.value);
                    setSyncInterval(newInterval);
                    // Update if auto-sync is enabled
                    if (autoSyncEnabled) {
                      await gmailSyncService.startAutoSync(newInterval);
                      showNotification(`Auto-sync interval updated to ${newInterval} minutes`, 'success');
                    }
                  }}
                  helperText="How often to check for new emails"
                >
                  <MenuItem value={5}>Every 5 minutes</MenuItem>
                  <MenuItem value={15}>Every 15 minutes</MenuItem>
                  <MenuItem value={30}>Every 30 minutes</MenuItem>
                  <MenuItem value={60}>Every hour</MenuItem>
                </TextField>
              </Box>
            )}

            <Button
              variant="contained"
              startIcon={syncing ? <CircularProgress size={20} /> : <SyncIcon />}
              onClick={handleSyncNow}
              disabled={syncing}
              fullWidth
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Email Preferences */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Preferences
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label={
                <Box>
                  <Typography variant="body1">Track email opens</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get notified when recipients open your emails
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Switch defaultChecked />}
              label={
                <Box>
                  <Typography variant="body1">Track link clicks</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Monitor when recipients click links in your emails
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={<Switch />}
              label={
                <Box>
                  <Typography variant="body1">Save sent emails to CRM</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Automatically log outgoing emails to contact records
                  </Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Gmail Auth Dialog */}
      <GmailAuthComponent
        open={gmailAuthOpen}
        onClose={() => setGmailAuthOpen(false)}
        onAuthSuccess={handleGmailAuthSuccess}
        onAuthError={handleGmailAuthError}
      />
    </>
  );
};

export default EmailSettings;
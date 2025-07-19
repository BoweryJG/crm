import React, { useState, useEffect } from 'react';
import {
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge
} from '@mui/material';
import {
  Sync as SyncIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Google as GoogleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { gmailSyncService } from '../../services/email/gmailSyncService';
import GmailAuthComponent from '../gmail/GmailAuthComponent';
import { formatDistanceToNow } from 'date-fns';

interface EmailSyncButtonProps {
  variant?: 'icon' | 'button';
  onSyncComplete?: (result: { success: boolean; syncedCount: number }) => void;
}

const EmailSyncButton: React.FC<EmailSyncButtonProps> = ({
  variant = 'icon',
  onSyncComplete
}) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize Gmail API and check authentication status
    const initializeGmail = async () => {
      try {
        const initialized = await gmailSyncService.initializeGmailApi();
        setIsAuthenticated(initialized);
        
        if (initialized) {
          const lastSyncTime = gmailSyncService.getLastSyncTime();
          setLastSync(lastSyncTime);
        }
      } catch (error) {
        console.error('Failed to initialize Gmail:', error);
        setIsAuthenticated(false);
      }
    };

    initializeGmail();
  }, []);

  const handleSync = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    setSyncing(true);
    setSyncStatus('idle');

    try {
      const result = await gmailSyncService.syncAllAccounts();
      
      if (result.success) {
        setSyncStatus('success');
        setLastSync(new Date());
        onSyncComplete?.(result);
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setSyncing(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const handleAuthSuccess = (profile: any) => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    console.log('Gmail authenticated:', profile);
  };

  const handleAuthError = (error: string) => {
    console.error('Gmail auth error:', error);
    setSyncStatus('error');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleAutoSync = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      handleMenuClose();
      return;
    }

    try {
      if (autoSyncEnabled) {
        gmailSyncService.stopAutoSync();
        setAutoSyncEnabled(false);
      } else {
        await gmailSyncService.startAutoSync(15); // Sync every 15 minutes
        setAutoSyncEnabled(true);
      }
    } catch (error) {
      console.error('Error toggling auto-sync:', error);
      setSyncStatus('error');
    }
    handleMenuClose();
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    if (!isAuthenticated) {
      return <WarningIcon />;
    }
    
    switch (syncStatus) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <SyncIcon className={syncing ? 'rotating' : ''} />;
    }
  };

  const syncButton = variant === 'icon' ? (
    <Tooltip title={
      <div>
        <Typography variant="body2">
          {!isAuthenticated ? 'Connect Gmail' : 'Sync Gmail'}
        </Typography>
        {!isAuthenticated && (
          <Typography variant="caption" color="warning.main">
            Gmail not connected
          </Typography>
        )}
        {isAuthenticated && lastSync && (
          <Typography variant="caption">
            Last synced {formatDistanceToNow(lastSync, { addSuffix: true })}
          </Typography>
        )}
      </div>
    }>
      <span>
        <IconButton
          onClick={handleSync}
          disabled={syncing}
          color={!isAuthenticated ? 'warning' : getStatusColor() as any}
          onContextMenu={(e) => {
            e.preventDefault();
            handleMenuOpen(e);
          }}
        >
          <Badge
            color="success"
            variant="dot"
            invisible={!autoSyncEnabled || !isAuthenticated}
          >
            {syncing ? <CircularProgress size={24} /> : getStatusIcon()}
          </Badge>
        </IconButton>
      </span>
    </Tooltip>
  ) : (
    <Button
      variant="outlined"
      startIcon={syncing ? <CircularProgress size={16} /> : getStatusIcon()}
      onClick={handleSync}
      disabled={syncing}
      color={!isAuthenticated ? 'warning' : getStatusColor() as any}
      onContextMenu={(e) => {
        e.preventDefault();
        handleMenuOpen(e);
      }}
    >
      {syncing ? 'Syncing...' : (!isAuthenticated ? 'Connect Gmail' : 'Sync Gmail')}
    </Button>
  );

  return (
    <>
      {syncButton}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {!isAuthenticated && (
          <MenuItem onClick={() => { setShowAuthDialog(true); handleMenuClose(); }}>
            <ListItemIcon>
              <GoogleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              Connect Gmail
            </ListItemText>
          </MenuItem>
        )}
        {isAuthenticated && (
          <MenuItem onClick={toggleAutoSync}>
            <ListItemIcon>
              <ScheduleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {autoSyncEnabled ? 'Disable' : 'Enable'} Auto-sync
            </ListItemText>
          </MenuItem>
        )}
        {isAuthenticated && lastSync && (
          <MenuItem disabled>
            <ListItemText>
              <Typography variant="caption">
                Last synced {formatDistanceToNow(lastSync, { addSuffix: true })}
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
      
      <GmailAuthComponent
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
      />
    </>
  );
};

export default EmailSyncButton;

// Add CSS for rotating animation
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .rotating {
    animation: rotate 1s linear infinite;
  }
`;
document.head.appendChild(style);
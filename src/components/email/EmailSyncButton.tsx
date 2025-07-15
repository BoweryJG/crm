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
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { gmailSyncService } from '../../services/email/gmailSyncService';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

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

  useEffect(() => {
    // Get last sync time on mount
    const lastSyncTime = gmailSyncService.getLastSyncTime();
    setLastSync(lastSyncTime);
  }, []);

  const handleSync = async () => {
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleAutoSync = () => {
    if (autoSyncEnabled) {
      gmailSyncService.stopAutoSync();
      setAutoSyncEnabled(false);
    } else {
      gmailSyncService.startAutoSync(15); // Sync every 15 minutes
      setAutoSyncEnabled(true);
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
        <Typography variant="body2">Sync Gmail</Typography>
        {lastSync && (
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
          color={getStatusColor() as any}
          onContextMenu={(e) => {
            e.preventDefault();
            handleMenuOpen(e);
          }}
        >
          <Badge
            color="success"
            variant="dot"
            invisible={!autoSyncEnabled}
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
      color={getStatusColor() as any}
      onContextMenu={(e) => {
        e.preventDefault();
        handleMenuOpen(e);
      }}
    >
      {syncing ? 'Syncing...' : 'Sync Gmail'}
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
        <MenuItem onClick={toggleAutoSync}>
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {autoSyncEnabled ? 'Disable' : 'Enable'} Auto-sync
          </ListItemText>
        </MenuItem>
        {lastSync && (
          <MenuItem disabled>
            <ListItemText>
              <Typography variant="caption">
                Last synced {formatDistanceToNow(lastSync, { addSuffix: true })}
              </Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
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
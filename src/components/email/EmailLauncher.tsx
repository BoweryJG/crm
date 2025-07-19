import React, { useState } from 'react';
import {
  Fab,
  Tooltip,
  Badge,
  Box,
  useTheme,
  alpha,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Email as EmailIcon,
  Add as AddIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  Edit as DraftIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Translate as TranslateIcon,
  SmartToy as AIIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound } from '../../hooks/useSound';
import UltraEmailModal from './UltraEmailModal';

interface EmailLauncherProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  unreadCount?: number;
  onEmailSent?: (emailData: any) => void;
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultContent?: string;
  mode?: 'compose' | 'reply' | 'forward';
  contextData?: any;
}

const EmailLauncher: React.FC<EmailLauncherProps> = ({
  position = 'bottom-right',
  unreadCount = 0,
  onEmailSent,
  defaultRecipient,
  defaultSubject,
  defaultContent,
  mode = 'compose',
  contextData
}) => {
  const theme = useTheme();
  const { themeMode, currentTheme } = useThemeContext();
  const notificationSound = useSound('notification-success');
  const clickSound = useSound('ui-click-primary');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [emailMode, setEmailMode] = useState<'compose' | 'reply' | 'forward'>(mode);

  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 1300,
    };

    switch (position) {
      case 'bottom-right':
        return { ...base, bottom: 24, right: 24 };
      case 'bottom-left':
        return { ...base, bottom: 24, left: 24 };
      case 'top-right':
        return { ...base, top: 24, right: 24 };
      case 'top-left':
        return { ...base, top: 24, left: 24 };
      default:
        return { ...base, bottom: 24, right: 24 };
    }
  };

  const getThemeColor = () => {
    if (currentTheme?.category === 'luxury') {
      return '#FFD700';
    }
    if (currentTheme?.category === 'aviation') {
      return '#1E88E5';
    }
    if (currentTheme?.category === 'beauty') {
      return '#E91E63';
    }
    return theme.palette.primary.main;
  };

  const handleMainClick = () => {
    notificationSound.play();
    setEmailMode('compose');
    setIsModalOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    clickSound.play();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: string) => {
    notificationSound.play();
    setAnchorEl(null);
    
    switch (action) {
      case 'compose':
        setEmailMode('compose');
        setIsModalOpen(true);
        break;
      case 'reply':
        setEmailMode('reply');
        setIsModalOpen(true);
        break;
      case 'forward':
        setEmailMode('forward');
        setIsModalOpen(true);
        break;
      case 'drafts':
        // Open drafts view
        setEmailMode('compose');
        setIsModalOpen(true);
        break;
      case 'analytics':
        // Open analytics tab
        setEmailMode('compose');
        setIsModalOpen(true);
        break;
    }
  };

  const themeColor = getThemeColor();

  const fabStyles = {
    background: `linear-gradient(135deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
    color: 'white',
    boxShadow: `0 8px 32px ${alpha(themeColor, 0.4)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: `linear-gradient(135deg, ${alpha(themeColor, 0.9)}, ${alpha(themeColor, 0.7)})`,
      transform: 'scale(1.1) rotate(5deg)',
      boxShadow: `0 12px 40px ${alpha(themeColor, 0.6)}`,
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    backdropFilter: 'blur(10px)',
    border: `1px solid ${alpha(themeColor, 0.3)}`,
  };

  const glowAnimation = {
    '@keyframes emailGlow': {
      '0%': {
        boxShadow: `0 0 20px ${alpha(themeColor, 0.5)}`,
      },
      '50%': {
        boxShadow: `0 0 40px ${alpha(themeColor, 0.8)}, 0 0 60px ${alpha(themeColor, 0.4)}`,
      },
      '100%': {
        boxShadow: `0 0 20px ${alpha(themeColor, 0.5)}`,
      },
    },
    animation: unreadCount > 0 ? 'emailGlow 2s ease-in-out infinite' : 'none',
  };

  return (
    <>
      <Box sx={getPositionStyles()}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
          {/* Quick Actions Menu */}
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              background: alpha(themeColor, 0.1),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(themeColor, 0.2)}`,
              color: themeColor,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: alpha(themeColor, 0.2),
                transform: 'scale(1.1)',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>

          {/* Main Email FAB */}
          <Tooltip title="Compose Email" placement="left">
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                  fontWeight: 'bold',
                  animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                },
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <Fab
                color="primary"
                onClick={handleMainClick}
                sx={{
                  ...fabStyles,
                  ...glowAnimation,
                  width: 64,
                  height: 64,
                }}
              >
                <EmailIcon sx={{ fontSize: 28 }} />
              </Fab>
            </Badge>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 3,
            minWidth: 220,
          },
        }}
      >
        <MenuItem onClick={() => handleMenuAction('compose')}>
          <ListItemIcon>
            <EmailIcon sx={{ color: themeColor }} />
          </ListItemIcon>
          <ListItemText
            primary="New Email"
            secondary="Start fresh composition"
          />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('reply')}>
          <ListItemIcon>
            <ReplyIcon sx={{ color: themeColor }} />
          </ListItemIcon>
          <ListItemText
            primary="Reply"
            secondary="Respond to message"
          />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('forward')}>
          <ListItemIcon>
            <ForwardIcon sx={{ color: themeColor }} />
          </ListItemIcon>
          <ListItemText
            primary="Forward"
            secondary="Share with others"
          />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={() => handleMenuAction('drafts')}>
          <ListItemIcon>
            <DraftIcon sx={{ color: theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText
            primary="Drafts"
            secondary="Continue writing"
          />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('analytics')}>
          <ListItemIcon>
            <AnalyticsIcon sx={{ color: theme.palette.text.secondary }} />
          </ListItemIcon>
          <ListItemText
            primary="Analytics"
            secondary="Email insights"
          />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            🏆 Revolutionary Email Client
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
            <AIIcon sx={{ fontSize: 16, color: themeColor }} />
            <TranslateIcon sx={{ fontSize: 16, color: themeColor }} />
            <CampaignIcon sx={{ fontSize: 16, color: themeColor }} />
          </Box>
        </Box>
      </Menu>

      {/* Ultra Email Modal */}
      <UltraEmailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={emailMode}
        defaultRecipient={defaultRecipient}
        defaultSubject={defaultSubject}
        defaultContent={defaultContent}
        contextData={contextData}
        onEmailSent={(data) => {
          onEmailSent?.(data);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default EmailLauncher;
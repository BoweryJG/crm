// Operations Center - Consolidated mobile-first operational component
// Combines QuickCallWidget, LiveActionTicker, and CartierBlended into one interface

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Collapse,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Event as MeetingIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Search as SearchIcon,
  AccessTime as RecentIcon,
  Star as FavoriteIcon,
  TrendingUp as TrendingIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../themes/ThemeContext';
import { getThemeAccents, getThemeGlass } from './ThemeAwareComponents';
import glassEffects from '../../themes/glassEffects';

type OperationMode = 'quick-actions' | 'communications' | 'live-feed';
type ActionType = 'call' | 'email' | 'meeting' | 'message';

interface Contact {
  id: string;
  name: string;
  role: string;
  practice: string;
  lastContact: string;
  favorite?: boolean;
}

interface LiveAction {
  id: string;
  type: ActionType;
  contact: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

const OperationsCenter: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [operationMode, setOperationMode] = useState<OperationMode>('quick-actions');
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType>('call');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const themeAccents = getThemeAccents(themeMode);
  const themeGlass = getThemeGlass(themeMode);
  
  // Mock data
  const recentContacts: Contact[] = [
    { id: '1', name: 'Dr. Smith', role: 'Cardiologist', practice: 'Heart Health Clinic', lastContact: '2 hours ago', favorite: true },
    { id: '2', name: 'Dr. Johnson', role: 'Surgeon', practice: 'City Medical Center', lastContact: 'Yesterday' },
    { id: '3', name: 'Dr. Williams', role: 'Dentist', practice: 'Smile Dental', lastContact: '3 days ago', favorite: true },
  ];
  
  const liveActions: LiveAction[] = [
    { id: '1', type: 'call', contact: 'Dr. Smith', message: 'Follow-up on new equipment', timestamp: '2:30 PM', status: 'completed' },
    { id: '2', type: 'email', contact: 'Dr. Johnson', message: 'Sent product catalog', timestamp: '1:45 PM', status: 'completed' },
    { id: '3', type: 'meeting', contact: 'Dr. Williams', message: 'Scheduled for tomorrow', timestamp: '12:00 PM', status: 'pending' },
  ];
  
  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'call': return <PhoneIcon />;
      case 'email': return <EmailIcon />;
      case 'meeting': return <MeetingIcon />;
      case 'message': return <ChatIcon />;
    }
  };
  
  const getActionColor = (type: ActionType) => {
    switch (type) {
      case 'call': return themeAccents.primary;
      case 'email': return themeAccents.secondary;
      case 'meeting': return themeAccents.glow;
      case 'message': return themeAccents.success || '#00ff41';
    }
  };
  
  const getModeIcon = (mode: OperationMode) => {
    switch (mode) {
      case 'quick-actions': return <PhoneIcon />;
      case 'communications': return <ChatIcon />;
      case 'live-feed': return <TrendingIcon />;
    }
  };
  
  return (
    <Box
      sx={{
        position: 'relative',
        ...themeGlass,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 700,
              color: themeAccents.primary,
              textTransform: 'uppercase',
              letterSpacing: isMobile ? 1 : 2,
              fontSize: isMobile ? '0.9rem' : '1.1rem',
            }}
          >
            Operations
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: isMobile ? 120 : 150 }}>
            <Select
              value={operationMode}
              onChange={(e) => setOperationMode(e.target.value as OperationMode)}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                },
              }}
            >
              {(['quick-actions', 'communications', 'live-feed'] as OperationMode[]).map((mode) => (
                <MenuItem key={mode} value={mode}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {React.cloneElement(getModeIcon(mode), { sx: { fontSize: 16 } })}
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {mode.replace('-', ' ')}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ color: themeAccents.primary }}
        >
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </Box>
      
      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {operationMode === 'quick-actions' && (
            <QuickActionsView
              themeAccents={themeAccents}
              isMobile={isMobile}
              selectedAction={selectedAction}
              setSelectedAction={setSelectedAction}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              recentContacts={recentContacts}
              onContactSelect={(contact) => {
                setSelectedContact(contact);
                setDrawerOpen(true);
              }}
            />
          )}
          
          {operationMode === 'communications' && (
            <CommunicationsHub
              themeAccents={themeAccents}
              isMobile={isMobile}
            />
          )}
          
          {operationMode === 'live-feed' && (
            <LiveFeed
              themeAccents={themeAccents}
              liveActions={liveActions}
            />
          )}
        </Box>
      </Collapse>
      
      {/* Action Drawer */}
      <ActionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        contact={selectedContact}
        actionType={selectedAction}
        themeAccents={themeAccents}
      />
    </Box>
  );
};

// Quick Actions View
const QuickActionsView: React.FC<{
  themeAccents: any;
  isMobile: boolean;
  selectedAction: ActionType;
  setSelectedAction: (action: ActionType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentContacts: Contact[];
  onContactSelect: (contact: Contact) => void;
}> = ({
  themeAccents,
  isMobile,
  selectedAction,
  setSelectedAction,
  searchQuery,
  setSearchQuery,
  recentContacts,
  onContactSelect,
}) => {
  const theme = useTheme();
  
  const actions: ActionType[] = ['call', 'email', 'meeting', 'message'];
  
  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'call': return <PhoneIcon />;
      case 'email': return <EmailIcon />;
      case 'meeting': return <MeetingIcon />;
      case 'message': return <ChatIcon />;
    }
  };
  
  const getActionColor = (type: ActionType) => {
    switch (type) {
      case 'call': return themeAccents.primary;
      case 'email': return themeAccents.secondary;
      case 'meeting': return themeAccents.glow;
      case 'message': return themeAccents.success || '#00ff41';
    }
  };
  
  return (
    <Box>
      {/* Action Selector */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 1 }}>
        {actions.map((action) => (
          <Chip
            key={action}
            icon={getActionIcon(action)}
            label={action.charAt(0).toUpperCase() + action.slice(1)}
            onClick={() => setSelectedAction(action)}
            sx={{
              backgroundColor: selectedAction === action 
                ? alpha(getActionColor(action), 0.2)
                : alpha(theme.palette.background.paper, 0.5),
              color: selectedAction === action 
                ? getActionColor(action)
                : theme.palette.text.secondary,
              borderColor: selectedAction === action 
                ? getActionColor(action)
                : 'transparent',
              borderWidth: 1,
              borderStyle: 'solid',
              '&:hover': {
                backgroundColor: alpha(getActionColor(action), 0.3),
                borderColor: getActionColor(action),
              },
            }}
          />
        ))}
      </Box>
      
      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Recent Contacts */}
      <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.secondary }}>
        Recent Contacts
      </Typography>
      <List sx={{ p: 0 }}>
        {recentContacts.map((contact) => (
          <ListItemButton
            key={contact.id}
            onClick={() => onContactSelect(contact)}
            sx={{
              borderRadius: 1,
              mb: 1,
              background: alpha(theme.palette.background.paper, 0.5),
              '&:hover': {
                background: alpha(themeAccents.primary, 0.1),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {contact.favorite ? (
                <FavoriteIcon sx={{ color: themeAccents.warning || '#ffaa00', fontSize: 20 }} />
              ) : (
                <RecentIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={contact.name}
              secondary={`${contact.role} • ${contact.practice}`}
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              secondaryTypographyProps={{ fontSize: '0.75rem' }}
            />
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {contact.lastContact}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

// Communications Hub
const CommunicationsHub: React.FC<{
  themeAccents: any;
  isMobile: boolean;
}> = ({ themeAccents, isMobile }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
        Quick Message Center
      </Typography>
      
      {/* Message Templates */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          Templates
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {['Follow-up', 'Thank you', 'Schedule meeting', 'Product info'].map((template) => (
            <Chip
              key={template}
              label={template}
              size="small"
              onClick={() => setMessage(`${template} message template...`)}
              sx={{
                backgroundColor: alpha(themeAccents.secondary, 0.1),
                color: themeAccents.secondary,
                '&:hover': {
                  backgroundColor: alpha(themeAccents.secondary, 0.2),
                },
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Message Input */}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button
        fullWidth
        variant="contained"
        startIcon={<SendIcon />}
        sx={{
          backgroundColor: themeAccents.primary,
          '&:hover': {
            backgroundColor: alpha(themeAccents.primary, 0.8),
          },
        }}
      >
        Send Message
      </Button>
    </Box>
  );
};

// Live Feed
const LiveFeed: React.FC<{
  themeAccents: any;
  liveActions: LiveAction[];
}> = ({ themeAccents, liveActions }) => {
  const theme = useTheme();
  
  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'call': return <PhoneIcon />;
      case 'email': return <EmailIcon />;
      case 'meeting': return <MeetingIcon />;
      case 'message': return <ChatIcon />;
    }
  };
  
  const getActionColor = (type: ActionType) => {
    switch (type) {
      case 'call': return themeAccents.primary;
      case 'email': return themeAccents.secondary;
      case 'meeting': return themeAccents.glow;
      case 'message': return themeAccents.success || '#00ff41';
    }
  };
  
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
        Recent Activity
      </Typography>
      
      {liveActions.map((action, index) => (
        <Fade in key={action.id} timeout={300 + index * 100}>
          <Box
            sx={{
              p: 1.5,
              mb: 1,
              borderRadius: 1,
              background: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(getActionColor(action.type), 0.1),
                color: getActionColor(action.type),
              }}
            >
              {getActionIcon(action.type)}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {action.contact}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {action.message}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {action.timestamp}
              </Typography>
              {action.status === 'completed' && (
                <SuccessIcon sx={{ fontSize: 16, color: themeAccents.success, display: 'block', ml: 'auto' }} />
              )}
            </Box>
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

// Action Drawer
const ActionDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  contact: Contact | null;
  actionType: ActionType;
  themeAccents: any;
}> = ({ open, onClose, contact, actionType, themeAccents }) => {
  const theme = useTheme();
  
  if (!contact) return null;
  
  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'call': return <PhoneIcon />;
      case 'email': return <EmailIcon />;
      case 'meeting': return <MeetingIcon />;
      case 'message': return <ChatIcon />;
    }
  };
  
  const getActionColor = (type: ActionType) => {
    switch (type) {
      case 'call': return themeAccents.primary;
      case 'email': return themeAccents.secondary;
      case 'meeting': return themeAccents.glow;
      case 'message': return themeAccents.success || '#00ff41';
    }
  };
  
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          maxHeight: '60vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">
          {actionType.charAt(0).toUpperCase() + actionType.slice(1)} {contact.name}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          {contact.role} at {contact.practice}
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          Last contact: {contact.lastContact}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={getActionIcon(actionType)}
          sx={{
            backgroundColor: getActionColor(actionType),
            '&:hover': {
              backgroundColor: alpha(getActionColor(actionType), 0.8),
            },
          }}
        >
          Start {actionType}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default OperationsCenter;
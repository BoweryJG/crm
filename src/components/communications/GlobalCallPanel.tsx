import React, { useState } from 'react';
import {
  Fab,
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Close as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { formatPhoneNumber, initiateCall } from '../../services/twilio/twilioService';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../themes/ThemeContext';

const GlobalCallPanel: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [callInProgress, setCallInProgress] = useState(false);
  const [currentCallInfo, setCurrentCallInfo] = useState<{
    phoneNumber: string;
    name?: string;
    startTime: Date;
  } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [durationInterval, setDurationInterval] = useState<NodeJS.Timeout | null>(null);

  // Toggle the call panel
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle making a direct call
  const handleCall = async () => {
    if (!phoneNumber) return;
    
    const formattedNumber = formatPhoneNumber(phoneNumber);
    if (!formattedNumber) {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      // In a real implementation, you would get the 'from' number from user settings
      const fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER || '';
      
      if (!fromNumber) {
        alert('No outbound phone number configured');
        return;
      }

      const result = await initiateCall({
        to: formattedNumber,
        from: fromNumber,
        contactId: 'direct-call', // This would be handled differently in a real app
        practiceId: 'direct-call',
        userId: user?.id || 'anonymous'
      });

      if (result.success) {
        setCallInProgress(true);
        setCurrentCallInfo({
          phoneNumber: formattedNumber,
          startTime: new Date()
        });
        
        // Start tracking call duration
        const interval = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setDurationInterval(interval);
        
        // Add to recent calls (in a real app, this would come from your database)
        setRecentCalls(prev => [
          {
            id: Date.now().toString(),
            phoneNumber: formattedNumber,
            date: new Date(),
          },
          ...prev.slice(0, 4) // Keep only the 5 most recent calls
        ]);
      } else {
        alert(`Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error making call:', error);
      alert('Failed to make call');
    }
  };

  // Handle ending the current call
  const handleEndCall = () => {
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
    
    setCallInProgress(false);
    setCurrentCallInfo(null);
    setCallDuration(0);
    
    // In a real implementation, you would update the call status in your database
  };

  // Handle calling a recent number
  const handleCallRecent = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
    handleCall();
  };

  return (
    <>
      {/* Floating call button */}
      <Fab
        color="primary"
        aria-label="call"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
        onClick={toggleDrawer}
      >
        <PhoneIcon />
      </Fab>

      {/* Call panel drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={callInProgress ? undefined : toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 350,
            padding: 2,
            boxSizing: 'border-box',
            backgroundColor:
              themeMode === 'space'
                ? 'rgba(22, 27, 44, 0.7)'
                : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${
              themeMode === 'space'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
            }`
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {callInProgress ? 'Call in Progress' : 'Make a Call'}
          </Typography>
          {!callInProgress && (
            <IconButton onClick={toggleDrawer} edge="end">
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {callInProgress && currentCallInfo ? (
          // Active call UI
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            
            <Typography variant="h6">
              {currentCallInfo.name || currentCallInfo.phoneNumber}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Call started at {currentCallInfo.startTime.toLocaleTimeString()}
            </Typography>
            
            <Typography variant="h4" sx={{ fontFamily: 'monospace', my: 2 }}>
              {formatDuration(callDuration)}
            </Typography>
            
            <Button
              variant="contained"
              color="error"
              startIcon={<CallEndIcon />}
              onClick={handleEndCall}
              sx={{ borderRadius: 28, px: 3 }}
            >
              End Call
            </Button>
          </Box>
        ) : (
          // Call initiation UI
          <>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<CallIcon />}
              onClick={handleCall}
              fullWidth
              sx={{ mb: 3 }}
            >
              Call Now
            </Button>
            
            {recentCalls.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Recent Calls
                </Typography>
                
                <List sx={{ width: '100%' }}>
                  {recentCalls.map((call) => (
                    <React.Fragment key={call.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleCallRecent(call.phoneNumber)}>
                            <CallIcon color="primary" />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={call.phoneNumber}
                          secondary={new Date(call.date).toLocaleString()}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default GlobalCallPanel;

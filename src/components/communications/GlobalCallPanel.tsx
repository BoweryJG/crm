// Global Call Panel - Integrated with Twilio Call Service
import React, { useState, useEffect, useCallback } from 'react';
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
  useTheme,
  Chip,
  LinearProgress,
  Alert,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Timer as TimerIcon,
  Analytics as AnalyticsIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeMuteIcon,
  Psychology as AIIcon
} from '@mui/icons-material';
import { twilioCallService, TwilioCallRecord } from '../../services/twilioCallService';
import { conversationIntelligenceService } from '../../services/conversationIntelligenceService';
import { useAuth } from '../../auth/AuthContext';
import { useThemeContext } from '../../themes/ThemeContext';
import { useUnifiedAuth } from '../../contexts/UnifiedAuthContext_20250730';
import { FeatureGate, TierBadge, UpgradePrompt, RepXTier } from '../../unified-auth';

interface Contact {
  id: string;
  name: string;
  phone: string;
  practice?: string;
}

const GlobalCallPanel: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const { tier, features, checkFeature, canMakePhoneCalls, agentTimeLimit, agentDisplayTime } = useUnifiedAuth();
  
  // UI State
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Call State
  const [callInProgress, setCallInProgress] = useState(false);
  const [currentCall, setCurrentCall] = useState<TwilioCallRecord | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [durationInterval, setDurationInterval] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  
  // Data State
  const [recentCalls, setRecentCalls] = useState<TwilioCallRecord[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Real-time Intelligence
  const [liveInsights, setLiveInsights] = useState<{
    sentiment: 'positive' | 'neutral' | 'negative';
    keyPoints: string[];
    suggestedResponse?: string;
  } | null>(null);

  // Load recent calls
  const loadRecentCalls = useCallback(async () => {
    try {
      const calls = await twilioCallService.getUserCalls(user?.id || '', {
        status: 'completed'
      });
      setRecentCalls(calls.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent calls:', error);
    }
  }, [user?.id]);

  // Load contacts (mock data for now)
  const loadContacts = useCallback(async () => {
    // In production, this would fetch from your contacts service
    setContacts([
      { id: '1', name: 'Dr. Smith', phone: '+1234567890', practice: 'Smith Dental' },
      { id: '2', name: 'Dr. Johnson', phone: '+0987654321', practice: 'Johnson Aesthetics' },
      { id: '3', name: 'Dr. Williams', phone: '+1122334455', practice: 'Williams Medical' }
    ]);
  }, []);

  // Load recent calls and contacts on mount
  useEffect(() => {
    if (user?.id) {
      loadRecentCalls();
      loadContacts();
    }
  }, [user?.id, loadRecentCalls, loadContacts]);

  // Initialize Twilio service
  useEffect(() => {
    const initTwilio = async () => {
      await twilioCallService.initialize({
        account_sid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
        auth_token: process.env.REACT_APP_TWILIO_AUTH_TOKEN || '',
        phone_number: process.env.REACT_APP_TWILIO_PHONE_NUMBER || '',
        recording_callback_url: process.env.REACT_APP_TWILIO_RECORDING_CALLBACK || '',
        transcription_callback_url: process.env.REACT_APP_TWILIO_TRANSCRIPTION_CALLBACK || ''
      });
    };
    initTwilio();
  }, []);

  // Toggle the call panel
  const toggleDrawer = () => {
    if (!callInProgress) {
      setOpen(!open);
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle making a call
  const handleCall = async () => {
    if (!phoneNumber && !selectedContact) return;
    
    // Check if user has phone access
    if (!canMakePhoneCalls()) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    try {
      const toNumber = selectedContact?.phone || phoneNumber;
      const call = await twilioCallService.makeCall(
        toNumber,
        user?.id || 'demo-user',
        selectedContact?.id,
        selectedContact?.practice
      );

      setCurrentCall(call);
      setCallInProgress(true);
      
      // Start tracking call duration
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setDurationInterval(interval);
      
      // Simulate real-time insights (in production, this would come from WebSocket)
      setTimeout(() => {
        setLiveInsights({
          sentiment: 'positive',
          keyPoints: ['Discussed pricing', 'Interest in automation features'],
          suggestedResponse: 'Mention the ROI calculator to address pricing concerns'
        });
      }, 5000);
    } catch (error) {
      console.error('Error making call:', error);
      alert('Failed to make call');
    } finally {
      setLoading(false);
    }
  };

  // Handle ending the current call
  const handleEndCall = async () => {
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
    
    setCallInProgress(false);
    setLiveInsights(null);
    
    // Trigger call analysis
    if (currentCall) {
      try {
        // In production, this would use the actual transcript
        const mockTranscript = "Sample call transcript...";
        await twilioCallService.analyzeCall(currentCall.id, mockTranscript);
        
        // Show success message
        console.log('Call analysis completed');
      } catch (error) {
        console.error('Error analyzing call:', error);
      }
    }
    
    setCurrentCall(null);
    setCallDuration(0);
    
    // Reload recent calls
    loadRecentCalls();
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // In production, this would control actual audio
  };

  // Handle speaker toggle
  const handleSpeakerToggle = () => {
    setSpeakerOn(!speakerOn);
    // In production, this would control actual audio output
  };

  // Handle calling a recent number
  const handleCallRecent = (call: TwilioCallRecord) => {
    setPhoneNumber(call.to_number);
    if (call.contact_id) {
      const contact = contacts.find(c => c.id === call.contact_id);
      setSelectedContact(contact || null);
    }
    handleCall();
  };

  return (
    <>
      <FeatureGate 
        feature="phoneAccess"
        fallback={
          <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
            <Fab
              color="primary"
              onClick={() => setShowUpgradeModal(true)}
              sx={{ opacity: 0.7 }}
            >
              <PhoneIcon />
            </Fab>
          </Box>
        }
      >
      {/* Floating call button */}
      <Fab
        color="primary"
        aria-label="call"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          ...(callInProgress && {
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' }
            }
          })
        }}
        onClick={toggleDrawer}
      >
        {callInProgress ? <CallIcon /> : <PhoneIcon />}
      </Fab>

      {/* Call panel drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={callInProgress ? undefined : toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            padding: 2,
            boxSizing: 'border-box',
            backgroundColor:
              themeMode === 'space'
                ? 'rgba(22, 27, 44, 0.95)'
                : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${
              themeMode === 'space'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
            }`
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              {callInProgress ? 'Call in Progress' : 'Sphere Call Center'}
            </Typography>
            <TierBadge tier={tier} />
          </Box>
          {!callInProgress && (
            <IconButton onClick={toggleDrawer} edge="end">
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {callInProgress && currentCall ? (
          // Active call UI
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main }}>
                {selectedContact ? <BusinessIcon sx={{ fontSize: 40 }} /> : <PersonIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              
              <Typography variant="h6">
                {selectedContact?.name || currentCall.to_number}
              </Typography>
              
              {selectedContact?.practice && (
                <Typography variant="body2" color="text.secondary">
                  {selectedContact.practice}
                </Typography>
              )}
              
              <Typography variant="h3" sx={{ fontFamily: 'monospace', my: 2 }}>
                {formatDuration(callDuration)}
              </Typography>
              
              {/* Agent Time Limit Display */}
              {agentTimeLimit > 0 && (
                <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
                  <Typography variant="caption">
                    Agent conversation limit: {agentDisplayTime}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(callDuration / agentTimeLimit) * 100} 
                    sx={{ mt: 0.5 }}
                    color={callDuration > agentTimeLimit * 0.8 ? "warning" : "primary"}
                  />
                </Alert>
              )}
            </Box>

            {/* Call Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={handleMuteToggle}
                sx={{
                  bgcolor: isMuted ? 'error.main' : 'action.hover',
                  '&:hover': { bgcolor: isMuted ? 'error.dark' : 'action.selected' }
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<CallEndIcon />}
                onClick={handleEndCall}
                sx={{ borderRadius: 28, px: 3 }}
              >
                End Call
              </Button>
              
              <IconButton
                onClick={handleSpeakerToggle}
                sx={{
                  bgcolor: speakerOn ? 'primary.main' : 'action.hover',
                  '&:hover': { bgcolor: speakerOn ? 'primary.dark' : 'action.selected' }
                }}
              >
                {speakerOn ? <VolumeIcon /> : <VolumeMuteIcon />}
              </IconButton>
            </Box>

            {/* Live Insights */}
            {liveInsights && (
              <Alert 
                severity="info" 
                icon={<AIIcon />}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Live AI Insights
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    label={`Sentiment: ${liveInsights.sentiment}`}
                    size="small"
                    color={
                      liveInsights.sentiment === 'positive' ? 'success' :
                      liveInsights.sentiment === 'negative' ? 'error' : 'default'
                    }
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" component="div">
                    Key Points:
                  </Typography>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {liveInsights.keyPoints.map((point, index) => (
                      <li key={index}>
                        <Typography variant="caption">{point}</Typography>
                      </li>
                    ))}
                  </ul>
                  {liveInsights.suggestedResponse && (
                    <Alert severity="success" sx={{ mt: 1, py: 0.5 }}>
                      <Typography variant="caption">
                        Suggestion: {liveInsights.suggestedResponse}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Alert>
            )}

            {/* Recording Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: 'error.main',
                animation: 'blink 1s infinite'
              }} />
              <Typography variant="caption" color="text.secondary">
                Call is being recorded and transcribed
              </Typography>
            </Box>
          </Box>
        ) : (
          // Call initiation UI
          <>
            {/* Contact Selector */}
            <Autocomplete
              options={contacts}
              value={selectedContact}
              onChange={(_, value) => {
                setSelectedContact(value);
                setPhoneNumber(value?.phone || '');
              }}
              getOptionLabel={(option) => `${option.name} - ${option.practice || option.phone}`}
              renderInput={(params) => (
                <TextField {...params} label="Select Contact" variant="outlined" />
              )}
              sx={{ mb: 2 }}
            />
            
            {/* Phone Number Input */}
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              disabled={!!selectedContact}
              sx={{ mb: 2 }}
              helperText={features.phoneNumberLimit > 0 ? `${features.phoneNumberLimit} phone number${features.phoneNumberLimit === 1 ? '' : 's'} available` : ''}
            />
            
            {/* Call Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <CallIcon />}
              onClick={handleCall}
              fullWidth
              disabled={loading || (!phoneNumber && !selectedContact)}
              sx={{ mb: 3 }}
            >
              {loading ? 'Connecting...' : 'Start Call'}
            </Button>
            
            {/* Recent Calls */}
            {recentCalls.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimerIcon fontSize="small" />
                  Recent Calls
                </Typography>
                
                <List sx={{ width: '100%' }}>
                  {recentCalls.map((call) => (
                    <React.Fragment key={call.id}>
                      <ListItem
                        secondaryAction={
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleCallRecent(call)}
                              size="small"
                            >
                              <CallIcon color="primary" />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={() => {
                                // Navigate to call analysis
                                window.location.href = `/call-analysis?callId=${call.id}`;
                              }}
                            >
                              <AnalyticsIcon />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {call.practice_id ? <BusinessIcon /> : <PersonIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={call.to_number}
                          secondary={
                            <Box>
                              <Typography variant="caption" component="div">
                                {new Date(call.created_at).toLocaleString()}
                              </Typography>
                              <Typography variant="caption" component="div">
                                Duration: {formatDuration(call.duration)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
                
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => window.location.href = '/call-analysis'}
                  sx={{ mt: 1 }}
                >
                  View All Call Analytics
                </Button>
              </>
            )}
          </>
        )}
      </Drawer>

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
      </FeatureGate>
      
      {showUpgradeModal && (
        <UpgradePrompt
          currentTier={tier}
          requiredTier={RepXTier.Rep2}
          feature="Phone Calling"
          onUpgrade={() => {
            window.location.href = 'https://osbackend-zl1h.onrender.com/upgrade?feature=phone&from=' + tier;
          }}
          onCancel={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
};

export default GlobalCallPanel;
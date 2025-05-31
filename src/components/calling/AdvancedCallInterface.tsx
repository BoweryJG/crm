import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  LinearProgress,
  Chip,
  Fab,
  Dialog,
  DialogContent,
  Slide,
  useTheme,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Dialpad as DialpadIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Note as NoteIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  KeyboardVoice as KeyboardVoiceIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';
import { Contact } from '../../types/models';
import { useThemeContext } from '../../themes/ThemeContext';
import { AviationDashboard } from '../gauges/AviationGauges';
import { 
  callContact,
  disconnectCall,
  initializeTwilioDevice,
  formatPhoneNumber
} from '../../services/twilio/twilioService';
import advancedLinguisticsService from '../../services/linguistics/advancedLinguisticsService';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CallState {
  status: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended' | 'failed';
  duration: number;
  contact: Contact | null;
  callSid: string | null;
  error: string | null;
}

interface CallInsights {
  talkTime: { rep: number; prospect: number };
  sentiment: 'positive' | 'neutral' | 'negative';
  energy: number;
  keywords: string[];
  mood: string;
}

interface AdvancedCallInterfaceProps {
  open: boolean;
  onClose: () => void;
  contact?: Contact;
  userId: string;
}

const AdvancedCallInterface: React.FC<AdvancedCallInterfaceProps> = ({
  open,
  onClose,
  contact,
  userId
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    duration: 0,
    contact: null,
    callSid: null,
    error: null
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showDialpad, setShowDialpad] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [realTimeInsights, setRealTimeInsights] = useState<CallInsights>({
    talkTime: { rep: 60, prospect: 40 },
    sentiment: 'positive',
    energy: 75,
    keywords: ['pricing', 'timeline', 'results'],
    mood: 'engaged'
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize call timer
  useEffect(() => {
    if (callState.status === 'connected') {
      timerRef.current = setInterval(() => {
        setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.status]);

  // Initialize Twilio device on component mount
  useEffect(() => {
    if (open && userId) {
      initializeTwilioDevice(userId);
    }
  }, [open, userId]);

  // Set contact when provided
  useEffect(() => {
    if (contact) {
      setCallState(prev => ({ ...prev, contact }));
    }
  }, [contact]);

  // Simulate real-time insights updates during call
  useEffect(() => {
    if (callState.status === 'connected') {
      const insightsInterval = setInterval(() => {
        setRealTimeInsights(prev => ({
          ...prev,
          talkTime: {
            rep: Math.max(30, Math.min(80, prev.talkTime.rep + (Math.random() - 0.5) * 10)),
            prospect: Math.max(20, Math.min(70, prev.talkTime.prospect + (Math.random() - 0.5) * 10))
          },
          energy: Math.max(20, Math.min(100, prev.energy + (Math.random() - 0.5) * 20)),
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any
        }));
      }, 3000);

      return () => clearInterval(insightsInterval);
    }
  }, [callState.status]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = async () => {
    if (!callState.contact) return;

    setCallState(prev => ({ ...prev, status: 'calling', error: null }));

    try {
      const result = await callContact(callState.contact, userId);
      
      if (result.success) {
        setCallState(prev => ({ 
          ...prev, 
          status: 'ringing',
          callSid: result.callSid || null
        }));
        
        // Simulate call progression
        setTimeout(() => {
          setCallState(prev => ({ ...prev, status: 'connected' }));
          setIsRecording(true);
        }, 2000);
      } else {
        setCallState(prev => ({ 
          ...prev, 
          status: 'failed',
          error: result.error || 'Call failed'
        }));
      }
    } catch (error) {
      setCallState(prev => ({ 
        ...prev, 
        status: 'failed',
        error: 'Failed to initiate call'
      }));
    }
  };

  const handleEndCall = async () => {
    disconnectCall();
    
    // If we have real call data, analyze it
    if (callState.callSid && callState.duration > 30) {
      // Create mock transcript for analysis
      const mockTranscript = `
[00:00:05] Rep: Hello ${callState.contact?.first_name}, this is calling about the dental equipment we discussed.
[00:00:15] ${callState.contact?.first_name}: Yes, I've been thinking about it.
[00:00:25] Rep: Great! I wanted to follow up on the pricing questions you had.
[00:00:35] ${callState.contact?.first_name}: Yes, the investment is significant for our practice.
[00:01:00] Rep: I understand. Let me show you some ROI data from similar practices.
[00:01:15] ${callState.contact?.first_name}: That would be helpful.
[00:01:30] Rep: Based on practices your size, we typically see 25-30% increase in efficiency.
[00:02:00] ${callState.contact?.first_name}: Those numbers are impressive. What about training?
[00:02:15] Rep: Training is included and takes just 2 days. Most staff love the new workflow.
[00:02:45] ${callState.contact?.first_name}: This sounds promising. Can we schedule a demo?
[00:03:00] Rep: Absolutely! How does next Tuesday at 2 PM work for you?
[00:03:15] ${callState.contact?.first_name}: Perfect, let's do it.
      `;

      try {
        await advancedLinguisticsService.analyzeCallTranscript(
          callState.callSid,
          mockTranscript.trim()
        );
      } catch (error) {
        console.error('Error analyzing call:', error);
      }
    }

    setCallState(prev => ({ 
      ...prev, 
      status: 'ended',
      duration: 0
    }));
    setIsRecording(false);
    setIsOnHold(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleHold = () => {
    setIsOnHold(!isOnHold);
  };

  const getSentimentColor = () => {
    switch (realTimeInsights.sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getStatusColor = () => {
    switch (callState.status) {
      case 'calling':
      case 'ringing': return theme.palette.warning.main;
      case 'connected': return theme.palette.success.main;
      case 'failed': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getCallStatusText = () => {
    switch (callState.status) {
      case 'calling': return 'Initiating call...';
      case 'ringing': return 'Ringing...';
      case 'connected': return formatTime(callState.duration);
      case 'ended': return 'Call ended';
      case 'failed': return callState.error || 'Call failed';
      default: return 'Ready to call';
    }
  };

  const dialpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backgroundColor: themeMode === 'space'
            ? 'rgba(10, 14, 23, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          minHeight: '70vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: themeMode === 'space' 
              ? 'linear-gradient(135deg, rgba(138, 96, 208, 0.1) 0%, rgba(92, 225, 230, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(61, 82, 213, 0.1) 0%, rgba(68, 207, 203, 0.1) 100%)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                Advanced Call Interface
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container sx={{ height: 'calc(100% - 80px)' }}>
            {/* Main Call Area */}
            <Grid item xs={12} md={8} sx={{ p: 3 }}>
              {/* Contact Info */}
              {callState.contact && (
                <Card elevation={0} sx={{ mb: 3, bgcolor: 'background.default' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.main }}>
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {callState.contact.first_name} {callState.contact.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {callState.contact.title} • {callState.contact.practice_name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {formatPhoneNumber(callState.contact.phone || '')}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                          label={getCallStatusText()}
                          sx={{ 
                            bgcolor: getStatusColor(),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Call Controls */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                  {callState.status === 'idle' || callState.status === 'failed' ? (
                    <Fab
                      color="primary"
                      size="large"
                      onClick={handleCall}
                      disabled={!callState.contact}
                      sx={{ width: 80, height: 80 }}
                    >
                      <CallIcon fontSize="large" />
                    </Fab>
                  ) : (
                    <Fab
                      color="error"
                      size="large"
                      onClick={handleEndCall}
                      sx={{ width: 80, height: 80 }}
                    >
                      <CallEndIcon fontSize="large" />
                    </Fab>
                  )}
                </Box>

                {callState.status === 'connected' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                      <IconButton 
                        onClick={toggleMute}
                        color={isMuted ? 'error' : 'default'}
                        sx={{ bgcolor: isMuted ? 'error.light' : 'action.hover' }}
                      >
                        {isMuted ? <MicOffIcon /> : <MicIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={isOnHold ? 'Resume' : 'Hold'}>
                      <IconButton 
                        onClick={toggleHold}
                        color={isOnHold ? 'warning' : 'default'}
                        sx={{ bgcolor: isOnHold ? 'warning.light' : 'action.hover' }}
                      >
                        {isOnHold ? <PlayIcon /> : <PauseIcon />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Dialpad">
                      <IconButton 
                        onClick={() => setShowDialpad(!showDialpad)}
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        <DialpadIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={volume > 0 ? 'Mute Volume' : 'Unmute Volume'}>
                      <IconButton 
                        onClick={() => setVolume(volume > 0 ? 0 : 100)}
                        sx={{ bgcolor: 'action.hover' }}
                      >
                        {volume > 0 ? <VolumeUpIcon /> : <VolumeOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Paper>

              {/* Dialpad */}
              {showDialpad && callState.status === 'connected' && (
                <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" gutterBottom align="center">
                    Dialpad
                  </Typography>
                  <Grid container spacing={1}>
                    {dialpadButtons.map((row, rowIndex) => (
                      row.map((button, colIndex) => (
                        <Grid item xs={4} key={`${rowIndex}-${colIndex}`}>
                          <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            sx={{ minHeight: 48, fontSize: '1.2rem' }}
                            onClick={() => {
                              // Send DTMF tone
                              console.log('DTMF:', button);
                            }}
                          >
                            {button}
                          </Button>
                        </Grid>
                      ))
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* Real-time Insights */}
              {callState.status === 'connected' && (
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PsychologyIcon color="primary" />
                    Real-time Insights
                  </Typography>
                  
                  {themeMode === 'luxury' ? (
                    /* Aviation Dashboard for Luxury Theme */
                    <AviationDashboard
                      metrics={{
                        talkTimeRatio: realTimeInsights.talkTime.rep,
                        confidence: realTimeInsights.energy,
                        persuasionScore: realTimeInsights.sentiment === 'positive' ? 75 : 
                                        realTimeInsights.sentiment === 'neutral' ? 50 : 25
                      }}
                      size="small"
                    />
                  ) : (
                    /* Traditional Progress Bars for Other Themes */
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Talk Time</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption">You ({realTimeInsights.talkTime.rep}%)</Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={realTimeInsights.talkTime.rep}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption">Prospect ({realTimeInsights.talkTime.prospect}%)</Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={realTimeInsights.talkTime.prospect}
                              color="secondary"
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Conversation Energy</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={realTimeInsights.energy}
                            sx={{ 
                              flex: 1, 
                              height: 12, 
                              borderRadius: 6,
                              '& .MuiLinearProgress-bar': {
                                bgcolor: realTimeInsights.energy > 70 ? 'success.main' : 
                                        realTimeInsights.energy > 40 ? 'warning.main' : 'error.main'
                              }
                            }}
                          />
                          <Typography variant="body2" fontWeight="bold">
                            {realTimeInsights.energy}%
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="text.secondary">Sentiment:</Typography>
                          <Chip 
                            label={realTimeInsights.sentiment.toUpperCase()}
                            size="small"
                            sx={{ 
                              bgcolor: getSentimentColor(),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">Keywords:</Typography>
                          {realTimeInsights.keywords.map((keyword, index) => (
                            <Chip key={index} label={keyword} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Paper>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4} sx={{ borderLeft: `1px solid ${theme.palette.divider}`, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Call Assistant
              </Typography>

              {/* Quick Actions */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>Quick Actions</Typography>
                <List dense>
                  <ListItem button>
                    <ListItemIcon><NoteIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Add Note" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon><ScheduleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Schedule Follow-up" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Mark as Hot Lead" />
                  </ListItem>
                </List>
              </Paper>

              {/* Call History */}
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom>Recent Calls</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Last call: 3 days ago"
                      secondary="Duration: 8:45 • Outcome: Demo scheduled"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Previous: 1 week ago"
                      secondary="Duration: 12:30 • Outcome: Pricing discussion"
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Smart Suggestions */}
              {callState.status === 'connected' && (
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon fontSize="small" color="primary" />
                    Smart Suggestions
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="They seem interested in pricing"
                        secondary="Consider sharing ROI calculator"
                        sx={{ '& .MuiListItemText-secondary': { color: 'success.main' } }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="High engagement detected"
                        secondary="Good time to ask for commitment"
                        sx={{ '& .MuiListItemText-secondary': { color: 'info.main' } }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedCallInterface;
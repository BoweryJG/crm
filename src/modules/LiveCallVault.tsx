// Live Call Vault - Connected to real Twilio data
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Stack,
  Paper,
  LinearProgress,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as AIIcon,
  Timer as TimerIcon,
  Download as DownloadIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Transcribe as TranscribeIcon,
  CallEnd as CallEndIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { supabase } from '../services/supabase/supabase';
import ConferencePhone from '../components/callVault/ConferencePhone';
import { 
  callContact, 
  disconnectCall, 
  initializeTwilioDevice 
} from '../services/twilio/twilioService';
import { formatDuration } from '../mock/callVault';

interface TwilioCall {
  id: string;
  call_sid: string;
  from_number: string;
  to_number: string;
  direction: 'inbound' | 'outbound';
  status: string;
  duration: number;
  created_at: string;
  recording_url?: string;
  transcription?: any;
  metadata?: any;
}

interface CallRecording {
  id: string;
  call_sid: string;
  recording_sid: string;
  media_url: string;
  duration: number;
  status: string;
  transcription_text?: string;
  analysis_results?: any;
}

const LiveCallVault: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [calls, setCalls] = useState<TwilioCall[]>([]);
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<TwilioCall | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<CallRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [volume, setVolume] = useState(80);
  const [newCallDialogOpen, setNewCallDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Twilio device
  useEffect(() => {
    if (user) {
      initializeTwilioDevice(user.id).catch(console.error);
    }
  }, [user]);

  // Fetch calls and recordings
  useEffect(() => {
    fetchCallsAndRecordings();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('twilio_calls_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'twilio_calls' },
        () => {
          fetchCallsAndRecordings();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Call timer
  useEffect(() => {
    if (isCallActive) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      setCallDuration(0);
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive]);

  const fetchCallsAndRecordings = async () => {
    try {
      setLoading(true);
      
      // Fetch calls
      const { data: callsData, error: callsError } = await supabase
        .from('twilio_calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (callsError) throw callsError;
      
      // Fetch recordings
      const { data: recordingsData, error: recordingsError } = await supabase
        .from('call_recordings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (recordingsError) throw recordingsError;
      
      setCalls(callsData || []);
      setRecordings(recordingsData || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeCall = async () => {
    if (!phoneNumber) return;
    
    try {
      // Create a minimal contact object for manual calls
      const manualContact: any = {
        id: 'manual-call-' + Date.now(),
        first_name: 'Manual',
        last_name: 'Call',
        title: 'Direct Call',
        email: 'manual@call.com',
        phone: phoneNumber,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const result = await callContact(manualContact, user!.id);
      
      if (result.success) {
        setIsCallActive(true);
        setNewCallDialogOpen(false);
      } else {
        console.error('Call failed:', result.error);
      }
    } catch (error) {
      console.error('Error making call:', error);
    }
  };

  const handleEndCall = () => {
    disconnectCall();
    setIsCallActive(false);
    setCallDuration(0);
  };

  const handlePlayRecording = (recording: CallRecording) => {
    if (selectedRecording?.id === recording.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      setSelectedRecording(recording);
      setIsPlaying(true);
      // In a real implementation, you'd get the audio URL from storage
      // For now, we'll just simulate playback
    }
  };

  const getCallContactInfo = (call: TwilioCall) => {
    const isInbound = call.direction === 'inbound';
    const displayNumber = isInbound ? call.from_number : call.to_number;
    const contactName = call.metadata?.contact_name || 'Unknown Contact';
    const practiceName = call.metadata?.practice_name || '';
    
    return {
      name: contactName,
      number: displayNumber,
      company: practiceName
    };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/command-room')}
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          ← Back to Command Room
        </Button>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 200, mb: 1 }}>
              CallVault Conference System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your Twilio-powered call recording and analytics center
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchCallsAndRecordings}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewCallDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, var(--phone-amber), var(--phone-amber-glow))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--phone-amber-glow), var(--phone-amber))'
                }
              }}
            >
              New Call
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Call List */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Calls
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : calls.length === 0 ? (
              <Alert severity="info">
                No calls recorded yet. Make your first call to get started!
              </Alert>
            ) : (
              <List>
                {calls.map((call) => {
                  const contactInfo = getCallContactInfo(call);
                  const recording = recordings.find(r => r.call_sid === call.call_sid);
                  
                  return (
                    <ListItem
                      key={call.id}
                      className={`call-list-item ${selectedCall?.id === call.id ? 'active' : ''}`}
                      onClick={() => setSelectedCall(call)}
                      sx={{ mb: 1, borderRadius: 2 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contactInfo.name}
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="caption">
                              {contactInfo.number} • {formatDuration(call.duration)}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <Chip
                                label={call.direction}
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                              {recording && (
                                <Chip
                                  label="Recording"
                                  size="small"
                                  icon={<PlayIcon sx={{ fontSize: 12 }} />}
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                              {recording?.transcription_text && (
                                <Chip
                                  label="Transcript"
                                  size="small"
                                  icon={<TranscribeIcon sx={{ fontSize: 12 }} />}
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Stack>
                          </Stack>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Center Column - Conference Phone */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)'
            }}
          >
            <ConferencePhone
              isConnected={isCallActive}
              isMuted={isMuted}
              isOnHold={isOnHold}
              isRecording={true}
              volume={volume}
              callDuration={callDuration}
              callerInfo={isCallActive ? {
                name: 'Active Call',
                number: phoneNumber,
                company: ''
              } : selectedCall ? getCallContactInfo(selectedCall) : undefined}
              onCall={() => setNewCallDialogOpen(true)}
              onEndCall={handleEndCall}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleHold={() => setIsOnHold(!isOnHold)}
              onToggleDialpad={() => {}}
              onVolumeChange={setVolume}
            />

            {/* Selected Call Details */}
            {selectedCall && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Call Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card className="analytics-card">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="h4">
                          {formatDuration(selectedCall.duration)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card className="analytics-card">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="h4">
                          {selectedCall.status}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Recording Player */}
                {recordings.find(r => r.call_sid === selectedCall.call_sid) && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Recording
                    </Typography>
                    <Alert severity="info">
                      Recording playback will be available once audio storage is configured
                    </Alert>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* New Call Dialog */}
      <Dialog
        open={newCallDialogOpen}
        onClose={() => setNewCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Make a New Call</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCallDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleMakeCall}
            variant="contained"
            disabled={!phoneNumber}
            sx={{
              background: 'linear-gradient(135deg, var(--phone-amber), var(--phone-amber-glow))'
            }}
          >
            Call
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LiveCallVault;
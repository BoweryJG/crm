// Demo Call Vault - Public demo mode with realistic sales conversations
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
  Fade,
  Button,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as AIIcon,
  Timer as TimerIcon,
  CheckCircle as SuccessIcon,
  Schedule as FollowUpIcon,
  Block as ObjectionIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConferencePhone from '../components/callVault/ConferencePhone';
import { 
  allDemoCalls, 
  formatDuration, 
  MockAudioPlayer,
  TranscriptionSimulator,
  generateWaveformData,
  type DemoCall 
} from '../mock/callVault';

const DemoCallVault: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedCall, setSelectedCall] = useState<DemoCall | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const [displayedTranscript, setDisplayedTranscript] = useState('');
  
  const audioPlayerRef = useRef<MockAudioPlayer | null>(null);
  const transcriptionRef = useRef<TranscriptionSimulator | null>(null);

  // Initialize audio player when call is selected
  useEffect(() => {
    if (selectedCall) {
      audioPlayerRef.current = new MockAudioPlayer(
        selectedCall.duration,
        (time) => {
          setCurrentTime(time);
          // Update transcript based on time
          const transcriptIndex = selectedCall.transcript.findIndex(
            segment => segment.timestamp > time
          );
          if (transcriptIndex > 0 && transcriptIndex !== currentTranscriptIndex) {
            setCurrentTranscriptIndex(transcriptIndex - 1);
          }
        },
        () => {
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentTranscriptIndex(0);
        }
      );
    }
    
    return () => {
      audioPlayerRef.current?.pause();
      transcriptionRef.current?.stop();
    };
  }, [selectedCall]);

  // Handle transcript simulation
  useEffect(() => {
    if (selectedCall && currentTranscriptIndex < selectedCall.transcript.length) {
      const segment = selectedCall.transcript[currentTranscriptIndex];
      transcriptionRef.current?.stop();
      
      transcriptionRef.current = new TranscriptionSimulator(
        segment.text,
        30,
        (text) => setDisplayedTranscript(text)
      );
      
      if (isPlaying) {
        transcriptionRef.current.start();
      }
    }
  }, [currentTranscriptIndex, selectedCall, isPlaying]);

  const handlePlayCall = (call: DemoCall) => {
    if (selectedCall?.id === call.id) {
      if (isPlaying) {
        audioPlayerRef.current?.pause();
        transcriptionRef.current?.stop();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current?.play();
        transcriptionRef.current?.start();
        setIsPlaying(true);
      }
    } else {
      // Stop current playback
      audioPlayerRef.current?.reset();
      transcriptionRef.current?.reset();
      
      // Start new call
      setSelectedCall(call);
      setCurrentTime(0);
      setCurrentTranscriptIndex(0);
      setIsPlaying(true);
      
      // Wait for next tick to start playback
      setTimeout(() => {
        audioPlayerRef.current?.play();
      }, 100);
    }
  };

  const handleEndCall = () => {
    audioPlayerRef.current?.reset();
    transcriptionRef.current?.reset();
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentTranscriptIndex(0);
    setDisplayedTranscript('');
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'closed':
        return <SuccessIcon sx={{ color: theme.palette.success.main }} />;
      case 'follow-up':
        return <FollowUpIcon sx={{ color: theme.palette.info.main }} />;
      case 'objection':
        return <ObjectionIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <PhoneIcon />;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'closed':
        return theme.palette.success.main;
      case 'follow-up':
        return theme.palette.info.main;
      case 'objection':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Demo Mode Badge */}
      <Box className="demo-badge">DEMO MODE</Box>
      
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          onClick={() => navigate('/command-room')}
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          ← Back to Command Room
        </Button>
        
        <Typography variant="h3" sx={{ fontWeight: 200, mb: 1 }}>
          CallVault Conference System
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Experience realistic sales conversations from top-performing reps
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Call List */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Demo Recordings
            </Typography>
            
            <List>
              {allDemoCalls.map((call) => (
                <ListItem
                  key={call.id}
                  className={`call-list-item ${selectedCall?.id === call.id ? 'active' : ''}`}
                  onClick={() => handlePlayCall(call)}
                  sx={{ mb: 1, borderRadius: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getOutcomeColor(call.outcome) }}>
                      {getOutcomeIcon(call.outcome)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={call.title}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="caption">
                          {call.contact.practice} • {formatDuration(call.duration)}
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                          {call.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
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
              isConnected={isPlaying}
              isMuted={isMuted}
              isOnHold={isOnHold}
              isRecording={true}
              volume={volume}
              callDuration={currentTime}
              callerInfo={selectedCall ? {
                name: selectedCall.contact.name,
                number: selectedCall.contact.phone,
                company: selectedCall.contact.practice
              } : undefined}
              onCall={() => selectedCall && handlePlayCall(selectedCall)}
              onEndCall={handleEndCall}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleHold={() => setIsOnHold(!isOnHold)}
              onToggleDialpad={() => {}}
              onVolumeChange={setVolume}
            />

            {/* Current Transcript */}
            {selectedCall && currentTranscriptIndex < selectedCall.transcript.length && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Live Transcription
                </Typography>
                <Box
                  className={`transcript-segment ${selectedCall.transcript[currentTranscriptIndex].speaker}`}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {selectedCall.transcript[currentTranscriptIndex].speaker === 'rep' ? 'Sales Rep' : selectedCall.contact.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2">
                    {displayedTranscript}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Call Analytics */}
            {selectedCall && (
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Card className="analytics-card">
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="subtitle2">Value Score</Typography>
                      </Stack>
                      <Typography variant="h4" sx={{ mt: 1 }}>
                        {selectedCall.valueScore}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedCall.valueScore} 
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card className="analytics-card">
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AIIcon sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="subtitle2">Talk Ratio</Typography>
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                        <Box>
                          <Typography variant="h5">{selectedCall.analytics.talkRatio.rep}%</Typography>
                          <Typography variant="caption">Rep</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="h5">{selectedCall.analytics.talkRatio.prospect}%</Typography>
                          <Typography variant="caption">Prospect</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Demo Mode Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          This is a demo mode showcasing realistic sales conversations. 
          <Button
            size="small"
            sx={{ ml: 1 }}
            onClick={() => navigate('/auth')}
          >
            Sign in for live calling
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default DemoCallVault;
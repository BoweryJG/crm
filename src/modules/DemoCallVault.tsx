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
  Star as StarIcon,
  Refresh as RefreshIcon
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
import { Gallery, GalleryContainer, Monolith } from '../components/gallery';
import glassEffects from '../themes/glassEffects';

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
    <GalleryContainer>
      <Fade in timeout={800}>
        <Box>
          {/* Demo Mode Badge */}
          <Box 
            sx={{
              position: 'fixed',
              top: 20,
              right: 20,
              backgroundColor: alpha(theme.palette.warning.main, 0.9),
              color: theme.palette.background.default,
              px: 2,
              py: 0.5,
              borderRadius: 0,
              letterSpacing: '0.1em',
              fontSize: '0.75rem',
              fontWeight: 600,
              zIndex: 1200,
              boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.3)}`
            }}
          >
            DEMO MODE
          </Box>
          
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              onClick={() => navigate('/command-room')}
              sx={{ 
                mb: 2, 
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main,
                }
              }}
            >
              ← Back to Command Room
            </Button>
            
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 100, 
                mb: 1,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              CALLVAULT DEMO
            </Typography>
            <Typography 
              variant="body1" 
              sx={{
                color: theme.palette.text.secondary,
                letterSpacing: '0.05em',
                opacity: 0.8
              }}
            >
              Experience realistic sales conversations from top-performing reps
            </Typography>
          </Box>

          <Gallery.Space height={40} />

          <Grid container spacing={3}>
            {/* Left Column - Call List */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  maxHeight: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Monolith
                  variant="museum"
                  elevation="elevated"
                  hover="subtle"
                  fullHeight
                >
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 300
                    }}
                  >
                    Demo Recordings
                  </Typography>
                </Box>
                
                <Divider sx={{ opacity: 0.1 }} />
                
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            
            <List>
              {allDemoCalls.map((call) => (
                <ListItem
                  key={call.id}
                  onClick={() => handlePlayCall(call)}
                  sx={{ 
                    mb: 1.5, 
                    borderRadius: 1,
                    backgroundColor: selectedCall?.id === call.id 
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.background.paper, 0.4),
                    border: `1px solid ${selectedCall?.id === call.id 
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.15),
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: selectedCall?.id === call.id 
                          ? getOutcomeColor(call.outcome)
                          : alpha(getOutcomeColor(call.outcome), 0.2),
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {getOutcomeIcon(call.outcome)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: selectedCall?.id === call.id ? 600 : 400,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {call.title}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            opacity: 0.7,
                            letterSpacing: '0.03em'
                          }}
                        >
                          {call.contact.practice} • {formatDuration(call.duration)}
                        </Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {call.tags.slice(0, 2).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag.toUpperCase()}
                              size="small"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.65rem',
                                letterSpacing: '0.05em',
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                border: 'none'
                              }}
                            />
                          ))}
                          {call.outcome && (
                            <Chip
                              label={call.outcome.toUpperCase()}
                              size="small"
                              sx={{ 
                                height: 18, 
                                fontSize: '0.65rem',
                                letterSpacing: '0.05em',
                                backgroundColor: alpha(getOutcomeColor(call.outcome), 0.1),
                                color: getOutcomeColor(call.outcome),
                                border: 'none'
                              }}
                            />
                          )}
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
                </Box>
                </Monolith>
              </Box>
            </Grid>

            {/* Center Column - Conference Phone */}
            <Grid item xs={12} md={8}>
              <Monolith
                variant="obsidian"
                elevation="elevated"
                hover="none"
                fullHeight
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
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 300,
                    fontSize: '0.875rem'
                  }}
                >
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
              </Monolith>
            </Grid>
          </Grid>

          <Gallery.Space height={60} />

          {/* Demo Mode Info */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{
                color: theme.palette.text.secondary,
                letterSpacing: '0.05em'
              }}
            >
              This is a demo mode showcasing realistic sales conversations. 
              <Button
                size="small"
                sx={{ 
                  ml: 1,
                  letterSpacing: '0.05em',
                  '&:hover': {
                    color: theme.palette.primary.main,
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Sign in for live calling
              </Button>
            </Typography>
          </Box>
        </Box>
      </Fade>
    </GalleryContainer>
  );
};

export default DemoCallVault;
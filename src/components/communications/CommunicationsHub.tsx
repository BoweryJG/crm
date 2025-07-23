import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallMade as OutboundIcon,
  CallReceived as InboundIcon,
  RecordVoiceOver as TranscriptionIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingUpIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import { useServiceFactory } from '../../services/serviceFactory';
import RepOnboardingService from '../../services/calling/RepOnboardingService';
import TwilioProvisioningService from '../../services/calling/TwilioProvisioningService';

interface CallRecord {
  id: string;
  contact_name: string;
  direction: 'inbound' | 'outbound';
  duration_seconds: number;
  status: string;
  started_at: string;
  transcription_text?: string;
  sentiment_score?: number;
  ai_analysis?: any;
}

interface CallingStats {
  total_calls: number;
  completed_calls: number;
  avg_call_duration: number;
  calls_today: number;
  calls_this_week: number;
}

const CommunicationsHub: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const { contactService } = useServiceFactory();
  
  const [loading, setLoading] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState<any>(null);
  const [callingStats, setCallingStats] = useState<CallingStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const loadCallingData = useCallback(async () => {
    // Mock data for now - would integrate with real calling service
    setCallingStats({
      total_calls: 47,
      completed_calls: 42,
      avg_call_duration: 324,
      calls_today: 8,
      calls_this_week: 23,
    });

    setRecentCalls([
      {
        id: '1',
        contact_name: 'Dr. Sarah Johnson',
        direction: 'outbound',
        duration_seconds: 420,
        status: 'completed',
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        transcription_text: 'Discussed new laser equipment for the practice...',
        sentiment_score: 0.8,
        ai_analysis: { conversion_likelihood: 85 }
      },
      {
        id: '2',
        contact_name: 'Michael Chen',
        direction: 'inbound',
        duration_seconds: 180,
        status: 'completed',
        started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        transcription_text: 'Follow-up question about pricing and installation...',
        sentiment_score: 0.6,
        ai_analysis: { conversion_likelihood: 65 }
      },
      {
        id: '3',
        contact_name: 'Dr. Emily Rodriguez',
        direction: 'outbound',
        duration_seconds: 245,
        status: 'completed',
        started_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        transcription_text: 'Initial consultation about practice expansion...',
        sentiment_score: 0.9,
        ai_analysis: { conversion_likelihood: 92 }
      }
    ]);
  }, []);

  const loadCommunicationsData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check onboarding status
      const status = await RepOnboardingService.getOnboardingStatus('current-user-id');
      setOnboardingStatus(status);
      
      if (status.completed && status.phone_number) {
        setPhoneNumber(status.phone_number);
        
        // Load calling stats and recent calls
        await loadCallingData();
      }
    } catch (error) {
      console.error('Failed to load communications data:', error);
    } finally {
      setLoading(false);
    }
  }, [loadCallingData]);

  useEffect(() => {
    loadCommunicationsData();
  }, [loadCommunicationsData]);

  const handleStartOnboarding = async () => {
    try {
      setIsOnboarding(true);
      
      // Trigger onboarding process
      const result = await RepOnboardingService.onboardNewRep('current-user-id', {
        email: 'current-user@example.com',
        full_name: 'Current User',
        preferred_area_code: '415'
      });

      if (result.success) {
        setOnboardingStatus({
          completed: true,
          phone_number: result.phone_number
        });
        setPhoneNumber(result.phone_number || null);
        await loadCallingData();
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsOnboarding(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = Date.now();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Onboarding state
  if (!onboardingStatus?.completed) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{
          background: alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <PhoneIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Welcome to RepSpheres Calling
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Get your personal phone number with AI-powered transcription and analysis.
              Zero setup required - we'll handle everything automatically.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleStartOnboarding}
              disabled={isOnboarding}
              startIcon={<MicIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {isOnboarding ? 'Setting Up...' : 'Get Started'}
            </Button>
            
            {isOnboarding && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress sx={{ mb: 1 }} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Provisioning your phone number and setting up AI features...
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header with Phone Number */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Communications Hub
        </Typography>
        {phoneNumber && (
          <Alert 
            severity="success" 
            icon={<PhoneIcon />}
            sx={{ 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
            }}
          >
            Your calling number: <strong>{phoneNumber}</strong>
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      {callingStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {callingStats.calls_today}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Calls Today
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                {callingStats.completed_calls}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Completed
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                {formatDuration(callingStats.avg_call_duration)}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Avg Duration
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                {callingStats.calls_this_week}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                This Week
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Calls */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Calls
            </Typography>
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentCalls.map((call) => (
              <Box
                key={call.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                  },
                }}
              >
                {/* Direction Icon */}
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: call.direction === 'outbound' 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.success.main, 0.1),
                  }}
                >
                  {call.direction === 'outbound' ? (
                    <OutboundIcon sx={{ color: theme.palette.primary.main }} />
                  ) : (
                    <InboundIcon sx={{ color: theme.palette.success.main }} />
                  )}
                </Avatar>

                {/* Call Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {call.contact_name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <TimeIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {formatTimeAgo(call.started_at)} • {formatDuration(call.duration_seconds)}
                    </Typography>
                  </Box>
                  {call.transcription_text && (
                    <Typography variant="caption" sx={{ 
                      color: theme.palette.text.secondary,
                      display: 'block',
                      mt: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      "{call.transcription_text.substring(0, 60)}..."
                    </Typography>
                  )}
                </Box>

                {/* AI Analysis */}
                {call.ai_analysis?.conversion_likelihood && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      label={`${call.ai_analysis.conversion_likelihood}%`}
                      size="small"
                      color={call.ai_analysis.conversion_likelihood > 80 ? 'success' : 
                             call.ai_analysis.conversion_likelihood > 60 ? 'warning' : 'default'}
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="caption" sx={{ 
                      display: 'block',
                      color: theme.palette.text.secondary 
                    }}>
                      Conversion
                    </Typography>
                  </Box>
                )}

                {/* Actions */}
                <Box>
                  <IconButton size="small">
                    <PlayIcon />
                  </IconButton>
                  <IconButton size="small">
                    <TranscriptionIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          {recentCalls.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PhoneIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                No calls yet. Start making calls to see them here.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommunicationsHub;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  TextField,
  InputAdornment,
  LinearProgress,
  Badge,
  Tooltip,
  Tab,
  Tabs,
  Paper,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeMuteIcon,
  Search as SearchIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Psychology as AIIcon,
  Queue as QueueIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Skip as SkipIcon,
  AutoMode as AutoModeIcon,
  Dashboard as DashboardIcon,
  Sync as SyncIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  LocalHospital as HospitalIcon,
  Face as FaceIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../themes/ThemeContext';
import { useAuth } from '../auth';
import glassEffects from '../themes/glassEffects';
import { twilioCallService } from '../services/twilioCallService';
import { useDashboardData } from '../contexts/DashboardDataContext';

interface Contact {
  id: string;
  name: string;
  phone: string;
  practice?: string;
  specialty?: string;
  lastContact?: string;
  value?: 'high' | 'medium' | 'low';
  location?: string;
  services?: string[];
  score?: number;
}

interface QueuedCall {
  id: string;
  contact: Contact;
  priority: number;
  attempts: number;
  status: 'pending' | 'calling' | 'completed' | 'failed';
  outcome?: string;
  scheduledFor?: string;
}

interface CallStats {
  totalCalls: number;
  completedCalls: number;
  averageDuration: number;
  conversionRate: number;
  todaysCalls: number;
  weeklyTrend: number;
}

const CallCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSyncQuery, setAiSyncQuery] = useState('');
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState<QueuedCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [autoDialEnabled, setAutoDialEnabled] = useState(false);
  
  // Queue state
  const [callQueue, setCallQueue] = useState<QueuedCall[]>([]);
  const [queueStatus, setQueueStatus] = useState<'idle' | 'active' | 'paused'>('idle');
  
  // Stats
  const [callStats, setCallStats] = useState<CallStats>({
    totalCalls: 127,
    completedCalls: 98,
    averageDuration: 4.5,
    conversionRate: 67,
    todaysCalls: 23,
    weeklyTrend: 12.5
  });

  // Mock contacts for demo
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      phone: '+1 (555) 123-4567',
      practice: 'Manhattan Oral Surgery',
      specialty: 'Oral Surgery',
      lastContact: '2 days ago',
      value: 'high',
      location: 'Manhattan, NY',
      services: ['Implants', 'Bone Grafting'],
      score: 95
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      phone: '+1 (555) 234-5678',
      practice: 'Elite Aesthetics Center',
      specialty: 'Dermatology',
      lastContact: '1 week ago',
      value: 'high',
      location: 'Brooklyn, NY',
      services: ['Botox', 'Fillers', 'Laser'],
      score: 88
    },
    {
      id: '3',
      name: 'Dr. Jennifer Walsh',
      phone: '+1 (555) 345-6789',
      practice: 'Park Avenue Dental',
      specialty: 'Cosmetic Dentistry',
      lastContact: '3 days ago',
      value: 'medium',
      location: 'Manhattan, NY',
      services: ['Veneers', 'Whitening'],
      score: 82
    }
  ]);

  // Timer effect for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async (contact: Contact) => {
    setIsCallActive(true);
    setCurrentCall({
      id: Date.now().toString(),
      contact,
      priority: 1,
      attempts: 1,
      status: 'calling'
    });
    
    // Initialize Twilio call
    try {
      await twilioCallService.makeCall({
        to: contact.phone,
        userId: user?.id || '',
        contactId: contact.id,
        contactName: contact.name
      });
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCurrentCall(null);
    twilioCallService.endCall();
  };

  const handleAiSync = () => {
    // This would integrate with RepConnect1's NLP processor
    console.log('AI Sync Query:', aiSyncQuery);
    // Parse natural language and create smart queue
  };

  const renderDialer = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.obsidian, borderRadius: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon color="primary" />
            <Typography variant="h6">Smart Dialer</Typography>
          </Box>
        }
        action={
          <Chip
            icon={<CheckCircleIcon />}
            label="Twilio Connected"
            color="success"
            size="small"
          />
        }
      />
      <CardContent>
        <TextField
          fullWidth
          placeholder="Search contacts or enter number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {isCallActive ? (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography variant="overline" color="primary">
              CALL IN PROGRESS
            </Typography>
            <Typography variant="h4" sx={{ my: 2 }}>
              {currentCall?.contact.name}
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: 'monospace', mb: 3 }}>
              {formatDuration(callDuration)}
            </Typography>
            
            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton
                onClick={() => setIsMuted(!isMuted)}
                sx={{
                  backgroundColor: isMuted ? theme.palette.error.main : alpha(theme.palette.background.paper, 0.1),
                  '&:hover': {
                    backgroundColor: isMuted ? theme.palette.error.dark : alpha(theme.palette.background.paper, 0.2),
                  },
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              
              <IconButton
                onClick={handleEndCall}
                sx={{
                  backgroundColor: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
                size="large"
              >
                <CallEndIcon />
              </IconButton>
              
              <IconButton
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                sx={{
                  backgroundColor: isSpeakerOn ? theme.palette.primary.main : alpha(theme.palette.background.paper, 0.1),
                  '&:hover': {
                    backgroundColor: isSpeakerOn ? theme.palette.primary.dark : alpha(theme.palette.background.paper, 0.2),
                  },
                }}
              >
                {isSpeakerOn ? <VolumeIcon /> : <VolumeMuteIcon />}
              </IconButton>
            </Stack>
          </Paper>
        ) : (
          <List>
            {contacts.filter(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.phone.includes(searchQuery)
            ).slice(0, 5).map((contact) => (
              <ListItem key={contact.id} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                    {contact.specialty === 'Oral Surgery' ? <HospitalIcon /> :
                     contact.specialty === 'Dermatology' ? <FaceIcon /> :
                     <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={contact.name}
                  secondary={
                    <Box>
                      <Typography variant="caption">{contact.practice}</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Chip label={contact.specialty} size="small" />
                        <Chip 
                          label={`Score: ${contact.score}`} 
                          size="small" 
                          color={contact.score > 90 ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    onClick={() => handleStartCall(contact)}
                    size="small"
                  >
                    Call
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderAiSync = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.museum, borderRadius: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AIIcon color="secondary" />
            <Typography variant="h6">AI Call Sync</Typography>
          </Box>
        }
        subheader="Create smart call queues with natural language"
        action={
          <Button
            size="small"
            startIcon={<AutoModeIcon />}
            onClick={() => navigate('/automations')}
          >
            Automations
          </Button>
        }
      />
      <CardContent>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder='Try: "sync top 25 high-value accounts contacted recently" or "sync premium clients within 25 miles interested in botox"'
          value={aiSyncQuery}
          onChange={(e) => setAiSyncQuery(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<SyncIcon />}
            onClick={handleAiSync}
            fullWidth
          >
            Sync Queue
          </Button>
          <Button
            variant="outlined"
            startIcon={<MicIcon />}
            fullWidth
          >
            Voice Command
          </Button>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Example Commands:
          </Typography>
          <Stack spacing={1}>
            <Chip
              label="sync contacts from this month tagged follow-up"
              onClick={() => setAiSyncQuery('sync contacts from this month tagged follow-up')}
              sx={{ justifyContent: 'flex-start' }}
            />
            <Chip
              label="filter accounts with less than 3 calls"
              onClick={() => setAiSyncQuery('filter accounts with less than 3 calls')}
              sx={{ justifyContent: 'flex-start' }}
            />
            <Chip
              label="sync orthopedic surgeons in manhattan"
              onClick={() => setAiSyncQuery('sync orthopedic surgeons in manhattan')}
              sx={{ justifyContent: 'flex-start' }}
            />
          </Stack>
        </Box>

        {/* Automation Integration */}
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoModeIcon color="primary" />
            Active Call Automations
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Follow-up after no answer</Typography>
              <Chip label="Active" color="success" size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Auto-dial next in queue</Typography>
              <Chip label={autoDialEnabled ? 'Active' : 'Paused'} color={autoDialEnabled ? 'success' : 'warning'} size="small" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">AI call summary generation</Typography>
              <Chip label="Active" color="success" size="small" />
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  const renderQueue = () => (
    <Card elevation={0} sx={{ ...glassEffects.effects.carbon, borderRadius: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QueueIcon color="warning" />
            <Typography variant="h6">Call Queue</Typography>
            <Badge badgeContent={callQueue.length} color="warning">
              <Box />
            </Badge>
          </Box>
        }
        action={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Auto-dial mode">
              <IconButton
                onClick={() => setAutoDialEnabled(!autoDialEnabled)}
                color={autoDialEnabled ? 'primary' : 'default'}
              >
                <AutoModeIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={() => setQueueStatus(queueStatus === 'active' ? 'paused' : 'active')}
              color={queueStatus === 'active' ? 'success' : 'default'}
            >
              {queueStatus === 'active' ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
          </Stack>
        }
      />
      <CardContent>
        {callQueue.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No calls in queue. Use AI Sync to create a smart queue.
            </Typography>
          </Box>
        ) : (
          <List>
            {callQueue.map((queuedCall, index) => (
              <ListItem key={queuedCall.id}>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.1) }}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={queuedCall.contact.name}
                  secondary={
                    <Box>
                      <Typography variant="caption">{queuedCall.contact.practice}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={queuedCall.priority * 10}
                        sx={{ mt: 0.5, height: 3 }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton size="small">
                    <SkipIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );

  const renderStats = () => (
    <Grid container spacing={3}>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <PhoneIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">{callStats.todaysCalls}</Typography>
          <Typography variant="body2" color="text.secondary">Today's Calls</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <TimerIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">{callStats.averageDuration}m</Typography>
          <Typography variant="body2" color="text.secondary">Avg Duration</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">{callStats.conversionRate}%</Typography>
          <Typography variant="body2" color="text.secondary">Conversion</Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center', ...glassEffects.effects.frostedSteel }}>
          <AnalyticsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4">+{callStats.weeklyTrend}%</Typography>
          <Typography variant="body2" color="text.secondary">Weekly Trend</Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const tabs = [
    { label: 'Dialer', icon: <PhoneIcon /> },
    { label: 'AI Sync', icon: <AIIcon /> },
    { label: 'Queue', icon: <QueueIcon /> },
    { label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Call Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered calling with Twilio integration
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mb: 4 }}>
        {renderStats()}
      </Box>

      {/* Main Content */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={activeTab === 3 ? 12 : 6}>
              <Fade in timeout={300}>
                <Box>
                  {activeTab === 0 && renderDialer()}
                  {activeTab === 1 && renderAiSync()}
                  {activeTab === 2 && renderQueue()}
                  {activeTab === 3 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Call Analytics
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AnalyticsIcon />}
                        onClick={() => navigate('/analytics/rep')}
                      >
                        View Detailed Analytics
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fade>
            </Grid>
            
            {activeTab !== 3 && (
              <Grid item xs={12} md={6}>
                <Fade in timeout={600}>
                  <Box>
                    {activeTab === 0 && renderAiSync()}
                    {activeTab === 1 && renderQueue()}
                    {activeTab === 2 && renderDialer()}
                  </Box>
                </Fade>
              </Grid>
            )}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default CallCenter;
// Ripple Viewer Component - The immersive content experience prospects see
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  IconButton,
  Fab,
  Zoom,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Backdrop,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import {
  AutoAwesome as RippleIcon,
  Timer as TimerIcon,
  TouchApp as EngagementIcon,
  QuestionAnswer as QuestionIcon,
  Calculate as CalculatorIcon,
  CalendarMonth as CalendarIcon,
  FileDownload as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckIcon,
  TrendingUp as ValueIcon,
  Psychology as InsightIcon,
  Groups as SocialProofIcon,
  Close as CloseIcon,
  ChevronRight as NextIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  PlayCircle as VideoIcon,
  Poll as PollIcon,
  Speed as UrgencyIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { rippleContentService, SparkViewer as RippleViewerData } from '../../services/rippleContentService';

interface RippleViewerProps {
  rippleToken: string;
}

// Create a custom theme for the viewer
const viewerTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#c51162',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    }
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const RippleViewer: React.FC<RippleViewerProps> = ({ rippleToken }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);

  // State management
  const [viewerData, setViewerData] = useState<RippleViewerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [engagementDepth, setEngagementDepth] = useState(0);
  const [interactions, setInteractions] = useState(0);
  
  // Engagement tracking state
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [hasTrackedDeepRead, setHasTrackedDeepRead] = useState(false);
  const [hasTrackedShare, setHasTrackedShare] = useState(false);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  // Dialog states
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  const [pollDialogOpen, setPollDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Form states
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    practice: '',
    message: ''
  });
  const [pollResponse, setPollResponse] = useState<string>('');
  const [calculatorInputs, setCalculatorInputs] = useState({
    currentPatients: 0,
    avgProcedureValue: 0,
    efficiencyGain: 20
  });

  // Load ripple content on mount
  useEffect(() => {
    loadRippleContent();
  }, [rippleToken]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      
      // Track engagement depth based on time
      if (timeSpent === 30 && !hasTrackedDeepRead) {
        trackEngagement('deep_read', { time_threshold: 30 });
        setHasTrackedDeepRead(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeSpent, hasTrackedDeepRead]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(progress);
      
      // Update engagement depth
      const newDepth = Math.max(engagementDepth, progress);
      setEngagementDepth(newDepth);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [engagementDepth]);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, track time spent
        trackEngagement('time_spent', {
          time_spent: timeSpent,
          scroll_percentage: scrollProgress
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [timeSpent, scrollProgress]);

  const loadRippleContent = async () => {
    try {
      setLoading(true);
      const data = await rippleContentService.getRippleViewer(rippleToken);
      
      if (!data) {
        setError('This content is no longer available or has expired.');
        return;
      }
      
      setViewerData(data);
      
      // Track initial view
      if (!hasTrackedView) {
        await trackEngagement('view', { 
          initial_load: true,
          device_type: isMobile ? 'mobile' : 'desktop'
        });
        setHasTrackedView(true);
      }
    } catch (error) {
      console.error('Error loading ripple content:', error);
      setError('Unable to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const trackEngagement = async (
    eventType: 'view' | 'click' | 'scroll' | 'time_spent' | 'share' | 'conversion' | 'deep_read',
    eventData?: any
  ) => {
    if (!viewerData) return;

    try {
      await rippleContentService.trackRippleEngagement(rippleToken, {
        engagement_type: eventType,
        engagement_depth: engagementDepth,
        session_data: {
          duration: timeSpent,
          interactions: interactions,
          scroll_depth: scrollProgress,
          focus_areas: focusAreas,
          exit_intent: false,
          return_visit: false
        },
        prospect_insights: {
          interest_level: calculateInterestLevel(),
          pain_points_identified: [],
          objections_detected: [],
          buying_signals: detectBuyingSignals(),
          recommended_follow_up: 'immediate'
        }
      });

      // Increment interaction counter
      if (['click', 'share', 'conversion'].includes(eventType)) {
        setInteractions(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  };

  const calculateInterestLevel = (): number => {
    let score = 0;
    
    // Time-based scoring
    if (timeSpent > 120) score += 30;
    else if (timeSpent > 60) score += 20;
    else if (timeSpent > 30) score += 10;
    
    // Interaction-based scoring
    score += interactions * 15;
    
    // Scroll depth scoring
    if (scrollProgress > 80) score += 20;
    else if (scrollProgress > 50) score += 10;
    
    return Math.min(100, score);
  };

  const detectBuyingSignals = (): string[] => {
    const signals = [];
    
    if (timeSpent > 60) signals.push('extended_engagement');
    if (interactions > 3) signals.push('high_interaction');
    if (scrollProgress > 75) signals.push('content_consumption');
    if (focusAreas.includes('pricing')) signals.push('pricing_interest');
    if (focusAreas.includes('demo')) signals.push('demo_interest');
    
    return signals;
  };

  const handleContactSubmit = async () => {
    await trackEngagement('conversion', {
      conversion_type: 'contact_form',
      contact_info: contactInfo
    });
    
    // Close dialog and show success
    setContactDialogOpen(false);
    // In production, would submit to backend
    console.log('Contact submitted:', contactInfo);
  };

  const handleShare = async () => {
    await trackEngagement('share', { method: 'native_share' });
    setHasTrackedShare(true);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: viewerData?.content?.subject_line || 'Check this out',
          text: 'I thought you might find this interesting',
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copy URL
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const handleCTAClick = async (action: string) => {
    await trackEngagement('click', { 
      click_target: action,
      cta_type: 'primary'
    });
    
    switch (action) {
      case 'book_demo':
        setBookingDialogOpen(true);
        break;
      case 'open_calculator':
        setCalculatorDialogOpen(true);
        break;
      case 'start_trial':
        window.open('/trial', '_blank');
        break;
      case 'schedule_call':
        setContactDialogOpen(true);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your personalized content...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <RippleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Content Unavailable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!viewerData) return null;

  return (
    <ThemeProvider theme={viewerTheme}>
      <CssBaseline />
      <Box ref={containerRef} sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={scrollProgress} 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1200,
            height: 3
          }} 
        />

        {/* Floating Action Buttons */}
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Zoom in={scrollProgress > 20}>
            <Fab 
              color="primary" 
              onClick={handleShare}
              sx={{ mb: 2 }}
              size="medium"
            >
              <ShareIcon />
            </Fab>
          </Zoom>
        </Box>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          {/* Hero Section */}
          <Fade in={true} timeout={1000}>
            <Card elevation={0} sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    {viewerData.ripple_experience?.personalized_greeting || viewerData.content?.subject_line}
                  </Typography>
                  <Typography variant="h5" sx={{ opacity: 0.9 }}>
                    Prepared exclusively for {viewerData.practice_context?.practice_name || 'your practice'}
                  </Typography>
                </motion.div>
              </CardContent>
            </Card>
          </Fade>

          {/* Dynamic Content Blocks */}
          <AnimatePresence>
            {viewerData.ripple_experience?.dynamic_content_blocks.map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card sx={{ mb: 3 }} elevation={1}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    {block.type === 'hero' && (
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {block.content}
                      </Typography>
                    )}
                    
                    {block.type === 'value_props' && (
                      <Grid container spacing={3}>
                        {block.content.map((prop: any, idx: number) => (
                          <Grid item xs={12} md={4} key={idx}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                              <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                                <ValueIcon />
                              </Avatar>
                              <Typography variant="h6" gutterBottom>
                                {prop.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {prop.description}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    
                    {block.type === 'social_proof' && (
                      <Box>
                        <Typography variant="h5" gutterBottom align="center">
                          {block.content.headline}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                          {block.content.stats && Object.entries(block.content.stats).map(([key, value]) => (
                            <Grid item xs={4} key={key}>
                              <Paper sx={{ p: 2, textAlign: 'center' }} elevation={0}>
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                  {value as string}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Interactive Elements */}
          {viewerData.ripple_experience?.interactive_elements.length > 0 && (
            <Card sx={{ mb: 3 }} elevation={1}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {viewerData.ripple_experience.interactive_elements.map((element: any, index: number) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={
                          element.type === 'quiz' ? <QuestionIcon /> :
                          element.type === 'calculator' ? <CalculatorIcon /> :
                          element.type === 'poll' ? <PollIcon /> :
                          <EngagementIcon />
                        }
                        onClick={() => {
                          if (element.type === 'calculator') setCalculatorDialogOpen(true);
                          if (element.type === 'poll') setPollDialogOpen(true);
                          trackEngagement('click', { element_type: element.type });
                        }}
                        sx={{ py: 2 }}
                      >
                        {element.title}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Smart CTAs */}
          {viewerData.ripple_experience?.smart_ctas && (
            <Card sx={{ mb: 3 }} elevation={2}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                      Ready to see the difference?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Join hundreds of practices already transforming their approach
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {viewerData.ripple_experience.smart_ctas.map((cta: any, index: number) => (
                      <Button
                        key={index}
                        fullWidth
                        variant={cta.style === 'primary' ? 'contained' : 'outlined'}
                        color={cta.style === 'primary' ? 'primary' : 'default'}
                        size="large"
                        onClick={() => handleCTAClick(cta.action)}
                        sx={{ mb: index < viewerData.ripple_experience.smart_ctas.length - 1 ? 1 : 0 }}
                        endIcon={<NextIcon />}
                      >
                        {cta.text}
                      </Button>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Urgency Indicators */}
          {viewerData.ripple_experience?.urgency_indicators && (
            <Slide direction="up" in={scrollProgress > 50} mountOnEnter unmountOnExit>
              <Alert 
                severity="info" 
                icon={<UrgencyIcon />}
                sx={{ mb: 3 }}
              >
                {viewerData.ripple_experience.urgency_indicators[0].message}
              </Alert>
            </Slide>
          )}
        </Container>

        {/* Contact Dialog */}
        <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Let's Connect
            <IconButton
              onClick={() => setContactDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Practice Name"
                value={contactInfo.practice}
                onChange={(e) => setContactInfo({ ...contactInfo, practice: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="How can we help?"
                multiline
                rows={3}
                value={contactInfo.message}
                onChange={(e) => setContactInfo({ ...contactInfo, message: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleContactSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Calculator Dialog */}
        <Dialog open={calculatorDialogOpen} onClose={() => setCalculatorDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            ROI Calculator
            <IconButton
              onClick={() => setCalculatorDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Current Monthly Patients"
                type="number"
                value={calculatorInputs.currentPatients}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, currentPatients: Number(e.target.value) })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Average Procedure Value ($)"
                type="number"
                value={calculatorInputs.avgProcedureValue}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, avgProcedureValue: Number(e.target.value) })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Expected Efficiency Gain (%)"
                type="number"
                value={calculatorInputs.efficiencyGain}
                onChange={(e) => setCalculatorInputs({ ...calculatorInputs, efficiencyGain: Number(e.target.value) })}
                sx={{ mb: 3 }}
              />
              
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  Potential Monthly Revenue Increase:
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ${(calculatorInputs.currentPatients * calculatorInputs.avgProcedureValue * (calculatorInputs.efficiencyGain / 100)).toLocaleString()}
                </Typography>
              </Paper>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCalculatorDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={() => {
              trackEngagement('conversion', { conversion_type: 'calculator_completion' });
              setContactDialogOpen(true);
              setCalculatorDialogOpen(false);
            }}>
              Get Personalized Analysis
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', py: 3, mt: 8, borderTop: 1, borderColor: 'divider' }}>
          <Container maxWidth="md">
            <Typography variant="body2" color="text.secondary" align="center">
              This content was created specifically for {viewerData.practice_context?.practice_name || 'you'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
              <Chip 
                size="small" 
                icon={<ViewIcon />} 
                label={`Viewed ${new Date().toLocaleDateString()}`} 
              />
              <Chip 
                size="small" 
                icon={<TimeIcon />} 
                label={`${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')} reading`} 
              />
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RippleViewer;
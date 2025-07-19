import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Autocomplete,
  CircularProgress,
  Alert,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Fade,
  Slide,
  Zoom,
  Backdrop,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  Avatar,
  Badge,
  Collapse,
  Card,
  CardContent,
  useMediaQuery,
  Grow,
  InputAdornment,
  ButtonGroup,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Save as SaveIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Minimize as MinimizeIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
  MoreVert as MoreVertIcon,
  Translate as TranslateIcon,
  Spellcheck as SpellCheckIcon,
  SmartToy as SmartToyIcon,
  Brush as BrushIcon,
  Palette as PaletteIcon,
  Animation as AnimationIcon,
  AutoFixHigh as AutoFixHighIcon,
  Textsms as TextsmsIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Vibration as VibrationIcon,
  FlashOn as FlashOnIcon,
  Insights as InsightsIcon,
  Public as PublicIcon,
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useThemeContext } from '../../themes/ThemeContext';
import { useAuth } from '../../auth';
import { Contact } from '../../types/models';
import { emailService } from '../../services/email/emailService';
import { translationService } from '../../services/email/TranslationService';
import { emailAnalyticsService } from '../../services/email/EmailAnalyticsService';
import { supabase } from '../../services/supabase/supabase';
import { useSound, useButtonSound, useNotificationSound, useThemeSound } from '../../hooks/useSound';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SmartComposer from './SmartComposer';
import InstantTranslator from './InstantTranslator';
import EmailAnalytics from './EmailAnalytics';
import GlobalTemplateLibrary from './GlobalTemplateLibrary';
import SendOptimizer from './SendOptimizer';

// Award-winning floating glass animations
const ultraFloatingGlass = keyframes`
  0% {
    transform: translateY(0px) scale(1) rotateX(0deg);
    backdrop-filter: blur(20px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    transform: translateY(-8px) scale(1.005) rotateX(1deg);
    backdrop-filter: blur(25px);
    box-shadow: 
      0 35px 60px -12px rgba(0, 0, 0, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 40px rgba(59, 130, 246, 0.1);
  }
  100% {
    transform: translateY(0px) scale(1) rotateX(0deg);
    backdrop-filter: blur(20px);
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const luxuryPulse = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(201, 176, 55, 0.3),
      0 0 40px rgba(201, 176, 55, 0.1),
      inset 0 1px 0 rgba(201, 176, 55, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(201, 176, 55, 0.5),
      0 0 60px rgba(201, 176, 55, 0.2),
      inset 0 1px 0 rgba(201, 176, 55, 0.3);
  }
`;

const glassShimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const particleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  33% {
    transform: translateY(-10px) rotate(120deg);
    opacity: 0.8;
  }
  66% {
    transform: translateY(5px) rotate(240deg);
    opacity: 0.4;
  }
`;

const aiGlow = keyframes`
  0%, 100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.2) saturate(1.3);
  }
`;

// Styled components with ultra-premium glass effects
const UltraGlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
  '& .MuiDialog-paper': {
    backgroundColor: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    animation: `${ultraFloatingGlass} 6s ease-in-out infinite`,
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: `linear-gradient(90deg, 
        transparent, 
        ${alpha(theme.palette.primary.main, 0.6)}, 
        transparent
      )`,
      backgroundSize: '200% 100%',
      animation: `${glassShimmer} 3s ease-in-out infinite`,
    },
    
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(
        circle at 20% 20%, 
        ${alpha(theme.palette.primary.main, 0.03)} 0%, 
        transparent 50%
      )`,
      pointerEvents: 'none',
    },
    
    boxShadow: `
      0 32px 64px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px ${alpha(theme.palette.primary.main, 0.05)},
      inset 0 1px 0 ${alpha('#ffffff', 0.1)},
      inset 0 -1px 0 ${alpha('#000000', 0.1)}
    `,
    
    '&.luxury-theme': {
      border: `1px solid ${alpha('#C9B037', 0.3)}`,
      animation: `${ultraFloatingGlass} 6s ease-in-out infinite, ${luxuryPulse} 4s ease-in-out infinite`,
      boxShadow: `
        0 32px 64px -12px rgba(201, 176, 55, 0.2),
        0 0 0 1px ${alpha('#C9B037', 0.1)},
        inset 0 1px 0 ${alpha('#C9B037', 0.2)},
        0 0 60px ${alpha('#C9B037', 0.1)}
      `,
    }
  }
}));

const FloatingParticle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette.primary.main, 0.3),
  animation: `${particleFloat} 8s ease-in-out infinite`,
  pointerEvents: 'none',
}));

const UltraGlassHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.background.paper, 0.9)} 0%,
    ${alpha(theme.palette.background.paper, 0.7)} 100%
  )`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(2, 3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, 
      transparent, 
      ${alpha(theme.palette.primary.main, 0.3)}, 
      transparent
    )`,
  }
}));

const UltraGlassButton = styled(Button)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderColor: alpha(theme.palette.primary.main, 0.4),
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  
  '&:active': {
    transform: 'translateY(0)',
  }
}));

const SmartField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    
    '& fieldset': {
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      borderRadius: '12px',
    },
    
    '&:hover fieldset': {
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    }
  }
}));

const AIChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  animation: `${aiGlow} 3s ease-in-out infinite`,
  
  '& .MuiChip-icon': {
    color: theme.palette.secondary.main,
  }
}));

interface UltraEmailModalProps {
  open: boolean;
  onClose: () => void;
  prefilledTo?: string;
  prefilledSubject?: string;
  contact?: Contact;
  contacts?: Contact[];
  mode?: 'compose' | 'reply' | 'forward';
  replyToEmail?: any;
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultContent?: string;
  contextData?: any;
  onEmailSent?: (data: any) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{ flexGrow: 1, display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
  >
    {value === index && children}
  </Box>
);

const UltraEmailModal: React.FC<UltraEmailModalProps> = ({
  open,
  onClose,
  prefilledTo = '',
  prefilledSubject = '',
  contact,
  contacts = [],
  mode = 'compose',
  replyToEmail
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const secondaryButtonSound = useButtonSound('secondary');
  const notificationSound = useNotificationSound();
  const { playThemeSwitch } = useThemeSound();
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailStats, setEmailStats] = useState<any>(null);
  const [aiAssistant, setAiAssistant] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedForRetry, setQueuedForRetry] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // New component states
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showSendOptimizer, setShowSendOptimizer] = useState(false);
  const [optimalSendTime, setOptimalSendTime] = useState<Date | null>(null);
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const particleTimeouts = useRef<NodeJS.Timeout[]>([]);
  
  // Theme detection
  const currentThemeData = getCurrentTheme();
  const isLuxuryTheme = currentThemeData?.category === 'luxury' || 
                       currentThemeData?.category === 'beauty' || 
                       themeMode === 'luxury';

  // Online/offline monitoring and backend status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Email modal: Back online');
      
      // Check backend status when coming back online
      checkBackendStatus();
      
      if (queuedForRetry) {
        setError('Back online - you can retry sending your email');
        if (soundEnabled) notificationSound.info();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setBackendStatus('offline');
      console.log('Email modal: Offline mode');
      
      if (sending) {
        setError('Connection lost - email will be queued for retry when online');
        if (soundEnabled) notificationSound.error();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedForRetry, sending, soundEnabled, notificationSound]);

  // Backend status checking function
  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/health`, {
        method: 'GET'
      });
      
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  // Check backend status periodically
  useEffect(() => {
    // Check immediately
    checkBackendStatus();

    // Check every 30 seconds if modal is open
    const interval = setInterval(() => {
      if (open) {
        checkBackendStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [open]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      
      // Ctrl/Cmd + Enter to send
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSend();
      }
      
      // Escape to close
      if (event.key === 'Escape' && !isFullscreen) {
        event.preventDefault();
        handleClose();
      }
      
      // Ctrl/Cmd + S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSaveDraft();
      }
      
      // F11 for fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
      
      // Ctrl/Cmd + Shift + A for AI assistant
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setAiAssistant(!aiAssistant);
      }
      
      // Ctrl/Cmd + R to retry failed send
      if ((event.ctrlKey || event.metaKey) && event.key === 'r' && (queuedForRetry || error)) {
        event.preventDefault();
        handleRetry();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isFullscreen, aiAssistant, queuedForRetry, error]);

  // Floating particles effect
  useEffect(() => {
    if (!open || isMinimized) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: ${alpha(theme.palette.primary.main, 0.4)};
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: ${particleFloat} ${6 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      modalRef.current?.appendChild(particle);
      
      const timeout = setTimeout(() => {
        particle.remove();
      }, 10000);
      
      particleTimeouts.current.push(timeout);
    };

    const interval = setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 5; i++) {
      setTimeout(createParticle, i * 400);
    }

    return () => {
      clearInterval(interval);
      particleTimeouts.current.forEach(clearTimeout);
      particleTimeouts.current = [];
    };
  }, [open, isMinimized, theme.palette.primary.main]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !open) return;
    
    const saveData = {
      to, cc, bcc, subject, body, priority, scheduled, scheduleDate: scheduleDate?.toISOString()
    };
    
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('ultraEmailModal_draft', JSON.stringify(saveData));
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  }, [to, cc, bcc, subject, body, priority, scheduled, scheduleDate, autoSave, open]);

  // Load draft on open
  useEffect(() => {
    if (open && autoSave) {
      const saved = localStorage.getItem('ultraEmailModal_draft');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setTo(data.to || []);
          setCc(data.cc || []);
          setBcc(data.bcc || []);
          setSubject(data.subject || '');
          setBody(data.body || '');
          setPriority(data.priority || 'normal');
          setScheduled(data.scheduled || false);
          setScheduleDate(data.scheduleDate ? new Date(data.scheduleDate) : null);
        } catch (e) {
          console.warn('Failed to load draft:', e);
        }
      }
    }
  }, [open, autoSave]);

  // Initialize with prefilled data
  useEffect(() => {
    if (prefilledTo) {
      setTo([prefilledTo]);
    } else if (contact?.email) {
      setTo([contact.email]);
    }
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
    
    // Handle reply mode
    if (mode === 'reply' && replyToEmail) {
      setTo([replyToEmail.from]);
      setSubject(`Re: ${replyToEmail.subject}`);
    }
    
    // Handle forward mode
    if (mode === 'forward' && replyToEmail) {
      setSubject(`Fwd: ${replyToEmail.subject}`);
      setBody(`\n\n--- Forwarded message ---\n${replyToEmail.body}`);
    }
  }, [prefilledTo, prefilledSubject, contact, mode, replyToEmail]);

  // Load email templates with enhanced service
  useEffect(() => {
    const loadTemplates = async () => {
      if (!user) return;
      
      try {
        // Use enhanced email service for template loading
        const templates = await emailService.getEmailTemplates(user.id);
        setTemplates(templates);
        
        // Also load email stats for analytics
        const stats = await emailService.getEmailStats(user.id);
        setEmailStats(stats);
      } catch (error) {
        console.error('Failed to load templates and stats:', error);
        
        // Fallback to direct Supabase query
        const { data } = await supabase
          .from('email_templates')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('name');
        
        if (data) {
          setTemplates(data);
        }
      }
    };

    loadTemplates();
  }, [user]);

  // AI suggestions
  useEffect(() => {
    if (aiAssistant && subject) {
      const suggestions = [
        `Enhance tone for "${subject}"`,
        'Add professional closing',
        'Check grammar & style',
        'Translate to Spanish',
        'Make more concise'
      ];
      setSmartSuggestions(suggestions);
    }
  }, [aiAssistant, subject]);

  // Progress simulation
  useEffect(() => {
    if (sending) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => prev >= 100 ? 100 : prev + 10);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [sending]);

  // Quill editor modules with enhanced toolbar
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ]
  }), []);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.html_content || template.text_content || '');
      if (soundEnabled) notificationSound.info();
    }
  };

  const handleSend = async () => {
    if (to.length === 0 || !subject || !body) {
      setError('Please fill in all required fields');
      if (soundEnabled) notificationSound.error();
      return;
    }

    // Check online status
    if (!isOnline) {
      setError('You are offline. Email will be queued for sending when connection is restored.');
      setQueuedForRetry(true);
      if (soundEnabled) notificationSound.error();
      return;
    }

    setSending(true);
    setError(null);
    setRetryAttempts(0);
    if (soundEnabled) buttonSound.play();

    try {
      // Prepare email options with enhanced features
      const allRecipients = [...to, ...cc, ...bcc];
      
      // Process each recipient with enhanced email service
      const sendPromises = allRecipients.map(async (recipient) => {
        try {
          // Process email content for tracking
          const messageId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          let processedHtml = body;
          
          try {
            const trackingResult = await emailAnalyticsService.processEmailForTracking(
              messageId,
              body,
              true, // Enable open tracking
              true  // Enable click tracking
            );
            processedHtml = trackingResult.processedHtml;
          } catch (trackingError) {
            console.warn('Failed to process email tracking, sending without tracking:', trackingError);
          }

          // Send email with enhanced options
          const result = await emailService.sendEmail({
            to: recipient,
            cc: cc.length > 0 ? cc : undefined,
            bcc: bcc.length > 0 ? bcc : undefined,
            subject,
            html: processedHtml,
            text: body.replace(/<[^>]*>/g, ''), // Strip HTML for text version
            contactId: contact?.id,
            priority,
            scheduled: scheduled && scheduleDate ? scheduleDate : undefined,
            trackOpens: true,
            trackClicks: true,
            tags: ['ultra-email-modal'],
            metadata: {
              source: 'ultra-email-modal',
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              retryAttempt: retryAttempts
            }
          });

          // Track the send event if successful
          if (result.success && result.messageId) {
            try {
              await emailAnalyticsService.trackEmailEvent(
                result.messageId,
                'sent',
                {
                  ip_address: await fetch('https://api.ipify.org?format=json')
                    .then(res => res.json())
                    .then(data => data.ip)
                    .catch(() => undefined),
                  user_agent: navigator.userAgent,
                  device_info: {
                    type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
                    os: navigator.platform,
                    browser: navigator.userAgent.split(' ').pop()
                  }
                }
              );
            } catch (trackingError) {
              console.warn('Failed to track send event:', trackingError);
            }
          }

          return { ...result, recipient };
        } catch (error) {
          console.error(`Failed to send to ${recipient}:`, error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            recipient
          };
        }
      });

      const results = await Promise.all(sendPromises);
      const failed = results.filter(r => !r.success);
      const offline = results.filter(r => r.error?.includes('offline') || r.error?.includes('Offline'));

      if (offline.length > 0) {
        setError(`${offline.length} email(s) queued for retry when online`);
        setQueuedForRetry(true);
        if (soundEnabled) notificationSound.info();
      } else if (failed.length > 0) {
        const failedRecipients = failed.map(f => (f as any).recipient || 'unknown').join(', ');
        setError(`Failed to send to ${failed.length} recipient(s): ${failedRecipients}`);
        setQueuedForRetry(true);
        if (soundEnabled) notificationSound.error();
      } else {
        setSuccess(true);
        setQueuedForRetry(false);
        if (soundEnabled) notificationSound.success();
        localStorage.removeItem('ultraEmailModal_draft');
        
        // Show success analytics if available
        const successCount = results.filter(r => r.success).length;
        console.log(`Successfully sent ${successCount} emails with tracking enabled`);
        
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Email send error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      
      if (errorMessage.includes('offline') || errorMessage.includes('network')) {
        setError('Connection failed - email queued for retry when online');
        setQueuedForRetry(true);
        if (soundEnabled) notificationSound.info();
      } else {
        setError(errorMessage);
        setQueuedForRetry(true);
        if (soundEnabled) notificationSound.error();
      }
    } finally {
      setSending(false);
    }
  };

  const handleRetry = async () => {
    if (!isOnline) {
      setError('Still offline - please check your connection');
      if (soundEnabled) notificationSound.error();
      return;
    }

    if (retryAttempts >= 3) {
      setError('Maximum retry attempts reached. Please check your email configuration.');
      if (soundEnabled) notificationSound.error();
      return;
    }

    setRetryAttempts(prev => prev + 1);
    setQueuedForRetry(false);
    await handleSend();
  };

  const handleSaveDraft = () => {
    if (soundEnabled) secondaryButtonSound.play();
    // Save draft logic here
    notificationSound.info();
  };

  const handleClose = () => {
    setTo([]);
    setCc([]);
    setBcc([]);
    setSubject('');
    setBody('');
    setError(null);
    setSuccess(false);
    setSelectedTemplate('');
    setIsFullscreen(false);
    setIsMinimized(false);
    setShowAdvanced(false);
    setTabValue(0);
    setOptimalSendTime(null);
    setShowAnalytics(false);
    setShowTemplateLibrary(false);
    setShowSendOptimizer(false);
    if (soundEnabled) secondaryButtonSound.play();
    onClose();
  };

  const handleAIAssist = (suggestion: string) => {
    if (soundEnabled) notificationSound.info();
    // AI assistance logic here
    console.log('AI assist:', suggestion);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
      <UltraGlassDialog
        open={open}
        onClose={!sending ? handleClose : undefined}
        maxWidth={isFullscreen ? false : "lg"}
        fullWidth
        fullScreen={isFullscreen || isMobile}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 600 }}
        className={isLuxuryTheme ? 'luxury-theme' : ''}
        PaperProps={{
          ref: modalRef,
          sx: {
            width: isFullscreen ? '100vw' : { xs: '95vw', sm: '90vw', md: '85vw', lg: '80vw' },
            height: isFullscreen ? '100vh' : isMinimized ? '60px' : { xs: '95vh', sm: '90vh', md: '85vh' },
            maxWidth: isFullscreen ? 'none' : '1200px',
            maxHeight: isFullscreen ? 'none' : '900px',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            ...(isMinimized && {
              height: '60px',
              '& .MuiDialogContent-root, & .MuiDialogActions-root': {
                display: 'none'
              }
            })
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: alpha('#000000', 0.4),
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }
        }}
      >
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <FloatingParticle
            key={i}
            sx={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Ultra Glass Header */}
        <UltraGlassHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 40,
                height: 40,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <TextsmsIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}
              >
                {mode === 'compose' ? 'Ultra Email Composer' : 
                 mode === 'reply' ? 'Reply Message' : 'Forward Message'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {sending ? `Sending... ${progress}%` : 
                   queuedForRetry ? 'Queued for retry' :
                   'AI-Powered Email Experience'}
                </Typography>
                
                {/* Connection Status Indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 
                        !isOnline ? theme.palette.error.main :
                        backendStatus === 'online' ? theme.palette.success.main :
                        backendStatus === 'offline' ? theme.palette.warning.main :
                        theme.palette.grey[400],
                      animation: sending ? 'pulse 2s infinite' : 'none'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                    {!isOnline ? 'Offline' :
                     backendStatus === 'online' ? 'Online' :
                     backendStatus === 'offline' ? 'Backend Down' :
                     'Checking...'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Templates Quick Access */}
            <Tooltip title="Global Templates">
              <IconButton
                size="small"
                onClick={() => setTabValue(3)}
                sx={{
                  color: tabValue === 3 ? theme.palette.primary.main : 'text.secondary',
                  backgroundColor: tabValue === 3 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  border: `1px solid ${tabValue === 3 ? alpha(theme.palette.primary.main, 0.2) : 'transparent'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <PublicIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Send Optimizer Quick Access */}
            <Tooltip title="Send Time Optimizer">
              <IconButton
                size="small"
                onClick={() => setTabValue(4)}
                sx={{
                  color: tabValue === 4 ? theme.palette.warning.main : 'text.secondary',
                  backgroundColor: tabValue === 4 ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                  border: `1px solid ${tabValue === 4 ? alpha(theme.palette.warning.main, 0.2) : 'transparent'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <AccessTimeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Analytics Quick Access */}
            <Tooltip title="Email Analytics">
              <IconButton
                size="small"
                onClick={() => setTabValue(5)}
                sx={{
                  color: tabValue === 5 ? theme.palette.info.main : 'text.secondary',
                  backgroundColor: tabValue === 5 ? alpha(theme.palette.info.main, 0.1) : 'transparent',
                  border: `1px solid ${tabValue === 5 ? alpha(theme.palette.info.main, 0.2) : 'transparent'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <AnalyticsIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* AI Assistant Toggle */}
            <Tooltip title="AI Assistant (Ctrl+Shift+A)">
              <IconButton
                size="small"
                onClick={() => setAiAssistant(!aiAssistant)}
                sx={{
                  color: aiAssistant ? theme.palette.secondary.main : 'text.secondary',
                  backgroundColor: aiAssistant ? alpha(theme.palette.secondary.main, 0.1) : 'transparent',
                  border: `1px solid ${aiAssistant ? alpha(theme.palette.secondary.main, 0.2) : 'transparent'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <SmartToyIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{ borderRadius: '8px' }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Minimize */}
            <Tooltip title="Minimize">
              <IconButton
                size="small"
                onClick={() => setIsMinimized(!isMinimized)}
                sx={{ borderRadius: '8px' }}
              >
                <MinimizeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Fullscreen */}
            <Tooltip title={`${isFullscreen ? 'Exit' : 'Enter'} Fullscreen (F11)`}>
              <IconButton
                size="small"
                onClick={() => setIsFullscreen(!isFullscreen)}
                sx={{ borderRadius: '8px' }}
              >
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Close */}
            <Tooltip title="Close (Esc)">
              <IconButton
                size="small"
                onClick={handleClose}
                disabled={sending}
                sx={{ borderRadius: '8px' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </UltraGlassHeader>

        <Collapse in={!isMinimized}>
          {/* Progress Bar */}
          {sending && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }
              }}
            />
          )}

          {/* Advanced Settings Panel */}
          <Collapse in={showAdvanced}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <FormControlLabel
                  control={<Switch checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} size="small" />}
                  label="Sound"
                />
                <FormControlLabel
                  control={<Switch checked={hapticEnabled} onChange={(e) => setHapticEnabled(e.target.checked)} size="small" />}
                  label="Haptic"
                />
                <FormControlLabel
                  control={<Switch checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} size="small" />}
                  label="Auto-save"
                />
                <FormControlLabel
                  control={<Switch checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} size="small" />}
                  label="Schedule"
                />
              </Stack>
              
              {/* Email Stats Quick View */}
              {emailStats && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: '8px' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Today's Email Stats
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ fontSize: '0.75rem' }}>
                    <Box>
                      <Typography variant="caption" color="success.main">
                        ↗ {emailStats.sentToday} sent
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="info.main">
                        📬 {emailStats.deliveredToday || 0} delivered
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="warning.main">
                        👁 {emailStats.openedToday || 0} opened
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="primary.main">
                        🖱 {emailStats.clickedToday || 0} clicked
                      </Typography>
                    </Box>
                    {emailStats.openRate > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          📊 {emailStats.openRate.toFixed(1)}% open rate
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}
            </Box>
          </Collapse>

          {/* Main Content */}
          <DialogContent 
            sx={{ 
              p: 0, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {/* AI Assistant Panel */}
            <Collapse in={aiAssistant}>
              <Card
                sx={{
                  m: 2,
                  mb: 1,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  borderRadius: '12px'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SmartToyIcon color="secondary" fontSize="small" />
                    <Typography variant="subtitle2" color="secondary">
                      AI Assistant
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {smartSuggestions.map((suggestion, index) => (
                      <AIChip
                        key={index}
                        label={suggestion}
                        size="small"
                        icon={<AutoAwesomeIcon />}
                        onClick={() => handleAIAssist(suggestion)}
                        clickable
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Collapse>

            {/* Error/Success Alerts */}
            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError(null)}
                sx={{ m: 2, mb: 1, borderRadius: '12px' }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success"
                sx={{ m: 2, mb: 1, borderRadius: '12px' }}
              >
                Email sent successfully!
              </Alert>
            )}

            {/* Email Form */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
              {/* Recipients */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* To Field */}
                <Autocomplete
                  multiple
                  freeSolo
                  options={contacts.map(c => c.email).filter(Boolean) as string[]}
                  value={to}
                  onChange={(_, newValue) => setTo(newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        size="small"
                        sx={{ borderRadius: '8px' }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <SmartField
                      {...params}
                      label="To"
                      placeholder="Add recipients..."
                      size="small"
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <PersonAddIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />

                {/* CC/BCC Fields */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={contacts.map(c => c.email).filter(Boolean) as string[]}
                    value={cc}
                    onChange={(_, newValue) => setCc(newValue)}
                    sx={{ flex: 1 }}
                    renderInput={(params) => (
                      <SmartField
                        {...params}
                        label="CC"
                        size="small"
                        placeholder="Carbon copy..."
                      />
                    )}
                  />
                  <Autocomplete
                    multiple
                    freeSolo
                    options={contacts.map(c => c.email).filter(Boolean) as string[]}
                    value={bcc}
                    onChange={(_, newValue) => setBcc(newValue)}
                    sx={{ flex: 1 }}
                    renderInput={(params) => (
                      <SmartField
                        {...params}
                        label="BCC"
                        size="small"
                        placeholder="Blind carbon copy..."
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Subject and Options Row */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <SmartField
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  size="small"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TextsmsIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }}
                />
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    label="Priority"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Template Selector */}
              {templates.length > 0 && (
                <FormControl size="small">
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    label="Template"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {templates.map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Schedule Field */}
              {scheduled && (
                <DateTimePicker
                  label="Schedule for"
                  value={scheduleDate}
                  onChange={(newValue) => setScheduleDate(newValue)}
                  renderInput={(params) => (
                    <SmartField
                      {...params}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <ScheduleIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              )}

              {/* Tabs for Composer and Translator */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  variant={isMobile ? 'scrollable' : 'fullWidth'}
                  scrollButtons="auto"
                  sx={{
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '& .MuiTab-root': {
                      borderRadius: '12px 12px 0 0',
                      margin: '0 2px',
                      minWidth: isMobile ? 120 : 'auto',
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }
                  }}
                >
                  <Tab
                    icon={<TextsmsIcon />}
                    label="Compose"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<SmartToyIcon />}
                    label="Smart"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<TranslateIcon />}
                    label="Translate"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<PublicIcon />}
                    label="Templates"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<AccessTimeIcon />}
                    label="Optimizer"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab
                    icon={<AnalyticsIcon />}
                    label="Analytics"
                    sx={{ minHeight: 48 }}
                  />
                </Tabs>

                {/* Tab Panels */}
                <TabPanel value={tabValue} index={0}>
                  {/* Standard Rich Text Editor */}
                  <Box 
                    sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      minHeight: '300px',
                      p: 2
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      Message
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        flexGrow: 1, 
                        overflow: 'hidden',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        '& .ql-toolbar': {
                          borderTopLeftRadius: '12px',
                          borderTopRightRadius: '12px',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          backgroundColor: alpha(theme.palette.background.paper, 0.8)
                        },
                        '& .ql-container': {
                          borderBottomLeftRadius: '12px',
                          borderBottomRightRadius: '12px',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          minHeight: '250px'
                        }
                      }}
                    >
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={body}
                        onChange={setBody}
                        modules={modules}
                        style={{ height: '100%' }}
                      />
                    </Paper>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {/* Smart Composer */}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <SmartComposer
                      value={body}
                      onChange={setBody}
                      placeholder="Start composing with AI assistance..."
                      disabled={sending}
                      onAISuggestion={(suggestion) => {
                        console.log('AI Suggestion applied:', suggestion);
                        if (soundEnabled) notificationSound.info();
                      }}
                      onVoiceInput={(text) => {
                        console.log('Voice input received:', text);
                        if (soundEnabled) notificationSound.success();
                      }}
                      templates={templates.map(t => ({
                        id: t.id,
                        name: t.name,
                        content: t.html_content || t.text_content || '',
                        tone: t.tone || 'professional',
                        category: t.category || 'general'
                      }))}
                      autoComplete={true}
                      grammarCheck={true}
                      styleGuide="professional"
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {/* Instant Translator with Enhanced Service */}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <InstantTranslator
                      sourceText={body}
                      onTranslation={async (translation, language) => {
                        setBody(translation);
                        if (soundEnabled) notificationSound.success();
                        
                        // Also update subject if it was translated
                        if (subject && subject.trim()) {
                          try {
                            const subjectTranslation = await translationService.translate({
                              text: subject,
                              sourceLanguage: 'auto',
                              targetLanguage: language,
                              domain: 'business',
                              preserveTechnicalTerms: true
                            });
                            setSubject(subjectTranslation.translatedText);
                          } catch (error) {
                            console.warn('Failed to translate subject:', error);
                          }
                        }
                        
                        console.log('Translation received:', { translation, language });
                      }}
                      onLanguageDetect={async (language) => {
                        console.log('Language detected:', language);
                        if (soundEnabled) notificationSound.info();
                        
                        // Store detected language for analytics
                        try {
                          await supabase
                            .from('user_preferences')
                            .upsert({
                              user_id: user?.id,
                              detected_language: language,
                              updated_at: new Date().toISOString()
                            });
                        } catch (error) {
                          console.warn('Failed to store detected language:', error);
                        }
                      }}
                      preserveTechnicalTerms={true}
                      culturalAdaptation={true}
                      showQualityIndicators={true}
                      defaultSourceLang="auto"
                      defaultTargetLang="es"
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  {/* Global Template Library */}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <GlobalTemplateLibrary
                      open={true}
                      onClose={() => {}}
                      onSelectTemplate={(template) => {
                        setSubject(template.subject);
                        setBody(template.html_content || template.text_content || '');
                        if (soundEnabled) notificationSound.success();
                        setTabValue(0); // Switch back to compose tab
                      }}
                      selectedCategory={undefined}
                      selectedCulture={undefined}
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={4}>
                  {/* Send Time Optimizer */}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <SendOptimizer
                      recipientEmails={[...to, ...cc, ...bcc]}
                      subject={subject}
                      content={body}
                      onOptimalTimeSelected={(dateTime) => {
                        setOptimalSendTime(dateTime);
                        setScheduled(true);
                        setScheduleDate(dateTime);
                        if (soundEnabled) notificationSound.success();
                      }}
                      onScheduleRecommendation={(recommendation) => {
                        console.log('Schedule recommendation received:', recommendation);
                        if (soundEnabled) notificationSound.info();
                      }}
                      showAdvancedSettings={true}
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={5}>
                  {/* Email Analytics Dashboard */}
                  <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <EmailAnalytics
                      open={true}
                      onClose={() => {}}
                      campaignId={undefined}
                      contactId={contact?.id}
                      timeRange="24h"
                      refreshInterval={30000}
                    />
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </DialogContent>

          {/* Ultra Glass Actions */}
          <DialogActions 
            sx={{ 
              p: 3, 
              gap: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachFileIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                Attachments (coming soon)
              </Typography>
            </Box>

            <ButtonGroup variant="outlined" sx={{ gap: 1 }}>
              <Button
                onClick={handleClose}
                disabled={sending}
                sx={{ borderRadius: '12px' }}
              >
                Cancel
              </Button>
              
              <UltraGlassButton
                startIcon={<SaveIcon />}
                onClick={handleSaveDraft}
                disabled={sending || (!to.length && !subject && !body)}
              >
                Draft
              </UltraGlassButton>
              
              {/* Retry Button for failed sends */}
              {queuedForRetry && (
                <UltraGlassButton
                  variant="outlined"
                  startIcon={<ReplyIcon />}
                  onClick={handleRetry}
                  disabled={sending || !isOnline}
                  sx={{
                    borderColor: theme.palette.warning.main,
                    color: theme.palette.warning.main,
                    '&:hover': {
                      borderColor: theme.palette.warning.dark,
                      backgroundColor: alpha(theme.palette.warning.main, 0.1)
                    }
                  }}
                >
                  Retry ({retryAttempts}/3)
                </UltraGlassButton>
              )}
              
              <UltraGlassButton
                variant="contained"
                startIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
                onClick={queuedForRetry ? handleRetry : handleSend}
                disabled={sending || !to.length || !subject || !body || (!isOnline && !queuedForRetry)}
                sx={{
                  background: queuedForRetry ? 
                    `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})` :
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: queuedForRetry ?
                      `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.dark})` :
                      `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                  '&:disabled': {
                    background: alpha(theme.palette.action.disabled, 0.12),
                    color: theme.palette.action.disabled
                  }
                }}
              >
                {sending ? 'Sending...' : 
                 queuedForRetry ? 'Retry Send' :
                 scheduled ? 'Schedule' : 
                 !isOnline ? 'Offline' :
                 'Send'}
              </UltraGlassButton>
            </ButtonGroup>
          </DialogActions>
        </Collapse>
      </UltraGlassDialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: '12px' }}>
          Email sent successfully!
        </Alert>
      </Snackbar>
      </>
    </LocalizationProvider>
  );
};

export default UltraEmailModal;
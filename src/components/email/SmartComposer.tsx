import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Button,
  TextField,
  Autocomplete,
  Tooltip,
  Card,
  CardContent,
  Collapse,
  LinearProgress,
  Alert,
  Slider,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Stack,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  useTheme,
  alpha,
  useMediaQuery,
  InputAdornment,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  RecordVoiceOver as VoiceIcon,
  MicOff as MicOffIcon,
  SpellCheck as SpellCheckIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Mood as MoodIcon,
  MoodBad as MoodBadIcon,
  Star as StarIcon,
  AutoFixHigh as AutoFixHighIcon,
  Brush as BrushIcon,
  Palette as PaletteIcon,
  TextFormat as TextFormatIcon,
  SmartToy as SmartToyIcon,
  VolumeUp as VolumeUpIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  FlashOn as FlashOnIcon,
  Architecture as ArchitectureIcon,
  Extension as ExtensionIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound, useButtonSound, useNotificationSound } from '../../hooks/useSound';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Enhanced animations for AI-powered composition
const aiPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }
  50% {
    transform: scale(1.02);
    filter: brightness(1.1) saturate(1.2);
  }
`;

const smartGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(76, 175, 80, 0.2),
      0 0 40px rgba(76, 175, 80, 0.1),
      inset 0 1px 0 rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(76, 175, 80, 0.4),
      0 0 60px rgba(76, 175, 80, 0.2),
      inset 0 1px 0 rgba(76, 175, 80, 0.3);
  }
`;

const voiceWave = keyframes`
  0%, 100% { transform: scaleY(0.5); opacity: 0.7; }
  50% { transform: scaleY(1.5); opacity: 1; }
`;

const toneShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const suggestionFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
    opacity: 1;
  }
`;

// Styled components for AI composition interface
const SmartComposerContainer = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  
  '&.ai-active': {
    animation: `${aiPulse} 3s ease-in-out infinite`,
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.secondary.main}, 
      ${theme.palette.primary.main}
    )`,
    backgroundSize: '200% 100%',
    animation: `${toneShift} 5s ease-in-out infinite`,
  }
}));

const AIControlPanel = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.secondary.main, 0.05)} 0%,
    ${alpha(theme.palette.primary.main, 0.05)} 100%
  )`,
  borderRadius: '12px',
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
  animation: `${smartGlow} 4s ease-in-out infinite`,
}));

const VoiceIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  
  '& .wave': {
    width: '3px',
    height: '20px',
    backgroundColor: theme.palette.error.main,
    borderRadius: '2px',
    animation: `${voiceWave} 0.6s ease-in-out infinite`,
    
    '&:nth-of-type(2)': { animationDelay: '0.1s' },
    '&:nth-of-type(3)': { animationDelay: '0.2s' },
    '&:nth-of-type(4)': { animationDelay: '0.3s' },
    '&:nth-of-type(5)': { animationDelay: '0.4s' },
  }
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: '20px',
  animation: `${suggestionFloat} 4s ease-in-out infinite`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-4px) scale(1.05)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  
  '& .MuiChip-icon': {
    color: theme.palette.primary.main,
  }
}));

const ToneSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, 
      ${theme.palette.error.main} 0%,
      ${theme.palette.warning.main} 25%,
      ${theme.palette.info.main} 50%,
      ${theme.palette.success.main} 75%,
      ${theme.palette.primary.main} 100%
    )`,
    border: 'none',
    height: 6,
  },
  '& .MuiSlider-thumb': {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    width: 20,
    height: 20,
    '&:hover': {
      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
    }
  },
  '& .MuiSlider-rail': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    height: 6,
  }
}));

interface SmartComposerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onAISuggestion?: (suggestion: string) => void;
  onVoiceInput?: (text: string) => void;
  templates?: Array<{ id: string; name: string; content: string; tone: string; category: string }>;
  autoComplete?: boolean;
  grammarCheck?: boolean;
  styleGuide?: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive';
}

interface AIAnalysis {
  tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'urgent';
  sentiment: number; // -1 to 1
  readability: number; // 1 to 10
  wordCount: number;
  grammarScore: number; // 1 to 10
  suggestions: string[];
  keyPhrases: string[];
}

interface VoiceRecognition {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  confidence: number;
}

const SmartComposer: React.FC<SmartComposerProps> = ({
  value,
  onChange,
  placeholder = "Start composing your message...",
  disabled = false,
  onAISuggestion,
  onVoiceInput,
  templates = [],
  autoComplete = true,
  grammarCheck = true,
  styleGuide = 'professional'
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const secondaryButtonSound = useButtonSound('secondary');
  const notificationSound = useNotificationSound();
  
  // State management
  const [isAIActive, setIsAIActive] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition>({
    isSupported: false,
    isListening: false,
    transcript: '',
    confidence: 0
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [grammarIssues, setGrammarIssues] = useState<Array<{ text: string; suggestion: string; position: number }>>([]);
  const [toneTarget, setToneTarget] = useState(50); // 0-100 scale
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [autoCompleteActive, setAutoCompleteActive] = useState(autoComplete);
  const [grammarCheckActive, setGrammarCheckActive] = useState(grammarCheck);
  const [savedDrafts, setSavedDrafts] = useState<Array<{ id: string; content: string; timestamp: Date }>>([]);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  
  // Refs
  const quillRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Theme detection
  const currentThemeData = getCurrentTheme();
  const isLuxuryTheme = currentThemeData?.category === 'luxury' || 
                       currentThemeData?.category === 'beauty';

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setVoiceRecognition(prev => ({ ...prev, isListening: true }));
        notificationSound.info();
      };
      
      recognitionRef.current.onend = () => {
        setVoiceRecognition(prev => ({ ...prev, isListening: false }));
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          const newContent = value + ' ' + finalTranscript;
          onChange(newContent);
          onVoiceInput?.(finalTranscript);
          setVoiceRecognition(prev => ({
            ...prev,
            transcript: finalTranscript,
            confidence: event.results[event.results.length - 1][0].confidence || 0
          }));
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setVoiceRecognition(prev => ({ ...prev, isListening: false }));
        notificationSound.error();
      };
      
      setVoiceRecognition(prev => ({ ...prev, isSupported: true }));
    }
  }, [value, onChange, onVoiceInput, notificationSound]);

  // AI Analysis with debouncing
  useEffect(() => {
    if (!value || !isAIActive) return;
    
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }
    
    analysisTimeoutRef.current = setTimeout(() => {
      performAIAnalysis(value);
    }, 1000);
    
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
      }
    };
  }, [value, isAIActive]);

  const performAIAnalysis = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis - in real implementation, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const wordCount = text.split(/\s+/).length;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
      
      // Mock analysis results
      const analysis: AIAnalysis = {
        tone: avgWordsPerSentence > 20 ? 'formal' : avgWordsPerSentence > 15 ? 'professional' : 'casual',
        sentiment: Math.random() * 2 - 1, // Random sentiment for demo
        readability: Math.max(1, Math.min(10, 10 - avgWordsPerSentence / 3)),
        wordCount,
        grammarScore: 8 + Math.random() * 2,
        suggestions: [
          'Consider adding a call-to-action',
          'This paragraph could be more concise',
          'Great use of professional tone',
          'Consider adding specific examples'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        keyPhrases: text.match(/\b\w{4,}\b/g)?.slice(0, 5) || []
      };
      
      setAiAnalysis(analysis);
      
      // Generate suggestions based on tone target
      const toneMap = ['casual', 'friendly', 'professional', 'formal', 'urgent'];
      const targetTone = toneMap[Math.floor(toneTarget / 20)];
      
      if (analysis.tone !== targetTone) {
        setSuggestions([
          `Adjust tone to be more ${targetTone}`,
          'Enhance clarity and flow',
          'Optimize for engagement'
        ]);
      }
      
      // Mock grammar checking
      if (grammarCheckActive) {
        const issues = [
          { text: 'their', suggestion: 'there', position: Math.floor(Math.random() * text.length) },
          { text: 'its', suggestion: "it's", position: Math.floor(Math.random() * text.length) }
        ].filter(() => Math.random() > 0.7);
        
        setGrammarIssues(issues);
      }
      
    } catch (error) {
      console.error('AI Analysis error:', error);
      notificationSound.error();
    } finally {
      setIsAnalyzing(false);
    }
  }, [toneTarget, grammarCheckActive, notificationSound]);

  const handleVoiceToggle = () => {
    if (!voiceRecognition.isSupported) {
      notificationSound.error();
      return;
    }
    
    if (voiceRecognition.isListening) {
      recognitionRef.current?.stop();
      buttonSound.play();
    } else {
      recognitionRef.current?.start();
      buttonSound.play();
    }
  };

  const handleAISuggestionApply = (suggestion: string) => {
    // In real implementation, this would apply the AI suggestion to the text
    console.log('Applying AI suggestion:', suggestion);
    onAISuggestion?.(suggestion);
    buttonSound.play();
    notificationSound.success();
  };

  const handleTemplateApply = (template: any) => {
    onChange(template.content);
    setSelectedTemplate(template.id);
    setShowTemplateDialog(false);
    buttonSound.play();
    notificationSound.success();
  };

  const handleSaveDraft = () => {
    if (!value.trim()) return;
    
    const draft = {
      id: Date.now().toString(),
      content: value,
      timestamp: new Date()
    };
    
    setSavedDrafts(prev => [draft, ...prev.slice(0, 9)]); // Keep only 10 drafts
    localStorage.setItem('smartComposer_drafts', JSON.stringify([draft, ...savedDrafts.slice(0, 9)]));
    
    secondaryButtonSound.play();
    notificationSound.success();
  };

  // Load saved drafts
  useEffect(() => {
    const saved = localStorage.getItem('smartComposer_drafts');
    if (saved) {
      try {
        setSavedDrafts(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load drafts:', e);
      }
    }
  }, []);

  // Quill editor modules with enhanced toolbar
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'blockquote'],
      [{ 'align': [] }],
      ['clean']
    ]
  }), []);

  const getToneColor = (tone: string) => {
    const colors = {
      formal: theme.palette.primary.main,
      professional: theme.palette.info.main,
      friendly: theme.palette.success.main,
      casual: theme.palette.warning.main,
      urgent: theme.palette.error.main
    };
    return colors[tone as keyof typeof colors] || theme.palette.text.secondary;
  };

  const getToneLabel = (value: number) => {
    if (value < 20) return 'Casual';
    if (value < 40) return 'Friendly';
    if (value < 60) return 'Professional';
    if (value < 80) return 'Formal';
    return 'Urgent';
  };

  return (
    <>
      <SmartComposerContainer className={isAIActive ? 'ai-active' : ''}>
        <CardContent sx={{ p: 0 }}>
          {/* AI Control Header */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToyIcon 
                  sx={{ 
                    color: isAIActive ? theme.palette.secondary.main : theme.palette.text.secondary,
                    transition: 'color 0.3s ease'
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Smart Composer
                </Typography>
                <Badge 
                  badgeContent="AI" 
                  color="secondary" 
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      fontSize: '0.6rem',
                      minWidth: '18px',
                      height: '18px'
                    } 
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Voice Recognition Toggle */}
                <Tooltip title={voiceRecognition.isSupported ? "Voice Input" : "Voice not supported"}>
                  <IconButton
                    size="small"
                    onClick={handleVoiceToggle}
                    disabled={!voiceRecognition.isSupported}
                    sx={{
                      color: voiceRecognition.isListening ? theme.palette.error.main : 'text.secondary',
                      backgroundColor: voiceRecognition.isListening ? alpha(theme.palette.error.main, 0.1) : 'transparent',
                    }}
                  >
                    {voiceRecognition.isListening ? <VoiceIcon /> : <MicOffIcon />}
                  </IconButton>
                </Tooltip>
                
                {/* AI Assistant Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={isAIActive}
                      onChange={(e) => setIsAIActive(e.target.checked)}
                      size="small"
                      color="secondary"
                    />
                  }
                  label="AI Assist"
                  sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                
                {/* Advanced Settings */}
                <Tooltip title="Advanced Settings">
                  <IconButton
                    size="small"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    sx={{ color: showAdvanced ? theme.palette.primary.main : 'text.secondary' }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {/* Voice Recording Indicator */}
            {voiceRecognition.isListening && (
              <Fade in={voiceRecognition.isListening}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <VoiceIndicator>
                    <Box className="wave" />
                    <Box className="wave" />
                    <Box className="wave" />
                    <Box className="wave" />
                    <Box className="wave" />
                  </VoiceIndicator>
                  <Typography variant="caption" color="error">
                    Listening... (Confidence: {Math.round(voiceRecognition.confidence * 100)}%)
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>

          {/* Advanced AI Controls */}
          <Collapse in={showAdvanced}>
            <AIControlPanel>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                AI Composition Settings
              </Typography>
              
              <Stack spacing={2}>
                {/* Tone Adjustment */}
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Target Tone: {getToneLabel(toneTarget)}
                  </Typography>
                  <ToneSlider
                    value={toneTarget}
                    onChange={(_, value) => setToneTarget(value as number)}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => getToneLabel(value)}
                  />
                </Box>
                
                {/* Feature Toggles */}
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={autoCompleteActive}
                        onChange={(e) => setAutoCompleteActive(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Auto-complete"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={grammarCheckActive}
                        onChange={(e) => setGrammarCheckActive(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Grammar Check"
                  />
                </Stack>
                
                {/* Quick Actions */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    size="small"
                    startIcon={<ExtensionIcon />}
                    onClick={() => setShowTemplateDialog(true)}
                    variant="outlined"
                  >
                    Templates
                  </Button>
                  <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    variant="outlined"
                    disabled={!value.trim()}
                  >
                    Save Draft
                  </Button>
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => performAIAnalysis(value)}
                    variant="outlined"
                    disabled={!value.trim() || isAnalyzing}
                  >
                    Re-analyze
                  </Button>
                </Stack>
              </Stack>
            </AIControlPanel>
          </Collapse>

          {/* AI Analysis Results */}
          {isAIActive && aiAnalysis && (
            <Collapse in={true}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PsychologyIcon color="secondary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    AI Analysis
                  </Typography>
                  {isAnalyzing && <CircularProgress size={16} />}
                </Box>
                
                <Stack spacing={2}>
                  {/* Metrics */}
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={<MoodIcon />}
                      label={`Tone: ${aiAnalysis.tone}`}
                      size="small"
                      sx={{ backgroundColor: alpha(getToneColor(aiAnalysis.tone), 0.1) }}
                    />
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`Readability: ${aiAnalysis.readability}/10`}
                      size="small"
                      color={aiAnalysis.readability >= 7 ? 'success' : aiAnalysis.readability >= 5 ? 'warning' : 'error'}
                    />
                    <Chip
                      icon={<SpellCheckIcon />}
                      label={`Grammar: ${aiAnalysis.grammarScore.toFixed(1)}/10`}
                      size="small"
                      color={aiAnalysis.grammarScore >= 8 ? 'success' : 'warning'}
                    />
                    <Chip
                      icon={<TextFormatIcon />}
                      label={`${aiAnalysis.wordCount} words`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  
                  {/* Suggestions */}
                  {aiAnalysis.suggestions.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        AI Suggestions:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {aiAnalysis.suggestions.map((suggestion, index) => (
                          <SuggestionChip
                            key={index}
                            icon={<LightbulbIcon />}
                            label={suggestion}
                            size="small"
                            clickable
                            onClick={() => handleAISuggestionApply(suggestion)}
                            sx={{ animationDelay: `${index * 0.5}s` }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  {/* Grammar Issues */}
                  {grammarIssues.length > 0 && (
                    <Alert severity="warning" variant="outlined" sx={{ borderRadius: '8px' }}>
                      <Typography variant="caption" fontWeight={600}>
                        Grammar suggestions: {grammarIssues.length} issue(s) found
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </Box>
            </Collapse>
          )}

          {/* Rich Text Editor */}
          <Box sx={{ position: 'relative' }}>
            {isAnalyzing && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: theme.palette.secondary.main,
                  }
                }}
              />
            )}
            
            <Paper
              variant="outlined"
              sx={{
                minHeight: '300px',
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                borderRadius: 0,
                '& .ql-toolbar': {
                  borderColor: alpha(theme.palette.divider, 0.1),
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                },
                '& .ql-container': {
                  borderColor: alpha(theme.palette.divider, 0.1),
                  minHeight: '250px',
                  fontSize: '14px',
                },
                '& .ql-editor': {
                  padding: theme.spacing(2),
                  '&::before': {
                    content: `"${placeholder}"`,
                    color: theme.palette.text.secondary,
                    fontStyle: 'italic',
                  }
                }
              }}
            >
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                readOnly={disabled}
                style={{ height: '100%' }}
              />
            </Paper>
          </Box>
        </CardContent>
      </SmartComposerContainer>

      {/* Template Selection Dialog */}
      <Dialog
        open={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ExtensionIcon color="primary" />
            Smart Templates
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {templates.map((template) => (
              <Card
                key={template.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
                onClick={() => handleTemplateApply(template)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {template.name}
                    </Typography>
                    <Chip label={template.category} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tone: {template.tone}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {template.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplateDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SmartComposer;
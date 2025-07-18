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
  DialogActions,
  Tabs,
  Tab,
  Rating,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Language as LanguageIcon,
  SwapHoriz as SwapIcon,
  ContentCopy as CopyIcon,
  VolumeUp as SpeakIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Tune as TuneIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Palette as PaletteIcon,
  Public as PublicIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Check as ConfirmIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound, useButtonSound, useNotificationSound } from '../../hooks/useSound';

// Enhanced animations for translation interface
const translatePulse = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05) rotate(180deg);
    filter: brightness(1.2);
  }
`;

const languageSwitch = keyframes`
  0% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(10px) rotate(180deg); }
  100% { transform: translateX(0) rotate(360deg); }
`;

const qualityIndicator = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
`;

const culturalGlow = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const techTermHighlight = keyframes`
  0%, 100% {
    background-color: rgba(33, 150, 243, 0.1);
    border-color: rgba(33, 150, 243, 0.3);
  }
  50% {
    background-color: rgba(33, 150, 243, 0.2);
    border-color: rgba(33, 150, 243, 0.6);
  }
`;

// Styled components for translation interface
const TranslatorContainer = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  
  '&.translating': {
    border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: `linear-gradient(90deg, 
        ${theme.palette.secondary.main}, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main}
      )`,
      backgroundSize: '200% 100%',
      animation: `${culturalGlow} 2s ease-in-out infinite`,
    }
  }
}));

const LanguageCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  
  '&.selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  }
}));

const QualityBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  animation: `${qualityIndicator} 2s ease-in-out infinite`,
  
  '&.excellent': {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    color: theme.palette.success.main,
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
  },
  '&.good': {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    color: theme.palette.info.main,
    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
  },
  '&.fair': {
    backgroundColor: alpha(theme.palette.warning.main, 0.1),
    color: theme.palette.warning.main,
    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
  },
  '&.poor': {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    color: theme.palette.error.main,
    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
  }
}));

const TechTermChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.1),
  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
  borderRadius: '8px',
  animation: `${techTermHighlight} 3s ease-in-out infinite`,
  
  '& .MuiChip-icon': {
    color: theme.palette.info.main,
  }
}));

const CulturalToneSlider = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, 
    ${theme.palette.primary.main} 0%,
    ${theme.palette.secondary.main} 50%,
    ${theme.palette.primary.main} 100%
  )`,
  backgroundSize: '200% 200%',
  animation: `${culturalGlow} 4s ease-in-out infinite`,
  borderRadius: '12px',
  padding: '1px',
  
  '& .slider-content': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '11px',
    padding: theme.spacing(1),
  }
}));

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  family: string;
}

interface TranslationResult {
  text: string;
  confidence: number;
  detectedLanguage?: string;
  alternativeTranslations?: string[];
  culturalNotes?: string[];
  formalityLevel: 'very-formal' | 'formal' | 'neutral' | 'informal' | 'very-informal';
  preservedTerms: string[];
}

interface TranslationQuality {
  overall: number; // 0-100
  grammar: number;
  fluency: number;
  accuracy: number;
  culturalAppropriateness: number;
}

interface InstantTranslatorProps {
  sourceText: string;
  onTranslation?: (translation: string, language: string) => void;
  onLanguageDetect?: (language: string) => void;
  preserveTechnicalTerms?: boolean;
  culturalAdaptation?: boolean;
  showQualityIndicators?: boolean;
  defaultSourceLang?: string;
  defaultTargetLang?: string;
}

const TOP_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global', family: 'Germanic' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Global', family: 'Romance' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', region: 'Asia', family: 'Sino-Tibetan' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'South Asia', family: 'Indo-European' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', family: 'Semitic' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', region: 'Global', family: 'Romance' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'South Asia', family: 'Indo-European' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eastern Europe', family: 'Slavic' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'East Asia', family: 'Japonic' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Global', family: 'Romance' }
];

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

const InstantTranslator: React.FC<InstantTranslatorProps> = ({
  sourceText,
  onTranslation,
  onLanguageDetect,
  preserveTechnicalTerms = true,
  culturalAdaptation = true,
  showQualityIndicators = true,
  defaultSourceLang = 'auto',
  defaultTargetLang = 'es'
}) => {
  const theme = useTheme();
  const { themeMode, getCurrentTheme } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const secondaryButtonSound = useButtonSound('secondary');
  const notificationSound = useNotificationSound();
  
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [sourceLang, setSourceLang] = useState<string>(defaultSourceLang);
  const [targetLang, setTargetLang] = useState<string>(defaultTargetLang);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translationQuality, setTranslationQuality] = useState<TranslationQuality | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [culturalTone, setCulturalTone] = useState(50); // 0-100 scale
  const [formalityLevel, setFormalityLevel] = useState<'formal' | 'neutral' | 'informal'>('neutral');
  const [preserveTerms, setPreserveTerms] = useState(preserveTechnicalTerms);
  const [culturalAdapt, setCulturalAdapt] = useState(culturalAdaptation);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{
    id: string;
    source: string;
    target: string;
    sourceText: string;
    translatedText: string;
    timestamp: Date;
    quality: number;
  }>>([]);
  const [favoriteLanguagePairs, setFavoriteLanguagePairs] = useState<Array<{ source: string; target: string }>>([]);
  const [customTerms, setCustomTerms] = useState<Array<{ term: string; translation: string; language: string }>>([]);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [newTerm, setNewTerm] = useState({ term: '', translation: '', language: targetLang });
  
  // Refs
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Theme detection
  const currentThemeData = getCurrentTheme();
  const isLuxuryTheme = currentThemeData?.category === 'luxury' || 
                       currentThemeData?.category === 'beauty';

  // Auto-translate with debouncing
  useEffect(() => {
    if (!sourceText || sourceText.trim().length < 3) {
      setTranslatedText('');
      setTranslationResult(null);
      return;
    }
    
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }
    
    translationTimeoutRef.current = setTimeout(() => {
      performTranslation(sourceText);
    }, 1000);
    
    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang, culturalTone, formalityLevel, preserveTerms]);

  // Language detection
  useEffect(() => {
    if (sourceLang === 'auto' && sourceText && sourceText.trim().length > 10) {
      detectLanguage(sourceText);
    }
  }, [sourceText, sourceLang]);

  const detectLanguage = useCallback(async (text: string) => {
    try {
      // Simulate language detection - in real implementation, use translation service
      const commonLanguages = ['en', 'es', 'zh', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko'];
      const detected = commonLanguages[Math.floor(Math.random() * commonLanguages.length)];
      
      setDetectedLanguage(detected);
      onLanguageDetect?.(detected);
      
    } catch (error) {
      console.error('Language detection error:', error);
    }
  }, [onLanguageDetect]);

  const performTranslation = useCallback(async (text: string) => {
    if (!text.trim() || sourceLang === targetLang) return;
    
    setIsTranslating(true);
    
    try {
      // Simulate translation with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock translation result
      const mockTranslation = `[${targetLang.toUpperCase()}] ${text} (translated with ${formalityLevel} tone)`;
      
      // Apply custom terms preservation
      let finalTranslation = mockTranslation;
      if (preserveTerms) {
        const relevantTerms = customTerms.filter(term => 
          text.toLowerCase().includes(term.term.toLowerCase()) && 
          term.language === targetLang
        );
        
        relevantTerms.forEach(term => {
          const regex = new RegExp(term.term, 'gi');
          finalTranslation = finalTranslation.replace(regex, term.translation);
        });
      }
      
      // Mock quality assessment
      const quality: TranslationQuality = {
        overall: 85 + Math.random() * 15,
        grammar: 80 + Math.random() * 20,
        fluency: 85 + Math.random() * 15,
        accuracy: 90 + Math.random() * 10,
        culturalAppropriateness: culturalAdapt ? 85 + Math.random() * 15 : 70 + Math.random() * 20
      };
      
      const result: TranslationResult = {
        text: finalTranslation,
        confidence: quality.overall / 100,
        detectedLanguage: sourceLang === 'auto' ? detectedLanguage : sourceLang,
        alternativeTranslations: [
          `${finalTranslation} (alternative 1)`,
          `${finalTranslation} (alternative 2)`
        ],
        culturalNotes: culturalAdapt ? [
          'Adjusted for local business customs',
          'Used appropriate level of formality',
          'Preserved cultural context'
        ] : [],
        formalityLevel: formalityLevel as any,
        preservedTerms: preserveTerms ? ['technical term 1', 'technical term 2'] : []
      };
      
      setTranslatedText(finalTranslation);
      setTranslationResult(result);
      setTranslationQuality(quality);
      
      // Add to history
      const historyEntry = {
        id: Date.now().toString(),
        source: sourceLang,
        target: targetLang,
        sourceText: text,
        translatedText: finalTranslation,
        timestamp: new Date(),
        quality: quality.overall
      };
      
      setTranslationHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
      
      onTranslation?.(finalTranslation, targetLang);
      notificationSound.success();
      
    } catch (error) {
      console.error('Translation error:', error);
      notificationSound.error();
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLang, targetLang, formalityLevel, culturalAdapt, preserveTerms, customTerms, detectedLanguage, onTranslation, notificationSound]);

  const handleLanguageSwap = () => {
    if (sourceLang === 'auto') return;
    
    const newSourceLang = targetLang;
    const newTargetLang = sourceLang;
    
    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);
    
    // Swap texts
    if (translatedText) {
      // In real implementation, you'd set the translated text as source
      // and retranslate. For demo, we'll just swap the languages.
    }
    
    buttonSound.play();
  };

  const handleCopyTranslation = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      notificationSound.success();
    } catch (error) {
      console.error('Copy failed:', error);
      notificationSound.error();
    }
  };

  const handleSpeakTranslation = () => {
    if (!translatedText || !('speechSynthesis' in window)) {
      notificationSound.error();
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang === 'zh' ? 'zh-CN' : targetLang;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    speechSynthesis.speak(utterance);
    buttonSound.play();
  };

  const handleAddCustomTerm = () => {
    if (!newTerm.term || !newTerm.translation) return;
    
    const term = {
      ...newTerm,
      language: targetLang
    };
    
    setCustomTerms(prev => [...prev.filter(t => 
      t.term !== term.term || t.language !== term.language
    ), term]);
    
    setNewTerm({ term: '', translation: '', language: targetLang });
    setShowTermsDialog(false);
    
    notificationSound.success();
  };

  const getQualityLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', class: 'excellent' };
    if (score >= 75) return { label: 'Good', class: 'good' };
    if (score >= 60) return { label: 'Fair', class: 'fair' };
    return { label: 'Poor', class: 'poor' };
  };

  const getFormalityIcon = (level: string) => {
    switch (level) {
      case 'formal': return <BusinessIcon />;
      case 'neutral': return <PersonIcon />;
      case 'informal': return <GroupIcon />;
      default: return <PersonIcon />;
    }
  };

  const getLanguageByCode = (code: string) => {
    return TOP_LANGUAGES.find(lang => lang.code === code) || null;
  };

  return (
    <>
      <TranslatorContainer className={isTranslating ? 'translating' : ''}>
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TranslateIcon 
                  sx={{ 
                    color: isTranslating ? theme.palette.secondary.main : theme.palette.primary.main,
                    animation: isTranslating ? `${translatePulse} 2s ease-in-out infinite` : 'none'
                  }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Instant Translator
                </Typography>
                <Badge 
                  badgeContent={TOP_LANGUAGES.length} 
                  color="primary" 
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
                {/* Quality Indicator */}
                {showQualityIndicators && translationQuality && (
                  <QualityBadge className={getQualityLabel(translationQuality.overall).class}>
                    <StarIcon sx={{ fontSize: '0.75rem' }} />
                    {getQualityLabel(translationQuality.overall).label}
                  </QualityBadge>
                )}
                
                {/* Advanced Settings Toggle */}
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
            
            {/* Language Selection */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              {/* Source Language */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>From</InputLabel>
                <Select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  label="From"
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="auto">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoAwesomeIcon fontSize="small" />
                      Auto-detect
                    </Box>
                  </MenuItem>
                  {TOP_LANGUAGES.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{lang.flag}</span>
                        {lang.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Swap Button */}
              <Tooltip title="Swap Languages">
                <IconButton
                  onClick={handleLanguageSwap}
                  disabled={sourceLang === 'auto'}
                  sx={{
                    color: theme.palette.primary.main,
                    animation: `${languageSwitch} 0.5s ease-in-out`,
                    '&:hover': {
                      animation: `${languageSwitch} 0.5s ease-in-out infinite`,
                    }
                  }}
                >
                  <SwapIcon />
                </IconButton>
              </Tooltip>
              
              {/* Target Language */}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>To</InputLabel>
                <Select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  label="To"
                  sx={{ borderRadius: '12px' }}
                >
                  {TOP_LANGUAGES.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{lang.flag}</span>
                        {lang.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Detected Language */}
            {sourceLang === 'auto' && detectedLanguage && (
              <Fade in={true}>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={<PsychologyIcon />}
                    label={`Detected: ${getLanguageByCode(detectedLanguage)?.name || detectedLanguage}`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Fade>
            )}
          </Box>

          {/* Advanced Settings */}
          <Collapse in={showAdvanced}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Translation Settings
              </Typography>
              
              <Stack spacing={2}>
                {/* Formality Level */}
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Formality Level
                  </Typography>
                  <ButtonGroup size="small" fullWidth>
                    {[
                      { value: 'formal', label: 'Formal', icon: <BusinessIcon /> },
                      { value: 'neutral', label: 'Neutral', icon: <PersonIcon /> },
                      { value: 'informal', label: 'Casual', icon: <GroupIcon /> }
                    ].map(option => (
                      <Button
                        key={option.value}
                        variant={formalityLevel === option.value ? 'contained' : 'outlined'}
                        startIcon={option.icon}
                        onClick={() => setFormalityLevel(option.value as any)}
                        sx={{ borderRadius: '8px' }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>
                
                {/* Feature Toggles */}
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={preserveTerms}
                        onChange={(e) => setPreserveTerms(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Preserve Technical Terms"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={culturalAdapt}
                        onChange={(e) => setCulturalAdapt(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Cultural Adaptation"
                  />
                </Stack>
                
                {/* Quick Actions */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    size="small"
                    startIcon={<SchoolIcon />}
                    onClick={() => setShowTermsDialog(true)}
                    variant="outlined"
                  >
                    Custom Terms
                  </Button>
                  <Button
                    size="small"
                    startIcon={<BookmarkBorderIcon />}
                    variant="outlined"
                  >
                    Save Pair
                  </Button>
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => performTranslation(sourceText)}
                    variant="outlined"
                    disabled={!sourceText.trim() || isTranslating}
                  >
                    Re-translate
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Translation Interface */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '300px' }}>
            {/* Source Text */}
            <Box sx={{ flex: 1, p: 2, borderRight: { md: `1px solid ${alpha(theme.palette.divider, 0.1)}` } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Source Text
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {sourceLang !== 'auto' && getLanguageByCode(sourceLang) && (
                    <Chip
                      label={getLanguageByCode(sourceLang)!.flag}
                      size="small"
                      sx={{ minWidth: 'auto', '& .MuiChip-label': { px: 0.5 } }}
                    />
                  )}
                </Box>
              </Box>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minHeight: '200px',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  borderRadius: '12px',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {sourceText || 'Enter text to translate...'}
                </Typography>
              </Paper>
            </Box>
            
            {/* Translated Text */}
            <Box sx={{ flex: 1, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Translation
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getLanguageByCode(targetLang) && (
                    <Chip
                      label={getLanguageByCode(targetLang)!.flag}
                      size="small"
                      sx={{ minWidth: 'auto', '& .MuiChip-label': { px: 0.5 } }}
                    />
                  )}
                  
                  {/* Action Buttons */}
                  <Tooltip title="Copy Translation">
                    <IconButton
                      size="small"
                      onClick={handleCopyTranslation}
                      disabled={!translatedText}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Speak Translation">
                    <IconButton
                      size="small"
                      onClick={handleSpeakTranslation}
                      disabled={!translatedText || !('speechSynthesis' in window)}
                    >
                      <SpeakIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  minHeight: '200px',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  borderRadius: '12px',
                  position: 'relative',
                }}
              >
                {isTranslating && (
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CircularProgress size={16} color="secondary" />
                  </Box>
                )}
                
                <Typography variant="body2">
                  {translatedText || (isTranslating ? 'Translating...' : 'Translation will appear here')}
                </Typography>
                
                {/* Translation Quality Metrics */}
                {translationQuality && showQualityIndicators && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Quality Metrics:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<CheckIcon />}
                        label={`Grammar: ${translationQuality.grammar.toFixed(0)}%`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={`Fluency: ${translationQuality.fluency.toFixed(0)}%`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<StarIcon />}
                        label={`Accuracy: ${translationQuality.accuracy.toFixed(0)}%`}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                )}
                
                {/* Cultural Notes */}
                {translationResult?.culturalNotes && translationResult.culturalNotes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Cultural Adaptations:
                    </Typography>
                    {translationResult.culturalNotes.map((note, index) => (
                      <Alert 
                        key={index}
                        severity="info" 
                        variant="outlined" 
                        sx={{ mt: 0.5, borderRadius: '8px' }}
                      >
                        <Typography variant="caption">{note}</Typography>
                      </Alert>
                    ))}
                  </Box>
                )}
                
                {/* Preserved Technical Terms */}
                {translationResult?.preservedTerms && translationResult.preservedTerms.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Preserved Terms:
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {translationResult.preservedTerms.map((term, index) => (
                        <TechTermChip
                          key={index}
                          icon={<SchoolIcon />}
                          label={term}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </TranslatorContainer>

      {/* Custom Terms Dialog */}
      <Dialog
        open={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        maxWidth="sm"
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
            <SchoolIcon color="primary" />
            Custom Technical Terms
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Original Term"
              value={newTerm.term}
              onChange={(e) => setNewTerm(prev => ({ ...prev, term: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Translation"
              value={newTerm.translation}
              onChange={(e) => setNewTerm(prev => ({ ...prev, translation: e.target.value }))}
              fullWidth
              size="small"
            />
            
            {/* Existing Custom Terms */}
            {customTerms.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Saved Terms:
                </Typography>
                <Stack spacing={1}>
                  {customTerms.map((term, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {term.term} → {term.translation}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getLanguageByCode(term.language)?.name}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => setCustomTerms(prev => prev.filter((_, i) => i !== index))}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTermsDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCustomTerm}
            variant="contained"
            disabled={!newTerm.term || !newTerm.translation}
          >
            Add Term
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstantTranslator;
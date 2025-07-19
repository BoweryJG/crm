import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  Autocomplete,
  Stack,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  CircularProgress,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Rating,
  Tab,
  Tabs,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Language as LanguageIcon,
  Public as PublicIcon,
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Translate as TranslateIcon,
  School as SchoolIcon,
  LocalDining as LocalDiningIcon,
  Handshake as HandshakeIcon,
  Forum as ForumIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  SmartToy as SmartToyIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Map as MapIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { supabase } from '../../services/supabase/supabase';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound, useButtonSound, useNotificationSound } from '../../hooks/useSound';

// Enhanced animations for cultural guidance
const culturalGlow = keyframes`
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

const insightFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
    opacity: 1;
  }
`;

const templateShimmer = keyframes`
  0% { 
    background-position: -200px 0; 
  }
  100% { 
    background-position: calc(200px + 100%) 0; 
  }
`;

// Styled components
const CulturalContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  animation: `${culturalGlow} 4s ease-in-out infinite`,
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, 
      ${theme.palette.success.main}, 
      ${theme.palette.info.main}, 
      ${theme.palette.success.main}
    )`,
    backgroundSize: '200% 100%',
    animation: `${culturalGlow} 3s ease-in-out infinite`,
  }
}));

const CulturalInsight = styled(Card)(({ theme, priority }: { theme: any; priority: 'high' | 'medium' | 'low' }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(
    priority === 'high' ? theme.palette.error.main :
    priority === 'medium' ? theme.palette.warning.main :
    theme.palette.info.main, 0.2
  )}`,
  borderRadius: '12px',
  animation: `${insightFloat} 4s ease-in-out infinite`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const TemplateCard = styled(Card)(({ theme, featured }: { theme: any; featured: boolean }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  border: `2px solid ${featured ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    border: `2px solid ${theme.palette.primary.main}`,
  },
  
  ...(featured && {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(90deg, 
        transparent, 
        ${alpha(theme.palette.primary.main, 0.1)}, 
        transparent
      )`,
      backgroundSize: '200px 100%',
      animation: `${templateShimmer} 2s infinite`,
    }
  })
}));

const EtiquetteChip = styled(Chip)(({ theme, severity }: { theme: any; severity: 'error' | 'warning' | 'info' | 'success' }) => ({
  backgroundColor: alpha(theme.palette[severity].main, 0.1),
  border: `1px solid ${alpha(theme.palette[severity].main, 0.2)}`,
  borderRadius: '16px',
  
  '& .MuiChip-icon': {
    color: theme.palette[severity].main,
  },
  
  '& .MuiChip-label': {
    color: theme.palette[severity].main,
    fontWeight: 500,
  }
}));

interface CulturalGuidance {
  region: string;
  country: string;
  language: string;
  formalityLevel: 'very-formal' | 'formal' | 'moderate' | 'casual';
  greetings: {
    formal: string;
    informal: string;
    timeSpecific: Record<string, string>;
  };
  businessEtiquette: {
    meetingStyle: string;
    decisionMaking: string;
    timeOrientation: 'monochronic' | 'polychronic';
    hierarchyLevel: 'high' | 'medium' | 'low';
    directness: 'very-direct' | 'direct' | 'indirect' | 'very-indirect';
  };
  communicationStyle: {
    preferredTone: string;
    avoidTopics: string[];
    preferredTopics: string[];
    taboos: string[];
  };
  timeZone: string;
  businessHours: {
    start: string;
    end: string;
    breakTime?: string;
    preferredDays: string[];
  };
  culturalNotes: string[];
  emailStructure: {
    opening: string;
    body: string;
    closing: string;
  };
}

interface RegionalTemplate {
  id: string;
  name: string;
  region: string;
  language: string;
  category: 'introduction' | 'follow-up' | 'proposal' | 'thank-you' | 'scheduling';
  formalityLevel: string;
  subject: string;
  content: string;
  culturalNotes: string[];
  whenToUse: string;
  adaptations: Record<string, string>;
  featured?: boolean;
}

interface CulturalAdvisorProps {
  recipientRegion?: string;
  recipientLanguage?: string;
  emailContext?: 'cold-outreach' | 'follow-up' | 'proposal' | 'meeting' | 'thank-you';
  onTemplateSelect?: (template: RegionalTemplate) => void;
  onGuidanceUpdate?: (guidance: CulturalGuidance) => void;
  autoDetectCulture?: boolean;
  showAdvancedGuidance?: boolean;
}

const CulturalAdvisor: React.FC<CulturalAdvisorProps> = ({
  recipientRegion = '',
  recipientLanguage = 'English',
  emailContext = 'cold-outreach',
  onTemplateSelect,
  onGuidanceUpdate,
  autoDetectCulture = true,
  showAdvancedGuidance = true
}) => {
  const theme = useTheme();
  const { getCurrentTheme } = useThemeContext();
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const notificationSound = useNotificationSound();
  
  // State management
  const [selectedRegion, setSelectedRegion] = useState(recipientRegion);
  const [selectedLanguage, setSelectedLanguage] = useState(recipientLanguage);
  const [culturalGuidance, setCulturalGuidance] = useState<CulturalGuidance | null>(null);
  const [regionalTemplates, setRegionalTemplates] = useState<RegionalTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<RegionalTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [savedTemplates, setSavedTemplates] = useState<Set<string>>(new Set());
  const [customTemplate, setCustomTemplate] = useState('');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [culturalInsights, setCulturalInsights] = useState<Array<{
    id: string;
    type: 'etiquette' | 'timing' | 'language' | 'business';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action?: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  }>>([]);

  // Available regions and languages
  const regions = [
    'North America', 'Europe', 'Asia-Pacific', 'Latin America', 
    'Middle East', 'Africa', 'Nordic', 'Mediterranean'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
    'Spain', 'Italy', 'Japan', 'South Korea', 'China', 'Brazil',
    'Mexico', 'Australia', 'Netherlands', 'Sweden', 'Denmark', 'Norway'
  ];

  // Load cultural guidance
  const loadCulturalGuidance = useCallback(async (region: string, language: string) => {
    if (!region || !language) return;

    setLoading(true);
    try {
      // Simulate API call - replace with real cultural database service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const guidance = await generateCulturalGuidance(region, language);
      setCulturalGuidance(guidance);
      onGuidanceUpdate?.(guidance);

      // Generate cultural insights
      const insights = generateCulturalInsights(guidance);
      setCulturalInsights(insights);

      notificationSound.success();
    } catch (error) {
      console.error('Error loading cultural guidance:', error);
      notificationSound.error();
    } finally {
      setLoading(false);
    }
  }, [onGuidanceUpdate, notificationSound]);

  // Load regional templates
  const loadRegionalTemplates = useCallback(async (region: string, language: string, context: string) => {
    setLoading(true);
    try {
      // Check Supabase for saved templates first
      const { data: savedData } = await supabase
        .from('cultural_email_templates')
        .select('*')
        .eq('region', region)
        .eq('language', language)
        .eq('category', context);

      // Generate default templates if none exist
      const templates = savedData?.length ? 
        savedData.map(formatSupabaseTemplate) :
        await generateRegionalTemplates(region, language, context);

      setRegionalTemplates(templates);
      setFilteredTemplates(templates);

    } catch (error) {
      console.error('Error loading templates:', error);
      const fallbackTemplates = await generateRegionalTemplates(region, language, context);
      setRegionalTemplates(fallbackTemplates);
      setFilteredTemplates(fallbackTemplates);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate mock cultural guidance
  const generateCulturalGuidance = async (region: string, language: string): Promise<CulturalGuidance> => {
    const guidanceMap: Record<string, Partial<CulturalGuidance>> = {
      'North America': {
        formalityLevel: 'moderate',
        businessEtiquette: {
          meetingStyle: 'Direct and time-efficient',
          decisionMaking: 'Collaborative with quick decisions',
          timeOrientation: 'monochronic',
          hierarchyLevel: 'medium',
          directness: 'direct'
        },
        communicationStyle: {
          preferredTone: 'Professional yet approachable',
          avoidTopics: ['Personal finances', 'Politics', 'Religion'],
          preferredTopics: ['Business efficiency', 'Innovation', 'Results'],
          taboos: ['Excessive formality', 'Long introductions']
        },
        timeZone: 'EST/PST',
        businessHours: {
          start: '9:00 AM',
          end: '5:00 PM',
          preferredDays: ['Tuesday', 'Wednesday', 'Thursday']
        }
      },
      'Europe': {
        formalityLevel: 'formal',
        businessEtiquette: {
          meetingStyle: 'Structured and formal',
          decisionMaking: 'Consensus-based and thorough',
          timeOrientation: 'monochronic',
          hierarchyLevel: 'high',
          directness: 'indirect'
        },
        communicationStyle: {
          preferredTone: 'Respectful and professional',
          avoidTopics: ['Personal life', 'Salary', 'American comparisons'],
          preferredTopics: ['Quality', 'Tradition', 'Long-term partnerships'],
          taboos: ['Being too casual', 'Rushing decisions']
        },
        timeZone: 'CET',
        businessHours: {
          start: '8:00 AM',
          end: '6:00 PM',
          breakTime: '12:00-1:00 PM',
          preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday']
        }
      },
      'Asia-Pacific': {
        formalityLevel: 'very-formal',
        businessEtiquette: {
          meetingStyle: 'Hierarchical and respectful',
          decisionMaking: 'Top-down with group harmony',
          timeOrientation: 'polychronic',
          hierarchyLevel: 'high',
          directness: 'very-indirect'
        },
        communicationStyle: {
          preferredTone: 'Highly respectful and humble',
          avoidTopics: ['Individual achievements', 'Direct criticism', 'Conflict'],
          preferredTopics: ['Mutual benefit', 'Long-term relationships', 'Respect'],
          taboos: ['Causing loss of face', 'Being too direct', 'Impatience']
        },
        timeZone: 'JST/KST/CST',
        businessHours: {
          start: '9:00 AM',
          end: '7:00 PM',
          preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      }
    };

    const baseGuidance = guidanceMap[region] || guidanceMap['North America'];

    return {
      region,
      country: region === 'North America' ? 'United States' : 
               region === 'Europe' ? 'Germany' : 
               region === 'Asia-Pacific' ? 'Japan' : 'United States',
      language,
      formalityLevel: baseGuidance.formalityLevel || 'moderate',
      greetings: {
        formal: language === 'Spanish' ? 'Estimado/a' : 
                language === 'French' ? 'Cher/Chère' :
                language === 'German' ? 'Sehr geehrte/r' : 'Dear',
        informal: language === 'Spanish' ? 'Hola' : 
                 language === 'French' ? 'Bonjour' :
                 language === 'German' ? 'Hallo' : 'Hello',
        timeSpecific: {
          morning: language === 'Spanish' ? 'Buenos días' : 
                  language === 'French' ? 'Bonjour' :
                  language === 'German' ? 'Guten Morgen' : 'Good morning',
          afternoon: language === 'Spanish' ? 'Buenas tardes' : 
                    language === 'French' ? 'Bon après-midi' :
                    language === 'German' ? 'Guten Tag' : 'Good afternoon',
          evening: language === 'Spanish' ? 'Buenas noches' : 
                  language === 'French' ? 'Bonsoir' :
                  language === 'German' ? 'Guten Abend' : 'Good evening'
        }
      },
      businessEtiquette: baseGuidance.businessEtiquette!,
      communicationStyle: baseGuidance.communicationStyle!,
      timeZone: baseGuidance.timeZone!,
      businessHours: baseGuidance.businessHours!,
      culturalNotes: [
        `${region} professionals value ${baseGuidance.businessEtiquette?.decisionMaking?.toLowerCase()}`,
        `Communication tends to be ${baseGuidance.businessEtiquette?.directness}`,
        `Time orientation is ${baseGuidance.businessEtiquette?.timeOrientation}`,
        `Hierarchy level is ${baseGuidance.businessEtiquette?.hierarchyLevel}`
      ],
      emailStructure: {
        opening: baseGuidance.formalityLevel === 'very-formal' ? 'Very formal with titles and full names' :
                baseGuidance.formalityLevel === 'formal' ? 'Formal with proper titles' :
                'Professional but approachable',
        body: baseGuidance.businessEtiquette?.directness === 'direct' ? 'Clear and concise' :
              'Detailed with context and relationship building',
        closing: baseGuidance.formalityLevel === 'very-formal' ? 'Very formal with honorifics' :
                'Professional and warm'
      }
    };
  };

  // Generate cultural insights
  const generateCulturalInsights = (guidance: CulturalGuidance) => {
    const insights = [
      {
        id: 'formality',
        type: 'etiquette' as const,
        priority: guidance.formalityLevel === 'very-formal' ? 'high' as const : 'medium' as const,
        title: 'Formality Level',
        description: `This region prefers ${guidance.formalityLevel} communication`,
        action: guidance.formalityLevel === 'very-formal' ? 'Use titles and honorifics' : 'Maintain professional tone',
        severity: guidance.formalityLevel === 'very-formal' ? 'warning' as const : 'info' as const
      },
      {
        id: 'timing',
        type: 'timing' as const,
        priority: 'medium' as const,
        title: 'Optimal Timing',
        description: `Business hours: ${guidance.businessHours.start} - ${guidance.businessHours.end}`,
        action: `Schedule emails for ${guidance.businessHours.preferredDays.join(', ')}`,
        severity: 'info' as const
      },
      {
        id: 'directness',
        type: 'business' as const,
        priority: guidance.businessEtiquette.directness === 'very-indirect' ? 'high' as const : 'medium' as const,
        title: 'Communication Style',
        description: `Preferred style is ${guidance.businessEtiquette.directness}`,
        action: guidance.businessEtiquette.directness.includes('indirect') ? 
                'Build context before main points' : 'Be clear and concise',
        severity: guidance.businessEtiquette.directness === 'very-indirect' ? 'warning' as const : 'success' as const
      }
    ];

    // Add taboo warnings
    if (guidance.communicationStyle.taboos.length > 0) {
      insights.push({
        id: 'taboos',
        type: 'etiquette' as const,
        priority: 'high' as const,
        title: 'Cultural Taboos',
        description: `Avoid: ${guidance.communicationStyle.taboos.join(', ')}`,
        action: 'Review content for cultural sensitivity',
        severity: 'error' as const
      });
    }

    return insights;
  };

  // Generate regional templates
  const generateRegionalTemplates = async (region: string, language: string, context: string): Promise<RegionalTemplate[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const templates: RegionalTemplate[] = [
      {
        id: '1',
        name: 'Professional Introduction',
        region,
        language,
        category: 'introduction',
        formalityLevel: 'formal',
        subject: language === 'Spanish' ? 'Presentación de [Su Empresa]' :
                language === 'French' ? 'Présentation de [Votre Entreprise]' :
                'Introduction from [Your Company]',
        content: `${culturalGuidance?.greetings.formal} [Name],

I hope this message finds you well. I am writing to introduce myself and explore potential collaboration opportunities between our organizations.

[Your introduction and value proposition]

I would welcome the opportunity to discuss how we might work together to achieve mutual success.

Best regards,
[Your Name]`,
        culturalNotes: [
          'Formal greeting appropriate for initial contact',
          'Emphasizes mutual benefit and collaboration',
          'Respectful tone throughout'
        ],
        whenToUse: 'First contact with new prospects',
        adaptations: {
          'very-formal': 'Add more honorifics and titles',
          'casual': 'Simplify language and use more direct approach'
        },
        featured: true
      },
      {
        id: '2',
        name: 'Follow-up Meeting Request',
        region,
        language,
        category: 'follow-up',
        formalityLevel: 'moderate',
        subject: 'Following up on our conversation',
        content: `Hello [Name],

Thank you for taking the time to speak with me yesterday. I found our discussion about [topic] very insightful.

As discussed, I would like to schedule a follow-up meeting to explore [specific topic] in more detail.

Would you be available for a 30-minute call next week? I'm flexible with timing to accommodate your schedule.

Looking forward to our continued conversation.

Best regards,
[Your Name]`,
        culturalNotes: [
          'References previous conversation',
          'Shows flexibility and respect for their time',
          'Clear call-to-action'
        ],
        whenToUse: 'After initial meeting or conversation',
        adaptations: {
          'formal': 'Add more structure and formality',
          'casual': 'More conversational tone'
        }
      },
      {
        id: '3',
        name: 'Thank You Note',
        region,
        language,
        category: 'thank-you',
        formalityLevel: 'moderate',
        subject: 'Thank you for your time',
        content: `Dear [Name],

I wanted to take a moment to thank you for the time you spent with me today. Your insights into [specific topic] were invaluable.

The information you shared about [specific detail] will be particularly helpful as we move forward.

I look forward to staying in touch and hope we can continue our collaboration.

With appreciation,
[Your Name]`,
        culturalNotes: [
          'Expresses genuine gratitude',
          'References specific conversation points',
          'Maintains relationship focus'
        ],
        whenToUse: 'After meetings, presentations, or helpful interactions',
        adaptations: {
          'very-formal': 'More elaborate expressions of gratitude',
          'casual': 'Shorter and more direct thanks'
        }
      }
    ];

    return templates.filter(t => !context || t.category === context);
  };

  // Format Supabase template data
  const formatSupabaseTemplate = (data: any): RegionalTemplate => ({
    id: data.id,
    name: data.name,
    region: data.region,
    language: data.language,
    category: data.category,
    formalityLevel: data.formality_level,
    subject: data.subject,
    content: data.content,
    culturalNotes: data.cultural_notes || [],
    whenToUse: data.when_to_use || '',
    adaptations: data.adaptations || {},
    featured: data.featured || false
  });

  // Handle region/language changes
  useEffect(() => {
    if (selectedRegion && selectedLanguage) {
      loadCulturalGuidance(selectedRegion, selectedLanguage);
      loadRegionalTemplates(selectedRegion, selectedLanguage, emailContext);
    }
  }, [selectedRegion, selectedLanguage, emailContext, loadCulturalGuidance, loadRegionalTemplates]);

  // Handle template selection
  const handleTemplateSelect = (template: RegionalTemplate) => {
    onTemplateSelect?.(template);
    buttonSound.play();
    notificationSound.success();
  };

  // Save template to favorites
  const handleSaveTemplate = async (templateId: string) => {
    try {
      const template = regionalTemplates.find(t => t.id === templateId);
      if (!template) return;

      await supabase
        .from('saved_email_templates')
        .insert({
          template_id: templateId,
          name: template.name,
          content: template.content,
          region: template.region,
          language: template.language,
          user_id: 'current-user-id' // Replace with actual user ID
        });

      setSavedTemplates(prev => new Set([...prev, templateId]));
      notificationSound.success();
    } catch (error) {
      console.error('Error saving template:', error);
      notificationSound.error();
    }
  };

  const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'etiquette': return <HandshakeIcon />;
      case 'timing': return <AccessTimeIcon />;
      case 'language': return <TranslateIcon />;
      case 'business': return <BusinessIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <CulturalContainer elevation={3}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PublicIcon color="success" />
            <Typography variant="h6" fontWeight={600}>
              Cultural Advisor
            </Typography>
            <Badge 
              badgeContent="AI" 
              color="success"
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '0.6rem',
                  minWidth: '18px',
                  height: '18px'
                } 
              }}
            />
            {analyzing && <CircularProgress size={20} />}
          </Box>
          
          <Tooltip title="Refresh Cultural Data">
            <IconButton
              size="small"
              onClick={() => loadCulturalGuidance(selectedRegion, selectedLanguage)}
              disabled={!selectedRegion || !selectedLanguage || loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Region and Language Selection */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={selectedRegion}
              onChange={(_, value) => setSelectedRegion(value || '')}
              options={regions}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Region/Culture" 
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <MapIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={selectedLanguage}
              onChange={(_, value) => setSelectedLanguage(value || 'English')}
              options={languages}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Language" 
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              )}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Content Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Templates" icon={<ForumIcon />} />
          <Tab label="Cultural Insights" icon={<PsychologyIcon />} />
          <Tab label="Business Etiquette" icon={<HandshakeIcon />} />
        </Tabs>
      </Box>

      {/* Templates Tab */}
      <TabPanel value={activeTab} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTemplates.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            No templates available for the selected region and language.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                featured={template.featured || false}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {template.name}
                        {template.featured && (
                          <StarIcon sx={{ ml: 1, color: 'warning.main', fontSize: '1rem' }} />
                        )}
                      </Typography>
                      <Stack direction="row" spacing={1} mb={1}>
                        <Chip label={template.category} size="small" color="primary" />
                        <Chip label={template.formalityLevel} size="small" variant="outlined" />
                        <Chip label={template.language} size="small" color="secondary" />
                      </Stack>
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveTemplate(template.id);
                      }}
                      color={savedTemplates.has(template.id) ? 'primary' : 'default'}
                    >
                      {savedTemplates.has(template.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Subject: {template.subject}
                  </Typography>

                  <Box sx={{ 
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: '8px',
                    p: 2,
                    mb: 2,
                    maxHeight: '150px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {template.content.substring(0, 200)}...
                    </Typography>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30px',
                      background: `linear-gradient(transparent, ${alpha(theme.palette.background.default, 0.8)})`
                    }} />
                  </Box>

                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    When to use: {template.whenToUse}
                  </Typography>

                  {template.culturalNotes.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" gutterBottom>
                        Cultural Notes:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {template.culturalNotes.slice(0, 2).map((note, index) => (
                          <EtiquetteChip
                            key={index}
                            icon={<LightbulbIcon />}
                            label={note}
                            size="small"
                            severity="info"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </TemplateCard>
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* Cultural Insights Tab */}
      <TabPanel value={activeTab} index={1}>
        {culturalInsights.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            Select a region and language to see cultural insights.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {culturalInsights.map((insight) => (
              <CulturalInsight key={insight.id} priority={insight.priority}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      p: 1, 
                      borderRadius: '8px', 
                      backgroundColor: alpha(theme.palette[insight.severity].main, 0.1) 
                    }}>
                      {getInsightIcon(insight.type)}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {insight.title}
                        </Typography>
                        <EtiquetteChip 
                          label={insight.priority} 
                          size="small" 
                          severity={insight.severity}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {insight.description}
                      </Typography>
                      
                      {insight.action && (
                        <Alert severity={insight.severity} variant="outlined" sx={{ mt: 1 }}>
                          <Typography variant="caption" fontWeight={500}>
                            Action: {insight.action}
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </CulturalInsight>
            ))}
          </Stack>
        )}
      </TabPanel>

      {/* Business Etiquette Tab */}
      <TabPanel value={activeTab} index={2}>
        {culturalGuidance ? (
          <Stack spacing={3}>
            {/* Communication Style */}
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Communication Style
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Preferred Tone
                    </Typography>
                    <Typography variant="body2">
                      {culturalGuidance.communicationStyle.preferredTone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Directness Level
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {culturalGuidance.businessEtiquette.directness.replace('-', ' ')}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Preferred Topics
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {culturalGuidance.communicationStyle.preferredTopics.map((topic, index) => (
                      <Chip key={index} label={topic} size="small" color="success" />
                    ))}
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Topics to Avoid
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {culturalGuidance.communicationStyle.avoidTopics.map((topic, index) => (
                      <Chip key={index} label={topic} size="small" color="error" />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Business Hours & Timing */}
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Optimal Timing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2">
                        Business Hours
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {culturalGuidance.businessHours.start} - {culturalGuidance.businessHours.end}
                    </Typography>
                    {culturalGuidance.businessHours.breakTime && (
                      <Typography variant="caption" color="text.secondary">
                        Break: {culturalGuidance.businessHours.breakTime}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2">
                        Best Days
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {culturalGuidance.businessHours.preferredDays.join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Cultural Notes */}
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cultural Notes
                </Typography>
                <List>
                  {culturalGuidance.culturalNotes.map((note, index) => (
                    <ListItem key={index} sx={{ pl: 0 }}>
                      <ListItemIcon>
                        <LightbulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={note} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Stack>
        ) : (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            Select a region and language to see business etiquette guidelines.
          </Alert>
        )}
      </TabPanel>
    </CulturalContainer>
  );
};

export default CulturalAdvisor;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
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
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  LinearProgress,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Rating
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ContactPage as ContactPageIcon,
  Insights as InsightsIcon,
  Campaign as CampaignIcon,
  ExpandMore as ExpandMoreIcon,
  Speed as SpeedIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  SmartToy as SmartToyIcon,
  Group as GroupIcon,
  AccountCircle as AccountCircleIcon,
  LocalOffer as LocalOfferIcon,
  EventNote as EventNoteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import { supabase } from '../../services/supabase/supabase';
import { Contact } from '../../types/contacts';
import { useThemeContext } from '../../themes/ThemeContext';
import { useSound, useButtonSound, useNotificationSound } from '../../hooks/useSound';

// Enhanced animations for intelligent contact selection
const intelligenceGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(103, 58, 183, 0.2),
      0 0 40px rgba(103, 58, 183, 0.1),
      inset 0 1px 0 rgba(103, 58, 183, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(103, 58, 183, 0.4),
      0 0 60px rgba(103, 58, 183, 0.2),
      inset 0 1px 0 rgba(103, 58, 183, 0.3);
  }
`;

const insightPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const scoreAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Styled components
const IntelligenceContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  animation: `${intelligenceGlow} 4s ease-in-out infinite`,
  
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
    animation: `${intelligenceGlow} 3s ease-in-out infinite`,
  }
}));

const ContactCard = styled(Card)(({ theme, selected }: { theme: any; selected: boolean }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `2px solid ${selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'visible',
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.15)}`,
    border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
  })
}));

const ScoreIndicator = styled(Box)(({ theme, score }: { theme: any; score: number }) => ({
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `3px solid ${score >= 80 ? theme.palette.success.main : 
                      score >= 60 ? theme.palette.warning.main : 
                      theme.palette.error.main}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: score >= 80 ? theme.palette.success.main : 
         score >= 60 ? theme.palette.warning.main : 
         theme.palette.error.main,
  animation: `${scoreAnimation} 0.6s ease-out`,
  boxShadow: theme.shadows[4],
}));

const InsightChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  borderRadius: '16px',
  animation: `${insightPulse} 3s ease-in-out infinite`,
  
  '& .MuiChip-icon': {
    color: theme.palette.secondary.main,
  }
}));

interface ContactInsight {
  id: string;
  type: 'engagement' | 'timing' | 'preference' | 'deal_stage' | 'language' | 'relationship';
  title: string;
  description: string;
  score: number;
  confidence: number;
  action?: string;
  metadata?: Record<string, any>;
}

interface ContactIntelligence {
  contactId: string;
  overallScore: number;
  insights: ContactInsight[];
  recommendedTiming: {
    best: string;
    timezone: string;
    reasoning: string;
  };
  languagePreference: {
    primary: string;
    secondary?: string;
    formality: 'formal' | 'casual' | 'mixed';
  };
  dealStage: {
    current: string;
    probability: number;
    nextStep: string;
    timeline: string;
  };
  relationshipStatus: {
    level: 'cold' | 'warm' | 'hot' | 'champion';
    lastInteraction: Date;
    frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  };
  personalizationTips: string[];
}

interface RecipientIntelligenceProps {
  selectedContacts: Contact[];
  onContactSelect: (contacts: Contact[]) => void;
  onIntelligenceUpdate?: (intelligence: ContactIntelligence[]) => void;
  maxRecipients?: number;
  showAdvancedFilters?: boolean;
  autoAnalyze?: boolean;
}

const RecipientIntelligence: React.FC<RecipientIntelligenceProps> = ({
  selectedContacts,
  onContactSelect,
  onIntelligenceUpdate,
  maxRecipients = 10,
  showAdvancedFilters = true,
  autoAnalyze = true
}) => {
  const theme = useTheme();
  const { getCurrentTheme } = useThemeContext();
  
  // Sound hooks
  const buttonSound = useButtonSound('primary');
  const notificationSound = useNotificationSound();
  
  // State management
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [contactIntelligence, setContactIntelligence] = useState<Map<string, ContactIntelligence>>(new Map());
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dealStage: [] as string[],
    engagementLevel: '' as string,
    lastContactDays: 0,
    practiceType: [] as string[],
    location: '',
    languagePreference: '',
    relationshipLevel: '' as string
  });
  const [showInsights, setShowInsights] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [intelligenceEnabled, setIntelligenceEnabled] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'engagement' | 'recent' | 'alphabetical'>('score');

  // Load contacts from Supabase
  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          practices (
            name,
            type,
            city,
            state
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedContacts: Contact[] = (data || []).map(contact => ({
        id: contact.id,
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        role: contact.role || '',
        practiceId: contact.practice_id || '',
        practiceName: contact.practices?.name || '',
        practiceType: contact.practices?.type || 'other',
        specialty: contact.specialty || '',
        notes: contact.notes || '',
        isStarred: contact.is_starred || false,
        lastContactDate: contact.last_contact_date,
        tags: contact.tags || [],
        createdAt: contact.created_at,
        updatedAt: contact.updated_at
      }));

      setContacts(formattedContacts);
      setFilteredContacts(formattedContacts);

      if (autoAnalyze && intelligenceEnabled) {
        await analyzeContactIntelligence(formattedContacts);
      }

    } catch (error) {
      console.error('Error loading contacts:', error);
      notificationSound.error();
    } finally {
      setLoading(false);
    }
  }, [autoAnalyze, intelligenceEnabled, notificationSound]);

  // Analyze contact intelligence using AI
  const analyzeContactIntelligence = useCallback(async (contactList: Contact[] = contacts) => {
    if (!intelligenceEnabled) return;

    setAnalyzing(true);
    try {
      const intelligenceMap = new Map<string, ContactIntelligence>();

      // Simulate AI analysis for each contact
      for (const contact of contactList.slice(0, 20)) { // Limit to prevent rate limits
        const intelligence = await generateContactIntelligence(contact);
        intelligenceMap.set(contact.id, intelligence);
      }

      setContactIntelligence(intelligenceMap);
      onIntelligenceUpdate?.(Array.from(intelligenceMap.values()));
      
      notificationSound.success();
    } catch (error) {
      console.error('Error analyzing contact intelligence:', error);
      notificationSound.error();
    } finally {
      setAnalyzing(false);
    }
  }, [contacts, intelligenceEnabled, onIntelligenceUpdate, notificationSound]);

  // Generate mock intelligence data (replace with real AI service)
  const generateContactIntelligence = async (contact: Contact): Promise<ContactIntelligence> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    const now = new Date();
    const daysSinceLastContact = contact.lastContactDate 
      ? Math.floor((now.getTime() - new Date(contact.lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
      : 365;

    const engagementScore = Math.max(0, 100 - daysSinceLastContact * 2);
    const dealProbability = Math.random() * 100;
    const relationshipLevel = engagementScore > 80 ? 'champion' : 
                             engagementScore > 60 ? 'hot' : 
                             engagementScore > 30 ? 'warm' : 'cold';

    const insights: ContactInsight[] = [
      {
        id: 'engagement',
        type: 'engagement',
        title: 'Engagement Level',
        description: `${contact.firstName} has ${engagementScore > 70 ? 'high' : engagementScore > 40 ? 'medium' : 'low'} engagement`,
        score: engagementScore,
        confidence: 85,
        action: engagementScore < 50 ? 'Schedule re-engagement call' : 'Maintain current cadence'
      },
      {
        id: 'timing',
        type: 'timing',
        title: 'Optimal Timing',
        description: 'Best contacted Tuesday-Thursday, 10-11 AM',
        score: 78,
        confidence: 72,
        action: 'Schedule email for Tuesday 10:30 AM'
      },
      {
        id: 'deal_stage',
        type: 'deal_stage',
        title: 'Deal Stage',
        description: `Currently in ${dealProbability > 70 ? 'decision' : dealProbability > 40 ? 'evaluation' : 'awareness'} stage`,
        score: dealProbability,
        confidence: 80,
        action: dealProbability > 70 ? 'Send proposal' : 'Provide case studies'
      }
    ];

    if (contact.practiceType === 'dental') {
      insights.push({
        id: 'specialty',
        type: 'preference',
        title: 'Specialty Focus',
        description: 'Interested in cosmetic and restorative procedures',
        score: 85,
        confidence: 90,
        action: 'Highlight aesthetic solutions'
      });
    }

    return {
      contactId: contact.id,
      overallScore: Math.round((engagementScore + dealProbability) / 2),
      insights,
      recommendedTiming: {
        best: 'Tuesday 10:30 AM',
        timezone: 'EST',
        reasoning: 'Historical engagement patterns show highest response rates'
      },
      languagePreference: {
        primary: 'English',
        formality: contact.role.toLowerCase().includes('dr') ? 'formal' : 'mixed'
      },
      dealStage: {
        current: dealProbability > 70 ? 'Decision' : dealProbability > 40 ? 'Evaluation' : 'Awareness',
        probability: dealProbability,
        nextStep: dealProbability > 70 ? 'Send proposal' : 'Schedule demo',
        timeline: dealProbability > 70 ? '1-2 weeks' : '4-6 weeks'
      },
      relationshipStatus: {
        level: relationshipLevel,
        lastInteraction: contact.lastContactDate ? new Date(contact.lastContactDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        frequency: Math.max(1, Math.floor(Math.random() * 10)),
        sentiment: engagementScore > 60 ? 'positive' : engagementScore > 30 ? 'neutral' : 'negative'
      },
      personalizationTips: [
        `Mention their ${contact.specialty || 'practice'} expertise`,
        'Reference recent industry trends',
        contact.practiceName ? `Ask about ${contact.practiceName}` : 'Ask about their practice'
      ]
    };
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...contacts];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(query) ||
        contact.lastName.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.practiceName.toLowerCase().includes(query) ||
        contact.specialty.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.practiceType.length > 0) {
      filtered = filtered.filter(contact => 
        filters.practiceType.includes(contact.practiceType)
      );
    }

    if (filters.lastContactDays > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.lastContactDays);
      filtered = filtered.filter(contact => 
        !contact.lastContactDate || new Date(contact.lastContactDate) >= cutoffDate
      );
    }

    if (filters.location) {
      filtered = filtered.filter(contact =>
        contact.practiceName.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      const aIntelligence = contactIntelligence.get(a.id);
      const bIntelligence = contactIntelligence.get(b.id);

      switch (sortBy) {
        case 'score':
          return (bIntelligence?.overallScore || 0) - (aIntelligence?.overallScore || 0);
        case 'engagement':
          const aEngagement = aIntelligence?.insights.find(i => i.type === 'engagement')?.score || 0;
          const bEngagement = bIntelligence?.insights.find(i => i.type === 'engagement')?.score || 0;
          return bEngagement - aEngagement;
        case 'recent':
          const aDate = a.lastContactDate ? new Date(a.lastContactDate).getTime() : 0;
          const bDate = b.lastContactDate ? new Date(b.lastContactDate).getTime() : 0;
          return bDate - aDate;
        case 'alphabetical':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  }, [contacts, searchQuery, filters, sortBy, contactIntelligence]);

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleContactToggle = (contact: Contact) => {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    let newSelection: Contact[];

    if (isSelected) {
      newSelection = selectedContacts.filter(c => c.id !== contact.id);
    } else {
      if (selectedContacts.length >= maxRecipients) {
        notificationSound.warning();
        return;
      }
      newSelection = [...selectedContacts, contact];
    }

    onContactSelect(newSelection);
    buttonSound.play();
  };

  const getContactScore = (contactId: string): number => {
    return contactIntelligence.get(contactId)?.overallScore || 0;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const formatLastContact = (date?: string) => {
    if (!date) return 'Never';
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <IntelligenceContainer elevation={3}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Recipient Intelligence
            </Typography>
            <Badge 
              badgeContent={selectedContacts.length} 
              color="secondary"
              max={99}
            />
            {analyzing && <CircularProgress size={20} />}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={intelligenceEnabled}
                  onChange={(e) => setIntelligenceEnabled(e.target.checked)}
                  size="small"
                />
              }
              label="AI Analysis"
              sx={{ mr: 1 }}
            />
            
            <Tooltip title="Refresh Analysis">
              <IconButton
                size="small"
                onClick={() => analyzeContactIntelligence()}
                disabled={analyzing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <ContactPageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
          />

          {showAdvancedFilters && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Advanced Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={['dental', 'aesthetic', 'other']}
                      value={filters.practiceType}
                      onChange={(_, value) => setFilters(prev => ({ ...prev, practiceType: value }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Practice Type" size="small" />
                      )}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={['score', 'engagement', 'recent', 'alphabetical']}
                      value={sortBy}
                      onChange={(_, value) => setSortBy(value as any || 'score')}
                      renderInput={(params) => (
                        <TextField {...params} label="Sort By" size="small" />
                      )}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Stack>
      </Box>

      {/* Selected Contacts Summary */}
      {selectedContacts.length > 0 && (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Recipients ({selectedContacts.length}/{maxRecipients})
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedContacts.map((contact) => (
              <Chip
                key={contact.id}
                label={`${contact.firstName} ${contact.lastName}`}
                onDelete={() => handleContactToggle(contact)}
                avatar={
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {contact.firstName[0]}{contact.lastName[0]}
                  </Avatar>
                }
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Contact List */}
      <Box sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            No contacts found matching your criteria.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.some(c => c.id === contact.id);
              const intelligence = contactIntelligence.get(contact.id);
              const score = getContactScore(contact.id);

              return (
                <ContactCard
                  key={contact.id}
                  selected={isSelected}
                  onClick={() => handleContactToggle(contact)}
                >
                  <CardContent sx={{ position: 'relative', p: 2 }}>
                    {intelligenceEnabled && score > 0 && (
                      <ScoreIndicator score={score}>
                        {score}
                      </ScoreIndicator>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {contact.firstName[0]}{contact.lastName[0]}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" noWrap>
                            {contact.firstName} {contact.lastName}
                          </Typography>
                          {contact.isStarred && (
                            <StarIcon color="warning" fontSize="small" />
                          )}
                          {intelligence?.relationshipStatus.level === 'champion' && (
                            <Chip label="Champion" color="success" size="small" />
                          )}
                        </Box>

                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.email}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {contact.practiceName} • {contact.role}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Last contact: {formatLastContact(contact.lastContactDate)}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Intelligence Insights */}
                        {intelligenceEnabled && intelligence && (
                          <Collapse in={showInsights}>
                            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                              <Typography variant="caption" color="text.secondary" gutterBottom>
                                AI Insights
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {intelligence.insights.slice(0, 3).map((insight) => (
                                  <InsightChip
                                    key={insight.id}
                                    icon={<PsychologyIcon />}
                                    label={insight.title}
                                    size="small"
                                    title={insight.description}
                                  />
                                ))}
                              </Stack>

                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Deal Stage:
                                  </Typography>
                                  <Chip 
                                    label={intelligence.dealStage.current}
                                    size="small"
                                    color={intelligence.dealStage.probability > 70 ? 'success' : 
                                           intelligence.dealStage.probability > 40 ? 'warning' : 'default'}
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Best Time:
                                  </Typography>
                                  <Typography variant="caption" fontWeight={500}>
                                    {intelligence.recommendedTiming.best}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        )}
                      </Box>

                      {/* Selection Indicator */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        {isSelected ? (
                          <CheckCircleIcon color="primary" />
                        ) : (
                          <IconButton size="small" sx={{ opacity: 0.5 }}>
                            <StarBorderIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </ContactCard>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Button
            startIcon={<GroupIcon />}
            onClick={() => {
              const topContacts = filteredContacts
                .slice(0, Math.min(5, maxRecipients))
                .filter(c => !selectedContacts.some(s => s.id === c.id));
              onContactSelect([...selectedContacts, ...topContacts].slice(0, maxRecipients));
              buttonSound.play();
            }}
            disabled={selectedContacts.length >= maxRecipients}
            size="small"
          >
            Select Top 5
          </Button>

          <Button
            startIcon={<InsightsIcon />}
            onClick={() => setShowInsights(!showInsights)}
            size="small"
            variant="outlined"
          >
            {showInsights ? 'Hide' : 'Show'} Insights
          </Button>
        </Stack>
      </Box>
    </IntelligenceContainer>
  );
};

export default RecipientIntelligence;
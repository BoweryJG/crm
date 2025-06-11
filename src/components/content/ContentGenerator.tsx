// Content Generator Component - AI-Powered Sales Content with Socratic & Challenger Sales Methodology
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Badge,
  Tooltip,
  useTheme,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Create as CreateIcon,
  Psychology as SocraticIcon,
  TrendingUp as ChallengerIcon,
  Email as EmailIcon,
  Presentation as DemoIcon,
  QuestionAnswer as ObjectionIcon,
  Timeline as SequenceIcon,
  Description as ProposalIcon,
  Assessment as CaseStudyIcon,
  ExpandMore as ExpandIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Description
} from '@mui/icons-material';
import { contentGeneratorService, ContentTemplate, GeneratedContent, ContentGenerationRequest } from '../../services/contentGeneratorService';
import { rippleContentService, RippleContent, RippleDeliveryOptions } from '../../services/rippleContentService';
import { contentEngagementNotificationService, ContentEngagementNotification } from '../../services/contentEngagementNotificationService';

interface ContentGeneratorProps {
  userId?: string;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ userId = 'demo-user' }) => {
  const theme = useTheme();

  // State management
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [ripples, setRipples] = useState<RippleContent[]>([]);
  const [notifications, setNotifications] = useState<ContentEngagementNotification[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Content generation state
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [generationRequest, setGenerationRequest] = useState<Partial<ContentGenerationRequest>>({
    target_practice: {
      practice_name: '',
      provider_name: '',
      specialty: 'dental',
      procedures: [],
      practice_size: 'medium'
    },
    customization: {
      tone: 'professional',
      focus_procedures: [],
      key_benefits: [],
      call_to_action_type: 'demo',
      personalization_level: 'high'
    }
  });

  // Dialog states
  const [generationDialogOpen, setGenerationDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [rippleDialogOpen, setRippleDialogOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // Ripple state
  const [deliveryOptions, setDeliveryOptions] = useState<RippleDeliveryOptions>({
    delivery_method: 'ripple' as const,
    personalization_level: 'high' as const,
    tracking_depth: 'comprehensive' as const,
    ai_enhancement: true,
    follow_up_automation: true,
    expires_in_days: 30,
    smart_timing: true,
    geo_targeting: false,
    device_optimization: true
  });
  const [recipientInfo, setRecipientInfo] = useState({
    email: '',
    name: '',
    practice_name: ''
  });

  // Content types with Socratic and Challenger Sales focus
  const contentTypes = [
    {
      type: 'socratic_discovery',
      name: 'Socratic Discovery Email',
      description: 'Question-based emails that lead prospects to insights',
      icon: <SocraticIcon />,
      methodology: 'Socratic Method',
      color: theme.palette.primary.main
    },
    {
      type: 'challenger_insight',
      name: 'Challenger Insight',
      description: 'Reframe thinking with industry insights and data',
      icon: <ChallengerIcon />,
      methodology: 'Challenger Sales',
      color: theme.palette.warning.main
    },
    {
      type: 'teaching_sequence',
      name: 'Teaching Sequence',
      description: 'Educate and challenge current approaches',
      icon: <SequenceIcon />,
      methodology: 'Teaching Selling',
      color: theme.palette.info.main
    },
    {
      type: 'provocative_demo',
      name: 'Provocative Demo Script',
      description: 'Challenge assumptions during demonstrations',
      icon: <DemoIcon />,
      methodology: 'Challenger Sales',
      color: theme.palette.success.main
    },
    {
      type: 'insight_objection',
      name: 'Insight-Based Objection Handling',
      description: 'Reframe objections with new perspectives',
      icon: <ObjectionIcon />,
      methodology: 'Challenger Sales',
      color: theme.palette.error.main
    },
    {
      type: 'case_study_challenge',
      name: 'Case Study Challenge',
      description: 'Stories that challenge conventional thinking',
      icon: <CaseStudyIcon />,
      methodology: 'Story Selling',
      color: theme.palette.secondary.main
    }
  ];

  const procedures = {
    aesthetic: ['Botox', 'Restylane', 'Chemical Peel', 'Laser Skin Resurfacing', 'Hybrid Filler Technology'],
    dental: ['Dental Implants', 'Teeth Whitening', 'Invisalign', 'Dental Veneers', 'Oral Surgery']
  };

  const challengerTones = [
    { value: 'provocative', label: 'Provocative - Challenge status quo' },
    { value: 'educational', label: 'Educational - Teach new insights' },
    { value: 'consultative', label: 'Consultative - Guide to solutions' },
    { value: 'data_driven', label: 'Data-Driven - Lead with evidence' }
  ];

  const socraticStyles = [
    { value: 'guided_discovery', label: 'Guided Discovery - Lead to insights' },
    { value: 'assumption_challenge', label: 'Assumption Challenge - Question beliefs' },
    { value: 'problem_exploration', label: 'Problem Exploration - Uncover issues' },
    { value: 'solution_construction', label: 'Solution Construction - Build together' }
  ];

  // Load data on mount
  useEffect(() => {
    loadTemplates();
    loadGeneratedContent();
    loadRippleContent();
    loadNotifications();
  }, [userId]);

  const loadTemplates = async () => {
    try {
      const templateData = await contentGeneratorService.getTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadGeneratedContent = async () => {
    try {
      const contentData = await contentGeneratorService.getUserContent(userId);
      setGeneratedContent(contentData);
    } catch (error) {
      console.error('Error loading generated content:', error);
    }
  };

  const loadRippleContent = async () => {
    try {
      const rippleData = await rippleContentService.getUserRipples(userId);
      setRipples(rippleData);
    } catch (error) {
      console.error('Error loading ripple content:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationData = await contentEngagementNotificationService.getUserNotifications(userId, {
        unread_only: false,
        days_back: 7
      });
      setNotifications(notificationData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const generateContent = async () => {
    if (!selectedTemplate || !generationRequest.target_practice?.practice_name) {
      return;
    }

    try {
      setLoading(true);
      
      const request: ContentGenerationRequest = {
        template_id: selectedTemplate.id,
        target_practice: generationRequest.target_practice!,
        customization: generationRequest.customization!,
        ai_model_preference: 'anthropic/claude-3.5-sonnet' // Best for Socratic questioning
      };

      const generated = await contentGeneratorService.generateContent(userId, request);
      
      setGeneratedContent(prev => [generated, ...prev]);
      setGenerationDialogOpen(false);
      setActiveStep(0);
      
      // Show preview with ripple option
      setSelectedContent(generated);
      setPreviewDialogOpen(true);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRipple = async () => {
    if (!selectedContent) return;

    try {
      setLoading(true);
      
      const ripple = await rippleContentService.createRipple(
        userId,
        selectedContent.id,
        deliveryOptions,
        recipientInfo.email ? recipientInfo : undefined
      );

      setRipples(prev => [ripple, ...prev]);

      // Send the ripple if email provided
      if (recipientInfo.email && deliveryOptions.delivery_method !== 'ripple') {
        const result = await rippleContentService.sendRipple(
          ripple.id,
          deliveryOptions.delivery_method === 'email_ripple' ? 'email' : 'direct'
        );
        
        if (result.success) {
          console.log('Ripple sent successfully:', result.ripple_url);
        }
      }

      setRippleDialogOpen(false);
      setRecipientInfo({ email: '', name: '', practice_name: '' });
    } catch (error) {
      console.error('Error creating ripple:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeInfo = (type: string) => {
    return contentTypes.find(ct => ct.type === type) || contentTypes[0];
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 75) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const formatContent = (content: any) => {
    if (typeof content === 'string') return content;
    
    let formatted = '';
    if (content.subject_line) {
      formatted += `Subject: ${content.subject_line}\n\n`;
    }
    if (content.content_body) {
      formatted += content.content_body + '\n\n';
    }
    if (content.talking_points && content.talking_points.length > 0) {
      formatted += 'Key Points:\n' + content.talking_points.map((point: string) => `• ${point}`).join('\n') + '\n\n';
    }
    if (content.call_to_action) {
      formatted += `Call to Action: ${content.call_to_action}`;
    }
    
    return formatted;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Content Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered sales content using Socratic questioning and Challenger Sales methodology
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={notifications.filter(n => !n.read_at).length} color="error">
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={() => setNotificationsDialogOpen(true)}
            >
              Engagement Alerts
            </Button>
          </Badge>
          <Button
            variant="outlined"
            startIcon={<AnalyticsIcon />}
            onClick={() => setCurrentTab(3)}
          >
            Analytics
          </Button>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => setGenerationDialogOpen(true)}
          >
            Generate Content
          </Button>
        </Box>
      </Box>

      {/* Main Tabs */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Content Types" />
            <Tab label="Generated Content" />
            <Tab label="Ripples" />
            <Tab label="Analytics" />
            <Tab label="Templates" />
          </Tabs>
        </Box>

        {/* Content Types Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Socratic & Challenger Sales Content Types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Content designed to challenge thinking, provoke insights, and guide prospects to new perspectives
            </Typography>

            <Grid container spacing={3}>
              {contentTypes.map((type) => (
                <Grid item xs={12} md={6} lg={4} key={type.type}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      borderRadius: 2, 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => {
                      // Set up generation for this content type
                      const template = templates.find(t => t.content_type === type.type);
                      if (template) {
                        setSelectedTemplate(template);
                        setGenerationDialogOpen(true);
                      }
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: type.color }}>
                          {type.icon}
                        </Avatar>
                      }
                      title={
                        <Typography variant="h6" fontWeight="bold">
                          {type.name}
                        </Typography>
                      }
                      subheader={
                        <Chip 
                          label={type.methodology} 
                          size="small" 
                          sx={{ backgroundColor: type.color, color: 'white', mt: 0.5 }}
                        />
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          AI-Powered Generation
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <SocraticIcon fontSize="small" color="primary" />
                          <ChallengerIcon fontSize="small" color="warning" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Generated Content Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Generated Sales Content
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Badge badgeContent={generatedContent.length} color="primary">
                  <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadGeneratedContent}>
                    Refresh
                  </Button>
                </Badge>
              </Box>
            </Box>

            {generatedContent.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AIIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No content generated yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start creating AI-powered sales content with Socratic questioning and Challenger Sales methodology
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<CreateIcon />}
                  onClick={() => setGenerationDialogOpen(true)}
                >
                  Generate Your First Content
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {generatedContent.map((content) => {
                  const typeInfo = getContentTypeInfo(content.content_type);
                  return (
                    <Grid item xs={12} md={6} lg={4} key={content.id}>
                      <Card elevation={1} sx={{ borderRadius: 2 }}>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: typeInfo.color }}>
                              {typeInfo.icon}
                            </Avatar>
                          }
                          title={
                            <Typography variant="subtitle2" fontWeight="bold">
                              {typeInfo.name}
                            </Typography>
                          }
                          subheader={
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                {content.target_practice.practice_name}
                              </Typography>
                              <Chip 
                                label={content.status} 
                                size="small" 
                                color={content.status === 'approved' ? 'success' : 'default'}
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          }
                          action={
                            <Chip
                              label={`${content.generation_metadata.quality_score}%`}
                              size="small"
                              sx={{
                                backgroundColor: getQualityColor(content.generation_metadata.quality_score),
                                color: 'white'
                              }}
                            />
                          }
                        />
                        <CardContent>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {content.generated_content.subject_line || 
                             content.generated_content.content_body?.substring(0, 100) + '...'}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                            {content.target_practice.procedures.slice(0, 2).map((proc) => (
                              <Chip key={proc} label={proc} size="small" variant="outlined" />
                            ))}
                            {content.target_practice.procedures.length > 2 && (
                              <Chip 
                                label={`+${content.target_practice.procedures.length - 2}`} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(content.created_at).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Preview">
                                <IconButton 
                                  size="small"
                                  onClick={() => {
                                    setSelectedContent(content);
                                    setPreviewDialogOpen(true);
                                  }}
                                >
                                  <Description />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download">
                                <IconButton size="small">
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Share">
                                <IconButton size="small">
                                  <ShareIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

        {/* Magic Links Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Ripple Content
              </Typography>
              <Badge badgeContent={ripples.length} color="primary">
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadRippleContent}>
                  Refresh
                </Button>
              </Badge>
            </Box>

            {ripples.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No ripples created yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create trackable ripples to share your content and monitor engagement
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {ripples.map((ripple) => (
                  <Grid item xs={12} md={6} lg={4} key={ripple.id}>
                    <Card elevation={1} sx={{ borderRadius: 2 }}>
                      <CardHeader
                        title={
                          <Typography variant="subtitle2" fontWeight="bold">
                            {ripple.practice_name || 'Anonymous Prospect'}
                          </Typography>
                        }
                        subheader={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {getContentTypeInfo(ripple.content_type).name}
                            </Typography>
                            <Chip 
                              label={ripple.ripple_status} 
                              size="small" 
                              color={ripple.ripple_status === 'converted' ? 'success' : 
                                     ripple.ripple_status === 'engaged' ? 'warning' : 'default'}
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        action={
                          <Chip
                            label={`${ripple.performance_data.conversion_score}%`}
                            size="small"
                            sx={{
                              backgroundColor: getQualityColor(ripple.performance_data.conversion_score),
                              color: 'white'
                            }}
                          />
                        }
                      />
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {ripple.subject_line}
                          </Typography>
                        </Box>

                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Opens</Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {ripple.ripple_analytics.opens}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Clicks</Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {ripple.ripple_analytics.clicks}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Time</Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {Math.round(ripple.ripple_analytics.time_spent)}s
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                          <Chip 
                            label={ripple.performance_data.lead_temperature} 
                            size="small" 
                            color={ripple.performance_data.lead_temperature === 'hot' ? 'error' : 
                                   ripple.performance_data.lead_temperature === 'warm' ? 'warning' : 'default'}
                          />
                          <Chip 
                            label={ripple.performance_data.engagement_quality} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(ripple.created_at).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Copy Ripple Link">
                              <IconButton 
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/ripple/${ripple.ripple_token}`);
                                }}
                              >
                                <ShareIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Analytics">
                              <IconButton size="small">
                                <AnalyticsIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Analytics Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Content Performance Analytics
            </Typography>
            <Alert severity="info">
              Analytics dashboard for tracking content performance, conversion rates, and methodology effectiveness coming soon.
            </Alert>
          </Box>
        )}

        {/* Templates Tab */}
        {currentTab === 4 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Content Templates
            </Typography>
            <Alert severity="info">
              Template management and customization interface coming soon.
            </Alert>
          </Box>
        )}
      </Card>

      {/* Content Generation Dialog */}
      <Dialog open={generationDialogOpen} onClose={() => setGenerationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Generate AI-Powered Sales Content
          {selectedTemplate && (
            <Typography variant="body2" color="text.secondary">
              Using {getContentTypeInfo(selectedTemplate.content_type).methodology}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Target Practice</StepLabel>
            </Step>
            <Step>
              <StepLabel>Content Strategy</StepLabel>
            </Step>
            <Step>
              <StepLabel>AI Configuration</StepLabel>
            </Step>
            <Step>
              <StepLabel>Generate</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Practice Name"
                  value={generationRequest.target_practice?.practice_name || ''}
                  onChange={(e) => setGenerationRequest(prev => ({
                    ...prev,
                    target_practice: { ...prev.target_practice!, practice_name: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Provider Name"
                  value={generationRequest.target_practice?.provider_name || ''}
                  onChange={(e) => setGenerationRequest(prev => ({
                    ...prev,
                    target_practice: { ...prev.target_practice!, provider_name: e.target.value }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={generationRequest.target_practice?.specialty || 'dental'}
                    onChange={(e) => setGenerationRequest(prev => ({
                      ...prev,
                      target_practice: { ...prev.target_practice!, specialty: e.target.value }
                    }))}
                  >
                    <MenuItem value="dental">Dental</MenuItem>
                    <MenuItem value="aesthetic">Aesthetic</MenuItem>
                    <MenuItem value="dermatology">Dermatology</MenuItem>
                    <MenuItem value="plastic_surgery">Plastic Surgery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Practice Size</InputLabel>
                  <Select
                    value={generationRequest.target_practice?.practice_size || 'medium'}
                    onChange={(e) => setGenerationRequest(prev => ({
                      ...prev,
                      target_practice: { ...prev.target_practice!, practice_size: e.target.value }
                    }))}
                  >
                    <MenuItem value="solo">Solo Practice</MenuItem>
                    <MenuItem value="small">Small (2-5 providers)</MenuItem>
                    <MenuItem value="medium">Medium (6-15 providers)</MenuItem>
                    <MenuItem value="large">Large (15+ providers)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={procedures[generationRequest.target_practice?.specialty as keyof typeof procedures] || procedures.dental}
                  value={generationRequest.target_practice?.procedures || []}
                  onChange={(_, value) => setGenerationRequest(prev => ({
                    ...prev,
                    target_practice: { ...prev.target_practice!, procedures: value }
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Target Procedures" placeholder="Select procedures" />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Challenger Tone</InputLabel>
                  <Select
                    value={generationRequest.customization?.tone || 'provocative'}
                    onChange={(e) => setGenerationRequest(prev => ({
                      ...prev,
                      customization: { ...prev.customization!, tone: e.target.value as any }
                    }))}
                  >
                    {challengerTones.map((tone) => (
                      <MenuItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Call to Action</InputLabel>
                  <Select
                    value={generationRequest.customization?.call_to_action_type || 'demo'}
                    onChange={(e) => setGenerationRequest(prev => ({
                      ...prev,
                      customization: { ...prev.customization!, call_to_action_type: e.target.value as any }
                    }))}
                  >
                    <MenuItem value="demo">Request Demo</MenuItem>
                    <MenuItem value="meeting">Schedule Meeting</MenuItem>
                    <MenuItem value="trial">Offer Trial</MenuItem>
                    <MenuItem value="information">Provide Information</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={['Cost Reduction', 'Patient Satisfaction', 'Efficiency Gains', 'Competitive Advantage', 'Revenue Growth']}
                  value={generationRequest.customization?.key_benefits || []}
                  onChange={(_, value) => setGenerationRequest(prev => ({
                    ...prev,
                    customization: { ...prev.customization!, key_benefits: value }
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Key Benefits to Highlight" />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>AI Model Configuration</Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Using Claude 3.5 Sonnet - optimized for Socratic questioning and Challenger Sales methodology
              </Alert>
              <Typography variant="body2" color="text.secondary">
                The AI will generate content that challenges assumptions, asks provocative questions, and guides prospects to new insights.
              </Typography>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Ready to Generate</Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Content Type: {selectedTemplate ? getContentTypeInfo(selectedTemplate.content_type).name : 'None'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Target: {generationRequest.target_practice?.practice_name} ({generationRequest.target_practice?.specialty})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Methodology: {selectedTemplate ? getContentTypeInfo(selectedTemplate.content_type).methodology : 'None'}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerationDialogOpen(false)}>Cancel</Button>
          <Button 
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>
          {activeStep < 3 ? (
            <Button 
              variant="contained"
              onClick={() => setActiveStep(prev => prev + 1)}
              disabled={activeStep === 0 && !generationRequest.target_practice?.practice_name}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={generateContent}
              disabled={loading || !selectedTemplate}
              startIcon={loading ? <CircularProgress size={20} /> : <AIIcon />}
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Content Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Content Preview
          {selectedContent && (
            <Typography variant="body2" color="text.secondary">
              {getContentTypeInfo(selectedContent.content_type).name} • Quality Score: {selectedContent.generation_metadata.quality_score}%
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedContent && (
            <Box>
              <Paper sx={{ p: 3, mb: 2, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {formatContent(selectedContent.generated_content)}
              </Paper>
              
              <Typography variant="subtitle2" gutterBottom>
                Target Practice Details:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={selectedContent.target_practice.practice_name} />
                <Chip label={selectedContent.target_practice.specialty} />
                <Chip label={selectedContent.target_practice.practice_size} />
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Generated using {selectedContent.ai_model_used} • {selectedContent.generation_metadata.generation_time_ms}ms
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={() => {
              setRippleDialogOpen(true);
              setPreviewDialogOpen(false);
            }}
          >
            Create Ripple
          </Button>
          <Button variant="contained" startIcon={<SendIcon />}>
            Use Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ripple Creation Dialog */}
      <Dialog open={rippleDialogOpen} onClose={() => setRippleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Ripple</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a trackable ripple for this content with engagement notifications
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipient Email (Optional)"
                value={recipientInfo.email}
                onChange={(e) => setRecipientInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="prospect@practice.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Recipient Name"
                value={recipientInfo.name}
                onChange={(e) => setRecipientInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. Smith"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Practice Name"
                value={recipientInfo.practice_name}
                onChange={(e) => setRecipientInfo(prev => ({ ...prev, practice_name: e.target.value }))}
                placeholder="Smith Dental Practice"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Delivery Method</InputLabel>
                <Select
                  value={deliveryOptions.delivery_method}
                  onChange={(e) => setDeliveryOptions(prev => ({ 
                    ...prev, 
                    delivery_method: e.target.value as any 
                  }))}
                >
                  <MenuItem value="ripple">Ripple Link Only</MenuItem>
                  <MenuItem value="email_ripple">Email with Ripple</MenuItem>
                  <MenuItem value="multi_channel">Multi-Channel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Expires in Days"
                value={deliveryOptions.expires_in_days}
                onChange={(e) => setDeliveryOptions(prev => ({ 
                  ...prev, 
                  expires_in_days: parseInt(e.target.value) 
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deliveryOptions.tracking_depth === 'comprehensive'}
                    onChange={(e) => setDeliveryOptions(prev => ({ 
                      ...prev, 
                      tracking_depth: e.target.checked ? 'comprehensive' : 'standard' 
                    }))}
                  />
                }
                label="Enable engagement tracking and notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deliveryOptions.follow_up_automation}
                    onChange={(e) => setDeliveryOptions(prev => ({ 
                      ...prev, 
                      follow_up_automation: e.target.checked 
                    }))}
                  />
                }
                label="Trigger automated follow-up sequence on engagement"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRippleDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={createRipple}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <ShareIcon />}
          >
            {loading ? 'Creating...' : 'Create Ripple'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Engagement Notifications Dialog */}
      <Dialog open={notificationsDialogOpen} onClose={() => setNotificationsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Engagement Notifications
          <Typography variant="body2" color="text.secondary">
            Real-time alerts when prospects engage with your content
          </Typography>
        </DialogTitle>
        <DialogContent>
          {notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No engagement notifications yet
              </Typography>
            </Box>
          ) : (
            <Box>
              {notifications.map((notification) => (
                <Paper key={notification.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {notification.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={notification.priority} 
                        size="small" 
                        color={notification.priority === 'urgent' ? 'error' : 
                               notification.priority === 'high' ? 'warning' : 'default'}
                      />
                      <Chip 
                        label={notification.prospect_info.lead_temperature} 
                        size="small" 
                        color={notification.prospect_info.lead_temperature === 'hot' ? 'error' : 
                               notification.prospect_info.lead_temperature === 'warm' ? 'warning' : 'default'}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {notification.message}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {notification.recommended_actions.slice(0, 2).map((action, index) => (
                      <Chip key={index} label={action} size="small" variant="outlined" />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationsDialogOpen(false)}>Close</Button>
          <Button variant="outlined">Mark All Read</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentGenerator;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  CelebrationTwoTone as BirthdayIcon,
  EmailTwoTone as EmailIcon,
  AssessmentTwoTone as ReportIcon,
  PhoneTwoTone as CallIcon,
  WhatshotTwoTone as HotLeadIcon,
  EventTwoTone as MeetingIcon,
  PlayArrow as StartIcon,
  Settings as ConfigIcon,
  AutoAwesome as MagicIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth';
import automationService, { WorkflowType, WorkflowStatus } from '../../services/automation/comprehensiveAutomationService';
import automationLimitsService from '../../services/automation/automationLimitsService';

interface MagicAutomation {
  id: string;
  emoji: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: WorkflowType;
  estimatedSavings: string;
  setupSteps: string[];
  defaultConfig: any;
}

const MAGIC_AUTOMATIONS: MagicAutomation[] = [
  {
    id: 'birthday-assistant',
    emoji: '🎂',
    title: 'Birthday Email Assistant',
    description: 'Never miss a contact\'s birthday again. Sends warm, personalized birthday emails automatically.',
    icon: <BirthdayIcon />,
    color: '#FF6B9D',
    type: WorkflowType.EMAIL_SEQUENCE,
    estimatedSavings: '2 hours/month',
    setupSteps: [
      'We\'ll find all contacts with birthdays',
      'Create a warm birthday email template', 
      'Set it to send 3 days before each birthday',
      'You\'ll get a preview before each one sends'
    ],
    defaultConfig: {
      emailTemplate: 'Happy Birthday, {{firstName}}! 🎉\n\nHope your special day is amazing. Looking forward to connecting with you soon!\n\nBest wishes,\n{{yourName}}',
      sendDaysBefore: 0,
      timeToSend: '09:00'
    }
  },
  {
    id: 'welcome-sequence',
    emoji: '📧',
    title: 'Welcome New Contacts',
    description: 'Instantly send a warm welcome email to every new contact you add to your CRM.',
    icon: <EmailIcon />,
    color: '#4285F4',
    type: WorkflowType.EMAIL_SEQUENCE,
    estimatedSavings: '1 hour/week',
    setupSteps: [
      'Create a friendly welcome message',
      'Set when to send (immediately or after 1 hour)',
      'Add your company info and next steps',
      'New contacts get welcomed automatically'
    ],
    defaultConfig: {
      emailTemplate: 'Welcome {{firstName}}!\n\nThanks for connecting. I\'m excited to learn more about how we can help {{company}}.\n\nI\'ll follow up with some helpful resources.\n\nBest,\n{{yourName}}',
      delayHours: 1,
      includeCompanyInfo: true
    }
  },
  {
    id: 'weekly-report',
    emoji: '📊',
    title: 'Weekly Sales Summary',
    description: 'Get a beautiful weekly report of your sales activity delivered every Monday morning.',
    icon: <ReportIcon />,
    color: '#34A853',
    type: WorkflowType.REPORT_GENERATION,
    estimatedSavings: '30 minutes/week',
    setupSteps: [
      'Choose what metrics to include',
      'Set when to receive it (Monday 9am suggested)',
      'Pick email format (summary or detailed)',
      'Get insights on your sales performance'
    ],
    defaultConfig: {
      includeMetrics: ['calls_made', 'emails_sent', 'meetings_scheduled', 'deals_progress'],
      sendDay: 'monday',
      sendTime: '09:00',
      format: 'summary'
    }
  },
  {
    id: 'follow-up-reminders',
    emoji: '📞',
    title: 'Smart Follow-up Reminders',
    description: 'Never forget to follow up. Get intelligent reminders based on your interaction history.',
    icon: <CallIcon />,
    color: '#FF9800',
    type: WorkflowType.EMAIL_SEQUENCE,
    estimatedSavings: '3 hours/week',
    setupSteps: [
      'Set follow-up rules (after calls, emails, meetings)',
      'Choose reminder timing (2 days, 1 week, etc.)',
      'Pick how to be reminded (email, in-app notification)',
      'Smart suggestions based on contact importance'
    ],
    defaultConfig: {
      followUpAfterDays: 3,
      reminderMethod: 'email',
      prioritizeHotLeads: true,
      includeSuggestedActions: true
    }
  },
  {
    id: 'hot-lead-alerts',
    emoji: '🔥',
    title: 'Hot Lead Alert System',
    description: 'Get instantly notified when a contact becomes a hot lead based on their behavior.',
    icon: <HotLeadIcon />,
    color: '#F44336',
    type: WorkflowType.OUTREACH_CAMPAIGN,
    estimatedSavings: 'Priceless',
    setupSteps: [
      'Define what makes a "hot lead" for your business',
      'Set notification preferences (email, SMS, in-app)',
      'Choose urgency levels and response times',
      'Never miss a hot opportunity again'
    ],
    defaultConfig: {
      hotLeadCriteria: ['multiple_emails_opened', 'website_visit', 'responded_to_email'],
      notificationMethod: ['email', 'in_app'],
      urgencyLevel: 'high'
    }
  },
  {
    id: 'meeting-follow-up',
    emoji: '📅',
    title: 'Meeting Follow-up Flow',
    description: 'Automatically send thank you emails and next steps after every meeting.',
    icon: <MeetingIcon />,
    color: '#9C27B0',
    type: WorkflowType.EMAIL_SEQUENCE,
    estimatedSavings: '45 minutes/meeting',
    setupSteps: [
      'Create thank you email templates',
      'Set when to send (2 hours after meeting)',
      'Include meeting summary and next steps',
      'Keep momentum going automatically'
    ],
    defaultConfig: {
      thankYouTemplate: 'Thanks for the great meeting today, {{firstName}}!\n\nAs discussed, here are our next steps:\n\n• {{nextSteps}}\n\nLooking forward to moving forward!\n\n{{yourName}}',
      sendAfterHours: 2,
      includeCalendarLink: true
    }
  }
];

const MagicButtonGallery: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedAutomation, setSelectedAutomation] = useState<MagicAutomation | null>(null);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleStartSetup = async (automation: MagicAutomation) => {
    if (!user?.id) return;
    
    // Check if user can create this automation
    const canCreate = await automationLimitsService.canPerformAction(user.id, 'automation');
    if (!canCreate.allowed) {
      alert(canCreate.reason);
      return;
    }

    setSelectedAutomation(automation);
    setConfig(automation.defaultConfig);
    setSetupStep(0);
    setSetupDialogOpen(true);
    setSetupComplete(false);
  };

  const handleNextStep = () => {
    if (selectedAutomation && setupStep < selectedAutomation.setupSteps.length - 1) {
      setSetupStep(setupStep + 1);
    } else {
      handleCreateAutomation();
    }
  };

  const handleCreateAutomation = async () => {
    if (!selectedAutomation || !user?.id) return;
    
    setLoading(true);
    try {
      const result = await automationService.createWorkflow({
        name: selectedAutomation.title,
        type: selectedAutomation.type,
        description: selectedAutomation.description,
        config: config
      });

      if (result.data) {
        // Activate the automation
        await automationService.updateWorkflowStatus(result.data.id, WorkflowStatus.ACTIVE);
        
        // Log the action for usage tracking
        await automationLimitsService.logAction(user.id, 'automation_created', {
          automationType: selectedAutomation.type,
          automationName: selectedAutomation.title
        });

        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Error creating automation:', error);
      alert('Failed to create automation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMagicCard = (automation: MagicAutomation) => (
    <Card
      key={automation.id}
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(automation.color, 0.1)}, ${alpha(automation.color, 0.05)})`,
        border: `2px solid ${alpha(automation.color, 0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: automation.color,
          boxShadow: `0 12px 24px ${alpha(automation.color, 0.3)}`,
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${automation.color}, ${alpha(automation.color, 0.7)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 24,
              mr: 2
            }}
          >
            {automation.emoji}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              {automation.title}
            </Typography>
            <Chip
              label={`Saves ${automation.estimatedSavings}`}
              size="small"
              sx={{
                backgroundColor: alpha(automation.color, 0.2),
                color: automation.color,
                fontWeight: 600
              }}
            />
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
          {automation.description}
        </Typography>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<MagicIcon />}
          onClick={() => handleStartSetup(automation)}
          sx={{
            background: `linear-gradient(135deg, ${automation.color}, ${alpha(automation.color, 0.8)})`,
            color: 'white',
            fontWeight: 600,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(automation.color, 0.9)}, ${alpha(automation.color, 0.7)})`,
            }
          }}
        >
          Set Up in 30 Seconds
        </Button>
      </CardContent>
    </Card>
  );

  const renderSetupDialog = () => {
    if (!selectedAutomation) return null;

    return (
      <Dialog
        open={setupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 32 }}>{selectedAutomation.emoji}</Box>
            <Box>
              <Typography variant="h6">{selectedAutomation.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                Step {setupStep + 1} of {selectedAutomation.setupSteps.length}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {!setupComplete ? (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                {selectedAutomation.setupSteps[setupStep]}
              </Alert>

              {/* Render setup form based on automation type */}
              {selectedAutomation.id === 'birthday-assistant' && setupStep === 1 && (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Birthday Email Template"
                  value={config.emailTemplate || ''}
                  onChange={(e) => setConfig({...config, emailTemplate: e.target.value})}
                  sx={{ mb: 2 }}
                />
              )}

              {selectedAutomation.id === 'welcome-sequence' && setupStep === 1 && (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Welcome Email Template"
                    value={config.emailTemplate || ''}
                    onChange={(e) => setConfig({...config, emailTemplate: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Send Delay</InputLabel>
                    <Select
                      value={config.delayHours || 1}
                      onChange={(e) => setConfig({...config, delayHours: e.target.value})}
                    >
                      <MenuItem value={0}>Immediately</MenuItem>
                      <MenuItem value={1}>After 1 hour</MenuItem>
                      <MenuItem value={24}>After 1 day</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}

              {setupStep === selectedAutomation.setupSteps.length - 1 && (
                <Alert severity="success">
                  🎉 Ready to activate! Your automation will start working immediately.
                </Alert>
              )}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ fontSize: 64, mb: 2 }}>✅</Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                Automation Active!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {selectedAutomation.title} is now running and will start working immediately.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {!setupComplete && (
            <>
              <Button onClick={() => setSetupDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleNextStep}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <StartIcon />}
              >
                {setupStep === selectedAutomation.setupSteps.length - 1 ? 'Activate Automation' : 'Next Step'}
              </Button>
            </>
          )}
          {setupComplete && (
            <Button
              variant="contained"
              onClick={() => {
                setSetupDialogOpen(false);
                window.location.reload(); // Refresh to show new automation
              }}
            >
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          ✨ Magic Automation Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          One-click automations that work instantly. No setup headaches.
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          <strong>How it works:</strong> Click any automation below → Answer 2-3 simple questions → It starts working immediately!
        </Alert>
      </Box>

      {/* Magic Cards Grid */}
      <Grid container spacing={3}>
        {MAGIC_AUTOMATIONS.map((automation) => (
          <Grid item xs={12} md={6} lg={4} key={automation.id}>
            {renderMagicCard(automation)}
          </Grid>
        ))}
      </Grid>

      {/* Setup Dialog */}
      {renderSetupDialog()}
    </Box>
  );
};

export default MagicButtonGallery;
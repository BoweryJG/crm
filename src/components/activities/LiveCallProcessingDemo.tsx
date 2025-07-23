import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AudioFile as AudioIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  TrendingUp as InsightIcon,
  People as ContactIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Simulated processing of the Greg Pedro call
const LiveCallProcessingDemo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioFile = {
    name: 'Cindi Pedro how do organize urls 2025-06-19_09_38_42.mp3',
    size: '28.4 MB',
    duration: '24:18'
  };


  const transcriptSnippet = `
CINDI: "Hey, good morning. We're just driving in. I wanted to ask you about current website stuff that we're trying to manage. You know how we're all over the place with About Face..."

JASON: "Looking at your GoDaddy account right now. You have seven websites, ten domains..."

CINDI: "The TMJ website has been getting attention. People are finding us now not just through referral offices, but on Google search..."

JASON: "What makes it hard is that infrastructure doesn't exist. I don't know how many people are going there, how many called, how many were missed..."

CINDI: "Dr. Pedro has had six consultations last week and nobody has booked..."

JASON: "That statement alone should align your desires. How do we capture that information?"
  `;

  const extractedInsights = [
    {
      type: 'revenue',
      icon: <MoneyIcon />,
      title: 'Lost Revenue Identified',
      detail: '$180,000 potential revenue lost (6 consultations × $30K Yomi implant cases)',
      severity: 'critical'
    },
    {
      type: 'problem',
      icon: <WarningIcon />,
      title: 'Digital Chaos',
      detail: '10+ domains, 7 websites, only 3 active. WordPress site hacked with Russian bots.',
      severity: 'high'
    },
    {
      type: 'opportunity',
      icon: <InsightIcon />,
      title: 'TMJ Traffic Success',
      detail: '20,000+ visitors on TMJ site, last 7 patients from Google',
      severity: 'positive'
    },
    {
      type: 'solution',
      icon: <CheckIcon />,
      title: 'Consolidation Agreement',
      detail: 'Agreed to consolidate all properties to gregpedromd.com with automated lead capture',
      severity: 'success'
    }
  ];

  const handleProcess = () => {
    setProcessing(true);
    // Simulate processing steps
    setTimeout(() => {
      setActiveStep(1);
      setTimeout(() => {
        setActiveStep(2);
        setTimeout(() => {
          setActiveStep(3);
          setProcessing(false);
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'positive': return 'info';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Process Call Recording - Live Demo
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          This demonstrates how the audio file from your call with Cindi Pedro would be processed
        </Alert>

        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Upload */}
          <Step>
            <StepLabel>Upload Audio File</StepLabel>
            <StepContent>
              <Paper sx={{ p: 3, bgcolor: 'grey.50', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AudioIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{audioFile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {audioFile.size} | Duration: {audioFile.duration}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              <Button 
                variant="contained" 
                onClick={handleProcess}
                startIcon={<UploadIcon />}
                disabled={processing}
              >
                Process Audio File
              </Button>
            </StepContent>
          </Step>

          {/* Step 2: Transcribe */}
          <Step>
            <StepLabel>Transcribe Audio</StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={activeStep >= 2 ? 100 : 50} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Using OpenAI Whisper to convert 24 minutes of audio to text...
                </Typography>
              </Box>
              
              {activeStep >= 2 && (
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                      Transcript Preview
                    </Typography>
                    <IconButton size="small" onClick={() => setShowTranscript(!showTranscript)}>
                      <ExpandIcon sx={{ transform: showTranscript ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </IconButton>
                  </Box>
                  <Collapse in={showTranscript}>
                    <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {transcriptSnippet}
                    </Typography>
                  </Collapse>
                </Paper>
              )}
            </StepContent>
          </Step>

          {/* Step 3: Analyze */}
          <Step>
            <StepLabel>Analyze Conversation</StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                AI extracting business insights, pain points, and action items...
              </Typography>
              
              {activeStep >= 3 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Extracted Insights:
                  </Typography>
                  <List>
                    {extractedInsights.map((insight, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `${getSeverityColor(insight.severity)}.light`, width: 36, height: 36 }}>
                            {insight.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={insight.title}
                          secondary={insight.detail}
                        />
                        <Chip 
                          label={insight.severity}
                          size="small"
                          color={getSeverityColor(insight.severity) as any}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </StepContent>
          </Step>

          {/* Step 4: Save */}
          <Step>
            <StepLabel>Save to CRM</StepLabel>
            <StepContent>
              <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
                Call analysis saved successfully!
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Updated Records:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><ContactIcon /></ListItemIcon>
                        <ListItemText primary="Dr. Greg Pedro" secondary="Contact updated with call notes" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><ContactIcon /></ListItemIcon>
                        <ListItemText primary="Cindi Weiss" secondary="Added as new contact" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="Practice updated" secondary="Added digital properties info" />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Created Items:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Call Analysis Record" 
                          secondary="24-min strategy discussion"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Sales Activity" 
                          secondary="Marked as successful"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Follow-up Tasks" 
                          secondary="5 action items created"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🔴 Critical Action Required:
                </Typography>
                <Typography variant="body2">
                  Lost $180,000 in potential revenue last week. Immediate implementation of lead capture system recommended.
                </Typography>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" startIcon={<CheckIcon />}>
                  View Full Analysis
                </Button>
                <Button variant="outlined">
                  Create Follow-up Tasks
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>

        {/* Summary Stats */}
        {activeStep === 4 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Processing Complete
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Words Transcribed</Typography>
                <Typography variant="h4">3,847</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Insights Found</Typography>
                <Typography variant="h4">12</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Action Items</Typography>
                <Typography variant="h4">5</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">Revenue at Risk</Typography>
                <Typography variant="h4" color="error">$180K</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveCallProcessingDemo;
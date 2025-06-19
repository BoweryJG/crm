import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Divider,
  Paper,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingDown as LostRevenueIcon,
  Web as WebsiteIcon,
  BugReport as BugIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Psychology as InsightIcon,
  Speed as UrgencyIcon,
  Construction as SolutionIcon,
  Domain as DomainIcon,
  Security as SecurityIcon,
  Group as TeamIcon,
  Lightbulb as IdeaIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Demo data based on the actual Greg Pedro call
const callAnalysisData = {
  id: 'c3d4e5f6-a7b8-9012-cdef-345678901234-v2',
  title: 'Website Consolidation Strategy Call - Multiple Digital Properties Discussion',
  date: '2025-06-19 09:38:42',
  duration: 24,
  participants: [
    { name: 'Cindi Weiss', role: 'Office Manager', avatar: 'CW' },
    { name: 'Jason', role: 'Digital Strategist', avatar: 'J' },
    { name: 'Dr. Greg Pedro', role: 'Practice Owner', avatar: 'GP', mentioned: true }
  ],
  sentiment: {
    score: 0.4,
    label: 'Mixed',
    breakdown: {
      frustration: 0.6,
      hope: 0.7,
      urgency: 0.9,
      trust: 0.8
    }
  },
  keyMetrics: {
    lostRevenue: 180000,
    lostConsultations: 6,
    conversionRate: 0,
    tmjTraffic: 20000,
    implantValue: 30000,
    totalDomains: 10,
    activeWebsites: 3,
    googleRating: 4.8,
    reviewCount: 150
  },
  painPoints: [
    {
      issue: 'Lost 6 implant consultations - $180K potential revenue',
      severity: 'critical',
      icon: <LostRevenueIcon />
    },
    {
      issue: 'Managing 10+ domains causing confusion',
      severity: 'high',
      icon: <DomainIcon />
    },
    {
      issue: 'WordPress site hacked - Russian bot spam',
      severity: 'high',
      icon: <SecurityIcon />
    },
    {
      issue: 'No lead tracking or follow-up system',
      severity: 'critical',
      icon: <AnalyticsIcon />
    },
    {
      issue: 'Team conflicts on digital strategy',
      severity: 'medium',
      icon: <TeamIcon />
    }
  ],
  discoveries: [
    {
      category: 'Traffic Success',
      finding: 'TMJ site generating 20,000+ visitors',
      impact: 'Last 7 patients from Google searches'
    },
    {
      category: 'Revenue Opportunity',
      finding: 'Yomi implant cases worth $30K each',
      impact: 'One case covers monthly expenses'
    },
    {
      category: 'Trust Signal',
      finding: '150+ Google reviews with 4.8 stars',
      impact: 'Major credibility being underutilized'
    }
  ],
  websites: [
    { name: 'TMJ-site.com', status: 'active', performance: 'high', traffic: 20000 },
    { name: 'aboutfacedentalspa.com', status: 'hacked', performance: 'poor', age: '3-5 years' },
    { name: 'roboticimplantnyc.com', status: 'active', performance: 'low', traffic: 58 },
    { name: 'gregpedromd.com', status: 'new', performance: 'ready', type: 'React' },
    { name: '6+ other domains', status: 'dormant', performance: 'none' }
  ],
  nextSteps: [
    {
      action: 'Consolidate all domains to gregpedromd.com',
      priority: 'immediate',
      owner: 'Jason'
    },
    {
      action: 'Implement automated lead capture',
      priority: 'immediate',
      owner: 'Jason'
    },
    {
      action: 'Set up instant notification system',
      priority: 'immediate',
      owner: 'Jason'
    },
    {
      action: 'Send activation link for payment',
      priority: 'today',
      owner: 'Jason'
    }
  ],
  linguisticInsights: [
    '"All we need is one stinking implant case to cover expenses" - Financial pressure',
    '"You know" used 47 times - Seeking validation and agreement',
    'Driving during call - Urgency and multitasking stress',
    'Confusion mentioned 8 times - Primary emotional state',
    'Trust in expertise: "You know better"'
  ]
};

const CallTranscriptAnalysis: React.FC = () => {
  const theme = useTheme();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.palette.error.main;
      case 'high': return theme.palette.warning.main;
      case 'medium': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'hacked': return theme.palette.error.main;
      case 'new': return theme.palette.info.main;
      case 'dormant': return theme.palette.grey[400];
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h4" gutterBottom>
                Call Intelligence Report
              </Typography>
              <Typography variant="h6">
                {callAnalysisData.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip 
                  icon={<PhoneIcon />} 
                  label={`${callAnalysisData.duration} minutes`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  label={callAnalysisData.date}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Box>
            <AvatarGroup max={4}>
              {callAnalysisData.participants.map((p, i) => (
                <Tooltip key={i} title={`${p.name} - ${p.role}`}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {p.avatar}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Critical Alert */}
      <Alert 
        severity="error" 
        icon={<LostRevenueIcon />}
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            View Action Plan
          </Button>
        }
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Critical: $180,000 in Lost Revenue Last Week
        </Typography>
        <Typography variant="body2">
          6 implant consultations with 0% conversion rate. Immediate action required on lead capture system.
        </Typography>
      </Alert>

      {/* Key Metrics Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.error.light }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Lost Revenue
              </Typography>
              <Typography variant="h4">
                ${callAnalysisData.keyMetrics.lostRevenue.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                6 consultations × $30K
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.success.light }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                TMJ Traffic
              </Typography>
              <Typography variant="h4">
                {callAnalysisData.keyMetrics.tmjTraffic.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Top performing asset
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.warning.light }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Digital Properties
              </Typography>
              <Typography variant="h4">
                {callAnalysisData.keyMetrics.totalDomains}+
              </Typography>
              <Typography variant="caption">
                Only 3 active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: theme.palette.info.light }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Google Reviews
              </Typography>
              <Typography variant="h4">
                {callAnalysisData.keyMetrics.reviewCount}+
              </Typography>
              <Typography variant="caption">
                {callAnalysisData.keyMetrics.googleRating} star rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pain Points & Solutions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon color="error" />
                Critical Pain Points
              </Typography>
              <List>
                {callAnalysisData.painPoints.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getSeverityColor(point.severity), width: 36, height: 36 }}>
                        {point.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText 
                      primary={point.issue}
                      secondary={`Severity: ${point.severity}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SolutionIcon color="primary" />
                Solution Timeline
              </Typography>
              <Timeline>
                {callAnalysisData.nextSteps.map((step, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                      {step.priority}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={index === 0 ? 'error' : 'primary'} />
                      {index < callAnalysisData.nextSteps.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body1">{step.action}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Owner: {step.owner}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Website Analysis */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WebsiteIcon />
            Digital Properties Analysis
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {callAnalysisData.websites.map((site, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  p: 2, 
                  minWidth: 200,
                  borderLeft: `4px solid ${getStatusColor(site.status)}`
                }}
              >
                <Typography variant="subtitle2">{site.name}</Typography>
                <Chip 
                  label={site.status} 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    bgcolor: getStatusColor(site.status),
                    color: 'white'
                  }} 
                />
                {site.traffic && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Traffic: {site.traffic.toLocaleString()}
                  </Typography>
                )}
                {site.performance && (
                  <Typography variant="caption" display="block">
                    Performance: {site.performance}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Linguistic Insights */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InsightIcon />
            Linguistic & Behavioral Insights
          </Typography>
          <List>
            {callAnalysisData.linguisticInsights.map((insight, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <IdeaIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={insight} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" startIcon={<EmailIcon />}>
          View Follow-up Email
        </Button>
        <Button variant="contained" startIcon={<CheckIcon />}>
          Mark Actions Complete
        </Button>
      </Box>
    </Box>
  );
};

export default CallTranscriptAnalysis;
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Psychology,
  Speaker as SpeakerIcon,
  Timer as TimerIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  PersonSearch as PersonSearchIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { 
  ComprehensiveLinguisticsAnalysis,
  PsychologicalProfile,
  ConversationDynamics,
  PowerAnalysis,
  SalesInsights
} from '../../services/linguistics/advancedLinguisticsService';
import { useThemeContext } from '../../themes/ThemeContext';
import { AviationDashboard } from '../gauges/AviationGauges';

interface LinguisticsAnalysisCardProps {
  analysis: ComprehensiveLinguisticsAnalysis;
  onViewDetails?: () => void;
}

const LinguisticsAnalysisCard: React.FC<LinguisticsAnalysisCardProps> = ({
  analysis,
  onViewDetails
}) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getPersonalityIcon = (type: PsychologicalProfile['personalityType']) => {
    switch (type) {
      case 'analytical': return <Psychology color="primary" />;
      case 'driver': return <TrendingUpIcon color="secondary" />;
      case 'expressive': return <SpeakerIcon color="info" />;
      case 'amiable': return <PersonSearchIcon color="success" />;
      default: return <Psychology />;
    }
  };

  const getPowerDynamicIcon = (dynamic: PowerAnalysis['overallPowerDynamic']) => {
    switch (dynamic) {
      case 'rep_dominant': return <TrendingUpIcon color="success" />;
      case 'prospect_dominant': return <TrendingDownIcon color="error" />;
      default: return <TrendingFlatIcon color="warning" />;
    }
  };

  const formatScore = (score: number): string => {
    return `${Math.round(score * 10) / 10}`;
  };

  const getScoreColor = (score: number, max: number = 100): string => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return theme.palette.success.main;
    if (percentage >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        backgroundColor: themeMode === 'space'
          ? 'rgba(22, 27, 44, 0.7)'
          : theme.palette.background.paper,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${
          themeMode === 'space'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.06)'
        }`,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Conversational Intelligence Analysis
            </Typography>
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip
              label={analysis.overallSentiment.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getSentimentColor(analysis.overallSentiment),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip
              label={`${formatScore(analysis.confidenceScore)}% Confidence`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        }
        action={
          onViewDetails && (
            <Tooltip title="View Full Analysis">
              <IconButton onClick={onViewDetails}>
                <TimelineIcon />
              </IconButton>
            </Tooltip>
          )
        }
      />

      <CardContent>
        {/* Aviation Gauges for Luxury Theme */}
        {themeMode === 'luxury' ? (
          <Box sx={{ mb: 3 }}>
            <AviationDashboard
              metrics={{
                winProbability: analysis.salesInsights.winProbability,
                persuasionScore: analysis.powerAnalysis.persuasionEffectiveness,
                talkTimeRatio: analysis.conversationDynamics.talkTimeRatio.rep,
                confidence: analysis.confidenceScore
              }}
              size="medium"
            />
          </Box>
        ) : (
          /* Key Metrics Overview for Other Themes */
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {formatScore(analysis.salesInsights.winProbability)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Win Probability
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h4" color="secondary" fontWeight="bold">
                  {analysis.conversationDynamics.talkTimeRatio.rep}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Rep Talk Time
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {analysis.powerAnalysis.persuasionEffectiveness}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Persuasion Score
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {analysis.keyMoments.filter(m => m.significance === 'critical').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Critical Moments
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Accordion Sections */}
        
        {/* Psychological Profile */}
        <Accordion 
          expanded={expandedPanel === 'psychology'} 
          onChange={handleAccordionChange('psychology')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getPersonalityIcon(analysis.psychologicalProfile.personalityType)}
              <Typography variant="subtitle1" fontWeight="medium">
                Psychological Profile
              </Typography>
              <Chip 
                label={analysis.psychologicalProfile.personalityType.toUpperCase()} 
                size="small" 
                color="primary"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Personality Traits</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Decision Making Style" 
                      secondary={analysis.psychologicalProfile.decisionMakingStyle} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Communication Style" 
                      secondary={analysis.psychologicalProfile.communicationStyle} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Risk Tolerance" 
                      secondary={analysis.psychologicalProfile.riskTolerance} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Price Sensitivity" 
                      secondary={analysis.psychologicalProfile.pricesensitivity} 
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Key Insights</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Trust Factors:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {analysis.psychologicalProfile.trustFactors.map((factor, index) => (
                      <Chip key={index} label={factor} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Motivational Triggers:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {analysis.psychologicalProfile.motivationalTriggers.map((trigger, index) => (
                      <Chip key={index} label={trigger} size="small" color="success" />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Conversation Dynamics */}
        <Accordion 
          expanded={expandedPanel === 'dynamics'} 
          onChange={handleAccordionChange('dynamics')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeakerIcon color="secondary" />
              <Typography variant="subtitle1" fontWeight="medium">
                Conversation Dynamics
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Talk Time Distribution</Typography>
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Rep</Typography>
                    <Typography variant="body2">{analysis.conversationDynamics.talkTimeRatio.rep}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysis.conversationDynamics.talkTimeRatio.rep}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Prospect</Typography>
                    <Typography variant="body2">{analysis.conversationDynamics.talkTimeRatio.prospect}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={analysis.conversationDynamics.talkTimeRatio.prospect}
                    color="secondary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Question Technique</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Open Questions" 
                      secondary={analysis.conversationDynamics.questioningTechnique.openQuestions} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Closed Questions" 
                      secondary={analysis.conversationDynamics.questioningTechnique.closedQuestions} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Leading Questions" 
                      secondary={analysis.conversationDynamics.questioningTechnique.leadingQuestions} 
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Interruption Pattern</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="primary">
                    {analysis.conversationDynamics.interruptionPattern.repInterruptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Rep Interruptions</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" color="secondary">
                    {analysis.conversationDynamics.interruptionPattern.prospectInterruptions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Prospect Interruptions</Typography>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Power Analysis */}
        <Accordion 
          expanded={expandedPanel === 'power'} 
          onChange={handleAccordionChange('power')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getPowerDynamicIcon(analysis.powerAnalysis.overallPowerDynamic)}
              <Typography variant="subtitle1" fontWeight="medium">
                Power Dynamics
              </Typography>
              <Chip 
                label={analysis.powerAnalysis.overallPowerDynamic.replace('_', ' ').toUpperCase()} 
                size="small" 
                color="info"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Influence Techniques</Typography>
                <Box sx={{ space: 1 }}>
                  {Object.entries(analysis.powerAnalysis.influenceTechniques).map(([technique, score]) => (
                    <Box key={technique} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {technique}
                        </Typography>
                        <Typography variant="body2">{score}/10</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(score / 10) * 100}
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(score, 10)
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Control Moments</Typography>
                <List dense>
                  {analysis.powerAnalysis.controlMoments.slice(0, 3).map((moment, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {moment.controlShift === 'to_rep' ? 
                          <TrendingUpIcon color="success" /> : 
                          <TrendingDownIcon color="error" />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={moment.trigger}
                        secondary={`${moment.timestamp} - ${moment.impact} impact`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Sales Insights */}
        <Accordion 
          expanded={expandedPanel === 'sales'} 
          onChange={handleAccordionChange('sales')}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon color="warning" />
              <Typography variant="subtitle1" fontWeight="medium">
                Sales Insights
              </Typography>
              <Chip 
                label={analysis.salesInsights.callStage.replace('_', ' ').toUpperCase()} 
                size="small" 
                color="warning"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Buying Signals</Typography>
                <List dense>
                  {analysis.salesInsights.buyingSignals.map((signal, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon 
                          color={signal.strength === 'strong' ? 'success' : 
                                signal.strength === 'medium' ? 'warning' : 'info'} 
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={signal.signal}
                        secondary={`${signal.strength} signal at ${signal.timestamp}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Objections</Typography>
                <List dense>
                  {analysis.salesInsights.objections.map((objection, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <WarningIcon color={objection.handled ? 'success' : 'error'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={objection.type.replace('_', ' ').toUpperCase()}
                        secondary={`${objection.handled ? 'Handled' : 'Unresolved'} - ${objection.effectiveness}% effective`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Next Best Actions</Typography>
                <List dense>
                  {analysis.salesInsights.nextBestActions.slice(0, 3).map((action, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LightbulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Coaching Opportunities */}
        <Accordion 
          expanded={expandedPanel === 'coaching'} 
          onChange={handleAccordionChange('coaching')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon color="info" />
              <Typography variant="subtitle1" fontWeight="medium">
                Coaching Opportunities
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {analysis.coachingOpportunities.map((opportunity, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">{opportunity.area}</Typography>
                      <Chip 
                        label={opportunity.priority.toUpperCase()} 
                        size="small"
                        color={opportunity.priority === 'high' ? 'error' : 
                               opportunity.priority === 'medium' ? 'warning' : 'info'}
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={opportunity.currentLevel}
                      sx={{ mb: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Current Level: {opportunity.currentLevel}%
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {opportunity.improvement}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default LinguisticsAnalysisCard;
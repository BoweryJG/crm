import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentSatisfied as HappyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Import the interaction data
import interactionData from '../../../greg_pedro_interaction_history_updated.json';

const GregPedroInteractionTimeline: React.FC = () => {
  const getSentimentIcon = (sentiment: string) => {
    if (sentiment.toLowerCase().includes('negative')) return <SadIcon />;
    if (sentiment.toLowerCase().includes('positive')) return <HappyIcon />;
    return <WarningIcon />;
  };

  const getSentimentColor = (sentiment: string): 'error' | 'success' | 'warning' => {
    if (sentiment.toLowerCase().includes('negative')) return 'error';
    if (sentiment.toLowerCase().includes('positive')) return 'success';
    return 'warning';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Critical Status Alert */}
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Critical Account Status</Typography>
        <Typography variant="body2">
          Relationship at risk. Practice hemorrhaging $40k/month. Trust severely damaged. 
          Immediate intervention required.
        </Typography>
      </Alert>

      {/* Client Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Dr. Greg Pedro MD & Cindi Weiss
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip label="$40k/month overhead" color="error" icon={<MoneyIcon />} />
            <Chip label="$180k lost opportunities" color="warning" icon={<TrendingDownIcon />} />
            <Chip label="Using retirement funds" color="error" />
            <Chip label="150+ reviews (4.8★)" color="success" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {interactionData.practice.address} • {interactionData.practice.website}
          </Typography>
        </CardContent>
      </Card>

      {/* Financial Crisis Summary */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
        <Typography variant="h6" gutterBottom>Financial Crisis Summary</Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Monthly Overhead"
              secondary={`$${interactionData.business_metrics.financial.monthly_overhead}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Failed Investments"
              secondary="Carrillo Website: $25k | BTL Equipment: $16k/mo | Yomi: $200k"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Recent Lost Revenue"
              secondary="6 implant consultations = $180,000 potential (0% conversion)"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Interaction Timeline */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Interaction Timeline
      </Typography>
      
      <Timeline position="alternate">
        {interactionData.interactions.map((interaction, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary">
              <Typography variant="body2">
                {format(new Date(interaction.date), 'MMM d, yyyy')}
              </Typography>
              <Typography variant="caption">
                {interaction.duration}
              </Typography>
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot color={getSentimentColor(interaction.sentiment || 'Mixed')}>
                {getSentimentIcon(interaction.sentiment || 'Mixed')}
              </TimelineDot>
              {index < interactionData.interactions.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            
            <TimelineContent>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3">
                    {interaction.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {interaction.participants.join(' & ')}
                  </Typography>
                  
                  {/* Key Topics */}
                  {interaction.key_topics && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                      {interaction.key_topics.slice(0, 3).map((topic, i) => (
                        <Chip 
                          key={i} 
                          label={topic} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  {/* Critical Issues for Latest Call */}
                  {interaction.relationship_red_flags && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Relationship Red Flags:
                      </Typography>
                      <List dense>
                        {interaction.relationship_red_flags.slice(0, 2).map((flag, i) => (
                          <ListItem key={i} sx={{ py: 0 }}>
                            <Typography variant="caption">• {flag}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Alert>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" fontWeight="bold">
                    Outcome:
                  </Typography>
                  <Typography variant="body2">
                    {interaction.outcome}
                  </Typography>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {/* Sales Rep Performance Alert */}
      <Alert severity="error" sx={{ mt: 3 }}>
        <Typography variant="h6">Sales Rep Performance: 4/10</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Critical Issues: Zero empathy for financial crisis, defensive behavior, 
          over-promising without delivery, threatening to end relationship.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          Immediate Actions Required:
        </Typography>
        <List dense>
          <ListItem>• Apologize to Cindi immediately</ListItem>
          <ListItem>• Deliver ONE working feature in 48 hours</ListItem>
          <ListItem>• Shift from feature-selling to problem-solving</ListItem>
          <ListItem>• Tie payment to results, not time</ListItem>
        </List>
      </Alert>
    </Box>
  );
};

export default GregPedroInteractionTimeline;
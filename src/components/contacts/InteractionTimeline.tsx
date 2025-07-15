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
  Paper,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Warning as WarningIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentSatisfied as HappyIcon,
  SentimentNeutral as NeutralIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Generic interaction data types
export interface ContactInteraction {
  date: string;
  type: string;
  duration: string;
  participants: string[];
  sentiment?: string;
  key_topics?: string[];
  pain_points?: Array<{
    issue: string;
    details: string;
    impact?: string;
  }>;
  relationship_red_flags?: string[];
  outcome: string;
  notes?: string[];
}

export interface ContactSummary {
  name: string;
  role?: string;
  company?: string;
  status?: 'active' | 'at_risk' | 'inactive';
  metrics?: {
    [key: string]: string | number;
  };
}

interface InteractionTimelineProps {
  contact: ContactSummary;
  interactions: ContactInteraction[];
  showFinancials?: boolean;
  onInteractionClick?: (interaction: ContactInteraction) => void;
}

const InteractionTimeline: React.FC<InteractionTimelineProps> = ({
  contact,
  interactions,
  showFinancials = true,
  onInteractionClick
}) => {
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);

  const getSentimentIcon = (sentiment?: string) => {
    if (!sentiment) return <NeutralIcon />;
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('negative')) return <SadIcon />;
    if (lowerSentiment.includes('positive')) return <HappyIcon />;
    if (lowerSentiment.includes('critical')) return <ErrorIcon />;
    return <NeutralIcon />;
  };

  const getSentimentColor = (sentiment?: string): 'error' | 'success' | 'warning' | 'info' => {
    if (!sentiment) return 'info';
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('negative') || lowerSentiment.includes('critical')) return 'error';
    if (lowerSentiment.includes('positive')) return 'success';
    return 'warning';
  };

  const getStatusColor = (status?: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'at_risk': return 'error';
      case 'inactive': return 'warning';
      case 'active': return 'success';
      default: return 'default';
    }
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Status Alert */}
      {contact.status === 'at_risk' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Critical Account Status</Typography>
          <Typography variant="body2">
            This account requires immediate attention. Review recent interactions and take action.
          </Typography>
        </Alert>
      )}

      {/* Contact Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {contact.name}
            </Typography>
            {contact.status && (
              <Chip 
                label={contact.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(contact.status)}
                size="small"
              />
            )}
          </Box>
          
          {contact.role && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {contact.role} {contact.company && `at ${contact.company}`}
            </Typography>
          )}
          
          {/* Metrics Display */}
          {showFinancials && contact.metrics && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              {Object.entries(contact.metrics).map(([key, value]) => (
                <Chip 
                  key={key}
                  label={`${key}: ${value}`} 
                  size="small"
                  color={key.toLowerCase().includes('risk') || key.toLowerCase().includes('lost') ? 'error' : 'default'}
                  icon={key.toLowerCase().includes('revenue') || key.toLowerCase().includes('cost') ? <MoneyIcon /> : undefined}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Interaction Timeline */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Interaction History
      </Typography>
      
      <Timeline position="alternate">
        {interactions.map((interaction, index) => {
          const isExpanded = expandedItems.includes(index);
          const sentimentColor = getSentimentColor(interaction.sentiment);
          
          return (
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
                <TimelineDot color={sentimentColor}>
                  {getSentimentIcon(interaction.sentiment)}
                </TimelineDot>
                {index < interactions.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent>
                <Card 
                  sx={{ 
                    cursor: onInteractionClick ? 'pointer' : 'default',
                    '&:hover': onInteractionClick ? { boxShadow: 3 } : {}
                  }}
                  onClick={() => onInteractionClick?.(interaction)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" component="h3">
                        {interaction.type}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(index);
                        }}
                      >
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {interaction.participants.join(' & ')}
                    </Typography>
                    
                    {/* Key Topics */}
                    {interaction.key_topics && interaction.key_topics.length > 0 && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        {interaction.key_topics.slice(0, 3).map((topic, i) => (
                          <Chip 
                            key={i} 
                            label={topic} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                        {interaction.key_topics.length > 3 && (
                          <Chip 
                            label={`+${interaction.key_topics.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}
                    
                    {/* Outcome */}
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      Outcome:
                    </Typography>
                    <Typography variant="body2">
                      {interaction.outcome}
                    </Typography>
                    
                    {/* Expanded Content */}
                    <Collapse in={isExpanded}>
                      <Box sx={{ mt: 2 }}>
                        {/* Pain Points */}
                        {interaction.pain_points && interaction.pain_points.length > 0 && (
                          <>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Pain Points Identified:
                            </Typography>
                            <List dense>
                              {interaction.pain_points.map((point, i) => (
                                <ListItem key={i} sx={{ py: 0 }}>
                                  <ListItemText
                                    primary={point.issue}
                                    secondary={point.details}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                        
                        {/* Red Flags */}
                        {interaction.relationship_red_flags && interaction.relationship_red_flags.length > 0 && (
                          <Alert severity="error" sx={{ mt: 2 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Relationship Red Flags:
                            </Typography>
                            <List dense>
                              {interaction.relationship_red_flags.map((flag, i) => (
                                <ListItem key={i} sx={{ py: 0 }}>
                                  <Typography variant="caption">• {flag}</Typography>
                                </ListItem>
                              ))}
                            </List>
                          </Alert>
                        )}
                        
                        {/* Additional Notes */}
                        {interaction.notes && interaction.notes.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" fontWeight="bold" gutterBottom>
                              Additional Notes:
                            </Typography>
                            {interaction.notes.map((note, i) => (
                              <Typography key={i} variant="body2" paragraph>
                                {note}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default InteractionTimeline;
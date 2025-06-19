import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
  Button,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Collapse,
  Alert
} from '@mui/material';
import {
  Phone as PhoneIcon,
  AccessTime as DurationIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Analytics as AnalyticsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayIcon,
  Description as TranscriptIcon,
  Label as LabelIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  HelpOutline as UndecidedIcon,
  FollowTheSignsOutlined as FollowUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

interface CallAnalysis {
  id: string;
  title: string;
  call_date: string;
  duration: number;
  summary: string;
  sentiment_score: number;
  tags: string[];
  recording_url?: string;
  transcript?: string;
  linguistics_analysis_id?: string;
}

interface ActivityDetail {
  id: string;
  type: string;
  contact_id: string;
  practice_id: string;
  date: string;
  duration?: number;
  notes: string;
  outcome: string;
  next_steps?: string;
  user_id?: string;
  call_analysis_id?: string;
  contact?: {
    first_name: string;
    last_name: string;
    title: string;
    email: string;
  };
  practice?: {
    name: string;
    city: string;
    state: string;
  };
  call_analysis?: CallAnalysis;
}

interface ActivityDetailViewProps {
  activity: ActivityDetail;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActivityDetailView: React.FC<ActivityDetailViewProps> = ({
  activity,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    analysis: true,
    transcript: false,
    nextSteps: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.3) return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
    if (score < -0.3) return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
    return <TrendingFlatIcon sx={{ color: theme.palette.warning.main }} />;
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'successful':
        return <CheckIcon sx={{ color: theme.palette.success.main }} />;
      case 'unsuccessful':
        return <CancelIcon sx={{ color: theme.palette.error.main }} />;
      case 'follow_up_required':
        return <FollowUpIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return <UndecidedIcon sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card elevation={2}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
              <PhoneIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {activity.call_analysis?.title || 'Call Activity'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {format(new Date(activity.date), 'PPP p')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onEdit && (
              <Button size="small" onClick={onEdit}>Edit</Button>
            )}
            {onDelete && (
              <Button size="small" color="error" onClick={onDelete}>Delete</Button>
            )}
          </Box>
        </Box>

        {/* Basic Info */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Contact</Typography>
              <Typography variant="body2">
                {activity.contact ? 
                  `${activity.contact.first_name} ${activity.contact.last_name}` : 
                  'Unknown Contact'}
              </Typography>
              {activity.contact?.title && (
                <Typography variant="caption" color="text.secondary">
                  {activity.contact.title}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Practice</Typography>
              <Typography variant="body2">
                {activity.practice?.name || 'Unknown Practice'}
              </Typography>
              {activity.practice && (
                <Typography variant="caption" color="text.secondary">
                  {activity.practice.city}, {activity.practice.state}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DurationIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Duration</Typography>
              <Typography variant="body2">{formatDuration(activity.duration)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getOutcomeIcon(activity.outcome)}
            <Box>
              <Typography variant="caption" color="text.secondary">Outcome</Typography>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {activity.outcome.replace(/_/g, ' ')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Call Analysis Section */}
        {activity.call_analysis && (
          <>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                py: 1
              }}
              onClick={() => toggleSection('analysis')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Call Analysis
                </Typography>
                <Chip
                  icon={getSentimentIcon(activity.call_analysis.sentiment_score)}
                  label={getSentimentLabel(activity.call_analysis.sentiment_score)}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <IconButton size="small">
                {expandedSections.analysis ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expandedSections.analysis}>
              <Box sx={{ mt: 2 }}>
                {/* Summary */}
                {activity.call_analysis.summary && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Summary
                    </Typography>
                    <Typography variant="body1">
                      {activity.call_analysis.summary}
                    </Typography>
                  </Box>
                )}

                {/* Tags */}
                {activity.call_analysis.tags && activity.call_analysis.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Key Topics
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {activity.call_analysis.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          icon={<LabelIcon />}
                          label={tag}
                          size="small"
                          variant="filled"
                          sx={{ bgcolor: theme.palette.grey[200] }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Recording */}
                {activity.call_analysis.recording_url && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      startIcon={<PlayIcon />}
                      variant="outlined"
                      size="small"
                      href={activity.call_analysis.recording_url}
                      target="_blank"
                    >
                      Listen to Recording
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        )}

        {/* Notes Section */}
        {activity.notes && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Notes
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {activity.notes}
            </Typography>
          </Box>
        )}

        {/* Next Steps Section */}
        {activity.next_steps && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                py: 1
              }}
              onClick={() => toggleSection('nextSteps')}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Next Steps
              </Typography>
              <IconButton size="small">
                {expandedSections.nextSteps ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.nextSteps}>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {activity.next_steps}
                </Typography>
              </Alert>
            </Collapse>
          </>
        )}

        {/* Transcript Section */}
        {activity.call_analysis?.transcript && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                py: 1
              }}
              onClick={() => toggleSection('transcript')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TranscriptIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Transcript
                </Typography>
              </Box>
              <IconButton size="small">
                {expandedSections.transcript ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={expandedSections.transcript}>
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: theme.palette.grey[50],
                  borderRadius: 1,
                  maxHeight: 400,
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {activity.call_analysis.transcript}
                </Typography>
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDetailView;
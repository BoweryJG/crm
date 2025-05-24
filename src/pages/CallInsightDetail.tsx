// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Alert,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Psychology as PsychologyIcon,
  Timer as TimerIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon,
  Campaign as CampaignIcon,
  CompareArrows as CompareArrowsIcon,
  Speed as SpeedIcon,
  SentimentSatisfiedAlt as SentimentPositiveIcon,
  SentimentDissatisfied as SentimentNegativeIcon,
  SentimentNeutral as SentimentNeutralIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

import { useThemeContext } from '../themes/ThemeContext';
import { supabase } from '../services/supabase/supabase';
import mockDataService from '../services/mockData/mockDataService';

// This would be a real chart component in production
const SentimentChart = ({ data }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  
  // Mock chart component - in a real app, you'd use a library like recharts or chart.js
  return (
    <Box sx={{ 
      height: 200, 
      width: '100%', 
      position: 'relative',
      bgcolor: themeMode === 'space' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      borderRadius: 1,
      p: 2
    }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Sentiment Trend Throughout Call</Typography>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20, 
        height: 100,
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        {data.map((point, index) => (
          <Box 
            key={index}
            sx={{
              width: `${100 / data.length}%`,
              height: `${(point.value + 1) * 50}%`, // Convert -1 to 1 scale to 0-100%
              bgcolor: point.value > 0.3 
                ? theme.palette.success.main 
                : point.value < -0.3 
                  ? theme.palette.error.main 
                  : theme.palette.warning.main,
              mx: 0.5,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              transition: 'height 0.3s ease-in-out',
              '&:hover': {
                opacity: 0.8,
                cursor: 'pointer'
              }
            }}
          />
        ))}
      </Box>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 10, 
        left: 20, 
        right: 20,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant="caption">Start</Typography>
        <Typography variant="caption">End</Typography>
      </Box>
    </Box>
  );
};

// This would be a real chart component in production
const SpeakingPaceChart = ({ data }) => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  
  // Mock chart component
  return (
    <Box sx={{ 
      height: 200, 
      width: '100%', 
      position: 'relative',
      bgcolor: themeMode === 'space' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      borderRadius: 1,
      p: 2
    }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Speaking Pace (Words Per Minute)</Typography>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20, 
        height: 100,
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        {data.map((point, index) => (
          <Box 
            key={index}
            sx={{
              width: `${100 / data.length}%`,
              height: `${Math.min(100, (point.value / 200) * 100)}%`, // Scale WPM to percentage (max 200 WPM)
              bgcolor: point.value > 180 || point.value < 120
                ? theme.palette.warning.main 
                : theme.palette.info.main,
              mx: 0.5,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              transition: 'height 0.3s ease-in-out',
              '&:hover': {
                opacity: 0.8,
                cursor: 'pointer'
              }
            }}
          />
        ))}
      </Box>
      <Box sx={{ 
        position: 'absolute', 
        bottom: 10, 
        left: 20, 
        right: 20,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant="caption">Start</Typography>
        <Typography variant="caption">End</Typography>
      </Box>
    </Box>
  );
};

// Talk-to-Listen Ratio Visualization
const TalkListenRatio = ({ repPercentage }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Talk-to-Listen Ratio</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', height: 24, borderRadius: 1, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              width: `${repPercentage}%`, 
              bgcolor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                display: repPercentage > 15 ? 'block' : 'none'
              }}
            >
              {repPercentage}%
            </Typography>
          </Box>
          <Box 
            sx={{ 
              width: `${100 - repPercentage}%`, 
              bgcolor: theme.palette.secondary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                display: (100 - repPercentage) > 15 ? 'block' : 'none'
              }}
            >
              {100 - repPercentage}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
          <MicIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.primary.main }} />
          Rep Speaking
        </Typography>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
          <VolumeUpIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.secondary.main }} />
          Customer Speaking
        </Typography>
      </Box>
    </Box>
  );
};

// Filler Word Analysis Component
const FillerWordAnalysis = ({ fillerWords }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>Filler Word Analysis</Typography>
      
      {fillerWords.map((word, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">"{word.word}"</Typography>
            <Typography variant="body2">{word.count} times</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(100, (word.count / 10) * 100)} // Scale to percentage (max 10 occurrences)
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: word.count > 7 
                  ? theme.palette.error.main 
                  : word.count > 4 
                    ? theme.palette.warning.main 
                    : theme.palette.success.main
              }
            }}
          />
        </Box>
      ))}
      
      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>Improvement Suggestion</Typography>
        <Typography variant="body2">
          Try to reduce the use of filler words like "um" and "you know" to sound more confident and authoritative during sales calls.
          Replace these with strategic pauses which can actually enhance your message delivery.
        </Typography>
      </Box>
    </Box>
  );
};

// Key Topics Timeline Component
const KeyTopicsTimeline = ({ topics }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>Key Topics Timeline</Typography>
      
      <Box sx={{ 
        position: 'relative', 
        height: 80, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderRadius: 1,
        mt: 2,
        mb: 1
      }}>
        {/* Timeline bar */}
        <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, bgcolor: 'divider', transform: 'translateY(-50%)' }} />
        
        {/* Topic markers */}
        {topics.map((topic, index) => {
          // Calculate position as percentage of call duration
          const position = (topic.startTime / 600) * 100; // Assuming 10-minute (600 second) call
          const width = ((topic.endTime - topic.startTime) / 600) * 100;
          
          return (
            <Tooltip 
              key={index} 
              title={`${topic.topic} (${Math.floor(topic.startTime / 60)}:${(topic.startTime % 60).toString().padStart(2, '0')} - ${Math.floor(topic.endTime / 60)}:${(topic.endTime % 60).toString().padStart(2, '0')})`}
              arrow
            >
              <Box 
                sx={{
                  position: 'absolute',
                  left: `${position}%`,
                  width: `${width}%`,
                  top: '50%',
                  height: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    height: 20,
                  }
                }}
              />
            </Tooltip>
          );
        })}
        
        {/* Time markers */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
          <Typography variant="caption">0:00</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: '25%' }}>
          <Typography variant="caption">2:30</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: '50%' }}>
          <Typography variant="caption">5:00</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, left: '75%' }}>
          <Typography variant="caption">7:30</Typography>
        </Box>
        <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Typography variant="caption">10:00</Typography>
        </Box>
      </Box>
      
      {/* Topic list */}
      <List dense>
        {topics.map((topic, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <FlagIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={topic.topic} 
              secondary={`${Math.floor(topic.startTime / 60)}:${(topic.startTime % 60).toString().padStart(2, '0')} - ${Math.floor(topic.endTime / 60)}:${(topic.endTime % 60).toString().padStart(2, '0')}`} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Action Items Component
const ActionItems = ({ actionItems }) => {
  const theme = useTheme();
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <WarningIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      case 'medium':
        return <InfoIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      case 'low':
        return <InfoIcon fontSize="small" sx={{ color: getPriorityColor(priority) }} />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };
  
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>Action Items Detected</Typography>
      
      <List>
        {actionItems.map((item, index) => (
          <ListItem 
            key={index}
            sx={{ 
              mb: 1, 
              bgcolor: 'background.paper', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <ListItemIcon>
              {getPriorityIcon(item.priority)}
            </ListItemIcon>
            <ListItemText 
              primary={item.description} 
              secondary={`Detected at ${Math.floor(item.timestamp / 60)}:${(item.timestamp % 60).toString().padStart(2, '0')}`} 
            />
            <Chip 
              label={item.priority.toUpperCase()} 
              size="small" 
              sx={{ 
                bgcolor: getPriorityColor(item.priority),
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AssignmentIcon />}
        fullWidth
        sx={{ mt: 2 }}
      >
        Add All to Task List
      </Button>
    </Box>
  );
};

// Opportunity Score Component
const OpportunityScore = ({ score }) => {
  const theme = useTheme();
  
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.success.light;
    if (score >= 40) return theme.palette.warning.main;
    if (score >= 20) return theme.palette.warning.dark;
    return theme.palette.error.main;
  };
  
  // Determine label based on score
  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Challenging";
    return "Difficult";
  };
  
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" gutterBottom>Opportunity Score</Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <CircularProgress 
          variant="determinate" 
          value={100} 
          size={120} 
          thickness={4}
          sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        />
        <CircularProgress 
          variant="determinate" 
          value={score} 
          size={120} 
          thickness={4}
          sx={{ 
            color: getScoreColor(),
            position: 'absolute',
            left: 0,
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: getScoreColor() }}>
            {score}
          </Typography>
          <Typography variant="caption" sx={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2 }}>
        Based on linguistic markers, customer engagement, and competitive positioning
      </Typography>
    </Box>
  );
};

// Competitive Intelligence Component
const CompetitiveIntelligence = ({ competitors }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CompareArrowsIcon sx={{ mr: 1 }} />
        Competitive Intelligence
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        The following competitors were mentioned during the call. Here's how to position against them.
      </Alert>
      
      {competitors.map((competitor, index) => (
        <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {competitor.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mentioned at: {competitor.mentionedAt.map(time => 
                `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
              ).join(', ')}
            </Typography>
            
            <Divider sx={{ my: 1.5 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Key Differentiators:
            </Typography>
            
            <List dense>
              {competitor.differentiators.map((diff, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                  </ListItemIcon>
                  <ListItemText primary={diff} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              Suggested Talking Points:
            </Typography>
            
            <List dense>
              {competitor.talkingPoints.map((point, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LightbulbIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions>
            <Button size="small" startIcon={<GetAppIcon />}>
              Download Battle Card
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

// Next Best Actions Component
const NextBestActions = ({ actions }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LightbulbIcon sx={{ mr: 1 }} />
        Next Best Actions
      </Typography>
      
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: `4px solid ${
                action.priority === 'high' 
                  ? theme.palette.error.main 
                  : action.priority === 'medium'
                    ? theme.palette.warning.main
                    : theme.palette.info.main
              }`
            }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {action.title}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {action.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Recommended Timeline: {action.timeline}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  {action.actionText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Deal Velocity Component
const DealVelocity = ({ velocity }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SpeedIcon sx={{ mr: 1 }} />
        Deal Velocity
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Average Sales Cycle
            </Typography>
            <Typography variant="h4">
              {velocity.averageCycle} days
            </Typography>
            <Typography variant="body2" color={velocity.cycleComparison > 0 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              {velocity.cycleComparison > 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingUpIcon fontSize="small" sx={{ mr: 0.5, transform: 'rotate(180deg)' }} />}
              {Math.abs(velocity.cycleComparison)}% {velocity.cycleComparison > 0 ? 'faster' : 'slower'} than average
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Probability to Close
            </Typography>
            <Typography variant="h4">
              {velocity.probabilityToClose}%
            </Typography>
            <Typography variant="body2" color={velocity.probabilityComparison > 0 ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              {velocity.probabilityComparison > 0 ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingUpIcon fontSize="small" sx={{ mr: 0.5, transform: 'rotate(180deg)' }} />}
              {Math.abs(velocity.probabilityComparison)}% {velocity.probabilityComparison > 0 ? 'higher' : 'lower'} than similar deals
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Estimated Close Date
            </Typography>
            <Typography variant="h4">
              {velocity.estimatedCloseDate}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Based on current engagement level
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Deal Stage Progression
        </Typography>
        
        <Box sx={{ width: '100%', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ flexGrow: 1, display: 'flex', height: 24, borderRadius: 1, overflow: 'hidden' }}>
              {velocity.stages.map((stage, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    width: `${stage.percentage}%`, 
                    bgcolor: stage.completed ? theme.palette.success.main : 'rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: index < velocity.stages.length - 1 ? '1px solid white' : 'none'
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: stage.completed ? 'white' : 'text.secondary', 
                      fontWeight: 'bold',
                      display: stage.percentage > 15 ? 'block' : 'none'
                    }}
                  >
                    {stage.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {velocity.stages.map((stage, index) => (
              <Typography key={index} variant="caption" sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: stage.completed ? theme.palette.success.main : 'rgba(0,0,0,0.1)',
                    mr: 0.5 
                  }} 
                />
                {stage.name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Main component
const CallInsightDetail: React.FC = () => {
  const { insightId } = useParams<{ insightId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [insight, setInsight] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Mock data for visualizations
  const [sentimentData, setSentimentData] = useState([]);
  const [speakingPaceData, setSpeakingPaceData] = useState([]);
  const [fillerWords, setFillerWords] = useState([]);
  const [topicsTimeline, setTopicsTimeline] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [opportunityScore, setOpportunityScore] = useState(0);
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState([]);
  const [nextBestActions, setNextBestActions] = useState([]);
  const [dealVelocity, setDealVelocity] = useState(null);

  useEffect(() => {
    const fetchInsightData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, fetch from Supabase or your backend
        // For now, use mock data service
        const mockInsights = mockDataService.getLinguisticsAnalysis();
        const foundInsight = mockInsights.find(item => item.id === insightId);
        
        if (foundInsight) {
          setInsight(foundInsight);
          
          // Populate mock visualization data based on the insight
          // This is highly simplified; real data processing would be more complex
          setSentimentData(
            foundInsight.analysis_result.sentiment_timeline || 
            Array.from({ length: 10 }, (_, i) => ({ timestamp: i * 60, value: Math.random() * 2 - 1 }))
          );
          setSpeakingPaceData(
            foundInsight.analysis_result.speaking_pace_timeline ||
            Array.from({ length: 10 }, (_, i) => ({ timestamp: i * 60, value: Math.floor(Math.random() * 80 + 120) }))
          );
          setFillerWords(
            foundInsight.analysis_result.filler_words ||
            [
              { word: 'um', count: Math.floor(Math.random() * 10) },
              { word: 'uh', count: Math.floor(Math.random() * 8) },
              { word: 'like', count: Math.floor(Math.random() * 12) },
            ]
          );
          setTopicsTimeline(foundInsight.analysis_result.topic_segments || []);
          setActionItems(foundInsight.analysis_result.action_items || []);
          setOpportunityScore(foundInsight.analysis_result.opportunity_score?.score || Math.floor(Math.random() * 100));
          setCompetitiveIntelligence(foundInsight.analysis_result.competitive_intelligence || []);
          setNextBestActions(foundInsight.analysis_result.next_best_actions || []);
          setDealVelocity(foundInsight.analysis_result.deal_velocity || {
            averageCycle: 30,
            cycleComparison: -10,
            probabilityToClose: 65,
            probabilityComparison: 5,
            estimatedCloseDate: '2025-06-15',
            stages: [
              { name: 'Prospecting', percentage: 20, completed: true },
              { name: 'Qualification', percentage: 20, completed: true },
              { name: 'Proposal', percentage: 30, completed: false },
              { name: 'Negotiation', percentage: 15, completed: false },
              { name: 'Closed Won', percentage: 15, completed: false },
            ]
          });

        } else {
          setError(new Error('Insight not found'));
        }
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching insight data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (insightId) {
      fetchInsightData();
    }
  }, [insightId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Call Insight...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading insight: {error.message}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!insight) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Call insight data not found.
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }
  
  const {
    title,
    audio_url,
    transcript,
    analysis_result,
    sentiment_score,
    key_phrases,
    status,
    call_id,
    created_at,
    contact_name, // Assuming this is added to mock data or fetched
    practice_name // Assuming this is added to mock data or fetched
  } = insight;

  const {
    language_metrics,
    topic_segments,
    // action_items, // Already destructured for state
    // competitive_intelligence, // Already destructured for state
    // opportunity_score, // Already destructured for state
    // next_best_actions, // Already destructured for state
    // deal_velocity, // Already destructured for state
    industry_specific
  } = analysis_result || {};

  const getSentimentIcon = (score) => {
    if (score > 0.3) return <SentimentPositiveIcon color="success" sx={{ fontSize: 40 }} />;
    if (score < -0.3) return <SentimentNegativeIcon color="error" sx={{ fontSize: 40 }} />;
    return <SentimentNeutralIcon color="warning" sx={{ fontSize: 40 }} />;
  };

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: themeMode === 'space' ? 'neutral.900' : 'neutral.100', 
      minHeight: 'calc(100vh - 64px)' 
    }}>
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: themeMode === 'space' ? 'neutral.800' : 'background.paper',
        boxShadow: themeMode === 'space' ? '0px 0px 15px rgba(0, 255, 255, 0.2)' : theme.shadows[3]
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'inline-block' }}>
              {title || `Call Insight: ${insightId}`}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Share Insight">
              <IconButton><ShareIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Print Report">
              <IconButton><PrintIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Download Data">
              <IconButton><GetAppIcon /></IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<BookmarkIcon />} sx={{ ml: 2 }}>
              Save to Playbook
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} /> Contact: {contact_name || 'N/A'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1 }} /> Practice: {practice_name || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 1 }} /> Date: {new Date(created_at).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1 }} /> Time: {new Date(created_at).toLocaleTimeString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Call Recording & Transcript</Typography>
          {audio_url && (
            <audio controls src={audio_url} style={{ width: '100%', marginTop: '10px' }}>
              Your browser does not support the audio element.
            </audio>
          )}
          <Paper variant="outlined" sx={{ p: 2, mt: 1, maxHeight: 300, overflowY: 'auto', bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {transcript || 'Transcript not available.'}
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="insight detail tabs" variant="scrollable" scrollButtons="auto">
            <Tab label="Key Metrics" icon={<InsightsIcon />} iconPosition="start" />
            <Tab label="Linguistic Analysis" icon={<RecordVoiceOverIcon />} iconPosition="start" />
            <Tab label="Sentiment & Emotion" icon={<PsychologyIcon />} iconPosition="start" />
            <Tab label="Topic Segmentation" icon={<TimerIcon />} iconPosition="start" />
            <Tab label="Action Items" icon={<AssignmentIcon />} iconPosition="start" />
            <Tab label="Competitive Intel" icon={<CampaignIcon />} iconPosition="start" />
            <Tab label="Opportunity & Deal Velocity" icon={<TrendingUpIcon />} iconPosition="start" />
            <Tab label="Industry Specific" icon={<BusinessIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {getSentimentIcon(sentiment_score)}
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {sentiment_score !== undefined ? sentiment_score.toFixed(2) : 'N/A'}
                  </Typography>
                  <Typography color="text.secondary">Overall Sentiment</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SpeedIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {language_metrics?.speaking_pace || 'N/A'} WPM
                  </Typography>
                  <Typography color="text.secondary">Speaking Pace</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CompareArrowsIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {language_metrics?.talk_to_listen_ratio !== undefined ? language_metrics.talk_to_listen_ratio.toFixed(2) : 'N/A'}
                  </Typography>
                  <Typography color="text.secondary">Talk-to-Listen Ratio</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Key Phrases</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(key_phrases || []).map((phrase, index) => (
                      <Chip key={index} label={phrase} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TalkListenRatio repPercentage={language_metrics?.talk_to_listen_ratio ? (language_metrics.talk_to_listen_ratio / (1 + language_metrics.talk_to_listen_ratio)) * 100 : 50} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FillerWordAnalysis fillerWords={fillerWords} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent>
                  <Typography variant="subtitle1">Technical Language Level</Typography>
                  <LinearProgress variant="determinate" value={(language_metrics?.technical_language_level || 0) * 10} sx={{ height: 10, borderRadius: 5, my:1 }} />
                  <Typography variant="body2">{language_metrics?.technical_language_level || 0}/10</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent>
                  <Typography variant="subtitle1">Interruption Count</Typography>
                  <Typography variant="h4">{language_metrics?.interruption_count || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
             <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
                <CardContent>
                  <Typography variant="subtitle1">Avg. Response Time</Typography>
                  <Typography variant="h4">{language_metrics?.average_response_time?.toFixed(1) || 0}s</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SentimentChart data={sentimentData} />
            </Grid>
            <Grid item xs={12}>
              <SpeakingPaceChart data={speakingPaceData} />
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <KeyTopicsTimeline topics={topicsTimeline} />
        )}
        
        {activeTab === 4 && (
          <ActionItems actionItems={actionItems} />
        )}

        {activeTab === 5 && (
          <CompetitiveIntelligence competitors={competitiveIntelligence} />
        )}

        {activeTab === 6 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <OpportunityScore score={opportunityScore} />
            </Grid>
            <Grid item xs={12} md={6}>
              {dealVelocity && <DealVelocity velocity={dealVelocity} />}
            </Grid>
          </Grid>
        )}
        
        {activeTab === 7 && (
          <Paper sx={{ p: 2, bgcolor: themeMode === 'space' ? 'neutral.700' : 'neutral.50' }}>
            <Typography variant="h6" gutterBottom>Industry Specific Metrics</Typography>
            {industry_specific ? (
              <List>
                <ListItem>
                  <ListItemText primary="Treatment Plan Discussion Quality" secondary={`${industry_specific.treatment_plan_discussion_quality || 'N/A'} / 10`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Clinical Knowledge Accuracy" secondary={`${industry_specific.clinical_knowledge_accuracy || 'N/A'} / 10`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Patient Education Effectiveness" secondary={`${industry_specific.patient_education_effectiveness || 'N/A'} / 10`} />
                </ListItem>
                 <ListItem>
                  <ListItemText primary="Pricing Transparency" secondary={`${industry_specific.pricing_transparency || 'N/A'} / 10`} />
                </ListItem>
                 <ListItem>
                  <ListItemText primary="Financing Options Coverage" secondary={`${industry_specific.financing_options_coverage || 'N/A'} / 10`} />
                </ListItem>
                 <ListItem>
                  <ListItemText primary="Procedure Explanation Clarity" secondary={`${industry_specific.procedure_explanation_clarity || 'N/A'} / 10`} />
                </ListItem>
              </List>
            ) : (
              <Typography>No industry-specific metrics available.</Typography>
            )}
          </Paper>
        )}

      </Paper>
    </Box>
  );
};

export default CallInsightDetail;

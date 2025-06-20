// LinguistIQ - Deconstructed Call Analysis
// Breaking down conversations to their elemental forms
// Understanding tone, sentiment, and dominance patterns

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Fade,
  Collapse,
  Tabs,
  Tab,
  Paper,
  Slider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  NavigateBefore as BackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  Equalizer as EqualizerIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Mood as PositiveIcon,
  MoodBad as NegativeIcon,
  SentimentNeutral as NeutralIcon,
  Speed as VelocityIcon,
  Timer as DurationIcon,
  Person as SpeakerIcon,
  Insights as InsightsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  Monolith,
  GalleryContainer,
  ExhibitionGrid,
  Gallery,
} from '../components/gallery';
import glassEffects from '../themes/glassEffects';
import animations from '../themes/animations';

// Sentiment Wave Visualizer
const SentimentWave: React.FC<{
  data: Array<{ time: number; sentiment: number; speaker: string }>;
  height?: number;
}> = ({ data, height = 200 }) => {
  const theme = useTheme();
  
  // Create wave path
  const createPath = () => {
    if (data.length === 0) return '';
    
    const width = 100;
    const heightScale = height / 2;
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * width,
      y: heightScale - (d.sentiment * heightScale * 0.8),
    }));
    
    // Create smooth curve through points
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
      const cp1y = points[i - 1].y;
      const cp2x = points[i - 1].x + (points[i].x - points[i - 1].x) * 2 / 3;
      const cp2y = points[i].y;
      
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i].x},${points[i].y}`;
    }
    
    return path;
  };
  
  return (
    <Box sx={{ position: 'relative', height, overflow: 'hidden' }}>
      {/* Background grid */}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d={`M 10 0 L 0 0 0 10`}
              fill="none"
              stroke={alpha(theme.palette.primary.main, 0.1)}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100" height={height} fill="url(#grid)" />
        
        {/* Zero line */}
        <line
          x1="0"
          y1={height / 2}
          x2="100"
          y2={height / 2}
          stroke={alpha(theme.palette.primary.main, 0.3)}
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        
        {/* Sentiment wave */}
        <path
          d={createPath()}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="2"
          style={{
            filter: `drop-shadow(0 0 8px ${alpha(theme.palette.primary.main, 0.5)})`,
          }}
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = (height / 2) - (d.sentiment * height * 0.4);
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill={theme.palette.primary.main}
              opacity={0.8}
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      <Box
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
          +POSITIVE
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          NEUTRAL
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
          -NEGATIVE
        </Typography>
      </Box>
    </Box>
  );
};

// Tone Analyzer Component
const ToneAnalyzer: React.FC<{
  tones: Array<{ name: string; value: number; color: string }>;
}> = ({ tones }) => {
  const theme = useTheme();
  
  return (
    <Stack spacing={2}>
      {tones.map((tone) => (
        <Box key={tone.name}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.1em' }}>
              {tone.name}
            </Typography>
            <Typography variant="body2" sx={{ color: tone.color }}>
              {tone.value}%
            </Typography>
          </Box>
          <Box
            sx={{
              height: 12,
              backgroundColor: alpha(theme.palette.background.paper, 0.3),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${tone.value}%`,
                backgroundColor: tone.color,
                transition: animations.utils.createTransition(
                  animations.durations.deliberate,
                  animations.easings.monolith
                ).transition,
                boxShadow: `inset 0 0 0 1px ${alpha(tone.color, 0.3)}`,
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

// Pattern Recognition Display
const PatternDisplay: React.FC<{
  patterns: Array<{
    type: string;
    frequency: number;
    examples: string[];
    impact: 'positive' | 'negative' | 'neutral';
  }>;
}> = ({ patterns }) => {
  const theme = useTheme();
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  return (
    <Stack spacing={2}>
      {patterns.map((pattern) => (
        <Box
          key={pattern.type}
          sx={{
            ...glassEffects.effects.carbon,
            p: 2,
            cursor: 'pointer',
            transition: animations.utils.createTransition().transition,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          onClick={() => setExpandedPattern(
            expandedPattern === pattern.type ? null : pattern.type
          )}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ letterSpacing: '0.05em' }}>
                {pattern.type}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {pattern.frequency} occurrences
              </Typography>
            </Box>
            <Chip
              size="small"
              label={pattern.impact.toUpperCase()}
              sx={{
                backgroundColor: alpha(getImpactColor(pattern.impact), 0.1),
                color: getImpactColor(pattern.impact),
                border: `1px solid ${alpha(getImpactColor(pattern.impact), 0.3)}`,
                fontWeight: 600,
                letterSpacing: '0.1em',
              }}
            />
          </Box>
          
          <Collapse in={expandedPattern === pattern.type}>
            <Box sx={{ mt: 2, pl: 2 }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block', mb: 1 }}>
                EXAMPLES:
              </Typography>
              {pattern.examples.map((example, i) => (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{
                    mb: 0.5,
                    pl: 2,
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    fontStyle: 'italic',
                    opacity: 0.8,
                  }}
                >
                  "{example}"
                </Typography>
              ))}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Stack>
  );
};

// Main LinguistIQ Component
const LinguistIQ: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [selectedCall, setSelectedCall] = useState(0);
  
  // Mock data - in real app, this would come from API
  const callData = {
    duration: 480, // 8 minutes
    speakers: [
      { id: 'rep', name: 'Sales Rep', color: theme.palette.primary.main },
      { id: 'doctor', name: 'Dr. Smith', color: theme.palette.secondary.main },
    ],
    sentimentData: [
      { time: 0, sentiment: 0, speaker: 'rep' },
      { time: 30, sentiment: 0.3, speaker: 'rep' },
      { time: 60, sentiment: 0.5, speaker: 'doctor' },
      { time: 90, sentiment: 0.2, speaker: 'rep' },
      { time: 120, sentiment: -0.2, speaker: 'doctor' },
      { time: 150, sentiment: 0.1, speaker: 'rep' },
      { time: 180, sentiment: 0.6, speaker: 'doctor' },
      { time: 210, sentiment: 0.8, speaker: 'rep' },
      { time: 240, sentiment: 0.7, speaker: 'doctor' },
    ],
    tones: [
      { name: 'CONFIDENCE', value: 78, color: theme.palette.primary.main },
      { name: 'ENTHUSIASM', value: 65, color: theme.palette.success.main },
      { name: 'EMPATHY', value: 82, color: theme.palette.info.main },
      { name: 'ASSERTIVENESS', value: 71, color: theme.palette.warning.main },
      { name: 'PATIENCE', value: 89, color: theme.palette.secondary.main },
    ],
    patterns: [
      {
        type: 'Active Listening',
        frequency: 12,
        examples: ['I understand your concern...', 'That makes perfect sense...'],
        impact: 'positive' as const,
      },
      {
        type: 'Feature Benefits',
        frequency: 8,
        examples: ['This will save you time...', 'Your patients will appreciate...'],
        impact: 'positive' as const,
      },
      {
        type: 'Objection Handling',
        frequency: 3,
        examples: ['I hear what you\'re saying...', 'Let me address that...'],
        impact: 'neutral' as const,
      },
      {
        type: 'Rushed Explanations',
        frequency: 2,
        examples: ['So basically what happens is...', 'To quickly summarize...'],
        impact: 'negative' as const,
      },
    ],
    metrics: {
      talkRatio: { rep: 45, doctor: 55 },
      averagePause: 1.2,
      speechVelocity: 142,
      sentimentScore: 0.72,
    },
  };
  
  // Simulate playback
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= callData.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, callData.duration]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <GalleryContainer maxWidth="xl">
      <Fade in timeout={animations.durations.cinematic}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate('/command-room')}
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              COMMAND ROOM
            </Button>
            
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                letterSpacing: '0.3em',
                display: 'block',
                mb: 2,
              }}
            >
              DECONSTRUCTED CALL ANALYSIS
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                mb: 4,
              }}
            >
              LINGUISTIQ
            </Typography>
          </Box>
          
          {/* Call Selector */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {['Dr. Smith - Product Demo', 'Dr. Johnson - Follow-up', 'Dr. Lee - Cold Call'].map((call, index) => (
                <Button
                  key={index}
                  variant={selectedCall === index ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCall(index)}
                  sx={{
                    borderRadius: 0,
                    px: 3,
                    borderWidth: 2,
                  }}
                >
                  {call}
                </Button>
              ))}
            </Stack>
          </Box>
          
          {/* Analysis Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: alpha(theme.palette.primary.main, 0.1), mb: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  letterSpacing: '0.1em',
                  minWidth: 120,
                },
              }}
            >
              <Tab label="SENTIMENT FLOW" />
              <Tab label="TONE ANALYSIS" />
              <Tab label="PATTERNS" />
              <Tab label="METRICS" />
            </Tabs>
          </Box>
          
          {/* Tab Content */}
          <ExhibitionGrid columns={{ xs: 1, md: 3 }} spacing={3}>
            {/* Main Analysis Panel */}
            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
              {selectedTab === 0 && (
                <Monolith
                  title="SENTIMENT JOURNEY"
                  subtitle="Emotional arc of the conversation"
                  variant="obsidian"
                  animationDelay={0}
                >
                  <SentimentWave data={callData.sentimentData} height={300} />
                  
                  {/* Playback Controls */}
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <IconButton
                        onClick={() => setPlaybackTime(Math.max(0, playbackTime - 30))}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <PrevIcon />
                      </IconButton>
                      
                      <IconButton
                        onClick={() => setIsPlaying(!isPlaying)}
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          },
                        }}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                      
                      <IconButton
                        onClick={() => setPlaybackTime(Math.min(callData.duration, playbackTime + 30))}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <NextIcon />
                      </IconButton>
                      
                      <Box sx={{ flex: 1, mx: 2 }}>
                        <Slider
                          value={playbackTime}
                          onChange={(_, value) => setPlaybackTime(value as number)}
                          max={callData.duration}
                          sx={{
                            '& .MuiSlider-rail': {
                              height: 8,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                            '& .MuiSlider-track': {
                              height: 8,
                              backgroundColor: theme.palette.primary.main,
                              border: 'none',
                            },
                            '& .MuiSlider-thumb': {
                              width: 16,
                              height: 16,
                              backgroundColor: theme.palette.primary.main,
                              '&:before': {
                                boxShadow: 'none',
                              },
                            },
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'right' }}>
                        {formatTime(playbackTime)} / {formatTime(callData.duration)}
                      </Typography>
                    </Box>
                    
                    {/* Speaker indicators */}
                    <Stack direction="row" spacing={2} justifyContent="center">
                      {callData.speakers.map((speaker) => (
                        <Chip
                          key={speaker.id}
                          icon={<SpeakerIcon />}
                          label={speaker.name}
                          size="small"
                          sx={{
                            backgroundColor: alpha(speaker.color, 0.1),
                            color: speaker.color,
                            border: `1px solid ${alpha(speaker.color, 0.3)}`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Monolith>
              )}
              
              {selectedTab === 1 && (
                <Monolith
                  title="TONAL DECOMPOSITION"
                  subtitle="Breaking down the voice characteristics"
                  variant="carbon"
                  animationDelay={0}
                >
                  <ToneAnalyzer tones={callData.tones} />
                  
                  <Box sx={{ mt: 4, p: 3, ...glassEffects.effects.obsidian }}>
                    <Typography variant="overline" sx={{ color: theme.palette.primary.main }}>
                      DOMINANT TONE
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 100, mt: 1 }}>
                      EMPATHETIC PROFESSIONAL
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                      The conversation demonstrates high empathy (82%) combined with strong confidence (78%), 
                      creating an ideal balance for consultative selling.
                    </Typography>
                  </Box>
                </Monolith>
              )}
              
              {selectedTab === 2 && (
                <Monolith
                  title="PATTERN RECOGNITION"
                  subtitle="Linguistic patterns and their impact"
                  variant="goldInfused"
                  animationDelay={0}
                >
                  <PatternDisplay patterns={callData.patterns} />
                  
                  <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, ...glassEffects.effects.carbon, textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: theme.palette.success.main, fontWeight: 100 }}>
                        20
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        POSITIVE PATTERNS
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2, ...glassEffects.effects.carbon, textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ color: theme.palette.error.main, fontWeight: 100 }}>
                        2
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        AREAS TO IMPROVE
                      </Typography>
                    </Box>
                  </Box>
                </Monolith>
              )}
              
              {selectedTab === 3 && (
                <Monolith
                  title="PERFORMANCE METRICS"
                  subtitle="Quantified conversation dynamics"
                  variant="frostedSteel"
                  animationDelay={0}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                          TALK RATIO
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Box sx={{ textAlign: 'right', pr: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 100 }}>
                              {callData.metrics.talkRatio.rep}%
                            </Typography>
                            <Typography variant="caption">REP</Typography>
                          </Box>
                          <Box sx={{ width: 2, height: 60, backgroundColor: alpha(theme.palette.primary.main, 0.2) }} />
                          <Box sx={{ textAlign: 'left', pl: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 100 }}>
                              {callData.metrics.talkRatio.doctor}%
                            </Typography>
                            <Typography variant="caption">DOCTOR</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                          SPEECH VELOCITY
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 100, mt: 1, color: theme.palette.primary.main }}>
                          {callData.metrics.speechVelocity}
                        </Typography>
                        <Typography variant="caption">WORDS/MIN</Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                          AVG PAUSE LENGTH
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 100, mt: 1 }}>
                          {callData.metrics.averagePause}s
                        </Typography>
                        <Typography variant="caption">OPTIMAL RANGE</Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
                          SENTIMENT SCORE
                        </Typography>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 100, 
                            mt: 1,
                            color: theme.palette.success.main,
                          }}
                        >
                          {(callData.metrics.sentimentScore * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="caption">POSITIVE</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Monolith>
              )}
            </Box>
            
            {/* Side Panel */}
            <Box>
              <Stack spacing={3}>
                <Monolith
                  title="QUICK INSIGHTS"
                  variant="museum"
                  animationDelay={100}
                >
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsightsIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="body2">
                        Strong rapport building in first 3 minutes
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                      <Typography variant="body2">
                        Sentiment improved throughout call
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VelocityIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                      <Typography variant="body2">
                        Optimal pacing maintained
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EqualizerIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                      <Typography variant="body2">
                        Good balance of speaking time
                      </Typography>
                    </Box>
                  </Stack>
                </Monolith>
                
                <Monolith
                  title="AI RECOMMENDATIONS"
                  variant="carbon"
                  animationDelay={200}
                >
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ pb: 1, borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                      💡 Consider slowing down during technical explanations
                    </Typography>
                    <Typography variant="body2" sx={{ pb: 1, borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                      🎯 Excellent use of active listening phrases
                    </Typography>
                    <Typography variant="body2" sx={{ pb: 1, borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                      📈 Try incorporating more visual language
                    </Typography>
                    <Typography variant="body2">
                      ⚡ Perfect energy level throughout
                    </Typography>
                  </Stack>
                </Monolith>
              </Stack>
            </Box>
          </ExhibitionGrid>
          
          {/* Footer */}
          <Gallery.Space height={80} pattern="dots" />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                mb: 2,
                color: theme.palette.text.secondary,
              }}
            >
              EVERY WORD IS A BRUSHSTROKE
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                letterSpacing: '0.05em',
              }}
            >
              Understanding the subtle dynamics of conversation is an art form. 
              LinguistIQ deconstructs dialogue to reveal the hidden patterns of persuasion.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </GalleryContainer>
  );
};

export default LinguistIQ;
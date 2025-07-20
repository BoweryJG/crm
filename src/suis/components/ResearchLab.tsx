// Research Lab - Modern Redesign
// AI-Powered Research & Market Intelligence for Sales Reps

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
  Grow,
  Stack,
  Grid,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  LocalHospital as HospitalIcon,
  Science as ScienceIcon,
  AutoGraph as AutoGraphIcon,
  Lightbulb as LightbulbIcon,
  ContentCopy as CopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  QueryStats as QueryStatsIcon,
  Biotech as BiotechIcon,
  MedicalServices as MedicalIcon,
  AttachMoney as MoneyIcon,
  Groups as GroupsIcon,
  Timeline as TimelineIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkedIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AIIcon
} from '@mui/icons-material';
import { useSUIS } from './SUISProvider';
import { useAuth } from '../../auth/AuthContext';
import { useThemeContext } from '../../themes/ThemeContext';
import { ResearchResponse } from '../types';

interface ResearchMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: ResearchResponse;
  feedback?: { helpful: boolean };
  bookmarked?: boolean;
}

interface ResearchCategory {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  description: string;
}

const ResearchLab: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const { state, actions } = useSUIS();
  const [messages, setMessages] = useState<ResearchMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories: ResearchCategory[] = [
    { id: 'all', name: 'All Research', icon: <SearchIcon />, color: theme.palette.primary.main, description: 'General research' },
    { id: 'market', name: 'Market Trends', icon: <TrendingUpIcon />, color: '#10B981', description: 'Industry analysis' },
    { id: 'product', name: 'Product Intel', icon: <BiotechIcon />, color: '#8B5CF6', description: 'Device comparisons' },
    { id: 'practice', name: 'Practice Insights', icon: <BusinessIcon />, color: '#F59E0B', description: 'Practice research' },
    { id: 'clinical', name: 'Clinical Data', icon: <MedicalIcon />, color: '#EF4444', description: 'Studies & trials' },
    { id: 'competitive', name: 'Competitive', icon: <QueryStatsIcon />, color: '#06B6D4', description: 'Competitor analysis' }
  ];

  const quickPrompts = [
    { text: "Latest aesthetic market trends in my region", category: 'market' },
    { text: "Compare top dental implant systems", category: 'product' },
    { text: "Best practices for approaching new clinics", category: 'practice' },
    { text: "Clinical studies on dermal fillers", category: 'clinical' },
    { text: "Competitor pricing analysis", category: 'competitive' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ResearchMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI research (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const assistantMessage: ResearchMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
        data: generateMockData(input)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ResearchMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Research temporarily unavailable. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes('trend')) {
      return "Based on my analysis of current market data, aesthetic procedures are showing 23% YoY growth in your region, with particular strength in non-invasive treatments. Key drivers include increased consumer awareness and new technology adoption.";
    } else if (query.toLowerCase().includes('implant')) {
      return "I've analyzed the top 5 dental implant systems. Nobel Biocare leads in premium segment with 98% success rate, while Straumann offers best value proposition. BioHorizons shows strong growth in mid-market segment.";
    } else if (query.toLowerCase().includes('clinic') || query.toLowerCase().includes('practice')) {
      return "For approaching new clinics, data shows 73% higher success rate with warm introductions. Best practices: 1) Research their current suppliers, 2) Identify pain points through staff conversations, 3) Lead with educational value before product pitch.";
    }
    return "I've analyzed your query and found several relevant insights. The data suggests strong opportunities in this area with proper positioning and approach.";
  };

  const generateMockData = (query: string): ResearchResponse => ({
    summary: generateMockResponse(query),
    keyFindings: [
      { finding: "Market opportunity identified", confidence: 0.92, sources: ["Industry Report 2024"], implications: [] },
      { finding: "Competitive advantage possible", confidence: 0.87, sources: ["Market Analysis"], implications: [] },
      { finding: "Implementation strategy recommended", confidence: 0.85, sources: ["Best Practices Guide"], implications: [] }
    ],
    recommendations: [
      "Focus on relationship building with key decision makers",
      "Leverage clinical data in presentations",
      "Implement consultative selling approach"
    ],
    sources: [
      { id: '1', title: 'Industry Report 2024', type: 'industry_report', credibility: 0.95, relevance: 0.9 },
      { id: '2', title: 'Market Analysis Q4', type: 'industry_report', credibility: 0.88, relevance: 0.85 }
    ],
    confidence: 0.88,
    limitations: [],
    followUpQuestions: [
      "Would you like specific competitor pricing data?",
      "Should I analyze practice-specific opportunities?",
      "Do you need clinical study references?"
    ]
  });

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: { helpful } } : msg
    ));
  };

  const handleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, bookmarked: !msg.bookmarked } : msg
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isSpaceTheme = themeMode === 'space';

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderBottom: 1, 
          borderColor: 'divider',
          background: isSpaceTheme 
            ? 'linear-gradient(135deg, rgba(136, 96, 208, 0.1) 0%, rgba(92, 225, 230, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(61, 82, 213, 0.05) 0%, rgba(68, 207, 203, 0.05) 100%)'
        }}
      >
        <Grid container alignItems="center" spacing={3}>
          <Grid item>
            <Avatar sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: isSpaceTheme ? '#8860D0' : theme.palette.primary.main,
              boxShadow: 3
            }}>
              <ScienceIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Research Lab
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered insights for medical device sales excellence
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <Chip 
                icon={<AIIcon />}
                label="AI Enhanced"
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              />
              <Chip 
                label={messages.length > 0 ? `${messages.length} queries` : 'Ready'}
                size="small"
                color={isLoading ? 'warning' : 'success'}
              />
            </Stack>
          </Grid>
        </Grid>

        {/* Category Tabs */}
        <Box sx={{ mt: 3 }}>
          <Tabs 
            value={activeCategory} 
            onChange={(e, v) => setActiveCategory(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 600
              }
            }}
          >
            {categories.map(cat => (
              <Tab
                key={cat.id}
                value={cat.id}
                icon={cat.icon}
                iconPosition="start"
                label={cat.name}
                sx={{
                  color: activeCategory === cat.id ? cat.color : 'text.secondary',
                  '&.Mui-selected': { color: cat.color }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.5)
      }}>
        {messages.length === 0 ? (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PsychologyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Start Your Research Journey
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                Ask me anything about market trends, product comparisons, clinical data, or sales strategies. 
                I'll provide AI-powered insights tailored to your needs.
              </Typography>
              
              {/* Quick Prompts */}
              <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
                {quickPrompts.map((prompt, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Grow in timeout={300 + idx * 100}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                        onClick={() => setInput(prompt.text)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {categories.find(c => c.id === prompt.category)?.icon}
                            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                              {categories.find(c => c.id === prompt.category)?.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {prompt.text}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        ) : (
          <Stack spacing={3}>
            {messages.map((message, idx) => (
              <Fade in key={message.id} timeout={300}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    elevation={message.type === 'user' ? 0 : 1}
                    sx={{
                      maxWidth: '80%',
                      p: 2.5,
                      bgcolor: message.type === 'user' 
                        ? isSpaceTheme ? '#8860D0' : theme.palette.primary.main
                        : theme.palette.background.paper,
                      color: message.type === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" sx={{ mb: message.data ? 2 : 0 }}>
                      {message.content}
                    </Typography>

                    {/* Research Data Display */}
                    {message.data && (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        {/* Key Findings */}
                        {message.data.keyFindings.length > 0 && (
                          <Box sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            p: 2,
                            borderRadius: 1
                          }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                              <LightbulbIcon sx={{ fontSize: 18, mr: 1 }} />
                              Key Findings
                            </Typography>
                            {message.data.keyFindings.map((finding, i) => (
                              <Box key={i} sx={{ display: 'flex', alignItems: 'start', mb: 1 }}>
                                <Box sx={{ 
                                  minWidth: 60,
                                  mr: 1,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={finding.confidence * 100}
                                    sx={{ 
                                      width: 40,
                                      mr: 1,
                                      height: 4,
                                      borderRadius: 2,
                                      bgcolor: alpha(theme.palette.success.main, 0.2)
                                    }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {Math.round(finding.confidence * 100)}%
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {finding.finding}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {/* Recommendations */}
                        {message.data.recommendations.length > 0 && (
                          <Box sx={{ 
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            p: 2,
                            borderRadius: 1
                          }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                              <AutoGraphIcon sx={{ fontSize: 18, mr: 1 }} />
                              Recommendations
                            </Typography>
                            {message.data.recommendations.map((rec, i) => (
                              <Typography key={i} variant="body2" sx={{ mb: 0.5, pl: 2 }}>
                                • {rec}
                              </Typography>
                            ))}
                          </Box>
                        )}

                        {/* Follow-up Questions */}
                        {message.data.followUpQuestions && message.data.followUpQuestions.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                              Suggested follow-ups:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {message.data.followUpQuestions.map((q, i) => (
                                <Chip
                                  key={i}
                                  label={q}
                                  size="small"
                                  onClick={() => setInput(q)}
                                  sx={{ 
                                    cursor: 'pointer',
                                    mb: 1,
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    )}

                    {/* Message Actions */}
                    {message.type === 'assistant' && (
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <IconButton size="small" onClick={() => copyToClipboard(message.content)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleFeedback(message.id, true)}
                          color={message.feedback?.helpful === true ? 'success' : 'default'}
                        >
                          <ThumbUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleFeedback(message.id, false)}
                          color={message.feedback?.helpful === false ? 'error' : 'default'}
                        >
                          <ThumbDownIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleBookmark(message.id)}
                          color={message.bookmarked ? 'primary' : 'default'}
                        >
                          {message.bookmarked ? <BookmarkedIcon fontSize="small" /> : <BookmarkIcon fontSize="small" />}
                        </IconButton>
                      </Stack>
                    )}

                    {/* Timestamp */}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        position: 'absolute',
                        bottom: 4,
                        right: 8,
                        color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}
            {isLoading && (
              <Fade in>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Paper sx={{ p: 2, bgcolor: 'background.paper', maxWidth: '80%' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            animation: 'pulse 1.4s infinite',
                            '@keyframes pulse': {
                              '0%, 60%, 100%': { opacity: 0.3 },
                              '30%': { opacity: 1 }
                            }
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            animation: 'pulse 1.4s infinite',
                            animationDelay: '0.2s',
                            '@keyframes pulse': {
                              '0%, 60%, 100%': { opacity: 0.3 },
                              '30%': { opacity: 1 }
                            }
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            animation: 'pulse 1.4s infinite',
                            animationDelay: '0.4s',
                            '@keyframes pulse': {
                              '0%, 60%, 100%': { opacity: 0.3 },
                              '30%': { opacity: 1 }
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Researching...
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Fade>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input Area */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 2.5, 
          borderTop: 1, 
          borderColor: 'divider',
          background: theme.palette.background.paper
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, products, clinical data, or sales strategies..."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.default'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    sx={{ 
                      bgcolor: isSpaceTheme ? '#8860D0' : theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        bgcolor: isSpaceTheme ? '#7550C0' : theme.palette.primary.dark
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'action.disabledBackground'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          Powered by advanced AI • Research data updated in real-time
        </Typography>
      </Paper>
    </Box>
  );
};

export default ResearchLab;
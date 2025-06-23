// Knowledge Academy - Interactive learning laboratory
// Where education meets experimentation

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Grid,
  Fade,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Tab,
  Tabs,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Book as BookIcon,
  VideoLibrary as VideoIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Timer as TimerIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Psychology as BrainIcon,
  Biotech as BiotechIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { Monolith, Gallery } from '../../../components/gallery';
import glassEffects from '../../../themes/glassEffects';
import animations from '../../../themes/animations';
import { CanvasBase, AIGenerateButton } from './CanvasBase';
import { useAuth } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../../themes/ThemeContext';
import { getMobileStyles } from './MobileStyles';

interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'video' | 'interactive';
  duration: number;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  lessons: Lesson[];
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const KnowledgeAcademy: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { themeMode } = useThemeContext();
  const mobileStyles = getMobileStyles(theme);
  const [activeMode, setActiveMode] = useState<'learn' | 'create'>('learn');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  
  // Create mode states
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState<Question[]>([]);

  // Theme-aware glass effects
  const getThemeGlass = () => {
    switch (themeMode) {
      case 'cyber-neon':
        return {
          ...glassEffects.effects.obsidian,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
            pointerEvents: 'none',
          },
        };
      case 'ocean-depths':
        return {
          ...glassEffects.effects.museum,
          backdropFilter: 'blur(20px) saturate(180%)',
          background: alpha('#003d5c', 0.3),
        };
      case 'chanel-noir':
        return {
          ...glassEffects.effects.carbon,
          border: 'none',
          boxShadow: `0 2px 20px ${alpha('#000', 0.3)}`,
        };
      case 'cartier-gold':
        return glassEffects.effects.goldInfused;
      default:
        return glassEffects.effects.museum;
    }
  };

  // Mock data
  const modules: Module[] = [
    {
      id: '1',
      name: 'Product Mastery',
      icon: <BiotechIcon />,
      color: theme.palette.primary.main,
      progress: 75,
      lessons: [
        {
          id: '1-1',
          title: 'Introduction to BTL Devices',
          description: 'Learn the fundamentals of BTL technology',
          type: 'video',
          duration: 15,
          completed: true,
          locked: false,
        },
        {
          id: '1-2',
          title: 'Advanced Features Deep Dive',
          description: 'Master advanced device capabilities',
          type: 'interactive',
          duration: 30,
          completed: true,
          locked: false,
        },
        {
          id: '1-3',
          title: 'Clinical Applications',
          description: 'Real-world use cases and protocols',
          type: 'text',
          duration: 20,
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Sales Techniques',
      icon: <AnalyticsIcon />,
      color: theme.palette.secondary.main,
      progress: 40,
      lessons: [
        {
          id: '2-1',
          title: 'Consultative Selling',
          description: 'Master the art of consultative approach',
          type: 'video',
          duration: 25,
          completed: true,
          locked: false,
        },
        {
          id: '2-2',
          title: 'Objection Handling Lab',
          description: 'Practice common objections',
          type: 'interactive',
          duration: 35,
          completed: false,
          locked: false,
        },
      ],
    },
  ];

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <VideoIcon />;
      case 'interactive':
        return <ScienceIcon />;
      default:
        return <BookIcon />;
    }
  };

  const handleStartLesson = (lesson: Lesson) => {
    if (lesson.locked) return;
    setSelectedLesson(lesson);
    setActiveTab(0);
  };

  const handleCreateLesson = () => {
    if (!newLessonTitle || !newLessonContent) return;
    
    setLoading(true);
    // Simulate lesson creation
    setTimeout(() => {
      setLoading(false);
      setNewLessonTitle('');
      setNewLessonContent('');
      // In real app, would save to database
    }, 1500);
  };

  return (
    <CanvasBase
      overline="LEARNING LABORATORY"
      title="KNOWLEDGE ACADEMY"
      subtitle="Transform expertise into interactive learning experiences. Create courses, track progress, and master your craft."
      emptyStateIcon={<SchoolIcon />}
      emptyStateMessage="SELECT A MODULE TO BEGIN LEARNING"
      onSignInClick={() => navigate('/login')}
    >
      {/* Mode Toggle */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <ToggleButtonGroup
          value={activeMode}
          exclusive
          onChange={(_, newMode) => newMode && setActiveMode(newMode)}
          sx={{
            ...getThemeGlass(),
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
          }}
        >
          <ToggleButton
            value="learn"
            sx={{
              px: 4,
              letterSpacing: '0.1em',
              color: activeMode === 'learn' ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            LEARN
          </ToggleButton>
          <ToggleButton
            value="create"
            sx={{
              px: 4,
              letterSpacing: '0.1em',
              color: activeMode === 'create' ? theme.palette.primary.main : theme.palette.text.secondary,
            }}
          >
            CREATE
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {activeMode === 'learn' ? (
        <Grid container spacing={3}>
          {/* Left Panel - Subject Tabs (Lab Equipment) */}
          <Grid item xs={12} md={3}>
            <Monolith
              variant={themeMode === 'chanel-noir' ? 'carbon' : 'museum'}
              elevation="elevated"
              hover="none"
              title="SUBJECTS"
              fullHeight
            >
              <Stack spacing={2}>
                {modules.map((module) => (
                  <Paper
                    key={module.id}
                    onClick={() => setSelectedModule(module)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      ...getThemeGlass(),
                      backgroundColor: selectedModule?.id === module.id
                        ? alpha(module.color, 0.1)
                        : alpha(theme.palette.background.paper, 0.3),
                      border: `1px solid ${selectedModule?.id === module.id
                        ? alpha(module.color, 0.3)
                        : alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(module.color, 0.05),
                        borderColor: alpha(module.color, 0.2),
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        backgroundColor: alpha(module.color, 0.2),
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: 4,
                        width: `${module.progress}%`,
                        backgroundColor: module.color,
                        transition: 'width 0.3s ease',
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ color: module.color }}>
                        {module.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                          }}
                        >
                          {module.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            letterSpacing: '0.03em',
                          }}
                        >
                          {module.lessons.filter(l => l.completed).length} / {module.lessons.length} lessons
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Monolith>
          </Grid>

          {/* Center - Interactive Workspace */}
          <Grid item xs={12} md={6}>
            <Monolith
              variant={themeMode === 'cyber-neon' ? 'obsidian' : 'museum'}
              elevation="floating"
              hover="none"
              title={selectedLesson ? selectedLesson.title : "LEARNING LAB"}
              fullHeight
            >
              {selectedLesson ? (
                <Box>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                      mb: 3,
                      '& .MuiTab-root': {
                        letterSpacing: '0.1em',
                      },
                    }}
                  >
                    <Tab label="CONTENT" />
                    <Tab label="PRACTICE" />
                    <Tab label="NOTES" />
                  </Tabs>

                  {activeTab === 0 && (
                    <Box>
                      {selectedLesson.type === 'video' && (
                        <Paper
                          sx={{
                            aspectRatio: '16 / 9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            ...getThemeGlass(),
                          }}
                        >
                          <PlayIcon sx={{ fontSize: 64, opacity: 0.3 }} />
                        </Paper>
                      )}
                      
                      <Typography variant="body1" sx={{ mb: 3, letterSpacing: '0.02em', lineHeight: 1.8 }}>
                        This lesson covers the fundamental concepts of {selectedLesson.title.toLowerCase()}. 
                        You'll learn key principles, best practices, and real-world applications that will 
                        enhance your professional capabilities.
                      </Typography>

                      <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2, letterSpacing: '0.1em' }}>
                          KEY CONCEPTS
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText primary="Understanding core principles" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText primary="Practical application techniques" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText primary="Common pitfalls and solutions" />
                          </ListItem>
                        </List>
                      </Box>
                    </Box>
                  )}

                  {activeTab === 1 && (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 3, letterSpacing: '0.1em' }}>
                        PRACTICE QUIZ
                      </Typography>
                      <Paper sx={{ p: 3, mb: 3, ...getThemeGlass() }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Which of the following best describes the primary benefit of this technology?
                        </Typography>
                        <RadioGroup
                          value={quizAnswer}
                          onChange={(e) => setQuizAnswer(e.target.value)}
                        >
                          <FormControlLabel value="a" control={<Radio />} label="Increased efficiency" />
                          <FormControlLabel value="b" control={<Radio />} label="Cost reduction" />
                          <FormControlLabel value="c" control={<Radio />} label="Enhanced patient outcomes" />
                          <FormControlLabel value="d" control={<Radio />} label="All of the above" />
                        </RadioGroup>
                      </Paper>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        sx={{ ...mobileStyles.mobileButton }}
                      >
                        SUBMIT ANSWER
                      </Button>
                    </Box>
                  )}

                  {activeTab === 2 && (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={10}
                        placeholder="Take notes here..."
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: alpha(theme.palette.background.paper, 0.3),
                            fontFamily: 'monospace',
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ) : selectedModule ? (
                <Box>
                  <Typography variant="body1" sx={{ mb: 3, letterSpacing: '0.02em' }}>
                    Select a lesson from the module library to begin learning.
                  </Typography>
                  <Divider sx={{ my: 3, opacity: 0.1 }} />
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ScienceIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                    <Typography variant="body2" sx={{ letterSpacing: '0.1em' }}>
                      READY TO EXPERIMENT WITH KNOWLEDGE
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <BrainIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                  <Typography variant="body2" sx={{ letterSpacing: '0.1em' }}>
                    SELECT A SUBJECT TO BEGIN
                  </Typography>
                </Box>
              )}
            </Monolith>
          </Grid>

          {/* Right Panel - Module Library (Specimen Drawer) */}
          <Grid item xs={12} md={3}>
            <Monolith
              variant={themeMode === 'ocean-depths' ? 'frostedSteel' : 'carbon'}
              elevation="elevated"
              hover="none"
              title="MODULE LIBRARY"
              fullHeight
            >
              {selectedModule ? (
                <Stack spacing={1}>
                  {selectedModule.lessons.map((lesson) => (
                    <Paper
                      key={lesson.id}
                      onClick={() => handleStartLesson(lesson)}
                      sx={{
                        p: 2,
                        cursor: lesson.locked ? 'not-allowed' : 'pointer',
                        opacity: lesson.locked ? 0.5 : 1,
                        ...getThemeGlass(),
                        backgroundColor: selectedLesson?.id === lesson.id
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.background.paper, 0.3),
                        border: `1px solid ${selectedLesson?.id === lesson.id
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette.divider, 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': lesson.locked ? {} : {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {lesson.locked ? (
                          <LockIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                        ) : lesson.completed ? (
                          <CheckCircleIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
                        ) : (
                          getLessonIcon(lesson.type)
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              letterSpacing: '0.02em',
                              fontWeight: lesson.completed ? 400 : 600,
                              textDecoration: lesson.completed ? 'line-through' : 'none',
                              opacity: lesson.completed ? 0.7 : 1,
                            }}
                          >
                            {lesson.title}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <TimerIcon sx={{ fontSize: 12, color: theme.palette.text.secondary }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                              }}
                            >
                              {lesson.duration} min
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>
                    SELECT A SUBJECT TO VIEW LESSONS
                  </Typography>
                </Box>
              )}
            </Monolith>
          </Grid>
        </Grid>
      ) : (
        /* Create Mode */
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ mx: 'auto' }}>
            <Monolith
              variant="obsidian"
              elevation="floating"
              hover="none"
              title="LESSON CREATOR"
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="LESSON TITLE"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      letterSpacing: '0.1em',
                    },
                  }}
                />

                <ToggleButtonGroup
                  value="text"
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="text">
                    <BookIcon sx={{ mr: 1 }} />
                    TEXT
                  </ToggleButton>
                  <ToggleButton value="video">
                    <VideoIcon sx={{ mr: 1 }} />
                    VIDEO
                  </ToggleButton>
                  <ToggleButton value="interactive">
                    <ScienceIcon sx={{ mr: 1 }} />
                    INTERACTIVE
                  </ToggleButton>
                </ToggleButtonGroup>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="LESSON CONTENT"
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiInputLabel-root': {
                      letterSpacing: '0.1em',
                    },
                  }}
                />

                <Box>
                  <Typography variant="overline" sx={{ letterSpacing: '0.2em' }}>
                    ADD QUIZ QUESTION
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Question text"
                      fullWidth
                    />
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <Stack key={option} direction="row" alignItems="center" spacing={1}>
                        <Checkbox size="small" />
                        <TextField
                          size="small"
                          placeholder={`Option ${option}`}
                          fullWidth
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <AIGenerateButton
                  onClick={handleCreateLesson}
                  disabled={!newLessonTitle || !newLessonContent}
                  loading={loading}
                  label="CREATE LESSON"
                  fullWidth
                />
              </Stack>
            </Monolith>
          </Grid>
        </Grid>
      )}
    </CanvasBase>
  );
};

export default KnowledgeAcademy;
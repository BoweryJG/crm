// Growth Tracker - Modern Redesign
// AI-Powered Learning & Performance Tracking for Sales Excellence

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Grid,
  Stack,
  Divider,
  useTheme,
  alpha,
  Fade,
  Grow,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  CardActionArea,
  CardActions,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  Lock as LockIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  AutoAwesome as AIIcon,
  Psychology as BrainIcon,
  Timeline as TimelineIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  WorkspacePremium as CertificateIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  NavigateNext as NextIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkedIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useSUIS } from './SUISProvider';
import { useAuth } from '../../auth/AuthContext';
import { useThemeContext } from '../../themes/ThemeContext';
import { LearningModule } from '../../services/learningCenterService';

interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactElement;
  color: string;
  progress: number;
  modules: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  totalModules: number;
  completedModules: number;
  nextModule?: LearningModule;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const GrowthTracker: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const { state, actions } = useSUIS();
  const [viewMode, setViewMode] = useState<'overview' | 'paths' | 'achievements'>('overview');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const isSpaceTheme = themeMode === 'space';

  // Mock data for skill categories
  const skillCategories: SkillCategory[] = [
    { id: 'sales', name: 'Sales Mastery', icon: <TrendingUpIcon />, color: '#10B981', progress: 78, modules: 12 },
    { id: 'product', name: 'Product Expert', icon: <AssignmentIcon />, color: '#8B5CF6', progress: 65, modules: 8 },
    { id: 'clinical', name: 'Clinical Knowledge', icon: <SchoolIcon />, color: '#EF4444', progress: 42, modules: 15 },
    { id: 'relationships', name: 'Relationship Building', icon: <GroupIcon />, color: '#F59E0B', progress: 88, modules: 6 }
  ];

  // Mock achievements
  const achievements: Achievement[] = [
    { 
      id: '1', 
      name: 'First Steps', 
      description: 'Complete your first module', 
      icon: <RocketIcon />, 
      unlocked: true, 
      unlockedAt: new Date('2024-01-15'), 
      rarity: 'common' 
    },
    { 
      id: '2', 
      name: '7-Day Streak', 
      description: 'Learn for 7 consecutive days', 
      icon: <FireIcon />, 
      unlocked: true, 
      unlockedAt: new Date('2024-01-22'), 
      rarity: 'rare' 
    },
    { 
      id: '3', 
      name: 'Sales Champion', 
      description: 'Complete all sales modules', 
      icon: <TrophyIcon />, 
      unlocked: false, 
      rarity: 'epic' 
    },
    { 
      id: '4', 
      name: 'Master of All', 
      description: 'Complete all learning paths', 
      icon: <CertificateIcon />, 
      unlocked: false, 
      rarity: 'legendary' 
    }
  ];

  // Mock learning paths
  const learningPaths: LearningPath[] = [
    {
      id: '1',
      name: 'Sales Excellence Journey',
      description: 'Master consultative selling for medical devices',
      icon: <TrendingUpIcon />,
      color: '#10B981',
      totalModules: 12,
      completedModules: 9,
      estimatedHours: 24,
      difficulty: 'intermediate',
      nextModule: {
        id: 'next1',
        title: 'Advanced Negotiation Tactics',
        description: 'Learn to close high-value deals',
        category: 'sales',
        difficulty_level: 'advanced',
        estimated_duration: 90,
        content_type: 'mixed',
        content: { sections: [], resources: [] },
        prerequisites: [],
        learning_objectives: [],
        certification_eligible: true,
        ce_credits: 15,
        tags: ['negotiation'],
        instructor: { name: 'Expert', credentials: '', bio: '' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: true,
        enrollment_count: 0,
        average_rating: 0,
        completion_rate: 0
      }
    },
    {
      id: '2',
      name: 'Clinical Expertise Track',
      description: 'Deep dive into clinical applications and studies',
      icon: <SchoolIcon />,
      color: '#EF4444',
      totalModules: 15,
      completedModules: 6,
      estimatedHours: 30,
      difficulty: 'advanced'
    },
    {
      id: '3',
      name: 'Product Specialist Certification',
      description: 'Become a certified product expert',
      icon: <CertificateIcon />,
      color: '#8B5CF6',
      totalModules: 8,
      completedModules: 5,
      estimatedHours: 16,
      difficulty: 'beginner'
    }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return theme.palette.grey[500];
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { bg: alpha('#10B981', 0.1), text: '#10B981' };
      case 'intermediate': return { bg: alpha('#F59E0B', 0.1), text: '#F59E0B' };
      case 'advanced': return { bg: alpha('#EF4444', 0.1), text: '#EF4444' };
      default: return { bg: alpha(theme.palette.grey[500], 0.1), text: theme.palette.grey[500] };
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              <TrendingUpIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Growth Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personalized learning journey to sales excellence
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: isSpaceTheme ? '#8860D0' : theme.palette.primary.main }}>
                  7
                </Typography>
                <Typography variant="caption" color="text.secondary">Day Streak</Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
                  142
                </Typography>
                <Typography variant="caption" color="text.secondary">Total Points</Typography>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  85%
                </Typography>
                <Typography variant="caption" color="text.secondary">Completion</Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* View Mode Toggle */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, v) => v && setViewMode(v)}
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }
            }}
          >
            <ToggleButton value="overview">
              <BarChartIcon sx={{ mr: 1 }} />
              Overview
            </ToggleButton>
            <ToggleButton value="paths">
              <TimelineIcon sx={{ mr: 1 }} />
              Learning Paths
            </ToggleButton>
            <ToggleButton value="achievements">
              <TrophyIcon sx={{ mr: 1 }} />
              Achievements
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {viewMode === 'overview' && (
          <Fade in>
            <Grid container spacing={3}>
              {/* Progress Overview Card */}
              <Grid item xs={12}>
                <Card sx={{ 
                  background: isSpaceTheme 
                    ? 'linear-gradient(135deg, #8860D0 0%, #5CE1E6 100%)'
                    : 'linear-gradient(135deg, #3D52D5 0%, #44CFCB 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Your Learning Journey
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={6} sm={3}>
                            <Stack>
                              <Typography variant="h3" sx={{ fontWeight: 700 }}>23</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>Modules Completed</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Stack>
                              <Typography variant="h3" sx={{ fontWeight: 700 }}>47h</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>Learning Time</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Stack>
                              <Typography variant="h3" sx={{ fontWeight: 700 }}>92%</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg. Score</Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Stack>
                              <Typography variant="h3" sx={{ fontWeight: 700 }}>15</Typography>
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>Certificates</Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          <CircularProgress 
                            variant="determinate" 
                            value={85} 
                            size={120}
                            thickness={4}
                            sx={{ 
                              color: 'white',
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round'
                              }
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
                              justifyContent: 'center'
                            }}
                          >
                            <Stack alignItems="center">
                              <Typography variant="h4" sx={{ fontWeight: 700 }}>85%</Typography>
                              <Typography variant="caption">Overall Progress</Typography>
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {/* Background decoration */}
                  <Box
                    sx={{
                      position: 'absolute',
                      right: -50,
                      bottom: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }}
                  />
                </Card>
              </Grid>

              {/* Skill Categories */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Skill Development
                </Typography>
                <Grid container spacing={2}>
                  {skillCategories.map((skill) => (
                    <Grid item xs={12} sm={6} md={3} key={skill.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(skill.color, 0.1), color: skill.color, mr: 2 }}>
                              {skill.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {skill.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {skill.modules} modules
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: skill.color }}>
                              {skill.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={skill.progress}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              bgcolor: alpha(skill.color, 0.1),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: skill.color,
                                borderRadius: 4
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Recommended Next Steps */}
              <Grid item xs={12}>
                <Card sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: 1,
                  borderColor: alpha(theme.palette.info.main, 0.2)
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AIIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        AI-Powered Recommendations
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <LightbulbIcon sx={{ color: theme.palette.warning.main, mr: 2, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Focus on Clinical Knowledge
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Your clinical module scores are below average. Consider completing the "Clinical Foundations" path.
                            </Typography>
                            <Button size="small" sx={{ mt: 1 }} endIcon={<ArrowForwardIcon />}>
                              Start Learning
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <SpeedIcon sx={{ color: theme.palette.success.main, mr: 2, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Quick Win Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              You're 1 module away from completing "Product Specialist" certification.
                            </Typography>
                            <Button size="small" sx={{ mt: 1 }} endIcon={<ArrowForwardIcon />}>
                              Complete Now
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <GroupIcon sx={{ color: theme.palette.primary.main, mr: 2, mt: 0.5 }} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Join Study Group
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Connect with 12 peers working on similar modules this week.
                            </Typography>
                            <Button size="small" sx={{ mt: 1 }} endIcon={<ArrowForwardIcon />}>
                              Join Group
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Fade>
        )}

        {viewMode === 'paths' && (
          <Fade in>
            <Grid container spacing={3}>
              {learningPaths.map((path, idx) => (
                <Grid item xs={12} md={6} lg={4} key={path.id}>
                  <Grow in timeout={300 + idx * 100}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => setSelectedPath(path)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ bgcolor: alpha(path.color, 0.1), color: path.color, mr: 2 }}>
                            {path.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {path.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {path.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack spacing={2}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Progress
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {path.completedModules}/{path.totalModules} modules
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={(path.completedModules / path.totalModules) * 100}
                              sx={{ 
                                height: 8,
                                borderRadius: 4,
                                bgcolor: alpha(path.color, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: path.color,
                                  borderRadius: 4
                                }
                              }}
                            />
                          </Box>

                          <Stack direction="row" spacing={2}>
                            <Chip 
                              size="small" 
                              icon={<TimerIcon />}
                              label={`${path.estimatedHours}h`}
                              sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
                            />
                            <Chip 
                              size="small" 
                              label={path.difficulty}
                              sx={{ 
                                bgcolor: getDifficultyColor(path.difficulty).bg,
                                color: getDifficultyColor(path.difficulty).text,
                                fontWeight: 600
                              }}
                            />
                          </Stack>

                          {path.nextModule && (
                            <Box sx={{ 
                              p: 2, 
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderRadius: 1
                            }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                Next Module:
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {path.nextModule.title}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            bgcolor: path.color,
                            '&:hover': { bgcolor: alpha(path.color, 0.8) }
                          }}
                        >
                          Continue Learning
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}

        {viewMode === 'achievements' && (
          <Fade in>
            <Box>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                          <TrophyIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {achievements.filter(a => a.unlocked).length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Achievements Unlocked
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                          <FireIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            7
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Current Streak Days
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                          <StarIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            142
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Points Earned
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                All Achievements
              </Typography>
              <Grid container spacing={3}>
                {achievements.map((achievement, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                    <Grow in timeout={300 + idx * 100}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          opacity: achievement.unlocked ? 1 : 0.6,
                          position: 'relative',
                          overflow: 'visible'
                        }}
                      >
                        {achievement.unlocked && achievement.rarity !== 'common' && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: getRarityColor(achievement.rarity),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 2
                            }}
                          >
                            <StarIcon sx={{ fontSize: 16, color: 'white' }} />
                          </Box>
                        )}
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              mx: 'auto', 
                              mb: 2,
                              bgcolor: achievement.unlocked 
                                ? getRarityColor(achievement.rarity) 
                                : theme.palette.grey[300],
                              filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                            }}
                          >
                            {achievement.icon}
                          </Avatar>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {achievement.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {achievement.description}
                          </Typography>
                          {achievement.unlocked ? (
                            <Typography variant="caption" color="success.main">
                              Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Chip 
                              icon={<LockIcon />} 
                              label="Locked" 
                              size="small"
                              sx={{ bgcolor: alpha(theme.palette.grey[500], 0.1) }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default GrowthTracker;
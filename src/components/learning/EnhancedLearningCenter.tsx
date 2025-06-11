// Enhanced Learning Center - Interactive learning platform for aesthetic and dental professionals
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  Stack,
  Divider,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  useTheme,
  alpha,
  Tooltip,
  Rating,
  Badge,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import {
  School as LearningIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Quiz as QuizIcon,
  Assessment as TestIcon,
  EmojiEvents as CertificateIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Psychology as AIIcon,
  Timeline as ProgressIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Subtitles as SubtitlesIcon,
  ThreeDRotation as ThreeDIcon,
  Science as SimulationIcon,
  CameraAlt as PhotoIcon,
  VideoCall as VideoIcon,
  ArticleOutlined as DocumentIcon,
  TouchApp as InteractiveIcon,
  AutoAwesome as MagicIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  learningCenterService,
  LearningModule,
  UserProgress,
  Certification,
  LearningAnalytics,
  LearningSection,
  InteractiveElement,
  QuizQuestion,
  SimulationConfig
} from '../../services/learningCenterService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface EnhancedLearningCenterProps {
  userId?: string;
}

interface LearningSession {
  module_id: string;
  section_id: string;
  start_time: string;
  current_time: number;
  total_duration: number;
  is_playing: boolean;
  is_fullscreen: boolean;
  bookmarks: number[];
  notes: string[];
  completion_status: 'not_started' | 'in_progress' | 'completed';
}

const EnhancedLearningCenter: React.FC<EnhancedLearningCenterProps> = ({ 
  userId = 'demo-user' 
}) => {
  const theme = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [selectedSection, setSelectedSection] = useState<LearningSection | null>(null);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Data
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [certificates, setCertificates] = useState<Certification[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  
  // UI State
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterProcedure, setFilterProcedure] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'rating' | 'progress'>('title');
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadLearningData();
  }, [filterCategory, filterDifficulty, filterProcedure]);

  const loadLearningData = async () => {
    try {
      setLoading(true);
      
      // Load learning modules with filters
      const filters = {
        category: filterCategory !== 'all' ? filterCategory : undefined,
        difficulty_level: filterDifficulty !== 'all' ? filterDifficulty : undefined,
        procedure_type: filterProcedure !== 'all' ? filterProcedure : undefined,
        certification_eligible: undefined
      };
      
      const modules = await learningCenterService.getLearningModules(filters);
      setLearningModules(modules);

      // Load user progress for each module
      const progressData: Record<string, UserProgress> = {};
      for (const module of modules) {
        const progress = await learningCenterService.getUserProgress(userId, module.id);
        if (progress) {
          progressData[module.id] = progress;
        }
      }
      setUserProgress(progressData);

      // Load user certificates
      const userCertificates = await learningCenterService.getUserCertificates(userId);
      setCertificates(userCertificates);

      // Load learning analytics
      const learningAnalytics = await learningCenterService.getLearningAnalytics(userId);
      setAnalytics(learningAnalytics);

    } catch (error) {
      console.error('Error loading learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartModule = async (module: LearningModule) => {
    try {
      const progress = await learningCenterService.startModule(userId, module.id);
      setUserProgress(prev => ({
        ...prev,
        [module.id]: progress
      }));
      
      setSelectedModule(module);
      setSelectedSection(module.content.sections[0]);
      setCurrentSession({
        module_id: module.id,
        section_id: module.content.sections[0].id,
        start_time: new Date().toISOString(),
        current_time: 0,
        total_duration: module.content.sections[0].duration * 60,
        is_playing: false,
        is_fullscreen: false,
        bookmarks: [],
        notes: [],
        completion_status: 'in_progress'
      });
      setModuleDialogOpen(true);
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  const handleCompleteSection = async (sectionId: string, timeSpent: number) => {
    if (!selectedModule) return;
    
    try {
      const progress = await learningCenterService.completeSection(
        userId,
        selectedModule.id,
        sectionId,
        timeSpent
      );
      
      setUserProgress(prev => ({
        ...prev,
        [selectedModule.id]: progress
      }));

      // Move to next section if available
      const currentIndex = selectedModule.content.sections.findIndex(s => s.id === sectionId);
      if (currentIndex < selectedModule.content.sections.length - 1) {
        const nextSection = selectedModule.content.sections[currentIndex + 1];
        setSelectedSection(nextSection);
        setCurrentSession(prev => prev ? {
          ...prev,
          section_id: nextSection.id,
          current_time: 0,
          total_duration: nextSection.duration * 60,
          completion_status: 'in_progress'
        } : null);
      } else {
        // Module completed
        setCurrentSession(prev => prev ? {
          ...prev,
          completion_status: 'completed'
        } : null);
      }
    } catch (error) {
      console.error('Error completing section:', error);
    }
  };

  const handleSubmitQuiz = async (sectionId: string, score: number) => {
    if (!selectedModule) return;
    
    try {
      const progress = await learningCenterService.submitQuizScore(
        userId,
        selectedModule.id,
        sectionId,
        score
      );
      
      setUserProgress(prev => ({
        ...prev,
        [selectedModule.id]: progress
      }));
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const getModuleProgress = (moduleId: string): number => {
    const progress = userProgress[moduleId];
    return progress ? progress.progress_percentage : 0;
  };

  const getModuleStatus = (moduleId: string): UserProgress['status'] => {
    const progress = userProgress[moduleId];
    return progress ? progress.status : 'not_started';
  };

  const getContentTypeIcon = (contentType: LearningModule['content_type']) => {
    const icons = {
      video: <VideoIcon />,
      interactive: <InteractiveIcon />,
      simulation: <SimulationIcon />,
      quiz: <QuizIcon />,
      document: <DocumentIcon />,
      mixed: <MagicIcon />
    };
    return icons[contentType];
  };

  const getDifficultyColor = (difficulty: LearningModule['difficulty_level']) => {
    const colors = {
      beginner: theme.palette.success.main,
      intermediate: theme.palette.info.main,
      advanced: theme.palette.warning.main,
      expert: theme.palette.error.main
    };
    return colors[difficulty];
  };

  const getCategoryIcon = (category: LearningModule['category']) => {
    const icons = {
      procedure: <AssignmentIcon />,
      technology: <SimulationIcon />,
      sales: <GroupIcon />,
      business: <TrendingUpIcon />,
      compliance: <TestIcon />
    };
    return icons[category];
  };

  // Filter and sort modules
  const filteredAndSortedModules = learningModules
    .filter(module => {
      if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !module.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (showOnlyIncomplete && getModuleStatus(module.id) === 'completed') {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return a.estimated_duration - b.estimated_duration;
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'progress':
          return getModuleProgress(b.id) - getModuleProgress(a.id);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  // Chart configurations
  const progressChart = analytics ? {
    labels: analytics.performance_trends.map(trend => new Date(trend.date).toLocaleDateString()),
    datasets: [{
      label: 'Modules Completed',
      data: analytics.performance_trends.map(trend => trend.modules_completed),
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      tension: 0.4,
      fill: true
    }, {
      label: 'Average Quiz Score',
      data: analytics.performance_trends.map(trend => trend.avg_quiz_score),
      borderColor: theme.palette.success.main,
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      tension: 0.4,
      yAxisID: 'y1'
    }]
  } : null;

  const categoryBreakdown = {
    labels: ['Procedure', 'Technology', 'Sales', 'Business', 'Compliance'],
    datasets: [{
      data: [
        learningModules.filter(m => m.category === 'procedure').length,
        learningModules.filter(m => m.category === 'technology').length,
        learningModules.filter(m => m.category === 'sales').length,
        learningModules.filter(m => m.category === 'business').length,
        learningModules.filter(m => m.category === 'compliance').length
      ],
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main
      ]
    }]
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Enhanced Learning Center
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Interactive training platform for aesthetic and dental professionals
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="grid">Grid</ToggleButton>
            <ToggleButton value="list">List</ToggleButton>
          </ToggleButtonGroup>
          <Badge badgeContent={certificates.filter(c => c.status === 'active').length} color="success">
            <Button
              variant="outlined"
              startIcon={<CertificateIcon />}
              onClick={() => setCertificateDialogOpen(true)}
            >
              Certificates
            </Button>
          </Badge>
          <Button
            variant="contained"
            startIcon={<InsightsIcon />}
            onClick={() => setCurrentTab(3)}
          >
            Analytics
          </Button>
        </Box>
      </Box>

      {/* Progress Summary */}
      {analytics && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Learning Progress</AlertTitle>
          <Typography variant="body2">
            Completed {analytics.total_modules_completed} of {analytics.total_modules_enrolled} enrolled modules. 
            {analytics.certificates_earned} certificates earned with {analytics.ce_credits_earned} CE credits. 
            Current streak: {analytics.engagement_metrics.daily_streak} days.
          </Typography>
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Available Modules
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {learningModules.length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={`${learningModules.filter(m => m.certification_eligible).length} certification`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <LearningIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics ? Math.round((analytics.total_modules_completed / analytics.total_modules_enrolled) * 100) : 0}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating 
                      value={analytics ? analytics.total_modules_completed / analytics.total_modules_enrolled * 5 : 0}
                      size="small"
                      readOnly
                    />
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <ProgressIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Learning Time
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {analytics ? Math.round(analytics.total_time_spent) : 0}h
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="warning.main">
                      Avg {analytics ? Math.round(analytics.engagement_metrics.avg_session_duration) : 0}h/session
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)` }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Certificates
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {certificates.filter(c => c.status === 'active').length}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="info.main">
                      {analytics?.ce_credits_earned || 0} CE credits
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <CertificateIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Learning Modules" />
            <Tab label="My Progress" />
            <Tab label="Certifications" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>

        {/* Learning Modules Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters and Search */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search modules..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="procedure">Procedure</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="compliance">Compliance</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filterDifficulty}
                  label="Difficulty"
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="duration">Duration</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="progress">Progress</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyIncomplete}
                    onChange={(e) => setShowOnlyIncomplete(e.target.checked)}
                  />
                }
                label="Show Incomplete Only"
              />
            </Box>

            {/* Module Grid/List */}
            <Grid container spacing={3}>
              {filteredAndSortedModules.map((module) => {
                const progress = getModuleProgress(module.id);
                const status = getModuleStatus(module.id);
                
                return (
                  <Grid item xs={12} md={viewMode === 'grid' ? 6 : 12} lg={viewMode === 'grid' ? 4 : 12} key={module.id}>
                    <Card 
                      elevation={1} 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={() => handleStartModule(module)}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Avatar sx={{ 
                                bgcolor: alpha(getDifficultyColor(module.difficulty_level), 0.1),
                                color: getDifficultyColor(module.difficulty_level),
                                width: 32,
                                height: 32
                              }}>
                                {getCategoryIcon(module.category)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                                  {module.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                  <Chip 
                                    label={module.category}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    label={module.difficulty_level}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(getDifficultyColor(module.difficulty_level), 0.1),
                                      color: getDifficultyColor(module.difficulty_level)
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {module.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getContentTypeIcon(module.content_type)}
                                <Typography variant="caption">
                                  {module.content_type}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {module.estimated_duration}min
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {module.enrollment_count}
                                </Typography>
                              </Box>
                            </Box>

                            {/* Progress Bar */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progress
                                </Typography>
                                <Typography variant="caption" fontWeight="medium">
                                  {progress}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: alpha(getDifficultyColor(module.difficulty_level), 0.1),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: getDifficultyColor(module.difficulty_level)
                                  }
                                }}
                              />
                            </Box>

                            {/* Module Details */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Rating 
                                  value={module.average_rating / 20} // Convert to 5-star scale
                                  size="small"
                                  readOnly
                                />
                                <Typography variant="caption" color="text.secondary">
                                  ({module.average_rating})
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {module.certification_eligible && (
                                  <Chip 
                                    label={`${module.ce_credits} CE`}
                                    size="small"
                                    color="success"
                                    icon={<CertificateIcon />}
                                  />
                                )}
                                {status === 'completed' && (
                                  <CompleteIcon color="success" />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        {/* Instructor Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            {module.instructor.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="caption" fontWeight="medium">
                              {module.instructor.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {module.instructor.credentials}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* My Progress Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Learning Progress
            </Typography>
            
            <Grid container spacing={3}>
              {/* Progress Overview */}
              <Grid item xs={12} md={4}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Category Progress
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <Doughnut 
                      data={categoryBreakdown}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>

              {/* Progress Timeline */}
              <Grid item xs={12} md={8}>
                <Card elevation={1} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Learning Timeline
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    {progressChart && (
                      <Line 
                        data={progressChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              grid: {
                                drawOnChartArea: false,
                              },
                            },
                          }
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {Object.entries(userProgress)
                    .sort(([,a], [,b]) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())
                    .slice(0, 5)
                    .map(([moduleId, progress]) => {
                      const module = learningModules.find(m => m.id === moduleId);
                      if (!module) return null;
                      
                      return (
                        <ListItem key={moduleId}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(getDifficultyColor(module.difficulty_level), 0.1) }}>
                              {getCategoryIcon(module.category)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={module.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Progress: {progress.progress_percentage}% • 
                                  Last accessed: {new Date(progress.last_accessed).toLocaleDateString()}
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={progress.progress_percentage} 
                                  sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                />
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip 
                              label={progress.status}
                              size="small"
                              color={progress.status === 'completed' ? 'success' : 'default'}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Certifications Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Certifications
            </Typography>
            
            <Grid container spacing={3}>
              {certificates.map((certificate) => (
                <Grid item xs={12} md={6} lg={4} key={certificate.id}>
                  <Card elevation={1} sx={{ position: 'relative' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {certificate.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {certificate.issuing_authority.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip 
                              label={certificate.certificate_type}
                              size="small"
                              color="primary"
                            />
                            {certificate.ce_credits && (
                              <Chip 
                                label={`${certificate.ce_credits} CE Credits`}
                                size="small"
                                color="success"
                              />
                            )}
                          </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                          <CertificateIcon color="success" />
                        </Avatar>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justify: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Issued: {new Date(certificate.issued_date).toLocaleDateString()}
                        </Typography>
                        {certificate.expiry_date && (
                          <Typography variant="body2" color="text.secondary">
                            Expires: {new Date(certificate.expiry_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" startIcon={<ViewIcon />}>
                          View
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                          Download
                        </Button>
                        <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
                          Share
                        </Button>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Verification: {certificate.verification_code}
                      </Typography>
                    </CardContent>
                    <Chip 
                      label={certificate.status}
                      size="small"
                      color={certificate.status === 'active' ? 'success' : 'default'}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {currentTab === 3 && (
          <Box sx={{ p: 3 }}>
            {analytics && (
              <Grid container spacing={3}>
                {/* Learning Analytics Summary */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight="bold" color="primary">
                            {analytics.total_time_spent.toFixed(1)}h
                          </Typography>
                          <Typography variant="subtitle1">
                            Total Learning Time
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight="bold">
                            {analytics.engagement_metrics.daily_streak}
                          </Typography>
                          <Typography variant="subtitle1">
                            Day Streak
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight="bold" color="success.main">
                            {analytics.strengths.length}
                          </Typography>
                          <Typography variant="subtitle1">
                            Strength Areas
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" fontWeight="bold" color="warning.main">
                            {analytics.improvement_areas.length}
                          </Typography>
                          <Typography variant="subtitle1">
                            Improvement Areas
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Strengths and Improvements */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon color="success" />
                      Strengths
                    </Typography>
                    <List dense>
                      {analytics.strengths.map((strength, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon color="warning" />
                      Areas for Improvement
                    </Typography>
                    <List dense>
                      {analytics.improvement_areas.map((area, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AIIcon color="primary" />
                      Personalized Recommendations
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Recommended Next Modules
                        </Typography>
                        <List dense>
                          {analytics.recommendations.next_modules.map((moduleId, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={learningModules.find(m => m.id === moduleId)?.title || moduleId} 
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Review Modules
                        </Typography>
                        <List dense>
                          {analytics.recommendations.review_modules.map((moduleId, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={learningModules.find(m => m.id === moduleId)?.title || moduleId} 
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>
                          Skill Gaps to Address
                        </Typography>
                        <List dense>
                          {analytics.recommendations.skill_gaps.map((gap, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={gap} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Card>

      {/* Module Learning Dialog */}
      <Dialog 
        open={moduleDialogOpen} 
        onClose={() => setModuleDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          {selectedModule?.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedModule && selectedSection && currentSession && (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Section Navigation */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Stepper activeStep={selectedModule.content.sections.findIndex(s => s.id === selectedSection.id)} alternativeLabel>
                  {selectedModule.content.sections.map((section, index) => (
                    <Step key={section.id}>
                      <StepLabel>{section.title}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Content Area */}
              <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedSection.title}
                </Typography>
                
                {/* Content based on section type */}
                {selectedSection.type === 'video' && (
                  <Box sx={{ bgcolor: 'black', borderRadius: 2, p: 2, textAlign: 'center' }}>
                    <Typography color="white">
                      Video Player: {selectedSection.content.video_url}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                      <IconButton color="primary">
                        {currentSession.is_playing ? <PauseIcon /> : <PlayIcon />}
                      </IconButton>
                      <IconButton>
                        <VolumeIcon />
                      </IconButton>
                      <IconButton>
                        <SubtitlesIcon />
                      </IconButton>
                      <IconButton>
                        <FullscreenIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {selectedSection.type === 'interactive' && (
                  <Box sx={{ border: 2, borderColor: 'primary.main', borderRadius: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Interactive Content
                    </Typography>
                    <Typography>
                      3D models, simulations, and interactive elements would be rendered here.
                    </Typography>
                  </Box>
                )}

                {selectedSection.type === 'quiz' && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Knowledge Check
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<QuizIcon />}
                      onClick={() => setQuizDialogOpen(true)}
                    >
                      Start Quiz
                    </Button>
                  </Box>
                )}

                {/* Progress Bar */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Section Progress
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(currentSession.current_time / currentSession.total_duration) * 100} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<BookmarkIcon />}>
            Bookmark
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CompleteIcon />}
            onClick={() => {
              if (selectedSection) {
                handleCompleteSection(selectedSection.id, 5); // 5 minutes example
              }
            }}
          >
            Complete Section
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Gallery Dialog */}
      <Dialog 
        open={certificateDialogOpen} 
        onClose={() => setCertificateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          My Certificates
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} key={certificate.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6">{certificate.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(certificate.issued_date).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={certificate.status}
                      size="small"
                      color={certificate.status === 'active' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedLearningCenter;
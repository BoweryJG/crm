// Injection Simulator - Interactive training simulator for injection techniques
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Slider,
  FormControlLabel,
  Switch,
  Alert,
  AlertTitle,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  alpha,
  Stack,
  Divider,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as ResetIcon,
  CheckCircle as SuccessIcon,
  Cancel as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Speed as VelocityIcon,
  Straighten as AngleIcon,
  Height as DepthIcon,
  GpsFixed as TargetIcon,
  Timeline as TrajectoryIcon,
  Assessment as ScoreIcon,
  EmojiEvents as AchievementIcon,
  School as TeachingIcon,
  Feedback as FeedbackIcon,
  VideoCall as RecordIcon,
  Replay as ReplayIcon,
  TouchApp as TouchIcon,
  Visibility as ViewIcon,
  Settings as SettingsIcon,
  Science as PrecisionIcon,
  Timer as TimerIcon,
  TrendingUp as ImprovementIcon,
  Analytics as AnalyticsIcon,
  Star as StarIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';
import { procedureTrainingService } from '../../services/procedureTrainingService';
import type { 
  InjectionSite, 
  DangerZone, 
  AnatomyRegion
} from '../../services/procedureTrainingService';
import type { SimulationConfig } from '../../services/learningCenterService';
import ThreeDAnatomyViewer from './ThreeDAnatomyViewer';

interface InjectionSimulatorProps {
  anatomyRegion: AnatomyRegion;
  simulationConfig?: SimulationConfig;
  onSessionComplete?: (results: SimulationResults) => void;
  practiceMode?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface InjectionAttempt {
  id: string;
  timestamp: string;
  injection_site: InjectionSite;
  user_input: {
    angle: number; // degrees from perpendicular
    depth: number; // mm
    velocity: number; // mm/s
    volume: number; // units
    approach_vector: { x: number; y: number; z: number };
    hand_stability: number; // 0-100 score
    preparation_time: number; // seconds
  };
  simulation_result: {
    accuracy_score: number; // 0-100
    safety_score: number; // 0-100
    technique_score: number; // 0-100
    pain_level: number; // 0-10 simulated patient discomfort
    efficacy_prediction: number; // 0-100 expected treatment result
    complications_detected: string[];
    feedback_points: string[];
    improvement_suggestions: string[];
  };
  performance_metrics: {
    precision: number;
    consistency: number;
    confidence: number;
    timing: number;
  };
}

interface SimulationResults {
  session_id: string;
  anatomy_region: string;
  difficulty_level: string;
  total_attempts: number;
  successful_attempts: number;
  overall_score: number;
  component_scores: {
    accuracy: number;
    safety: number;
    technique: number;
    consistency: number;
  };
  attempts: InjectionAttempt[];
  learning_achievements: string[];
  areas_for_improvement: string[];
  next_recommendations: string[];
  practice_time: number;
  completion_date: string;
}

interface SimulationState {
  isActive: boolean;
  currentStep: number;
  selectedSite: InjectionSite | null;
  currentAttempt: Partial<InjectionAttempt> | null;
  sessionResults: SimulationResults | null;
  practiceSession: {
    start_time: string;
    attempts: InjectionAttempt[];
    current_score: number;
    streak: number;
  } | null;
}

const InjectionSimulator: React.FC<InjectionSimulatorProps> = ({
  anatomyRegion,
  simulationConfig,
  onSessionComplete,
  practiceMode = false,
  difficulty = 'beginner'
}) => {
  const theme = useTheme();
  const simulatorRef = useRef<HTMLDivElement>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    currentStep: 0,
    selectedSite: null,
    currentAttempt: null,
    sessionResults: null,
    practiceSession: null
  });

  // UI State
  const [showInstructions, setShowInstructions] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [recordingSession, setRecordingSession] = useState(false);

  // Simulation Parameters
  const [simulationSettings, setSimulationSettings] = useState({
    haptic_feedback: true,
    audio_guidance: true,
    real_time_scoring: true,
    show_danger_zones: true,
    difficulty_level: difficulty,
    time_pressure: false,
    precision_mode: false
  });

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    attempts_made: 0,
    success_rate: 0,
    average_score: 0,
    best_score: 0,
    current_streak: 0,
    total_practice_time: 0
  });

  useEffect(() => {
    if (simulationState.isActive) {
      initializeSimulation();
    }
  }, [simulationState.isActive]);

  const initializeSimulation = () => {
    const sessionId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSimulationState(prev => ({
      ...prev,
      practiceSession: {
        start_time: new Date().toISOString(),
        attempts: [],
        current_score: 0,
        streak: 0
      }
    }));
  };

  const startSimulation = () => {
    setSimulationState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }));
    setShowInstructions(false);
  };

  const stopSimulation = () => {
    if (simulationState.practiceSession) {
      const results = generateSessionResults();
      setSimulationState(prev => ({
        ...prev,
        isActive: false,
        sessionResults: results
      }));
      setResultsDialogOpen(true);
      onSessionComplete?.(results);
    }
  };

  const resetSimulation = () => {
    setSimulationState({
      isActive: false,
      currentStep: 0,
      selectedSite: null,
      currentAttempt: null,
      sessionResults: null,
      practiceSession: null
    });
    setShowInstructions(true);
  };

  const handleSiteSelection = (site: InjectionSite) => {
    setSimulationState(prev => ({
      ...prev,
      selectedSite: site,
      currentStep: 1
    }));
  };

  const performInjection = async (inputParams: InjectionAttempt['user_input']) => {
    if (!simulationState.selectedSite) return;

    const attemptId = `attempt_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Simulate injection analysis
    const result = await analyzeInjectionTechnique(
      simulationState.selectedSite,
      inputParams,
      difficulty
    );

    const attempt: InjectionAttempt = {
      id: attemptId,
      timestamp,
      injection_site: simulationState.selectedSite,
      user_input: inputParams,
      simulation_result: result,
      performance_metrics: calculatePerformanceMetrics(inputParams, result)
    };

    // Update session
    setSimulationState(prev => ({
      ...prev,
      currentAttempt: attempt,
      practiceSession: prev.practiceSession ? {
        ...prev.practiceSession,
        attempts: [...prev.practiceSession.attempts, attempt],
        current_score: result.accuracy_score,
        streak: result.accuracy_score > 80 ? prev.practiceSession.streak + 1 : 0
      } : null,
      currentStep: 2
    }));

    // Update performance metrics
    updatePerformanceMetrics(attempt);
    
    // Show feedback
    setFeedbackDialogOpen(true);
  };

  const analyzeInjectionTechnique = async (
    site: InjectionSite,
    input: InjectionAttempt['user_input'],
    difficulty: string
  ): Promise<InjectionAttempt['simulation_result']> => {
    // Simulate complex injection analysis
    const optimalAngle = site.angle;
    const optimalDepth = parseFloat(site.depth) || 5; // Convert depth string to number
    const optimalVelocity = 5; // mm/s for most procedures

    // Calculate accuracy based on deviation from optimal parameters
    const angleAccuracy = Math.max(0, 100 - Math.abs(input.angle - optimalAngle) * 2);
    const depthAccuracy = Math.max(0, 100 - Math.abs(input.depth - optimalDepth) * 5);
    const velocityAccuracy = Math.max(0, 100 - Math.abs(input.velocity - optimalVelocity) * 10);
    
    const accuracy_score = (angleAccuracy + depthAccuracy + velocityAccuracy) / 3;

    // Safety assessment
    const dangerProximity = calculateDangerProximity(input.approach_vector, anatomyRegion.danger_zones);
    const safety_score = Math.max(0, 100 - dangerProximity * 20);

    // Technique evaluation
    const technique_score = evaluateTechnique(input, site, difficulty);

    // Pain simulation (lower is better)
    const pain_level = calculatePainLevel(input, site);

    // Efficacy prediction
    const efficacy_prediction = (accuracy_score + technique_score) / 2;

    // Detect complications
    const complications = detectComplications(input, site, dangerProximity);

    // Generate feedback
    const feedback_points = generateFeedback(input, site, {
      accuracy_score,
      safety_score,
      technique_score
    });

    const improvement_suggestions = generateImprovementSuggestions(
      input,
      site,
      { angleAccuracy, depthAccuracy, velocityAccuracy }
    );

    return {
      accuracy_score: Math.round(accuracy_score),
      safety_score: Math.round(safety_score),
      technique_score: Math.round(technique_score),
      pain_level: Math.round(pain_level * 10) / 10,
      efficacy_prediction: Math.round(efficacy_prediction),
      complications_detected: complications,
      feedback_points,
      improvement_suggestions
    };
  };

  const calculateDangerProximity = (
    vector: { x: number; y: number; z: number },
    dangerZones: DangerZone[]
  ): number => {
    return dangerZones.reduce((minDistance, zone) => {
      const distance = Math.sqrt(
        Math.pow(vector.x - zone.coordinates.x, 2) +
        Math.pow(vector.y - zone.coordinates.y, 2) +
        Math.pow(vector.z - zone.coordinates.z, 2)
      );
      return Math.min(minDistance, distance / 10); // Normalize to 0-1 scale
    }, 1);
  };

  const evaluateTechnique = (
    input: InjectionAttempt['user_input'],
    site: InjectionSite,
    difficulty: string
  ): number => {
    let score = 100;

    // Penalize for poor hand stability
    score -= (100 - input.hand_stability) * 0.5;

    // Reward appropriate preparation time
    const expectedPrepTime = difficulty === 'beginner' ? 60 : difficulty === 'expert' ? 15 : 30;
    const prepTimeDiff = Math.abs(input.preparation_time - expectedPrepTime);
    score -= prepTimeDiff * 0.5;

    // Volume assessment
    const optimalVolume = site.typical_dosage / 10 || 0.1; // Convert dosage to volume
    const volumeAccuracy = Math.max(0, 100 - Math.abs(input.volume - optimalVolume) * 100);
    score = (score + volumeAccuracy) / 2;

    return Math.max(0, score);
  };

  const calculatePainLevel = (
    input: InjectionAttempt['user_input'],
    site: InjectionSite
  ): number => {
    let painScore = 0;

    // Higher velocity increases pain
    painScore += input.velocity * 0.1;

    // Incorrect angle increases pain
    const angleDiff = Math.abs(input.angle - site.angle);
    painScore += angleDiff * 0.05;

    // Incorrect depth increases pain
    const depthDiff = Math.abs(input.depth - (parseFloat(site.depth) || 5));
    painScore += depthDiff * 0.1;

    // Poor stability increases pain
    painScore += (100 - input.hand_stability) * 0.02;

    return Math.min(10, painScore);
  };

  const detectComplications = (
    input: InjectionAttempt['user_input'],
    site: InjectionSite,
    dangerProximity: number
  ): string[] => {
    const complications: string[] = [];

    if (dangerProximity < 0.3) {
      complications.push('Risk of vascular injury');
    }

    if (input.depth > (parseFloat(site.depth) || 5) * 1.5) {
      complications.push('Over-injection depth');
    }

    if (input.velocity > 10) {
      complications.push('Injection too rapid');
    }

    if (input.volume > (site.typical_dosage / 10 || 0.1) * 2) {
      complications.push('Excessive volume');
    }

    if (input.hand_stability < 60) {
      complications.push('Poor needle control');
    }

    return complications;
  };

  const generateFeedback = (
    input: InjectionAttempt['user_input'],
    site: InjectionSite,
    scores: { accuracy_score: number; safety_score: number; technique_score: number }
  ): string[] => {
    const feedback: string[] = [];

    if (scores.accuracy_score > 90) {
      feedback.push('Excellent accuracy! Your injection placement was precise.');
    } else if (scores.accuracy_score > 70) {
      feedback.push('Good accuracy. Minor adjustments will improve precision.');
    } else {
      feedback.push('Work on accuracy. Review optimal injection parameters.');
    }

    if (scores.safety_score > 90) {
      feedback.push('Outstanding safety awareness. No danger zones compromised.');
    } else if (scores.safety_score < 70) {
      feedback.push('Safety concern: Too close to danger zones. Review anatomy.');
    }

    if (input.hand_stability > 90) {
      feedback.push('Excellent hand stability and needle control.');
    }

    if (Math.abs(input.angle - site.injection_angle) < 5) {
      feedback.push('Perfect injection angle achieved.');
    }

    return feedback;
  };

  const generateImprovementSuggestions = (
    input: InjectionAttempt['user_input'],
    site: InjectionSite,
    accuracyBreakdown: { angleAccuracy: number; depthAccuracy: number; velocityAccuracy: number }
  ): string[] => {
    const suggestions: string[] = [];

    if (accuracyBreakdown.angleAccuracy < 80) {
      suggestions.push(`Adjust injection angle: aim for ${site.injection_angle}° perpendicular`);
    }

    if (accuracyBreakdown.depthAccuracy < 80) {
      suggestions.push(`Optimize injection depth: target ${site.injection_depth}mm`);
    }

    if (accuracyBreakdown.velocityAccuracy < 80) {
      suggestions.push('Moderate injection velocity: slower, more controlled delivery');
    }

    if (input.hand_stability < 80) {
      suggestions.push('Practice hand stability exercises and proper grip technique');
    }

    if (input.preparation_time < 10) {
      suggestions.push('Take more time for preparation and anatomical assessment');
    }

    return suggestions;
  };

  const calculatePerformanceMetrics = (
    input: InjectionAttempt['user_input'],
    result: InjectionAttempt['simulation_result']
  ): InjectionAttempt['performance_metrics'] => {
    return {
      precision: result.accuracy_score,
      consistency: Math.min(100, input.hand_stability + (100 - Math.abs(input.velocity - 5) * 10)),
      confidence: Math.min(100, 100 - input.preparation_time * 2 + input.hand_stability),
      timing: Math.max(0, 100 - Math.abs(input.preparation_time - 30))
    };
  };

  const updatePerformanceMetrics = (attempt: InjectionAttempt) => {
    setPerformanceMetrics(prev => {
      const newAttempts = prev.attempts_made + 1;
      const successful = attempt.simulation_result.accuracy_score > 70;
      const newSuccessRate = ((prev.success_rate * prev.attempts_made) + (successful ? 100 : 0)) / newAttempts;
      const newAverage = ((prev.average_score * prev.attempts_made) + attempt.simulation_result.accuracy_score) / newAttempts;
      
      return {
        attempts_made: newAttempts,
        success_rate: newSuccessRate,
        average_score: newAverage,
        best_score: Math.max(prev.best_score, attempt.simulation_result.accuracy_score),
        current_streak: successful ? prev.current_streak + 1 : 0,
        total_practice_time: prev.total_practice_time + (attempt.user_input.preparation_time || 0)
      };
    });
  };

  const generateSessionResults = (): SimulationResults => {
    if (!simulationState.practiceSession) {
      throw new Error('No active practice session');
    }

    const session = simulationState.practiceSession;
    const attempts = session.attempts;
    const successfulAttempts = attempts.filter(a => a.simulation_result.accuracy_score > 70).length;
    
    const overallScore = attempts.length > 0 
      ? attempts.reduce((sum, a) => sum + a.simulation_result.accuracy_score, 0) / attempts.length
      : 0;

    const componentScores = {
      accuracy: attempts.length > 0 
        ? attempts.reduce((sum, a) => sum + a.simulation_result.accuracy_score, 0) / attempts.length
        : 0,
      safety: attempts.length > 0 
        ? attempts.reduce((sum, a) => sum + a.simulation_result.safety_score, 0) / attempts.length
        : 0,
      technique: attempts.length > 0 
        ? attempts.reduce((sum, a) => sum + a.simulation_result.technique_score, 0) / attempts.length
        : 0,
      consistency: attempts.length > 0 
        ? attempts.reduce((sum, a) => sum + a.performance_metrics.consistency, 0) / attempts.length
        : 0
    };

    const learningAchievements: string[] = [];
    if (overallScore > 90) learningAchievements.push('Master Injector');
    if (successfulAttempts === attempts.length && attempts.length > 0) learningAchievements.push('Perfect Session');
    if (componentScores.safety > 95) learningAchievements.push('Safety Expert');
    if (performanceMetrics.current_streak > 5) learningAchievements.push('Consistency Champion');

    const areasForImprovement: string[] = [];
    if (componentScores.accuracy < 80) areasForImprovement.push('Injection Accuracy');
    if (componentScores.safety < 85) areasForImprovement.push('Safety Awareness');
    if (componentScores.technique < 75) areasForImprovement.push('Technique Refinement');
    if (componentScores.consistency < 70) areasForImprovement.push('Hand Stability');

    const nextRecommendations = [
      overallScore < 70 ? 'Continue practicing basic injection techniques' : 'Advance to more complex procedures',
      componentScores.safety < 90 ? 'Review anatomical danger zones' : 'Explore advanced safety protocols',
      'Practice with different injection sites and volumes'
    ];

    return {
      session_id: `session_${Date.now()}`,
      anatomy_region: anatomyRegion.name,
      difficulty_level: difficulty,
      total_attempts: attempts.length,
      successful_attempts: successfulAttempts,
      overall_score: Math.round(overallScore),
      component_scores: {
        accuracy: Math.round(componentScores.accuracy),
        safety: Math.round(componentScores.safety),
        technique: Math.round(componentScores.technique),
        consistency: Math.round(componentScores.consistency)
      },
      attempts,
      learning_achievements: learningAchievements,
      areas_for_improvement: areasForImprovement,
      next_recommendations: nextRecommendations,
      practice_time: Math.round((new Date().getTime() - new Date(session.start_time).getTime()) / 1000),
      completion_date: new Date().toISOString()
    };
  };

  const nextAttempt = () => {
    setSimulationState(prev => ({
      ...prev,
      currentStep: 0,
      selectedSite: null,
      currentAttempt: null
    }));
    setFeedbackDialogOpen(false);
  };

  const simulationSteps = [
    'Select Injection Site',
    'Configure Parameters',
    'Perform Injection',
    'Review Results'
  ];

  return (
    <Box ref={simulatorRef} sx={{ width: '100%', height: '100%' }}>
      {/* Simulation Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Injection Simulator
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={difficulty} 
              size="small" 
              color={
                difficulty === 'expert' ? 'error' :
                difficulty === 'advanced' ? 'warning' :
                difficulty === 'intermediate' ? 'info' : 'success'
              }
            />
            <Chip 
              label={anatomyRegion.name} 
              size="small" 
              variant="outlined" 
            />
            {simulationState.isActive && (
              <Chip 
                label={`Step ${simulationState.currentStep + 1}/4`}
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => setSettingsDialogOpen(true)}>
            <SettingsIcon />
          </IconButton>
          {!simulationState.isActive ? (
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={startSimulation}
            >
              Start Practice
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={stopSimulation}
              >
                End Session
              </Button>
              <Button
                variant="outlined"
                startIcon={<ResetIcon />}
                onClick={resetSimulation}
              >
                Reset
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Performance Metrics Bar */}
      {simulationState.isActive && (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {performanceMetrics.attempts_made}
                </Typography>
                <Typography variant="caption">Attempts</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {performanceMetrics.success_rate.toFixed(0)}%
                </Typography>
                <Typography variant="caption">Success Rate</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {performanceMetrics.average_score.toFixed(0)}
                </Typography>
                <Typography variant="caption">Avg Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {performanceMetrics.best_score}
                </Typography>
                <Typography variant="caption">Best Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">
                  {performanceMetrics.current_streak}
                </Typography>
                <Typography variant="caption">Streak</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {Math.round(performanceMetrics.total_practice_time / 60)}m
                </Typography>
                <Typography variant="caption">Practice Time</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Instructions Panel */}
      {showInstructions && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Injection Simulation Instructions</AlertTitle>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Practice safe injection techniques in a risk-free virtual environment. 
            Select an injection site, configure your parameters, and receive real-time feedback on your technique.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Select injection site" size="small" icon={<TargetIcon />} />
            <Chip label="Set angle & depth" size="small" icon={<AngleIcon />} />
            <Chip label="Control velocity" size="small" icon={<VelocityIcon />} />
            <Chip label="Get instant feedback" size="small" icon={<FeedbackIcon />} />
          </Box>
        </Alert>
      )}

      {/* Main Simulation Area */}
      <Grid container spacing={3}>
        {/* 3D Anatomy Viewer */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ height: 600 }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <ThreeDAnatomyViewer
                anatomyRegion={anatomyRegion}
                onInjectionPointClick={handleSiteSelection}
                interactive={simulationState.isActive}
                showControls={true}
              />
              
              {/* Simulation Overlay */}
              {simulationState.isActive && simulationState.currentStep === 1 && simulationState.selectedSite && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    p: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    borderRadius: 2,
                    minWidth: 200
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Configure Injection
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption">Angle (degrees)</Typography>
                      <Slider
                        defaultValue={simulationState.selectedSite.injection_angle}
                        min={0}
                        max={90}
                        valueLabelDisplay="auto"
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption">Depth (mm)</Typography>
                      <Slider
                        defaultValue={simulationState.selectedSite.injection_depth}
                        min={1}
                        max={20}
                        valueLabelDisplay="auto"
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption">Velocity (mm/s)</Typography>
                      <Slider
                        defaultValue={5}
                        min={1}
                        max={15}
                        valueLabelDisplay="auto"
                        size="small"
                      />
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => performInjection({
                        angle: simulationState.selectedSite!.injection_angle,
                        depth: simulationState.selectedSite!.injection_depth,
                        velocity: 5,
                        volume: simulationState.selectedSite!.recommended_volume || 0.1,
                        approach_vector: { x: 0, y: 0, z: 1 },
                        hand_stability: 85 + Math.random() * 15,
                        preparation_time: 20 + Math.random() * 20
                      })}
                    >
                      Perform Injection
                    </Button>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Simulation Control Panel */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            {/* Progress Stepper */}
            {simulationState.isActive && (
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Simulation Progress
                  </Typography>
                  <Stepper activeStep={simulationState.currentStep} orientation="vertical">
                    {simulationSteps.map((step, index) => (
                      <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            )}

            {/* Injection Sites List */}
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Available Injection Sites
                </Typography>
                <List dense>
                  {anatomyRegion.injection_sites.map((site) => (
                    <ListItem
                      key={site.name}
                      button
                      selected={simulationState.selectedSite?.name === site.name}
                      onClick={() => simulationState.isActive && handleSiteSelection(site)}
                      disabled={!simulationState.isActive}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main'
                        }}>
                          <TargetIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={site.name}
                        secondary={`${site.injection_angle}° • ${site.injection_depth}mm`}
                      />
                      <Chip 
                        label={site.difficulty}
                        size="small"
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Session Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {simulationState.practiceSession?.attempts.length || 0}
                      </Typography>
                      <Typography variant="caption">Attempts</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main">
                        {simulationState.practiceSession?.streak || 0}
                      </Typography>
                      <Typography variant="caption">Current Streak</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Injection Analysis & Feedback
        </DialogTitle>
        <DialogContent>
          {simulationState.currentAttempt && (
            <Box sx={{ pt: 2 }}>
              {/* Overall Score */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={simulationState.currentAttempt.simulation_result?.accuracy_score || 0}
                    size={80}
                    sx={{ 
                      color: simulationState.currentAttempt.simulation_result?.accuracy_score! > 80 ? 
                        'success.main' : simulationState.currentAttempt.simulation_result?.accuracy_score! > 60 ? 
                        'warning.main' : 'error.main'
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
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {simulationState.currentAttempt.simulation_result?.accuracy_score}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6">
                    {simulationState.currentAttempt.simulation_result?.accuracy_score! > 80 ? 'Excellent!' :
                     simulationState.currentAttempt.simulation_result?.accuracy_score! > 60 ? 'Good!' : 'Needs Improvement'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Injection Score
                  </Typography>
                </Box>
              </Box>

              {/* Component Scores */}
              <Typography variant="subtitle1" gutterBottom>
                Performance Breakdown
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom>Accuracy</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={simulationState.currentAttempt.simulation_result?.accuracy_score || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      {simulationState.currentAttempt.simulation_result?.accuracy_score}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom>Safety</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={simulationState.currentAttempt.simulation_result?.safety_score || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      {simulationState.currentAttempt.simulation_result?.safety_score}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom>Technique</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={simulationState.currentAttempt.simulation_result?.technique_score || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      {simulationState.currentAttempt.simulation_result?.technique_score}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="body2" gutterBottom>Pain Level</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(10 - simulationState.currentAttempt.simulation_result?.pain_level!) * 10}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                      {simulationState.currentAttempt.simulation_result?.pain_level}/10
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Feedback Points */}
              <Typography variant="subtitle1" gutterBottom>
                Feedback
              </Typography>
              <List dense>
                {simulationState.currentAttempt.simulation_result?.feedback_points.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                        <InfoIcon color="success" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>

              {/* Improvement Suggestions */}
              {simulationState.currentAttempt.simulation_result?.improvement_suggestions.length! > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Improvement Suggestions
                  </Typography>
                  <List dense>
                    {simulationState.currentAttempt.simulation_result?.improvement_suggestions.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                            <ImprovementIcon color="warning" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* Complications */}
              {simulationState.currentAttempt.simulation_result?.complications_detected.length! > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <AlertTitle>Complications Detected</AlertTitle>
                  <List dense>
                    {simulationState.currentAttempt.simulation_result?.complications_detected.map((complication, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={complication} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained" onClick={nextAttempt}>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Simulation Settings
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.haptic_feedback}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    haptic_feedback: e.target.checked
                  }))}
                />
              }
              label="Haptic Feedback"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.audio_guidance}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    audio_guidance: e.target.checked
                  }))}
                />
              }
              label="Audio Guidance"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.real_time_scoring}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    real_time_scoring: e.target.checked
                  }))}
                />
              }
              label="Real-time Scoring"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.show_danger_zones}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    show_danger_zones: e.target.checked
                  }))}
                />
              }
              label="Show Danger Zones"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.time_pressure}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    time_pressure: e.target.checked
                  }))}
                />
              }
              label="Time Pressure Mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulationSettings.precision_mode}
                  onChange={(e) => setSimulationSettings(prev => ({
                    ...prev,
                    precision_mode: e.target.checked
                  }))}
                />
              }
              label="Precision Mode"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>
            Close
          </Button>
          <Button variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog
        open={resultsDialogOpen}
        onClose={() => setResultsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Practice Session Results
        </DialogTitle>
        <DialogContent>
          {simulationState.sessionResults && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Overall Performance */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Session Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="primary">
                            {simulationState.sessionResults.overall_score}
                          </Typography>
                          <Typography variant="caption">Overall Score</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="success.main">
                            {simulationState.sessionResults.successful_attempts}/{simulationState.sessionResults.total_attempts}
                          </Typography>
                          <Typography variant="caption">Success Rate</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {/* Component Scores */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Component Performance
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(simulationState.sessionResults.component_scores).map(([component, score]) => (
                          <Grid item xs={6} key={component}>
                            <Box>
                              <Typography variant="body2">{component}</Typography>
                              <LinearProgress
                                variant="determinate"
                                value={score}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption">{score}%</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Card>
                </Grid>

                {/* Achievements & Improvements */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    {/* Achievements */}
                    {simulationState.sessionResults.learning_achievements.length > 0 && (
                      <Card elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AchievementIcon color="warning" />
                          Achievements
                        </Typography>
                        <Stack spacing={1}>
                          {simulationState.sessionResults.learning_achievements.map((achievement, index) => (
                            <Chip
                              key={index}
                              label={achievement}
                              color="warning"
                              icon={<StarIcon />}
                            />
                          ))}
                        </Stack>
                      </Card>
                    )}

                    {/* Areas for Improvement */}
                    {simulationState.sessionResults.areas_for_improvement.length > 0 && (
                      <Card elevation={1} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Focus Areas
                        </Typography>
                        <List dense>
                          {simulationState.sessionResults.areas_for_improvement.map((area, index) => (
                            <ListItem key={index}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                                  <TaskIcon color="info" />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={area} />
                            </ListItem>
                          ))}
                        </List>
                      </Card>
                    )}
                  </Stack>
                </Grid>

                {/* Detailed Attempt History */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Attempt History
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Attempt</TableCell>
                          <TableCell>Injection Site</TableCell>
                          <TableCell>Accuracy</TableCell>
                          <TableCell>Safety</TableCell>
                          <TableCell>Technique</TableCell>
                          <TableCell>Pain Level</TableCell>
                          <TableCell>Result</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {simulationState.sessionResults.attempts.map((attempt, index) => (
                          <TableRow key={attempt.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{attempt.injection_site.name}</TableCell>
                            <TableCell>{attempt.simulation_result.accuracy_score}%</TableCell>
                            <TableCell>{attempt.simulation_result.safety_score}%</TableCell>
                            <TableCell>{attempt.simulation_result.technique_score}%</TableCell>
                            <TableCell>{attempt.simulation_result.pain_level}/10</TableCell>
                            <TableCell>
                              {attempt.simulation_result.accuracy_score > 70 ? (
                                <SuccessIcon color="success" />
                              ) : (
                                <ErrorIcon color="error" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Next Recommendations */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Next Steps
                    </Typography>
                    <List>
                      {simulationState.sessionResults.next_recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                              <TeachingIcon color="primary" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultsDialogOpen(false)}>
            Close
          </Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share Results
          </Button>
          <Button variant="contained" onClick={resetSimulation}>
            New Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InjectionSimulator;
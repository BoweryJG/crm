// Case Study Viewer - Interactive patient scenarios with decision trees for treatment planning
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  AlertTitle,
  Paper,
  LinearProgress,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import {
  Person as PatientIcon,
  LocalHospital as MedicalIcon,
  Psychology as DecisionIcon,
  Assignment as CaseIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Warning as CautionIcon,
  Info as InfoIcon,
  Star as ExpertIcon,
  School as LearningIcon,
  Timeline as ProgressIcon,
  Assessment as QuizIcon,
  EmojiEvents as AchievementIcon,
  TrendingUp as ImprovementIcon,
  Feedback as FeedbackIcon,
  Refresh as ResetIcon,
  PlayArrow as StartIcon,
  Stop as EndIcon,
  ExpandMore as ExpandIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Speed as TimerIcon,
  Lightbulb as HintIcon,
  Group as CollaborateIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { procedureTrainingService } from '../../services/procedureTrainingService';
import type { 
  CaseStudyTemplate,
  OutcomeVariation as CaseStudyResult,
  AnatomyRegion 
} from '../../services/procedureTrainingService';

// Local DecisionNode type for the component
interface DecisionNode {
  node_id: string;
  is_root: boolean;
  scenario: string;
  hints?: string[];
  options: {
    option_id: string;
    option_text: string;
    is_optimal: boolean;
    risk_level: string;
    consequence: string;
    leads_to_node: string | null;
    expert_notes?: string;
  }[];
}

// Local CaseStudy type for the component
interface CaseStudy {
  id: string;
  case_id: string;
  title: string;
  patient_profile: any;
  clinical_presentation: string;
  decision_tree: DecisionNode[];
  outcomes: any[];
  learning_objectives: string[];
  difficulty_level: string;
  estimated_time: number;
  complexity_score: number;
  scoring_criteria: any;
}

interface CaseStudyViewerProps {
  anatomyRegion: AnatomyRegion;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  onCaseComplete?: (result: CaseStudySession) => void;
  practiceMode?: boolean;
  collaborative?: boolean;
}

interface CaseStudySession {
  case_id: string;
  session_id: string;
  anatomy_region: string;
  difficulty_level: string;
  start_time: string;
  end_time?: string;
  total_decisions: number;
  correct_decisions: number;
  decision_path: DecisionPath[];
  final_outcome: CaseOutcome;
  learning_points: string[];
  areas_for_improvement: string[];
  expert_feedback: string[];
  completion_time: number;
  confidence_scores: number[];
  decision_speed: number[];
  case_complexity_score: number;
  clinical_reasoning_score: number;
}

interface DecisionPath {
  node_id: string;
  decision_text: string;
  selected_option: string;
  is_correct: boolean;
  reasoning_provided?: string;
  time_taken: number;
  confidence_level: number;
  expert_notes?: string;
  consequence: string;
}

interface CaseOutcome {
  outcome_type: 'optimal' | 'acceptable' | 'suboptimal' | 'adverse';
  patient_satisfaction: number;
  treatment_efficacy: number;
  safety_score: number;
  cost_effectiveness: number;
  complications: string[];
  follow_up_required: string[];
  outcome_description: string;
}

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medical_history: string[];
  medications: string[];
  allergies: string[];
  chief_complaint: string;
  treatment_goals: string[];
  contraindications: string[];
  risk_factors: string[];
  previous_treatments: string[];
  expectations: string;
  budget_considerations?: string;
}

const CaseStudyViewer: React.FC<CaseStudyViewerProps> = ({
  anatomyRegion,
  difficulty = 'beginner',
  onCaseComplete,
  practiceMode = false,
  collaborative = false
}) => {
  const theme = useTheme();

  // State
  const [loading, setLoading] = useState(false);
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [activeSession, setActiveSession] = useState<CaseStudySession | null>(null);
  const [decisionPath, setDecisionPath] = useState<DecisionPath[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  
  // UI State
  const [showHints, setShowHints] = useState(false);
  const [showExpertMode, setShowExpertMode] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState(80);
  const [reasoning, setReasoning] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Performance tracking
  const [decisionStartTime, setDecisionStartTime] = useState<Date | null>(null);
  const [totalThinkingTime, setTotalThinkingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime && activeSession && !activeSession.end_time) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - sessionStartTime.getTime());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStartTime, activeSession]);

  const startCaseStudy = async () => {
    try {
      setLoading(true);
      
      // Create a mock case study template for now
      const mockTemplate: CaseStudyTemplate = {
        scenario_type: 'routine',
        patient_demographics: {
          age_range: '30-40',
          gender_distribution: 'female',
          skin_types: ['II', 'III'],
          common_concerns: ['Fine lines', 'Skin laxity'],
          typical_expectations: ['Natural results', 'Minimal downtime']
        },
        complexity_factors: ['First-time patient', 'Moderate aging signs'],
        learning_focus: ['Patient consultation', 'Treatment planning'],
        decision_points: [],
        outcome_variations: []
      };
      
      const caseStudySection = await procedureTrainingService.generateCaseStudy(
        mockTemplate,
        'botox' // Default to botox procedure
      );
      
      // Transform the learning section into case study format
      const caseStudy = {
        id: caseStudySection.id,
        case_id: caseStudySection.id,
        title: caseStudySection.title,
        patient_profile: {
          age: 35,
          gender: 'female',
          skin_type: 'II',
          medical_history: [],
          chief_complaint: 'Facial rejuvenation',
          expectations: 'Natural results',
          contraindications: []
        },
        clinical_presentation: 'Patient seeking facial rejuvenation',
        decision_tree: [
          {
            node_id: 'root',
            is_root: true,
            scenario: 'Patient presents for facial rejuvenation consultation. How do you proceed?',
            hints: ['Consider patient age and skin type', 'Evaluate medical history'],
            options: [
              {
                option_id: 'opt1',
                option_text: 'Recommend Botox for dynamic wrinkles',
                is_optimal: true,
                risk_level: 'low',
                consequence: 'Good choice for initial treatment',
                leads_to_node: 'node2',
                expert_notes: 'Botox is a safe starting point for most patients'
              },
              {
                option_id: 'opt2',
                option_text: 'Suggest dermal fillers immediately',
                is_optimal: false,
                risk_level: 'medium',
                consequence: 'May be too aggressive for first-time patients',
                leads_to_node: 'node3',
                expert_notes: 'Consider starting with less invasive options'
              }
            ]
          },
          {
            node_id: 'node2',
            is_root: false,
            scenario: 'Patient is interested in Botox. What areas do you recommend treating first?',
            hints: ['Start conservatively', 'Focus on most bothersome areas'],
            options: [
              {
                option_id: 'opt3',
                option_text: 'Start with crow\'s feet and forehead lines',
                is_optimal: true,
                risk_level: 'low',
                consequence: 'Natural-looking results',
                leads_to_node: null,
                expert_notes: 'Conservative approach builds trust'
              }
            ]
          },
          {
            node_id: 'node3',
            is_root: false,
            scenario: 'Patient hesitates about fillers. How do you address their concerns?',
            hints: ['Education is key', 'Address specific concerns'],
            options: [
              {
                option_id: 'opt4',
                option_text: 'Explain the safety profile and reversibility of HA fillers',
                is_optimal: true,
                risk_level: 'low',
                consequence: 'Patient feels more informed and comfortable',
                leads_to_node: null,
                expert_notes: 'Education builds confidence'
              }
            ]
          }
        ],
        outcomes: [],
        learning_objectives: ['Proper patient assessment', 'Safe injection technique', 'Managing expectations'],
        difficulty_level: difficulty,
        estimated_time: 30,
        complexity_score: difficulty === 'beginner' ? 30 : difficulty === 'intermediate' ? 50 : difficulty === 'advanced' ? 70 : 90,
        scoring_criteria: {
          decision_quality: 0.4,
          timing: 0.2,
          patient_communication: 0.2,
          safety_awareness: 0.2
        }
      };
      
      const selectedCase = caseStudy;
      setCurrentCase(selectedCase);
      
      // Find the root decision node
      const rootNode = selectedCase.decision_tree.find(node => node.is_root);
      if (!rootNode) {
        throw new Error('Invalid case study structure');
      }
      
      setCurrentNode(rootNode);
      
      // Generate patient profile
      const profile = generatePatientProfile(selectedCase);
      setPatientProfile(profile);
      
      // Initialize session
      const session: CaseStudySession = {
        case_id: selectedCase.case_id,
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        anatomy_region: anatomyRegion.name,
        difficulty_level: difficulty,
        start_time: new Date().toISOString(),
        total_decisions: 0,
        correct_decisions: 0,
        decision_path: [],
        final_outcome: {
          outcome_type: 'optimal',
          patient_satisfaction: 0,
          treatment_efficacy: 0,
          safety_score: 0,
          cost_effectiveness: 0,
          complications: [],
          follow_up_required: [],
          outcome_description: ''
        },
        learning_points: [],
        areas_for_improvement: [],
        expert_feedback: [],
        completion_time: 0,
        confidence_scores: [],
        decision_speed: [],
        case_complexity_score: selectedCase.complexity_score,
        clinical_reasoning_score: 0
      };
      
      setActiveSession(session);
      setSessionStartTime(new Date());
      setDecisionStartTime(new Date());
      setDecisionPath([]);
      
    } catch (error) {
      console.error('Error starting case study:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePatientProfile = (caseStudy: CaseStudy): PatientProfile => {
    const profiles = [
      {
        id: 'patient_1',
        name: 'Sarah Johnson',
        age: 34,
        gender: 'female' as const,
        medical_history: ['No significant medical history'],
        medications: ['None'],
        allergies: ['NKDA'],
        chief_complaint: 'Concerns about facial aging',
        treatment_goals: ['Reduce fine lines', 'Improve skin texture', 'Natural-looking results'],
        contraindications: [],
        risk_factors: ['Fair skin', 'Sun exposure'],
        previous_treatments: ['Topical retinoids'],
        expectations: 'Wants to look refreshed but not overdone',
        budget_considerations: 'Moderate budget, looking for value'
      },
      {
        id: 'patient_2',
        name: 'Michael Chen',
        age: 45,
        gender: 'male' as const,
        medical_history: ['Hypertension', 'Mild anxiety'],
        medications: ['Lisinopril 10mg daily', 'Lorazepam PRN'],
        allergies: ['Penicillin'],
        chief_complaint: 'Crow\'s feet and forehead lines',
        treatment_goals: ['Professional appearance', 'Minimal downtime', 'Subtle results'],
        contraindications: ['History of keloid scarring'],
        risk_factors: ['Thick skin', 'High muscle activity'],
        previous_treatments: ['None'],
        expectations: 'Wants to maintain competitive edge in business',
        budget_considerations: 'Premium budget, values expertise'
      }
    ];
    
    return profiles[Math.floor(Math.random() * profiles.length)];
  };

  const makeDecision = async (optionId: string) => {
    if (!currentCase || !currentNode || !activeSession || !decisionStartTime) return;
    
    const option = currentNode.options.find(opt => opt.option_id === optionId);
    if (!option) return;
    
    const thinkingTime = Date.now() - decisionStartTime.getTime();
    setTotalThinkingTime(prev => prev + thinkingTime);
    
    // Record decision in path
    const decision: DecisionPath = {
      node_id: currentNode.node_id,
      decision_text: currentNode.scenario,
      selected_option: option.option_text,
      is_correct: option.is_optimal,
      reasoning_provided: reasoning,
      time_taken: thinkingTime / 1000,
      confidence_level: confidenceLevel,
      consequence: option.consequence,
      expert_notes: option.expert_notes
    };
    
    const newPath = [...decisionPath, decision];
    setDecisionPath(newPath);
    
    // Update session
    const updatedSession = {
      ...activeSession,
      total_decisions: activeSession.total_decisions + 1,
      correct_decisions: activeSession.correct_decisions + (option.is_optimal ? 1 : 0),
      decision_path: newPath,
      confidence_scores: [...activeSession.confidence_scores, confidenceLevel],
      decision_speed: [...activeSession.decision_speed, thinkingTime / 1000]
    };
    setActiveSession(updatedSession);
    
    // Find next node or end case
    if (option.leads_to_node) {
      const nextNode = currentCase.decision_tree.find(node => node.node_id === option.leads_to_node);
      if (nextNode) {
        setCurrentNode(nextNode);
        setDecisionStartTime(new Date());
        setSelectedDecision('');
        setReasoning('');
        setConfidenceLevel(80);
      }
    } else {
      // Case completed
      completeCaseStudy(updatedSession, option);
    }
  };

  const completeCaseStudy = async (session: CaseStudySession, finalOption: any) => {
    if (!sessionStartTime || !currentCase) return;
    
    const completionTime = Date.now() - sessionStartTime.getTime();
    
    // Calculate final outcome
    const finalOutcome = calculateOutcome(session, finalOption);
    
    // Generate learning points and feedback
    const learningPoints = generateLearningPoints(session, currentCase);
    const areasForImprovement = generateImprovementAreas(session);
    const expertFeedback = generateExpertFeedback(session, finalOutcome);
    
    const completedSession: CaseStudySession = {
      ...session,
      end_time: new Date().toISOString(),
      completion_time: completionTime / 1000,
      final_outcome: finalOutcome,
      learning_points: learningPoints,
      areas_for_improvement: areasForImprovement,
      expert_feedback: expertFeedback,
      clinical_reasoning_score: calculateClinicalReasoningScore(session)
    };
    
    setActiveSession(completedSession);
    setResultsDialogOpen(true);
    
    onCaseComplete?.(completedSession);
  };

  const calculateOutcome = (session: CaseStudySession, finalOption: any): CaseOutcome => {
    const correctRate = session.correct_decisions / session.total_decisions;
    const avgConfidence = session.confidence_scores.reduce((a, b) => a + b, 0) / session.confidence_scores.length;
    
    let outcomeType: CaseOutcome['outcome_type'];
    if (correctRate >= 0.9 && avgConfidence >= 80) outcomeType = 'optimal';
    else if (correctRate >= 0.7) outcomeType = 'acceptable';
    else if (correctRate >= 0.5) outcomeType = 'suboptimal';
    else outcomeType = 'adverse';
    
    return {
      outcome_type: outcomeType,
      patient_satisfaction: Math.round(correctRate * 100),
      treatment_efficacy: Math.round((correctRate * 0.7 + avgConfidence / 100 * 0.3) * 100),
      safety_score: Math.round(correctRate * 95 + 5),
      cost_effectiveness: Math.round(correctRate * 90 + 10),
      complications: correctRate < 0.7 ? ['Minor bruising', 'Asymmetry'] : [],
      follow_up_required: correctRate < 0.8 ? ['2-week assessment', 'Touch-up consultation'] : ['Standard follow-up'],
      outcome_description: getOutcomeDescription(outcomeType, correctRate)
    };
  };

  const getOutcomeDescription = (outcomeType: CaseOutcome['outcome_type'], correctRate: number): string => {
    const descriptions = {
      optimal: 'Excellent clinical decision-making resulted in optimal patient outcomes with high satisfaction and minimal complications.',
      acceptable: 'Good clinical judgment led to satisfactory results with minor areas for improvement.',
      suboptimal: 'Decision-making showed room for improvement. Patient outcomes were acceptable but not optimal.',
      adverse: 'Clinical decisions resulted in suboptimal outcomes. Significant learning opportunities identified.'
    };
    return descriptions[outcomeType];
  };

  const generateLearningPoints = (session: CaseStudySession, caseStudy: CaseStudy): string[] => {
    const points = [];
    
    if (session.correct_decisions / session.total_decisions >= 0.8) {
      points.push('Demonstrated strong clinical reasoning and decision-making skills');
    }
    
    if (session.confidence_scores.some(score => score >= 90)) {
      points.push('Showed appropriate confidence in clinical decisions');
    }
    
    if (session.decision_speed.some(speed => speed < 30)) {
      points.push('Efficient decision-making under pressure');
    }
    
    points.push('Understanding of patient-centered care principles');
    points.push('Knowledge of procedure-specific considerations');
    
    return points;
  };

  const generateImprovementAreas = (session: CaseStudySession): string[] => {
    const areas = [];
    
    if (session.correct_decisions / session.total_decisions < 0.7) {
      areas.push('Clinical decision-making accuracy');
    }
    
    if (session.confidence_scores.some(score => score < 60)) {
      areas.push('Clinical confidence and assertiveness');
    }
    
    if (session.decision_speed.some(speed => speed > 120)) {
      areas.push('Decision-making efficiency');
    }
    
    return areas;
  };

  const generateExpertFeedback = (session: CaseStudySession, outcome: CaseOutcome): string[] => {
    const feedback = [];
    
    if (outcome.outcome_type === 'optimal') {
      feedback.push('Excellent work! Your systematic approach to clinical decision-making is commendable.');
      feedback.push('You demonstrated thorough understanding of patient safety and treatment efficacy.');
    } else if (outcome.outcome_type === 'acceptable') {
      feedback.push('Good overall performance with room for refinement in specific areas.');
      feedback.push('Consider spending more time on differential diagnosis and risk assessment.');
    } else {
      feedback.push('This case highlights important learning opportunities.');
      feedback.push('Review contraindications and patient selection criteria for better outcomes.');
    }
    
    feedback.push('Continue practicing with similar cases to build expertise and confidence.');
    
    return feedback;
  };

  const calculateClinicalReasoningScore = (session: CaseStudySession): number => {
    const accuracyWeight = 0.4;
    const confidenceWeight = 0.3;
    const speedWeight = 0.3;
    
    const accuracy = (session.correct_decisions / session.total_decisions) * 100;
    const avgConfidence = session.confidence_scores.reduce((a, b) => a + b, 0) / session.confidence_scores.length;
    const avgSpeed = session.decision_speed.reduce((a, b) => a + b, 0) / session.decision_speed.length;
    const speedScore = Math.max(0, 100 - avgSpeed); // Lower time = higher score
    
    return Math.round(accuracy * accuracyWeight + avgConfidence * confidenceWeight + speedScore * speedWeight);
  };

  const resetCase = () => {
    setCurrentCase(null);
    setCurrentNode(null);
    setActiveSession(null);
    setDecisionPath([]);
    setPatientProfile(null);
    setSessionStartTime(null);
    setTimeElapsed(0);
    setSelectedDecision('');
    setReasoning('');
    setConfidenceLevel(80);
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: theme.palette.success.main,
      intermediate: theme.palette.info.main,
      advanced: theme.palette.warning.main,
      expert: theme.palette.error.main
    };
    return colors[difficulty] || theme.palette.grey[500];
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Case Study Viewer
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={difficulty} 
              size="small" 
              sx={{
                bgcolor: alpha(getDifficultyColor(difficulty), 0.1),
                color: getDifficultyColor(difficulty)
              }}
            />
            <Chip 
              label={anatomyRegion.name} 
              size="small" 
              variant="outlined" 
            />
            {activeSession && (
              <Chip 
                label={`${formatTime(timeElapsed)}`}
                size="small"
                color="primary"
                icon={<TimerIcon />}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showHints}
                onChange={(e) => setShowHints(e.target.checked)}
                disabled={!activeSession}
              />
            }
            label="Hints"
          />
          <FormControlLabel
            control={
              <Switch
                checked={showExpertMode}
                onChange={(e) => setShowExpertMode(e.target.checked)}
                disabled={!activeSession}
              />
            }
            label="Expert Mode"
          />
          {!activeSession ? (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={startCaseStudy}
              disabled={loading}
            >
              Start Case Study
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={resetCase}
            >
              Reset
            </Button>
          )}
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Case Content */}
      {!activeSession && !loading && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <CaseIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Interactive Case Study Training
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Practice clinical decision-making with realistic patient scenarios.
            Navigate through branching decision trees to achieve optimal outcomes.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
            <Chip label="Realistic patient scenarios" icon={<PatientIcon />} />
            <Chip label="Decision tree navigation" icon={<DecisionIcon />} />
            <Chip label="Expert feedback" icon={<ExpertIcon />} />
            <Chip label="Performance tracking" icon={<AnalyticsIcon />} />
          </Box>
        </Paper>
      )}

      {activeSession && currentCase && currentNode && patientProfile && (
        <Grid container spacing={3}>
          {/* Patient Information Panel */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Patient Profile */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PatientIcon />
                    Patient Profile
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{patientProfile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patientProfile.age} years old, {patientProfile.gender}
                    </Typography>
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandIcon />}>
                      <Typography variant="subtitle2">Chief Complaint</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">{patientProfile.chief_complaint}</Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandIcon />}>
                      <Typography variant="subtitle2">Medical History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {patientProfile.medical_history.map((item, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={item} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandIcon />}>
                      <Typography variant="subtitle2">Treatment Goals</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {patientProfile.treatment_goals.map((goal, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={goal} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {patientProfile.contraindications.length > 0 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <AlertTitle>Contraindications</AlertTitle>
                      {patientProfile.contraindications.join(', ')}
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Case Progress */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ProgressIcon />
                    Case Progress
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Decisions Made: {activeSession.total_decisions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy: {activeSession.total_decisions > 0 ? 
                        Math.round((activeSession.correct_decisions / activeSession.total_decisions) * 100) : 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Confidence: {activeSession.confidence_scores.length > 0 ?
                        Math.round(activeSession.confidence_scores.reduce((a, b) => a + b, 0) / activeSession.confidence_scores.length) : 0}%
                    </Typography>
                  </Box>

                  {decisionPath.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Decision History
                      </Typography>
                      <List dense>
                        {decisionPath.slice(-3).map((decision, idx) => (
                          <ListItem key={idx}>
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: decision.is_correct ? 'success.light' : 'error.light',
                                width: 24,
                                height: 24
                              }}>
                                {decision.is_correct ? <CorrectIcon sx={{ fontSize: 16 }} /> : <IncorrectIcon sx={{ fontSize: 16 }} />}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={decision.selected_option.substring(0, 40) + '...'}
                              secondary={`${decision.time_taken.toFixed(1)}s, ${decision.confidence_level}% confidence`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Decision Making Panel */}
          <Grid item xs={12} md={8}>
            <Card elevation={1} sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Clinical Decision Point
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`Step ${activeSession.total_decisions + 1}`}
                      size="small"
                      color="primary"
                    />
                    {showHints && (
                      <Tooltip title="Hints are available for this decision">
                        <HintIcon color="info" />
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Scenario */}
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>Clinical Scenario</AlertTitle>
                  <Typography variant="body2">
                    {currentNode.scenario}
                  </Typography>
                </Alert>

                {/* Hint Section */}
                {showHints && currentNode.hints && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <AlertTitle>Clinical Pearls</AlertTitle>
                    <List dense>
                      {currentNode.hints.map((hint, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={hint} />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>
                )}

                {/* Decision Options */}
                <Typography variant="subtitle1" gutterBottom>
                  What is your next course of action?
                </Typography>
                
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {currentNode.options.map((option) => (
                    <Card
                      key={option.option_id}
                      elevation={selectedDecision === option.option_id ? 2 : 1}
                      sx={{
                        cursor: 'pointer',
                        border: 2,
                        borderColor: selectedDecision === option.option_id ? 'primary.main' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => setSelectedDecision(option.option_id)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: selectedDecision === option.option_id ? 'primary.main' : 'grey.300',
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem'
                          }}>
                            {String.fromCharCode(65 + currentNode.options.indexOf(option))}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" gutterBottom>
                              {option.option_text}
                            </Typography>
                            {showExpertMode && (
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={option.is_optimal ? 'Optimal' : 'Suboptimal'}
                                  size="small"
                                  color={option.is_optimal ? 'success' : 'warning'}
                                />
                                <Chip 
                                  label={`Risk: ${option.risk_level}`}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                {/* Confidence and Reasoning */}
                {selectedDecision && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Confidence Level
                    </Typography>
                    <Slider
                      value={confidenceLevel}
                      onChange={(e, value) => setConfidenceLevel(value as number)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Clinical Reasoning (optional)
                    </Typography>
                    <textarea
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      placeholder="Explain your clinical reasoning for this decision..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
                        fontFamily: theme.typography.body2.fontFamily,
                        fontSize: theme.typography.body2.fontSize,
                        resize: 'vertical'
                      }}
                    />
                  </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {collaborative && (
                      <Button
                        variant="outlined"
                        startIcon={<CollaborateIcon />}
                        size="small"
                      >
                        Discuss
                      </Button>
                    )}
                  </Box>
                  
                  <Button
                    variant="contained"
                    onClick={() => makeDecision(selectedDecision)}
                    disabled={!selectedDecision}
                    size="large"
                  >
                    Make Decision
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Results Dialog */}
      <Dialog
        open={resultsDialogOpen}
        onClose={() => setResultsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Case Study Results
        </DialogTitle>
        <DialogContent>
          {activeSession && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Overall Performance */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <Typography variant="h6" gutterBottom>
                      Performance Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="primary">
                            {Math.round((activeSession.correct_decisions / activeSession.total_decisions) * 100)}%
                          </Typography>
                          <Typography variant="caption">Decision Accuracy</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="success.main">
                            {activeSession.clinical_reasoning_score}
                          </Typography>
                          <Typography variant="caption">Clinical Reasoning</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Completion Time: {Math.round(activeSession.completion_time / 60)}m {Math.round(activeSession.completion_time % 60)}s
                      </Typography>
                      <Typography variant="body2">
                        Case Complexity: {activeSession.case_complexity_score}/100
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* Clinical Outcome */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Patient Outcome
                    </Typography>
                    <Alert 
                      severity={
                        activeSession.final_outcome.outcome_type === 'optimal' ? 'success' :
                        activeSession.final_outcome.outcome_type === 'acceptable' ? 'info' :
                        activeSession.final_outcome.outcome_type === 'suboptimal' ? 'warning' : 'error'
                      }
                      sx={{ mb: 2 }}
                    >
                      <AlertTitle>{activeSession.final_outcome.outcome_type.toUpperCase()} OUTCOME</AlertTitle>
                      {activeSession.final_outcome.outcome_description}
                    </Alert>
                    
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Patient Satisfaction: {activeSession.final_outcome.patient_satisfaction}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Treatment Efficacy: {activeSession.final_outcome.treatment_efficacy}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Safety Score: {activeSession.final_outcome.safety_score}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          Cost Effectiveness: {activeSession.final_outcome.cost_effectiveness}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Learning Points */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LearningIcon color="success" />
                      Learning Points
                    </Typography>
                    <List dense>
                      {activeSession.learning_points.map((point, idx) => (
                        <ListItem key={idx}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), width: 24, height: 24 }}>
                              <CorrectIcon sx={{ fontSize: 16 }} color="success" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {/* Areas for Improvement */}
                {activeSession.areas_for_improvement.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Card elevation={1} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ImprovementIcon color="warning" />
                        Areas for Improvement
                      </Typography>
                      <List dense>
                        {activeSession.areas_for_improvement.map((area, idx) => (
                          <ListItem key={idx}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), width: 24, height: 24 }}>
                                <ImprovementIcon sx={{ fontSize: 16 }} color="warning" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={area} />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                )}

                {/* Expert Feedback */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FeedbackIcon color="primary" />
                      Expert Feedback
                    </Typography>
                    <Stack spacing={1}>
                      {activeSession.expert_feedback.map((feedback, idx) => (
                        <Alert key={idx} severity="info" sx={{ py: 0.5 }}>
                          <Typography variant="body2">{feedback}</Typography>
                        </Alert>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                {/* Decision Path Review */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Decision Path Review
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Step</TableCell>
                          <TableCell>Decision</TableCell>
                          <TableCell>Outcome</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeSession.decision_path.map((decision, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{decision.selected_option}</TableCell>
                            <TableCell>
                              {decision.is_correct ? (
                                <CorrectIcon color="success" />
                              ) : (
                                <IncorrectIcon color="error" />
                              )}
                            </TableCell>
                            <TableCell>{decision.time_taken.toFixed(1)}s</TableCell>
                            <TableCell>{decision.confidence_level}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
          <Button variant="contained" onClick={resetCase}>
            Try Another Case
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseStudyViewer;
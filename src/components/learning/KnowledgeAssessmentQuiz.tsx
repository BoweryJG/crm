// Knowledge Assessment Quiz - Adaptive assessment system with detailed feedback
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,
  Paper,
  LinearProgress,
  Stack,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Slider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Quiz as QuizIcon,
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Help as HelpIcon,
  Timer as TimerIcon,
  Speed as VelocityIcon,
  Assessment as ScoreIcon,
  EmojiEvents as CertificateIcon,
  Star as StarIcon,
  TrendingUp as ImprovementIcon,
  School as LearningIcon,
  Psychology as AIIcon,
  Lightbulb as HintIcon,
  Refresh as RetryIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandIcon,
  PlayArrow as StartIcon,
  Stop as EndIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  Flag as FlagIcon,
  BookmarkBorder as BookmarkIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as MagicIcon,
  Insights as InsightsIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  learningCenterService,
  QuizQuestion,
  LearningModule
} from '../../services/learningCenterService';

interface KnowledgeAssessmentQuizProps {
  moduleId?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  procedureType?: string;
  onQuizComplete?: (result: QuizSession) => void;
  adaptiveMode?: boolean;
  certificationMode?: boolean;
}

interface QuizSession {
  session_id: string;
  module_id?: string;
  category: string;
  difficulty_level: string;
  start_time: string;
  end_time?: string;
  total_questions: number;
  questions_answered: number;
  correct_answers: number;
  quiz_score: number;
  time_spent: number;
  question_responses: QuestionResponse[];
  performance_breakdown: {
    knowledge_areas: { [area: string]: number };
    question_types: { [type: string]: number };
    difficulty_performance: { [level: string]: number };
    speed_analysis: {
      avg_time_per_question: number;
      fastest_correct: number;
      slowest_correct: number;
    };
  };
  adaptive_insights: {
    recommended_difficulty: string;
    knowledge_gaps: string[];
    strength_areas: string[];
    next_steps: string[];
  };
  certification_eligible: boolean;
  certificate_earned?: string;
  improvement_suggestions: string[];
  expert_feedback: string[];
}

interface QuestionResponse {
  question_id: string;
  question_text: string;
  question_type: QuizQuestion['question_type'];
  selected_answer: string | string[];
  correct_answer: string | string[];
  is_correct: boolean;
  time_taken: number;
  confidence_level?: number;
  explanation_viewed: boolean;
  hint_used: boolean;
  flagged_for_review: boolean;
  difficulty_level: string;
  knowledge_area: string;
}

interface QuizState {
  isActive: boolean;
  currentQuestionIndex: number;
  timeRemaining?: number;
  isTimedQuiz: boolean;
  allowReview: boolean;
  showExplanations: boolean;
  adaptiveDifficulty: boolean;
  currentDifficultyLevel: string;
}

const KnowledgeAssessmentQuiz: React.FC<KnowledgeAssessmentQuizProps> = ({
  moduleId,
  category = 'general',
  difficulty = 'intermediate',
  procedureType,
  onQuizComplete,
  adaptiveMode = true,
  certificationMode = false
}) => {
  const theme = useTheme();

  // State
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    isActive: false,
    currentQuestionIndex: 0,
    timeRemaining: undefined,
    isTimedQuiz: certificationMode,
    allowReview: !certificationMode,
    showExplanations: !certificationMode,
    adaptiveDifficulty: adaptiveMode,
    currentDifficultyLevel: difficulty
  });

  // Current question state
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [confidenceLevel, setConfidenceLevel] = useState(75);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [flaggedForReview, setFlaggedForReview] = useState(false);
  const [explanationShown, setExplanationShown] = useState(false);

  // UI State
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  useEffect(() => {
    if (quizState.isActive && quizState.isTimedQuiz && quizState.timeRemaining !== undefined) {
      const timer = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining && prev.timeRemaining > 0) {
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          } else {
            // Time's up - auto-submit quiz
            handleSubmitQuiz();
            return prev;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.isActive, quizState.isTimedQuiz, quizState.timeRemaining]);

  const startQuiz = async () => {
    try {
      setLoading(true);

      // Generate or load quiz questions
      const questions = await generateQuizQuestions();
      setQuizQuestions(questions);

      if (questions.length === 0) {
        throw new Error('No questions available for this quiz');
      }

      // Initialize quiz session
      const session: QuizSession = {
        session_id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        module_id: moduleId,
        category,
        difficulty_level: difficulty,
        start_time: new Date().toISOString(),
        total_questions: questions.length,
        questions_answered: 0,
        correct_answers: 0,
        quiz_score: 0,
        time_spent: 0,
        question_responses: [],
        performance_breakdown: {
          knowledge_areas: {},
          question_types: {},
          difficulty_performance: {},
          speed_analysis: {
            avg_time_per_question: 0,
            fastest_correct: Infinity,
            slowest_correct: 0
          }
        },
        adaptive_insights: {
          recommended_difficulty: difficulty,
          knowledge_gaps: [],
          strength_areas: [],
          next_steps: []
        },
        certification_eligible: false,
        improvement_suggestions: [],
        expert_feedback: []
      };

      setQuizSession(session);
      setCurrentQuestion(questions[0]);
      setQuestionStartTime(new Date());

      // Set up quiz state
      setQuizState(prev => ({
        ...prev,
        isActive: true,
        currentQuestionIndex: 0,
        timeRemaining: certificationMode ? questions.length * 90 : undefined, // 90 seconds per question for certification
        currentDifficultyLevel: difficulty
      }));

      // Reset question state
      resetQuestionState();

    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
    // In production, this would call the learning service
    // For now, generate sample questions based on category and difficulty
    const sampleQuestions: QuizQuestion[] = [
      {
        id: 'q1',
        question_text: 'What is the optimal injection depth for nasolabial fold treatment with hyaluronic acid fillers?',
        question_type: 'multiple_choice',
        options: [
          'Superficial dermal (1-2mm)',
          'Mid-dermal (2-4mm)',
          'Deep dermal (4-6mm)',
          'Subcutaneous (6-8mm)'
        ],
        correct_answer: 'Mid-dermal (2-4mm)',
        explanation: 'Mid-dermal injection (2-4mm) provides optimal volumization and natural appearance for nasolabial folds while minimizing risks of Tyndall effect or vascular compromise.',
        difficulty_level: difficulty,
        knowledge_area: 'Injection Technique',
        hint: 'Consider the anatomy of the nasolabial fold and the goal of natural volumization.',
        points: 10,
        time_limit: 60,
        references: ['Aesthetic Medicine Guidelines 2023', 'Facial Anatomy Atlas']
      },
      {
        id: 'q2',
        question_text: 'Which of the following are contraindications for botulinum toxin treatment? (Select all that apply)',
        question_type: 'multiple_select',
        options: [
          'Pregnancy',
          'Active skin infection at injection site',
          'Myasthenia gravis',
          'Previous allergic reaction to botulinum toxin',
          'Age over 65'
        ],
        correct_answer: ['Pregnancy', 'Active skin infection at injection site', 'Myasthenia gravis', 'Previous allergic reaction to botulinum toxin'],
        explanation: 'Age over 65 is not a contraindication, but requires careful assessment. The other options represent absolute or relative contraindications.',
        difficulty_level: difficulty,
        knowledge_area: 'Patient Safety',
        hint: 'Consider both absolute and relative contraindications for neurotoxin therapy.',
        points: 15,
        time_limit: 90,
        references: ['FDA Botulinum Toxin Guidelines', 'Patient Safety Protocols']
      },
      {
        id: 'q3',
        question_text: 'Rate the importance of obtaining informed consent before aesthetic procedures (1-10 scale):',
        question_type: 'scale',
        scale_min: 1,
        scale_max: 10,
        correct_answer: '10',
        explanation: 'Informed consent is absolutely critical (10/10) for all aesthetic procedures, both legally and ethically.',
        difficulty_level: 'beginner',
        knowledge_area: 'Ethics and Legal',
        hint: 'Consider the legal and ethical imperatives in aesthetic medicine.',
        points: 5,
        time_limit: 30,
        references: ['Medical Ethics Guidelines', 'Aesthetic Practice Standards']
      },
      {
        id: 'q4',
        question_text: 'A 45-year-old patient presents with asymmetric lip augmentation performed 2 weeks ago. What is your immediate management approach?',
        question_type: 'scenario',
        scenario_description: 'Patient reports moderate swelling on the right side, no pain, normal color, and desires correction.',
        options: [
          'Immediate hyaluronidase injection',
          'Wait 4-6 weeks for complete healing',
          'Massage and ice therapy',
          'Additional filler to balance the left side'
        ],
        correct_answer: 'Wait 4-6 weeks for complete healing',
        explanation: 'At 2 weeks post-injection, swelling is normal and asymmetry often resolves. Evaluation should occur after complete healing (4-6 weeks) before any corrective measures.',
        difficulty_level: 'advanced',
        knowledge_area: 'Complication Management',
        hint: 'Consider the normal healing timeline and when final results are typically visible.',
        points: 20,
        time_limit: 120,
        references: ['Complication Management Protocols', 'Post-Treatment Care Guidelines']
      }
    ];

    // Filter questions based on criteria
    let filteredQuestions = sampleQuestions;
    
    if (procedureType) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.knowledge_area.toLowerCase().includes(procedureType.toLowerCase())
      );
    }

    // Adjust question count based on mode
    const questionCount = certificationMode ? 20 : 10;
    return filteredQuestions.slice(0, questionCount);
  };

  const resetQuestionState = () => {
    setSelectedAnswer('');
    setConfidenceLevel(75);
    setHintUsed(false);
    setFlaggedForReview(false);
    setExplanationShown(false);
  };

  const handleAnswerChange = (answer: string | string[]) => {
    setSelectedAnswer(answer);
  };

  const handleUseHint = () => {
    setHintUsed(true);
  };

  const handleFlagQuestion = () => {
    setFlaggedForReview(!flaggedForReview);
  };

  const handleShowExplanation = () => {
    setExplanationShown(true);
  };

  const handleNextQuestion = async () => {
    if (!currentQuestion || !questionStartTime || !quizSession) return;

    const timeSpent = (Date.now() - questionStartTime.getTime()) / 1000;
    const isCorrect = checkAnswer(currentQuestion, selectedAnswer);

    // Record response
    const response: QuestionResponse = {
      question_id: currentQuestion.id,
      question_text: currentQuestion.question_text,
      question_type: currentQuestion.question_type,
      selected_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      time_taken: timeSpent,
      confidence_level: confidenceLevel,
      explanation_viewed: explanationShown,
      hint_used: hintUsed,
      flagged_for_review: flaggedForReview,
      difficulty_level: currentQuestion.difficulty_level,
      knowledge_area: currentQuestion.knowledge_area
    };

    // Update session
    const updatedSession = {
      ...quizSession,
      questions_answered: quizSession.questions_answered + 1,
      correct_answers: quizSession.correct_answers + (isCorrect ? 1 : 0),
      question_responses: [...quizSession.question_responses, response],
      time_spent: quizSession.time_spent + timeSpent
    };

    setQuizSession(updatedSession);

    // Check if quiz is complete
    if (quizState.currentQuestionIndex + 1 >= quizQuestions.length) {
      completeQuiz(updatedSession);
      return;
    }

    // Move to next question
    const nextIndex = quizState.currentQuestionIndex + 1;
    const nextQuestion = quizQuestions[nextIndex];

    // Adaptive difficulty adjustment
    if (adaptiveMode) {
      const adjustedQuestion = await adjustQuestionDifficulty(nextQuestion, response);
      setCurrentQuestion(adjustedQuestion);
    } else {
      setCurrentQuestion(nextQuestion);
    }

    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex
    }));

    setQuestionStartTime(new Date());
    resetQuestionState();
  };

  const adjustQuestionDifficulty = async (question: QuizQuestion, lastResponse: QuestionResponse): Promise<QuizQuestion> => {
    // Simple adaptive logic - in production this would be more sophisticated
    if (lastResponse.is_correct && lastResponse.time_taken < 30) {
      // User is performing well, potentially increase difficulty
      return { ...question, difficulty_level: 'advanced' };
    } else if (!lastResponse.is_correct || lastResponse.time_taken > 90) {
      // User struggling, potentially decrease difficulty
      return { ...question, difficulty_level: 'beginner' };
    }
    return question;
  };

  const checkAnswer = (question: QuizQuestion, answer: string | string[]): boolean => {
    if (question.question_type === 'multiple_select') {
      const correctAnswers = Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer];
      const selectedAnswers = Array.isArray(answer) ? answer : [answer];
      return correctAnswers.length === selectedAnswers.length && 
             correctAnswers.every(ca => selectedAnswers.includes(ca));
    } else if (question.question_type === 'scale') {
      const correct = parseInt(question.correct_answer as string);
      const selected = parseInt(answer as string);
      return Math.abs(correct - selected) <= 1; // Allow 1 point tolerance
    } else {
      return question.correct_answer === answer;
    }
  };

  const completeQuiz = async (session: QuizSession) => {
    try {
      // Calculate final scores and analytics
      const finalSession = await calculateQuizResults(session);
      
      setQuizSession(finalSession);
      setQuizState(prev => ({ ...prev, isActive: false }));
      setResultsDialogOpen(true);
      
      // Submit to learning service
      if (moduleId) {
        await learningCenterService.submitQuizScore(
          'demo-user', // In production, get from auth
          moduleId,
          'quiz_section',
          finalSession.quiz_score
        );
      }
      
      onQuizComplete?.(finalSession);
      
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const calculateQuizResults = async (session: QuizSession): Promise<QuizSession> => {
    const responses = session.question_responses;
    const totalQuestions = session.total_questions;
    const correctAnswers = session.correct_answers;
    const quizScore = Math.round((correctAnswers / totalQuestions) * 100);

    // Performance breakdown
    const knowledgeAreas: { [area: string]: number } = {};
    const questionTypes: { [type: string]: number } = {};
    const difficultyPerformance: { [level: string]: number } = {};

    responses.forEach(response => {
      // Knowledge areas
      if (!knowledgeAreas[response.knowledge_area]) {
        knowledgeAreas[response.knowledge_area] = 0;
      }
      knowledgeAreas[response.knowledge_area] += response.is_correct ? 1 : 0;

      // Question types
      if (!questionTypes[response.question_type]) {
        questionTypes[response.question_type] = 0;
      }
      questionTypes[response.question_type] += response.is_correct ? 1 : 0;

      // Difficulty performance
      if (!difficultyPerformance[response.difficulty_level]) {
        difficultyPerformance[response.difficulty_level] = 0;
      }
      difficultyPerformance[response.difficulty_level] += response.is_correct ? 1 : 0;
    });

    // Speed analysis
    const correctResponseTimes = responses.filter(r => r.is_correct).map(r => r.time_taken);
    const avgTimePerQuestion = responses.reduce((sum, r) => sum + r.time_taken, 0) / responses.length;
    const fastestCorrect = correctResponseTimes.length > 0 ? Math.min(...correctResponseTimes) : 0;
    const slowestCorrect = correctResponseTimes.length > 0 ? Math.max(...correctResponseTimes) : 0;

    // Adaptive insights
    const knowledgeGaps = Object.entries(knowledgeAreas)
      .filter(([, score]) => score < totalQuestions * 0.7)
      .map(([area]) => area);

    const strengthAreas = Object.entries(knowledgeAreas)
      .filter(([, score]) => score >= totalQuestions * 0.8)
      .map(([area]) => area);

    const recommendedDifficulty = quizScore >= 90 ? 'advanced' : 
                                 quizScore >= 70 ? 'intermediate' : 'beginner';

    const nextSteps = generateNextSteps(quizScore, knowledgeGaps, strengthAreas);
    const improvementSuggestions = generateImprovementSuggestions(session);
    const expertFeedback = generateExpertFeedback(session);

    return {
      ...session,
      end_time: new Date().toISOString(),
      quiz_score: quizScore,
      performance_breakdown: {
        knowledge_areas: knowledgeAreas,
        question_types: questionTypes,
        difficulty_performance: difficultyPerformance,
        speed_analysis: {
          avg_time_per_question: avgTimePerQuestion,
          fastest_correct: fastestCorrect,
          slowest_correct: slowestCorrect
        }
      },
      adaptive_insights: {
        recommended_difficulty: recommendedDifficulty,
        knowledge_gaps: knowledgeGaps,
        strength_areas: strengthAreas,
        next_steps: nextSteps
      },
      certification_eligible: certificationMode && quizScore >= 80,
      certificate_earned: certificationMode && quizScore >= 80 ? `Certificate_${session.category}_${Date.now()}` : undefined,
      improvement_suggestions: improvementSuggestions,
      expert_feedback: expertFeedback
    };
  };

  const generateNextSteps = (score: number, gaps: string[], strengths: string[]): string[] => {
    const steps = [];
    
    if (score >= 90) {
      steps.push('Consider advancing to expert-level content');
      steps.push('Explore specialized procedure modules');
    } else if (score >= 70) {
      steps.push('Review knowledge gaps in specific areas');
      steps.push('Practice with case studies');
    } else {
      steps.push('Revisit fundamental concepts');
      steps.push('Complete prerequisite modules');
    }

    if (gaps.length > 0) {
      steps.push(`Focus on improving: ${gaps.join(', ')}`);
    }

    return steps;
  };

  const generateImprovementSuggestions = (session: QuizSession): string[] => {
    const suggestions = [];
    const responses = session.question_responses;
    
    const slowResponses = responses.filter(r => r.time_taken > 90);
    if (slowResponses.length > responses.length * 0.3) {
      suggestions.push('Work on decision-making speed through practice scenarios');
    }

    const hintUsage = responses.filter(r => r.hint_used).length;
    if (hintUsage > responses.length * 0.5) {
      suggestions.push('Review core concepts to reduce dependency on hints');
    }

    const lowConfidence = responses.filter(r => (r.confidence_level || 0) < 60).length;
    if (lowConfidence > responses.length * 0.3) {
      suggestions.push('Build confidence through additional practice and study');
    }

    return suggestions;
  };

  const generateExpertFeedback = (session: QuizSession): string[] => {
    const feedback = [];
    const score = session.quiz_score;
    
    if (score >= 90) {
      feedback.push('Excellent performance! You demonstrate mastery of the subject matter.');
      feedback.push('Your consistent accuracy shows strong foundational knowledge.');
    } else if (score >= 80) {
      feedback.push('Strong performance with room for minor improvements.');
      feedback.push('Focus on areas where you lost points to achieve mastery.');
    } else if (score >= 70) {
      feedback.push('Good understanding with several areas needing attention.');
      feedback.push('Review the explanations for missed questions carefully.');
    } else {
      feedback.push('Consider additional study before retaking the assessment.');
      feedback.push('Focus on fundamental concepts before advancing.');
    }

    if (session.adaptive_insights.knowledge_gaps.length > 0) {
      feedback.push(`Priority review areas: ${session.adaptive_insights.knowledge_gaps.join(', ')}`);
    }

    return feedback;
  };

  const handleSubmitQuiz = () => {
    if (!quizSession) return;
    completeQuiz(quizSession);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 80) return theme.palette.info.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
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
            Knowledge Assessment Quiz
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={quizState.currentDifficultyLevel} 
              size="small" 
              sx={{
                bgcolor: alpha(getDifficultyColor(quizState.currentDifficultyLevel), 0.1),
                color: getDifficultyColor(quizState.currentDifficultyLevel)
              }}
            />
            <Chip 
              label={category} 
              size="small" 
              variant="outlined" 
            />
            {adaptiveMode && (
              <Chip 
                label="Adaptive" 
                size="small" 
                color="primary"
                icon={<AIIcon />}
              />
            )}
            {certificationMode && (
              <Chip 
                label="Certification" 
                size="small" 
                color="warning"
                icon={<CertificateIcon />}
              />
            )}
            {quizState.isTimedQuiz && quizState.timeRemaining !== undefined && (
              <Chip 
                label={formatTime(quizState.timeRemaining)}
                size="small"
                color="error"
                icon={<TimerIcon />}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {!quizState.isActive ? (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={startQuiz}
              disabled={loading}
            >
              Start Quiz
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<EndIcon />}
                onClick={handleSubmitQuiz}
              >
                Submit Quiz
              </Button>
            </>
          )}
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Quiz Content */}
      {!quizState.isActive && !loading && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Knowledge Assessment System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Test your knowledge with adaptive assessments that adjust to your performance.
            {certificationMode && ' Earn certificates upon successful completion.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
            <Chip label="Adaptive difficulty" icon={<AIIcon />} />
            <Chip label="Detailed feedback" icon={<InsightsIcon />} />
            <Chip label="Performance analytics" icon={<AnalyticsIcon />} />
            {certificationMode && <Chip label="Certification eligible" icon={<CertificateIcon />} />}
          </Box>
        </Paper>
      )}

      {quizState.isActive && currentQuestion && (
        <Grid container spacing={3}>
          {/* Progress Panel */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Quiz Progress */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScoreIcon />
                    Quiz Progress
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Question {quizState.currentQuestionIndex + 1} of {quizQuestions.length}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((quizState.currentQuestionIndex + 1) / quizQuestions.length) * 100}
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </Box>

                  {quizSession && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Correct: {quizSession.correct_answers} / {quizSession.questions_answered}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Accuracy: {quizSession.questions_answered > 0 ? 
                          Math.round((quizSession.correct_answers / quizSession.questions_answered) * 100) : 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time: {formatTime(quizSession.time_spent)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Question Info */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Question Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={currentQuestion.question_type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={currentQuestion.difficulty_level}
                      size="small"
                      sx={{
                        bgcolor: alpha(getDifficultyColor(currentQuestion.difficulty_level), 0.1),
                        color: getDifficultyColor(currentQuestion.difficulty_level)
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Knowledge Area: {currentQuestion.knowledge_area}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Points: {currentQuestion.points}
                  </Typography>
                  {currentQuestion.time_limit && (
                    <Typography variant="body2" color="text.secondary">
                      Time Limit: {currentQuestion.time_limit}s
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Question Actions */}
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Actions
                  </Typography>
                  
                  <Stack spacing={1}>
                    {!hintUsed && currentQuestion.hint && (
                      <Button
                        size="small"
                        startIcon={<HintIcon />}
                        onClick={handleUseHint}
                        variant="outlined"
                      >
                        Show Hint
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      startIcon={<FlagIcon />}
                      onClick={handleFlagQuestion}
                      variant={flaggedForReview ? "contained" : "outlined"}
                      color={flaggedForReview ? "warning" : "inherit"}
                    >
                      {flaggedForReview ? 'Flagged' : 'Flag for Review'}
                    </Button>

                    {!certificationMode && !explanationShown && (
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={handleShowExplanation}
                        variant="outlined"
                      >
                        Show Explanation
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Question Panel */}
          <Grid item xs={12} md={8}>
            <Card elevation={1} sx={{ height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Question {quizState.currentQuestionIndex + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={currentQuestion.question_type.replace('_', ' ')}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Box>

                {/* Question Text */}
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {currentQuestion.question_text}
                </Typography>

                {/* Scenario Description (if applicable) */}
                {currentQuestion.scenario_description && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <AlertTitle>Clinical Scenario</AlertTitle>
                    <Typography variant="body2">
                      {currentQuestion.scenario_description}
                    </Typography>
                  </Alert>
                )}

                {/* Hint Display */}
                {hintUsed && currentQuestion.hint && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <AlertTitle>Hint</AlertTitle>
                    <Typography variant="body2">
                      {currentQuestion.hint}
                    </Typography>
                  </Alert>
                )}

                {/* Answer Options */}
                <Box sx={{ mb: 3 }}>
                  {currentQuestion.question_type === 'multiple_choice' && (
                    <RadioGroup
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    >
                      {currentQuestion.options?.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                          sx={{ 
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.question_type === 'multiple_select' && (
                    <FormGroup>
                      {currentQuestion.options?.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                              onChange={(e) => {
                                const currentSelected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
                                if (e.target.checked) {
                                  handleAnswerChange([...currentSelected, option]);
                                } else {
                                  handleAnswerChange(currentSelected.filter(a => a !== option));
                                }
                              }}
                            />
                          }
                          label={option}
                          sx={{ 
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        />
                      ))}
                    </FormGroup>
                  )}

                  {currentQuestion.question_type === 'scale' && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Rate from {currentQuestion.scale_min} to {currentQuestion.scale_max}:
                      </Typography>
                      <Slider
                        value={parseInt(selectedAnswer as string) || currentQuestion.scale_min || 1}
                        onChange={(e, value) => handleAnswerChange(value.toString())}
                        min={currentQuestion.scale_min || 1}
                        max={currentQuestion.scale_max || 10}
                        valueLabelDisplay="auto"
                        marks
                        sx={{ mt: 2, mb: 3 }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Confidence Level */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Confidence Level: {confidenceLevel}%
                  </Typography>
                  <Slider
                    value={confidenceLevel}
                    onChange={(e, value) => setConfidenceLevel(value as number)}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                </Box>

                {/* Explanation (if shown) */}
                {explanationShown && currentQuestion.explanation && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <AlertTitle>Explanation</AlertTitle>
                    <Typography variant="body2">
                      {currentQuestion.explanation}
                    </Typography>
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    {quizState.currentQuestionIndex > 0 && (
                      <Button
                        variant="outlined"
                        startIcon={<PrevIcon />}
                        disabled={certificationMode}
                        size="small"
                      >
                        Previous
                      </Button>
                    )}
                  </Box>
                  
                  <Button
                    variant="contained"
                    endIcon={<NextIcon />}
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    size="large"
                  >
                    {quizState.currentQuestionIndex + 1 >= quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
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
          Quiz Results
        </DialogTitle>
        <DialogContent>
          {quizSession && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Overall Score */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2, bgcolor: alpha(getScoreColor(quizSession.quiz_score), 0.05) }}>
                    <Typography variant="h6" gutterBottom>
                      Overall Performance
                    </Typography>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h2" fontWeight="bold" color={getScoreColor(quizSession.quiz_score)}>
                        {quizSession.quiz_score}%
                      </Typography>
                      <Typography variant="subtitle1">
                        Final Score
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="success.main">
                            {quizSession.correct_answers}
                          </Typography>
                          <Typography variant="caption">Correct</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="error.main">
                            {quizSession.total_questions - quizSession.correct_answers}
                          </Typography>
                          <Typography variant="caption">Incorrect</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Time Spent: {formatTime(quizSession.time_spent)}
                      </Typography>
                      <Typography variant="body2">
                        Avg per Question: {formatTime(quizSession.performance_breakdown.speed_analysis.avg_time_per_question)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>

                {/* Certification Status */}
                {certificationMode && (
                  <Grid item xs={12} md={6}>
                    <Card elevation={1} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Certification Status
                      </Typography>
                      <Alert 
                        severity={quizSession.certification_eligible ? 'success' : 'warning'}
                        sx={{ mb: 2 }}
                      >
                        <AlertTitle>
                          {quizSession.certification_eligible ? 'Congratulations!' : 'Not Eligible'}
                        </AlertTitle>
                        {quizSession.certification_eligible ? 
                          'You have earned your certification!' : 
                          'Score 80% or higher to earn certification.'}
                      </Alert>
                      
                      {quizSession.certificate_earned && (
                        <Box sx={{ textAlign: 'center' }}>
                          <CertificateIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                          <Typography variant="subtitle2">
                            Certificate ID: {quizSession.certificate_earned}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                )}

                {/* Knowledge Areas Performance */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Knowledge Areas
                    </Typography>
                    <List dense>
                      {Object.entries(quizSession.performance_breakdown.knowledge_areas).map(([area, score]) => (
                        <ListItem key={area}>
                          <ListItemText primary={area} />
                          <Box sx={{ width: 100, ml: 2 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(score / quizSession.total_questions) * 100}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption">
                              {Math.round((score / quizSession.total_questions) * 100)}%
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {/* Adaptive Insights */}
                <Grid item xs={12} md={6}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AIIcon color="primary" />
                      AI Insights
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Level: {quizSession.adaptive_insights.recommended_difficulty}
                    </Typography>
                    
                    {quizSession.adaptive_insights.strength_areas.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="success.main" gutterBottom>
                          Strengths:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {quizSession.adaptive_insights.strength_areas.map((area, idx) => (
                            <Chip key={idx} label={area} size="small" color="success" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                    
                    {quizSession.adaptive_insights.knowledge_gaps.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" color="warning.main" gutterBottom>
                          Areas to Improve:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {quizSession.adaptive_insights.knowledge_gaps.map((gap, idx) => (
                            <Chip key={idx} label={gap} size="small" color="warning" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Card>
                </Grid>

                {/* Expert Feedback */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LearningIcon color="primary" />
                      Expert Feedback
                    </Typography>
                    <Stack spacing={1}>
                      {quizSession.expert_feedback.map((feedback, idx) => (
                        <Alert key={idx} severity="info" sx={{ py: 0.5 }}>
                          <Typography variant="body2">{feedback}</Typography>
                        </Alert>
                      ))}
                    </Stack>
                  </Card>
                </Grid>

                {/* Next Steps */}
                <Grid item xs={12}>
                  <Card elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ImprovementIcon color="primary" />
                      Recommended Next Steps
                    </Typography>
                    <List dense>
                      {quizSession.adaptive_insights.next_steps.map((step, idx) => (
                        <ListItem key={idx}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), width: 24, height: 24 }}>
                              <Typography variant="caption">{idx + 1}</Typography>
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={step} />
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
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download Report
          </Button>
          <Button variant="contained" startIcon={<RetryIcon />} onClick={() => {
            setResultsDialogOpen(false);
            startQuiz();
          }}>
            Retake Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgeAssessmentQuiz;
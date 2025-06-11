// Learning Center Service - Enhanced interactive learning platform for aesthetic and dental professionals
import { supabase } from '../config/supabase';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'procedure' | 'technology' | 'sales' | 'business' | 'compliance';
  procedure_type?: 'botox' | 'fillers' | 'coolsculpting' | 'prp' | 'microneedling' | 'laser' | 'dental_implants' | 'whitening' | 'orthodontics';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration: number; // minutes
  content_type: 'video' | 'interactive' | 'simulation' | 'quiz' | 'document' | 'mixed';
  content: {
    sections: LearningSection[];
    resources: Resource[];
    assessment?: Assessment;
  };
  prerequisites: string[]; // Module IDs
  learning_objectives: string[];
  certification_eligible: boolean;
  ce_credits?: number; // Continuing education credits
  tags: string[];
  instructor: {
    name: string;
    credentials: string;
    bio: string;
    photo?: string;
  };
  created_at: string;
  updated_at: string;
  published: boolean;
  enrollment_count: number;
  average_rating: number;
  completion_rate: number;
}

export interface LearningSection {
  id: string;
  title: string;
  order: number;
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'simulation' | 'case_study';
  duration: number; // minutes
  content: {
    text?: string;
    video_url?: string;
    interactive_elements?: InteractiveElement[];
    quiz_questions?: QuizQuestion[];
    simulation_config?: SimulationConfig;
    case_study?: CaseStudy;
  };
  completion_criteria: {
    type: 'time_based' | 'interaction_based' | 'quiz_based' | 'manual';
    threshold?: number; // percentage or score
  };
  resources: Resource[];
}

export interface InteractiveElement {
  id: string;
  type: '3d_model' | 'before_after' | 'anatomy_diagram' | 'injection_simulator' | 'dosage_calculator' | 'timeline';
  config: {
    model_url?: string;
    before_image?: string;
    after_image?: string;
    diagram_layers?: string[];
    simulation_params?: any;
    calculator_formula?: string;
    timeline_events?: TimelineEvent[];
  };
  interactions: {
    click_areas?: ClickArea[];
    drag_drop?: DragDropConfig[];
    input_fields?: InputField[];
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop' | 'image_hotspot' | 'scenario';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation: string;
  image_url?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface SimulationConfig {
  type: 'injection_technique' | 'patient_consultation' | 'procedure_planning' | 'complication_management';
  scenario: {
    patient_profile: PatientProfile;
    presenting_concern: string;
    contraindications?: string[];
    expected_outcomes: string[];
  };
  tools: {
    available_products: Product[];
    injection_points?: InjectionPoint[];
    measurement_tools?: string[];
  };
  scoring_criteria: {
    technique: number;
    safety: number;
    patient_communication: number;
    outcome_prediction: number;
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  patient_profile: PatientProfile;
  presenting_concern: string;
  medical_history: string[];
  consultation_notes: string;
  treatment_plan: TreatmentPlan;
  before_photos: string[];
  after_photos: string[];
  outcomes: {
    immediate: string[];
    follow_up_1week: string[];
    follow_up_1month: string[];
    follow_up_3month: string[];
  };
  complications?: string[];
  lessons_learned: string[];
  discussion_points: string[];
}

export interface PatientProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  skin_type: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  previous_treatments: string[];
  aesthetic_goals: string[];
}

export interface TreatmentPlan {
  primary_treatment: string;
  products_used: Product[];
  injection_technique: string;
  dosage: {
    total_units?: number;
    injection_points: InjectionPoint[];
  };
  aftercare_instructions: string[];
  follow_up_schedule: string[];
}

export interface Product {
  id: string;
  name: string;
  type: 'neurotoxin' | 'dermal_filler' | 'biostimulator' | 'device' | 'topical';
  manufacturer: string;
  concentration?: string;
  indications: string[];
  contraindications: string[];
  technique_notes: string[];
  storage_requirements: string;
}

export interface InjectionPoint {
  id: string;
  anatomical_location: string;
  coordinates: { x: number; y: number; z?: number };
  depth: 'intradermal' | 'subcutaneous' | 'supraperiosteal' | 'intramuscular';
  angle: number;
  dosage: number;
  notes: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
}

export interface ClickArea {
  id: string;
  coordinates: { x: number; y: number; width: number; height: number };
  action: 'reveal_info' | 'play_animation' | 'navigate' | 'toggle_layer';
  content: string;
  feedback?: string;
}

export interface DragDropConfig {
  id: string;
  draggable_items: { id: string; label: string; image?: string }[];
  drop_zones: { id: string; label: string; accepts: string[] }[];
  correct_matches: { item_id: string; zone_id: string }[];
  feedback: { correct: string; incorrect: string };
}

export interface InputField {
  id: string;
  type: 'text' | 'number' | 'select' | 'range';
  label: string;
  validation: {
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  feedback_formula?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'link' | 'reference' | 'protocol';
  url: string;
  description: string;
  downloadable: boolean;
  file_size?: number;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'practical' | 'case_analysis' | 'simulation';
  questions: QuizQuestion[];
  passing_score: number;
  time_limit?: number; // minutes
  attempts_allowed: number;
  randomize_questions: boolean;
  show_feedback: 'immediate' | 'after_completion' | 'after_submission';
  certification_required: boolean;
}

export interface UserProgress {
  user_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  progress_percentage: number;
  time_spent: number; // minutes
  sections_completed: string[];
  quiz_scores: {
    section_id: string;
    score: number;
    attempts: number;
    best_score: number;
  }[];
  assessment_scores: {
    assessment_id: string;
    score: number;
    passed: boolean;
    attempt_number: number;
    completed_at: string;
  }[];
  notes: string;
  bookmarks: string[]; // Section IDs
  started_at: string;
  completed_at?: string;
  certificate_issued?: string;
  last_accessed: string;
}

export interface Certification {
  id: string;
  user_id: string;
  module_id: string;
  certificate_type: 'completion' | 'proficiency' | 'mastery' | 'ce_credit';
  title: string;
  issued_date: string;
  expiry_date?: string;
  ce_credits?: number;
  verification_code: string;
  digital_badge_url: string;
  pdf_certificate_url: string;
  issuing_authority: {
    name: string;
    credentials: string;
    signature_url: string;
  };
  requirements_met: {
    modules_completed: string[];
    assessments_passed: string[];
    practical_hours?: number;
    continuing_education?: boolean;
  };
  status: 'active' | 'expired' | 'revoked' | 'pending_renewal';
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'beginner_track' | 'advanced_practitioner' | 'business_mastery' | 'specialty_focus';
  modules: {
    module_id: string;
    order: number;
    required: boolean;
    unlock_criteria?: string[];
  }[];
  estimated_duration: number; // total hours
  certification_awarded: string;
  prerequisites: string[];
  target_audience: string[];
  learning_outcomes: string[];
  created_by: string;
  published: boolean;
  enrollment_count: number;
  completion_rate: number;
}

export interface LearningAnalytics {
  user_id: string;
  total_modules_enrolled: number;
  total_modules_completed: number;
  total_time_spent: number; // hours
  certificates_earned: number;
  ce_credits_earned: number;
  current_learning_paths: string[];
  strengths: string[]; // Categories where user excels
  improvement_areas: string[]; // Categories needing work
  engagement_metrics: {
    daily_streak: number;
    avg_session_duration: number;
    preferred_content_type: string;
    peak_learning_hours: number[];
  };
  performance_trends: {
    date: string;
    modules_completed: number;
    avg_quiz_score: number;
    time_spent: number;
  }[];
  recommendations: {
    next_modules: string[];
    review_modules: string[];
    skill_gaps: string[];
  };
}

class LearningCenterService {
  // Get all learning modules
  async getLearningModules(filters?: {
    category?: string;
    procedure_type?: string;
    difficulty_level?: string;
    certification_eligible?: boolean;
  }): Promise<LearningModule[]> {
    try {
      let query = supabase
        .from('learning_modules')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.procedure_type) {
        query = query.eq('procedure_type', filters.procedure_type);
      }
      if (filters?.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level);
      }
      if (filters?.certification_eligible !== undefined) {
        query = query.eq('certification_eligible', filters.certification_eligible);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching learning modules:', error);
      throw error;
    }
  }

  // Get specific learning module
  async getLearningModule(moduleId: string): Promise<LearningModule | null> {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching learning module:', error);
      throw error;
    }
  }

  // Get user progress for a module
  async getUserProgress(userId: string, moduleId: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  // Start or resume a module
  async startModule(userId: string, moduleId: string): Promise<UserProgress> {
    try {
      // Check if progress already exists
      let progress = await this.getUserProgress(userId, moduleId);
      
      if (!progress) {
        // Create new progress entry
        const newProgress: Partial<UserProgress> = {
          user_id: userId,
          module_id: moduleId,
          status: 'in_progress',
          progress_percentage: 0,
          time_spent: 0,
          sections_completed: [],
          quiz_scores: [],
          assessment_scores: [],
          notes: '',
          bookmarks: [],
          started_at: new Date().toISOString(),
          last_accessed: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('user_progress')
          .insert(newProgress)
          .select()
          .single();

        if (error) throw error;
        progress = data;
      } else {
        // Update last accessed time
        const { data, error } = await supabase
          .from('user_progress')
          .update({ last_accessed: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .select()
          .single();

        if (error) throw error;
        progress = data;
      }

      return progress;
    } catch (error) {
      console.error('Error starting module:', error);
      throw error;
    }
  }

  // Update section completion
  async completeSection(
    userId: string, 
    moduleId: string, 
    sectionId: string,
    timeSpent: number
  ): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress(userId, moduleId);
      if (!progress) throw new Error('Progress not found');

      const updatedSections = [...new Set([...progress.sections_completed, sectionId])];
      const updatedTimeSpent = progress.time_spent + timeSpent;
      
      // Calculate progress percentage
      const module = await this.getLearningModule(moduleId);
      const totalSections = module?.content.sections.length || 1;
      const progressPercentage = Math.round((updatedSections.length / totalSections) * 100);

      const updatedProgress = {
        sections_completed: updatedSections,
        time_spent: updatedTimeSpent,
        progress_percentage: progressPercentage,
        status: progressPercentage === 100 ? 'completed' : 'in_progress',
        last_accessed: new Date().toISOString(),
        ...(progressPercentage === 100 && { completed_at: new Date().toISOString() })
      };

      const { data, error } = await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing section:', error);
      throw error;
    }
  }

  // Submit quiz score
  async submitQuizScore(
    userId: string,
    moduleId: string,
    sectionId: string,
    score: number
  ): Promise<UserProgress> {
    try {
      const progress = await this.getUserProgress(userId, moduleId);
      if (!progress) throw new Error('Progress not found');

      const existingQuizIndex = progress.quiz_scores.findIndex(
        q => q.section_id === sectionId
      );

      let updatedQuizScores = [...progress.quiz_scores];
      
      if (existingQuizIndex >= 0) {
        // Update existing quiz score
        updatedQuizScores[existingQuizIndex] = {
          ...updatedQuizScores[existingQuizIndex],
          score,
          attempts: updatedQuizScores[existingQuizIndex].attempts + 1,
          best_score: Math.max(updatedQuizScores[existingQuizIndex].best_score, score)
        };
      } else {
        // Add new quiz score
        updatedQuizScores.push({
          section_id: sectionId,
          score,
          attempts: 1,
          best_score: score
        });
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          quiz_scores: updatedQuizScores,
          last_accessed: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting quiz score:', error);
      throw error;
    }
  }

  // Submit assessment
  async submitAssessment(
    userId: string,
    moduleId: string,
    assessmentId: string,
    score: number,
    passed: boolean
  ): Promise<{ progress: UserProgress; certificate?: Certification }> {
    try {
      const progress = await this.getUserProgress(userId, moduleId);
      if (!progress) throw new Error('Progress not found');

      // Update assessment scores
      const existingAssessmentIndex = progress.assessment_scores.findIndex(
        a => a.assessment_id === assessmentId
      );

      let updatedAssessmentScores = [...progress.assessment_scores];
      const attemptNumber = existingAssessmentIndex >= 0 
        ? updatedAssessmentScores[existingAssessmentIndex].attempt_number + 1 
        : 1;

      const assessmentScore = {
        assessment_id: assessmentId,
        score,
        passed,
        attempt_number: attemptNumber,
        completed_at: new Date().toISOString()
      };

      if (existingAssessmentIndex >= 0) {
        updatedAssessmentScores[existingAssessmentIndex] = assessmentScore;
      } else {
        updatedAssessmentScores.push(assessmentScore);
      }

      // Update progress
      const updatedProgress = {
        assessment_scores: updatedAssessmentScores,
        status: passed ? 'completed' : progress.status,
        last_accessed: new Date().toISOString(),
        ...(passed && { completed_at: new Date().toISOString() })
      };

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .select()
        .single();

      if (progressError) throw progressError;

      // Issue certificate if assessment passed and module is certification eligible
      let certificate;
      if (passed) {
        const module = await this.getLearningModule(moduleId);
        if (module?.certification_eligible) {
          certificate = await this.issueCertificate(userId, moduleId, 'proficiency');
        }
      }

      return { progress: progressData, certificate };
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }

  // Issue certificate
  async issueCertificate(
    userId: string,
    moduleId: string,
    certificateType: Certification['certificate_type']
  ): Promise<Certification> {
    try {
      const module = await this.getLearningModule(moduleId);
      if (!module) throw new Error('Module not found');

      const verificationCode = this.generateVerificationCode();
      const certificateData: Partial<Certification> = {
        user_id: userId,
        module_id: moduleId,
        certificate_type: certificateType,
        title: `${module.title} - ${certificateType.charAt(0).toUpperCase() + certificateType.slice(1)} Certificate`,
        issued_date: new Date().toISOString(),
        expiry_date: module.ce_credits ? new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        ce_credits: module.ce_credits,
        verification_code: verificationCode,
        digital_badge_url: this.generateBadgeUrl(verificationCode),
        pdf_certificate_url: this.generateCertificateUrl(verificationCode),
        issuing_authority: {
          name: 'Sphere OS Learning Center',
          credentials: 'Accredited Continuing Education Provider',
          signature_url: '/assets/signatures/sphere-os-signature.png'
        },
        requirements_met: {
          modules_completed: [moduleId],
          assessments_passed: [moduleId],
          continuing_education: !!module.ce_credits
        },
        status: 'active'
      };

      const { data, error } = await supabase
        .from('certifications')
        .insert(certificateData)
        .select()
        .single();

      if (error) throw error;

      // Update user progress to mark as certified
      await supabase
        .from('user_progress')
        .update({ 
          status: 'certified',
          certificate_issued: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('module_id', moduleId);

      return data;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      throw error;
    }
  }

  // Get user certificates
  async getUserCertificates(userId: string): Promise<Certification[]> {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', userId)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user certificates:', error);
      throw error;
    }
  }

  // Get learning analytics
  async getLearningAnalytics(userId: string): Promise<LearningAnalytics> {
    try {
      // Fetch user progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // Fetch certificates
      const certificates = await this.getUserCertificates(userId);

      // Calculate analytics
      const totalModulesEnrolled = progressData.length;
      const totalModulesCompleted = progressData.filter(p => p.status === 'completed' || p.status === 'certified').length;
      const totalTimeSpent = progressData.reduce((sum, p) => sum + p.time_spent, 0) / 60; // Convert to hours
      const certificatesEarned = certificates.filter(c => c.status === 'active').length;
      const ceCreditsEarned = certificates.reduce((sum, c) => sum + (c.ce_credits || 0), 0);

      // Generate performance trends (mock data for last 30 days)
      const performanceTrends = this.generatePerformanceTrends(progressData);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(userId, progressData);

      return {
        user_id: userId,
        total_modules_enrolled: totalModulesEnrolled,
        total_modules_completed: totalModulesCompleted,
        total_time_spent: totalTimeSpent,
        certificates_earned: certificatesEarned,
        ce_credits_earned: ceCreditsEarned,
        current_learning_paths: [], // Would be fetched from learning_paths table
        strengths: this.identifyStrengths(progressData),
        improvement_areas: this.identifyImprovementAreas(progressData),
        engagement_metrics: {
          daily_streak: this.calculateDailyStreak(progressData),
          avg_session_duration: totalTimeSpent / totalModulesEnrolled || 0,
          preferred_content_type: 'video', // Would be calculated from interaction data
          peak_learning_hours: [9, 10, 11, 14, 15] // Would be calculated from access patterns
        },
        performance_trends: performanceTrends,
        recommendations
      };
    } catch (error) {
      console.error('Error generating learning analytics:', error);
      throw error;
    }
  }

  // Helper methods
  private generateVerificationCode(): string {
    return 'SPHERE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private generateBadgeUrl(verificationCode: string): string {
    return `/api/certificates/badge/${verificationCode}`;
  }

  private generateCertificateUrl(verificationCode: string): string {
    return `/api/certificates/pdf/${verificationCode}`;
  }

  private generatePerformanceTrends(progressData: UserProgress[]) {
    const trends = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        modules_completed: Math.floor(Math.random() * 3),
        avg_quiz_score: 75 + Math.floor(Math.random() * 20),
        time_spent: Math.floor(Math.random() * 120) // minutes
      });
    }
    return trends;
  }

  private async generateRecommendations(userId: string, progressData: UserProgress[]) {
    // This would use AI to generate personalized recommendations
    return {
      next_modules: ['advanced-botox-techniques', 'business-growth-strategies'],
      review_modules: progressData
        .filter(p => p.quiz_scores.some(q => q.best_score < 80))
        .map(p => p.module_id)
        .slice(0, 3),
      skill_gaps: ['injection-technique', 'patient-consultation']
    };
  }

  private identifyStrengths(progressData: UserProgress[]): string[] {
    const categoryScores: Record<string, number[]> = {};
    
    progressData.forEach(progress => {
      // Would categorize modules and analyze scores
      const avgScore = progress.quiz_scores.reduce((sum, q) => sum + q.best_score, 0) / progress.quiz_scores.length;
      if (avgScore > 85) {
        // Would map to actual categories
        if (!categoryScores['technique']) categoryScores['technique'] = [];
        categoryScores['technique'].push(avgScore);
      }
    });

    return Object.keys(categoryScores).filter(cat => 
      categoryScores[cat].reduce((sum, score) => sum + score, 0) / categoryScores[cat].length > 80
    );
  }

  private identifyImprovementAreas(progressData: UserProgress[]): string[] {
    return progressData
      .filter(p => p.quiz_scores.some(q => q.best_score < 70))
      .map(() => 'patient-safety') // Would map to actual weak categories
      .slice(0, 3);
  }

  private calculateDailyStreak(progressData: UserProgress[]): number {
    // Would calculate actual streak from access patterns
    return Math.floor(Math.random() * 15) + 1;
  }
}

export const learningCenterService = new LearningCenterService();
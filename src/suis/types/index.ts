// SPHEREOS UNIFIED INTELLIGENCE SYSTEM (SUIS)
// TypeScript Interface Definitions
// Version: 1.0.0

// ==================================================================
// CORE SYSTEM INTERFACES
// ==================================================================

export interface SUISConfig {
  apiEndpoints: {
    sphere1a: string;
    openRouter: string;
    twilio: string;
    supabase: string;
  };
  features: {
    realTimeIntelligence: boolean;
    predictiveAnalytics: boolean;
    contentGeneration: boolean;
    callAnalysis: boolean;
    marketIntelligence: boolean;
  };
  performance: {
    cacheTimeout: number;
    batchSize: number;
    refreshInterval: number;
  };
}

// ==================================================================
// INTELLIGENCE PROFILE INTERFACES
// ==================================================================

export interface IntelligenceProfile {
  id: string;
  userId: string;
  profileType: 'rep' | 'manager' | 'executive';
  specializations: Specialization[];
  territoryIds: string[];
  goals: UserGoals;
  preferences: UserPreferences;
  aiSettings: AISettings;
  performanceBaseline: PerformanceBaseline;
  createdAt: string;
  updatedAt: string;
}

export type Specialization = 
  | 'aesthetics' 
  | 'dental' 
  | 'surgical' 
  | 'dermatology' 
  | 'orthopedics';

export interface UserGoals {
  salesTargets: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  procedureFocus: string[];
  territoryExpansion: boolean;
  skillDevelopment: string[];
  clientRetention: number;
}

export interface UserPreferences {
  notificationFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  insightDepth: 'summary' | 'detailed' | 'comprehensive';
  automationLevel: 'manual' | 'assisted' | 'automated';
  communicationStyle: 'formal' | 'casual' | 'technical';
  dashboardLayout: DashboardLayout;
}

export interface AISettings {
  notificationFrequency: string;
  insightDepth: string;
  automationLevel: string;
  preferredModels: string[];
  confidenceThreshold: number;
}

export interface PerformanceBaseline {
  salesMetrics: Record<string, number>;
  activityMetrics: Record<string, number>;
  engagementMetrics: Record<string, number>;
  calculatedAt: string;
}

// ==================================================================
// MARKET INTELLIGENCE INTERFACES
// ==================================================================

export interface MarketIntelligence {
  id: string;
  source: IntelligenceSource;
  intelligenceType: string;
  specialty?: string;
  territoryId?: string;
  geographicScope: GeographicScope;
  data: Record<string, any>;
  rawData?: Record<string, any>;
  confidenceScore: number;
  relevanceScores: Record<string, number>;
  tags: string[];
  impactAssessment: ImpactAssessment;
  trendDirection: TrendDirection;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export type IntelligenceSource = 
  | 'sphere1a' 
  | 'market_feed' 
  | 'competitor' 
  | 'news' 
  | 'regulatory';

export type GeographicScope = 'local' | 'regional' | 'national' | 'global';

export type TrendDirection = 'up' | 'down' | 'stable' | 'volatile';

export interface ImpactAssessment {
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  timeToImpact: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  affectedAreas: string[];
  recommendedActions: string[];
}

export interface MarketTrend {
  id: string;
  intelligenceId: string;
  trendCategory: string;
  trendName: string;
  trendDescription: string;
  timePeriod: {
    start: string;
    end: string;
  };
  growthRate?: number;
  volumeData: VolumeData;
  priceTrends: PriceTrends;
  competitiveLandscape: CompetitiveLandscape;
  predictionData: PredictionData;
  createdAt: string;
}

export interface VolumeData {
  current: number;
  historical: Array<{
    period: string;
    volume: number;
  }>;
  projected: Array<{
    period: string;
    volume: number;
    confidence: number;
  }>;
}

export interface PriceTrends {
  averagePrice: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  priceProjections: Array<{
    date: string;
    projectedPrice: number;
    confidence: number;
  }>;
}

export interface CompetitiveLandscape {
  marketShare: Record<string, number>;
  keyPlayers: Array<{
    company: string;
    marketShare: number;
    recentMoves: string[];
  }>;
  competitiveAdvantages: string[];
  threats: string[];
}

export interface PredictionData {
  predictedOutcome: string;
  probability: number;
  timeframe: string;
  factors: string[];
  confidence: number;
}

// ==================================================================
// ANALYTICS INTERFACES
// ==================================================================

export interface UnifiedAnalytics {
  id: string;
  userId: string;
  analyticsType: AnalyticsType;
  periodStart: string;
  periodEnd: string;
  metrics: AnalyticsMetrics;
  insights: Insight[];
  benchmarks: Benchmarks;
  predictions: Predictions;
  recommendations: Recommendation[];
  dataSources: string[];
  calculationMetadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsType = 
  | 'rep_performance' 
  | 'region_metrics' 
  | 'procedure_analytics' 
  | 'market_share' 
  | 'competitive_analysis';

export interface AnalyticsMetrics {
  sales: SalesMetrics;
  activity: ActivityMetrics;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
}

export interface SalesMetrics {
  revenue: number;
  deals: number;
  averageDealSize: number;
  conversionRate: number;
  salesCycle: number;
  pipelineValue: number;
}

export interface ActivityMetrics {
  calls: number;
  emails: number;
  meetings: number;
  demos: number;
  proposals: number;
  followUps: number;
}

export interface EngagementMetrics {
  responseRate: number;
  meetingAcceptanceRate: number;
  contentEngagement: number;
  socialInteractions: number;
  referrals: number;
}

export interface PerformanceMetrics {
  overallScore: number;
  goalAttainment: number;
  trendDirection: TrendDirection;
  percentileRank: number;
  improvementRate: number;
}

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  actionable: boolean;
  priority: Priority;
}

export type InsightType = 
  | 'opportunity' 
  | 'risk' 
  | 'trend' 
  | 'performance' 
  | 'market';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Benchmarks {
  industry: Record<string, number>;
  company: Record<string, number>;
  peer: Record<string, number>;
  historical: Record<string, number>;
}

export interface Predictions {
  shortTerm: PredictionSet;
  mediumTerm: PredictionSet;
  longTerm: PredictionSet;
}

export interface PredictionSet {
  timeframe: string;
  predictions: Array<{
    metric: string;
    predictedValue: number;
    confidence: number;
    factors: string[];
  }>;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: Priority;
  effort: EffortLevel;
  expectedImpact: ImpactLevel;
  timeframe: string;
  actions: Action[];
  relatedInsights: string[];
}

export type RecommendationType = 
  | 'strategy' 
  | 'tactical' 
  | 'operational' 
  | 'learning' 
  | 'process';

export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';

export interface Action {
  id: string;
  description: string;
  type: ActionType;
  estimatedTime: number;
  dependencies: string[];
  completed: boolean;
  dueDate?: string;
}

export type ActionType = 
  | 'call' 
  | 'email' 
  | 'meeting' 
  | 'research' 
  | 'follow_up' 
  | 'content_creation';

// ==================================================================
// CONTACT UNIVERSE INTERFACES
// ==================================================================

export interface ContactUniverse {
  id: string;
  userId: string;
  contactTier: ContactTier;
  contactData: ContactData;
  practiceInformation: PracticeInformation;
  procedureInterests: string[];
  acquisitionSource: string;
  enrichmentData: EnrichmentData;
  qualityScore: number;
  engagementScore: number;
  conversionProbability: number;
  engagementHistory: EngagementRecord[];
  communicationPreferences: CommunicationPreferences;
  lastInteraction?: string;
  nextRecommendedAction?: RecommendedAction;
  lifecycleStage: LifecycleStage;
  createdAt: string;
  updatedAt: string;
}

export type ContactTier = 'tier_20' | 'tier_50' | 'tier_100';

export interface ContactData {
  firstName: string;
  lastName: string;
  title: string;
  email?: string;
  phone?: string;
  company: string;
  address?: Address;
  socialProfiles?: SocialProfiles;
  professionalBackground?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialProfiles {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface PracticeInformation {
  practiceSize: PracticeSize;
  proceduresPerformed: string[];
  annualVolume?: number;
  equipment: string[];
  competitors: string[];
  decisionMakers: DecisionMaker[];
  budget?: BudgetInformation;
}

export type PracticeSize = 'solo' | 'small' | 'medium' | 'large' | 'enterprise';

export interface DecisionMaker {
  name: string;
  role: string;
  influence: InfluenceLevel;
  contactInfo?: ContactData;
}

export type InfluenceLevel = 'low' | 'medium' | 'high' | 'decision_maker';

export interface BudgetInformation {
  annualBudget?: number;
  budgetCycle: string;
  approvalProcess: string;
  lastPurchase?: {
    date: string;
    amount: number;
    vendor: string;
  };
}

export interface EnrichmentData {
  dataProviders: string[];
  lastEnriched: string;
  completenessScore: number;
  verificationStatus: VerificationStatus;
  additionalData: Record<string, any>;
}

export type VerificationStatus = 'verified' | 'pending' | 'failed' | 'outdated';

export interface EngagementRecord {
  date: string;
  type: EngagementType;
  channel: EngagementChannel;
  outcome: EngagementOutcome;
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export type EngagementType = 
  | 'call' 
  | 'email' 
  | 'meeting' 
  | 'demo' 
  | 'social' 
  | 'event';

export type EngagementChannel = 
  | 'phone' 
  | 'email' 
  | 'video' 
  | 'in_person' 
  | 'social_media' 
  | 'website';

export type EngagementOutcome = 
  | 'positive' 
  | 'neutral' 
  | 'negative' 
  | 'no_response' 
  | 'follow_up_scheduled';

export interface CommunicationPreferences {
  preferredChannel: EngagementChannel;
  preferredTime: TimePreference;
  frequency: FrequencyPreference;
  language: string;
  timezone: string;
}

export interface TimePreference {
  dayOfWeek: string[];
  timeOfDay: string[];
  timezone: string;
}

export type FrequencyPreference = 'high' | 'medium' | 'low' | 'minimal';

export interface RecommendedAction {
  actionType: ActionType;
  description: string;
  priority: Priority;
  scheduledFor?: string;
  context: Record<string, any>;
}

export type LifecycleStage = 
  | 'prospect' 
  | 'qualified' 
  | 'opportunity' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost' 
  | 'customer';

// ==================================================================
// RESEARCH MODULE INTERFACES
// ==================================================================

export interface ResearchQuery {
  id: string;
  userId: string;
  queryText: string;
  queryContext: QueryContext;
  searchParameters: SearchParameters;
  openRouterModel?: string;
  modelParameters: ModelParameters;
  responseData?: ResearchResponse;
  sourcesCited: Source[];
  relevanceToGoals: Record<string, number>;
  accuracyRating?: number;
  userFeedback?: UserFeedback;
  processingTimeMs?: number;
  tokenUsage?: TokenUsage;
  createdAt: string;
}

export interface QueryContext {
  currentOpportunities: string[];
  activeProjects: string[];
  recentInteractions: string[];
  userGoals: string[];
  marketConditions: Record<string, any>;
}

export interface SearchParameters {
  includeCompetitive: boolean;
  includeTechnical: boolean;
  includeMarket: boolean;
  timeframe: string;
  confidenceThreshold: number;
  maxResults: number;
}

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface ResearchResponse {
  summary: string;
  keyFindings: KeyFinding[];
  recommendations: string[];
  sources: Source[];
  confidence: number;
  limitations: string[];
  followUpQuestions: string[];
}

export interface KeyFinding {
  finding: string;
  confidence: number;
  sources: string[];
  implications: string[];
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  type: SourceType;
  credibility: number;
  date?: string;
  relevance: number;
}

export type SourceType = 
  | 'academic' 
  | 'industry_report' 
  | 'news' 
  | 'company_data' 
  | 'regulatory' 
  | 'expert_opinion';

export interface UserFeedback {
  helpfulness: number;
  accuracy: number;
  completeness: number;
  comments?: string;
  submittedAt: string;
}

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
  cost?: number;
}

// ==================================================================
// CONTENT GENERATION INTERFACES
// ==================================================================

export interface GeneratedContent {
  id: string;
  userId: string;
  contentType: ContentType;
  targetAudience: TargetAudience;
  procedureFocus?: string;
  contentData: ContentData;
  generationParameters: GenerationParameters;
  aiModelUsed: string;
  personalizationLevel: PersonalizationLevel;
  performanceMetrics: ContentPerformanceMetrics;
  abTestData?: ABTestData;
  version: number;
  parentContentId?: string;
  approvalStatus: ApprovalStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContentType = 
  | 'email' 
  | 'presentation' 
  | 'social' 
  | 'proposal' 
  | 'follow_up' 
  | 'newsletter';

export interface TargetAudience {
  demographics: Demographics;
  professionalProfile: ProfessionalProfile;
  interests: string[];
  painPoints: string[];
  preferredTone: TonePreference;
}

export interface Demographics {
  ageRange?: string;
  gender?: string;
  location?: string;
  education?: string;
  income?: string;
}

export interface ProfessionalProfile {
  title: string;
  industry: string;
  experience: string;
  companySize: string;
  decisionLevel: DecisionLevel;
}

export type DecisionLevel = 'influencer' | 'recommender' | 'decision_maker' | 'buyer';

export type TonePreference = 'professional' | 'casual' | 'technical' | 'friendly' | 'authoritative';

export interface ContentData {
  subject?: string;
  body: string;
  attachments?: Attachment[];
  metadata: ContentMetadata;
  variants?: ContentVariant[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ContentMetadata {
  wordCount: number;
  readingTime: number;
  sentiment: SentimentAnalysis;
  keywords: string[];
  tone: string;
  complexity: ComplexityLevel;
}

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'expert';

export interface ContentVariant {
  id: string;
  name: string;
  body: string;
  testGroup: string;
}

export interface GenerationParameters {
  tone: string;
  length: ContentLength;
  includeCallToAction: boolean;
  personalizations: string[];
  templateId?: string;
  customInstructions?: string;
}

export type ContentLength = 'short' | 'medium' | 'long' | 'custom';

export type PersonalizationLevel = 'low' | 'medium' | 'high' | 'custom';

export interface ContentPerformanceMetrics {
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  responseRate?: number;
  conversionRate?: number;
  engagementScore?: number;
  sharingRate?: number;
}

export interface ABTestData {
  testId: string;
  variants: ContentVariant[];
  metrics: Record<string, ContentPerformanceMetrics>;
  winner?: string;
  confidence: number;
  sampleSize: number;
}

export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

// ==================================================================
// CALL INTELLIGENCE INTERFACES
// ==================================================================

export interface CallIntelligence {
  id: string;
  userId: string;
  twilioCallSid: string;
  contactId?: string;
  callMetadata: CallMetadata;
  callDuration?: number;
  callOutcome?: CallOutcome;
  transcription?: string;
  transcriptionConfidence?: number;
  sentimentAnalysis: SentimentAnalysis;
  emotionAnalysis: EmotionAnalysis;
  keyTopics: string[];
  objectionsRaised: Objection[];
  commitmentsMade: Commitment[];
  actionItems: CallActionItem[];
  coachingInsights: CoachingInsight[];
  complianceFlags: ComplianceFlag[];
  followUpRequired: boolean;
  followUpScheduled?: string;
  createdAt: string;
  processedAt?: string;
}

export interface CallMetadata {
  direction: CallDirection;
  startTime: string;
  endTime: string;
  participantCount: number;
  recordingUrl?: string;
  callQuality: CallQuality;
  deviceInfo?: DeviceInfo;
}

export type CallDirection = 'inbound' | 'outbound';

export interface CallQuality {
  overall: number;
  audioClarity: number;
  connectionStability: number;
  backgroundNoise: number;
}

export interface DeviceInfo {
  type: string;
  browser?: string;
  os?: string;
  network?: string;
}

export type CallOutcome = 
  | 'success' 
  | 'no_answer' 
  | 'busy' 
  | 'failed' 
  | 'voicemail' 
  | 'scheduled_callback';

export interface SentimentAnalysis {
  overall: number;
  bySegment: SentimentSegment[];
  emotions: EmotionScore[];
  confidence: number;
}

export interface SentimentSegment {
  startTime: number;
  endTime: number;
  sentiment: number;
  text: string;
}

export interface EmotionScore {
  emotion: EmotionType;
  score: number;
  confidence: number;
}

export type EmotionType = 
  | 'joy' 
  | 'anger' 
  | 'fear' 
  | 'sadness' 
  | 'surprise' 
  | 'trust' 
  | 'anticipation' 
  | 'disgust';

export interface EmotionAnalysis {
  dominantEmotion: EmotionType;
  emotionProgression: EmotionProgression[];
  emotionalState: EmotionalState;
  confidence: number;
}

export interface EmotionProgression {
  timestamp: number;
  emotions: EmotionScore[];
}

export interface EmotionalState {
  energy: number;
  stress: number;
  engagement: number;
  satisfaction: number;
}

export interface Objection {
  id: string;
  type: ObjectionType;
  text: string;
  timestamp: number;
  severity: Severity;
  response?: string;
  resolved: boolean;
}

export type ObjectionType = 
  | 'price' 
  | 'product' 
  | 'timing' 
  | 'authority' 
  | 'need' 
  | 'competition';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Commitment {
  id: string;
  type: CommitmentType;
  description: string;
  timestamp: number;
  deadline?: string;
  responsible: string;
  confidence: number;
}

export type CommitmentType = 
  | 'meeting' 
  | 'demo' 
  | 'trial' 
  | 'proposal' 
  | 'decision' 
  | 'follow_up';

export interface CallActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: string;
  priority: Priority;
  status: ActionItemStatus;
  relatedTopics: string[];
}

export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface CoachingInsight {
  category: CoachingCategory;
  insight: string;
  recommendation: string;
  impact: ImpactLevel;
  examples?: string[];
}

export type CoachingCategory = 
  | 'communication' 
  | 'objection_handling' 
  | 'closing' 
  | 'discovery' 
  | 'presentation' 
  | 'rapport';

export interface ComplianceFlag {
  type: ComplianceType;
  severity: Severity;
  description: string;
  timestamp: number;
  requiresAction: boolean;
}

export type ComplianceType = 
  | 'regulatory' 
  | 'privacy' 
  | 'recording_consent' 
  | 'data_handling' 
  | 'professional_standards';

// ==================================================================
// NOTIFICATION INTERFACES
// ==================================================================

export interface SUISNotification {
  id: string;
  userId: string;
  notificationType: NotificationType;
  priority: Priority;
  category?: string;
  title: string;
  content: NotificationContent;
  contextData: Record<string, any>;
  predictionData?: PredictionData;
  actionRequired: boolean;
  actionItems: NotificationAction[];
  actionTaken?: ActionTaken;
  deliveryMethod: DeliveryMethod;
  scheduledDelivery?: string;
  deliveredAt?: string;
  readAt?: string;
  dismissedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export type NotificationType = 
  | 'insight' 
  | 'alert' 
  | 'recommendation' 
  | 'update' 
  | 'achievement';

export interface NotificationContent {
  summary: string;
  details?: string;
  data?: Record<string, any>;
  attachments?: Attachment[];
  relatedItems?: RelatedItem[];
}

export interface RelatedItem {
  id: string;
  type: string;
  title: string;
  url?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  actionType: NotificationActionType;
  url?: string;
  payload?: Record<string, any>;
  primary: boolean;
}

export type NotificationActionType = 
  | 'navigate' 
  | 'api_call' 
  | 'download' 
  | 'external_link' 
  | 'dismiss';

export interface ActionTaken {
  actionId: string;
  takenAt: string;
  result?: string;
  feedback?: string;
}

export type DeliveryMethod = 
  | 'in_app' 
  | 'email' 
  | 'sms' 
  | 'push' 
  | 'webhook';

// ==================================================================
// LEARNING CENTER INTERFACES
// ==================================================================

export interface LearningPath {
  id: string;
  userId: string;
  pathType: LearningPathType;
  pathName: string;
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number;
  prerequisites: string[];
  learningObjectives: LearningObjective[];
  currentProgress: LearningProgress;
  recommendedResources: LearningResource[];
  performanceCorrelation: PerformanceCorrelation;
  adaptiveParameters: AdaptiveParameters;
  completionCriteria: CompletionCriteria;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LearningPathType = 
  | 'skill_gap' 
  | 'product_mastery' 
  | 'market_knowledge' 
  | 'sales_technique' 
  | 'compliance';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface LearningObjective {
  id: string;
  description: string;
  category: string;
  measurable: boolean;
  assessmentCriteria: string[];
}

export interface LearningProgress {
  overallCompletion: number;
  moduleProgress: Record<string, number>;
  timeSpent: number;
  lastAccessed: string;
  currentModule?: string;
}

export interface LearningResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url?: string;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  tags: string[];
}

export type ResourceType = 
  | 'video' 
  | 'article' 
  | 'interactive' 
  | 'assessment' 
  | 'simulation' 
  | 'webinar';

export interface PerformanceCorrelation {
  skillImpact: Record<string, number>;
  performanceMetrics: Record<string, number>;
  correlationStrength: number;
  lastCalculated: string;
}

export interface AdaptiveParameters {
  learningStyle: LearningStyle;
  pacePreference: PacePreference;
  contentPreferences: ContentPreference[];
  adaptationLevel: number;
}

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type PacePreference = 'self_paced' | 'structured' | 'intensive';

export interface ContentPreference {
  type: ResourceType;
  preference: number;
}

export interface CompletionCriteria {
  minimumScore: number;
  requiredModules: string[];
  timeLimit?: number;
  practicalAssessment: boolean;
}

// ==================================================================
// THEME SYSTEM INTERFACES
// ==================================================================

export interface ThemeSystem {
  currentTheme: ThemeName;
  themes: ThemeCollection;
  intelligentSwitching: IntelligentSwitching;
  customizations: ThemeCustomizations;
  accessibility: AccessibilitySettings;
}

export type ThemeName = 'light' | 'dark' | 'high_contrast' | 'custom';

export interface ThemeCollection {
  light: ThemeConfig;
  dark: ThemeConfig;
  highContrast: ThemeConfig;
  custom: CustomTheme[];
}

export interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  animations: AnimationSettings;
  shadows: ShadowSettings;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Typography {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  scale: number[];
  grid: number;
  borderRadius: {
    none: number;
    sm: number;
    base: number;
    lg: number;
    full: number;
  };
}

export interface AnimationSettings {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  reducedMotion: boolean;
}

export interface ShadowSettings {
  sm: string;
  base: string;
  lg: string;
  xl: string;
}

export interface CustomTheme extends ThemeConfig {
  id: string;
  authorId: string;
  isPublic: boolean;
  createdAt: string;
}

export interface IntelligentSwitching {
  timeBasedAuto: boolean;
  environmentAware: boolean;
  userPreference: ThemePreference;
  schedule?: ThemeSchedule;
}

export interface ThemePreference {
  preferred: ThemeName;
  autoSwitch: boolean;
  respectSystemPreference: boolean;
}

export interface ThemeSchedule {
  lightThemeStart: string;
  darkThemeStart: string;
  timezone: string;
}

export interface ThemeCustomizations {
  userModifications: Record<string, any>;
  componentOverrides: Record<string, any>;
  savedCustomizations: SavedCustomization[];
}

export interface SavedCustomization {
  id: string;
  name: string;
  modifications: Record<string, any>;
  createdAt: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  increaseFontSize: number;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  colorBlindSupport: ColorBlindSupport;
}

export interface ColorBlindSupport {
  enabled: boolean;
  type: ColorBlindType;
  adjustments: ColorAdjustments;
}

export type ColorBlindType = 
  | 'protanopia' 
  | 'deuteranopia' 
  | 'tritanopia' 
  | 'achromatopsia';

export interface ColorAdjustments {
  hueShift: number;
  saturationBoost: number;
  contrastIncrease: number;
}

// ==================================================================
// DASHBOARD LAYOUT INTERFACES
// ==================================================================

export interface DashboardLayout {
  layout: LayoutType;
  widgets: DashboardWidget[];
  customizations: LayoutCustomizations;
  responsiveBreakpoints: ResponsiveBreakpoints;
}

export type LayoutType = 'grid' | 'masonry' | 'custom';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  configuration: WidgetConfiguration;
  permissions: WidgetPermissions;
  isVisible: boolean;
  refreshInterval?: number;
}

export type WidgetType = 
  | 'analytics_summary' 
  | 'market_intelligence' 
  | 'notifications' 
  | 'call_insights' 
  | 'content_performance' 
  | 'learning_progress' 
  | 'contact_activity' 
  | 'goal_tracking';

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetSize {
  minW: number;
  minH: number;
  maxW?: number;
  maxH?: number;
}

export interface WidgetConfiguration {
  dataSource: string;
  filters: Record<string, any>;
  displayOptions: DisplayOptions;
  updateFrequency: UpdateFrequency;
}

export interface DisplayOptions {
  chartType?: ChartType;
  colorScheme?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  animation?: boolean;
}

export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'doughnut' 
  | 'area' 
  | 'scatter' 
  | 'heatmap';

export type UpdateFrequency = 
  | 'real_time' 
  | 'minute' 
  | 'hourly' 
  | 'daily' 
  | 'manual';

export interface WidgetPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
}

export interface LayoutCustomizations {
  autoArrange: boolean;
  compactMode: boolean;
  gridSize: number;
  padding: number;
  allowOverlap: boolean;
}

export interface ResponsiveBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// ==================================================================
// API RESPONSE INTERFACES
// ==================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: ResponseMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  processingTime: number;
  version: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ==================================================================
// REAL-TIME SUBSCRIPTIONS
// ==================================================================

export interface SUISSubscription {
  channel: string;
  event: string;
  filter?: Record<string, any>;
  callback: (payload: any) => void;
}

export interface RealtimePayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  commit_timestamp: string;
  new?: Record<string, any>;
  old?: Record<string, any>;
}

// ==================================================================
// EXPORT DEFAULTS
// ==================================================================

export default {
  // Type guards
  isValidIntelligenceSource: (source: string): source is IntelligenceSource => {
    return ['sphere1a', 'market_feed', 'competitor', 'news', 'regulatory'].includes(source);
  },

  isValidContactTier: (tier: string): tier is ContactTier => {
    return ['tier_20', 'tier_50', 'tier_100'].includes(tier);
  },

  isValidContentType: (type: string): type is ContentType => {
    return ['email', 'presentation', 'social', 'proposal', 'follow_up', 'newsletter'].includes(type);
  },

  isValidNotificationType: (type: string): type is NotificationType => {
    return ['insight', 'alert', 'recommendation', 'update', 'achievement'].includes(type);
  },

  // Utility functions
  createEmptyIntelligenceProfile: (): Partial<IntelligenceProfile> => ({
    specializations: [],
    territoryIds: [],
    goals: {
      salesTargets: { monthly: 0, quarterly: 0, annual: 0 },
      procedureFocus: [],
      territoryExpansion: false,
      skillDevelopment: [],
      clientRetention: 0
    },
    preferences: {
      notificationFrequency: 'real_time',
      insightDepth: 'detailed',
      automationLevel: 'assisted',
      communicationStyle: 'formal',
      dashboardLayout: {
        layout: 'grid',
        widgets: [],
        customizations: {
          autoArrange: true,
          compactMode: false,
          gridSize: 12,
          padding: 16,
          allowOverlap: false
        },
        responsiveBreakpoints: {
          xs: 480,
          sm: 768,
          md: 1024,
          lg: 1280,
          xl: 1920
        }
      }
    }
  })
};
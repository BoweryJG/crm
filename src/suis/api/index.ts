// SPHEREOS UNIFIED INTELLIGENCE SYSTEM (SUIS)
// API Integration Layer
// Version: 1.0.0

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  MarketIntelligence,
  ResearchQuery,
  GeneratedContent,
  CallIntelligence,
  ContactUniverse,
  UnifiedAnalytics,
  APIResponse
} from '../types';

// ==================================================================
// CONFIGURATION INTERFACES
// ==================================================================

interface SUISAPIConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
  };
  sphere1a: {
    baseUrl: string;
    apiKey: string;
    version: string;
  };
  openRouter: {
    baseUrl: string;
    apiKey: string;
    defaultModel: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    apiVersion: string;
  };
  encryption: {
    key: string;
    algorithm: string;
  };
}

// ==================================================================
// BASE API CLIENT CLASS
// ==================================================================

abstract class BaseAPIClient {
  protected axios: AxiosInstance;
  protected config: any;

  constructor(baseURL: string, config: any) {
    this.config = config;
    this.axios = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SUIS/1.0.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.axios.interceptors.request.use(
      (config) => {
        // Add authentication headers
        if (this.config.apiKey) {
          config.headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle authentication errors
          await this.handleAuthError();
        }
        
        return Promise.reject(this.transformError(error));
      }
    );
  }

  protected generateRequestId(): string {
    return `suis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected abstract handleAuthError(): Promise<void>;

  protected transformError(error: any): Error {
    const message = error.response?.data?.message || error.message || 'Unknown error';
    const code = error.response?.data?.code || error.code || 'UNKNOWN';
    
    const transformedError = new Error(message);
    (transformedError as any).code = code;
    (transformedError as any).status = error.response?.status;
    (transformedError as any).details = error.response?.data;
    
    return transformedError;
  }

  protected async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    try {
      const response = await this.axios.request<T>({
        method,
        url: endpoint,
        data,
        ...config
      });

      return {
        success: true,
        data: response.data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: response.config.headers?.['X-Request-ID'] as string,
          processingTime: Date.now() - (response.config as any).startTime,
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: (error as any).code || 'API_ERROR',
          message: (error as any).message,
          details: (error as any).details
        }
      };
    }
  }
}

// ==================================================================
// SPHERE1A API CLIENT
// ==================================================================

export class Sphere1AClient extends BaseAPIClient {
  constructor(config: SUISAPIConfig['sphere1a']) {
    super(config.baseUrl, config);
  }

  protected async handleAuthError(): Promise<void> {
    // Implement Sphere1a authentication refresh logic
    console.warn('Sphere1a authentication error - implement refresh logic');
  }

  async getProcedureData(params: {
    specialty?: string;
    dateRange?: { start: string; end: string };
    territoryId?: string;
    limit?: number;
  }): Promise<APIResponse<any[]>> {
    return this.makeRequest('GET', '/procedures', null, { params });
  }

  async getMarketTrends(params: {
    specialty: string;
    timeframe: string;
    geography?: string;
  }): Promise<APIResponse<any[]>> {
    return this.makeRequest('GET', '/market-trends', null, { params });
  }

  async getCompetitiveData(params: {
    competitors?: string[];
    market?: string;
    products?: string[];
  }): Promise<APIResponse<any[]>> {
    return this.makeRequest('GET', '/competitive-landscape', null, { params });
  }

  async getProviderInsights(providerId: string): Promise<APIResponse<any>> {
    return this.makeRequest('GET', `/providers/${providerId}/insights`);
  }

  async searchProviders(params: {
    location?: string;
    specialty?: string;
    procedureVolume?: number;
    practiceSize?: string;
  }): Promise<APIResponse<any[]>> {
    return this.makeRequest('GET', '/providers/search', null, { params });
  }

  async getMarketIntelligence(params: {
    region?: string;
    specialty?: string;
    timeframe?: string;
  }): Promise<APIResponse<MarketIntelligence[]>> {
    const response = await this.makeRequest('GET', '/intelligence', null, { params });
    
    if (response.success && response.data) {
      // Transform Sphere1a data to SUIS format
      const transformedData = (response.data as any[]).map(item => ({
        id: item.id,
        source: 'sphere1a' as const,
        intelligenceType: item.type,
        specialty: item.specialty,
        territoryId: item.territory_id,
        geographicScope: item.geographic_scope,
        data: item.data,
        rawData: item,
        confidenceScore: item.confidence || 0.8,
        relevanceScores: {},
        tags: item.tags || [],
        impactAssessment: {
          businessImpact: item.impact?.business || 'medium',
          timeToImpact: item.impact?.timeline || 'medium_term',
          affectedAreas: item.impact?.areas || [],
          recommendedActions: item.recommendations || []
        },
        trendDirection: item.trend || 'stable',
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
        expiresAt: item.expires_at,
        isActive: true
      }));

      return {
        ...response,
        data: transformedData
      };
    }

    return response as APIResponse<MarketIntelligence[]>;
  }

  async subscribeToProcedureUpdates(callback: (data: any) => void): Promise<void> {
    // Implement WebSocket connection to Sphere1a for real-time updates
    console.log('Setting up Sphere1a real-time subscription');
    // This would typically establish a WebSocket connection
  }
}

// ==================================================================
// OPENROUTER API CLIENT
// ==================================================================

export class OpenRouterClient extends BaseAPIClient {
  constructor(config: SUISAPIConfig['openRouter']) {
    super(config.baseUrl, config);
  }

  protected async handleAuthError(): Promise<void> {
    // OpenRouter uses API keys, so just log the error
    console.error('OpenRouter authentication error - check API key');
  }

  async generateCompletion(params: {
    model?: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    context?: any;
  }): Promise<APIResponse<any>> {
    const payload = {
      model: params.model || this.config.defaultModel,
      messages: [
        ...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []),
        { role: 'user', content: params.prompt }
      ],
      max_tokens: params.maxTokens || 2000,
      temperature: params.temperature || 0.7
    };

    return this.makeRequest('POST', '/chat/completions', payload);
  }

  async performResearch(params: {
    query: string;
    context?: any;
    model?: string;
    includeFactChecking?: boolean;
  }): Promise<APIResponse<ResearchQuery>> {
    const systemPrompt = `You are a medical device sales research assistant. Provide comprehensive, accurate information about medical procedures, market trends, and competitive landscapes. Always cite sources and indicate confidence levels.

Context: ${JSON.stringify(params.context || {})}

Guidelines:
- Focus on actionable insights for sales professionals
- Include market data, competitive analysis, and procedure information
- Provide specific recommendations and next steps
- Indicate confidence levels for all claims
- Cite credible sources`;

    const response = await this.generateCompletion({
      model: params.model,
      prompt: params.query,
      systemPrompt,
      temperature: 0.3 // Lower temperature for research accuracy
    });

    if (response.success && response.data) {
      // Transform OpenRouter response to ResearchQuery format
      const researchData: Partial<ResearchQuery> = {
        queryText: params.query,
        queryContext: params.context || {},
        openRouterModel: params.model || this.config.defaultModel,
        responseData: {
          summary: response.data.choices[0].message.content.substring(0, 500),
          keyFindings: [], // Would extract from response
          recommendations: [], // Would extract from response
          sources: [], // Would extract from response
          confidence: 0.8, // Would calculate based on response
          limitations: [],
          followUpQuestions: []
        },
        sourcesCited: [],
        relevanceToGoals: {},
        processingTimeMs: response.metadata?.processingTime,
        tokenUsage: {
          prompt: response.data.usage?.prompt_tokens || 0,
          completion: response.data.usage?.completion_tokens || 0,
          total: response.data.usage?.total_tokens || 0
        },
        createdAt: new Date().toISOString()
      };

      return {
        ...response,
        data: researchData as ResearchQuery
      };
    }

    return response;
  }

  async generateContent(params: {
    contentType: 'email' | 'presentation' | 'social' | 'proposal';
    targetAudience: any;
    procedureFocus?: string;
    tone?: string;
    length?: 'short' | 'medium' | 'long';
    customInstructions?: string;
  }): Promise<APIResponse<GeneratedContent>> {
    const systemPrompt = `You are an expert medical device sales content generator. Create compelling, professional content that drives engagement and sales results.

Content Type: ${params.contentType}
Target Audience: ${JSON.stringify(params.targetAudience)}
Procedure Focus: ${params.procedureFocus || 'General'}
Tone: ${params.tone || 'Professional'}
Length: ${params.length || 'medium'}

Guidelines:
- Use medical terminology appropriately for the audience
- Include compelling value propositions
- Focus on patient outcomes and practice benefits
- Maintain compliance with medical device marketing regulations
- Include clear calls to action
- Personalize content based on audience profile`;

    const prompt = `Generate ${params.contentType} content for ${params.procedureFocus || 'medical device sales'}.
${params.customInstructions ? `Additional instructions: ${params.customInstructions}` : ''}

Please provide:
1. Subject line (if applicable)
2. Main content body
3. Call to action
4. Key talking points
5. Suggested follow-up actions`;

    const response = await this.generateCompletion({
      prompt,
      systemPrompt,
      temperature: 0.8 // Higher temperature for creative content
    });

    if (response.success && response.data) {
      const contentData: Partial<GeneratedContent> = {
        contentType: params.contentType,
        targetAudience: params.targetAudience,
        procedureFocus: params.procedureFocus,
        contentData: {
          body: response.data.choices[0].message.content,
          metadata: {
            wordCount: response.data.choices[0].message.content.split(' ').length,
            readingTime: Math.ceil(response.data.choices[0].message.content.split(' ').length / 200),
            sentiment: { overall: 0.7, bySegment: [], emotions: [], confidence: 0.8 }, // Would analyze sentiment
            keywords: [], // Would extract keywords
            tone: params.tone || 'professional',
            complexity: 'moderate'
          }
        },
        generationParameters: {
          tone: params.tone || 'professional',
          length: params.length || 'medium',
          includeCallToAction: true,
          personalizations: [],
          customInstructions: params.customInstructions
        },
        aiModelUsed: this.config.defaultModel,
        personalizationLevel: 'medium',
        performanceMetrics: {},
        version: 1,
        approvalStatus: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        ...response,
        data: contentData as GeneratedContent
      };
    }

    return response;
  }
}

// ==================================================================
// TWILIO API CLIENT
// ==================================================================

export class TwilioClient extends BaseAPIClient {
  constructor(config: SUISAPIConfig['twilio']) {
    super('https://api.twilio.com', config);
  }

  protected async handleAuthError(): Promise<void> {
    console.error('Twilio authentication error - check credentials');
  }

  async getCallDetails(callSid: string): Promise<APIResponse<any>> {
    return this.makeRequest('GET', `/${this.config.apiVersion}/Accounts/${this.config.accountSid}/Calls/${callSid}.json`);
  }

  async getCallRecording(callSid: string): Promise<APIResponse<any>> {
    return this.makeRequest('GET', `/${this.config.apiVersion}/Accounts/${this.config.accountSid}/Calls/${callSid}/Recordings.json`);
  }

  async analyzeCall(callSid: string): Promise<APIResponse<CallIntelligence>> {
    try {
      // Get call details
      const callResponse = await this.getCallDetails(callSid);
      if (!callResponse.success) return callResponse;

      // Get call recording
      const recordingResponse = await this.getCallRecording(callSid);
      
      // Simulate call analysis (would integrate with speech-to-text and sentiment analysis)
      const callIntelligence: Partial<CallIntelligence> = {
        twilioCallSid: callSid,
        callMetadata: {
          direction: callResponse.data.direction,
          startTime: callResponse.data.start_time,
          endTime: callResponse.data.end_time,
          participantCount: 2,
          callQuality: {
            overall: 0.85,
            audioClarity: 0.9,
            connectionStability: 0.8,
            backgroundNoise: 0.1
          }
        },
        callDuration: parseInt(callResponse.data.duration) || 0,
        callOutcome: this.determineCallOutcome(callResponse.data.status),
        sentimentAnalysis: {
          overall: 0.7,
          bySegment: [],
          emotions: [],
          confidence: 0.8
        },
        emotionAnalysis: {
          dominantEmotion: 'trust',
          emotionProgression: [],
          emotionalState: {
            energy: 0.7,
            stress: 0.3,
            engagement: 0.8,
            satisfaction: 0.75
          },
          confidence: 0.8
        },
        keyTopics: ['product demo', 'pricing', 'implementation'],
        objectionsRaised: [],
        commitmentsMade: [],
        actionItems: [],
        coachingInsights: [],
        complianceFlags: [],
        followUpRequired: true,
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: callIntelligence as CallIntelligence,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: this.generateRequestId(),
          processingTime: 0,
          version: '1.0.0'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CALL_ANALYSIS_ERROR',
          message: (error as Error).message
        }
      };
    }
  }

  private determineCallOutcome(status: string): CallIntelligence['callOutcome'] {
    const statusMap: Record<string, CallIntelligence['callOutcome']> = {
      'completed': 'success',
      'no-answer': 'no_answer',
      'busy': 'busy',
      'failed': 'failed',
      'canceled': 'failed'
    };
    return statusMap[status] || 'failed';
  }

  async subscribeToCallEvents(callback: (event: any) => void): Promise<void> {
    // Implement webhook subscription for real-time call events
    console.log('Setting up Twilio webhook subscription');
  }
}

// ==================================================================
// SUIS API MANAGER
// ==================================================================

export class SUISAPIManager {
  private sphere1a: Sphere1AClient;
  private openRouter: OpenRouterClient;
  private twilio: TwilioClient;
  private supabase: SupabaseClient;

  constructor(config: SUISAPIConfig) {
    this.sphere1a = new Sphere1AClient(config.sphere1a);
    this.openRouter = new OpenRouterClient(config.openRouter);
    this.twilio = new TwilioClient(config.twilio);
    // Use singleton from auth instead of creating new client
    const { getSupabaseClient } = require('../../auth/supabase');
    this.supabase = getSupabaseClient();
  }

  // Market Intelligence Methods
  async fetchMarketIntelligence(params: any): Promise<MarketIntelligence[]> {
    const response = await this.sphere1a.getMarketIntelligence(params);
    if (response.success && response.data) {
      // Store in Supabase for caching
      const { error } = await this.supabase
        .from('suis_market_intelligence')
        .upsert(response.data);
      
      if (error) console.error('Failed to cache market intelligence:', error);
      
      return response.data;
    }
    return [];
  }

  // Research Methods
  async performResearch(query: string, context?: any): Promise<ResearchQuery | null> {
    const response = await this.openRouter.performResearch({ query, context });
    if (response.success && response.data) {
      // Store research query in Supabase
      const { data: storedQuery, error } = await this.supabase
        .from('suis_research_queries')
        .insert(response.data)
        .select()
        .single();
      
      if (error) console.error('Failed to store research query:', error);
      
      return storedQuery || response.data;
    }
    return null;
  }

  // Content Generation Methods
  async generateContent(params: any): Promise<GeneratedContent | null> {
    const response = await this.openRouter.generateContent(params);
    if (response.success && response.data) {
      // Store generated content in Supabase
      const { data: storedContent, error } = await this.supabase
        .from('suis_generated_content')
        .insert(response.data)
        .select()
        .single();
      
      if (error) console.error('Failed to store generated content:', error);
      
      return storedContent || response.data;
    }
    return null;
  }

  // Call Analysis Methods
  async analyzeCall(callSid: string): Promise<CallIntelligence | null> {
    const response = await this.twilio.analyzeCall(callSid);
    if (response.success && response.data) {
      // Store call intelligence in Supabase
      const { data: storedCall, error } = await this.supabase
        .from('suis_call_intelligence')
        .insert(response.data)
        .select()
        .single();
      
      if (error) console.error('Failed to store call intelligence:', error);
      
      return storedCall || response.data;
    }
    return null;
  }

  // Analytics Methods
  async calculateAnalytics(userId: string, periodStart: string, periodEnd: string): Promise<UnifiedAnalytics | null> {
    try {
      // Call Supabase function to calculate analytics
      const { data, error } = await this.supabase.rpc('calculate_rep_intelligence', {
        p_user_id: userId,
        p_period_start: periodStart,
        p_period_end: periodEnd
      });

      if (error) throw error;

      // Create unified analytics record
      const analytics: Partial<UnifiedAnalytics> = {
        userId,
        analyticsType: 'rep_performance',
        periodStart,
        periodEnd,
        metrics: data,
        insights: [],
        benchmarks: {
          industry: {},
          company: {},
          peer: {},
          historical: {}
        },
        predictions: {
          shortTerm: { timeframe: '30 days', predictions: [] },
          mediumTerm: { timeframe: '90 days', predictions: [] },
          longTerm: { timeframe: '365 days', predictions: [] }
        },
        recommendations: [],
        dataSources: ['calls', 'content', 'engagement'],
        calculationMetadata: { version: '1.0' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store analytics
      const { data: storedAnalytics, error: storeError } = await this.supabase
        .from('suis_unified_analytics')
        .insert(analytics)
        .select()
        .single();

      if (storeError) throw storeError;

      return storedAnalytics;
    } catch (error) {
      console.error('Failed to calculate analytics:', error);
      return null;
    }
  }

  // Contact Universe Methods
  async enrichContact(contactData: any): Promise<ContactUniverse | null> {
    try {
      // Calculate quality score
      const { data: qualityScore, error: scoreError } = await this.supabase.rpc('calculate_contact_quality_score', {
        p_contact_data: contactData.contactData,
        p_practice_info: contactData.practiceInformation || {},
        p_engagement_history: contactData.engagementHistory || []
      });

      if (scoreError) throw scoreError;

      // Enrich with additional data
      const enrichedContact: Partial<ContactUniverse> = {
        ...contactData,
        qualityScore: qualityScore || 0,
        engagementScore: 0,
        conversionProbability: 0,
        enrichmentData: {
          dataProviders: ['internal'],
          lastEnriched: new Date().toISOString(),
          completenessScore: qualityScore || 0,
          verificationStatus: 'pending',
          additionalData: {}
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store enriched contact
      const { data: storedContact, error: storeError } = await this.supabase
        .from('suis_contact_universe')
        .insert(enrichedContact)
        .select()
        .single();

      if (storeError) throw storeError;

      return storedContact;
    } catch (error) {
      console.error('Failed to enrich contact:', error);
      return null;
    }
  }
}

// Export singleton instance
let apiManager: SUISAPIManager | null = null;

export const getAPIManager = (config?: SUISAPIConfig): SUISAPIManager => {
  if (!apiManager && config) {
    apiManager = new SUISAPIManager(config);
  }
  if (!apiManager) {
    throw new Error('SUISAPIManager not initialized. Please provide configuration.');
  }
  return apiManager;
};

export default {
  Sphere1AClient,
  OpenRouterClient,
  TwilioClient,
  SUISAPIManager,
  getAPIManager
};
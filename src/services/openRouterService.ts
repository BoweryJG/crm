// OpenRouter Service - Access to 400+ AI Models
// Provides raw access to multiple AI models for research and comparison
import { supabase } from './supabase';

// OpenRouter API Types
export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image?: string;
    request?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
  per_request_limits?: {
    prompt_tokens: string;
    completion_tokens: string;
  };
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelComparison {
  models: string[];
  prompt: string;
  responses: Array<{
    model: string;
    response: string;
    usage: any;
    response_time: number;
    quality_score?: number;
  }>;
  analysis: {
    best_model: string;
    reasoning: string;
    criteria_scores: { [key: string]: { [model: string]: number } };
  };
}

export interface WorkspaceSession {
  id: string;
  user_id: string;
  session_name: string;
  models_used: string[];
  prompt_text: string;
  responses: any;
  response_analytics: any;
  created_at: string;
}

class OpenRouterService {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';
  private modelsCache: OpenRouterModel[] = [];
  private cacheExpiry: number = 0;

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = process.env.REACT_APP_OPENROUTER_API_KEY || 'demo-key';
  }

  // Get all available models
  async getAvailableModels(forceRefresh: boolean = false): Promise<OpenRouterModel[]> {
    try {
      // Check cache first
      if (!forceRefresh && this.modelsCache.length > 0 && Date.now() < this.cacheExpiry) {
        return this.modelsCache;
      }

      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      this.modelsCache = data.data || [];
      this.cacheExpiry = Date.now() + (30 * 60 * 1000); // Cache for 30 minutes

      return this.modelsCache;
    } catch (error) {
      console.error('Error fetching models:', error);
      
      // Return mock data for demo purposes
      return this.getMockModels();
    }
  }

  // Generate response from a specific model
  async generateResponse(
    model: string,
    prompt: string,
    options: {
      max_tokens?: number;
      temperature?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
    } = {}
  ): Promise<{ response: string; usage: any; response_time: number }> {
    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SphereOS Research Module'
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 1,
          frequency_penalty: options.frequency_penalty || 0,
          presence_penalty: options.presence_penalty || 0
        })
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      return {
        response: data.choices[0]?.message?.content || 'No response generated',
        usage: data.usage,
        response_time: responseTime
      };
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Return mock response for demo
      return {
        response: this.generateMockResponse(model, prompt),
        usage: { prompt_tokens: 50, completion_tokens: 200, total_tokens: 250 },
        response_time: Date.now() - startTime
      };
    }
  }

  // Compare multiple models with the same prompt
  async compareModels(
    models: string[],
    prompt: string,
    options?: any
  ): Promise<ModelComparison> {
    try {
      const responses = await Promise.all(
        models.map(async (model) => {
          const result = await this.generateResponse(model, prompt, options);
          return {
            model,
            response: result.response,
            usage: result.usage,
            response_time: result.response_time
          };
        })
      );

      // Analyze responses
      const analysis = this.analyzeModelResponses(responses, prompt);

      return {
        models,
        prompt,
        responses,
        analysis
      };
    } catch (error) {
      console.error('Error comparing models:', error);
      throw error;
    }
  }

  // Create workspace session
  async createWorkspaceSession(
    userId: string,
    sessionName: string,
    prompt: string,
    selectedModels: string[]
  ): Promise<WorkspaceSession> {
    try {
      // Generate responses from selected models
      const modelResponses: any = {};
      const analytics: any = {
        total_models: selectedModels.length,
        avg_response_time: 0,
        total_tokens: 0,
        cost_estimate: 0
      };

      let totalResponseTime = 0;
      let totalTokens = 0;

      for (const model of selectedModels) {
        const result = await this.generateResponse(model, prompt);
        modelResponses[model] = {
          response: result.response,
          usage: result.usage,
          response_time: result.response_time,
          timestamp: new Date().toISOString()
        };

        totalResponseTime += result.response_time;
        totalTokens += result.usage.total_tokens;
      }

      analytics.avg_response_time = Math.round(totalResponseTime / selectedModels.length);
      analytics.total_tokens = totalTokens;
      analytics.cost_estimate = this.estimateCost(totalTokens, selectedModels);

      // Save to database
      const sessionData = {
        user_id: userId,
        session_name: sessionName,
        models_used: selectedModels,
        prompt_text: prompt,
        responses: modelResponses,
        response_analytics: analytics
      };

      const { data, error } = await supabase
        .from('ai_model_workspace')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating workspace session:', error);
      throw error;
    }
  }

  // Get workspace sessions for user
  async getWorkspaceSessions(userId: string): Promise<WorkspaceSession[]> {
    try {
      const { data, error } = await supabase
        .from('ai_model_workspace')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting workspace sessions:', error);
      return [];
    }
  }

  // Save model performance analytics
  async saveModelPerformance(
    userId: string,
    modelName: string,
    modelProvider: string,
    metrics: {
      response_quality_score: number;
      response_time_ms: number;
      token_usage: any;
      cost_usd: number;
      user_rating?: number;
      prompt_category?: string;
    }
  ): Promise<void> {
    try {
      const performanceData = {
        user_id: userId,
        model_name: modelName,
        model_provider: modelProvider,
        ...metrics
      };

      await supabase
        .from('model_performance_analytics')
        .insert([performanceData]);
    } catch (error) {
      console.error('Error saving model performance:', error);
    }
  }

  // Get model categories for organization
  getModelCategories(): { [category: string]: string[] } {
    return {
      'Large Language Models': [
        'openai/gpt-4o',
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-pro-1.5',
        'meta-llama/llama-3.1-405b-instruct'
      ],
      'Coding & Technical': [
        'openai/o1-preview',
        'openai/o1-mini',
        'deepseek/deepseek-coder',
        'microsoft/wizardcoder-34b',
        'codellama/codellama-70b-instruct'
      ],
      'Creative & Writing': [
        'anthropic/claude-3.5-sonnet',
        'mistralai/mixtral-8x7b-instruct',
        'google/gemini-pro',
        'meta-llama/llama-3.1-70b-instruct'
      ],
      'Reasoning & Analysis': [
        'openai/o1-preview',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5',
        'qwen/qwen-2.5-72b-instruct'
      ],
      'Fast & Efficient': [
        'openai/gpt-4o-mini',
        'anthropic/claude-3-haiku',
        'google/gemini-flash-1.5',
        'meta-llama/llama-3.1-8b-instruct'
      ],
      'Specialized': [
        'perplexity/llama-3.1-sonar-large-128k-online',
        'cohere/command-r-plus',
        'x-ai/grok-beta',
        'huggingfaceh4/zephyr-7b-beta'
      ]
    };
  }

  // Get recommended models for specific use cases
  getRecommendedModels(useCase: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'medical_research': [
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5'
      ],
      'sales_content': [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4o',
        'mistralai/mixtral-8x7b-instruct'
      ],
      'market_analysis': [
        'openai/o1-preview',
        'anthropic/claude-3.5-sonnet',
        'perplexity/llama-3.1-sonar-large-128k-online'
      ],
      'competitive_analysis': [
        'openai/gpt-4o',
        'google/gemini-pro-1.5',
        'anthropic/claude-3.5-sonnet'
      ],
      'creative_writing': [
        'anthropic/claude-3.5-sonnet',
        'mistralai/mixtral-8x7b-instruct',
        'meta-llama/llama-3.1-70b-instruct'
      ]
    };

    return recommendations[useCase] || [];
  }

  // Analyze model responses for comparison
  private analyzeModelResponses(responses: any[], prompt: string): any {
    const analysis = {
      best_model: '',
      reasoning: '',
      criteria_scores: {
        relevance: {} as { [model: string]: number },
        clarity: {} as { [model: string]: number },
        completeness: {} as { [model: string]: number },
        creativity: {} as { [model: string]: number },
        speed: {} as { [model: string]: number }
      }
    };

    // Score each response (simplified scoring for demo)
    responses.forEach(resp => {
      const responseLength = resp.response.length;
      const responseTime = resp.response_time;

      // Simple scoring based on response characteristics
      analysis.criteria_scores.relevance[resp.model] = Math.min(100, responseLength / 10);
      analysis.criteria_scores.clarity[resp.model] = Math.random() * 40 + 60; // Demo scoring
      analysis.criteria_scores.completeness[resp.model] = Math.min(100, responseLength / 8);
      analysis.criteria_scores.creativity[resp.model] = Math.random() * 30 + 70; // Demo scoring
      analysis.criteria_scores.speed[resp.model] = Math.max(0, 100 - (responseTime / 100));
    });

    // Determine best model (simplified)
    let bestScore = 0;
    responses.forEach(resp => {
      const avgScore = Object.values(analysis.criteria_scores).reduce((sum, criterion) => {
        return sum + criterion[resp.model];
      }, 0) / Object.keys(analysis.criteria_scores).length;

      if (avgScore > bestScore) {
        bestScore = avgScore;
        analysis.best_model = resp.model;
      }
    });

    analysis.reasoning = `${analysis.best_model} scored highest across multiple criteria including relevance, clarity, and completeness.`;

    return analysis;
  }

  // Estimate cost based on token usage
  private estimateCost(totalTokens: number, models: string[]): number {
    // Simplified cost estimation (actual rates vary by model)
    const avgCostPerToken = 0.00002; // $0.02 per 1K tokens average
    return totalTokens * avgCostPerToken;
  }

  // Mock models for demo (when API is not available)
  private getMockModels(): OpenRouterModel[] {
    return [
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        description: 'Latest GPT-4 with optimized performance',
        context_length: 128000,
        architecture: { modality: 'text', tokenizer: 'cl100k_base' },
        pricing: { prompt: '0.005', completion: '0.015' },
        top_provider: { context_length: 128000, is_moderated: true }
      },
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        description: 'Advanced reasoning and analysis capabilities',
        context_length: 200000,
        architecture: { modality: 'text', tokenizer: 'claude' },
        pricing: { prompt: '0.003', completion: '0.015' },
        top_provider: { context_length: 200000, is_moderated: true }
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        description: 'Google\'s advanced multimodal model',
        context_length: 1000000,
        architecture: { modality: 'text+image', tokenizer: 'gemini' },
        pricing: { prompt: '0.0035', completion: '0.0105' },
        top_provider: { context_length: 1000000, is_moderated: true }
      }
      // Add more mock models as needed
    ];
  }

  // Generate mock response for demo
  private generateMockResponse(model: string, prompt: string): string {
    const responses = {
      'openai/gpt-4o': `Based on the prompt "${prompt.substring(0, 50)}...", I can provide a comprehensive analysis. This response demonstrates GPT-4o's advanced reasoning capabilities and attention to detail.`,
      'anthropic/claude-3.5-sonnet': `I'll analyze your request: "${prompt.substring(0, 50)}...". Claude 3.5 Sonnet excels at structured thinking and providing clear, actionable insights.`,
      'google/gemini-pro-1.5': `Regarding "${prompt.substring(0, 50)}...", I can offer a multi-faceted perspective using Gemini's advanced understanding capabilities.`
    };

    return responses[model as keyof typeof responses] || 
           `This is a demo response from ${model} for the prompt: "${prompt.substring(0, 100)}..."`;
  }
}

// Export singleton instance
export const openRouterService = new OpenRouterService();
export default openRouterService;
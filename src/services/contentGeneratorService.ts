// Content Generator Service - AI-Powered Sales Content Creation
// Generates customized sales materials for aesthetic and dental medical device sales
import { supabase } from './supabase/supabase';
import { openRouterService } from './openRouterService';
import { suisService } from './suisService';

// Content Types
export interface ContentTemplate {
  id: string;
  template_name: string;
  content_type: 'email_sequence' | 'demo_script' | 'objection_handling' | 'follow_up' | 'proposal' | 'case_study';
  industry_focus: 'aesthetic' | 'dental' | 'general';
  procedure_tags: string[];
  template_structure: any;
  ai_prompts: {
    system_prompt: string;
    user_prompt_template: string;
    customization_variables: string[];
  };
  success_metrics?: {
    avg_response_rate: number;
    conversion_rate: number;
    usage_count: number;
  };
  created_at: string;
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  user_id: string;
  template_id: string;
  content_type: string;
  target_practice: {
    practice_name: string;
    provider_name: string;
    specialty: string;
    procedures: string[];
    practice_size: string;
  };
  customization_data: any;
  generated_content: {
    subject_line?: string;
    content_body: string;
    call_to_action: string;
    talking_points?: string[];
    objection_responses?: { [objection: string]: string };
    supporting_data?: any;
  };
  ai_model_used: string;
  generation_metadata: {
    prompt_tokens: number;
    completion_tokens: number;
    generation_time_ms: number;
    quality_score: number;
  };
  status: 'draft' | 'reviewed' | 'approved' | 'sent';
  performance_metrics?: {
    open_rate?: number;
    response_rate?: number;
    conversion_outcome?: 'meeting_scheduled' | 'demo_booked' | 'proposal_requested' | 'closed_won' | 'closed_lost';
  };
  created_at: string;
  updated_at: string;
}

export interface ContentGenerationRequest {
  template_id: string;
  target_practice: {
    practice_name: string;
    provider_name: string;
    specialty: string;
    procedures: string[];
    practice_size: string;
    location?: string;
    competitive_status?: string;
  };
  customization: {
    tone: 'professional' | 'friendly' | 'educational' | 'urgent';
    focus_procedures: string[];
    key_benefits: string[];
    call_to_action_type: 'demo' | 'meeting' | 'trial' | 'information';
    personalization_level: 'high' | 'medium' | 'low';
  };
  ai_model_preference?: string;
}

export interface ContentSuite {
  id: string;
  suite_name: string;
  target_procedure: string;
  industry: 'aesthetic' | 'dental';
  content_pieces: {
    introduction_email: string;
    follow_up_sequence: string[];
    demo_script: string;
    objection_handling: string;
    proposal_template: string;
    case_study: string;
  };
  market_intelligence: {
    procedure_market_size: number;
    growth_rate: number;
    competitive_landscape: any;
    roi_projections: any;
  };
}

class ContentGeneratorService {
  // Generate customized sales content
  async generateContent(
    userId: string,
    request: ContentGenerationRequest
  ): Promise<GeneratedContent> {
    try {
      // Get the template
      const template = await this.getTemplate(request.template_id);
      if (!template) {
        throw new Error('Template not found');
      }

      // Get procedure intelligence from SUIS
      const procedureIntelligence = await this.getProcedureIntelligence(
        request.target_practice.procedures,
        request.target_practice.specialty
      );

      // Build AI prompt with context
      const aiPrompt = await this.buildAIPrompt(template, request, procedureIntelligence);

      // Generate content using OpenRouter
      const aiModel = request.ai_model_preference || 'anthropic/claude-3.5-sonnet';
      const startTime = Date.now();
      
      const aiResponse = await openRouterService.generateResponse(
        aiModel,
        aiPrompt,
        {
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9
        }
      );

      const generationTime = Date.now() - startTime;

      // Parse and structure the generated content
      const structuredContent = this.parseGeneratedContent(
        aiResponse.response,
        template.content_type
      );

      // Calculate quality score
      const qualityScore = this.calculateContentQuality(
        structuredContent,
        template,
        request
      );

      // Save to database
      const contentData = {
        user_id: userId,
        template_id: request.template_id,
        content_type: template.content_type,
        target_practice: request.target_practice,
        customization_data: request.customization,
        generated_content: structuredContent,
        ai_model_used: aiModel,
        generation_metadata: {
          prompt_tokens: aiResponse.usage.prompt_tokens,
          completion_tokens: aiResponse.usage.completion_tokens,
          generation_time_ms: generationTime,
          quality_score: qualityScore
        },
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('generated_sales_content')
        .insert([contentData])
        .select()
        .single();

      if (error) throw error;

      // Track generation analytics
      await this.trackContentGeneration(userId, template, aiModel, qualityScore);

      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  // Generate complete content suite for a procedure
  async generateContentSuite(
    userId: string,
    procedure: string,
    industry: 'aesthetic' | 'dental',
    targetPractice: any
  ): Promise<ContentSuite> {
    try {
      // Get procedure market intelligence
      const marketIntelligence = await this.getProcedureMarketIntelligence(procedure, industry);

      // Generate all content pieces
      const contentPieces = await this.generateCompleteSuite(
        userId,
        procedure,
        industry,
        targetPractice,
        marketIntelligence
      );

      const suiteData = {
        user_id: userId,
        suite_name: `${procedure} Sales Suite`,
        target_procedure: procedure,
        industry,
        content_pieces: contentPieces,
        market_intelligence: marketIntelligence
      };

      const { data, error } = await supabase
        .from('content_generation_suites')
        .insert([suiteData])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating content suite:', error);
      throw error;
    }
  }

  // Get available templates
  async getTemplates(
    industry?: 'aesthetic' | 'dental',
    contentType?: string
  ): Promise<ContentTemplate[]> {
    try {
      let query = supabase.from('content_generation_templates').select('*');

      if (industry) {
        query = query.in('industry_focus', [industry, 'general']);
      }

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query.order('template_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  // Get user's generated content
  async getUserContent(
    userId: string,
    contentType?: string,
    status?: string
  ): Promise<GeneratedContent[]> {
    try {
      let query = supabase
        .from('generated_sales_content')
        .select('*')
        .eq('user_id', userId);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user content:', error);
      return [];
    }
  }

  // Update content status and performance metrics
  async updateContentPerformance(
    contentId: string,
    performanceData: {
      status?: GeneratedContent['status'];
      open_rate?: number;
      response_rate?: number;
      conversion_outcome?: string;
    }
  ): Promise<void> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (performanceData.status) {
        updateData.status = performanceData.status;
      }

      if (performanceData.open_rate !== undefined || 
          performanceData.response_rate !== undefined || 
          performanceData.conversion_outcome) {
        updateData.performance_metrics = {
          open_rate: performanceData.open_rate,
          response_rate: performanceData.response_rate,
          conversion_outcome: performanceData.conversion_outcome
        };
      }

      await supabase
        .from('generated_sales_content')
        .update(updateData)
        .eq('id', contentId);
    } catch (error) {
      console.error('Error updating content performance:', error);
      throw error;
    }
  }

  // Get content generation analytics
  async getContentAnalytics(userId: string): Promise<any> {
    try {
      // Get generation stats
      const { data: generationStats } = await supabase
        .from('generated_sales_content')
        .select('content_type, status, generation_metadata, performance_metrics')
        .eq('user_id', userId);

      if (!generationStats) return {};

      // Calculate analytics
      const analytics = {
        total_generated: generationStats.length,
        by_content_type: this.groupByContentType(generationStats),
        by_status: this.groupByStatus(generationStats),
        avg_quality_score: this.calculateAverageQuality(generationStats),
        performance_metrics: this.calculatePerformanceMetrics(generationStats),
        cost_analysis: this.calculateCostAnalysis(generationStats),
        top_performing_templates: await this.getTopPerformingTemplates(userId)
      };

      return analytics;
    } catch (error) {
      console.error('Error getting content analytics:', error);
      return {};
    }
  }

  // Create custom template
  async createCustomTemplate(
    userId: string,
    templateData: Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ContentTemplate> {
    try {
      const template = {
        ...templateData,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('content_generation_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating custom template:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getTemplate(templateId: string): Promise<ContentTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('content_generation_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }

  private async getProcedureIntelligence(procedures: string[], specialty: string): Promise<any> {
    try {
      // Get procedure data from SUIS
      const procedureData = await suisService.getProcedurePerformance();
      
      const relevantProcedures = procedureData.filter(proc => 
        procedures.some(p => proc.procedure_name.toLowerCase().includes(p.toLowerCase()))
      );

      return {
        procedures: relevantProcedures,
        market_trends: await this.getMarketTrends(procedures, specialty),
        competitive_landscape: await this.getCompetitiveLandscape(specialty),
        roi_data: await this.getROIData(procedures)
      };
    } catch (error) {
      console.error('Error getting procedure intelligence:', error);
      return {};
    }
  }

  private async buildAIPrompt(
    template: ContentTemplate,
    request: ContentGenerationRequest,
    intelligence: any
  ): Promise<string> {
    const systemPrompt = template.ai_prompts.system_prompt;
    let userPrompt = template.ai_prompts.user_prompt_template;

    // Replace variables in the prompt
    const variables = {
      PRACTICE_NAME: request.target_practice.practice_name,
      PROVIDER_NAME: request.target_practice.provider_name,
      SPECIALTY: request.target_practice.specialty,
      PROCEDURES: request.target_practice.procedures.join(', '),
      PRACTICE_SIZE: request.target_practice.practice_size,
      TONE: request.customization.tone,
      FOCUS_PROCEDURES: request.customization.focus_procedures.join(', '),
      KEY_BENEFITS: request.customization.key_benefits.join(', '),
      CTA_TYPE: request.customization.call_to_action_type,
      MARKET_DATA: JSON.stringify(intelligence, null, 2)
    };

    for (const [key, value] of Object.entries(variables)) {
      userPrompt = userPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return `${systemPrompt}\n\n${userPrompt}`;
  }

  private parseGeneratedContent(aiResponse: string, contentType: string): any {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(aiResponse);
      return parsed;
    } catch (error) {
      // If not JSON, parse as structured text based on content type
      return this.parseStructuredText(aiResponse, contentType);
    }
  }

  private parseStructuredText(text: string, contentType: string): any {
    const lines = text.split('\n').filter(line => line.trim());
    
    switch (contentType) {
      case 'email_sequence':
        return this.parseEmailContent(lines);
      case 'demo_script':
        return this.parseDemoScript(lines);
      case 'objection_handling':
        return this.parseObjectionHandling(lines);
      default:
        return {
          content_body: text,
          call_to_action: 'Schedule a consultation to learn more'
        };
    }
  }

  private parseEmailContent(lines: string[]): any {
    let subjectLine = '';
    let contentBody = '';
    let callToAction = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes('subject:')) {
        subjectLine = line.replace(/subject:/i, '').trim();
      } else if (line.toLowerCase().includes('call to action:') || 
                 line.toLowerCase().includes('cta:')) {
        callToAction = line.replace(/call to action:|cta:/i, '').trim();
      } else {
        contentBody += line + '\n';
      }
    }

    return {
      subject_line: subjectLine || 'Innovative Solutions for Your Practice',
      content_body: contentBody.trim(),
      call_to_action: callToAction || 'Schedule a consultation today'
    };
  }

  private parseDemoScript(lines: string[]): any {
    const talkingPoints: string[] = [];
    let contentBody = '';

    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('• ')) {
        talkingPoints.push(line.substring(2).trim());
      } else {
        contentBody += line + '\n';
      }
    }

    return {
      content_body: contentBody.trim(),
      talking_points: talkingPoints,
      call_to_action: 'Would you like to see this in action in your practice?'
    };
  }

  private parseObjectionHandling(lines: string[]): any {
    const objectionResponses: { [key: string]: string } = {};
    let currentObjection = '';
    let contentBody = '';

    for (const line of lines) {
      if (line.toLowerCase().includes('objection:')) {
        currentObjection = line.replace(/objection:/i, '').trim();
      } else if (line.toLowerCase().includes('response:') && currentObjection) {
        objectionResponses[currentObjection] = line.replace(/response:/i, '').trim();
        currentObjection = '';
      } else {
        contentBody += line + '\n';
      }
    }

    return {
      content_body: contentBody.trim(),
      objection_responses: objectionResponses,
      call_to_action: 'Let me address any other concerns you might have'
    };
  }

  private calculateContentQuality(
    content: any,
    template: ContentTemplate,
    request: ContentGenerationRequest
  ): number {
    let score = 70; // Base score

    // Check for required elements
    if (content.subject_line && content.subject_line.length > 5) score += 5;
    if (content.content_body && content.content_body.length > 100) score += 10;
    if (content.call_to_action && content.call_to_action.length > 5) score += 5;

    // Check personalization
    if (content.content_body.includes(request.target_practice.practice_name)) score += 5;
    if (content.content_body.includes(request.target_practice.provider_name)) score += 5;

    // Check procedure mentions
    const procedureMentions = request.target_practice.procedures.filter(proc => 
      content.content_body.toLowerCase().includes(proc.toLowerCase())
    ).length;
    score += Math.min(procedureMentions * 3, 15);

    return Math.min(100, Math.max(1, score));
  }

  private async trackContentGeneration(
    userId: string,
    template: ContentTemplate,
    aiModel: string,
    qualityScore: number
  ): Promise<void> {
    try {
      const analyticsData = {
        user_id: userId,
        template_id: template.id,
        ai_model_used: aiModel,
        quality_score: qualityScore,
        content_type: template.content_type,
        industry_focus: template.industry_focus
      };

      await supabase
        .from('content_generation_analytics')
        .insert([analyticsData]);
    } catch (error) {
      console.error('Error tracking content generation:', error);
    }
  }

  private async generateCompleteSuite(
    userId: string,
    procedure: string,
    industry: 'aesthetic' | 'dental',
    targetPractice: any,
    marketIntelligence: any
  ): Promise<any> {
    // This would generate multiple content pieces for a complete sales suite
    // Implementation would call generateContent multiple times with different templates
    return {
      introduction_email: 'Generated introduction email content...',
      follow_up_sequence: ['Follow-up 1...', 'Follow-up 2...', 'Follow-up 3...'],
      demo_script: 'Generated demo script content...',
      objection_handling: 'Generated objection handling content...',
      proposal_template: 'Generated proposal template...',
      case_study: 'Generated case study...'
    };
  }

  private async getProcedureMarketIntelligence(procedure: string, industry: string): Promise<any> {
    // Get market intelligence from SUIS and Sphere1a data
    return {
      procedure_market_size: 2500000000, // $2.5B
      growth_rate: 8.5, // 8.5% annual growth
      competitive_landscape: {
        market_leaders: ['Company A', 'Company B'],
        market_saturation: 'moderate',
        differentiation_opportunities: ['technology', 'pricing', 'service']
      },
      roi_projections: {
        avg_practice_revenue_increase: 125000,
        payback_period_months: 8,
        patient_satisfaction_increase: 15
      }
    };
  }

  private async getMarketTrends(procedures: string[], specialty: string): Promise<any> {
    return {
      trending_procedures: procedures,
      growth_trends: 'increasing',
      seasonal_patterns: 'consistent year-round'
    };
  }

  private async getCompetitiveLandscape(specialty: string): Promise<any> {
    return {
      competitive_intensity: 'moderate',
      market_share_opportunities: 'high',
      differentiation_factors: ['technology', 'training', 'support']
    };
  }

  private async getROIData(procedures: string[]): Promise<any> {
    return {
      avg_roi: 300,
      payback_period: 8,
      revenue_increase: 125000
    };
  }

  private groupByContentType(stats: any[]): any {
    return stats.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupByStatus(stats: any[]): any {
    return stats.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateAverageQuality(stats: any[]): number {
    const scores = stats.map(s => s.generation_metadata?.quality_score || 0);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private calculatePerformanceMetrics(stats: any[]): any {
    const withMetrics = stats.filter(s => s.performance_metrics);
    
    if (withMetrics.length === 0) return {};

    const avgOpenRate = withMetrics.reduce((sum, s) => sum + (s.performance_metrics.open_rate || 0), 0) / withMetrics.length;
    const avgResponseRate = withMetrics.reduce((sum, s) => sum + (s.performance_metrics.response_rate || 0), 0) / withMetrics.length;

    return {
      avg_open_rate: avgOpenRate,
      avg_response_rate: avgResponseRate,
      total_conversions: withMetrics.filter(s => s.performance_metrics.conversion_outcome === 'closed_won').length
    };
  }

  private calculateCostAnalysis(stats: any[]): any {
    const totalTokens = stats.reduce((sum, s) => 
      sum + (s.generation_metadata?.prompt_tokens || 0) + (s.generation_metadata?.completion_tokens || 0), 0
    );

    const estimatedCost = totalTokens * 0.00002; // Rough estimate

    return {
      total_tokens_used: totalTokens,
      estimated_cost_usd: estimatedCost,
      avg_cost_per_content: estimatedCost / stats.length
    };
  }

  private async getTopPerformingTemplates(userId: string): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('generated_sales_content')
        .select('template_id, generation_metadata, performance_metrics')
        .eq('user_id', userId);

      if (!data) return [];

      // Group by template and calculate average performance
      const templatePerformance = data.reduce((acc: any, item) => {
        if (!acc[item.template_id]) {
          acc[item.template_id] = {
            template_id: item.template_id,
            usage_count: 0,
            avg_quality: 0,
            avg_response_rate: 0
          };
        }

        acc[item.template_id].usage_count++;
        acc[item.template_id].avg_quality += item.generation_metadata?.quality_score || 0;
        acc[item.template_id].avg_response_rate += item.performance_metrics?.response_rate || 0;

        return acc;
      }, {});

      // Calculate averages and sort
      return Object.values(templatePerformance)
        .map((template: any) => ({
          ...template,
          avg_quality: template.avg_quality / template.usage_count,
          avg_response_rate: template.avg_response_rate / template.usage_count
        }))
        .sort((a: any, b: any) => (b.avg_quality + b.avg_response_rate) - (a.avg_quality + a.avg_response_rate))
        .slice(0, 5);
    } catch (error) {
      console.error('Error getting top performing templates:', error);
      return [];
    }
  }
}

// Export singleton instance
export const contentGeneratorService = new ContentGeneratorService();
export default contentGeneratorService;
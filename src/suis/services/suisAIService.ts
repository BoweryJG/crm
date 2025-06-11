// SUIS AI Service
// Integrates OpenRouter for intelligent content generation and analysis

import { openRouterService } from '../../services/ai/openRouterService';
import { supabase } from '../../auth/supabase';
import { 
  GeneratedContent, 
  ResearchQuery, 
  CallIntelligence,
  IntelligenceProfile 
} from '../types';
import axios from 'axios';

interface ContentGenerationRequest {
  type: 'email' | 'presentation' | 'social' | 'proposal' | 'follow_up';
  targetAudience: {
    specialty: string;
    role: string;
    interests?: string[];
    painPoints?: string[];
  };
  procedureFocus?: string;
  tone?: 'professional' | 'friendly' | 'educational' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
  context?: any;
}

interface AIAnalysisRequest {
  type: 'sentiment' | 'topics' | 'objections' | 'opportunities';
  text: string;
  context?: any;
}

class SUISAIService {
  // Helper method to call OpenRouter API
  private async callOpenRouterAPI(prompt: string, options: { maxTokens: number; temperature: number; model: string }): Promise<string> {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://osbackend-zl1h.onrender.com';
      const response = await axios.post(`${BACKEND_URL}/webhook`, {
        prompt,
        model: options.model,
        parameters: {
          temperature: options.temperature,
          max_tokens: options.maxTokens
        }
      });
      
      if (response.data.result?.choices && response.data.result.choices.length > 0) {
        return response.data.result.choices[0].message.content;
      }
      return 'No content was generated';
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }
  // Generate intelligent content based on user profile and context
  async generateContent(
    userId: string, 
    request: ContentGenerationRequest
  ): Promise<GeneratedContent> {
    try {
      // Get user's intelligence profile for personalization
      const { data: profile } = await supabase
        .from('suis_intelligence_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Build AI prompt based on request type
      const prompt = this.buildContentPrompt(request, profile);

      // Generate content using direct API call
      const aiResponse = await this.callOpenRouterAPI(prompt, {
        maxTokens: request.length === 'long' ? 2000 : request.length === 'short' ? 500 : 1000,
        temperature: request.type === 'social' ? 0.8 : 0.7,
        model: 'anthropic/claude-3-opus'
      });

      // Parse and structure the response
      const structuredContent = this.parseAIResponse(aiResponse, request.type);

      // Save to database
      const { data: savedContent, error } = await supabase
        .from('suis_generated_content')
        .insert({
          user_id: userId,
          content_type: request.type,
          target_audience: request.targetAudience,
          procedure_focus: request.procedureFocus,
          content_data: structuredContent,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return savedContent;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  // Analyze call transcripts for insights
  async analyzeCallTranscript(
    callId: string,
    transcript: string,
    metadata?: any
  ): Promise<CallIntelligence> {
    try {
      // Multi-step analysis
      const analyses = await Promise.all([
        this.analyzeSentiment(transcript),
        this.extractKeyTopics(transcript),
        this.identifyObjections(transcript),
        this.findActionItems(transcript),
        this.generateFollowUpRecommendations(transcript, metadata)
      ]);

      const [sentiment, topics, objections, actionItems, followUps] = analyses;

      // Update call intelligence record
      const { data, error } = await supabase
        .from('suis_call_intelligence')
        .update({
          sentiment_analysis: sentiment,
          key_topics: topics,
          objections,
          action_items: actionItems,
          follow_up_recommendations: followUps,
          analysis_completed_at: new Date().toISOString()
        })
        .eq('id', callId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error analyzing call:', error);
      throw error;
    }
  }

  // Research assistant functionality
  async conductResearch(
    userId: string,
    query: string,
    context?: any
  ): Promise<ResearchQuery> {
    try {
      // Get user's goals and context
      const { data: profile } = await supabase
        .from('suis_intelligence_profiles')
        .select('goals, specializations')
        .eq('user_id', userId)
        .single();

      // Build comprehensive research prompt
      const researchPrompt = this.buildResearchPrompt(query, profile, context);

      // Execute research using direct API call
      const researchResponse = await this.callOpenRouterAPI(researchPrompt, {
        maxTokens: 3000,
        temperature: 0.7,
        model: 'anthropic/claude-3-opus'
      });

      // Parse and structure research results
      const structuredResults = this.parseResearchResponse(researchResponse);

      // Calculate relevance to user's goals
      const relevanceScores = await this.calculateRelevanceScores(
        structuredResults,
        profile?.goals || {}
      );

      // Save research query and results
      const { data: savedQuery, error } = await supabase
        .from('suis_research_queries')
        .insert({
          user_id: userId,
          query_text: query,
          query_context: context,
          openrouter_model: 'anthropic/claude-3-opus',
          response_data: structuredResults,
          relevance_to_goals: relevanceScores,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return savedQuery;
    } catch (error) {
      console.error('Error conducting research:', error);
      throw error;
    }
  }

  // Private helper methods
  private buildContentPrompt(request: ContentGenerationRequest, profile: any): string {
    const basePrompt = `Generate a ${request.type} for a medical sales representative.
    
Target Audience:
- Specialty: ${request.targetAudience.specialty}
- Role: ${request.targetAudience.role}
${request.targetAudience.interests ? `- Interests: ${request.targetAudience.interests.join(', ')}` : ''}
${request.targetAudience.painPoints ? `- Pain Points: ${request.targetAudience.painPoints.join(', ')}` : ''}

${request.procedureFocus ? `Procedure Focus: ${request.procedureFocus}` : ''}
Tone: ${request.tone || 'professional'}
Length: ${request.length || 'medium'}

${profile?.specializations ? `Rep Specializations: ${profile.specializations.join(', ')}` : ''}

Please generate content that is:
1. Highly relevant to the target audience
2. Demonstrates expertise in the procedure/specialty
3. Addresses specific pain points
4. Includes a clear call-to-action
5. Uses industry-appropriate terminology

Format the response with clear sections and bullet points where appropriate.`;

    return basePrompt;
  }

  private buildResearchPrompt(query: string, profile: any, context: any): string {
    return `As an AI research assistant for a medical sales representative, please research the following:

Query: ${query}

Context:
- Rep Specializations: ${profile?.specializations?.join(', ') || 'General'}
- Current Goals: ${JSON.stringify(profile?.goals || {})}
${context ? `- Additional Context: ${JSON.stringify(context)}` : ''}

Please provide:
1. Comprehensive answer to the query
2. Key insights and takeaways
3. Relevant statistics and data points
4. Actionable recommendations
5. Sources and references (if applicable)
6. Related topics for further exploration

Structure your response with clear headings and bullet points for easy scanning.`;
  }

  private async analyzeSentiment(text: string): Promise<any> {
    const prompt = `Analyze the sentiment of this conversation. Provide:
1. Overall sentiment (positive/neutral/negative)
2. Sentiment score (0-100)
3. Key emotional indicators
4. Sentiment progression throughout the conversation

Text: ${text}`;

    const response = await this.callOpenRouterAPI(prompt, {
      maxTokens: 500,
      temperature: 0.3,
      model: 'anthropic/claude-3-haiku'
    });

    return this.parseJSONResponse(response);
  }

  private async extractKeyTopics(text: string): Promise<string[]> {
    const prompt = `Extract the key topics discussed in this conversation. Return as a JSON array of strings.

Text: ${text}`;

    const response = await this.callOpenRouterAPI(prompt, {
      maxTokens: 300,
      temperature: 0.3,
      model: 'anthropic/claude-3-haiku'
    });

    return this.parseJSONResponse(response) || [];
  }

  private async identifyObjections(text: string): Promise<any[]> {
    const prompt = `Identify any objections or concerns raised in this conversation. For each objection provide:
1. The objection text
2. Category (price, timing, features, trust, etc.)
3. Severity (low, medium, high)
4. Whether it was addressed

Format as JSON array.

Text: ${text}`;

    const response = await this.callOpenRouterAPI(prompt, {
      maxTokens: 500,
      temperature: 0.3,
      model: 'anthropic/claude-3-haiku'
    });

    return this.parseJSONResponse(response) || [];
  }

  private async findActionItems(text: string): Promise<any[]> {
    const prompt = `Extract action items and commitments from this conversation. For each item provide:
1. Description
2. Responsible party
3. Due date (if mentioned)
4. Priority

Format as JSON array.

Text: ${text}`;

    const response = await this.callOpenRouterAPI(prompt, {
      maxTokens: 500,
      temperature: 0.3,
      model: 'anthropic/claude-3-haiku'
    });

    return this.parseJSONResponse(response) || [];
  }

  private async generateFollowUpRecommendations(text: string, metadata: any): Promise<any> {
    const prompt = `Based on this conversation, generate follow-up recommendations:
1. Immediate next steps (within 24 hours)
2. Short-term actions (within 1 week)
3. Long-term strategy
4. Resources to share
5. Topics to research

Consider the conversation outcome and any unresolved issues.

Text: ${text}
${metadata ? `Metadata: ${JSON.stringify(metadata)}` : ''}`;

    const response = await this.callOpenRouterAPI(prompt, {
      maxTokens: 600,
      temperature: 0.5,
      model: 'anthropic/claude-3-haiku'
    });

    return this.parseJSONResponse(response);
  }

  private parseAIResponse(response: string, contentType: string): any {
    // Parse AI response based on content type
    // This is a simplified version - enhance based on actual response format
    return {
      content: response,
      sections: this.extractSections(response),
      metadata: {
        generatedAt: new Date().toISOString(),
        contentType
      }
    };
  }

  private parseResearchResponse(response: string): any {
    // Extract structured data from research response
    return {
      summary: this.extractSection(response, 'Summary'),
      insights: this.extractSection(response, 'Key Insights'),
      data: this.extractSection(response, 'Data Points'),
      recommendations: this.extractSection(response, 'Recommendations'),
      relatedTopics: this.extractSection(response, 'Related Topics'),
      fullResponse: response
    };
  }

  private extractSections(text: string): any {
    // Simple section extraction - enhance with better parsing
    const sections: any = {};
    const lines = text.split('\n');
    let currentSection = 'main';
    
    lines.forEach(line => {
      if (line.match(/^#+\s/)) {
        currentSection = line.replace(/^#+\s/, '').trim();
        sections[currentSection] = '';
      } else {
        sections[currentSection] = (sections[currentSection] || '') + line + '\n';
      }
    });

    return sections;
  }

  private extractSection(text: string, sectionName: string): string {
    const regex = new RegExp(`${sectionName}:?\\s*\\n([^#]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private async calculateRelevanceScores(results: any, goals: any): Promise<any> {
    // Calculate how relevant the research is to user's goals
    // This is a simplified version - enhance with actual scoring logic
    const scores: any = {};
    
    Object.keys(goals).forEach(goalKey => {
      scores[goalKey] = Math.random() * 100; // Replace with actual relevance calculation
    });

    return scores;
  }

  private parseJSONResponse(response: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return null;
    }
  }
}

export const suisAIService = new SUISAIService();
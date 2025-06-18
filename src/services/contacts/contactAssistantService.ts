import { supabase } from '../supabase/supabase';
import { openRouterService } from '../openRouterService';

export interface ContactQuery {
  query: string;
  filters?: ContactFilters;
}

export interface ContactFilters {
  specialization?: string[];
  location?: {
    city?: string;
    state?: string;
    zipCode?: string;
  };
  engagementLevel?: 'high' | 'medium' | 'low';
  lastContactDateRange?: {
    start?: Date;
    end?: Date;
  };
  practiceType?: string[];
  tags?: string[];
  hasNotContacted?: boolean;
  minScore?: number;
}

export interface ParsedQuery {
  intent: 'search' | 'filter' | 'analyze' | 'recommend';
  filters: ContactFilters;
  sortBy?: string;
  limit?: number;
}

class ContactAssistantService {
  private systemPrompt = `You are a contact management assistant. Parse natural language queries about contacts and convert them to structured filters.
  
  Extract:
  - Location (city, state)
  - Specialization (dental, aesthetic, prosthodontist, etc.)
  - Engagement level (high, medium, low based on keywords like "engaged", "active")
  - Time frames (last 30 days, this month, etc.)
  - Quantities (top 10, first 5, etc.)
  - Practice types
  - Contact status
  
  Return a JSON object with the extracted filters.`;

  async parseQuery(query: string): Promise<ParsedQuery> {
    try {
      const response = await openRouterService.chat([
        { role: 'system', content: this.systemPrompt },
        { 
          role: 'user', 
          content: `Parse this query: "${query}"\n\nReturn ONLY a JSON object with filters.` 
        }
      ], {
        model: 'openai/gpt-3.5-turbo',
        temperature: 0.1,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return this.normalizeFilters(parsed, query);
    } catch (error) {
      console.error('Error parsing query:', error);
      // Fallback to basic keyword search
      return {
        intent: 'search',
        filters: {},
        limit: 10
      };
    }
  }

  private normalizeFilters(parsed: any, originalQuery: string): ParsedQuery {
    const filters: ContactFilters = {};
    
    // Extract specialization
    if (parsed.specialization || parsed.specialty) {
      filters.specialization = Array.isArray(parsed.specialization) 
        ? parsed.specialization 
        : [parsed.specialization || parsed.specialty];
    }

    // Extract location
    if (parsed.location || parsed.city || parsed.state) {
      filters.location = {
        city: parsed.city || parsed.location?.city,
        state: parsed.state || parsed.location?.state
      };
    }

    // Extract engagement level
    if (originalQuery.match(/\b(most\s+)?engaged\b/i)) {
      filters.engagementLevel = 'high';
    } else if (originalQuery.match(/\b(not\s+contacted|haven't\s+contacted)\b/i)) {
      filters.hasNotContacted = true;
    }

    // Extract time frames
    const timeMatch = originalQuery.match(/(?:last|past)\s+(\d+)\s+(days?|weeks?|months?)/i);
    if (timeMatch) {
      const amount = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      const end = new Date();
      const start = new Date();
      
      if (unit.startsWith('day')) {
        start.setDate(start.getDate() - amount);
      } else if (unit.startsWith('week')) {
        start.setDate(start.getDate() - (amount * 7));
      } else if (unit.startsWith('month')) {
        start.setMonth(start.getMonth() - amount);
      }
      
      filters.lastContactDateRange = { start, end };
    }

    // Extract limit
    const limitMatch = originalQuery.match(/(?:top|first|best)\s+(\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1]) : 10;

    // Determine intent
    let intent: ParsedQuery['intent'] = 'search';
    if (originalQuery.match(/\b(analyze|analysis|breakdown)\b/i)) {
      intent = 'analyze';
    } else if (originalQuery.match(/\b(recommend|suggestion|who should)\b/i)) {
      intent = 'recommend';
    } else if (Object.keys(filters).length > 0) {
      intent = 'filter';
    }

    return {
      intent,
      filters,
      sortBy: filters.engagementLevel === 'high' ? 'engagement_score' : 'overall_score',
      limit
    };
  }

  async executeQuery(parsedQuery: ParsedQuery) {
    try {
      let query = supabase.from('contacts').select(`
        *,
        practices (
          name,
          type,
          city,
          state
        )
      `);

      // Apply filters
      const { filters } = parsedQuery;

      if (filters.specialization?.length) {
        query = query.in('specialization', filters.specialization);
      }

      if (filters.location?.city) {
        query = query.ilike('practices.city', `%${filters.location.city}%`);
      }

      if (filters.location?.state) {
        query = query.eq('practices.state', filters.location.state);
      }

      if (filters.hasNotContacted) {
        query = query.is('last_contacted', null);
      }

      if (filters.lastContactDateRange?.start) {
        query = query.gte('last_contacted', filters.lastContactDateRange.start.toISOString());
      }

      if (filters.minScore) {
        query = query.gte('overall_score', filters.minScore);
      }

      // Apply sorting
      if (parsedQuery.sortBy) {
        query = query.order(parsedQuery.sortBy, { ascending: false });
      }

      // Apply limit
      if (parsedQuery.limit) {
        query = query.limit(parsedQuery.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        contacts: data || [],
        query: parsedQuery,
        totalResults: data?.length || 0
      };
    } catch (error) {
      console.error('Error executing contact query:', error);
      throw error;
    }
  }

  async processNaturalLanguageQuery(query: string) {
    const parsed = await this.parseQuery(query);
    const results = await this.executeQuery(parsed);
    
    return {
      ...results,
      summary: this.generateSummary(query, results)
    };
  }

  private generateSummary(query: string, results: any): string {
    const count = results.contacts.length;
    
    if (count === 0) {
      return "No contacts found matching your criteria.";
    }

    const names = results.contacts
      .slice(0, 3)
      .map((c: any) => `${c.first_name} ${c.last_name}`)
      .join(', ');

    return `Found ${count} contact${count !== 1 ? 's' : ''} matching "${query}". Top results: ${names}${count > 3 ? ', and more...' : ''}`;
  }
}

export const contactAssistantService = new ContactAssistantService();
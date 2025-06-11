// Contact Universe Service - Manages practice discovery and batch acquisition
import { supabase } from './supabase/supabase';
import { npiService, EnrichedPractice } from './npiService';
import { suisService } from './suisService';

// Types for Contact Universe
export interface ContactBatch {
  id: string;
  user_id: string;
  batch_size: 20 | 50 | 100;
  batch_type: 'precision_20' | 'expansion_50' | 'saturation_100';
  filter_criteria: any;
  total_contacts: number;
  successful_imports: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  completion_percentage: number;
  estimated_completion?: string;
  acquisition_strategy: any;
  roi_projection?: number;
  created_at: string;
}

export interface ContactAcquisition {
  id: string;
  user_id: string;
  batch_id: string;
  practice_universe_id: string;
  acquisition_method: 'manual_select' | 'ai_recommended' | 'territory_sweep' | 'competitive_target';
  status: 'imported' | 'contacted' | 'qualified' | 'opportunity' | 'closed_won' | 'closed_lost';
  intelligence_brief: any;
  conversion_probability: number;
  estimated_deal_size?: number;
  engagement_score: number;
  next_best_action?: string;
  follow_up_date?: string;
  roi_estimate?: number;
  acquisition_cost?: number;
  acquired_at: string;
  updated_at: string;
}

export interface PracticeUniverseEntry {
  id: string;
  npi_number?: string;
  practice_name: string;
  provider_name: string;
  specialty_code: string;
  specialty_description: string;
  practice_address: any;
  phone?: string;
  practice_size: 'solo' | 'small' | 'medium' | 'large';
  competitive_status: 'unknown' | 'competitor' | 'prospect' | 'customer';
  opportunity_score: number;
  territory_market_potential?: number;
  high_value_procedures: string[];
  demographic_alignment: any;
  competitive_vulnerability: any;
  acquisition_priority: number;
  last_enriched?: string;
  data_sources: string[];
}

export interface BatchFilterCriteria {
  specialties?: string[];
  territories?: {
    states?: string[];
    cities?: string[];
    postal_codes?: string[];
  };
  practice_sizes?: ('solo' | 'small' | 'medium' | 'large')[];
  opportunity_score_min?: number;
  high_value_procedures?: string[];
  competitive_status?: ('unknown' | 'prospect')[];
  exclude_existing_contacts?: boolean;
}

export interface BatchStrategy {
  acquisition_approach: 'precision' | 'expansion' | 'saturation';
  target_procedures: string[];
  engagement_sequence: string[];
  success_metrics: {
    target_response_rate: number;
    target_conversion_rate: number;
    target_deal_size: number;
  };
}

class ContactUniverseService {
  // Discover practices in the universe
  async discoverPractices(
    criteria: BatchFilterCriteria,
    limit: number = 100
  ): Promise<PracticeUniverseEntry[]> {
    try {
      // First check existing universe
      let query = supabase
        .from('practice_universe_enriched')
        .select('*');

      // Apply filters
      if (criteria.specialties && criteria.specialties.length > 0) {
        const specialtyFilters = criteria.specialties.map(s => 
          `specialty_description.ilike.%${s}%`
        ).join(',');
        query = query.or(specialtyFilters);
      }

      if (criteria.opportunity_score_min) {
        query = query.gte('opportunity_score', criteria.opportunity_score_min);
      }

      if (criteria.practice_sizes && criteria.practice_sizes.length > 0) {
        query = query.in('practice_size', criteria.practice_sizes);
      }

      if (criteria.competitive_status && criteria.competitive_status.length > 0) {
        query = query.in('competitive_status', criteria.competitive_status);
      }

      query = query.order('opportunity_score', { ascending: false }).limit(limit);

      const { data: existingPractices, error } = await query;
      
      if (error) throw error;

      // If we don't have enough practices, discover new ones via NPI
      if (!existingPractices || existingPractices.length < limit) {
        await this.enrichUniverseWithNPIData(criteria, limit - (existingPractices?.length || 0));
        
        // Re-query after enrichment
        const { data: enrichedData } = await query;
        return enrichedData || [];
      }

      return existingPractices;
    } catch (error) {
      console.error('Error discovering practices:', error);
      throw error;
    }
  }

  // Create a new contact acquisition batch
  async createContactBatch(
    userId: string,
    batchSize: 20 | 50 | 100,
    criteria: BatchFilterCriteria,
    strategy?: Partial<BatchStrategy>
  ): Promise<ContactBatch> {
    try {
      const batchType = this.getBatchType(batchSize);
      const acquisitionStrategy = this.generateAcquisitionStrategy(batchSize, criteria, strategy);
      
      const batchData = {
        user_id: userId,
        batch_size: batchSize,
        batch_type: batchType,
        filter_criteria: criteria,
        total_contacts: 0,
        successful_imports: 0,
        processing_status: 'pending' as const,
        completion_percentage: 0,
        acquisition_strategy: acquisitionStrategy,
        roi_projection: this.calculateROIProjection(batchSize, acquisitionStrategy)
      };

      const { data, error } = await supabase
        .from('contact_acquisition_batches')
        .insert([batchData])
        .select()
        .single();

      if (error) throw error;

      // Start processing the batch
      await this.processBatch(data.id, criteria);

      return data;
    } catch (error) {
      console.error('Error creating contact batch:', error);
      throw error;
    }
  }

  // Process a contact batch (discover and import contacts)
  async processBatch(batchId: string, criteria: BatchFilterCriteria): Promise<void> {
    try {
      // Update status to processing
      await supabase
        .from('contact_acquisition_batches')
        .update({ processing_status: 'processing', completion_percentage: 10 })
        .eq('id', batchId);

      // Get batch details
      const { data: batch } = await supabase
        .from('contact_acquisition_batches')
        .select('*')
        .eq('id', batchId)
        .single();

      if (!batch) throw new Error('Batch not found');

      // Discover practices
      const practices = await this.discoverPractices(criteria, batch.batch_size);
      
      await supabase
        .from('contact_acquisition_batches')
        .update({ completion_percentage: 50, total_contacts: practices.length })
        .eq('id', batchId);

      // Create contact acquisitions
      const acquisitions = practices.map(practice => ({
        user_id: batch.user_id,
        batch_id: batchId,
        practice_universe_id: practice.id,
        acquisition_method: this.determineAcquisitionMethod(practice, criteria) as any,
        status: 'imported' as const,
        intelligence_brief: this.generateIntelligenceBrief(practice),
        conversion_probability: this.calculateConversionProbability(practice),
        estimated_deal_size: this.estimateDealSize(practice),
        engagement_score: practice.opportunity_score,
        next_best_action: this.generateNextBestAction(practice),
        roi_estimate: this.calculateROIEstimate(practice),
        acquisition_cost: this.calculateAcquisitionCost(batch.batch_type)
      }));

      const { data: acquisitionData, error: acquisitionError } = await supabase
        .from('contact_acquisitions_detailed')
        .insert(acquisitions)
        .select();

      if (acquisitionError) throw acquisitionError;

      // Update batch as completed
      await supabase
        .from('contact_acquisition_batches')
        .update({ 
          processing_status: 'completed', 
          completion_percentage: 100,
          successful_imports: acquisitionData.length 
        })
        .eq('id', batchId);

      // Create intelligence insights about the batch
      await this.createBatchInsights(batch.user_id, batch, practices);

    } catch (error) {
      console.error('Error processing batch:', error);
      
      // Update batch as failed
      await supabase
        .from('contact_acquisition_batches')
        .update({ processing_status: 'failed' })
        .eq('id', batchId);
      
      throw error;
    }
  }

  // Get contact batches for a user
  async getContactBatches(userId: string): Promise<ContactBatch[]> {
    try {
      const { data, error } = await supabase
        .from('contact_acquisition_batches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting contact batches:', error);
      return [];
    }
  }

  // Get contact acquisitions for a batch
  async getContactAcquisitions(batchId: string): Promise<ContactAcquisition[]> {
    try {
      const { data, error } = await supabase
        .from('contact_acquisitions_detailed')
        .select(`
          *,
          practice_universe_enriched (
            practice_name,
            provider_name,
            specialty_description,
            practice_address,
            phone
          )
        `)
        .eq('batch_id', batchId)
        .order('conversion_probability', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting contact acquisitions:', error);
      return [];
    }
  }

  // Update contact acquisition status
  async updateContactStatus(
    acquisitionId: string, 
    status: ContactAcquisition['status'],
    notes?: string
  ): Promise<void> {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };

      if (notes) {
        updateData.intelligence_brief = { 
          ...updateData.intelligence_brief, 
          notes 
        };
      }

      await supabase
        .from('contact_acquisitions_detailed')
        .update(updateData)
        .eq('id', acquisitionId);
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  }

  // Enrich universe with NPI data
  private async enrichUniverseWithNPIData(
    criteria: BatchFilterCriteria,
    limit: number
  ): Promise<void> {
    try {
      if (!criteria.territories?.states || criteria.territories.states.length === 0) {
        return; // Need at least state for NPI search
      }

      const specialties = criteria.specialties || ['dental', 'aesthetic'];
      
      for (const state of criteria.territories.states) {
        const enrichedPractices = await npiService.discoverPracticesInTerritory(
          { 
            state, 
            cities: criteria.territories.cities 
          },
          specialties,
          Math.floor(limit / criteria.territories.states.length)
        );

        // Convert to practice universe format and insert
        const practiceRecords = enrichedPractices.map(practice => ({
          npi_number: practice.npi_number,
          practice_name: practice.practice_name,
          provider_name: practice.provider_name,
          specialty_code: practice.specialty_code,
          specialty_description: practice.specialty_description,
          practice_address: practice.practice_address,
          phone: practice.phone,
          practice_size: practice.practice_size,
          competitive_status: 'unknown' as const,
          opportunity_score: practice.opportunity_score,
          high_value_procedures: practice.high_value_procedures,
          demographic_alignment: practice.demographic_alignment,
          competitive_vulnerability: practice.competitive_vulnerability,
          acquisition_priority: practice.opportunity_score,
          last_enriched: new Date().toISOString(),
          data_sources: ['npi_registry']
        }));

        // Insert in batches to avoid overwhelming the database
        const batchSize = 20;
        for (let i = 0; i < practiceRecords.length; i += batchSize) {
          const batch = practiceRecords.slice(i, i + batchSize);
          await supabase
            .from('practice_universe_enriched')
            .upsert(batch, { onConflict: 'npi_number' });
        }
      }
    } catch (error) {
      console.error('Error enriching universe with NPI data:', error);
    }
  }

  // Helper methods
  private getBatchType(size: number): 'precision_20' | 'expansion_50' | 'saturation_100' {
    switch (size) {
      case 20: return 'precision_20';
      case 50: return 'expansion_50';
      case 100: return 'saturation_100';
      default: return 'expansion_50';
    }
  }

  private generateAcquisitionStrategy(
    batchSize: number,
    criteria: BatchFilterCriteria,
    strategy?: Partial<BatchStrategy>
  ): BatchStrategy {
    const baseStrategy: BatchStrategy = {
      acquisition_approach: batchSize === 20 ? 'precision' : batchSize === 50 ? 'expansion' : 'saturation',
      target_procedures: criteria.high_value_procedures || ['Botox', 'Dental Implants', 'Invisalign'],
      engagement_sequence: this.getEngagementSequence(batchSize),
      success_metrics: {
        target_response_rate: batchSize === 20 ? 0.4 : batchSize === 50 ? 0.25 : 0.15,
        target_conversion_rate: batchSize === 20 ? 0.15 : batchSize === 50 ? 0.08 : 0.05,
        target_deal_size: batchSize === 20 ? 75000 : batchSize === 50 ? 45000 : 25000
      }
    };

    return { ...baseStrategy, ...strategy };
  }

  private getEngagementSequence(batchSize: number): string[] {
    if (batchSize === 20) {
      return ['research_practice', 'personalized_email', 'phone_call', 'demo_offer', 'follow_up'];
    } else if (batchSize === 50) {
      return ['templated_email', 'phone_call', 'follow_up', 'demo_offer'];
    } else {
      return ['bulk_email', 'follow_up_email', 'phone_call'];
    }
  }

  private calculateROIProjection(batchSize: number, strategy: BatchStrategy): number {
    const expectedDeals = batchSize * strategy.success_metrics.target_conversion_rate;
    const expectedRevenue = expectedDeals * strategy.success_metrics.target_deal_size;
    const estimatedCost = batchSize * this.calculateAcquisitionCost(this.getBatchType(batchSize));
    
    return expectedRevenue - estimatedCost;
  }

  private determineAcquisitionMethod(
    practice: PracticeUniverseEntry,
    criteria: BatchFilterCriteria
  ): string {
    if (practice.opportunity_score > 80) return 'ai_recommended';
    if (practice.competitive_status === 'competitor') return 'competitive_target';
    if (criteria.territories?.states?.length === 1) return 'territory_sweep';
    return 'manual_select';
  }

  private generateIntelligenceBrief(practice: PracticeUniverseEntry): any {
    return {
      practice_overview: `${practice.practice_size} ${practice.specialty_description} practice`,
      opportunity_highlights: practice.high_value_procedures,
      competitive_landscape: practice.competitive_vulnerability,
      demographic_fit: practice.demographic_alignment,
      recommended_approach: this.generateRecommendedApproach(practice),
      talking_points: this.generateTalkingPoints(practice)
    };
  }

  private generateRecommendedApproach(practice: PracticeUniverseEntry): string {
    if (practice.opportunity_score > 80) {
      return 'High-priority prospect - schedule immediate demo call';
    } else if (practice.opportunity_score > 60) {
      return 'Strong prospect - initiate with educational content';
    } else {
      return 'Standard prospect - include in nurture campaign';
    }
  }

  private generateTalkingPoints(practice: PracticeUniverseEntry): string[] {
    const points = [
      `Specializes in ${practice.specialty_description}`,
      `${practice.practice_size} practice with growth potential`
    ];

    if (practice.high_value_procedures.length > 0) {
      points.push(`Current procedures: ${practice.high_value_procedures.join(', ')}`);
    }

    return points;
  }

  private calculateConversionProbability(practice: PracticeUniverseEntry): number {
    let probability = practice.opportunity_score;
    
    // Adjust based on practice characteristics
    if (practice.practice_size === 'large') probability += 10;
    if (practice.competitive_status === 'unknown') probability += 5;
    if (practice.high_value_procedures.length > 2) probability += 5;
    
    return Math.min(100, Math.max(1, probability));
  }

  private estimateDealSize(practice: PracticeUniverseEntry): number {
    const baseDealSize = {
      'solo': 25000,
      'small': 45000,
      'medium': 75000,
      'large': 125000
    };

    let estimate = baseDealSize[practice.practice_size] || 45000;
    
    // Adjust for high-value procedures
    if (practice.high_value_procedures.includes('Botox')) estimate *= 1.2;
    if (practice.high_value_procedures.includes('Dental Implants')) estimate *= 1.5;
    
    return Math.round(estimate);
  }

  private calculateROIEstimate(practice: PracticeUniverseEntry): number {
    const dealSize = this.estimateDealSize(practice);
    const probability = this.calculateConversionProbability(practice) / 100;
    
    return dealSize * probability;
  }

  private calculateAcquisitionCost(batchType: string): number {
    const costs = {
      'precision_20': 250,   // High-touch, personalized approach
      'expansion_50': 125,   // Balanced approach
      'saturation_100': 75   // Volume approach
    };

    return costs[batchType as keyof typeof costs] || 125;
  }

  private generateNextBestAction(practice: PracticeUniverseEntry): string {
    if (practice.opportunity_score > 80) {
      return 'Schedule discovery call within 48 hours';
    } else if (practice.opportunity_score > 60) {
      return 'Send personalized introduction email';
    } else {
      return 'Add to nurture sequence';
    }
  }

  private async createBatchInsights(
    userId: string,
    batch: ContactBatch,
    practices: PracticeUniverseEntry[]
  ): Promise<void> {
    try {
      const topOpportunities = practices
        .filter(p => p.opportunity_score > 70)
        .length;

      const avgOpportunityScore = practices.reduce((sum, p) => sum + p.opportunity_score, 0) / practices.length;
      
      const insight = {
        user_id: userId,
        insight_type: 'procedure_opportunity' as const,
        data_source: 'contact_universe',
        correlation_score: 85,
        urgency_level: topOpportunities > 5 ? 'urgent' as const : 'standard' as const,
        insight_data: {
          message: `Contact batch acquired ${practices.length} prospects with ${topOpportunities} high-opportunity targets`,
          batch_id: batch.id,
          batch_size: batch.batch_size,
          top_opportunities: topOpportunities,
          avg_opportunity_score: Math.round(avgOpportunityScore),
          estimated_pipeline_value: practices.reduce((sum, p) => sum + this.estimateDealSize(p), 0),
          next_actions: ['Begin outreach sequence', 'Prioritize high-score prospects', 'Prepare demo materials']
        },
        procedure_tags: Array.from(new Set(practices.flatMap(p => p.high_value_procedures))),
        territory_relevance: {
          coverage_area: batch.filter_criteria.territories,
          market_penetration: 'expanding'
        }
      };

      await suisService.createIntelligenceInsight(insight);
    } catch (error) {
      console.error('Error creating batch insights:', error);
    }
  }
}

// Export singleton instance
export const contactUniverseService = new ContactUniverseService();
export default contactUniverseService;
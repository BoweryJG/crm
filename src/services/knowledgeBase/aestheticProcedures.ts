/**
 * RepSpheres CRM - Aesthetic Procedures Knowledge Base Service
 * 
 * This service manages fetching and updating aesthetic procedure information
 * for use in the RepSpheres CRM system.
 */

import { supabase } from '../supabase/supabase';
import { AestheticProcedure, AestheticProcedureCategory, AestheticProcedureFilterOptions } from '../../types';

/**
 * Service for aesthetic procedures knowledge base operations
 */
export const AestheticProceduresService = {
  /**
   * Fetch all aesthetic procedures
   */
  async getAllProcedures(): Promise<AestheticProcedure[]> {
    const { data, error } = await supabase
      .from('aesthetic_procedures')
      .select('*');
    
    if (error) {
      console.error('Error fetching aesthetic procedures:', error);
      return [];
    }
    
    return data as AestheticProcedure[];
  },
  
  /**
   * Fetch aesthetic procedures with filters
   */
  async getProcedures(filters: AestheticProcedureFilterOptions): Promise<AestheticProcedure[]> {
    let query = supabase
      .from('aesthetic_procedures')
      .select('*');
    
    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.popularity !== undefined) {
      query = query.gte('popularity', filters.popularity);
    }
    
    // Filter by recovery time (this is complex as it's stored as text)
    // For a real implementation, we'd need a more structured way to store recovery time
    
    if (filters.maxPainLevel !== undefined) {
      query = query.lte('pain_level', filters.maxPainLevel);
    }
    
    if (filters.requiresCertification !== undefined) {
      query = query.eq('certification_needed', filters.requiresCertification);
    }
    
    if (filters.costRange) {
      if (filters.costRange.min !== undefined) {
        query = query.gte('cost_average', filters.costRange.min);
      }
      if (filters.costRange.max !== undefined) {
        query = query.lte('cost_average', filters.costRange.max);
      }
    }
    
    if (filters.procedureTime && filters.procedureTime.max !== undefined) {
      query = query.lte('procedure_time_avg', filters.procedureTime.max);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered aesthetic procedures:', error);
      return [];
    }
    
    return data as AestheticProcedure[];
  },
  
  /**
   * Fetch a single aesthetic procedure by ID
   */
  async getProcedureById(id: string): Promise<AestheticProcedure | null> {
    const { data, error } = await supabase
      .from('aesthetic_procedures')
      .select(`
        *,
        aesthetic_procedure_equipment(*),
        aesthetic_procedure_supplies(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching aesthetic procedure ${id}:`, error);
      return null;
    }
    
    return data as AestheticProcedure;
  },
  
  /**
   * Get procedures by category
   */
  async getProceduresByCategory(category: AestheticProcedureCategory): Promise<AestheticProcedure[]> {
    const { data, error } = await supabase
      .from('aesthetic_procedures')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error(`Error fetching aesthetic procedures for category ${category}:`, error);
      return [];
    }
    
    return data as AestheticProcedure[];
  },
  
  /**
   * Search aesthetic procedures by term
   */
  async searchProcedures(term: string): Promise<AestheticProcedure[]> {
    const { data, error } = await supabase
      .from('aesthetic_procedures')
      .select('*')
      .or(`name.ilike.%${term}%, description.ilike.%${term}%`);
    
    if (error) {
      console.error(`Error searching aesthetic procedures for "${term}":`, error);
      return [];
    }
    
    return data as AestheticProcedure[];
  },
  
  /**
   * Get related procedures (complementary and alternatives)
   */
  async getRelatedProcedures(procedureId: string): Promise<{
    complementary: AestheticProcedure[];
    alternatives: AestheticProcedure[];
  }> {
    // First get the procedure to find its related procedure IDs
    const { data: procedure, error: procError } = await supabase
      .from('aesthetic_procedures')
      .select('complementary_procedures, alternative_procedures')
      .eq('id', procedureId)
      .single();
    
    if (procError || !procedure) {
      console.error(`Error fetching related procedures for ${procedureId}:`, procError);
      return { complementary: [], alternatives: [] };
    }
    
    // Then fetch the actual related procedures
    const compIds = procedure.complementary_procedures || [];
    const altIds = procedure.alternative_procedures || [];
    
    const [compResult, altResult] = await Promise.all([
      compIds.length > 0 
        ? supabase.from('aesthetic_procedures').select('*').in('id', compIds)
        : { data: [], error: null },
      altIds.length > 0
        ? supabase.from('aesthetic_procedures').select('*').in('id', altIds)
        : { data: [], error: null }
    ]);
    
    return {
      complementary: (compResult.data || []) as AestheticProcedure[],
      alternatives: (altResult.data || []) as AestheticProcedure[]
    };
  },
  
  /**
   * Get latest trending aesthetic procedures
   * These are the most popular and innovative procedures in aesthetics
   */
  async getTrendingProcedures(): Promise<AestheticProcedure[]> {
    // In a real implementation, this would be based on search frequency, page visits,
    // or a manually curated list of trending procedures
    
    // For now, we'll simulate it by returning procedures from specific categories
    // with high popularity ratings
    const { data, error } = await supabase
      .from('aesthetic_procedures')
      .select('*')
      .gte('popularity', 8)
      .limit(8);
    
    if (error) {
      console.error('Error fetching trending aesthetic procedures:', error);
      return [];
    }
    
    return data as AestheticProcedure[];
  }
};

/**
 * Sample implementation of getting the latest aesthetic trends
 * This would be expanded with real data from the database
 */
export const getAestheticTrends = async (): Promise<{
  title: string;
  description: string;
  trends: Array<{
    name: string;
    description: string;
    keyBenefits: string[];
    popularity: number; // 1-10
    category: AestheticProcedureCategory;
    yearIntroduced: number;
    imageUrl?: string;
  }>;
}> => {
  // This would normally come from the database, but for now we'll hardcode it
  // based on current research trends
  return {
    title: "Latest Aesthetic Treatment Trends for 2025",
    description: "The most innovative and in-demand aesthetic treatments for modern practices",
    trends: [
      {
        name: "Combination Laser & Microneedling Treatments",
        description: "Multi-layer skin rejuvenation combining fractional lasers with radiofrequency microneedling for enhanced results",
        keyBenefits: [
          "Addresses multiple skin concerns simultaneously",
          "Enhanced collagen production",
          "Reduced downtime compared to more aggressive single treatments",
          "Suitable for more skin types than traditional lasers alone"
        ],
        popularity: 9,
        category: AestheticProcedureCategory.LASER_PROCEDURES,
        yearIntroduced: 2024,
        imageUrl: "/assets/images/knowledge-base/aesthetic/combo-laser-microneedling.jpg"
      },
      {
        name: "Precision Botox (Micro-Botox)",
        description: "Ultra-precise administration of neurotoxin in smaller doses to target specific areas while maintaining natural expressions",
        keyBenefits: [
          "Natural-looking results with expression preservation",
          "Reduced risk of frozen appearance",
          "Can be combined with other treatments for total facial harmony",
          "Popular with first-time injectable patients"
        ],
        popularity: 10,
        category: AestheticProcedureCategory.INJECTABLES,
        yearIntroduced: 2024,
        imageUrl: "/assets/images/knowledge-base/aesthetic/precision-botox.jpg"
      },
      {
        name: "Bio-Stimulator Fillers",
        description: "Next-generation injectable fillers that stimulate the body's own collagen production for longer-lasting, more natural results",
        keyBenefits: [
          "Results that improve over time",
          "Longer duration than traditional hyaluronic acid fillers",
          "More natural volume restoration",
          "Addresses skin quality and volume simultaneously"
        ],
        popularity: 9,
        category: AestheticProcedureCategory.INJECTABLES,
        yearIntroduced: 2023,
        imageUrl: "/assets/images/knowledge-base/aesthetic/bio-stimulator-fillers.jpg"
      },
      {
        name: "AI-Assisted Treatment Planning",
        description: "Using artificial intelligence to analyze facial structure and aging patterns to create personalized treatment protocols",
        keyBenefits: [
          "Highly personalized treatment plans",
          "More predictable outcomes",
          "Enhanced patient communication with visual projections",
          "Optimized product usage"
        ],
        popularity: 8,
        category: AestheticProcedureCategory.OTHER,
        yearIntroduced: 2025,
        imageUrl: "/assets/images/knowledge-base/aesthetic/ai-treatment-planning.jpg"
      },
      {
        name: "Non-Surgical Body Sculpting Combinations",
        description: "Combining multiple non-invasive technologies (radiofrequency, ultrasound, cryolipolysis) for enhanced body contouring results",
        keyBenefits: [
          "More dramatic results than single-modality treatments",
          "Addresses fat, skin laxity and muscle tone simultaneously",
          "No downtime compared to surgical alternatives",
          "Customizable to patient-specific concerns"
        ],
        popularity: 9,
        category: AestheticProcedureCategory.BODY_CONTOURING,
        yearIntroduced: 2024,
        imageUrl: "/assets/images/knowledge-base/aesthetic/combo-body-sculpting.jpg"
      }
    ]
  };
};

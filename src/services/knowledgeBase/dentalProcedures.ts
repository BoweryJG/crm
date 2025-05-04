/**
 * RepSpheres CRM - Dental Procedures Knowledge Base Service
 * 
 * This service manages fetching and updating dental procedure information
 * for use in the RepSpheres CRM system.
 */

import { supabase } from '../supabase/supabase';
import { DentalProcedure, DentalProcedureCategory, DentalProcedureFilterOptions } from '../../types';

/**
 * Service for dental procedures knowledge base operations
 */
export const DentalProceduresService = {
  /**
   * Fetch all dental procedures
   */
  async getAllProcedures(): Promise<DentalProcedure[]> {
    const { data, error } = await supabase
      .from('dental_procedures')
      .select('*');
    
    if (error) {
      console.error('Error fetching dental procedures:', error);
      return [];
    }
    
    return data as DentalProcedure[];
  },
  
  /**
   * Fetch dental procedures with filters
   */
  async getProcedures(filters: DentalProcedureFilterOptions): Promise<DentalProcedure[]> {
    let query = supabase
      .from('dental_procedures')
      .select('*');
    
    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.insuranceCodes && filters.insuranceCodes.length > 0) {
      // For array fields like insurance_codes, we need to check if any of the insurance codes are in the array
      query = query.or(filters.insuranceCodes.map(code => `insurance_codes.cs.{${code}}`).join(','));
    }
    
    if (filters.typicallyCovered !== undefined) {
      query = query.eq('insurance_typically_covered', filters.typicallyCovered);
    }
    
    if (filters.painLevel !== undefined) {
      query = query.lte('pain_level', filters.painLevel);
    }
    
    if (filters.specialtyRequired !== undefined) {
      query = query.eq('specialty_required', filters.specialtyRequired);
    }
    
    if (filters.costRange) {
      if (filters.costRange.min !== undefined) {
        query = query.gte('cost_average', filters.costRange.min);
      }
      if (filters.costRange.max !== undefined) {
        query = query.lte('cost_average', filters.costRange.max);
      }
    }
    
    if (filters.equipmentCost) {
      // This is more complex as equipment costs are in a separate table
      // We'd need to join with the equipment table or use a stored procedure
      // For now, we'll skip this filter in this simple implementation
    }
    
    if (filters.procedureTime && filters.procedureTime.max !== undefined) {
      query = query.lte('procedure_time_avg', filters.procedureTime.max);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered dental procedures:', error);
      return [];
    }
    
    return data as DentalProcedure[];
  },
  
  /**
   * Fetch a single dental procedure by ID
   */
  async getProcedureById(id: string): Promise<DentalProcedure | null> {
    const { data, error } = await supabase
      .from('dental_procedures')
      .select(`
        *,
        dental_procedure_equipment(*),
        dental_procedure_supplies(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching dental procedure ${id}:`, error);
      return null;
    }
    
    return data as DentalProcedure;
  },
  
  /**
   * Get procedures by category
   */
  async getProceduresByCategory(category: DentalProcedureCategory): Promise<DentalProcedure[]> {
    const { data, error } = await supabase
      .from('dental_procedures')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error(`Error fetching dental procedures for category ${category}:`, error);
      return [];
    }
    
    return data as DentalProcedure[];
  },
  
  /**
   * Search dental procedures by term
   */
  async searchProcedures(term: string): Promise<DentalProcedure[]> {
    const { data, error } = await supabase
      .from('dental_procedures')
      .select('*')
      .or(`name.ilike.%${term}%, description.ilike.%${term}%`);
    
    if (error) {
      console.error(`Error searching dental procedures for "${term}":`, error);
      return [];
    }
    
    return data as DentalProcedure[];
  },
  
  /**
   * Get related procedures (complementary and alternatives)
   */
  async getRelatedProcedures(procedureId: string): Promise<{
    complementary: DentalProcedure[];
    alternatives: DentalProcedure[];
  }> {
    // First get the procedure to find its related procedure IDs
    const { data: procedure, error: procError } = await supabase
      .from('dental_procedures')
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
        ? supabase.from('dental_procedures').select('*').in('id', compIds)
        : { data: [], error: null },
      altIds.length > 0
        ? supabase.from('dental_procedures').select('*').in('id', altIds)
        : { data: [], error: null }
    ]);
    
    return {
      complementary: (compResult.data || []) as DentalProcedure[],
      alternatives: (altResult.data || []) as DentalProcedure[]
    };
  },
  
  /**
   * Get latest trending dental procedures
   * These are the most innovative and cutting-edge procedures in dentistry
   */
  async getTrendingProcedures(): Promise<DentalProcedure[]> {
    // In a real implementation, this would be based on search frequency, page visits,
    // or a manually curated list of trending procedures
    
    // For now, we'll simulate it by returning procedures from specific categories
    // that are typically more innovative
    const trendingCategories = [
      DentalProcedureCategory.DIGITAL_DENTISTRY,
      DentalProcedureCategory.IMPLANTOLOGY,
      DentalProcedureCategory.COSMETIC_DENTISTRY
    ];
    
    const { data, error } = await supabase
      .from('dental_procedures')
      .select('*')
      .in('category', trendingCategories)
      .limit(8);
    
    if (error) {
      console.error('Error fetching trending dental procedures:', error);
      return [];
    }
    
    return data as DentalProcedure[];
  }
};

/**
 * Sample implementation of getting the latest dental implant innovations
 * This would be expanded with real data from the database
 */
export const getDentalImplantInnovations = async (): Promise<{
  title: string;
  description: string;
  innovations: Array<{
    name: string;
    description: string;
    keyBenefits: string[];
    yearIntroduced: number;
    manufacturer?: string;
    imageUrl?: string;
  }>;
}> => {
  // This would normally come from the database, but for now we'll hardcode it
  // based on current research trends
  return {
    title: "Latest Dental Implant Innovations",
    description: "The most cutting-edge advancements in dental implant technology",
    innovations: [
      {
        name: "3D-Printed Custom Implants",
        description: "Fully customized implants created using patient-specific 3D printing technology for perfect anatomical fit",
        keyBenefits: [
          "Perfect anatomical match",
          "Reduced surgery time",
          "Faster osseointegration",
          "Less bone grafting needed"
        ],
        yearIntroduced: 2024,
        manufacturer: "Multiple manufacturers",
        imageUrl: "/assets/images/knowledge-base/dental/3d-printed-implants.jpg"
      },
      {
        name: "Robotic-Assisted Implant Surgery",
        description: "Robotic systems like Yomi assist dentists with ultra-precise implant placement using haptic guidance technology",
        keyBenefits: [
          "Sub-millimeter accuracy",
          "Reduced complications",
          "Minimally invasive approach",
          "Faster recovery time"
        ],
        yearIntroduced: 2023,
        manufacturer: "Neocis (Yomi)",
        imageUrl: "/assets/images/knowledge-base/dental/robotic-implant-surgery.jpg"
      },
      {
        name: "Ceramic Zirconia Implants",
        description: "Metal-free ceramic implants offering superior aesthetics and biocompatibility",
        keyBenefits: [
          "Metal-free solution",
          "Reduced allergic reactions",
          "Superior white color for aesthetics",
          "Less plaque accumulation"
        ],
        yearIntroduced: 2022,
        manufacturer: "Straumann, Nobel Biocare",
        imageUrl: "/assets/images/knowledge-base/dental/zirconia-implants.jpg"
      },
      {
        name: "Smart Implants with Sensors",
        description: "Implants embedded with microsensors that monitor occlusal forces, temperature, and detect potential problems",
        keyBenefits: [
          "Real-time monitoring",
          "Early problem detection",
          "Data-driven maintenance",
          "Personalized treatment protocols"
        ],
        yearIntroduced: 2025,
        manufacturer: "Research phase - multiple companies",
        imageUrl: "/assets/images/knowledge-base/dental/smart-implants.jpg"
      },
      {
        name: "Growth Factor-Enhanced Implants",
        description: "Implants with bioactive surface coatings containing growth factors to accelerate osseointegration",
        keyBenefits: [
          "Up to 50% faster integration",
          "Improved success rates in compromised bone",
          "Better long-term stability",
          "Suitable for medically compromised patients"
        ],
        yearIntroduced: 2024,
        manufacturer: "Various",
        imageUrl: "/assets/images/knowledge-base/dental/growth-factor-implants.jpg"
      }
    ]
  };
};

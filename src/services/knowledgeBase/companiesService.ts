/**
 * RepSpheres CRM - Companies Knowledge Base Service
 * 
 * This service manages fetching and updating company information
 * for use in the RepSpheres CRM system.
 */

import { supabase } from '../supabase/supabase';
import { Company, CompanyFilterOptions } from '../../types';

/**
 * Service for companies knowledge base operations
 */
export const CompaniesService = {
  /**
   * Fetch all companies
   */
  async getAllCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Fetch companies with filters
   */
  async getCompanies(filters: CompanyFilterOptions): Promise<Company[]> {
    let query = supabase
      .from('companies')
      .select('*');
    
    // Apply filters
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    
    if (filters.procedures && filters.procedures.length > 0) {
      // For array fields like procedures, we need to check if any of the procedures are in the array
      query = query.or(filters.procedures.map(proc => `procedures.cs.{${proc}}`).join(','));
    }
    
    if (filters.foundedAfter) {
      query = query.gte('founded_year', filters.foundedAfter);
    }
    
    if (filters.foundedBefore) {
      query = query.lte('founded_year', filters.foundedBefore);
    }
    
    if (filters.minMarketShare !== undefined) {
      query = query.gte('market_share', filters.minMarketShare);
    }
    
    if (filters.minAnnualRevenue !== undefined) {
      query = query.gte('annual_revenue', filters.minAnnualRevenue);
    }
    
    if (filters.headquarters) {
      query = query.ilike('headquarters', `%${filters.headquarters}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching filtered companies:', error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Fetch a single company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching company ${id}:`, error);
      return null;
    }
    
    return data as Company;
  },
  
  /**
   * Search companies by term
   */
  async searchCompanies(term: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .or(`name.ilike.%${term}%, description.ilike.%${term}%`);
    
    if (error) {
      console.error(`Error searching companies for "${term}":`, error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Get companies by industry
   */
  async getCompaniesByIndustry(industry: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('industry', industry);
    
    if (error) {
      console.error(`Error fetching companies for industry ${industry}:`, error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Get companies by procedure
   */
  async getCompaniesByProcedure(procedure: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .contains('procedures', [procedure]);
    
    if (error) {
      console.error(`Error fetching companies for procedure ${procedure}:`, error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Get top companies by market share
   */
  async getTopCompaniesByMarketShare(limit: number = 10): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('market_share', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top companies by market share:', error);
      return [];
    }
    
    return data as Company[];
  },
  
  /**
   * Get top companies by revenue
   */
  async getTopCompaniesByRevenue(limit: number = 10): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('annual_revenue', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top companies by revenue:', error);
      return [];
    }
    
    return data as Company[];
  }
};

/**
 * Sample implementation of getting the latest company trends
 * This would be expanded with real data from the database
 */
export const getCompanyTrends = async (): Promise<{
  title: string;
  description: string;
  trends: Array<{
    name: string;
    description: string;
    companies: string[];
    impact: string;
    year: number;
  }>;
}> => {
  // This would normally come from the database, but for now we'll hardcode it
  return {
    title: "Latest Dental and Aesthetic Industry Trends",
    description: "Key market trends affecting dental and aesthetic companies",
    trends: [
      {
        name: "Consolidation of DSOs",
        description: "Continued consolidation in the dental service organization space with private equity backing",
        companies: ["Heartland Dental", "Pacific Dental Services", "Aspen Dental"],
        impact: "Changing purchasing patterns and increased focus on ROI metrics",
        year: 2025
      },
      {
        name: "AI-Powered Diagnostics",
        description: "Integration of artificial intelligence for diagnostic assistance and treatment planning",
        companies: ["Dentsply Sirona", "Align Technology", "Carestream Dental"],
        impact: "Improved accuracy and efficiency in diagnostics and treatment planning",
        year: 2024
      },
      {
        name: "Subscription-Based Models",
        description: "Shift towards subscription-based models for equipment, supplies, and software",
        companies: ["Henry Schein", "Patterson Dental", "Benco Dental"],
        impact: "More predictable revenue streams for companies and lower upfront costs for practices",
        year: 2025
      },
      {
        name: "Telehealth Integration",
        description: "Integration of telehealth capabilities into practice management systems",
        companies: ["Curve Dental", "Dentrix", "Open Dental"],
        impact: "Expanded patient reach and improved convenience for follow-ups and consultations",
        year: 2023
      },
      {
        name: "Sustainable and Eco-Friendly Products",
        description: "Growing focus on environmentally friendly materials and practices",
        companies: ["Colgate-Palmolive", "Procter & Gamble", "Unilever"],
        impact: "Meeting consumer demand for sustainable options and reducing environmental footprint",
        year: 2024
      }
    ]
  };
};

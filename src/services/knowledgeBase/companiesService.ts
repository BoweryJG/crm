import { supabase } from '../supabase/supabase';
import { Company } from '../../types';

export class CompaniesService {
  /**
   * Get all companies from the database
   */
  static async getAllCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(`Error fetching companies: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCompanies:', error);
      return [];
    }
  }

  /**
   * Get companies by industry
   */
  static async getCompaniesByIndustry(industry: string): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('industry', industry)
        .order('name');

      if (error) {
        throw new Error(`Error fetching companies by industry: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCompaniesByIndustry:', error);
      return [];
    }
  }

  /**
   * Search companies by name or description
   */
  static async searchCompanies(searchTerm: string): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('name');

      if (error) {
        throw new Error(`Error searching companies: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchCompanies:', error);
      return [];
    }
  }

  /**
   * Get a company by ID
   */
  static async getCompanyById(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Error fetching company: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getCompanyById:', error);
      return null;
    }
  }

  /**
   * Create a new company
   */
  static async createCompany(company: Omit<Company, 'id'>): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating company: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createCompany:', error);
      return null;
    }
  }

  /**
   * Update a company
   */
  static async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating company: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateCompany:', error);
      return null;
    }
  }

  /**
   * Delete a company
   */
  static async deleteCompany(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting company: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCompany:', error);
      return false;
    }
  }

  /**
   * Get company trends data for market analysis
   */
  static async getCompanyTrends(industry?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('company_trends')
        .select('*');
      
      if (industry) {
        query = query.eq('industry', industry);
      }
      
      const { data, error } = await query;

      if (error) {
        throw new Error(`Error fetching company trends: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCompanyTrends:', error);
      return [];
    }
  }
}

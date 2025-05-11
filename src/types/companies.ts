import { BaseModel } from './models';

/**
 * Company model representing a dental or aesthetic company
 */
export interface Company extends BaseModel {
  name: string;
  logo_url?: string;
  website: string;
  industry: 'dental' | 'aesthetic' | 'both' | 'other';
  founded_year?: number;
  headquarters: string;
  description: string;
  products: string[];
  procedures?: string[];
  market_share?: number;
  annual_revenue?: number;
  key_contacts?: string[];
  notes?: string;
}

/**
 * Filter options for companies
 */
export interface CompanyFilterOptions {
  industry?: 'dental' | 'aesthetic' | 'both' | 'other';
  procedures?: string[];
  foundedAfter?: number;
  foundedBefore?: number;
  minMarketShare?: number;
  minAnnualRevenue?: number;
  headquarters?: string;
}

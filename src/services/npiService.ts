// NPI (National Provider Identifier) Integration Service
// Connects to CMS NPI Registry for practice discovery
import { supabase } from './supabase/supabase';

// NPI API Types
export interface NPIProvider {
  npi: string;
  provider_type: 'individual' | 'organization';
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  taxonomy: NPITaxonomy[];
  addresses: NPIAddress[];
  other_names?: string[];
  identifiers?: NPIIdentifier[];
  endpoints?: NPIEndpoint[];
}

export interface NPITaxonomy {
  code: string;
  desc: string;
  primary: boolean;
  state?: string;
  license?: string;
}

export interface NPIAddress {
  country_code: string;
  country_name: string;
  address_purpose: 'location' | 'mailing';
  address_type: 'dom' | 'military' | 'po_box';
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  telephone_number?: string;
  fax_number?: string;
}

export interface NPIIdentifier {
  code: string;
  desc: string;
  identifier: string;
  state?: string;
  issuer?: string;
}

export interface NPIEndpoint {
  endpointType: string;
  endpointTypeDescription: string;
  endpoint: string;
  endpointDescription?: string;
  affiliation?: string;
  use?: string;
  contentType?: string;
  country_code?: string;
  country_name?: string;
  address_type?: string;
  address_1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

export interface NPISearchParams {
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  taxonomy_description?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code?: string;
  limit?: number;
  skip?: number;
  pretty?: boolean;
}

export interface NPISearchResponse {
  result_count: number;
  results: NPIProvider[];
}

export interface EnrichedPractice {
  npi_number: string;
  practice_name: string;
  provider_name: string;
  specialty_code: string;
  specialty_description: string;
  practice_address: any;
  phone?: string;
  practice_size: 'solo' | 'small' | 'medium' | 'large';
  opportunity_score: number;
  high_value_procedures: string[];
  demographic_alignment: any;
  competitive_vulnerability: any;
}

class NPIService {
  private baseURL = 'https://clinicaltables.nlm.nih.gov/api/npi_idv/v3/search';
  private orgURL = 'https://clinicaltables.nlm.nih.gov/api/npi_org/v3/search';
  
  // Search for individual providers
  async searchIndividualProviders(params: NPISearchParams): Promise<NPISearchResponse> {
    try {
      const url = new URL(this.baseURL);
      
      // Add search parameters
      if (params.first_name) url.searchParams.append('first_name', params.first_name);
      if (params.last_name) url.searchParams.append('last_name', params.last_name);
      if (params.taxonomy_description) url.searchParams.append('taxonomy_description', params.taxonomy_description);
      if (params.city) url.searchParams.append('city', params.city);
      if (params.state) url.searchParams.append('state', params.state);
      if (params.postal_code) url.searchParams.append('postal_code', params.postal_code);
      
      url.searchParams.append('limit', (params.limit || 20).toString());
      url.searchParams.append('skip', (params.skip || 0).toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`NPI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseNPIResponse(data);
    } catch (error) {
      console.error('Error searching individual providers:', error);
      throw error;
    }
  }

  // Search for organization providers
  async searchOrganizationProviders(params: NPISearchParams): Promise<NPISearchResponse> {
    try {
      const url = new URL(this.orgURL);
      
      if (params.organization_name) url.searchParams.append('organization_name', params.organization_name);
      if (params.taxonomy_description) url.searchParams.append('taxonomy_description', params.taxonomy_description);
      if (params.city) url.searchParams.append('city', params.city);
      if (params.state) url.searchParams.append('state', params.state);
      if (params.postal_code) url.searchParams.append('postal_code', params.postal_code);
      
      url.searchParams.append('limit', (params.limit || 20).toString());
      url.searchParams.append('skip', (params.skip || 0).toString());

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`NPI API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseNPIResponse(data);
    } catch (error) {
      console.error('Error searching organization providers:', error);
      throw error;
    }
  }

  // Search for providers by specialty (dental, aesthetic)
  async searchBySpecialty(
    specialty: 'dental' | 'aesthetic' | 'dermatology' | 'plastic_surgery',
    location?: { state?: string; city?: string; postal_code?: string },
    limit: number = 50
  ): Promise<NPISearchResponse> {
    const specialtyMappings = {
      dental: 'Dentist',
      aesthetic: 'Dermatology',
      dermatology: 'Dermatology',
      plastic_surgery: 'Plastic Surgery'
    };

    const searchParams: NPISearchParams = {
      taxonomy_description: specialtyMappings[specialty],
      limit,
      ...location
    };

    // Search both individual and organization providers
    const [individuals, organizations] = await Promise.all([
      this.searchIndividualProviders(searchParams),
      this.searchOrganizationProviders(searchParams)
    ]);

    return {
      result_count: individuals.result_count + organizations.result_count,
      results: [...individuals.results, ...organizations.results]
    };
  }

  // Get provider details by NPI number
  async getProviderByNPI(npi: string): Promise<NPIProvider | null> {
    try {
      // Try individual search first
      let response = await fetch(`${this.baseURL}?npi=${npi}&limit=1`);
      let data = await response.json();
      let parsed = this.parseNPIResponse(data);
      
      if (parsed.results.length > 0) {
        return parsed.results[0];
      }

      // Try organization search
      response = await fetch(`${this.orgURL}?npi=${npi}&limit=1`);
      data = await response.json();
      parsed = this.parseNPIResponse(data);
      
      if (parsed.results.length > 0) {
        return parsed.results[0];
      }

      return null;
    } catch (error) {
      console.error('Error getting provider by NPI:', error);
      return null;
    }
  }

  // Cache NPI data in Supabase
  async cacheNPIData(provider: NPIProvider): Promise<void> {
    try {
      const cacheData = {
        npi_number: provider.npi,
        provider_data: provider,
        organization_data: provider.provider_type === 'organization' ? provider : {},
        taxonomy_data: provider.taxonomy,
        address_data: provider.addresses,
        last_updated: new Date().toISOString(),
        data_freshness_days: 0
      };

      await supabase
        .from('npi_data_cache')
        .upsert(cacheData, { onConflict: 'npi_number' });
    } catch (error) {
      console.error('Error caching NPI data:', error);
    }
  }

  // Get cached NPI data
  async getCachedNPIData(npi: string): Promise<NPIProvider | null> {
    try {
      const { data, error } = await supabase
        .from('npi_data_cache')
        .select('provider_data')
        .eq('npi_number', npi)
        .single();

      if (error || !data) return null;

      // Check if data is fresh (less than 30 days old)
      const cached = data as any;
      const daysSinceCached = Math.floor(
        (Date.now() - new Date(cached.last_updated).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceCached > 30) {
        return null; // Data too old, fetch fresh
      }

      return cached.provider_data;
    } catch (error) {
      console.error('Error getting cached NPI data:', error);
      return null;
    }
  }

  // Enrich practices with market intelligence
  async enrichPracticesWithIntelligence(providers: NPIProvider[]): Promise<EnrichedPractice[]> {
    return providers.map(provider => this.enrichSinglePractice(provider));
  }

  // Convert NPI provider to enriched practice
  private enrichSinglePractice(provider: NPIProvider): EnrichedPractice {
    const primaryTaxonomy = provider.taxonomy.find(t => t.primary) || provider.taxonomy[0];
    const locationAddress = provider.addresses.find(a => a.address_purpose === 'location') || provider.addresses[0];
    
    // Determine practice name
    const practiceName = provider.organization_name || 
      (provider.first_name && provider.last_name ? `${provider.first_name} ${provider.last_name}` : 'Unknown Practice');
    
    const providerName = provider.first_name && provider.last_name ? 
      `${provider.first_name} ${provider.last_name}` : provider.organization_name || 'Unknown Provider';

    // Calculate opportunity score based on specialty and location
    const opportunityScore = this.calculateOpportunityScore(provider);
    
    // Determine high-value procedures based on specialty
    const highValueProcedures = this.getHighValueProceduresForSpecialty(primaryTaxonomy?.desc || '');
    
    // Determine practice size (rough estimation based on provider type)
    const practiceSize = this.estimatePracticeSize(provider);

    return {
      npi_number: provider.npi,
      practice_name: practiceName,
      provider_name: providerName,
      specialty_code: primaryTaxonomy?.code || '',
      specialty_description: primaryTaxonomy?.desc || '',
      practice_address: {
        address_1: locationAddress?.address_1 || '',
        address_2: locationAddress?.address_2 || '',
        city: locationAddress?.city || '',
        state: locationAddress?.state || '',
        postal_code: locationAddress?.postal_code || '',
        phone: locationAddress?.telephone_number || ''
      },
      phone: locationAddress?.telephone_number,
      practice_size: practiceSize,
      opportunity_score: opportunityScore,
      high_value_procedures: highValueProcedures,
      demographic_alignment: this.calculateDemographicAlignment(locationAddress),
      competitive_vulnerability: this.assessCompetitiveVulnerability(provider)
    };
  }

  // Calculate opportunity score (1-100)
  private calculateOpportunityScore(provider: NPIProvider): number {
    let score = 50; // Base score

    const primaryTaxonomy = provider.taxonomy.find(t => t.primary) || provider.taxonomy[0];
    const specialty = primaryTaxonomy?.desc?.toLowerCase() || '';

    // High-value specialties get bonus points
    if (specialty.includes('dermatology') || specialty.includes('plastic surgery')) {
      score += 25;
    } else if (specialty.includes('dentist') || specialty.includes('oral surgery')) {
      score += 20;
    } else if (specialty.includes('ophthalmology') || specialty.includes('family medicine')) {
      score += 15;
    }

    // Organization type bonus
    if (provider.provider_type === 'organization') {
      score += 10;
    }

    // Multiple locations indicator
    if (provider.addresses.length > 1) {
      score += 5;
    }

    return Math.min(100, Math.max(1, score));
  }

  // Get high-value procedures based on specialty
  private getHighValueProceduresForSpecialty(specialty: string): string[] {
    const specialtyLower = specialty.toLowerCase();
    
    if (specialtyLower.includes('dermatology')) {
      return ['Botox', 'Restylane', 'Chemical Peel', 'Laser Skin Resurfacing'];
    } else if (specialtyLower.includes('plastic surgery')) {
      return ['Breast Augmentation', 'Botox', 'Hybrid Filler Technology', 'Laser Skin Resurfacing'];
    } else if (specialtyLower.includes('dentist') || specialtyLower.includes('oral surgery')) {
      return ['Dental Implants', 'Teeth Whitening', 'Invisalign', 'Dental Veneers'];
    } else if (specialtyLower.includes('ophthalmology')) {
      return ['Botox', 'Laser Procedures', 'Injectable Treatments'];
    }
    
    return ['General Procedures'];
  }

  // Estimate practice size
  private estimatePracticeSize(provider: NPIProvider): 'solo' | 'small' | 'medium' | 'large' {
    if (provider.provider_type === 'individual') {
      return 'solo';
    }
    
    // For organizations, estimate based on available data
    const orgName = provider.organization_name?.toLowerCase() || '';
    
    if (orgName.includes('hospital') || orgName.includes('medical center') || orgName.includes('health system')) {
      return 'large';
    } else if (orgName.includes('group') || orgName.includes('associates') || orgName.includes('clinic')) {
      return 'medium';
    } else if (orgName.includes('practice')) {
      return 'small';
    }
    
    return 'small'; // Default
  }

  // Calculate demographic alignment
  private calculateDemographicAlignment(address?: NPIAddress): any {
    if (!address) return {};
    
    return {
      location_type: this.getLocationTypeFromAddress(address),
      market_size: this.estimateMarketSize(address),
      competition_density: 'medium' // Would need additional data for accurate assessment
    };
  }

  // Assess competitive vulnerability
  private assessCompetitiveVulnerability(provider: NPIProvider): any {
    return {
      competitive_pressure: 'medium',
      market_saturation: 'moderate',
      differentiation_opportunities: ['technology', 'service', 'pricing']
    };
  }

  // Helper methods
  private getLocationTypeFromAddress(address: NPIAddress): string {
    const city = address.city?.toLowerCase() || '';
    
    // Major metropolitan areas
    const majorCities = ['new york', 'los angeles', 'chicago', 'houston', 'philadelphia', 'phoenix', 'san antonio', 'san diego', 'dallas', 'san jose'];
    
    if (majorCities.some(city_name => city.includes(city_name))) {
      return 'metropolitan';
    }
    
    return 'suburban';
  }

  private estimateMarketSize(address: NPIAddress): string {
    // This would ideally integrate with census or demographic data
    const locationType = this.getLocationTypeFromAddress(address);
    
    if (locationType === 'metropolitan') {
      return 'large';
    }
    
    return 'medium';
  }

  // Parse NPI API response format
  private parseNPIResponse(data: any): NPISearchResponse {
    // The ClinicalTables API returns data in a specific format
    // This is a simplified parser - the actual API format may vary
    
    if (!data || !Array.isArray(data) || data.length < 2) {
      return { result_count: 0, results: [] };
    }

    const count = data[0] || 0;
    const results = data[1] || [];

    return {
      result_count: count,
      results: results.map((result: any) => this.parseProviderRecord(result))
    };
  }

  private parseProviderRecord(record: any): NPIProvider {
    // Parse individual record from ClinicalTables format
    // This is a simplified implementation
    return {
      npi: record.npi || record[0] || '',
      provider_type: record.provider_type || 'individual',
      first_name: record.first_name || '',
      last_name: record.last_name || '',
      organization_name: record.organization_name || '',
      taxonomy: record.taxonomy || [],
      addresses: record.addresses || [],
      other_names: record.other_names || [],
      identifiers: record.identifiers || [],
      endpoints: record.endpoints || []
    };
  }

  // Bulk discovery for territory expansion
  async discoverPracticesInTerritory(
    territory: { state: string; cities?: string[]; radius?: number },
    specialties: string[] = ['dental', 'aesthetic'],
    limit: number = 100
  ): Promise<EnrichedPractice[]> {
    const allProviders: NPIProvider[] = [];

    for (const specialty of specialties) {
      // Search parameters prepared for NPI query
      const searchLimit = Math.floor(limit / specialties.length);

      // If specific cities provided, search each
      if (territory.cities && territory.cities.length > 0) {
        for (const city of territory.cities) {
          const results = await this.searchBySpecialty(
            specialty as 'dental' | 'aesthetic',
            { state: territory.state, city },
            Math.floor(limit / (specialties.length * territory.cities.length))
          );
          allProviders.push(...results.results);
        }
      } else {
        // Search entire state
        const results = await this.searchBySpecialty(
          specialty as 'dental' | 'aesthetic',
          { state: territory.state },
          Math.floor(limit / specialties.length)
        );
        allProviders.push(...results.results);
      }
    }

    // Remove duplicates by NPI
    const uniqueProviders = allProviders.filter((provider, index, self) => 
      index === self.findIndex(p => p.npi === provider.npi)
    );

    // Enrich with intelligence
    return this.enrichPracticesWithIntelligence(uniqueProviders);
  }
}

// Export singleton instance
export const npiService = new NPIService();
export default npiService;
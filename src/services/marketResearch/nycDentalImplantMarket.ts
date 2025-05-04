/**
 * RepSpheres CRM - NYC Dental Implant Market Research Data
 * 
 * This service provides comprehensive market data on dental implant providers
 * in the New York City market, including their technology stacks, social media presence,
 * and specialties.
 */

import { supabase } from '../supabase/supabase';
import { Practice, PracticeSize } from '../../types/practices';

/**
 * Enum for CBCT scanner manufacturers
 */
export enum CBCTManufacturer {
  CARESTREAM = 'Carestream',
  SIRONA = 'Sirona',
  PLANMECA = 'Planmeca',
  VATECH = 'Vatech',
  KAVO = 'KaVo',
  MORITA = 'Morita',
  INSTRUMENTARIUM = 'Instrumentarium',
  IMAGING_SCIENCES = 'Imaging Sciences',
  OTHER = 'Other'
}

/**
 * Enum for intraoral scanner manufacturers
 */
export enum IntraoralScannerManufacturer {
  ITERO = 'iTero',
  TRIOS = '3Shape TRIOS',
  CARESTREAM = 'Carestream',
  CEREC = 'CEREC Primescan/Omnicam',
  MEDIT = 'Medit',
  PLANMECA = 'Planmeca',
  OTHER = 'Other'
}

/**
 * Enum for implant system manufacturers
 */
export enum ImplantSystemManufacturer {
  STRAUMANN = 'Straumann',
  NOBEL_BIOCARE = 'Nobel Biocare',
  ZIMMER_BIOMET = 'Zimmer Biomet',
  DENTSPLY_SIRONA = 'Dentsply Sirona',
  BICON = 'Bicon',
  BIOHORIZONS = 'BioHorizons',
  OSSTEM = 'Osstem',
  MEGAGEN = 'MegaGen',
  NEODENT = 'Neodent',
  OTHER = 'Other'
}

/**
 * Interface for NYC Dental Implant Provider
 */
export interface NYCDentalImplantProvider {
  id: string;
  name: string;
  address: string;
  website: string;
  phone: string;
  practiceSize: PracticeSize;
  isDSO: boolean; // Dental Service Organization affiliation
  numPractitioners: number;
  isSoloPractitioner: boolean;
  
  // Specialties
  isPeriodontist: boolean;
  isProsthodontist: boolean;
  isOralSurgeon: boolean;
  isGeneralDentist: boolean;
  
  // Technology stack
  hasCBCT: boolean;
  cbctManufacturer?: CBCTManufacturer;
  cbctModel?: string;
  hasIntraoralScanner: boolean;
  intraoralScannerManufacturer?: IntraoralScannerManufacturer;
  intraoralScannerModel?: string;
  hasSurgicalGuides: boolean; // Whether they use surgical guides for implant placement
  surgicalGuideSystem?: string;
  hasInHouseMilling: boolean; // Whether they have in-house milling capabilities
  
  // Implant offerings
  implantSystems: ImplantSystemManufacturer[];
  offersFullArch: boolean;
  offersSameDayImplants: boolean;
  offersAllOn4: boolean;
  offersAllOn6: boolean;
  offersZygomaticImplants: boolean;
  
  // Social media presence
  instagramHandle?: string;
  instagramFollowers?: number;
  instagramPostFrequency?: string; // e.g., "daily", "weekly", "monthly"
  instagramLastPostDate?: Date;
  facebookURL?: string;
  facebookFollowers?: number;
  youtubeChannel?: string;
  youtubeSubscribers?: number;
  linkedInUrl?: string;
  
  // Rating information
  googleRating?: number; // Out of 5
  googleReviewCount?: number;
  yelpRating?: number; // Out of 5
  yelpReviewCount?: number;
  
  // Additional notes
  notes?: string;
  lastUpdated: Date;
}

/**
 * NYC Dental Implant Market Research Service
 */
export const NYCDentalImplantMarketService = {
  /**
   * Fetch all NYC dental implant providers
   */
  async getAllProviders(): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*');
    
    if (error) {
      console.error('Error fetching NYC dental implant providers:', error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get providers by technology
   */
  async getProvidersByTechnology(technology: 'CBCT' | 'IntraoralScanner' | 'SurgicalGuides' | 'InHouseMilling'): Promise<NYCDentalImplantProvider[]> {
    let query;
    
    switch (technology) {
      case 'CBCT':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('hasCBCT', true);
        break;
      case 'IntraoralScanner':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('hasIntraoralScanner', true);
        break;
      case 'SurgicalGuides':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('hasSurgicalGuides', true);
        break;
      case 'InHouseMilling':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('hasInHouseMilling', true);
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching NYC dental implant providers with ${technology}:`, error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get providers by specialty
   */
  async getProvidersBySpecialty(specialty: 'Periodontist' | 'Prosthodontist' | 'OralSurgeon' | 'GeneralDentist'): Promise<NYCDentalImplantProvider[]> {
    let query;
    
    switch (specialty) {
      case 'Periodontist':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('isPeriodontist', true);
        break;
      case 'Prosthodontist':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('isProsthodontist', true);
        break;
      case 'OralSurgeon':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('isOralSurgeon', true);
        break;
      case 'GeneralDentist':
        query = supabase
          .from('nyc_dental_implant_providers')
          .select('*')
          .eq('isGeneralDentist', true);
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching NYC dental implant providers who are ${specialty}s:`, error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get solo practitioners
   */
  async getSoloPractitioners(): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*')
      .eq('isSoloPractitioner', true);
    
    if (error) {
      console.error('Error fetching NYC solo dental implant providers:', error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get providers by implant system
   */
  async getProvidersByImplantSystem(manufacturer: ImplantSystemManufacturer): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*')
      .contains('implantSystems', [manufacturer]);
    
    if (error) {
      console.error(`Error fetching NYC providers using ${manufacturer} implants:`, error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get providers offering full arch solutions
   */
  async getFullArchProviders(): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*')
      .eq('offersFullArch', true);
    
    if (error) {
      console.error('Error fetching NYC full arch implant providers:', error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get providers with active social media
   */
  async getSocialMediaActiveProviders(minFollowers: number = 500): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*')
      .or(`instagramFollowers.gte.${minFollowers},facebookFollowers.gte.${minFollowers},youtubeSubscribers.gte.${minFollowers / 2}`);
    
    if (error) {
      console.error('Error fetching NYC providers with active social media:', error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  },
  
  /**
   * Get highly rated providers 
   */
  async getHighlyRatedProviders(minRating: number = 4.5): Promise<NYCDentalImplantProvider[]> {
    const { data, error } = await supabase
      .from('nyc_dental_implant_providers')
      .select('*')
      .or(`googleRating.gte.${minRating},yelpRating.gte.${minRating}`);
    
    if (error) {
      console.error('Error fetching highly rated NYC providers:', error);
      return [];
    }
    
    return data as NYCDentalImplantProvider[];
  }
};

/**
 * Sample NYC dental implant providers data
 * This would normally be stored in the database but is hardcoded here for demonstration
 */
export const getNYCDentalImplantProvidersSample = (): NYCDentalImplantProvider[] => {
  return [
    {
      id: '1',
      name: 'NYC Dental Implants Center',
      address: '225 East 64th St, Ste 1B, New York, NY',
      website: 'https://www.nycdentalimplantscenter.com',
      phone: '212-256-0000',
      practiceSize: PracticeSize.MEDIUM,
      isDSO: false,
      numPractitioners: 3,
      isSoloPractitioner: false,
      
      isPeriodontist: true,
      isProsthodontist: true,
      isOralSurgeon: false,
      isGeneralDentist: false,
      
      hasCBCT: true,
      cbctManufacturer: CBCTManufacturer.CARESTREAM,
      cbctModel: 'CS 9600',
      hasIntraoralScanner: true,
      intraoralScannerManufacturer: IntraoralScannerManufacturer.ITERO,
      intraoralScannerModel: 'iTero Element 5D',
      hasSurgicalGuides: true,
      surgicalGuideSystem: 'Blue Sky Bio',
      hasInHouseMilling: true,
      
      implantSystems: [
        ImplantSystemManufacturer.STRAUMANN,
        ImplantSystemManufacturer.NOBEL_BIOCARE
      ],
      offersFullArch: true,
      offersSameDayImplants: true,
      offersAllOn4: true,
      offersAllOn6: true,
      offersZygomaticImplants: false,
      
      instagramHandle: 'nycdentalimplantscenter',
      instagramFollowers: 37,
      instagramPostFrequency: 'monthly',
      facebookURL: 'https://www.facebook.com/nycdentalimplantscenter',
      facebookFollowers: 210,
      
      googleRating: 4.8,
      googleReviewCount: 127,
      yelpRating: 4.5,
      yelpReviewCount: 55,
      
      notes: 'State-of-the-art facility specializing exclusively in dental implant procedures.',
      lastUpdated: new Date('2025-04-01')
    },
    {
      id: '2',
      name: 'New York Oral & Maxillofacial Surgery, Dental Implant Center',
      address: '800B 5th Ave, New York, NY',
      website: 'https://www.new-york-oral-surgery.com',
      phone: '212-888-4760',
      practiceSize: PracticeSize.SMALL,
      isDSO: false,
      numPractitioners: 1,
      isSoloPractitioner: true,
      
      isPeriodontist: false,
      isProsthodontist: false,
      isOralSurgeon: true,
      isGeneralDentist: false,
      
      hasCBCT: true,
      cbctManufacturer: CBCTManufacturer.SIRONA,
      hasIntraoralScanner: true,
      intraoralScannerManufacturer: IntraoralScannerManufacturer.CEREC,
      hasSurgicalGuides: true,
      surgicalGuideSystem: 'Simplant',
      hasInHouseMilling: false,
      
      implantSystems: [
        ImplantSystemManufacturer.NOBEL_BIOCARE,
        ImplantSystemManufacturer.ZIMMER_BIOMET
      ],
      offersFullArch: true,
      offersSameDayImplants: true,
      offersAllOn4: true,
      offersAllOn6: false,
      offersZygomaticImplants: true,
      
      instagramHandle: 'nyoralandimplant',
      instagramFollowers: 150,
      instagramPostFrequency: 'weekly',
      facebookURL: 'https://www.facebook.com/newyorkoralsurgery',
      facebookFollowers: 425,
      linkedInUrl: 'https://www.linkedin.com/in/mark-stein-dds-md-8b8b4020',
      
      googleRating: 4.9,
      googleReviewCount: 98,
      yelpRating: 4.7,
      yelpReviewCount: 55,
      
      notes: 'Led by Dr. Mark Stein, DDS, MD, recognized as a Super Doctor in The New York Times. Specializes in complex implant cases.',
      lastUpdated: new Date('2025-03-15')
    },
    {
      id: '3',
      name: 'Columbia Dental Implant Center',
      address: '630 W 168th St, New York, NY',
      website: 'https://www.dental.columbia.edu/teaching-clinics/implant-center',
      phone: '212-305-6100',
      practiceSize: PracticeSize.LARGE,
      isDSO: false,
      numPractitioners: 12,
      isSoloPractitioner: false,
      
      isPeriodontist: true,
      isProsthodontist: true,
      isOralSurgeon: true,
      isGeneralDentist: true,
      
      hasCBCT: true,
      cbctManufacturer: CBCTManufacturer.PLANMECA,
      cbctModel: 'Planmeca ProMax 3D',
      hasIntraoralScanner: true,
      intraoralScannerManufacturer: IntraoralScannerManufacturer.TRIOS,
      intraoralScannerModel: '3Shape TRIOS 4',
      hasSurgicalGuides: true,
      surgicalGuideSystem: '3Shape Implant Studio',
      hasInHouseMilling: true,
      
      implantSystems: [
        ImplantSystemManufacturer.STRAUMANN,
        ImplantSystemManufacturer.NOBEL_BIOCARE,
        ImplantSystemManufacturer.ZIMMER_BIOMET,
        ImplantSystemManufacturer.DENTSPLY_SIRONA
      ],
      offersFullArch: true,
      offersSameDayImplants: false,
      offersAllOn4: true,
      offersAllOn6: true,
      offersZygomaticImplants: true,
      
      instagramHandle: 'columbiademtal',
      instagramFollowers: 2500,
      instagramPostFrequency: 'daily',
      facebookURL: 'https://www.facebook.com/ColumbiaDental',
      facebookFollowers: 3800,
      youtubeChannel: 'https://www.youtube.com/columbiadental',
      youtubeSubscribers: 1200,
      
      googleRating: 4.6,
      googleReviewCount: 245,
      
      notes: 'Academic center with lower costs than private practices. Has access to cutting-edge research and technology.',
      lastUpdated: new Date('2025-04-15')
    },
    {
      id: '4',
      name: 'The Dental Scan Center',
      address: '32 W 23rd St, New York, NY',
      website: 'https://www.thedentalscancenter.com',
      phone: '212-697-3945',
      practiceSize: PracticeSize.SMALL,
      isDSO: false,
      numPractitioners: 2,
      isSoloPractitioner: false,
      
      isPeriodontist: false,
      isProsthodontist: false,
      isOralSurgeon: false,
      isGeneralDentist: true,
      
      hasCBCT: true,
      cbctManufacturer: CBCTManufacturer.VATECH,
      cbctModel: 'Green CT',
      hasIntraoralScanner: false,
      hasSurgicalGuides: false,
      hasInHouseMilling: false,
      
      implantSystems: [],
      offersFullArch: false,
      offersSameDayImplants: false,
      offersAllOn4: false,
      offersAllOn6: false,
      offersZygomaticImplants: false,
      
      instagramHandle: 'dentalscancenter',
      instagramFollowers: 120,
      instagramPostFrequency: 'monthly',
      
      googleRating: 4.7,
      googleReviewCount: 78,
      
      notes: 'Specialized imaging center that provides CBCT scanning services to other dental practices.',
      lastUpdated: new Date('2025-02-10')
    },
    {
      id: '5',
      name: '3D Imaging Center',
      address: '65 Broadway, Suite 904, New York, NY',
      website: 'https://www.3dimagingcenter.com',
      phone: '212-425-2005',
      practiceSize: PracticeSize.SMALL,
      isDSO: false,
      numPractitioners: 1,
      isSoloPractitioner: true,
      
      isPeriodontist: false,
      isProsthodontist: false,
      isOralSurgeon: false,
      isGeneralDentist: true,
      
      hasCBCT: true,
      cbctManufacturer: CBCTManufacturer.IMAGING_SCIENCES,
      cbctModel: 'i-CAT FLX',
      hasIntraoralScanner: false,
      hasSurgicalGuides: false,
      hasInHouseMilling: false,
      
      implantSystems: [],
      offersFullArch: false,
      offersSameDayImplants: false,
      offersAllOn4: false,
      offersAllOn6: false,
      offersZygomaticImplants: false,
      
      instagramHandle: '3dimagingnyc',
      instagramFollowers: 85,
      instagramPostFrequency: 'rarely',
      
      googleRating: 4.5,
      googleReviewCount: 42,
      
      notes: 'Focused exclusively on providing 3D imaging services for dentists and specialists in the NYC area.',
      lastUpdated: new Date('2025-01-20')
    }
  ];
};

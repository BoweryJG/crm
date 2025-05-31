/**
 * RepSpheres CRM - Aesthetic Procedures
 * 
 * This file defines types for aesthetic procedures that are relevant to
 * sales representatives working with aesthetic practitioners.
 */

export enum ProcedureCategory {
  INJECTABLES = 'injectables',
  FACIAL_TREATMENTS = 'facial_treatments',
  LASER_PROCEDURES = 'laser_procedures',
  BODY_CONTOURING = 'body_contouring',
  SKIN_REJUVENATION = 'skin_rejuvenation',
  HAIR_TREATMENTS = 'hair_treatments',
  TATTOO_REMOVAL = 'tattoo_removal',
  VEIN_TREATMENTS = 'vein_treatments',
  SKINCARE = 'skincare',
  OTHER = 'other'
}

export interface ProcedureCost {
  low: number;
  high: number;
  average: number;
  currency: string; // USD, EUR, etc.
}

export interface ProcedureSupplies {
  productId: string;
  productName: string;
  productCategory: string;
  manufacturer: string;
  usagePerProcedure: string;
  isEssential: boolean;
}

export interface ProcedureEquipment {
  type: string;
  manufacturer: string[];
  commonModels: string[];
  approximateCost: ProcedureCost;
  leaseOptions: boolean;
}

export interface AestheticProcedure {
  id: string;
  name?: string;
  procedure_name?: string; // Database field name
  alternateNames?: string[];
  category?: ProcedureCategory | string; // Allow string for database compatibility
  description?: string;
  
  // Database analytics fields (required for analytics)
  yearly_growth_percentage?: number | null;
  market_size_usd_millions?: number | null;
  
  // Optional detailed fields
  patientConcerns?: string[]; // What patient problems does this address
  popularity?: number; // 1-10 scale
  averageCost?: ProcedureCost;
  procedureTime?: { // Time in minutes
    min: number;
    max: number;
    avg: number;
  };
  recoveryTime?: string; // e.g. "3-5 days", "2 weeks"
  painLevel?: number; // 1-10 scale
  risks?: string[];
  contraindications?: string[];
  preCareProcedure?: string;
  postCareProcedure?: string;
  results?: {
    duration: string; // How long results typically last
    timeToResults: string; // When results become visible
    maintenanceNeeded: boolean;
    maintenanceFrequency: string;
  };
  // Training and certification
  trainingRequired?: string[];
  certificationNeeded?: boolean;
  certificationSource?: string[];
  // Business aspects
  typicalROI?: string; // Return on investment information
  marketingTips?: string[]; // How to market this procedure
  targetDemographic?: string[];
  patientRetention?: string; // How this procedure helps retain patients
  supplies?: ProcedureSupplies[];
  equipment?: ProcedureEquipment[];
  // Related procedures
  complementaryProcedures?: string[]; // IDs of complementary procedures
  alternativeProcedures?: string[]; // IDs of alternative procedures
  // Content
  beforeAfterImages?: string[]; // URLs to before/after images
  videos?: string[]; // URLs to procedure videos
  scientificStudies?: string[]; // URLs or references to studies
  marketingMaterials?: string[]; // URLs to marketing materials
  consentForms?: string[]; // URLs to sample consent forms
  // Meta information
  createdAt?: string;
  updatedAt?: string;
  lastReviewedAt?: string;
}

export interface ProcedureFilterOptions {
  categories?: ProcedureCategory[];
  popularity?: number; // Minimum popularity level
  maxRecoveryTime?: string;
  maxPainLevel?: number;
  trainingLevel?: string[];
  requiresCertification?: boolean;
  costRange?: {
    min?: number;
    max?: number;
  };
  equipmentCost?: {
    min?: number;
    max?: number;
  };
  procedureTime?: {
    max?: number; // Maximum procedure time in minutes
  };
  resultsDuration?: string; // Minimum results duration
}

export interface ProcedureListItem {
  id: string;
  name: string;
  category: ProcedureCategory;
  popularity: number;
  averageCost: number;
  procedureTime: number; // Average time in minutes
  recoveryTime: string;
  resultsDuration: string;
  equipmentCost: number; // Average equipment cost
  requiresCertification: boolean;
}

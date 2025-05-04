/**
 * RepSpheres CRM - Practice Management Types
 * 
 * This file contains type definitions for medical practices, clinics, and offices
 * that medical sales representatives work with in the dental and aesthetic industries.
 */

export enum PracticeType {
  GENERAL_DENTAL = 'general_dental',
  SPECIALTY_DENTAL = 'specialty_dental',
  DENTAL_GROUP = 'dental_group',
  DENTAL_DSO = 'dental_dso',  // Dental Service Organization
  DENTAL_SCHOOL = 'dental_school',
  AESTHETIC_CLINIC = 'aesthetic_clinic',
  MEDICAL_SPA = 'medical_spa',
  PLASTIC_SURGERY_CENTER = 'plastic_surgery_center',
  DERMATOLOGY_CLINIC = 'dermatology_clinic',
  MULTI_SPECIALTY = 'multi_specialty',
  HOSPITAL = 'hospital',
  HEALTH_SYSTEM = 'health_system',
  OTHER = 'other'
}

export enum PracticeStatus {
  ACTIVE = 'active',
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  INACTIVE = 'inactive',
  DO_NOT_CONTACT = 'do_not_contact'
}

export enum PracticeSize {
  SOLO = 'solo',              // Single practitioner
  SMALL = 'small',            // 2-5 practitioners
  MEDIUM = 'medium',          // 6-15 practitioners
  LARGE = 'large',            // 16-30 practitioners
  ENTERPRISE = 'enterprise'   // >30 practitioners
}

export enum PracticeTechnology {
  DIGITAL_IMPRESSIONS = 'digital_impressions',
  CAD_CAM = 'cad_cam',
  CBCT = 'cbct', // Cone Beam Computed Tomography
  INTRAORAL_SCANNER = 'intraoral_scanner',
  LASER_DENTISTRY = 'laser_dentistry',
  PANORAMIC_XRAY = 'panoramic_xray',
  CEPHALOMETRIC_XRAY = 'cephalometric_xray',
  DIGITAL_XRAY = 'digital_xray',
  PRACTICE_MANAGEMENT_SOFTWARE = 'practice_management_software',
  LASERS_AESTHETIC = 'lasers_aesthetic',
  RADIOFREQUENCY_DEVICES = 'radiofrequency_devices',
  ULTRASOUND_DEVICES = 'ultrasound_devices',
  MICRONEEDLING = 'microneedling',
  CRYOLIPOLYSIS = 'cryolipolysis',
  HIFU = 'hifu', // High Intensity Focused Ultrasound
  PLASMA_TECHNOLOGY = 'plasma_technology',
  OTHER = 'other'
}

export interface PracticeAddress {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isMain: boolean; // Is this the main location
}

export interface PracticeSpecialty {
  name: string;    // e.g., "Implantology", "Botox & Fillers"
  primary: boolean; // Is this a primary specialty
}

export interface PracticeProcedure {
  id: string;
  practiceId: string;
  procedureId: string; // Reference to procedure from knowledge base
  procedureName: string; // Denormalized for quick access
  isPerforming: boolean; // Does the practice perform this procedure
  isInterested: boolean; // Is the practice interested in products for this procedure
  volume?: string; // Estimated monthly/annual volume
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeProduct {
  id: string;
  practiceId: string;
  productId: string; // Reference to product database
  productName: string; // Denormalized for quick access
  isUsing: boolean; // Does the practice use this product
  isInterested: boolean; // Is the practice interested in this product
  competitorAlternative?: string; // What competitor product are they using instead
  purchaseFrequency?: string; // How often they purchase
  volume?: string; // Monthly/annual usage
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeRevenue {
  id: string;
  practiceId: string;
  year: number;
  estimatedAnnual: number; // Estimated annual revenue
  currency: string; // Currency code (USD, EUR, etc.)
  source: string; // Source of this information
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Practice {
  id: string;
  name: string;
  type: PracticeType;
  size: PracticeSize;
  status: PracticeStatus;
  website?: string;
  phone?: string;
  email?: string;
  addresses: PracticeAddress[];
  specialties: PracticeSpecialty[];
  technologies: PracticeTechnology[];
  yearEstablished?: number;
  numberOfPractitioners?: number;
  numberOfStaff?: number;
  numberOfOperatories?: number; // For dental practices
  numberOfTreatmentRooms?: number; // For aesthetic practices
  decisionMakingProcess?: string;
  purchasingProcess?: string;
  budget?: string;
  annualSpend?: number;
  patientVolume?: string; // Daily/monthly/annual patient volume
  profileImageUrl?: string;
  logoUrl?: string;
  notes: string;
  custom?: Record<string, any>; // For custom fields
  tags: string[];
  createdBy: string; // User ID
  assignedTo: string; // User ID
  createdAt: string;
  updatedAt: string;
  // Relationships will be managed separately
  parentPracticeId?: string; // For practices that are part of a group
}

export interface PracticeListItem {
  id: string;
  name: string;
  type: PracticeType;
  size: PracticeSize;
  status: PracticeStatus;
  city: string;
  state: string;
  primarySpecialty?: string;
  contactCount: number; // Number of contacts associated
  keyContactName?: string; // Name of primary contact
  assignedToName: string; // Denormalized for display
}

export interface PracticeFilter {
  search?: string;
  types?: PracticeType[];
  sizes?: PracticeSize[];
  statuses?: PracticeStatus[];
  specialties?: string[];
  technologies?: PracticeTechnology[];
  locations?: {
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  assignedToIds?: string[];
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
  annualSpendMin?: number;
  annualSpendMax?: number;
}

export interface PracticeSortOption {
  field: keyof PracticeListItem;
  direction: 'asc' | 'desc';
}

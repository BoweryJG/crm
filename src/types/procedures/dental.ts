/**
 * RepSpheres CRM - Dental Procedures
 * 
 * This file defines types for dental procedures that are relevant to
 * sales representatives working with dental practitioners.
 */

export enum DentalProcedureCategory {
  DIAGNOSTIC = 'diagnostic',
  PREVENTIVE = 'preventive',
  RESTORATIVE = 'restorative',
  ENDODONTICS = 'endodontics',
  PERIODONTICS = 'periodontics',
  PROSTHODONTICS = 'prosthodontics',
  IMPLANTOLOGY = 'implantology',
  ORAL_SURGERY = 'oral_surgery',
  ORTHODONTICS = 'orthodontics',
  COSMETIC_DENTISTRY = 'cosmetic_dentistry',
  PEDIATRIC_DENTISTRY = 'pediatric_dentistry',
  DIGITAL_DENTISTRY = 'digital_dentistry',
  OTHER = 'other'
}

export enum DentalInsuranceCode {
  // Diagnostic codes
  D0120 = 'd0120', // Periodic oral evaluation
  D0140 = 'd0140', // Limited oral evaluation
  D0150 = 'd0150', // Comprehensive oral evaluation
  D0210 = 'd0210', // Intraoral complete series of radiographic images
  D0220 = 'd0220', // Intraoral periapical first radiographic image
  D0230 = 'd0230', // Intraoral periapical each additional radiographic image
  D0330 = 'd0330', // Panoramic radiographic image
  D0350 = 'd0350', // Oral/facial photographic images
  D0470 = 'd0470', // Diagnostic casts
  
  // Preventive codes
  D1110 = 'd1110', // Prophylaxis - adult
  D1120 = 'd1120', // Prophylaxis - child
  D1206 = 'd1206', // Topical application of fluoride varnish
  D1208 = 'd1208', // Topical application of fluoride
  D1351 = 'd1351', // Sealant - per tooth
  
  // Restorative codes
  D2140 = 'd2140', // Amalgam - one surface, primary or permanent
  D2150 = 'd2150', // Amalgam - two surfaces, primary or permanent
  D2160 = 'd2160', // Amalgam - three surfaces, primary or permanent
  D2161 = 'd2161', // Amalgam - four or more surfaces, primary or permanent
  D2330 = 'd2330', // Resin-based composite - one surface, anterior
  D2331 = 'd2331', // Resin-based composite - two surfaces, anterior
  D2332 = 'd2332', // Resin-based composite - three surfaces, anterior
  D2335 = 'd2335', // Resin-based composite - four or more surfaces, anterior
  D2390 = 'd2390', // Resin-based composite crown, anterior
  D2391 = 'd2391', // Resin-based composite - one surface, posterior
  D2392 = 'd2392', // Resin-based composite - two surfaces, posterior
  D2393 = 'd2393', // Resin-based composite - three surfaces, posterior
  D2394 = 'd2394', // Resin-based composite - four or more surfaces, posterior
  D2740 = 'd2740', // Crown - porcelain/ceramic
  D2750 = 'd2750', // Crown - porcelain fused to high noble metal
  D2751 = 'd2751', // Crown - porcelain fused to predominantly base metal
  D2752 = 'd2752', // Crown - porcelain fused to noble metal
  D2950 = 'd2950', // Core buildup, including any pins when required
  D2952 = 'd2952', // Cast post and core in addition to crown
  D2954 = 'd2954', // Prefabricated post and core in addition to crown
  D2960 = 'd2960', // Labial veneer (resin laminate) - chairside
  D2961 = 'd2961', // Labial veneer (resin laminate) - laboratory
  D2962 = 'd2962', // Labial veneer (porcelain laminate) - laboratory
  
  // Endodontic codes
  D3110 = 'd3110', // Pulp cap - direct (excluding final restoration)
  D3120 = 'd3120', // Pulp cap - indirect (excluding final restoration)
  D3220 = 'd3220', // Therapeutic pulpotomy (excluding final restoration)
  D3310 = 'd3310', // Endodontic therapy, anterior tooth (excluding final restoration)
  D3320 = 'd3320', // Endodontic therapy, premolar tooth (excluding final restoration)
  D3330 = 'd3330', // Endodontic therapy, molar tooth (excluding final restoration)
  
  // Periodontic codes
  D4210 = 'd4210', // Gingivectomy or gingivoplasty - four or more contiguous teeth
  D4211 = 'd4211', // Gingivectomy or gingivoplasty - one to three contiguous teeth
  D4240 = 'd4240', // Gingival flap procedure, four or more contiguous teeth
  D4241 = 'd4241', // Gingival flap procedure, one to three contiguous teeth
  D4249 = 'd4249', // Clinical crown lengthening - hard tissue
  D4260 = 'd4260', // Osseous surgery - four or more contiguous teeth
  D4263 = 'd4263', // Bone replacement graft - retained natural tooth - first site
  D4264 = 'd4264', // Bone replacement graft - retained natural tooth - each additional site
  D4341 = 'd4341', // Periodontal scaling and root planing - four or more teeth per quadrant
  D4342 = 'd4342', // Periodontal scaling and root planing - one to three teeth per quadrant
  D4355 = 'd4355', // Full mouth debridement
  D4910 = 'd4910', // Periodontal maintenance
  
  // Prosthodontic codes
  D5110 = 'd5110', // Complete denture - maxillary
  D5120 = 'd5120', // Complete denture - mandibular
  D5130 = 'd5130', // Immediate denture - maxillary
  D5140 = 'd5140', // Immediate denture - mandibular
  D5211 = 'd5211', // Maxillary partial denture - resin base
  D5212 = 'd5212', // Mandibular partial denture - resin base
  D5213 = 'd5213', // Maxillary partial denture - cast metal framework with resin base
  D5214 = 'd5214', // Mandibular partial denture - cast metal framework with resin base
  D5820 = 'd5820', // Interim partial denture (maxillary)
  D5821 = 'd5821', // Interim partial denture (mandibular)
  
  // Implant services
  D6010 = 'd6010', // Surgical placement of implant body: endosteal implant
  D6056 = 'd6056', // Prefabricated abutment - includes modification and placement
  D6057 = 'd6057', // Custom fabricated abutment - includes placement
  D6058 = 'd6058', // Abutment supported porcelain/ceramic crown
  D6059 = 'd6059', // Abutment supported porcelain fused to metal crown (high noble metal)
  D6060 = 'd6060', // Abutment supported porcelain fused to metal crown (predominantly base metal)
  D6061 = 'd6061', // Abutment supported porcelain fused to metal crown (noble metal)
  D6065 = 'd6065', // Implant supported porcelain/ceramic crown
  
  // Oral Surgery
  D7140 = 'd7140', // Extraction, erupted tooth or exposed root
  D7210 = 'd7210', // Extraction, erupted tooth requiring removal of bone and/or sectioning of tooth
  D7220 = 'd7220', // Removal of impacted tooth - soft tissue
  D7230 = 'd7230', // Removal of impacted tooth - partially bony
  D7240 = 'd7240', // Removal of impacted tooth - completely bony
  
  // Orthodontics
  D8010 = 'd8010', // Limited orthodontic treatment of the primary dentition
  D8020 = 'd8020', // Limited orthodontic treatment of the transitional dentition
  D8030 = 'd8030', // Limited orthodontic treatment of the adolescent dentition
  D8040 = 'd8040', // Limited orthodontic treatment of the adult dentition
  D8070 = 'd8070', // Comprehensive orthodontic treatment of the transitional dentition
  D8080 = 'd8080', // Comprehensive orthodontic treatment of the adolescent dentition
  D8090 = 'd8090', // Comprehensive orthodontic treatment of the adult dentition
  D8660 = 'd8660', // Pre-orthodontic treatment examination to monitor growth and development
  D8680 = 'd8680'  // Orthodontic retention (removal of appliances, construction and placement of retainer(s))
}

export interface ProcedureCost {
  low: number;
  high: number;
  average: number;
  currency: string; // USD, EUR, etc.
  insuranceDetails: {
    typicallyCovered: boolean;
    averageCoverage: number; // Percentage 0-100
    notes: string;
  };
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

export interface DentalProcedure {
  id: string;
  name?: string;
  procedure_name?: string; // Database field name
  alternateNames?: string[];
  category?: DentalProcedureCategory | string; // Allow string for database compatibility
  description?: string;
  // Database analytics fields (required for analytics)
  yearly_growth_percentage?: number | null;
  market_size_usd_millions?: number | null;
  
  // Optional detailed fields
  insuranceCodes?: DentalInsuranceCode[];
  patientConcerns?: string[]; // What patient problems does this address
  frequency?: string; // How common is this procedure in practice
  averageCost?: ProcedureCost;
  procedureTime?: { // Time in minutes
    min: number;
    max: number;
    avg: number;
  };
  painLevel?: number; // 1-10 scale
  risks?: string[];
  contraindications?: string[];
  preCareProcedure?: string;
  postCareProcedure?: string;
  results?: {
    durability: string; // How long results typically last
    successRate: string;
    maintenanceNeeded: boolean;
    maintenanceFrequency: string;
  };
  // Training and certification
  specialtyRequired?: boolean; // Is a specialty required to perform this
  commonPerformers?: string[]; // What types of dentists perform this
  trainingRequired?: string[];
  // Business aspects
  typicalROI?: string; // Return on investment information
  marketingTips?: string[]; // How to market this procedure
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
  patientEducationMaterials?: string[]; // URLs to patient education materials
  consentForms?: string[]; // URLs to sample consent forms
  // Meta information
  createdAt?: string;
  updatedAt?: string;
  lastReviewedAt?: string;
}

export interface DentalProcedureFilterOptions {
  categories?: DentalProcedureCategory[];
  insuranceCodes?: DentalInsuranceCode[];
  typicallyCovered?: boolean;
  painLevel?: number; // Maximum pain level
  specialtyRequired?: boolean;
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
}

export interface DentalProcedureListItem {
  id: string;
  name: string;
  category: DentalProcedureCategory;
  insuranceCodes: DentalInsuranceCode[];
  typicallyCovered: boolean;
  averageCost: number;
  procedureTime: number; // Average time in minutes
  specialtyRequired: boolean;
  commonPerformers: string[];
  equipmentRequired: boolean;
}

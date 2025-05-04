/**
 * RepSpheres CRM - Common Procedure Types
 * 
 * This file defines common types shared between dental and aesthetic procedures
 * to avoid duplication and type conflicts.
 */

export interface ProcedureCost {
  low: number;
  high: number;
  average: number;
  currency: string; // USD, EUR, etc.
  insuranceDetails?: {
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

export interface ProcedureBase {
  id: string;
  name: string;
  alternateNames: string[];
  description: string;
  patientConcerns: string[]; // What patient problems does this address
  averageCost: ProcedureCost;
  procedureTime: { // Time in minutes
    min: number;
    max: number;
    avg: number;
  };
  painLevel: number; // 1-10 scale
  risks: string[];
  contraindications: string[];
  preCareProcedure: string;
  postCareProcedure: string;
  // Meta information
  createdAt: string;
  updatedAt: string;
  lastReviewedAt: string;
}

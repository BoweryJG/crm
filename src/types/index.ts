/**
 * RepSpheres CRM - Type Definitions Index
 * 
 * This file exports all type definitions used in the RepSpheres CRM
 * for medical sales representatives in the dental and aesthetic industries.
 */

// Re-export value types
export * from './contacts';
export * from './practices';
export * from './companies';
export * from './callAnalysis';

// Export value enums from aesthetic procedures
export { ProcedureCategory as AestheticProcedureCategory } from './procedures/aesthetic';

// Export interface types from aesthetic procedures
export type { 
  AestheticProcedure,
  ProcedureFilterOptions as AestheticProcedureFilterOptions,
  ProcedureListItem as AestheticProcedureListItem
} from './procedures/aesthetic';

// Export value enums from dental procedures
export { 
  DentalProcedureCategory,
  DentalInsuranceCode
} from './procedures/dental';

// Export interface types from dental procedures
export type {
  DentalProcedure,
  DentalProcedureFilterOptions,
  DentalProcedureListItem
} from './procedures/dental';

// Common procedure types interfaces
export type { 
  ProcedureCost, 
  ProcedureSupplies, 
  ProcedureEquipment,
  ProcedureBase
} from './procedures/common';

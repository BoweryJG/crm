/**
 * RepSpheres CRM - Contact Management Types
 * 
 * This file contains type definitions for contacts, which are tailored
 * for medical sales representatives in the dental and aesthetic industries.
 */

export enum ContactType {
  DENTIST = 'dentist',
  ORAL_SURGEON = 'oral_surgeon',
  PERIODONTIST = 'periodontist',
  ORTHODONTIST = 'orthodontist',
  ENDODONTIST = 'endodontist',
  PROSTHODONTIST = 'prosthodontist',
  PEDIATRIC_DENTIST = 'pediatric_dentist',
  DENTAL_HYGIENIST = 'dental_hygienist',
  DENTAL_ASSISTANT = 'dental_assistant',
  AESTHETIC_DOCTOR = 'aesthetic_doctor',
  PLASTIC_SURGEON = 'plastic_surgeon',
  DERMATOLOGIST = 'dermatologist',
  COSMETIC_DERMATOLOGIST = 'cosmetic_dermatologist',
  NURSE_PRACTITIONER = 'nurse_practitioner',
  PHYSICIAN_ASSISTANT = 'physician_assistant',
  AESTHETICIAN = 'aesthetician',
  PRACTICE_MANAGER = 'practice_manager',
  OFFICE_MANAGER = 'office_manager',
  OTHER = 'other'
}

export enum ContactSpecialization {
  GENERAL_DENTISTRY = 'general_dentistry',
  COSMETIC_DENTISTRY = 'cosmetic_dentistry',
  IMPLANTOLOGY = 'implantology',
  PROSTHODONTICS = 'prosthodontics',
  ORTHODONTICS = 'orthodontics',
  ENDODONTICS = 'endodontics',
  PERIODONTICS = 'periodontics',
  PEDIATRIC_DENTISTRY = 'pediatric_dentistry',
  ORAL_SURGERY = 'oral_surgery',
  FACIAL_AESTHETICS = 'facial_aesthetics',
  INJECTABLES = 'injectables',
  BOTOX_FILLERS = 'botox_fillers',
  LASER_TREATMENTS = 'laser_treatments',
  SKIN_CARE = 'skin_care',
  BODY_CONTOURING = 'body_contouring',
  HAIR_RESTORATION = 'hair_restoration',
  TATTOO_REMOVAL = 'tattoo_removal',
  SCAR_REVISION = 'scar_revision',
  GENERAL_PLASTIC_SURGERY = 'general_plastic_surgery',
  OTHER = 'other'
}

export enum ContactStatus {
  ACTIVE = 'active',
  LEAD = 'lead',
  PROSPECT = 'prospect',
  CUSTOMER = 'customer',
  INACTIVE = 'inactive',
  DO_NOT_CONTACT = 'do_not_contact'
}

export enum ContactInteractionType {
  EMAIL = 'email',
  PHONE = 'phone',
  VIDEO_CALL = 'video_call',
  IN_PERSON = 'in_person',
  SOCIAL_MEDIA = 'social_media',
  EVENT = 'event',
  TRADE_SHOW = 'trade_show',
  CONFERENCE = 'conference',
  DEMO = 'demo',
  TRAINING = 'training',
  FOLLOW_UP = 'follow_up',
  OTHER = 'other'
}

export interface ContactInteraction {
  id: string;
  contactId: string;
  userId: string; // The sales rep who had the interaction
  type: ContactInteractionType;
  date: string; // ISO date string
  notes: string;
  outcome: string;
  followUpDate?: string; // Optional follow-up date
  createdAt: string;
  updatedAt: string;
}

export interface ContactProcedure {
  id: string;
  contactId: string;
  procedureId: string; // Reference to procedure from knowledge base
  procedureName: string; // Denormalized for quick access
  isPerforming: boolean; // Does the contact perform this procedure
  isInterested: boolean; // Is the contact interested in products for this procedure
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactProduct {
  id: string;
  contactId: string;
  productId: string; // Reference to product database
  productName: string; // Denormalized for quick access
  isUsing: boolean; // Does the contact use this product
  isInterested: boolean; // Is the contact interested in this product
  competitorAlternative?: string; // What competitor product are they using instead
  purchaseFrequency?: string; // How often they purchase
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  type: ContactType;
  specializations: ContactSpecialization[];
  status: ContactStatus;
  practiceId?: string; // Reference to practice if associated
  practiceName?: string; // Denormalized for quick access
  profileImageUrl?: string;
  decisionMaker: boolean;
  influencer: boolean;
  purchaser: boolean;
  notes: string;
  birthday?: string; // ISO date string, day and month only
  lastInteractionDate?: string; // ISO date string
  lastInteractionType?: ContactInteractionType;
  custom?: Record<string, any>; // For custom fields
  tags: string[];
  createdBy: string; // User ID
  assignedTo: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface ContactListItem {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Computed field
  email: string;
  phone?: string;
  title?: string;
  type: ContactType;
  status: ContactStatus;
  practiceName?: string;
  lastInteractionDate?: string;
  assignedToName: string; // Denormalized for display
}

export interface ContactFilter {
  search?: string;
  types?: ContactType[];
  specializations?: ContactSpecialization[];
  statuses?: ContactStatus[];
  practiceIds?: string[];
  assignedToIds?: string[];
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
  interactedAfter?: string;
  interactedBefore?: string;
}

export interface ContactSortOption {
  field: keyof ContactListItem;
  direction: 'asc' | 'desc';
}

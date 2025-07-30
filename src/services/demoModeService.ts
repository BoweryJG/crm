import { isAdminUser } from '../config/adminUsers';

// Specialty to Industry Mapping
export const SPECIALTY_TO_INDUSTRY: Record<string, 'dental' | 'aesthetic' | 'other'> = {
  // Dental Specialties
  'Oral Surgeon': 'dental',
  'Oral Surgery': 'dental',
  'General Dentist': 'dental',
  'General Dentistry': 'dental',
  'Periodontist': 'dental',
  'Periodontics': 'dental',
  'Prosthodontist': 'dental',
  'Endodontist': 'dental',
  'Endodontics': 'dental',
  'Orthodontist': 'dental',
  'Orthodontics': 'dental',
  'Pediatric Dentist': 'dental',
  'Pediatric Dentistry': 'dental',
  'Dental Office Team Member': 'dental',
  'Dental Lab Technician': 'dental',
  'Cosmetic Dentistry': 'dental',
  'Implant Dentistry': 'dental',
  'Family Dentistry': 'dental',
  
  // Aesthetic Specialties - PRIMARY MARKET
  'Dermatologist': 'aesthetic',
  'Dermatology': 'aesthetic',
  'Plastic Surgeon': 'aesthetic',
  'Plastic Surgery': 'aesthetic',
  'Aesthetic Medicine': 'aesthetic',
  'Cosmetic Surgery': 'aesthetic',
  'Cosmetic Surgeon': 'aesthetic',
  'Aesthetic Nurse': 'aesthetic',
  'Aesthetic Nurse Practitioner': 'aesthetic',
  'Medical Spa': 'aesthetic',
  'Med Spa': 'aesthetic',
  'MedSpa': 'aesthetic',
  'Medical Spa Owner': 'aesthetic',
  'Med Spa Owner': 'aesthetic',
  'MedSpa Owner': 'aesthetic',
  'Aesthetic Practice': 'aesthetic',
  'Cosmetic Dermatology': 'aesthetic',
  'Facial Plastic Surgery': 'aesthetic',
  'Oculoplastic Surgery': 'aesthetic',
  'Aesthetic Physician': 'aesthetic',
  'Regenerative Medicine': 'aesthetic',
  'Anti-Aging Medicine': 'aesthetic',
  'Wellness Center': 'aesthetic',
  'Beauty & Wellness': 'aesthetic',
  'Integrative Medicine': 'aesthetic',
  'Family Medicine': 'aesthetic', // Often offer aesthetic services
  'General Practice': 'aesthetic', // Often offer aesthetic services
  'Internal Medicine': 'aesthetic', // Growing aesthetic segment
  'OB/GYN': 'aesthetic', // Vaginal rejuvenation market
  'Gynecology': 'aesthetic',
  
  // Other
  'Student': 'other',
  'Student/Other': 'other',
  'Other': 'other'
};

// Categorize a practice based on specialty
export const categorizePractice = (specialty: string | null | undefined): 'dental' | 'aesthetic' | 'other' => {
  if (!specialty) return 'other';
  return SPECIALTY_TO_INDUSTRY[specialty] || 'other';
};

// Demo Mode Configuration
export interface DemoModeConfig {
  isDemo: boolean;
  canWrite: boolean;
  dataLimit: number | null;
  features: 'all' | 'readonly' | 'limited';
  showUpgradePrompts: boolean;
  mockDataEnabled: boolean;
}

export const getDemoModeConfig = (user: any): DemoModeConfig => {
  // Admins bypass demo mode entirely
  if (user && isAdminUser(user?.email)) {
    return {
      isDemo: false,
      canWrite: true,
      dataLimit: null,
      features: 'all',
      showUpgradePrompts: false,
      mockDataEnabled: false
    };
  }
  
  // Check user metadata for demo_mode flag
  if (user?.user_metadata?.demo_mode === true) {
    return {
      isDemo: true,
      canWrite: false,
      dataLimit: 40, // Show only public_contacts (40 mock records)
      features: 'readonly',
      showUpgradePrompts: true,
      mockDataEnabled: true
    };
  }
  
  // Authenticated non-admin users
  if (user) {
    return {
      isDemo: false,
      canWrite: true,
      dataLimit: 5000, // Their actual contact limit
      features: 'all',
      showUpgradePrompts: true,
      mockDataEnabled: false
    };
  }
  
  // Public/Demo users (not logged in)
  return {
    isDemo: true,
    canWrite: false,
    dataLimit: 40, // Show only public_contacts
    features: 'readonly',
    showUpgradePrompts: true,
    mockDataEnabled: true
  };
};

// Mock activity generator for demo mode
export const generateMockActivity = (contactName: string, specialty: string) => {
  const dentalActivities = [
    `Discussed YOMI robotic surgery system with ${contactName}`,
    `${contactName} requested pricing for implant navigation system`,
    `Scheduled hands-on demo of digital workflow solutions`,
    `Sent full-arch restoration case studies to ${contactName}`,
    `${contactName} interested in Q1 implementation of guided surgery`
  ];
  
  const aestheticActivities = [
    `Discussed BTL Exilis Ultra 360 with ${contactName}`,
    `${contactName} comparing CoolSculpting vs Emsculpt NEO options`,
    `Scheduled demo of Morpheus8 RF microneedling system`,
    `${contactName} requested ROI analysis for HydraFacial MD`,
    `Sent IPL vs BBL comparison guide to ${contactName}`,
    `${contactName} expanding med spa with body contouring services`,
    `Demo scheduled for Sofwave ultrasound skin tightening`,
    `${contactName} interested in vaginal rejuvenation technology`
  ];
  
  const activities = specialty === 'dental' ? dentalActivities : aestheticActivities;
  return activities[Math.floor(Math.random() * activities.length)];
};

// Generate realistic metrics for demo mode
export const generateDemoMetrics = () => {
  return {
    totalRevenue: 4237500, // $4.2M
    pipelineValue: 8945000, // $8.9M
    conversionRate: 87,
    activeDealCount: 124,
    weeklyGrowth: 12.5,
    topPerformingTerritory: 'Northeast',
    hotLeads: 34,
    atRiskDeals: 7,
    upcomingMeetings: 18
  };
};

// Check if an operation should be blocked in demo mode
export const isDemoBlocked = (user: any, operation: string): boolean => {
  const config = getDemoModeConfig(user);
  
  if (!config.isDemo) return false;
  
  const blockedOperations = [
    'create', 'update', 'delete', 'edit',
    'upload', 'save', 'send', 'call', 'sms',
    'export', 'import', 'sync'
  ];
  
  return blockedOperations.some(blocked => 
    operation.toLowerCase().includes(blocked)
  );
};

// Get demo-safe version of sensitive data
export const sanitizeForDemo = (data: any, field: string): any => {
  const sensitiveFields = ['phone', 'email', 'address', 'ssn', 'apiKey'];
  
  if (sensitiveFields.includes(field)) {
    if (field === 'phone') return '(555) 555-XXXX';
    if (field === 'email') return 'demo@example.com';
    if (field === 'address') return '123 Demo Street';
    return '[REDACTED]';
  }
  
  return data;
};
import { Contact } from '../../types/models';
import { Practice, PracticeSize } from '../../types/practices';
import {
  ResearchProject,
  ResearchDocument,
  ResearchTask,
  ResearchPrompt,
  ResearchNote,
  ResearchDataQuery,
  ResearchProjectStatus,
  ResearchDocumentType,
  ResearchTaskStatus
} from '../../types/research';

// Import the actual array generators from mockLinguisticsData.ts
import {
  generateMultipleMockLinguisticsAnalyses,
  generateMultipleMockCallAnalysesWithLinguistics
} from './mockLinguisticsData';

const mockUserId = '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd';

// Import types or define interfaces for call analysis data
interface CallAnalysis {
  id: string;
  title: string;
  call_date: string;
  duration: number; // in seconds
  contact_id?: string;
  practice_id?: string;
  recording_url?: string;
  transcript?: string;
  summary?: string;
  sentiment_score?: number; // -1 to 1, negative to positive
  linguistics_analysis_id?: string; // Reference to linguistics module analysis
  tags?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields for mock data
  key_topics?: string[];
  action_items?: string[];
  buying_signals?: string[];
  objections?: string[];
  next_steps?: string[];
}

interface LinguisticsAnalysis {
  id: string;
  call_id: string;
  analysis_date: string;
  sentiment_score: number;
  key_topics: string[];
  buying_signals: string[];
  objections: string[];
  action_items: string[];
  next_steps: string[];
  summary: string;
  created_at: string;
  updated_at: string;
}

interface SalesActivity {
  id: string;
  user_id: string;
  contact_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  date: string;
  duration?: number;
  notes?: string;
  outcome?: string;
  created_at: string;
  updated_at: string;
}

// Store for consistent mock data
let mockDataStore: any = null;

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random date within the last n days as ISO string
const getRandomDate = (daysBack: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  return date.toISOString();
};

// Generate a random percentage change (-15% to +25%)
const getRandomPercentageChange = (min: number = -15, max: number = 25): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

// Generate a list of random contacts for dental and aesthetic industries across the country
export const generateMockContacts = (count: number = 20): Contact[] => {
  const titles = ['Dr.', 'Dr.', 'Dr.', 'Ms.', 'Mr.'];
  
  const firstNames = [
    'Sarah', 'John', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer', 
    'William', 'Linda', 'James', 'Patricia', 'Thomas', 'Elizabeth', 'Daniel',
    'Maria', 'Carlos', 'Sofia', 'Aiden', 'Olivia', 'Noah', 'Emma', 'Liam', 'Ava',
    'Raj', 'Priya', 'Wei', 'Ming', 'Kenji', 'Yuki', 'Andre', 'Zoe'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 
    'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris',
    'Garcia', 'Rodriguez', 'Martinez', 'Lee', 'Nguyen', 'Kim', 'Chen', 'Wang', 'Singh',
    'Patel', 'Gupta', 'Yamamoto', 'Tanaka', 'Dubois', 'Rossi', 'Muller', 'Ivanov'
  ];
  
  // Expanded roles for both dental and aesthetic industries
  const dentalRoles = [
    'Dentist', 'Orthodontist', 'Dental Surgeon', 'Office Manager', 'Receptionist', 
    'Dental Assistant', 'Hygienist', 'Practice Owner', 'Periodontist', 'Endodontist',
    'Pediatric Dentist', 'Prosthodontist', 'Oral Pathologist', 'Dental Anesthesiologist'
  ];
  
  const aestheticRoles = [
    'Aesthetic Physician', 'Cosmetic Surgeon', 'Dermatologist', 'Esthetician', 
    'Clinic Manager', 'Medical Director', 'Nurse Practitioner', 'Physician Assistant',
    'Laser Specialist', 'Cosmetic Nurse', 'Medical Aesthetician', 'Spa Director',
    'Plastic Surgeon', 'Cosmetic Dentist', 'Practice Owner'
  ];
  
  // Expanded specialties for both industries
  const dentalSpecialties = [
    'General Dentistry', 'Orthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 
    'Oral Surgery', 'Periodontics', 'Endodontics', 'Prosthodontics', 'Implantology',
    'TMJ Treatment', 'Sleep Dentistry', 'Geriatric Dentistry', 'Forensic Dentistry',
    'Digital Dentistry', 'Laser Dentistry', 'Holistic Dentistry'
  ];
  
  const aestheticSpecialties = [
    'Facial Rejuvenation', 'Body Contouring', 'Injectables', 'Laser Treatments', 
    'Medical Skincare', 'Hair Restoration', 'Non-Surgical Procedures', 'Plastic Surgery',
    'Aesthetic Dermatology', 'Cosmetic Tattooing', 'Wellness Therapy', 'Anti-Aging',
    'Scar Revision', 'Vein Treatment', 'Medical Weight Loss'
  ];
  
  const practiceTypes = ['dental', 'aesthetic'] as const;
  
  // Expanded practice names for both industries
  const dentalPracticeNames = [
    'Bright Smile Dental', 'Perfect Teeth Orthodontics', 'City Dental Care', 
    'Family Dental Center', 'Advanced Dental Solutions', 'Parkview Dental', 
    'Riverside Orthodontics', 'Sunshine Dental Group', 'Elite Dental Associates',
    'Modern Dental Care', 'Premier Dental Clinic', 'Gentle Dental', 
    'Smiles Forever Dental', 'Precision Dental Specialists', 'Comfort Dental Arts',
    'Dental Excellence Center', 'Healthy Smiles Dentistry', 'Innovative Dental Care',
    'Lifetime Dental Wellness', 'Apex Dental Specialists'
  ];
  
  const aestheticPracticeNames = [
    'Radiance Aesthetic Clinic', 'Timeless Beauty Med Spa', 'Glow Aesthetics', 
    'Rejuvenate Medical Spa', 'Elite Cosmetic Center', 'Pure Aesthetics', 
    'Luminous Skin Solutions', 'Allure Beauty Clinic', 'Revive Aesthetic Institute',
    'Elegance Medical Aesthetics', 'Serenity Medspa', 'Ageless Beauty Center', 
    'Contour Aesthetic Clinic', 'Flawless Skin Institute', 'Refresh Aesthetic Solutions',
    'Harmony Medical Aesthetics', 'Radiant Skin Clinic', 'Sculpt Body & Face',
    'Luxe Aesthetic Lounge', 'Transcend Beauty Medical'
  ];
  
  // Major cities across the US for geographic diversity
  const locations = [
    { city: 'New York', state: 'NY' },
    { city: 'Los Angeles', state: 'CA' },
    { city: 'Chicago', state: 'IL' },
    { city: 'Houston', state: 'TX' },
    { city: 'Phoenix', state: 'AZ' },
    { city: 'Philadelphia', state: 'PA' },
    { city: 'San Antonio', state: 'TX' },
    { city: 'San Diego', state: 'CA' },
    { city: 'Dallas', state: 'TX' },
    { city: 'San Jose', state: 'CA' },
    { city: 'Austin', state: 'TX' },
    { city: 'Jacksonville', state: 'FL' },
    { city: 'Fort Worth', state: 'TX' },
    { city: 'Columbus', state: 'OH' },
    { city: 'Charlotte', state: 'NC' },
    { city: 'San Francisco', state: 'CA' },
    { city: 'Indianapolis', state: 'IN' },
    { city: 'Seattle', state: 'WA' },
    { city: 'Denver', state: 'CO' },
    { city: 'Boston', state: 'MA' },
    { city: 'Nashville', state: 'TN' },
    { city: 'Miami', state: 'FL' },
    { city: 'Atlanta', state: 'GA' },
    { city: 'Las Vegas', state: 'NV' }
  ];
  
  // Create 20 diverse contacts
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    
    // Determine practice type (dental or aesthetic)
    const practiceType = practiceTypes[getRandomInt(0, practiceTypes.length - 1)];
    
    // Choose appropriate role and specialty based on practice type
    const role = practiceType === 'dental' 
      ? dentalRoles[getRandomInt(0, dentalRoles.length - 1)]
      : aestheticRoles[getRandomInt(0, aestheticRoles.length - 1)];
    
    // Get a detailed specialty for notes/display purposes
    const specialtyDetail = practiceType === 'dental'
      ? dentalSpecialties[getRandomInt(0, dentalSpecialties.length - 1)]
      : aestheticSpecialties[getRandomInt(0, aestheticSpecialties.length - 1)];
      
    // Use proper specialization type for Contact interface
    const specialization = practiceType as 'dental' | 'aesthetic' | 'both' | 'other';
    
    // Choose practice name based on type
    const practiceNames = practiceType === 'dental' ? dentalPracticeNames : aestheticPracticeNames;
    const practiceId = `practice-${getRandomInt(1, 20)}`;
    const practiceIndex = parseInt(practiceId.split('-')[1]) - 1;
    const practiceName = practiceNames[practiceIndex % practiceNames.length];
    
    // Choose random location
    const location = locations[getRandomInt(0, locations.length - 1)];
    
    // Generate appropriate notes based on industry
    let notes = '';
    if (practiceType === 'dental') {
      notes = `${firstName} is a ${role} specializing in ${specialtyDetail}. `;
      notes += [
        'Interested in digital scanning technology.',
        'Looking to expand practice with additional chair.',
        'Recently upgraded to 3D imaging system.',
        'Considering adding cosmetic services.',
        'Planning to join a DSO in the next year.',
        'Interested in patient financing options.',
        'Recently renovated office space.'
      ][getRandomInt(0, 6)];
    } else {
      notes = `${firstName} is a ${role} specializing in ${specialtyDetail}. `;
      notes += [
        'Interested in new injectable products.',
        'Looking to add body contouring services.',
        'Recently added medical-grade skincare line.',
        'Considering expansion to second location.',
        'Interested in staff training for new laser system.',
        'Planning marketing campaign for summer services.',
        'Recently completed certification in advanced techniques.'
      ][getRandomInt(0, 6)];
    }
    
    // Add location context to notes
    notes += ` Based in ${location.city}, ${location.state}.`;
    
    // Define possible statuses as the required string literals
    const statuses: Array<'active' | 'inactive' | 'lead' | 'prospect' | 'customer' | 'do_not_contact'> = 
      ['active', 'inactive', 'lead', 'prospect', 'customer', 'do_not_contact'];
    
    return {
      id: `contact-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${practiceName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      title: role,
      practice_id: practiceId,
      practice_name: practiceName,
      specialization: specialization,
      // Store practiceType as a tag for reference
      tags: Array.from({ length: getRandomInt(1, 4) }, () => 
        ['VIP', 'New', 'Follow-up', 'Potential', 'Key Decision Maker', 'Influencer', 
         'Tech Adopter', 'Budget Conscious', 'Growth Focused', location.state, practiceType][getRandomInt(0, 10)]
      ),
      is_starred: Math.random() > 0.7, // 30% chance of being starred
      last_contacted: getRandomDate(30),
      notes,
      created_at: getRandomDate(365),
      updated_at: getRandomDate(30),
      status: statuses[getRandomInt(0, statuses.length - 1)], // Add required status field
    };
  });
};

// Generate recent contacts specifically for Quick Call widget
export const generateRecentCallContacts = (count: number = 5): Contact[] => {
  // High-priority contacts with recent interactions
  const recentContacts = [
    {
      id: 'quick-call-1',
      first_name: 'Dr. Sarah',
      last_name: 'Chen',
      email: 'sarah.chen@brightsmiledental.com',
      phone: '(212) 555-0142',
      title: 'Practice Owner',
      practice_id: 'practice-1',
      practice_name: 'Bright Smile Dental NYC',
      specialization: 'dental' as const,
      tags: ['VIP', 'Key Decision Maker', 'High Volume'],
      is_starred: true,
      last_contacted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      notes: 'Interested in bulk order of implant systems. Follow up on pricing discussion.',
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'customer' as const
    },
    {
      id: 'quick-call-2',
      first_name: 'Dr. Michael',
      last_name: 'Rodriguez',
      email: 'michael.rodriguez@radianceaesthetics.com',
      phone: '(310) 555-0198',
      title: 'Medical Director',
      practice_id: 'practice-2',
      practice_name: 'Radiance Aesthetic Clinic',
      specialization: 'aesthetic' as const,
      tags: ['Hot Lead', 'Expansion Plans', 'Decision This Week'],
      is_starred: true,
      last_contacted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      notes: 'Demo scheduled for new laser system. Budget approved. Decision by Friday.',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'lead' as const
    },
    {
      id: 'quick-call-3',
      first_name: 'Jennifer',
      last_name: 'Thompson',
      email: 'jennifer.thompson@elitecosmeticcenter.com',
      phone: '(469) 555-0177',
      title: 'Clinic Manager',
      practice_id: 'practice-3',
      practice_name: 'Elite Cosmetic Center Dallas',
      specialization: 'aesthetic' as const,
      tags: ['Follow-up Required', 'Contract Renewal'],
      is_starred: false,
      last_contacted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      notes: 'Contract renewal discussion. Wants better pricing on dermal fillers.',
      created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'customer' as const
    },
    {
      id: 'quick-call-4',
      first_name: 'Dr. James',
      last_name: 'Patel',
      email: 'james.patel@moderndentalcare.com',
      phone: '(415) 555-0156',
      title: 'Lead Orthodontist',
      practice_id: 'practice-4',
      practice_name: 'Modern Dental Care SF',
      specialization: 'dental' as const,
      tags: ['New Contact', 'Referral', 'High Potential'],
      is_starred: false,
      last_contacted: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      notes: 'Referred by Dr. Chen. Looking for Invisalign supplies. Very interested.',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'prospect' as const
    },
    {
      id: 'quick-call-5',
      first_name: 'Lisa',
      last_name: 'Anderson',
      email: 'lisa.anderson@glowmedspa.com',
      phone: '(713) 555-0189',
      title: 'Spa Director',
      practice_id: 'practice-5',
      practice_name: 'Glow Med Spa Houston',
      specialization: 'aesthetic' as const,
      tags: ['Support Call', 'Training Request'],
      is_starred: false,
      last_contacted: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      notes: 'Needs training on new microneedling device. Schedule for next week.',
      created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'customer' as const
    }
  ];

  // Return only the requested number of contacts
  return recentContacts.slice(0, count);
};

// Generate a list of random practices across the country for dental and aesthetic industries
export const generateMockPractices = (count: number = 20): Practice[] => {
  // Expanded practice names for both industries
  const dentalPracticeNames = [
    'Bright Smile Dental', 'Perfect Teeth Orthodontics', 'City Dental Care', 
    'Family Dental Center', 'Advanced Dental Solutions', 'Parkview Dental', 
    'Riverside Orthodontics', 'Sunshine Dental Group', 'Elite Dental Associates',
    'Modern Dental Care', 'Premier Dental Clinic', 'Gentle Dental', 
    'Smiles Forever Dental', 'Precision Dental Specialists', 'Comfort Dental Arts',
    'Dental Excellence Center', 'Healthy Smiles Dentistry', 'Innovative Dental Care',
    'Lifetime Dental Wellness', 'Apex Dental Specialists'
  ];
  
  const aestheticPracticeNames = [
    'Radiance Aesthetic Clinic', 'Timeless Beauty Med Spa', 'Glow Aesthetics', 
    'Rejuvenate Medical Spa', 'Elite Cosmetic Center', 'Pure Aesthetics', 
    'Luminous Skin Solutions', 'Allure Beauty Clinic', 'Revive Aesthetic Institute',
    'Elegance Medical Aesthetics', 'Serenity Medspa', 'Ageless Beauty Center', 
    'Contour Aesthetic Clinic', 'Flawless Skin Institute', 'Refresh Aesthetic Solutions',
    'Harmony Medical Aesthetics', 'Radiant Skin Clinic', 'Sculpt Body & Face',
    'Luxe Aesthetic Lounge', 'Transcend Beauty Medical'
  ];
  
  // Major cities across the US for geographic diversity
  const locations = [
    { city: 'New York', state: 'NY', zipPrefix: '10' },
    { city: 'Los Angeles', state: 'CA', zipPrefix: '90' },
    { city: 'Chicago', state: 'IL', zipPrefix: '60' },
    { city: 'Houston', state: 'TX', zipPrefix: '77' },
    { city: 'Phoenix', state: 'AZ', zipPrefix: '85' },
    { city: 'Philadelphia', state: 'PA', zipPrefix: '19' },
    { city: 'San Antonio', state: 'TX', zipPrefix: '78' },
    { city: 'San Diego', state: 'CA', zipPrefix: '92' },
    { city: 'Dallas', state: 'TX', zipPrefix: '75' },
    { city: 'San Jose', state: 'CA', zipPrefix: '95' },
    { city: 'Austin', state: 'TX', zipPrefix: '73' },
    { city: 'Jacksonville', state: 'FL', zipPrefix: '32' },
    { city: 'Fort Worth', state: 'TX', zipPrefix: '76' },
    { city: 'Columbus', state: 'OH', zipPrefix: '43' },
    { city: 'Charlotte', state: 'NC', zipPrefix: '28' },
    { city: 'San Francisco', state: 'CA', zipPrefix: '94' },
    { city: 'Indianapolis', state: 'IN', zipPrefix: '46' },
    { city: 'Seattle', state: 'WA', zipPrefix: '98' },
    { city: 'Denver', state: 'CO', zipPrefix: '80' },
    { city: 'Boston', state: 'MA', zipPrefix: '02' }
  ];
  
  // Street names for more realistic addresses
  const streetNames = [
    'Main', 'Broadway', 'Park', 'Oak', 'Pine', 'Maple', 'Cedar', 'Elm', 
    'Washington', 'Lincoln', 'Jefferson', 'Madison', 'Highland', 'Sunset', 
    'Willow', 'Lake', 'Hill', 'River', 'Valley', 'Forest', 'Meadow'
  ];
  
  const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Rd', 'Way', 'Pkwy', 'Pl'];
  
  // Expanded specialties for both industries
  const dentalSpecialties = [
    'General Dentistry', 'Orthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 
    'Oral Surgery', 'Periodontics', 'Endodontics', 'Prosthodontics', 'Implantology',
    'TMJ Treatment', 'Sleep Dentistry', 'Geriatric Dentistry', 'Forensic Dentistry',
    'Digital Dentistry', 'Laser Dentistry', 'Holistic Dentistry'
  ];
  
  const aestheticSpecialties = [
    'Facial Rejuvenation', 'Body Contouring', 'Injectables', 'Laser Treatments', 
    'Medical Skincare', 'Hair Restoration', 'Non-Surgical Procedures', 'Plastic Surgery',
    'Aesthetic Dermatology', 'Cosmetic Tattooing', 'Wellness Therapy', 'Anti-Aging',
    'Scar Revision', 'Vein Treatment', 'Medical Weight Loss'
  ];
  
  // Expanded technologies for both industries
  const dentalTechnologies = [
    'Digital X-rays', 'CAD/CAM', 'Intraoral Cameras', 'Laser Dentistry', '3D Printing', 
    'CEREC', 'Invisalign', 'Digital Impressions', 'Cone Beam CT', 'Dental Microscopes',
    'Air Abrasion', 'Digital Smile Design', 'Soft Tissue Lasers', 'Hard Tissue Lasers',
    'Caries Detection Technology', 'Digital Treatment Planning'
  ];
  
  const aestheticTechnologies = [
    'RF Microneedling', 'Laser Skin Resurfacing', 'CoolSculpting', 'Ultherapy', 
    'IPL Therapy', 'HIFU Technology', 'Cryolipolysis', 'PRP Therapy', 'LED Light Therapy',
    'Hydrafacial', 'Dermapen', 'Fractional Laser', 'Morpheus8', 'EmSculpt', 
    'Plasma Pen', 'Oxygen Therapy'
  ];
  
  // Expanded procedures for both industries
  const dentalProcedures = [
    'Dental Implants', 'Root Canal', 'Teeth Whitening', 'Veneers', 'Crowns', 
    'Bridges', 'Dentures', 'Extractions', 'Dental Bonding', 'Inlays and Onlays',
    'Gum Grafting', 'Wisdom Teeth Removal', 'Dental Sealants', 'Fluoride Treatment',
    'Smile Makeover', 'Full Mouth Reconstruction'
  ];
  
  const aestheticProcedures = [
    'Botox', 'Dermal Fillers', 'Chemical Peels', 'Microdermabrasion', 'Laser Hair Removal', 
    'Lip Augmentation', 'Non-Surgical Rhinoplasty', 'Kybella', 'Thread Lifts', 'Microblading',
    'Permanent Makeup', 'Fat Transfer', 'Cellulite Treatment', 'Scar Revision', 
    'Skin Tightening', 'Acne Treatment'
  ];
  
  const practiceTypes = ['dental', 'aesthetic'] as const;
  const practiceSizes = ['small', 'medium', 'large'] as const;
  
  return Array.from({ length: count }, (_, i) => {
    // Determine practice type (dental or aesthetic)
    const type = practiceTypes[i % 2]; // Alternate between dental and aesthetic
    
    // Choose appropriate practice name based on type
    const practiceNames = type === 'dental' ? dentalPracticeNames : aestheticPracticeNames;
    const name = practiceNames[i % practiceNames.length];
    
    // Choose random location
    const location = locations[i % locations.length];
    
    // Determine practice size
    const size = practiceSizes[getRandomInt(0, practiceSizes.length - 1)];
    const numPractitioners = size === 'small' ? getRandomInt(1, 3) : 
                            size === 'medium' ? getRandomInt(4, 10) : 
                            getRandomInt(11, 30);
    
    // Choose appropriate specialties, technologies, and procedures based on practice type
    const specialties = type === 'dental' ? dentalSpecialties : aestheticSpecialties;
    const technologies = type === 'dental' ? dentalTechnologies : aestheticTechnologies;
    const procedures = type === 'dental' ? dentalProcedures : aestheticProcedures;
    
    // Generate random arrays of specialties, technologies, and procedures
    const practiceSpecialties = Array.from(
      { length: getRandomInt(2, 4) }, 
      () => specialties[getRandomInt(0, specialties.length - 1)]
    );
    
    const practiceTechnologies = Array.from(
      { length: getRandomInt(3, 6) }, 
      () => technologies[getRandomInt(0, technologies.length - 1)]
    );
    
    const practiceProcedures = Array.from(
      { length: getRandomInt(4, 8) }, 
      () => procedures[getRandomInt(0, procedures.length - 1)]
    );
    
    // Generate detailed notes based on practice type
    let notes = '';
    if (type === 'dental') {
      notes = `${name} is a ${size} ${practiceSpecialties.join(', ')} practice with ${numPractitioners} practitioners. `;
      notes += [
        `They specialize in ${practiceSpecialties[0]} and are known for their expertise in ${practiceProcedures[0]}.`,
        `Recently invested in ${practiceTechnologies[0]} technology to enhance patient experience.`,
        `Looking to expand their services to include more ${practiceSpecialties[1]} procedures.`,
        `Considering joining a DSO in the next fiscal year.`,
        `Planning to open a satellite location in neighboring community.`,
        `Recently renovated their facility with state-of-the-art equipment.`,
        `Known for their excellent patient care and community involvement.`
      ][getRandomInt(0, 6)];
    } else {
      notes = `${name} is a ${size} aesthetic clinic specializing in ${practiceSpecialties.join(', ')}. `;
      notes += [
        `They are known for their innovative approach to ${practiceProcedures[0]}.`,
        `Recently added ${practiceTechnologies[0]} to their service offerings.`,
        `Planning a marketing campaign to promote their ${practiceSpecialties[0]} services.`,
        `Looking to expand their client base in the ${location.city} area.`,
        `Considering adding medical director to oversee expanding services.`,
        `Recently completed staff training for new ${practiceTechnologies[1]} system.`,
        `Known for their celebrity clientele and luxury experience.`
      ][getRandomInt(0, 6)];
    }
    
    return {
      id: `practice-${i + 1}`,
      name,
      address: `${getRandomInt(100, 9999)} ${streetNames[getRandomInt(0, streetNames.length - 1)]} ${streetTypes[getRandomInt(0, streetTypes.length - 1)]}`,
      city: location.city,
      state: location.state,
      zipCode: `${location.zipPrefix}${getRandomInt(100, 999)}`,
      phone: `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      email: `info@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      type,
      size,
      isDSO: Math.random() > 0.7, // 30% chance of being a DSO
      numPractitioners,
      specialties: practiceSpecialties,
      technologies: practiceTechnologies,
      procedures: practiceProcedures,
      notes,
      lastContactDate: getRandomDate(30),
      createdAt: getRandomDate(365),
      updatedAt: getRandomDate(30),
    };
  });
};

// Generate dashboard statistics
export const generateDashboardStats = () => {
  // Generate random stats with realistic values
  const totalContacts = getRandomInt(1200, 1400);
  const activePractices = getRandomInt(330, 370);
  const salesGoal = 1300000; // $1.3M
  
  // Generate revenue based on a specific progress percentage
  const salesGoalProgress = getRandomInt(60, 75); // This will be used for both quota and sales goal
  const currentRevenue = Math.round((salesGoal * salesGoalProgress) / 100); // Calculate revenue from progress
  const revenueGenerated = currentRevenue; // Keep them in sync
  
  const activeCampaigns = getRandomInt(20, 30);
  
  // Generate percentage changes
  const contactsChange = getRandomPercentageChange(5, 20); // Positive trend for contacts
  const practicesChange = getRandomPercentageChange(3, 15); // Positive trend for practices
  const revenueChange = getRandomPercentageChange(-10, 10); // Mixed trend for revenue
  const campaignsChange = getRandomPercentageChange(10, 25); // Strong positive trend for campaigns
  
  return {
    totalContacts,
    contactsChange,
    activePractices,
    practicesChange,
    revenueGenerated,
    revenueChange,
    activeCampaigns,
    campaignsChange,
    salesGoalProgress,
    currentRevenue,
    salesGoal
  };
};

// Generate recent activities from real contact data
export const generateRecentActivitiesFromContacts = async (contacts: any[], count: number = 5) => {
  if (!contacts || contacts.length === 0) {
    return generateRecentActivities(count); // Fallback to mock data
  }
  
  const realActivities = [];
  
  // Look for specific clients mentioned by user
  const gregPedro = contacts.find(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes('greg pedro') ||
    c.notes?.toLowerCase().includes('greg pedro')
  );
  
  const emmanuel = contacts.find(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes('emmanuel') ||
    c.notes?.toLowerCase().includes('emmanuel')
  );
  
  // Generate activities for Greg Pedro ($6000/month minimum fee client)
  if (gregPedro) {
    realActivities.push({
      id: 'activity-greg-1',
      type: 'Contract executed',
      description: `Management Services Agreement signed with ${gregPedro.first_name} ${gregPedro.last_name} - $6k minimum monthly fee`,
      timeAgo: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'high',
      revenue: 6000
    });
    
    realActivities.push({
      id: 'activity-greg-2',
      type: 'Contract milestone',
      description: `${gregPedro.first_name} ${gregPedro.last_name} - Implementation fee ($6,000) processed`,
      timeAgo: '6 hours ago',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      priority: 'high',
      revenue: 6000
    });
    
    realActivities.push({
      id: 'activity-greg-3',
      type: 'Strategy session',
      description: `${gregPedro.first_name} ${gregPedro.last_name} - Website consolidation strategy meeting`,
      timeAgo: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      priority: 'high',
      revenue: 0
    });
  }
  
  // Generate activities for Emmanuel
  if (emmanuel) {
    realActivities.push({
      id: 'activity-emmanuel-1',
      type: 'Call scheduled',
      description: `Follow-up call scheduled with ${emmanuel.first_name} ${emmanuel.last_name}`,
      timeAgo: '4 hours ago',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium',
      revenue: 0
    });
    
    realActivities.push({
      id: 'activity-emmanuel-2',
      type: 'Proposal sent',
      description: `Service proposal delivered to ${emmanuel.first_name} ${emmanuel.last_name}`,
      timeAgo: '3 days ago',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      revenue: 0
    });
  }
  
  // Generate activities for other contacts based on their status and recent updates
  const recentContacts = contacts
    .filter(c => c.updated_at && new Date(c.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, count - realActivities.length);
  
  recentContacts.forEach((contact, i) => {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(contact.updated_at).getTime()) / (24 * 60 * 60 * 1000));
    const activityTypes = ['Contact updated', 'Email sent', 'Call completed', 'Notes added'];
    const activityType = activityTypes[i % activityTypes.length];
    
    realActivities.push({
      id: `activity-real-${i + 1}`,
      type: activityType,
      description: `${contact.first_name} ${contact.last_name} - ${contact.specialty || 'Healthcare Professional'}`,
      timeAgo: daysSinceUpdate === 0 ? 'Today' : `${daysSinceUpdate} day${daysSinceUpdate === 1 ? '' : 's'} ago`,
      timestamp: new Date(contact.updated_at),
      priority: contact.status === 'customer' ? 'high' : 'medium',
      revenue: 0
    });
  });
  
  // Sort by timestamp (most recent first) and return requested count
  return realActivities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, count);
};

// Generate recent activities (fallback to mock data)
export const generateRecentActivities = (count: number = 5) => {
  const activityTypes = [
    'New contact added',
    'New practice added',
    'Contact updated',
    'Practice updated',
    'Call scheduled',
    'Meeting completed',
    'Email sent',
    'Contract signed'
  ];
  
  const contacts = generateMockContacts(10);
  
  return Array.from({ length: count }, (_, i) => {
    const activityType = activityTypes[getRandomInt(0, activityTypes.length - 1)];
    const contact = contacts[getRandomInt(0, contacts.length - 1)];
    const hoursAgo = getRandomInt(1, 24);
    
    let description = '';
    
    switch (activityType) {
      case 'New contact added':
      case 'Contact updated':
        description = `Dr. ${contact.first_name} ${contact.last_name} to contacts`;
        break;
      case 'New practice added':
      case 'Practice updated':
        description = `${generateMockPractices(1)[0].name} to practices`;
        break;
      case 'Call scheduled':
      case 'Meeting completed':
        description = `with Dr. ${contact.first_name} ${contact.last_name}`;
        break;
      case 'Email sent':
        description = `to Dr. ${contact.first_name} ${contact.last_name}`;
        break;
      case 'Contract signed':
        description = `with ${generateMockPractices(1)[0].name}`;
        break;
    }
    
    return {
      id: `activity-${i + 1}`,
      type: activityType,
      description,
      timeAgo: `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`,
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
    };
  });
};

// Generate upcoming tasks from real contact data
export const generateUpcomingTasksFromContacts = async (contacts: any[], count: number = 5) => {
  if (!contacts || contacts.length === 0) {
    return generateUpcomingTasks(count); // Fallback to mock data
  }
  
  const realTasks = [];
  
  // Look for specific clients mentioned by user
  const gregPedro = contacts.find(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes('greg pedro') ||
    c.notes?.toLowerCase().includes('greg pedro')
  );
  
  const emmanuel = contacts.find(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes('emmanuel') ||
    c.notes?.toLowerCase().includes('emmanuel')
  );
  
  // Generate high-priority tasks for Greg Pedro ($6000/month minimum fee client)
  if (gregPedro) {
    realTasks.push({
      id: 'task-greg-1',
      type: 'Contract implementation',
      description: `${gregPedro.first_name} ${gregPedro.last_name} - Begin website platform migration`,
      dueDate: 'Today',
      priority: 'High',
      revenue: 6000,
      contact: gregPedro
    });
    
    realTasks.push({
      id: 'task-greg-2',
      type: 'Performance review',
      description: `${gregPedro.first_name} ${gregPedro.last_name} - Monthly performance reporting`,
      dueDate: 'Tomorrow',
      priority: 'High',
      revenue: 0,
      contact: gregPedro
    });
    
    realTasks.push({
      id: 'task-greg-3',
      type: 'Service delivery',
      description: `${gregPedro.first_name} ${gregPedro.last_name} - Set up AI booking system`,
      dueDate: 'Next week',
      priority: 'High',
      revenue: 0,
      contact: gregPedro
    });
  }
  
  // Generate tasks for Emmanuel
  if (emmanuel) {
    realTasks.push({
      id: 'task-emmanuel-1',
      type: 'Follow up call',
      description: `${emmanuel.first_name} ${emmanuel.last_name} - Follow up on proposal`,
      dueDate: 'Today',
      priority: 'High',
      revenue: 0,
      contact: emmanuel
    });
    
    realTasks.push({
      id: 'task-emmanuel-2',
      type: 'Send additional info',
      description: `${emmanuel.first_name} ${emmanuel.last_name} - Send case studies and references`,
      dueDate: 'In 2 days',
      priority: 'Medium',
      revenue: 0,
      contact: emmanuel
    });
  }
  
  // Generate tasks for prospects and leads
  const prospects = contacts.filter(c => 
    c.status === 'prospect' || c.status === 'lead'
  ).slice(0, count - realTasks.length);
  
  prospects.forEach((contact, i) => {
    const taskTypes = [
      'Follow up call',
      'Send proposal',
      'Schedule demo',
      'Send follow-up email',
      'Prepare presentation'
    ];
    
    const dueDates = ['Today', 'Tomorrow', 'In 2 days', 'Next week'];
    const taskType = taskTypes[i % taskTypes.length];
    const dueDate = dueDates[i % dueDates.length];
    
    realTasks.push({
      id: `task-prospect-${i + 1}`,
      type: taskType,
      description: `${contact.first_name} ${contact.last_name} - ${taskType.toLowerCase()}`,
      dueDate,
      priority: contact.status === 'lead' ? 'High' : 'Medium',
      revenue: 0,
      contact: contact
    });
  });
  
  // Sort by priority (High first) and return requested count
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  return realTasks
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, count);
};

// Generate upcoming tasks (fallback to mock data)
export const generateUpcomingTasks = (count: number = 5) => {
  const taskTypes = [
    'Follow up with client',
    'Call about new product line',
    'Send proposal',
    'Schedule meeting',
    'Review contract',
    'Prepare presentation',
    'Check inventory'
  ];
  
  const contacts = generateMockContacts(10);
  const dueDates = ['Today', 'Tomorrow', 'In 2 days', 'Next week', 'In 2 weeks'];
  
  return Array.from({ length: count }, (_, i) => {
    const taskType = taskTypes[getRandomInt(0, taskTypes.length - 1)];
    const contact = contacts[getRandomInt(0, contacts.length - 1)];
    const dueDate = dueDates[getRandomInt(0, dueDates.length - 1)];
    
    return {
      id: `task-${i + 1}`,
      type: taskType,
      description: `Dr. ${contact.last_name} about ${taskType.toLowerCase().includes('product') ? 'new product line' : 'recent inquiry'}`,
      dueDate,
      priority: ['High', 'Medium', 'Low'][getRandomInt(0, 2)]
    };
  });
};

// Main function to get all mock data for the dashboard
export const getMockDashboardData = () => {
  // Return cached data if available to ensure consistency
  if (mockDataStore) {
    return mockDataStore;
  }
  
  // Generate new data and cache it
  mockDataStore = {
    stats: generateDashboardStats(),
    recentActivities: generateRecentActivities(),
    upcomingTasks: generateUpcomingTasks()
  };
  
  // Clear cache after 5 minutes to allow for some variation
  setTimeout(() => {
    mockDataStore = null;
  }, 5 * 60 * 1000);
  
  return mockDataStore;
};

// Generate mock call analyses
export const generateMockCallAnalyses = (count: number = 10): CallAnalysis[] => {
  const analyses: CallAnalysis[] = [];
  
  // Generate mock contacts first to reference their IDs
  const mockContacts = generateMockContacts(15);
  
  for (let i = 0; i < count; i++) {
    const contactIndex = getRandomInt(0, mockContacts.length - 1);
    const selectedContact = mockContacts[contactIndex];
    const contactId = selectedContact.id;
    
    // Create a call date within the last 30 days
    const callDate = getRandomDate(30);
    
    // Generate a random sentiment score between -1 and 1
    const sentimentScore = parseFloat((Math.random() * 2 - 1).toFixed(2));
    
    // Generate random key topics based on dental industry
    const allTopics = [
      'implants', 'veneers', 'whitening', 'invisalign', 'crowns', 'bridges',
      'dentures', 'root canal', 'extraction', 'cleaning', 'checkup', 'x-rays',
      'insurance', 'financing', 'emergency', 'pain', 'cosmetic', 'pediatric'
    ];
    
    // Randomly select 2-5 topics
    const topicCount = getRandomInt(2, 5);
    const keyTopics: string[] = [];
    for (let j = 0; j < topicCount; j++) {
      const randomTopic = allTopics[getRandomInt(0, allTopics.length - 1)];
      if (!keyTopics.includes(randomTopic)) {
        keyTopics.push(randomTopic);
      }
    }
    
    // Generate random buying signals
    const allBuyingSignals = [
      'asked about pricing', 'requested a demo', 'inquired about availability',
      'mentioned timeline', 'discussed budget', 'asked about implementation',
      'compared to competitors', 'mentioned decision maker', 'asked about warranty',
      'requested references', 'discussed ROI', 'mentioned urgent need'
    ];
    
    // Randomly select 0-3 buying signals
    const buyingSignalCount = getRandomInt(0, 3);
    const buyingSignals: string[] = [];
    for (let j = 0; j < buyingSignalCount; j++) {
      const randomSignal = allBuyingSignals[getRandomInt(0, allBuyingSignals.length - 1)];
      if (!buyingSignals.includes(randomSignal)) {
        buyingSignals.push(randomSignal);
      }
    }
    
    // Generate random objections
    const allObjections = [
      'price too high', 'need to consult partners', 'using competitor product',
      'not the right time', 'budget constraints', 'need more information',
      'concerned about training', 'worried about implementation', 'need approval'
    ];
    
    // Randomly select 0-2 objections
    const objectionCount = getRandomInt(0, 2);
    const objections: string[] = [];
    for (let j = 0; j < objectionCount; j++) {
      const randomObjection = allObjections[getRandomInt(0, allObjections.length - 1)];
      if (!objections.includes(randomObjection)) {
        objections.push(randomObjection);
      }
    }
    
    // Generate random action items
    const allActionItems = [
      'send follow-up email', 'schedule demo', 'provide pricing information',
      'send case studies', 'connect with decision maker', 'prepare proposal',
      'address objections', 'provide technical specifications', 'offer trial'
    ];
    
    // Randomly select 1-3 action items
    const actionItemCount = getRandomInt(1, 3);
    const actionItems: string[] = [];
    for (let j = 0; j < actionItemCount; j++) {
      const randomAction = allActionItems[getRandomInt(0, allActionItems.length - 1)];
      if (!actionItems.includes(randomAction)) {
        actionItems.push(randomAction);
      }
    }
    
    // Generate random next steps
    const allNextSteps = [
      'follow up in 3 days', 'schedule product demo', 'send proposal',
      'arrange meeting with team', 'provide additional information',
      'address specific concerns', 'offer special pricing', 'check back next quarter'
    ];
    
    // Randomly select 1-2 next steps
    const nextStepCount = getRandomInt(1, 2);
    const nextSteps: string[] = [];
    for (let j = 0; j < nextStepCount; j++) {
      const randomStep = allNextSteps[getRandomInt(0, allNextSteps.length - 1)];
      if (!nextSteps.includes(randomStep)) {
        nextSteps.push(randomStep);
      }
    }
    
    // Use the already referenced contact
    
    analyses.push({
      id: `call-${i}-${Date.now()}`,
      title: `Call with ${selectedContact.first_name} ${selectedContact.last_name} - ${new Date(callDate).toLocaleDateString()}`,
      call_date: callDate,
      duration: getRandomInt(60, 1800), // 1-30 minutes in seconds
      contact_id: contactId,
      practice_id: `practice-${getRandomInt(1, 10)}`,
      recording_url: `https://example.com/recordings/call-${i}.mp3`,
      transcript: `This is a mock transcript for call ${i}. It would contain the full conversation text.`,
      summary: `Mock summary of call with ${selectedContact.first_name} ${selectedContact.last_name} discussing ${keyTopics.join(', ')}.`,
      sentiment_score: sentimentScore,
      linguistics_analysis_id: `ling-analysis-${i}-${Date.now()}`,
      tags: [...keyTopics.slice(0, 2), sentimentScore > 0.3 ? 'positive' : sentimentScore < -0.3 ? 'negative' : 'neutral'],
      notes: `Mock notes for call ${i}. These would be manually added by the user.`,
      created_at: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      // Additional fields for mock data
      key_topics: keyTopics,
      action_items: actionItems,
      buying_signals: buyingSignals,
      objections: objections,
      next_steps: nextSteps
    });
  }
  
  return analyses;
};

// Generate mock linguistics analyses
export const generateMockLinguisticsAnalyses = (callAnalyses: CallAnalysis[]): LinguisticsAnalysis[] => {
  return callAnalyses.map(call => ({
    id: `ling-${call.id}`,
    call_id: call.id, // Use the call's ID since call_id doesn't exist
    analysis_date: new Date(new Date(call.call_date).getTime() + 1000 * 60 * 60).toISOString(), // 1 hour after call
    sentiment_score: call.sentiment_score || 0,
    key_topics: call.key_topics || [],
    buying_signals: call.buying_signals || [],
    objections: call.objections || [],
    action_items: call.action_items || [],
    next_steps: call.next_steps || [],
    summary: `This call with ${call.contact_id} lasted ${Math.floor(call.duration / 60)} minutes. ` +
             `The conversation focused on ${(call.key_topics || []).join(', ')}. ` +
             `The prospect showed interest by ${(call.buying_signals || []).join(', ')}. ` +
             `Some concerns raised were ${(call.objections || []).join(', ')}. ` +
             `Recommended next steps include ${(call.next_steps || []).join(', ')}.`,
    created_at: new Date(new Date(call.call_date).getTime() + 1000 * 60 * 70).toISOString(),
    updated_at: new Date().toISOString()
  }));
};

// Generate mock sales activities
export const generateMockSalesActivities = (count: number = 20): SalesActivity[] => {
  const activities: SalesActivity[] = [];
  const mockContacts = generateMockContacts(10);
  const activityTypes: Array<'call' | 'email' | 'meeting' | 'note' | 'task'> = ['call', 'email', 'meeting', 'note', 'task'];
  
  for (let i = 0; i < count; i++) {
    const contactIndex = getRandomInt(0, mockContacts.length - 1);
    const contact = mockContacts[contactIndex];
    const type = activityTypes[getRandomInt(0, activityTypes.length - 1)];
    
    let duration: number | undefined;
    if (type === 'call' || type === 'meeting') {
      duration = getRandomInt(5, 60); // 5-60 minutes
    }
    
    const date = getRandomDate(30); // Within the last 30 days
    
    activities.push({
      id: `activity-${i}-${Date.now()}`,
      user_id: `user-${getRandomInt(1, 5)}`,
      contact_id: contact.id,
      type,
      date,
      duration,
      notes: `Mock ${type} with ${contact.first_name} ${contact.last_name}`,
      outcome: type === 'call' || type === 'meeting' ? ['Positive', 'Neutral', 'Needs Follow-up'][getRandomInt(0, 2)] : undefined,
      created_at: date,
      updated_at: date
    });
  }
  
  return activities;
};

// Generate mock public contacts
export const generateMockPublicContacts = (count: number = 15): Contact[] => {
  // Reuse the existing contact generator but mark them as public
  const contacts = generateMockContacts(count);
  return contacts.map(contact => ({
    ...contact,
    is_public: true
  }));
};

// ---------- Research Module Mock Data ----------

export const generateMockResearchProjects = (
  count: number = 5,
  userId = mockUserId
): ResearchProject[] => {
  const statuses = Object.values(ResearchProjectStatus);
  return Array.from({ length: count }, (_, i) => {
    const created = getRandomDate(30);
    return {
      id: `project-${i + 1}`,
      title: `Sample Research Project ${i + 1}`,
      description: `Exploring market opportunities ${i + 1}`,
      status: statuses[getRandomInt(0, statuses.length - 1)] as ResearchProjectStatus,
      created_by: userId,
      tags: ['demo', 'sample'],
      priority: getRandomInt(1, 5),
      progress: getRandomInt(0, 100),
      created_at: created,
      updated_at: created
    } as ResearchProject;
  });
};

export const generateMockResearchDocuments = (
  projects: ResearchProject[],
  countPerProject = 2,
  userId = mockUserId
): ResearchDocument[] => {
  const types = Object.values(ResearchDocumentType);
  const docs: ResearchDocument[] = [];
  projects.forEach((project, pIndex) => {
    for (let i = 0; i < countPerProject; i++) {
      const created = getRandomDate(20);
      docs.push({
        id: `doc-${pIndex + 1}-${i + 1}`,
        project_id: project.id,
        title: `${project.title} Doc ${i + 1}`,
        content: `Sample content for document ${i + 1} of ${project.title}.`,
        document_type: types[getRandomInt(0, types.length - 1)] as ResearchDocumentType,
        created_by: userId,
        is_ai_generated: false,
        version: 1,
        tags: ['demo'],
        created_at: created,
        updated_at: created
      } as ResearchDocument);
    }
  });
  return docs;
};

export const generateMockResearchTasks = (
  projects: ResearchProject[],
  countPerProject = 3,
  userId = mockUserId
): ResearchTask[] => {
  const statuses = Object.values(ResearchTaskStatus);
  const tasks: ResearchTask[] = [];
  projects.forEach((project, pIndex) => {
    for (let i = 0; i < countPerProject; i++) {
      const created = getRandomDate(15);
      tasks.push({
        id: `task-${pIndex + 1}-${i + 1}`,
        project_id: project.id,
        title: `Task ${i + 1} for ${project.title}`,
        description: `Detailed task description ${i + 1}`,
        status: statuses[getRandomInt(0, statuses.length - 1)] as ResearchTaskStatus,
        assigned_to: userId,
        priority: getRandomInt(1, 5),
        created_at: created,
        updated_at: created
      } as ResearchTask);
    }
  });
  return tasks;
};

export const generateMockResearchPrompts = (
  count: number = 3,
  userId = mockUserId
): ResearchPrompt[] => {
  return Array.from({ length: count }, (_, i) => {
    const created = getRandomDate(40);
    return {
      id: `prompt-${i + 1}`,
      prompt_name: `Research Prompt ${i + 1}`,
      prompt_content: `Write a detailed analysis about topic ${i + 1}.`,
      description: 'Demo prompt',
      category: 'analysis',
      model_used: 'gpt-4',
      parameter_defaults: {},
      created_by: userId,
      usage_count: 0,
      tags: ['demo'],
      created_at: created,
      updated_at: created
    } as ResearchPrompt;
  });
};

export const generateMockResearchNotes = (
  projects: ResearchProject[],
  countPerProject = 1,
  userId = mockUserId
): ResearchNote[] => {
  const notes: ResearchNote[] = [];
  projects.forEach((project, pIndex) => {
    for (let i = 0; i < countPerProject; i++) {
      const created = getRandomDate(10);
      notes.push({
        id: `note-${pIndex + 1}-${i + 1}`,
        project_id: project.id,
        content: `Quick note ${i + 1} for ${project.title}.`,
        created_by: userId,
        tags: ['demo'],
        created_at: created,
        updated_at: created
      } as ResearchNote);
    }
  });
  return notes;
};

export const generateMockResearchDataQueries = (
  count: number = 2,
  userId = mockUserId
): ResearchDataQuery[] => {
  return Array.from({ length: count }, (_, i) => {
    const created = getRandomDate(25);
    return {
      id: `query-${i + 1}`,
      name: `Market Query ${i + 1}`,
      description: `Sample data query ${i + 1}`,
      query_type: 'sql',
      query_parameters: {},
      created_by: userId,
      is_public: false,
      created_at: created,
      updated_at: created
    } as ResearchDataQuery;
  });
};

// Generate a single mock call analysis
export const generateMockCallAnalysis = (): CallAnalysis => {
  // Ensure this function returns data matching the CallAnalysis interface,
  // especially 'title' and 'duration'.
  // generateMockCallAnalyses (plural) should be used if it's defined to return single items based on count.
  // For now, let's assume generateMockCallAnalyses(1)[0] is the intended way.
  const analyses = generateMockCallAnalyses(1); // This generateMockCallAnalyses is from THIS file.
  return analyses[0];
};

// Generate a single mock linguistics analysis
export const generateSingleMockLinguisticsAnalysis = (): LinguisticsAnalysis => {
  const callAnalysis = generateMockCallAnalysis(); // Uses the local single generator
  // generateMockLinguisticsAnalyses (plural) is from THIS file.
  const analyses = generateMockLinguisticsAnalyses([callAnalysis]); 
  return analyses[0];
};

const allLinguisticsData = generateMultipleMockLinguisticsAnalyses(50); 
const getLinguisticsAnalysis = () => allLinguisticsData;

// generateMultipleMockCallAnalysesWithLinguistics returns CallAnalysis[] compatible objects
// It already includes title and duration through its own generation logic.
const allCallAnalysisData = generateMultipleMockCallAnalysesWithLinguistics(50); 
const getCallAnalyses = () => allCallAnalysisData;

const originalGetData = (tableName: string) => {
  // Basic original GetData logic placeholder
  if (tableName === 'contacts') return generateMockContacts();
  if (tableName === 'practices') return generateMockPractices();
  return [];
};

const getData = (tableName: string) => {
  if (tableName === 'linguistics_analysis') {
    return getLinguisticsAnalysis();
  }
  if (tableName === 'call_analysis') {
    return getCallAnalyses();
  }
  return originalGetData(tableName);
};


// Export all mock data functions
const mockDataService = {
  getLinguisticsAnalysis, // Add this
  getCallAnalyses, // Add this
  getData, // Add this
  generateMockContacts,
  generateRecentCallContacts, // New function for Quick Call widget
  generateMockPractices,
  generateDashboardStats,
  generateRecentActivities,
  generateRecentActivitiesFromContacts, // New function for real activities
  generateUpcomingTasks,
  generateUpcomingTasksFromContacts, // New function for real tasks
  getMockDashboardData,
  generateMockCallAnalyses,
  generateMockLinguisticsAnalyses,
  generateMockSalesActivities,
  generateMockPublicContacts,
  generateMockCallAnalysis,
  generateSingleMockLinguisticsAnalysis, // Renamed
  generateMockResearchProjects,
  generateMockResearchDocuments,
  generateMockResearchTasks,
  generateMockResearchPrompts,
  generateMockResearchNotes,
  generateMockResearchDataQueries
};

export default mockDataService;

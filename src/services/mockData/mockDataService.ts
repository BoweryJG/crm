import { Contact } from '../../types/models';
import { Practice, PracticeSize } from '../../types/practices';

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
  const revenueGenerated = getRandomInt(800, 950) * 1000; // $800K to $950K
  const activeCampaigns = getRandomInt(20, 30);
  
  // Generate percentage changes
  const contactsChange = getRandomPercentageChange(5, 20); // Positive trend for contacts
  const practicesChange = getRandomPercentageChange(3, 15); // Positive trend for practices
  const revenueChange = getRandomPercentageChange(-10, 10); // Mixed trend for revenue
  const campaignsChange = getRandomPercentageChange(10, 25); // Strong positive trend for campaigns
  
  // Current progress toward sales goal
  const salesGoalProgress = getRandomInt(60, 75);
  const currentRevenue = revenueGenerated;
  const salesGoal = 1300000; // $1.3M
  
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

// Generate recent activities
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

// Generate upcoming tasks
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
  return {
    stats: generateDashboardStats(),
    recentActivities: generateRecentActivities(),
    upcomingTasks: generateUpcomingTasks()
  };
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

// Generate a single mock call analysis
export const generateMockCallAnalysis = (): CallAnalysis => {
  const analyses = generateMockCallAnalyses(1);
  return analyses[0];
};

// Generate a single mock linguistics analysis
export const generateMockLinguisticsAnalysis = (): LinguisticsAnalysis => {
  const callAnalysis = generateMockCallAnalysis();
  const analyses = generateMockLinguisticsAnalyses([callAnalysis]);
  return analyses[0];
};

// Export all mock data functions
const mockDataService = {
  generateMockContacts,
  generateMockPractices,
  generateDashboardStats,
  generateRecentActivities,
  generateUpcomingTasks,
  getMockDashboardData,
  generateMockCallAnalyses,
  generateMockLinguisticsAnalyses,
  generateMockSalesActivities,
  generateMockPublicContacts,
  generateMockCallAnalysis,
  generateMockLinguisticsAnalysis
};

export default mockDataService;
